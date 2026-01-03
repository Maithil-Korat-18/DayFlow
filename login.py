import random
import re
import bcrypt
from flask import Blueprint, request, jsonify, session
from db import get_db
from mail_utils import send_otp_email

auth = Blueprint("auth", __name__)

from datetime import datetime
def generate_employee_id(company_name, full_name, cursor):
    # ---- Company Code (OI from Odoo India) ----
    company_code = "".join(word[0] for word in company_name.split()).upper()

    # ---- Employee Name Code (JO + DO = JODO) ----
    name_parts = full_name.strip().split()
    first_name = name_parts[0]
    last_name = name_parts[-1] if len(name_parts) > 1 else name_parts[0]

    name_code = (first_name[:2] + last_name[:2]).upper()

    # ---- Year of Joining ----
    year = datetime.now().year

    # ---- Serial Number for the Year ----
    cursor.execute(
        """
        SELECT COUNT(*) FROM users
        WHERE YEAR(created_at) = %s
        """,
        (year,)
    )
    count = cursor.fetchone()[0] + 1
    serial = str(count).zfill(4)

    # ---- Final Employee ID ----
    return f"{company_code}{name_code}{year}{serial}"

# =====================================================
# VALIDATION FUNCTIONS
# =====================================================
def validate_email(email):
    """Validate email format"""
    if not email or not email.strip():
        return False, "Email is required"

    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        return False, "Invalid email format"

    return True, ""


def validate_phone(phone):
    """Validate phone number - must be exactly 10 digits"""
    if not phone or not phone.strip():
        return False, "Phone number is required"

    # Remove any spaces, dashes, parentheses
    cleaned = re.sub(r'[\s\-\(\)]', '', phone)

    # Check if it's exactly 10 digits
    if not re.match(r'^\d{10}$', cleaned):
        return False, "Phone number must be exactly 10 digits"

    # Check if it starts with 0 or 1 (invalid US phone numbers)
    if cleaned[0] in ['0', '1']:
        return False, "Phone number cannot start with 0 or 1"

    return True, cleaned


def validate_password(password):
    """Validate password strength"""
    if not password:
        return False, "Password is required"

    if len(password) < 8:
        return False, "Password must be at least 8 characters"

    if len(password) > 128:
        return False, "Password must be less than 128 characters"

    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"

    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"

    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"

    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
        return False, "Password must contain at least one special character"

    return True, ""


def validate_full_name(name):
    """Validate full name"""
    if not name or not name.strip():
        return False, "Full name is required"

    name = name.strip()

    if len(name) < 2:
        return False, "Name must be at least 2 characters"

    if len(name) > 100:
        return False, "Name must be less than 100 characters"

    # Allow letters, spaces, hyphens, apostrophes
    if not re.match(r"^[a-zA-Z\s\-']+$", name):
        return False, "Name can only contain letters, spaces, hyphens, and apostrophes"

    # Check for at least two parts (first and last name)

    return True, name


# =====================================================
# REGISTER
# =====================================================
@auth.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "No data received"}), 400
        conn = get_db()  # database connection
        cursor = conn.cursor()
        full_name = data.get("full_name", "").strip()
        phone = data.get("phone", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "")
        company_name = data.get("company_name", "")
        employee_id = generate_employee_id(company_name, full_name, cursor)

        # Validate full name
        valid, msg = validate_full_name(full_name)
        if not valid:
            return jsonify({"success": False, "message": msg}), 400

        # Validate phone
        valid, cleaned_phone = validate_phone(phone)
        if not valid:
            return jsonify({"success": False, "message": cleaned_phone}), 400
        phone = cleaned_phone

        # Validate email
        valid, msg = validate_email(email)
        if not valid:
            return jsonify({"success": False, "message": msg}), 400

        # Validate password
        valid, msg = validate_password(password)
        if not valid:
            return jsonify({"success": False, "message": msg}), 400


        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({
                "success": False,
                "message": "Email already registered. Please login."
            }), 409

        # Check if phone already exists
        cursor.execute("SELECT id FROM users WHERE phone=%s", (phone,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({
                "success": False,
                "message": "Phone number already registered."
            }), 409

        # Hash password
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Insert user
        cursor.execute("""
                    INSERT INTO users (employee_id,
                                       full_name,
                                       phone,
                                       email,
                                       password,
                                       company_name,
                                       is_verified)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (
                        employee_id,
                        full_name,
                        phone,
                        email,
                        hashed,
                        company_name,
                        1
                    ))

        conn.commit()
        user_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Registration successful",
            "user": {
                "id": user_id,
                "full_name": full_name,
                "email": email,
                "employee_id": employee_id
            }
        }), 201

    except Exception as e:
        print("REGISTER ERROR:", str(e))
        return jsonify({"success": False, "message": "Server error during registration"}), 500


# =====================================================
# LOGIN
# =====================================================
@auth.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({"success": False, "message": "No data received"}), 400

        email_or_phone = data.get("emailOrPhone", "").strip()
        password = data.get("password", "")

        if not email_or_phone or not password:
            return jsonify({"success": False, "message": "Email/phone and password are required"}), 400

        conn = get_db()
        cur = conn.cursor(dictionary=True)

        # Determine if input is phone or email
        is_phone = email_or_phone.isdigit() and len(email_or_phone) == 10

        if is_phone:
            cur.execute("SELECT * FROM users WHERE phone=%s", (email_or_phone,))
        else:
            cur.execute("SELECT * FROM users WHERE email=%s", (email_or_phone,))

        user = cur.fetchone()

        cur.close()
        conn.close()

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found. Please check your credentials or register."
            }), 401

        # Check password
        stored_password = user["password"]

        if stored_password is None:
            return jsonify({
                "success": False,
                "message": "Please use Google Sign-In to login"
            }), 401

        # Ensure stored_password is bytes
        if isinstance(stored_password, str):
            stored_password = stored_password.encode('utf-8')

        if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
            return jsonify({"success": False, "message": "Incorrect password"}), 401

        # Create session
        session.clear()
        session.permanent = True
        session["user_id"] = user["id"]
        session["email"] = user["email"]
        session["full_name"] = user["full_name"]

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "full_name": user["full_name"],
                "email": user["email"],
                "phone": user["phone"]
            }
        }), 200

    except Exception as e:
        print("LOGIN ERROR:", str(e))
        return jsonify({"success": False, "message": "Server error during login"}), 500


# =====================================================
# GOOGLE LOGIN
# =====================================================
@auth.route("/api/google-login", methods=["POST"])
def google_login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "No data received"}), 400

        email = data.get("email", "").strip()
        name = data.get("name", "").strip()
        google_id = data.get("googleId", "").strip()

        if not email or not name or not google_id:
            return jsonify({"success": False, "message": "Missing required data"}), 400

        # Validate email
        valid, msg = validate_email(email)
        if not valid:
            return jsonify({"success": False, "message": msg}), 400

        conn = get_db()
        cur = conn.cursor(dictionary=True)

        # Check if user exists
        cur.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cur.fetchone()

        if not user:
            # Create new user for Google sign-in
            # Note: phone is set to NULL for Google users
            cur.execute("""
                        INSERT INTO users (full_name, email, phone, password, google_id, is_verified)
                        VALUES (%s, %s, NULL, NULL, %s, 1)
                        """, (name, email, google_id))

            conn.commit()
            user_id = cur.lastrowid

            # Fetch the newly created user
            cur.execute("SELECT * FROM users WHERE id=%s", (user_id,))
            user = cur.fetchone()
        else:
            # Update google_id if not set
            if not user.get("google_id"):
                cur.execute(
                    "UPDATE users SET google_id=%s WHERE id=%s",
                    (google_id, user["id"])
                )
                conn.commit()

        cur.close()
        conn.close()

        # Create session
        session.clear()
        session.permanent = True
        session["user_id"] = user["id"]
        session["email"] = user["email"]
        session["full_name"] = user["full_name"]

        return jsonify({
            "success": True,
            "message": "Google login successful",
            "user": {
                "id": user["id"],
                "full_name": user["full_name"],
                "email": user["email"],
                "phone": user.get("phone")
            }
        }), 200

    except Exception as e:
        print("GOOGLE LOGIN ERROR:", str(e))
        return jsonify({"success": False, "message": "Server error during Google login"}), 500


# =====================================================
# SEND OTP (REGISTER)
# =====================================================
@auth.route("/api/send-verification-code", methods=["POST"])
def send_verification_code():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "No data received"}), 400

        email = data.get("email", "").strip()

        # Validate email
        valid, msg = validate_email(email)
        if not valid:
            return jsonify({"success": False, "message": msg}), 400

        conn = get_db()
        cur = conn.cursor()

        # Check if already registered
        cur.execute("SELECT id FROM users WHERE email=%s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({
                "success": False,
                "message": "You are already registered. Please login."
            }), 409

        # Generate 6-digit OTP
        otp = str(random.randint(100000, 999999))

        # Delete old OTPs for this email
        cur.execute("DELETE FROM otp_data WHERE email=%s AND purpose='registration'", (email,))

        # Insert new OTP
        cur.execute(
            "INSERT INTO otp_data (email, otp, purpose) VALUES (%s, %s, 'registration')",
            (email, otp)
        )

        conn.commit()
        cur.close()
        conn.close()

        # Send email
        if send_otp_email(email, otp, "registration"):
            return jsonify({"success": True, "message": "Verification code sent"}), 200

        return jsonify({"success": False, "message": "Failed to send email"}), 500

    except Exception as e:
        print("SEND VERIFICATION ERROR:", str(e))
        return jsonify({"success": False, "message": "Server error"}), 500


# =====================================================
# VERIFY OTP
# =====================================================
@auth.route("/api/verify-code", methods=["POST"])
def verify_code():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "No data received"}), 400

        email = data.get("email", "").strip()
        code = data.get("code", "").strip()
        purpose = data.get("purpose", "registration")

        if not email or not code:
            return jsonify({"success": False, "message": "Email and code are required"}), 400

        conn = get_db()
        cur = conn.cursor(dictionary=True)

        # Check OTP validity (10 minute window)
        cur.execute("""
                    SELECT *
                    FROM otp_data
                    WHERE email = %s
                      AND otp = %s
                      AND purpose = %s
                      AND created_at > NOW() - INTERVAL 10 MINUTE
                    """, (email, code, purpose))

        row = cur.fetchone()

        if not row:
            cur.close()
            conn.close()
            return jsonify({
                "success": False,
                "message": "Invalid or expired verification code"
            }), 400

        # Delete used OTP
        cur.execute("DELETE FROM otp_data WHERE id=%s", (row["id"],))
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"success": True, "message": "Code verified successfully"}), 200

    except Exception as e:
        print("VERIFY CODE ERROR:", str(e))
        return jsonify({"success": False, "message": "Server error"}), 500


# =====================================================
# SEND RESET PASSWORD OTP
# =====================================================
@auth.route("/api/send-reset-code", methods=["POST"])
def send_reset_code():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "No data received"}), 400

        email = data.get("email", "").strip()

        # Validate email
        valid, msg = validate_email(email)
        if not valid:
            return jsonify({"success": False, "message": msg}), 400

        conn = get_db()
        cur = conn.cursor()

        # Check if user exists
        cur.execute("SELECT id, google_id FROM users WHERE email=%s", (email,))
        user = cur.fetchone()

        if not user:
            cur.close()
            conn.close()
            return jsonify({
                "success": False,
                "message": "Email not registered"
            }), 404

        # Check if Google user
        if user[1]:  # google_id exists
            cur.close()
            conn.close()
            return jsonify({
                "success": False,
                "message": "Please use Google Sign-In to access your account"
            }), 400

        # Generate 6-digit OTP
        otp = str(random.randint(100000, 999999))

        # Delete old reset OTPs
        cur.execute("DELETE FROM otp_data WHERE email=%s AND purpose='reset'", (email,))

        # Insert new OTP
        cur.execute(
            "INSERT INTO otp_data (email, otp, purpose) VALUES (%s, %s, 'reset')",
            (email, otp)
        )

        conn.commit()
        cur.close()
        conn.close()

        # Send email
        if send_otp_email(email, otp, "reset"):
            return jsonify({"success": True, "message": "Reset code sent"}), 200

        return jsonify({"success": False, "message": "Failed to send email"}), 500

    except Exception as e:
        print("SEND RESET CODE ERROR:", str(e))
        return jsonify({"success": False, "message": "Server error"}), 500


# =====================================================
# RESET PASSWORD
# =====================================================
@auth.route("/api/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "No data received"}), 400

        email = data.get("email","").strip()
        password = data.get("password", "")
        print("hi")
        # Validate email
        valid, msg = validate_email(email)
        if not valid:
            return jsonify({"success": False, "message": msg}), 400

        # Validate password
        valid, msg = validate_password(password)
        if not valid:
            return jsonify({"success": False, "message": msg}), 400

        # Hash new password
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        conn = get_db()
        cur = conn.cursor()

        # Update password
        cur.execute(
            "UPDATE users SET password=%s WHERE email=%s",
            (hashed, email)
        )

        if cur.rowcount == 0:
            cur.close()
            conn.close()
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Password reset successful"
        }), 200

    except Exception as e:
        print("RESET PASSWORD ERROR:", str(e))
        return jsonify({"success": False, "message": "Server error"}), 500


# =====================================================
# LOGOUT
# =====================================================
@auth.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True, "message": "Logged out successfully"}), 200