// Sample attendance data
        const attendanceData = {
            '2026-01-03': [
                { name: 'John Smith', checkIn: '09:00', checkOut: '18:30', workHours: 9.5, extraHours: 1.5 },
                { name: 'Sarah Johnson', checkIn: '08:45', checkOut: '17:15', workHours: 8.5, extraHours: 0.5 },
                { name: 'Michael Brown', checkIn: '09:15', checkOut: '18:00', workHours: 8.75, extraHours: 0.75 },
                { name: 'Emily Davis', checkIn: '09:00', checkOut: '17:00', workHours: 8.0, extraHours: 0.0 },
                { name: 'Robert Wilson', checkIn: '--:--', checkOut: '--:--', workHours: 0.0, extraHours: 0.0, absent: true }
            ],
            '2026-01-02': [
                { name: 'John Smith', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                { name: 'Sarah Johnson', checkIn: '08:30', checkOut: '17:30', workHours: 9.0, extraHours: 1.0 },
                { name: 'Michael Brown', checkIn: '09:00', checkOut: '17:45', workHours: 8.75, extraHours: 0.75 },
                { name: 'Emily Davis', checkIn: '--:--', checkOut: '--:--', workHours: 0.0, extraHours: 0.0, absent: true },
                { name: 'Robert Wilson', checkIn: '09:30', checkOut: '18:30', workHours: 9.0, extraHours: 1.0 }
            ]
        };

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Initialize with today's date
        const dateSelector = document.getElementById('dateSelector');
        const today = new Date();
        dateSelector.value = formatDate(today);

        // Load initial data
        loadAttendanceData();

        // Event listeners
        document.getElementById('prevDay').addEventListener('click', () => {
            const currentDate = new Date(dateSelector.value);
            currentDate.setDate(currentDate.getDate() - 1);
            dateSelector.value = formatDate(currentDate);
            loadAttendanceData();
        });

        document.getElementById('nextDay').addEventListener('click', () => {
            const currentDate = new Date(dateSelector.value);
            currentDate.setDate(currentDate.getDate() + 1);
            dateSelector.value = formatDate(currentDate);
            loadAttendanceData();
        });

        dateSelector.addEventListener('change', loadAttendanceData);

        document.getElementById('searchInput').addEventListener('input', function() {
            filterTable(this.value);
        });

        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function loadAttendanceData() {
            const selectedDate = dateSelector.value;
            const date = new Date(selectedDate);
            const dayName = dayNames[date.getDay()];
            document.getElementById('dayLabel').textContent = dayName;

            const data = attendanceData[selectedDate] || [];
            const tbody = document.getElementById('attendanceTableBody');

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="no-data">No attendance records found for this date</td></tr>';
                return;
            }

            tbody.innerHTML = data.map(record => `
                <tr class="${record.absent ? 'absent-row' : ''}">
                    <td>${record.name}</td>
                    <td>${record.checkIn}</td>
                    <td>${record.checkOut}</td>
                    <td>${record.workHours.toFixed(2)} hrs</td>
                    <td>${record.extraHours.toFixed(2)} hrs</td>
                </tr>
            `).join('');
        }

        function filterTable(searchTerm) {
            const rows = document.querySelectorAll('#attendanceTableBody tr');
            const lowerSearch = searchTerm.toLowerCase();

            rows.forEach(row => {
                const name = row.cells[0]?.textContent.toLowerCase() || '';
                if (name.includes(lowerSearch)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }