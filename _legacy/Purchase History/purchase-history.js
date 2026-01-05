// Purchase History Module
(function() {
    'use strict';

    // History management state
    let currentHistory = [];
    let currentPage = 1;
    const historyPerPage = 10;
    let currentSearch = '';
    let currentStatusFilter = 'all';
    let startDate = '';
    let endDate = '';

    // Format date helper
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Get filtered history
    function getFilteredHistory() {
        return currentHistory.filter(record => {
            const matchesSearch = !currentSearch || 
                record.learnerName.toLowerCase().includes(currentSearch.toLowerCase()) ||
                record.packageName.toLowerCase().includes(currentSearch.toLowerCase());
            const matchesStatus = currentStatusFilter === 'all' || record.status === currentStatusFilter;
            
            let matchesDate = true;
            if (startDate) {
                const recordDate = new Date(record.purchaseDate);
                const start = new Date(startDate);
                matchesDate = matchesDate && recordDate >= start;
            }
            if (endDate) {
                const recordDate = new Date(record.purchaseDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                matchesDate = matchesDate && recordDate <= end;
            }
            
            return matchesSearch && matchesStatus && matchesDate;
        });
    }

    // Render purchase history page
    function renderPurchaseHistory() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        const filteredHistory = getFilteredHistory();
        const totalPages = Math.ceil(filteredHistory.length / historyPerPage);
        const startIndex = (currentPage - 1) * historyPerPage;
        const endIndex = startIndex + historyPerPage;
        const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

        const stats = {
            total: currentHistory.length,
            active: currentHistory.filter(h => h.status === 'active').length,
            expired: currentHistory.filter(h => h.status === 'expired').length,
            totalRevenue: currentHistory.reduce((sum, h) => sum + h.amount, 0)
        };

        let html = `
            <div class="page-container">
                <div class="purchase-history-header">
                    <h2>Purchase History</h2>
                    <div class="history-filters">
                        <div class="history-search">
                            <i class="fas fa-search"></i>
                            <input type="text" id="historySearchInput" placeholder="Search by learner or package..." value="${currentSearch}">
                        </div>
                        <select class="filter-select" id="statusFilter">
                            <option value="all" ${currentStatusFilter === 'all' ? 'selected' : ''}>All Status</option>
                            <option value="active" ${currentStatusFilter === 'active' ? 'selected' : ''}>Active</option>
                            <option value="expired" ${currentStatusFilter === 'expired' ? 'selected' : ''}>Expired</option>
                        </select>
                        <div class="date-range-filter">
                            <input type="date" id="startDate" class="date-input" value="${startDate}" placeholder="Start Date">
                            <span>to</span>
                            <input type="date" id="endDate" class="date-input" value="${endDate}" placeholder="End Date">
                        </div>
                    </div>
                </div>

                <div class="history-stats">
                    <div class="history-stat-card">
                        <div class="history-stat-label">Total Purchases</div>
                        <div class="history-stat-value">${stats.total}</div>
                    </div>
                    <div class="history-stat-card success">
                        <div class="history-stat-label">Active Packages</div>
                        <div class="history-stat-value">${stats.active}</div>
                    </div>
                    <div class="history-stat-card">
                        <div class="history-stat-label">Expired Packages</div>
                        <div class="history-stat-value">${stats.expired}</div>
                    </div>
                    <div class="history-stat-card success">
                        <div class="history-stat-label">Total Revenue</div>
                        <div class="history-stat-value">$${stats.totalRevenue.toFixed(2)}</div>
                    </div>
                </div>

                <div class="history-table-container">
        `;

        if (paginatedHistory.length === 0) {
            html += `
                    <div class="empty-state">
                        <i class="fas fa-history"></i>
                        <h3>No purchase history found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                `;
        } else {
            html += `
                    <table class="history-table">
                        <thead>
                            <tr>
                                <th>Learner</th>
                                <th>Package</th>
                                <th>Amount</th>
                                <th>Purchase Date</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            paginatedHistory.forEach(record => {
                const statusClass = record.status === 'active' ? 'active' : 'inactive';
                const isExpired = new Date(record.expiryDate) < new Date();

                html += `
                            <tr>
                                <td>${record.learnerName}</td>
                                <td>
                                    <span class="package-name-badge">${record.packageName}</span>
                                </td>
                                <td>
                                    <span class="price-amount">$${record.amount.toFixed(2)}</span>
                                </td>
                                <td>${formatDate(record.purchaseDate)}</td>
                                <td>${formatDate(record.expiryDate)}</td>
                                <td>
                                    <span class="status-badge ${statusClass}">
                                        <span class="status-dot"></span>
                                        ${record.status}
                                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-action view" onclick="PurchaseHistory.viewDetails(${record.id})" title="View Details">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                `;
        }

        html += `
                </div>

                <div class="export-actions">
                    <button class="btn-export" onclick="PurchaseHistory.exportToCSV()">
                        <i class="fas fa-download"></i>
                        Export to CSV
                    </button>
                    <button class="btn-export" onclick="PurchaseHistory.exportToPDF()">
                        <i class="fas fa-file-pdf"></i>
                        Export to PDF
                    </button>
                </div>

                <div class="pagination">
                    <div class="pagination-info">
                        Showing ${startIndex + 1} to ${Math.min(endIndex, filteredHistory.length)} of ${filteredHistory.length} records
                    </div>
                    <div class="pagination-controls">
                        <button class="btn-pagination" onclick="PurchaseHistory.changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i> Previous
                        </button>
            `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += `<button class="btn-pagination ${i === currentPage ? 'active' : ''}" onclick="PurchaseHistory.changePage(${i})">${i}</button>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                html += `<span class="btn-pagination" style="border: none; cursor: default;">...</span>`;
            }
        }

        html += `
                        <button class="btn-pagination" onclick="PurchaseHistory.changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                            Next <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        pageContent.innerHTML = html;

        // Attach event listeners
        attachHistoryListeners();
    }

    // Attach event listeners
    function attachHistoryListeners() {
        const searchInput = document.getElementById('historySearchInput');
        const statusFilter = document.getElementById('statusFilter');
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    currentSearch = e.target.value;
                    currentPage = 1;
                    renderPurchaseHistory();
                }, 300);
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                currentStatusFilter = e.target.value;
                currentPage = 1;
                renderPurchaseHistory();
            });
        }

        if (startDateInput) {
            startDateInput.addEventListener('change', (e) => {
                startDate = e.target.value;
                currentPage = 1;
                renderPurchaseHistory();
            });
        }

        if (endDateInput) {
            endDateInput.addEventListener('change', (e) => {
                endDate = e.target.value;
                currentPage = 1;
                renderPurchaseHistory();
            });
        }
    }

    // Public API
    window.PurchaseHistory = {
        render: renderPurchaseHistory,
        changePage: function(page) {
            const filteredHistory = getFilteredHistory();
            const totalPages = Math.ceil(filteredHistory.length / historyPerPage);
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                renderPurchaseHistory();
            }
        },
        viewDetails: function(recordId) {
            const record = currentHistory.find(r => r.id === recordId);
            if (record) {
                alert(`Purchase History Details:\n\nLearner: ${record.learnerName}\nPackage: ${record.packageName}\nAmount: $${record.amount.toFixed(2)}\nPurchase Date: ${formatDate(record.purchaseDate)}\nExpiry Date: ${formatDate(record.expiryDate)}\nStatus: ${record.status}`);
            }
        },
        exportToCSV: function() {
            const filteredHistory = getFilteredHistory();
            const headers = ['Learner', 'Package', 'Amount', 'Purchase Date', 'Expiry Date', 'Status'];
            const rows = filteredHistory.map(r => [
                r.learnerName,
                r.packageName,
                r.amount.toFixed(2),
                r.purchaseDate,
                r.expiryDate,
                r.status
            ]);
            
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `purchase-history-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        },
        exportToPDF: function() {
            alert('PDF export functionality would be implemented here. This typically requires a PDF library like jsPDF.');
        }
    };
})();



