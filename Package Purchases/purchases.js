// Package Purchases Module
(function() {
    'use strict';

    // Purchases management state
    let currentPurchases = [];
    let currentPage = 1;
    const purchasesPerPage = 10;
    let currentSearch = '';
    let currentStatusFilter = 'all';
    let currentPackageFilter = 'all';

    // Format date helper
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Get filtered purchases
    function getFilteredPurchases() {
        return currentPurchases.filter(purchase => {
            const matchesSearch = !currentSearch || 
                purchase.learnerName.toLowerCase().includes(currentSearch.toLowerCase()) ||
                purchase.learnerEmail.toLowerCase().includes(currentSearch.toLowerCase()) ||
                purchase.packageName.toLowerCase().includes(currentSearch.toLowerCase());
            const matchesStatus = currentStatusFilter === 'all' || purchase.status === currentStatusFilter;
            const matchesPackage = currentPackageFilter === 'all' || purchase.packageName === currentPackageFilter;
            
            return matchesSearch && matchesStatus && matchesPackage;
        });
    }

    // Render purchases page
    function renderPurchases() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        const filteredPurchases = getFilteredPurchases();
        const totalPages = Math.ceil(filteredPurchases.length / purchasesPerPage);
        const startIndex = (currentPage - 1) * purchasesPerPage;
        const endIndex = startIndex + purchasesPerPage;
        const paginatedPurchases = filteredPurchases.slice(startIndex, endIndex);

        const stats = {
            total: currentPurchases.length,
            completed: currentPurchases.filter(p => p.status === 'completed').length,
            pending: currentPurchases.filter(p => p.status === 'pending').length,
            totalRevenue: currentPurchases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
        };

        const uniquePackages = [...new Set(currentPurchases.map(p => p.packageName))];

        let html = `
            <div class="page-container">
                <div class="purchases-header">
                    <h2>Package Purchases</h2>
                    <div class="purchase-filters">
                        <div class="purchase-search">
                            <i class="fas fa-search"></i>
                            <input type="text" id="purchaseSearchInput" placeholder="Search by learner or package..." value="${currentSearch}">
                        </div>
                        <select class="filter-select" id="statusFilter">
                            <option value="all" ${currentStatusFilter === 'all' ? 'selected' : ''}>All Status</option>
                            <option value="completed" ${currentStatusFilter === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="pending" ${currentStatusFilter === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="failed" ${currentStatusFilter === 'failed' ? 'selected' : ''}>Failed</option>
                        </select>
                        <select class="filter-select" id="packageFilter">
                            <option value="all" ${currentPackageFilter === 'all' ? 'selected' : ''}>All Packages</option>
                            ${uniquePackages.map(pkg => `<option value="${pkg}" ${currentPackageFilter === pkg ? 'selected' : ''}>${pkg}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <div class="purchase-stats">
                    <div class="purchase-stat-card">
                        <div class="purchase-stat-label">Total Purchases</div>
                        <div class="purchase-stat-value">${stats.total}</div>
                    </div>
                    <div class="purchase-stat-card success">
                        <div class="purchase-stat-label">Completed</div>
                        <div class="purchase-stat-value">${stats.completed}</div>
                    </div>
                    <div class="purchase-stat-card warning">
                        <div class="purchase-stat-label">Pending</div>
                        <div class="purchase-stat-value">${stats.pending}</div>
                    </div>
                    <div class="purchase-stat-card success">
                        <div class="purchase-stat-label">Total Revenue</div>
                        <div class="purchase-stat-value">$${stats.totalRevenue.toFixed(2)}</div>
                    </div>
                </div>

                <div class="purchase-table-container">
        `;

        if (paginatedPurchases.length === 0) {
            html += `
                    <div class="empty-state">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>No purchases found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                `;
        } else {
            html += `
                    <table class="purchase-table">
                        <thead>
                            <tr>
                                <th>Learner</th>
                                <th>Package</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                                <th>Purchase Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            paginatedPurchases.forEach(purchase => {
                const initials = purchase.learnerName.split(' ').map(n => n[0]).join('').toUpperCase();
                const statusClass = purchase.status;

                html += `
                            <tr>
                                <td>
                                    <div class="purchase-info">
                                        <div class="purchase-avatar-small">${initials}</div>
                                        <div class="purchase-details">
                                            <div class="purchase-name">${purchase.learnerName}</div>
                                            <div class="user-email">${purchase.learnerEmail}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="package-name-badge">${purchase.packageName}</span>
                                </td>
                                <td>
                                    <span class="price-amount">$${purchase.amount.toFixed(2)}</span>
                                </td>
                                <td>${purchase.paymentMethod}</td>
                                <td>
                                    <span class="payment-status ${statusClass}">
                                        <span class="status-dot"></span>
                                        ${purchase.status}
                                    </span>
                                </td>
                                <td>${formatDate(purchase.purchaseDate)}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-action view" onclick="Purchases.viewPurchase(${purchase.id})" title="View">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        ${purchase.status === 'pending' ? `
                                        <button class="btn-action edit" onclick="Purchases.approvePurchase(${purchase.id})" title="Approve">
                                            <i class="fas fa-check"></i>
                                        </button>
                                        ` : ''}
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

                <div class="pagination">
                    <div class="pagination-info">
                        Showing ${startIndex + 1} to ${Math.min(endIndex, filteredPurchases.length)} of ${filteredPurchases.length} purchases
                    </div>
                    <div class="pagination-controls">
                        <button class="btn-pagination" onclick="Purchases.changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i> Previous
                        </button>
            `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += `<button class="btn-pagination ${i === currentPage ? 'active' : ''}" onclick="Purchases.changePage(${i})">${i}</button>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                html += `<span class="btn-pagination" style="border: none; cursor: default;">...</span>`;
            }
        }

        html += `
                        <button class="btn-pagination" onclick="Purchases.changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                            Next <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        pageContent.innerHTML = html;

        // Attach event listeners
        attachPurchasesListeners();
    }

    // Attach event listeners
    function attachPurchasesListeners() {
        const searchInput = document.getElementById('purchaseSearchInput');
        const statusFilter = document.getElementById('statusFilter');
        const packageFilter = document.getElementById('packageFilter');

        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    currentSearch = e.target.value;
                    currentPage = 1;
                    renderPurchases();
                }, 300);
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                currentStatusFilter = e.target.value;
                currentPage = 1;
                renderPurchases();
            });
        }

        if (packageFilter) {
            packageFilter.addEventListener('change', (e) => {
                currentPackageFilter = e.target.value;
                currentPage = 1;
                renderPurchases();
            });
        }
    }

    // Public API
    window.Purchases = {
        render: renderPurchases,
        changePage: function(page) {
            const filteredPurchases = getFilteredPurchases();
            const totalPages = Math.ceil(filteredPurchases.length / purchasesPerPage);
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                renderPurchases();
            }
        },
        viewPurchase: function(purchaseId) {
            const purchase = currentPurchases.find(p => p.id === purchaseId);
            if (purchase) {
                alert(`Purchase Details:\n\nLearner: ${purchase.learnerName}\nEmail: ${purchase.learnerEmail}\nPackage: ${purchase.packageName}\nAmount: $${purchase.amount.toFixed(2)}\nStatus: ${purchase.status}\nPayment Method: ${purchase.paymentMethod}\nDate: ${formatDate(purchase.purchaseDate)}`);
            }
        },
        approvePurchase: function(purchaseId) {
            const purchase = currentPurchases.find(p => p.id === purchaseId);
            if (purchase && purchase.status === 'pending') {
                purchase.status = 'completed';
                renderPurchases();
                console.log(`Purchase ${purchaseId} approved`);
            }
        }
    };
})();



