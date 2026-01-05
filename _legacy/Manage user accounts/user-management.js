// User Management Module
(function() {
    'use strict';

    // User management state
    let currentUsers = [];
    let currentPage = 1;
    const usersPerPage = 10;
    let currentRoleFilter = 'all';
    let currentStatusFilter = 'all';
    let currentSearch = '';

    // Format date helper
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Get filtered users
    function getFilteredUsers() {
        return currentUsers.filter(user => {
            const matchesSearch = !currentSearch || 
                user.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                user.email.toLowerCase().includes(currentSearch.toLowerCase());
            const matchesRole = currentRoleFilter === 'all' || user.role === currentRoleFilter;
            const matchesStatus = currentStatusFilter === 'all' || user.status === currentStatusFilter;
            
            return matchesSearch && matchesRole && matchesStatus;
        });
    }

    // Render user management page
    function renderUserManagement() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        const filteredUsers = getFilteredUsers();
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        const stats = {
            total: currentUsers.length,
            active: currentUsers.filter(u => u.status === 'active').length,
            inactive: currentUsers.filter(u => u.status === 'inactive').length,
            learners: currentUsers.filter(u => u.role === 'learner').length,
            mentors: currentUsers.filter(u => u.role === 'mentor').length
        };

        let html = `
            <div class="page-container">
                <div class="user-management-header">
                    <h2>User Management</h2>
                    <div class="user-filters">
                        <div class="user-search">
                            <i class="fas fa-search"></i>
                            <input type="text" id="userSearchInput" placeholder="Search by name or email..." value="${currentSearch}">
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
                            <option value="inactive" ${currentStatusFilter === 'inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                </div>

                <div class="user-stats">
                    <div class="user-stat-card">
                        <div class="user-stat-label">Total Users</div>
                        <div class="user-stat-value">${stats.total}</div>
                    </div>
                    <div class="user-stat-card success">
                        <div class="user-stat-label">Active Users</div>
                        <div class="user-stat-value">${stats.active}</div>
                    </div>
                    <div class="user-stat-card warning">
                        <div class="user-stat-label">Inactive Users</div>
                        <div class="user-stat-value">${stats.inactive}</div>
                    </div>
                    <div class="user-stat-card">
                        <div class="user-stat-label">Learners</div>
                        <div class="user-stat-value">${stats.learners}</div>
                    </div>
                    <div class="user-stat-card">
                        <div class="user-stat-label">Mentors</div>
                        <div class="user-stat-value">${stats.mentors}</div>
                    </div>
                </div>

                <div class="user-table-container">
        `;

        if (paginatedUsers.length === 0) {
            html += `
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>No users found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                `;
        } else {
            html += `
                    <table class="user-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Registered Date</th>
                                <th>Actions</th>
                                <th>Enable/Disable</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            paginatedUsers.forEach(user => {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                const statusClass = user.status === 'active' ? 'active' : 'inactive';
                const roleClass = user.role;

                html += `
                            <tr>
                                <td>
                                    <div class="user-info">
                                        <div class="user-avatar-small">${initials}</div>
                                        <div class="user-details">
                                            <div class="user-name">${user.name}</div>
                                            <div class="user-email">${user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="role-badge ${roleClass}">${user.role}</span>
                                </td>
                                <td>
                                    <span class="status-badge ${statusClass}">
                                        <span class="status-dot"></span>
                                        ${user.status}
                                    </span>
                                </td>
                                <td>${formatDate(user.registeredDate)}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-action view" onclick="UserManagement.viewUser(${user.id})" title="View">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-action edit" onclick="UserManagement.editUser(${user.id})" title="Edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-action delete" onclick="UserManagement.deleteUser(${user.id})" title="Delete">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <label class="toggle-switch">
                                        <input type="checkbox" ${user.status === 'active' ? 'checked' : ''} 
                                               onchange="UserManagement.toggleUserStatus(${user.id}, this.checked)">
                                        <span class="toggle-slider"></span>
                                    </label>
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
                        Showing ${startIndex + 1} to ${Math.min(endIndex, filteredUsers.length)} of ${filteredUsers.length} users
                    </div>
                    <div class="pagination-controls">
                        <button class="btn-pagination" onclick="UserManagement.changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i> Previous
                        </button>
            `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += `<button class="btn-pagination ${i === currentPage ? 'active' : ''}" onclick="UserManagement.changePage(${i})">${i}</button>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                html += `<span class="btn-pagination" style="border: none; cursor: default;">...</span>`;
            }
        }

        html += `
                        <button class="btn-pagination" onclick="UserManagement.changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                            Next <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        pageContent.innerHTML = html;

        // Attach event listeners
        attachUserManagementListeners();
    }

    // Attach event listeners for user management
    function attachUserManagementListeners() {
        const searchInput = document.getElementById('userSearchInput');
        const roleFilter = document.getElementById('roleFilter');
        const statusFilter = document.getElementById('statusFilter');

        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    currentSearch = e.target.value;
                    currentPage = 1;
                    renderUserManagement();
                }, 300);
            });
        }

        if (roleFilter) {
            roleFilter.addEventListener('change', (e) => {
                currentRoleFilter = e.target.value;
                currentPage = 1;
                renderUserManagement();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                currentStatusFilter = e.target.value;
                currentPage = 1;
                renderUserManagement();
            });
        }
    }

    // Public API
    window.UserManagement = {
        render: renderUserManagement,
        changePage: function(page) {
            const filteredUsers = getFilteredUsers();
            const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                renderUserManagement();
            }
        },
        toggleUserStatus: function(userId, isActive) {
            const user = currentUsers.find(u => u.id === userId);
            if (user) {
                user.status = isActive ? 'active' : 'inactive';
                renderUserManagement();
                // Here you would typically make an API call to update the user status
                console.log(`User ${userId} status changed to ${user.status}`);
            }
        },
        viewUser: function(userId) {
            const user = currentUsers.find(u => u.id === userId);
            if (user) {
                alert(`View User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.status}\nRegistered: ${formatDate(user.registeredDate)}`);
                // Here you would typically open a modal or navigate to user details page
            }
        },
        editUser: function(userId) {
            const user = currentUsers.find(u => u.id === userId);
            if (user) {
                alert(`Edit User: ${user.name}\n\nThis would open an edit form.`);
                // Here you would typically open an edit modal or form
            }
        },
        deleteUser: function(userId) {
            const user = currentUsers.find(u => u.id === userId);
            if (user && confirm(`Are you sure you want to delete user "${user.name}"?`)) {
                currentUsers = currentUsers.filter(u => u.id !== userId);
                renderUserManagement();
                // Here you would typically make an API call to delete the user
                console.log(`User ${userId} deleted`);
            }
        }
    };
})();
