// Enable/Disable Account Module
(function() {
    'use strict';

    // Account management state
    let currentAccounts = [];
    let currentPage = 1;
    const accountsPerPage = 10;
    let currentSearch = '';
    let currentRoleFilter = 'all';
    let currentStatusFilter = 'all';
    let selectedAccounts = new Set();

    // Format date helper
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Get filtered accounts
    function getFilteredAccounts() {
        return currentAccounts.filter(account => {
            const matchesSearch = !currentSearch || 
                account.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                account.email.toLowerCase().includes(currentSearch.toLowerCase());
            const matchesRole = currentRoleFilter === 'all' || account.role === currentRoleFilter;
            const matchesStatus = currentStatusFilter === 'all' || account.status === currentStatusFilter;
            
            return matchesSearch && matchesRole && matchesStatus;
        });
    }

    // Render enable/disable account page
    function renderEnableDisable() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        const filteredAccounts = getFilteredAccounts();
        const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
        const startIndex = (currentPage - 1) * accountsPerPage;
        const endIndex = startIndex + accountsPerPage;
        const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

        const stats = {
            total: currentAccounts.length,
            active: currentAccounts.filter(a => a.status === 'active').length,
            disabled: currentAccounts.filter(a => a.status === 'disabled').length
        };

        let html = `
            <div class="page-container">
                <div class="enable-disable-header">
                    <h2>Enable/Disable Accounts</h2>
                    <div class="account-filters">
                        <div class="account-search">
                            <i class="fas fa-search"></i>
                            <input type="text" id="accountSearchInput" placeholder="Search by name or email..." value="${currentSearch}">
                        </div>
                        <select class="filter-select" id="roleFilter">
                            <option value="all" ${currentRoleFilter === 'all' ? 'selected' : ''}>All Roles</option>
                            <option value="learner" ${currentRoleFilter === 'learner' ? 'selected' : ''}>Learners</option>
                            <option value="mentor" ${currentRoleFilter === 'mentor' ? 'selected' : ''}>Mentors</option>
                            <option value="admin" ${currentRoleFilter === 'admin' ? 'selected' : ''}>Admins</option>
                        </select>
                        <select class="filter-select" id="statusFilter">
                            <option value="all" ${currentStatusFilter === 'all' ? 'selected' : ''}>All Status</option>
                            <option value="active" ${currentStatusFilter === 'active' ? 'selected' : ''}>Active</option>
                            <option value="disabled" ${currentStatusFilter === 'disabled' ? 'selected' : ''}>Disabled</option>
                        </select>
                    </div>
                </div>

                <div class="account-stats">
                    <div class="account-stat-card">
                        <div class="account-stat-label">Total Accounts</div>
                        <div class="account-stat-value">${stats.total}</div>
                    </div>
                    <div class="account-stat-card success">
                        <div class="account-stat-label">Active Accounts</div>
                        <div class="account-stat-value">${stats.active}</div>
                    </div>
                    <div class="account-stat-card danger">
                        <div class="account-stat-label">Disabled Accounts</div>
                        <div class="account-stat-value">${stats.disabled}</div>
                    </div>
                </div>

                ${selectedAccounts.size > 0 ? `
                <div class="bulk-actions">
                    <div class="bulk-actions-info">
                        ${selectedAccounts.size} account(s) selected
                    </div>
                    <div class="bulk-actions-buttons">
                        <button class="btn-bulk enable" onclick="EnableDisable.bulkEnable()">
                            <i class="fas fa-check"></i> Enable Selected
                        </button>
                        <button class="btn-bulk disable" onclick="EnableDisable.bulkDisable()">
                            <i class="fas fa-times"></i> Disable Selected
                        </button>
                        <button class="btn-secondary" onclick="EnableDisable.clearSelection()">
                            Clear Selection
                        </button>
                    </div>
                </div>
                ` : ''}

                <div class="account-table-container">
        `;

        if (paginatedAccounts.length === 0) {
            html += `
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>No accounts found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                `;
        } else {
            html += `
                    <table class="account-table">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" id="selectAll" onchange="EnableDisable.toggleSelectAll(this.checked)">
                                </th>
                                <th>Account</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Registered Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            paginatedAccounts.forEach(account => {
                const initials = account.name.split(' ').map(n => n[0]).join('').toUpperCase();
                const statusClass = account.status === 'active' ? 'active' : 'inactive';
                const roleClass = account.role;
                const isSelected = selectedAccounts.has(account.id);

                html += `
                            <tr>
                                <td>
                                    <input type="checkbox" ${isSelected ? 'checked' : ''} 
                                           onchange="EnableDisable.toggleAccountSelection(${account.id}, this.checked)">
                                </td>
                                <td>
                                    <div class="account-info">
                                        <div class="account-avatar-small">${initials}</div>
                                        <div class="account-details">
                                            <div class="account-name">${account.name}</div>
                                            <div class="account-email">${account.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="role-badge ${roleClass}">${account.role}</span>
                                </td>
                                <td>
                                    <span class="status-badge ${statusClass}">
                                        <span class="status-dot"></span>
                                        ${account.status}
                                    </span>
                                </td>
                                <td>${formatDate(account.registeredDate)}</td>
                                <td>
                                    <div class="status-toggle-container">
                                        <span class="status-label">${account.status === 'active' ? 'Disable' : 'Enable'}</span>
                                        <label class="toggle-switch">
                                            <input type="checkbox" ${account.status === 'active' ? 'checked' : ''} 
                                                   onchange="EnableDisable.toggleAccountStatus(${account.id}, this.checked)">
                                            <span class="toggle-slider"></span>
                                        </label>
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
                        Showing ${startIndex + 1} to ${Math.min(endIndex, filteredAccounts.length)} of ${filteredAccounts.length} accounts
                    </div>
                    <div class="pagination-controls">
                        <button class="btn-pagination" onclick="EnableDisable.changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i> Previous
                        </button>
            `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += `<button class="btn-pagination ${i === currentPage ? 'active' : ''}" onclick="EnableDisable.changePage(${i})">${i}</button>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                html += `<span class="btn-pagination" style="border: none; cursor: default;">...</span>`;
            }
        }

        html += `
                        <button class="btn-pagination" onclick="EnableDisable.changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                            Next <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        pageContent.innerHTML = html;

        // Attach event listeners
        attachEnableDisableListeners();
    }

    // Attach event listeners
    function attachEnableDisableListeners() {
        const searchInput = document.getElementById('accountSearchInput');
        const roleFilter = document.getElementById('roleFilter');
        const statusFilter = document.getElementById('statusFilter');

        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    currentSearch = e.target.value;
                    currentPage = 1;
                    renderEnableDisable();
                }, 300);
            });
        }

        if (roleFilter) {
            roleFilter.addEventListener('change', (e) => {
                currentRoleFilter = e.target.value;
                currentPage = 1;
                renderEnableDisable();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                currentStatusFilter = e.target.value;
                currentPage = 1;
                renderEnableDisable();
            });
        }
    }

    // Public API
    window.EnableDisable = {
        render: renderEnableDisable,
        changePage: function(page) {
            const filteredAccounts = getFilteredAccounts();
            const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                renderEnableDisable();
            }
        },
        toggleAccountStatus: function(accountId, isActive) {
            const account = currentAccounts.find(a => a.id === accountId);
            if (account) {
                account.status = isActive ? 'active' : 'disabled';
                renderEnableDisable();
                console.log(`Account ${accountId} status changed to ${account.status}`);
            }
        },
        toggleAccountSelection: function(accountId, isSelected) {
            if (isSelected) {
                selectedAccounts.add(accountId);
            } else {
                selectedAccounts.delete(accountId);
            }
            renderEnableDisable();
        },
        toggleSelectAll: function(isSelected) {
            const filteredAccounts = getFilteredAccounts();
            const startIndex = (currentPage - 1) * accountsPerPage;
            const endIndex = startIndex + accountsPerPage;
            const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

            if (isSelected) {
                paginatedAccounts.forEach(account => selectedAccounts.add(account.id));
            } else {
                paginatedAccounts.forEach(account => selectedAccounts.delete(account.id));
            }
            renderEnableDisable();
        },
        clearSelection: function() {
            selectedAccounts.clear();
            renderEnableDisable();
        },
        bulkEnable: function() {
            if (selectedAccounts.size === 0) return;
            if (confirm(`Enable ${selectedAccounts.size} selected account(s)?`)) {
                selectedAccounts.forEach(id => {
                    const account = currentAccounts.find(a => a.id === id);
                    if (account) account.status = 'active';
                });
                selectedAccounts.clear();
                renderEnableDisable();
            }
        },
        bulkDisable: function() {
            if (selectedAccounts.size === 0) return;
            if (confirm(`Disable ${selectedAccounts.size} selected account(s)?`)) {
                selectedAccounts.forEach(id => {
                    const account = currentAccounts.find(a => a.id === id);
                    if (account) account.status = 'disabled';
                });
                selectedAccounts.clear();
                renderEnableDisable();
            }
        }
    };
})();



