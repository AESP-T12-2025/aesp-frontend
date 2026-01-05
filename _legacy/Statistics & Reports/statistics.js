// Statistics & Reports Module
(function() {
    'use strict';

    // Statistics state
    let startDate = '';
    let endDate = '';
    
    // Statistics data (will be populated from API or database)
    const sampleStats = {
        totalUsers: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        totalRevenue: 0,
        revenueThisMonth: 0,
        totalPackages: 0,
        packagesThisMonth: 0,
        averageRating: 0,
        totalMentors: 0,
        activeMentors: 0
    };

    // Render statistics page
    function renderStatistics() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        let html = `
            <div class="page-container">
                <div class="statistics-header">
                    <h2>Statistics & Reports</h2>
                    <div class="date-range-selector">
                        <input type="date" id="startDate" class="date-input" value="${startDate}" placeholder="Start Date">
                        <span>to</span>
                        <input type="date" id="endDate" class="date-input" value="${endDate}" placeholder="End Date">
                        <button class="btn-primary" onclick="Statistics.applyDateRange()">
                            <i class="fas fa-filter"></i>
                            Apply Filter
                        </button>
                    </div>
                </div>

                <div class="statistics-grid">
                    <div class="statistics-card">
                        <div class="statistics-card-header">
                            <div class="statistics-card-title">Total Users</div>
                            <div class="statistics-card-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                <i class="fas fa-users"></i>
                            </div>
                        </div>
                        <div class="statistics-card-value">${sampleStats.totalUsers.toLocaleString()}</div>
                        <div class="statistics-card-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+${sampleStats.newUsersThisMonth} this month</span>
                        </div>
                    </div>

                    <div class="statistics-card">
                        <div class="statistics-card-header">
                            <div class="statistics-card-title">Active Users</div>
                            <div class="statistics-card-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                                <i class="fas fa-user-check"></i>
                            </div>
                        </div>
                        <div class="statistics-card-value">${sampleStats.activeUsers.toLocaleString()}</div>
                        <div class="statistics-card-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>69.4% of total</span>
                        </div>
                    </div>

                    <div class="statistics-card">
                        <div class="statistics-card-header">
                            <div class="statistics-card-title">Total Revenue</div>
                            <div class="statistics-card-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                        </div>
                        <div class="statistics-card-value">$${sampleStats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div class="statistics-card-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+$${sampleStats.revenueThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} this month</span>
                        </div>
                    </div>

                    <div class="statistics-card">
                        <div class="statistics-card-header">
                            <div class="statistics-card-title">Package Sales</div>
                            <div class="statistics-card-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
                                <i class="fas fa-shopping-bag"></i>
                            </div>
                        </div>
                        <div class="statistics-card-value">${sampleStats.totalPackages.toLocaleString()}</div>
                        <div class="statistics-card-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+${sampleStats.packagesThisMonth} this month</span>
                        </div>
                    </div>

                    <div class="statistics-card">
                        <div class="statistics-card-header">
                            <div class="statistics-card-title">Average Rating</div>
                            <div class="statistics-card-icon" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);">
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                        <div class="statistics-card-value">${sampleStats.averageRating}</div>
                        <div class="statistics-card-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>Based on 1,234 reviews</span>
                        </div>
                    </div>

                    <div class="statistics-card">
                        <div class="statistics-card-header">
                            <div class="statistics-card-title">Active Mentors</div>
                            <div class="statistics-card-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">
                                <i class="fas fa-user-tie"></i>
                            </div>
                        </div>
                        <div class="statistics-card-value">${sampleStats.activeMentors}</div>
                        <div class="statistics-card-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>${sampleStats.totalMentors} total mentors</span>
                        </div>
                    </div>
                </div>

                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title">User Growth</h3>
                    </div>
                    <div class="chart-placeholder">
                        <div style="text-align: center;">
                            <i class="fas fa-chart-line" style="font-size: 48px; margin-bottom: 10px; opacity: 0.3;"></i>
                            <p>Chart visualization would be implemented here</p>
                            <p style="font-size: 12px; margin-top: 5px;">(Using libraries like Chart.js, D3.js, or similar)</p>
                        </div>
                    </div>
                </div>

                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title">Revenue Trends</h3>
                    </div>
                    <div class="chart-placeholder">
                        <div style="text-align: center;">
                            <i class="fas fa-chart-bar" style="font-size: 48px; margin-bottom: 10px; opacity: 0.3;"></i>
                            <p>Revenue chart visualization would be implemented here</p>
                            <p style="font-size: 12px; margin-top: 5px;">(Using libraries like Chart.js, D3.js, or similar)</p>
                        </div>
                    </div>
                </div>

                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title">Package Sales Distribution</h3>
                    </div>
                    <div class="chart-placeholder">
                        <div style="text-align: center;">
                            <i class="fas fa-chart-pie" style="font-size: 48px; margin-bottom: 10px; opacity: 0.3;"></i>
                            <p>Pie chart visualization would be implemented here</p>
                            <p style="font-size: 12px; margin-top: 5px;">(Using libraries like Chart.js, D3.js, or similar)</p>
                        </div>
                    </div>
                </div>

                <div class="report-actions">
                    <button class="btn-export" onclick="Statistics.exportReport('csv')">
                        <i class="fas fa-download"></i>
                        Export CSV Report
                    </button>
                    <button class="btn-export" onclick="Statistics.exportReport('pdf')">
                        <i class="fas fa-file-pdf"></i>
                        Export PDF Report
                    </button>
                    <button class="btn-export" onclick="Statistics.exportReport('excel')">
                        <i class="fas fa-file-excel"></i>
                        Export Excel Report
                    </button>
                </div>
            </div>
        `;

        pageContent.innerHTML = html;

        // Attach event listeners
        attachStatisticsListeners();
    }

    // Attach event listeners
    function attachStatisticsListeners() {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (startDateInput) {
            startDateInput.addEventListener('change', (e) => {
                startDate = e.target.value;
            });
        }

        if (endDateInput) {
            endDateInput.addEventListener('change', (e) => {
                endDate = e.target.value;
            });
        }
    }

    // Public API
    window.Statistics = {
        render: renderStatistics,
        applyDateRange: function() {
            const start = document.getElementById('startDate')?.value;
            const end = document.getElementById('endDate')?.value;
            
            if (start && end) {
                alert(`Filtering statistics from ${start} to ${end}\n\nThis would filter the statistics data based on the selected date range.`);
                // Here you would typically filter the statistics data
            } else {
                alert('Please select both start and end dates.');
            }
        },
        exportReport: function(format) {
            const formats = {
                csv: 'CSV',
                pdf: 'PDF',
                excel: 'Excel'
            };
            
            alert(`Exporting ${formats[format]} report...\n\nThis would generate and download a ${formats[format]} report with the current statistics data.`);
            
            // Here you would typically:
            // - For CSV: Generate CSV content and download
            // - For PDF: Use a library like jsPDF to generate PDF
            // - For Excel: Use a library like SheetJS to generate Excel file
        }
    };
})();



