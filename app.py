from flask import Flask, render_template, redirect, session
from login import auth
from datetime import timedelta

app = Flask(__name__)
app.secret_key = "super_secret_key_123"

# Session configuration
app.config.update(
    SESSION_COOKIE_NAME='session',
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=False,  # localhost
    PERMANENT_SESSION_LIFETIME=timedelta(days=7)
)

# Register blueprint
app.register_blueprint(auth)

# ================= AUTH ROUTES =================

@app.route("/login")
def login_page():
    return render_template("index.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

# ================= PROTECTED ROUTES =================

@app.route("/")
def home():
    return redirect("/login")

@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("dashboard.html")

@app.route("/profile")
def profile():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("profile.html")

@app.route("/emp_details")
def emp_details():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("emp_details.html")

@app.route("/emp_details.html")
def emp_details_html():
    return redirect("/emp_details")
@app.route("/admin_view")
def admin_view():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("admin_view.html")
@app.route("/admin_view.html")
def admin_view_html():
    return redirect("/admin_view")

@app.route("/Leave")
def Leave():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("Leave.html")

@app.route("/Leave.html")
def Leave_html():
    return redirect("/Leave")
# ================= RUN =================

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 Flask Server Starting")
    print("="*60)
    print("Server: http://127.0.0.1:5000")
    print("="*60 + "\n")
    app.run(debug=True, host="127.0.0.1", port=5000)
