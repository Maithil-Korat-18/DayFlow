const userData = {
            fullName: 'John Doe',
            jobPosition: 'HR Manager',
            company: 'Dayflow Technologies',
            department: 'Human Resources',
            manager: 'Sarah Williams',
            email: 'john.doe@dayflow.com',
            mobile: '+1 (555) 100-0001',
            location: 'New York, USA',
            dob: '1990-05-15',
            address: '123 Main Street, Apt 4B, New York, NY 10001',
            nationality: 'American',
            personalEmail: 'john.personal@email.com',
            gender: 'Male',
            maritalStatus: 'Single',
            joinDate: '2023-01-15',
            accountNumber: '1234567890123456',
            bankName: 'Chase Bank',
            ifscCode: 'CHAS0001234',
            panNumber: 'ABCDE1234F',
            uanNumber: '123456789012',
            empCode: 'EMP001',
            resume: null,
            aboutText: 'I am an experienced HR Manager with over 5 years in human resources management. I specialize in employee relations, recruitment, and organizational development. I enjoy working with people and helping them reach their potential.',
            jobPassionText: 'I love helping employees grow in their careers and seeing them succeed. Building a positive workplace culture and resolving conflicts to maintain a harmonious work environment brings me satisfaction.',
            hobbiesText: 'In my free time, I enjoy reading leadership books, hiking, photography, and volunteering at local community events. I also practice yoga and meditation to maintain work-life balance.',
            skills: ['Leadership', 'Communication', 'HR Management', 'Team Building'],
            certifications: [
                {
                    id: 1,
                    name: 'Professional HR Management Certificate',
                    authority: 'Society for Human Resource Management',
                    year: '2023'
                }
            ],
            // Role-based access
            userRole: 'admin', // 'admin', 'hr', or 'employee'
            // Salary information
            salaryInfo: {
                monthlyWage: 75000,
                yearlyWage: 900000,
                workingDaysPerWeek: 5,
                breakTime: 1,
                basicSalary: 45000,
                hra: 18000,
                standardAllowance: 12000,
                performanceBonus: 15000,
                lta: 7500,
                fixedAllowance: 7500,
                employeePfAmount: 5400,
                employeePfPercentage: 12,
                employerPfAmount: 5400,
                employerPfPercentage: 12,
                professionalTax: 200
            }
        };

        const maskedFields = {
            accountNumber: true,
            panNumber: true,
            uanNumber: true
        };

        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('userAvatar').addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('dropdown').classList.toggle('show');
            });
            document.addEventListener('click', () => {
                document.getElementById('dropdown').classList.remove('show');
            });
            
            // Initialize masked fields
            applyMasking();
            
            // Initialize resume tab content
            if (document.getElementById('aboutText')) {
                document.getElementById('aboutText').value = userData.aboutText || '';
            }
            if (document.getElementById('jobPassionText')) {
                document.getElementById('jobPassionText').value = userData.jobPassionText || '';
            }
            if (document.getElementById('hobbiesText')) {
                document.getElementById('hobbiesText').value = userData.hobbiesText || '';
            }
            
            // Render skills and certifications
            renderSkills();
            renderCertifications();
            
            // Check user role and show/hide salary tab
            checkUserRole();
            
            // Initialize salary info if salary tab exists
            initSalaryInfo();
        });

        function applyMasking() {
            Object.keys(maskedFields).forEach(fieldId => {
                if (maskedFields[fieldId]) {
                    const field = document.getElementById(fieldId);
                    if (field && field.dataset.masked) {
                        field.value = field.dataset.masked;
                        field.type = 'text';
                    }
                }
            });
        }

        function toggleMask(fieldId) {
            const field = document.getElementById(fieldId);
            const isMasked = maskedFields[fieldId];
            
            if (isMasked) {
                // Show actual value
                field.value = userData[fieldId];
                maskedFields[fieldId] = false;
            } else {
                // Show masked value
                field.value = field.dataset.masked;
                maskedFields[fieldId] = true;
            }
        }

        function switchTab(tabName) {
            document.querySelectorAll('.profile-tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tabName + 'Tab').classList.add('active');
        }

        function triggerFileUpload() {
            document.getElementById('avatarUpload').click();
        }

        function handleAvatarUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    showToast('Profile picture updated successfully');
                };
                reader.readAsDataURL(file);
            }
        }

        function triggerResumeUpload() {
            document.getElementById('resumeUpload').click();
        }

        function handleResumeUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const uploadArea = document.getElementById('resumeUploadArea');
                const fileInfo = document.getElementById('resumeFileInfo');
                
                uploadArea.classList.add('has-file');
                uploadArea.innerHTML = `
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✓</div>
                    <div style="font-size: 1.1rem; font-weight: 600; color: #10b981;">Resume Uploaded</div>
                    <div style="color: #8b92a0; font-size: 0.9rem; margin-top: 0.5rem;">${file.name}</div>
                `;
                
                fileInfo.style.display = 'block';
                fileInfo.innerHTML = `
                    <div class="file-info">
                        <div>
                            <div style="font-weight: 600;">${file.name}</div>
                            <div style="color: #8b92a0; font-size: 0.85rem;">${(file.size / 1024).toFixed(2)} KB</div>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-secondary" onclick="viewResume()">View</button>
                            <button class="btn btn-danger" onclick="removeResume()">Remove</button>
                        </div>
                    </div>
                `;
                
                userData.resume = file;
            }
        }

        function viewResume() {
            alert('In production: Open resume in new tab/viewer');
        }

        function removeResume() {
            const uploadArea = document.getElementById('resumeUploadArea');
            const fileInfo = document.getElementById('resumeFileInfo');
            
            uploadArea.classList.remove('has-file');
            uploadArea.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 1rem;">📄</div>
                <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Upload Resume</div>
                <div style="color: #8b92a0; font-size: 0.9rem;">Click to upload or drag and drop</div>
                <div style="color: #6b7280; font-size: 0.85rem; margin-top: 0.5rem;">PDF, DOC, DOCX (Max 5MB)</div>
            `;
            
            fileInfo.style.display = 'none';
            userData.resume = null;
            document.getElementById('resumeUpload').value = '';
        }

        function addSkill() {
            const input = document.getElementById('newSkillInput');
            const skillName = input.value.trim();
            
            if (skillName) {
                // Check if skill already exists
                if (!userData.skills.includes(skillName)) {
                    userData.skills.push(skillName);
                    renderSkills();
                    input.value = '';
                } else {
                    showToast('Skill already exists', 'error');
                }
            }
        }

        function removeSkill(button) {
            const skillTag = button.parentElement;
            const skillText = skillTag.querySelector('span').textContent;
            
            userData.skills = userData.skills.filter(skill => skill !== skillText);
            renderSkills();
        }

        function renderSkills() {
            const container = document.getElementById('skillsContainer');
            container.innerHTML = '';
            
            userData.skills.forEach(skill => {
                const skillTag = document.createElement('div');
                skillTag.className = 'skill-tag';
                skillTag.style.cssText = 'display: inline-block; background: #3b82f6; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; margin: 0.25rem; position: relative;';
                skillTag.innerHTML = `
                    <span>${skill}</span>
                    <button type="button" onclick="removeSkill(this)" style="background: none; border: none; color: white; margin-left: 0.5rem; cursor: pointer; font-size: 1.2rem;">×</button>
                `;
                container.appendChild(skillTag);
            });
        }

        function addCertification() {
            // Create a temporary form to collect certification details
            const container = document.getElementById('certificationsContainer');
            
            const formDiv = document.createElement('div');
            formDiv.className = 'certification-form';
            formDiv.dataset.certId = 'new';
            formDiv.style.cssText = 'background: #0f1419; border: 1px solid #3b82f6; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; position: relative;';
            
            formDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">Add New Certification</div>
                    <button type="button" onclick="cancelAddCertification(this)" style="background: #ef4444; border: none; color: white; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 0.8rem;">Cancel</button>
                </div>
                <div class="form-group" style="margin-bottom: 0.75rem;">
                    <label class="form-label" style="display: block; margin-bottom: 0.25rem;">Certification Name *</label>
                    <input type="text" class="form-input" id="newCertName" placeholder="Enter certification name" style="width: 100%; margin-bottom: 0.5rem;">
                </div>
                <div class="form-group" style="margin-bottom: 0.75rem;">
                    <label class="form-label" style="display: block; margin-bottom: 0.25rem;">Issuing Authority (Optional)</label>
                    <input type="text" class="form-input" id="newCertAuthority" placeholder="Enter issuing authority" style="width: 100%; margin-bottom: 0.5rem;">
                </div>
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label class="form-label" style="display: block; margin-bottom: 0.25rem;">Year (Optional)</label>
                    <input type="text" class="form-input" id="newCertYear" placeholder="e.g., 2023" style="width: 100%; margin-bottom: 0.5rem;">
                </div>
                <button type="button" class="btn btn-primary" onclick="saveNewCertification()" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Add Certification</button>
            `;
            
            // Insert at the beginning of the container
            if (container.firstChild) {
                container.insertBefore(formDiv, container.firstChild);
            } else {
                container.appendChild(formDiv);
            }
            
            // Focus on the name input
            document.getElementById('newCertName').focus();
        }

        function saveNewCertification() {
            const name = document.getElementById('newCertName').value.trim();
            
            if (!name) {
                showToast('Certification name is required', 'error');
                return;
            }
            
            const authority = document.getElementById('newCertAuthority').value.trim();
            const year = document.getElementById('newCertYear').value.trim();
            
            const newCert = {
                id: Date.now(), // unique ID
                name: name,
                authority: authority,
                year: year
            };
            
            userData.certifications.push(newCert);
            renderCertifications();
            showToast('Certification added successfully');
        }

        function cancelAddCertification(button) {
            const formDiv = button.closest('.certification-form');
            if (formDiv) {
                formDiv.remove();
            }
        }

        function editCertification(button) {
            const certItem = button.closest('.certification-item');
            const certId = parseInt(certItem.dataset.certId);
            
            const cert = userData.certifications.find(c => c.id === certId);
            if (!cert) return;
            
            // Replace the certification item with an edit form
            const container = document.getElementById('certificationsContainer');
            
            const formDiv = document.createElement('div');
            formDiv.className = 'certification-form';
            formDiv.dataset.certId = certId;
            formDiv.style.cssText = 'background: #0f1419; border: 1px solid #3b82f6; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; position: relative;';
            
            formDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">Edit Certification</div>
                    <button type="button" onclick="cancelEditCertification(this)" style="background: #ef4444; border: none; color: white; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 0.8rem;">Cancel</button>
                </div>
                <div class="form-group" style="margin-bottom: 0.75rem;">
                    <label class="form-label" style="display: block; margin-bottom: 0.25rem;">Certification Name *</label>
                    <input type="text" class="form-input" id="editCertName" placeholder="Enter certification name" value="${cert.name}" style="width: 100%; margin-bottom: 0.5rem;">
                </div>
                <div class="form-group" style="margin-bottom: 0.75rem;">
                    <label class="form-label" style="display: block; margin-bottom: 0.25rem;">Issuing Authority (Optional)</label>
                    <input type="text" class="form-input" id="editCertAuthority" placeholder="Enter issuing authority" value="${cert.authority || ''}" style="width: 100%; margin-bottom: 0.5rem;">
                </div>
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label class="form-label" style="display: block; margin-bottom: 0.25rem;">Year (Optional)</label>
                    <input type="text" class="form-input" id="editCertYear" placeholder="e.g., 2023" value="${cert.year || ''}" style="width: 100%; margin-bottom: 0.5rem;">
                </div>
                <button type="button" class="btn btn-primary" onclick="saveEditedCertification(${certId})" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Save Changes</button>
            `;
            
            // Replace the certification item with the form
            certItem.replaceWith(formDiv);
            
            // Focus on the name input
            document.getElementById('editCertName').focus();
        }

        function saveEditedCertification(certId) {
            const name = document.getElementById('editCertName').value.trim();
            
            if (!name) {
                showToast('Certification name is required', 'error');
                return;
            }
            
            const authority = document.getElementById('editCertAuthority').value.trim();
            const year = document.getElementById('editCertYear').value.trim();
            
            // Find and update the certification
            const certIndex = userData.certifications.findIndex(c => c.id === certId);
            if (certIndex !== -1) {
                userData.certifications[certIndex] = {
                    ...userData.certifications[certIndex],
                    name: name,
                    authority: authority,
                    year: year
                };
                
                renderCertifications();
                showToast('Certification updated successfully');
            }
        }

        function cancelEditCertification(button) {
            // Re-render the certifications to restore the original view
            renderCertifications();
        }

        function removeCertification(button) {
            const certItem = button.closest('.certification-item');
            const certId = parseInt(certItem.dataset.certId);
            
            if (confirm('Are you sure you want to delete this certification?')) {
                userData.certifications = userData.certifications.filter(cert => cert.id !== certId);
                renderCertifications();
                showToast('Certification removed successfully');
            }
        }

        // Role-based visibility functions
        function checkUserRole() {
            // In a real application, this would check the actual user role from the backend
            // For this demo, we're using the role stored in userData
            const userRole = userData.userRole; // 'admin', 'hr', or 'employee'
            
            // Show/hide salary tab based on role
            const salaryTabContainer = document.getElementById('salaryTabContainer');
            if (userRole === 'admin' || userRole === 'hr') {
                salaryTabContainer.style.display = 'block';
            } else {
                salaryTabContainer.style.display = 'none';
            }
            
            // Update active tab if salary tab was active but user doesn't have access
            const activeTab = document.querySelector('.profile-tab.active');
            if (activeTab && activeTab.textContent === 'Salary Info' && userRole !== 'admin' && userRole !== 'hr') {
                // Switch to resume tab if salary tab was active
                switchTab('resume');
            }
            
            return userRole;
        }

        // Salary calculation functions
        function calculateYearlyWage() {
            const monthlyWage = parseFloat(document.getElementById('monthlyWage').value) || 0;
            const yearlyWage = monthlyWage * 12;
            document.getElementById('yearlyWage').value = yearlyWage;
        }

        function calculatePfAmounts() {
            const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
            const employeePfPercentage = parseFloat(document.getElementById('employeePfPercentage').value) || 0;
            const employerPfPercentage = parseFloat(document.getElementById('employerPfPercentage').value) || 0;
            
            const employeePfAmount = (basicSalary * employeePfPercentage) / 100;
            const employerPfAmount = (basicSalary * employerPfPercentage) / 100;
            
            document.getElementById('employeePfAmount').value = employeePfAmount;
            document.getElementById('employerPfAmount').value = employerPfAmount;
            
            calculateAll();
        }

        function calculateAll() {
            // Calculate yearly wage
            calculateYearlyWage();
            
            // Calculate PF amounts
            calculatePfAmounts();
            
            // Calculate gross salary
            const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
            const hra = parseFloat(document.getElementById('hra').value) || 0;
            const standardAllowance = parseFloat(document.getElementById('standardAllowance').value) || 0;
            const performanceBonus = parseFloat(document.getElementById('performanceBonus').value) || 0;
            const lta = parseFloat(document.getElementById('lta').value) || 0;
            const fixedAllowance = parseFloat(document.getElementById('fixedAllowance').value) || 0;
            
            const grossSalary = basicSalary + hra + standardAllowance + performanceBonus + lta + fixedAllowance;
            document.getElementById('grossSalaryDisplay').textContent = '₹' + grossSalary.toLocaleString();
            
            // Calculate net salary
            const employeePfAmount = parseFloat(document.getElementById('employeePfAmount').value) || 0;
            const professionalTax = parseFloat(document.getElementById('professionalTax').value) || 0;
            
            const netSalary = grossSalary - employeePfAmount - professionalTax;
            document.getElementById('netSalaryDisplay').textContent = '₹' + netSalary.toLocaleString();
        }

        // Initialize salary form with user data
        function initSalaryInfo() {
            if (userData.salaryInfo) {
                document.getElementById('monthlyWage').value = userData.salaryInfo.monthlyWage;
                document.getElementById('yearlyWage').value = userData.salaryInfo.yearlyWage;
                document.getElementById('workingDaysPerWeek').value = userData.salaryInfo.workingDaysPerWeek;
                document.getElementById('breakTime').value = userData.salaryInfo.breakTime;
                document.getElementById('basicSalary').value = userData.salaryInfo.basicSalary;
                document.getElementById('hra').value = userData.salaryInfo.hra;
                document.getElementById('standardAllowance').value = userData.salaryInfo.standardAllowance;
                document.getElementById('performanceBonus').value = userData.salaryInfo.performanceBonus;
                document.getElementById('lta').value = userData.salaryInfo.lta;
                document.getElementById('fixedAllowance').value = userData.salaryInfo.fixedAllowance;
                document.getElementById('employeePfAmount').value = userData.salaryInfo.employeePfAmount;
                document.getElementById('employeePfPercentage').value = userData.salaryInfo.employeePfPercentage;
                document.getElementById('employerPfAmount').value = userData.salaryInfo.employerPfAmount;
                document.getElementById('employerPfPercentage').value = userData.salaryInfo.employerPfPercentage;
                document.getElementById('professionalTax').value = userData.salaryInfo.professionalTax;
                
                // Calculate all values after loading
                calculateAll();
            }
        }

        function renderCertifications() {
            const container = document.getElementById('certificationsContainer');
            container.innerHTML = '';
            
            userData.certifications.forEach(cert => {
                const certItem = document.createElement('div');
                certItem.className = 'certification-item';
                certItem.dataset.certId = cert.id;
                certItem.style.cssText = 'background: #0f1419; border: 1px solid #2d333b; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; position: relative;';
                
                certItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <div style="font-weight: 600; margin-bottom: 0.25rem;">${cert.name}</div>
                            ${cert.authority ? `<div style="font-size: 0.9rem; color: #8b92a0; margin-bottom: 0.25rem;">Issuing Authority: ${cert.authority}</div>` : ''}
                            ${cert.year ? `<div style="font-size: 0.9rem; color: #8b92a0;">Year: ${cert.year}</div>` : ''}
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button type="button" onclick="editCertification(this)" style="background: #2d333b; border: none; color: #e4e6eb; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 0.8rem;">Edit</button>
                            <button type="button" onclick="removeCertification(this)" style="background: #ef4444; border: none; color: white; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 0.8rem;">Delete</button>
                        </div>
                    </div>
                `;
                
                container.appendChild(certItem);
            });
        }

        // Add event listener for Enter key in skill input
        document.getElementById('newSkillInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addSkill();
            }
        });

        function validatePassword() {
            const newPass = document.getElementById('newPassword').value;
            const confirmPass = document.getElementById('confirmPassword').value;
            
            const requirements = {
                length: newPass.length >= 8,
                uppercase: /[A-Z]/.test(newPass),
                lowercase: /[a-z]/.test(newPass),
                number: /[0-9]/.test(newPass),
                special: /[!@#$%^&*]/.test(newPass),
                match: newPass === confirmPass && newPass.length > 0
            };
            
            Object.keys(requirements).forEach(req => {
                const el = document.getElementById(`req-${req}`);
                if (requirements[req]) {
                    el.classList.add('valid');
                } else {
                    el.classList.remove('valid');
                }
            });
            
            return Object.values(requirements).every(v => v);
        }

        function saveChanges(tab) {
            if (tab === 'private') {
                const personalEmail = document.getElementById('personalEmail').value;
                const workEmail = document.getElementById('email').value;
                
                if (personalEmail === workEmail) {
                    showToast('Personal email must be different from work email', 'error');
                    return;
                }
                
                const panNumber = document.getElementById('panNumber').value;
                const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                if (!maskedFields.panNumber && panNumber && !panRegex.test(panNumber)) {
                    showToast('Invalid PAN format. Expected format: ABCDE1234F', 'error');
                    return;
                }
                
                const ifscCode = document.getElementById('ifscCode').value;
                const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
                if (ifscCode && !ifscRegex.test(ifscCode)) {
                    showToast('Invalid IFSC format. Expected format: ABCD0123456', 'error');
                    return;
                }
                
                const uanNumber = document.getElementById('uanNumber').value;
                if (!maskedFields.uanNumber && uanNumber && !/^\d{12}$/.test(uanNumber)) {
                    showToast('UAN must be exactly 12 digits', 'error');
                    return;
                }
                
                showToast('Private information updated successfully');
            } else if (tab === 'security') {
                const currentPass = document.getElementById('currentPassword').value;
                const newPass = document.getElementById('newPassword').value;
                
                if (!currentPass || !newPass) {
                    showToast('Please fill in all password fields', 'error');
                    return;
                }
                
                if (!validatePassword()) {
                    showToast('Please meet all password requirements', 'error');
                    return;
                }
                
                showToast('Password updated successfully');
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
                validatePassword();
            } else if (tab === 'resume') {
                // Save resume data
                userData.aboutText = document.getElementById('aboutText').value;
                userData.jobPassionText = document.getElementById('jobPassionText').value;
                userData.hobbiesText = document.getElementById('hobbiesText').value;
                
                showToast('Resume details updated successfully');
            } else if (tab === 'salary') {
                // Save salary info data
                if (userData.userRole === 'admin' || userData.userRole === 'hr') {
                    userData.salaryInfo = {
                        monthlyWage: parseFloat(document.getElementById('monthlyWage').value) || 0,
                        yearlyWage: parseFloat(document.getElementById('yearlyWage').value) || 0,
                        workingDaysPerWeek: parseInt(document.getElementById('workingDaysPerWeek').value) || 0,
                        breakTime: parseFloat(document.getElementById('breakTime').value) || 0,
                        basicSalary: parseFloat(document.getElementById('basicSalary').value) || 0,
                        hra: parseFloat(document.getElementById('hra').value) || 0,
                        standardAllowance: parseFloat(document.getElementById('standardAllowance').value) || 0,
                        performanceBonus: parseFloat(document.getElementById('performanceBonus').value) || 0,
                        lta: parseFloat(document.getElementById('lta').value) || 0,
                        fixedAllowance: parseFloat(document.getElementById('fixedAllowance').value) || 0,
                        employeePfAmount: parseFloat(document.getElementById('employeePfAmount').value) || 0,
                        employeePfPercentage: parseFloat(document.getElementById('employeePfPercentage').value) || 0,
                        employerPfAmount: parseFloat(document.getElementById('employerPfAmount').value) || 0,
                        employerPfPercentage: parseFloat(document.getElementById('employerPfPercentage').value) || 0,
                        professionalTax: parseFloat(document.getElementById('professionalTax').value) || 0
                    };
                    
                    showToast('Salary details updated successfully');
                } else {
                    showToast('Access denied: Salary information can only be edited by Admin or HR', 'error');
                }
            } else {
                showToast('Profile updated successfully');
            }
        }

        function cancelChanges(tab) {
            if (tab === 'security') {
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
                validatePassword();
            } else if (tab === 'salary') {
                // Reload salary info from userData to cancel changes
                initSalaryInfo();
            }
        }

        function showToast(msg, type = 'success') {
            const toast = document.getElementById('toast');
            const message = document.getElementById('toastMessage');
            message.textContent = msg;
            toast.className = 'toast ' + (type === 'error' ? 'error' : '');
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        function goToEmployees() {
            alert('In production: Navigate to Employees Dashboard');
        }

        function logout() {
            if (confirm('Are you sure you want to log out?')) {
                alert('In production: Clear session and redirect to login');
            }
        }