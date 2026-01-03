// ============================================================================
        // DATA & STATE
        // ============================================================================

        const EMPLOYEES = [
            { id: 1, name: 'John Smith', role: 'employee', ptoBalance: 24, sickBalance: 7 },
            { id: 2, name: 'Sarah Johnson', role: 'admin', ptoBalance: 20, sickBalance: 5 },
            { id: 3, name: 'Mike Davis', role: 'employee', ptoBalance: 15, sickBalance: 10 },
            { id: 4, name: 'Emily Chen', role: 'hr', ptoBalance: 18, sickBalance: 8 }
        ];

        let timeOffRequests = [
            {
                id: 1,
                employeeId: 1,
                employeeName: 'John Smith',
                type: 'Paid Time Off',
                startDate: '2026-01-15',
                endDate: '2026-01-20',
                days: 5,
                status: 'Pending',
                attachment: null
            },
            {
                id: 2,
                employeeId: 3,
                employeeName: 'Mike Davis',
                type: 'Sick Leave',
                startDate: '2026-01-10',
                endDate: '2026-01-12',
                days: 3,
                status: 'Approved',
                attachment: 'medical_cert.pdf'
            },
            {
                id: 3,
                employeeId: 1,
                employeeName: 'John Smith',
                type: 'Unpaid Leave',
                startDate: '2025-12-20',
                endDate: '2025-12-22',
                days: 3,
                status: 'Rejected',
                attachment: null
            },
            {
                id: 4,
                employeeId: 4,
                employeeName: 'Emily Chen',
                type: 'Paid Time Off',
                startDate: '2026-02-01',
                endDate: '2026-02-05',
                days: 4,
                status: 'Approved',
                attachment: null
            }
        ];

        // Change this index to test different roles: 0=employee, 1=admin, 2=employee, 3=hr
        let currentUser = EMPLOYEES[0];
        let isAdminOrHR = currentUser.role === 'admin' || currentUser.role === 'hr';

        // ============================================================================
        // INITIALIZATION
        // ============================================================================

        document.addEventListener('DOMContentLoaded', function() {
            initializeUI();
            renderTable();
            setupEventListeners();
        });

        function initializeUI() {
            // Update user info
            document.getElementById('userName').textContent = currentUser.name;
            document.getElementById('userRole').textContent = currentUser.role;
            document.getElementById('userAvatar').textContent = getInitials(currentUser.name);

            // Update balances
            document.getElementById('ptoBalance').textContent = currentUser.ptoBalance;
            document.getElementById('sickBalance').textContent = currentUser.sickBalance;

            // Show/hide elements based on role
            if (isAdminOrHR) {
                document.getElementById('balanceCards').classList.add('hidden');
                document.getElementById('btnNewRequest').classList.add('hidden');
                document.getElementById('pageTitle').textContent = 'All Time Off Requests';
                document.getElementById('pageSubtitle').textContent = 'Review and manage employee time off';
            } else {
                document.getElementById('balanceCards').classList.remove('hidden');
                document.getElementById('btnNewRequest').classList.remove('hidden');
            }

            // Set modal employee name
            document.getElementById('modalEmployee').value = currentUser.name;
        }

        function getInitials(name) {
            return name.split(' ').map(n => n[0]).join('');
        }

        // ============================================================================
        // TABLE RENDERING
        // ============================================================================

        function renderTable() {
            const tableHeader = document.getElementById('tableHeader');
            const tableBody = document.getElementById('tableBody');

            // Clear existing content
            tableHeader.innerHTML = '';
            tableBody.innerHTML = '';

            // Build header
            if (isAdminOrHR) {
                tableHeader.innerHTML = `
                    <th>Employee</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Type</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Actions</th>
                `;
            } else {
                tableHeader.innerHTML = `
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Type</th>
                    <th>Days</th>
                    <th>Status</th>
                `;
            }

            // Filter requests based on role
            const visibleRequests = isAdminOrHR
                ? timeOffRequests
                : timeOffRequests.filter(req => req.employeeId === currentUser.id);

            // Render rows
            if (visibleRequests.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="${isAdminOrHR ? 7 : 5}" class="empty-state">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <p>No time off requests found</p>
                        </td>
                    </tr>
                `;
            } else {
                visibleRequests.forEach(request => {
                    const row = document.createElement('tr');

                    let rowHTML = '';

                    if (isAdminOrHR) {
                        rowHTML += `<td><div class="employee-name">${request.employeeName}</div></td>`;
                    }

                    rowHTML += `
                        <td>${formatDate(request.startDate)}</td>
                        <td>${formatDate(request.endDate)}</td>
                        <td>
                            ${request.type}
                            ${request.attachment ? ' 📎' : ''}
                        </td>
                        <td>${request.days}</td>
                        <td>
                            <span class="status-badge ${request.status.toLowerCase()}">${request.status}</span>
                        </td>
                    `;

                    if (isAdminOrHR) {
                        if (request.status === 'Pending') {
                            rowHTML += `
                                <td>
                                    <div class="actions">
                                        <button class="btn-action btn-approve" onclick="approveRequest(${request.id})" title="Approve">
                                            ✓
                                        </button>
                                        <button class="btn-action btn-reject" onclick="rejectRequest(${request.id})" title="Reject">
                                            ✕
                                        </button>
                                    </div>
                                </td>
                            `;
                        } else {
                            rowHTML += `<td style="color: #9ca3af;">—</td>`;
                        }
                    }

                    row.innerHTML = rowHTML;
                    tableBody.appendChild(row);
                });
            }
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        // ============================================================================
        // EVENT LISTENERS
        // ============================================================================

        function setupEventListeners() {
            // Open modal
            document.getElementById('btnNewRequest').addEventListener('click', openModal);

            // Close modal
            document.getElementById('btnCloseModal').addEventListener('click', closeModal);
            document.getElementById('btnDiscard').addEventListener('click', closeModal);
            document.getElementById('modalOverlay').addEventListener('click', function(e) {
                if (e.target === this) closeModal();
            });

            // Date change listeners
            document.getElementById('modalStartDate').addEventListener('change', calculateDays);
            document.getElementById('modalEndDate').addEventListener('change', calculateDays);

            // Type change listener
            document.getElementById('modalType').addEventListener('change', function() {
                updateAttachmentLabel();
            });

            // File upload
            document.getElementById('modalAttachment').addEventListener('change', function(e) {
                const fileName = e.target.files[0]?.name || '📎 Choose file...';
                document.getElementById('fileName').textContent = fileName;
            });

            // Submit request
            document.getElementById('btnSubmit').addEventListener('click', submitRequest);
        }

        // ============================================================================
        // MODAL FUNCTIONS
        // ============================================================================

        function openModal() {
            document.getElementById('modalOverlay').classList.add('active');
            resetForm();
        }

        function closeModal() {
            document.getElementById('modalOverlay').classList.remove('active');
            resetForm();
        }

        function resetForm() {
            document.getElementById('modalType').value = 'Paid Time Off';
            document.getElementById('modalStartDate').value = '';
            document.getElementById('modalEndDate').value = '';
            document.getElementById('modalDays').value = '0';
            document.getElementById('modalAttachment').value = '';
            document.getElementById('fileName').textContent = '📎 Choose file...';
            clearErrors();
            updateAttachmentLabel();
        }

        function clearErrors() {
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(el => el.classList.add('hidden'));

            const inputs = document.querySelectorAll('.form-input');
            inputs.forEach(input => input.classList.remove('input-error'));
        }

        function updateAttachmentLabel() {
            const type = document.getElementById('modalType').value;
            const label = document.getElementById('attachmentLabel');
            label.textContent = type === 'Sick Leave' ? 'Attachment *' : 'Attachment';
        }

        function calculateDays() {
            const startDate = document.getElementById('modalStartDate').value;
            const endDate = document.getElementById('modalEndDate').value;

            if (!startDate || !endDate) {
                document.getElementById('modalDays').value = '0';
                return;
            }

            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = end - start;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            document.getElementById('modalDays').value = diffDays > 0 ? diffDays : 0;
        }

        // ============================================================================
        // SUBMIT REQUEST
        // ============================================================================

        function submitRequest() {
            clearErrors();

            const type = document.getElementById('modalType').value;
            const startDate = document.getElementById('modalStartDate').value;
            const endDate = document.getElementById('modalEndDate').value;
            const days = parseInt(document.getElementById('modalDays').value);
            const attachment = document.getElementById('modalAttachment').files[0]?.name || null;

            let hasError = false;

            // Validation
            if (!startDate) {
                showError('errorStartDate', 'Start date is required');
                document.getElementById('modalStartDate').classList.add('input-error');
                hasError = true;
            }

            if (!endDate) {
                showError('errorEndDate', 'End date is required');
                document.getElementById('modalEndDate').classList.add('input-error');
                hasError = true;
            }

            if (days <= 0) {
                showError('errorDays', 'Invalid date range');
                hasError = true;
            }

            // Check balance
            if (type === 'Paid Time Off' && days > currentUser.ptoBalance) {
                showError('errorDays', `Insufficient balance (${currentUser.ptoBalance} days available)`);
                hasError = true;
            }

            if (type === 'Sick Leave' && days > currentUser.sickBalance) {
                showError('errorDays', `Insufficient balance (${currentUser.sickBalance} days available)`);
                hasError = true;
            }

            // Attachment required for sick leave
            if (type === 'Sick Leave' && !attachment) {
                showError('errorAttachment', 'Medical certificate required for sick leave');
                hasError = true;
            }

            if (hasError) return;

            // Create new request
            const newRequest = {
                id: Date.now(),
                employeeId: currentUser.id,
                employeeName: currentUser.name,
                type: type,
                startDate: startDate,
                endDate: endDate,
                days: days,
                status: 'Pending',
                attachment: attachment
            };

            // Add to requests
            timeOffRequests.unshift(newRequest);

            // Re-render table
            renderTable();

            // Close modal
            closeModal();

            // Show success (optional)
            alert('Time off request submitted successfully!');
        }

        function showError(elementId, message) {
            const errorEl = document.getElementById(elementId);
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }

        // ============================================================================
        // APPROVE / REJECT FUNCTIONS
        // ============================================================================

        function approveRequest(id) {
            const request = timeOffRequests.find(r => r.id === id);
            if (!request) return;

            if (confirm(`Approve time off request for ${request.employeeName}?`)) {
                request.status = 'Approved';

                // Deduct from balance (in real app, this would be done server-side)
                const employee = EMPLOYEES.find(e => e.id === request.employeeId);
                if (employee) {
                    if (request.type === 'Paid Time Off') {
                        employee.ptoBalance -= request.days;
                    } else if (request.type === 'Sick Leave') {
                        employee.sickBalance -= request.days;
                    }
                }

                renderTable();
            }
        }

        function rejectRequest(id) {
            const request = timeOffRequests.find(r => r.id === id);
            if (!request) return;

            if (confirm(`Reject time off request for ${request.employeeName}?`)) {
                request.status = 'Rejected';
                renderTable();
            }
        }

        // ============================================================================
        // TEST FUNCTIONS (for switching users)
        // ============================================================================

        // To test different roles, call these functions from console:
        // switchUser(0) - Employee (John Smith)
        // switchUser(1) - Admin (Sarah Johnson)
        // switchUser(3) - HR (Emily Chen)

        function switchUser(index) {
            currentUser = EMPLOYEES[index];
            isAdminOrHR = currentUser.role === 'admin' || currentUser.role === 'hr';
            initializeUI();
            renderTable();
}