// Sample monthly attendance data
        const monthlyData = {
            '2026-01': {
                present: 20,
                leaves: 2,
                workingDays: 22,
                records: [
                    { date: '01 Jan, Wed', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                    { date: '02 Jan, Thu', checkIn: '08:45', checkOut: '17:45', workHours: 9.0, extraHours: 1.0 },
                    { date: '03 Jan, Fri', checkIn: '09:00', checkOut: '18:30', workHours: 9.5, extraHours: 1.5 },
                    { date: '06 Jan, Mon', checkIn: '09:15', checkOut: '18:15', workHours: 9.0, extraHours: 1.0 },
                    { date: '07 Jan, Tue', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                    { date: '08 Jan, Wed', checkIn: '08:30', checkOut: '17:30', workHours: 9.0, extraHours: 1.0 },
                    { date: '09 Jan, Thu', checkIn: '09:00', checkOut: '17:45', workHours: 8.75, extraHours: 0.75 },
                    { date: '10 Jan, Fri', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                    { date: '13 Jan, Mon', checkIn: '09:00', checkOut: '18:30', workHours: 9.5, extraHours: 1.5 },
                    { date: '14 Jan, Tue', checkIn: '08:45', checkOut: '17:45', workHours: 9.0, extraHours: 1.0 },
                    { date: '15 Jan, Wed', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                    { date: '16 Jan, Thu', checkIn: '09:15', checkOut: '18:15', workHours: 9.0, extraHours: 1.0 },
                    { date: '17 Jan, Fri', checkIn: '09:00', checkOut: '17:00', workHours: 8.0, extraHours: 0.0 },
                    { date: '20 Jan, Mon', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                    { date: '21 Jan, Tue', checkIn: '08:30', checkOut: '17:30', workHours: 9.0, extraHours: 1.0 },
                    { date: '22 Jan, Wed', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                    { date: '23 Jan, Thu', checkIn: '09:00', checkOut: '18:30', workHours: 9.5, extraHours: 1.5 },
                    { date: '24 Jan, Fri', checkIn: '08:45', checkOut: '17:45', workHours: 9.0, extraHours: 1.0 },
                    { date: '27 Jan, Mon', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                    { date: '28 Jan, Tue', checkIn: '09:00', checkOut: '18:15', workHours: 9.25, extraHours: 1.25 }
                ]
            },
            '2025-12': {
                present: 18,
                leaves: 3,
                workingDays: 21,
                records: [
                    { date: '02 Dec, Mon', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                    { date: '03 Dec, Tue', checkIn: '08:45', checkOut: '17:45', workHours: 9.0, extraHours: 1.0 },
                    { date: '04 Dec, Wed', checkIn: '09:00', checkOut: '18:30', workHours: 9.5, extraHours: 1.5 },
                    { date: '05 Dec, Thu', checkIn: '09:15', checkOut: '18:15', workHours: 9.0, extraHours: 1.0 },
                    { date: '06 Dec, Fri', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                    { date: '09 Dec, Mon', checkIn: '08:30', checkOut: '17:30', workHours: 9.0, extraHours: 1.0 },
                    { date: '10 Dec, Tue', checkIn: '09:00', checkOut: '17:45', workHours: 8.75, extraHours: 0.75 },
                    { date: '11 Dec, Wed', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                    { date: '12 Dec, Thu', checkIn: '09:00', checkOut: '18:30', workHours: 9.5, extraHours: 1.5 },
                    { date: '13 Dec, Fri', checkIn: '08:45', checkOut: '17:45', workHours: 9.0, extraHours: 1.0 },
                    { date: '16 Dec, Mon', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                    { date: '17 Dec, Tue', checkIn: '09:15', checkOut: '18:15', workHours: 9.0, extraHours: 1.0 },
                    { date: '18 Dec, Wed', checkIn: '09:00', checkOut: '17:00', workHours: 8.0, extraHours: 0.0 },
                    { date: '19 Dec, Thu', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                    { date: '20 Dec, Fri', checkIn: '08:30', checkOut: '17:30', workHours: 9.0, extraHours: 1.0 },
                    { date: '23 Dec, Mon', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 },
                    { date: '24 Dec, Tue', checkIn: '09:00', checkOut: '13:00', workHours: 4.0, extraHours: 0.0 },
                    { date: '27 Dec, Fri', checkIn: '09:00', checkOut: '18:00', workHours: 9.0, extraHours: 1.0 }
                ]
            }
        };

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];

        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        // Initialize
        loadMonthData();

        // Event listeners
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            loadMonthData();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            loadMonthData();
        });

        function loadMonthData() {
            const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
            const monthLabel = `${monthNames[currentMonth]} ${currentYear}`;
            document.getElementById('monthLabel').textContent = monthLabel;

            const data = monthlyData[monthKey];

            if (!data) {
                document.getElementById('presentDays').textContent = '0';
                document.getElementById('leaveDays').textContent = '0';
                document.getElementById('workingDays').textContent = '0';
                document.getElementById('attendanceTableBody').innerHTML =
                    '<tr><td colspan="5" class="no-data">No attendance records for this month</td></tr>';
                return;
            }

            // Update summary cards
            document.getElementById('presentDays').textContent = data.present;
            document.getElementById('leaveDays').textContent = data.leaves;
            document.getElementById('workingDays').textContent = data.workingDays;

            // Update table
            const tbody = document.getElementById('attendanceTableBody');
            tbody.innerHTML = data.records.map(record => `
                <tr>
                    <td>${record.date}</td>
                    <td>${record.checkIn}</td>
                    <td>${record.checkOut}</td>
                    <td>${record.workHours.toFixed(2)} hrs</td>
                    <td>${record.extraHours.toFixed(2)} hrs</td>
                </tr>
            `).join('');
        }