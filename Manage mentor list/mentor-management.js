// Mentor Management Module
(function() {
    'use strict';

    // Mentor management state
    let currentMentors = [];
    let currentPage = 1;
    const mentorsPerPage = 10;
    let currentSearch = '';
    let currentStatusFilter = 'all';
    let currentVerificationFilter = 'all';

    // Format date helper
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Get filtered mentors
    function getFilteredMentors() {
        return currentMentors.filter(mentor => {
            const matchesSearch = !currentSearch || 
                mentor.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                mentor.email.toLowerCase().includes(currentSearch.toLowerCase()) ||
                mentor.skills.some(skill => skill.toLowerCase().includes(currentSearch.toLowerCase()));
            const matchesStatus = currentStatusFilter === 'all' || mentor.status === currentStatusFilter;
            const matchesVerification = currentVerificationFilter === 'all' || 
                (currentVerificationFilter === 'verified' && mentor.verified) ||
                (currentVerificationFilter === 'pending' && !mentor.verified && mentor.status === 'active');
            
            return matchesSearch && matchesStatus && matchesVerification;
        });
    }

    // Render mentor management page
    function renderMentorManagement() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        const filteredMentors = getFilteredMentors();
        const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);
        const startIndex = (currentPage - 1) * mentorsPerPage;
        const endIndex = startIndex + mentorsPerPage;
        const paginatedMentors = filteredMentors.slice(startIndex, endIndex);

        const stats = {
            total: currentMentors.length,
            active: currentMentors.filter(m => m.status === 'active').length,
            verified: currentMentors.filter(m => m.verified).length,
            pending: currentMentors.filter(m => !m.verified && m.status === 'active').length
        };

        let html = `
            <div class="page-container">
                <div class="mentor-management-header">
                    <h2>Mentor Management</h2>
                    <div class="mentor-filters">
                        <div class="mentor-search">
                            <i class="fas fa-search"></i>
                            <input type="text" id="mentorSearchInput" placeholder="Search by name, email or skills..." value="${currentSearch}">
                        </div>
                        <select class="filter-select" id="statusFilter">
                            <option value="all" ${currentStatusFilter === 'all' ? 'selected' : ''}>All Status</option>
                            <option value="active" ${currentStatusFilter === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${currentStatusFilter === 'inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                        <select class="filter-select" id="verificationFilter">
                            <option value="all" ${currentVerificationFilter === 'all' ? 'selected' : ''}>All Verification</option>
                            <option value="verified" ${currentVerificationFilter === 'verified' ? 'selected' : ''}>Verified</option>
                            <option value="pending" ${currentVerificationFilter === 'pending' ? 'selected' : ''}>Pending</option>
                        </select>
                    </div>
                </div>

                <div class="mentor-stats">
                    <div class="mentor-stat-card">
                        <div class="mentor-stat-label">Total Mentors</div>
                        <div class="mentor-stat-value">${stats.total}</div>
                    </div>
                    <div class="mentor-stat-card success">
                        <div class="mentor-stat-label">Active Mentors</div>
                        <div class="mentor-stat-value">${stats.active}</div>
                    </div>
                    <div class="mentor-stat-card">
                        <div class="mentor-stat-label">Verified</div>
                        <div class="mentor-stat-value">${stats.verified}</div>
                    </div>
                    <div class="mentor-stat-card warning">
                        <div class="mentor-stat-label">Pending Verification</div>
                        <div class="mentor-stat-value">${stats.pending}</div>
                    </div>
                </div>

                <div class="mentor-table-container">
        `;

        if (paginatedMentors.length === 0) {
            html += `
                    <div class="empty-state">
                        <i class="fas fa-user-tie"></i>
                        <h3>No mentors found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                `;
        } else {
            html += `
                    <table class="mentor-table">
                        <thead>
                            <tr>
                                <th>Mentor</th>
                                <th>Skills</th>
                                <th>Rating</th>
                                <th>Students</th>
                                <th>Verification</th>
                                <th>Status</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            paginatedMentors.forEach(mentor => {
                const initials = mentor.name.split(' ').map(n => n[0]).join('').toUpperCase();
                const statusClass = mentor.status === 'active' ? 'active' : 'inactive';
                const verificationStatus = mentor.verified ? 'verified' : 'pending';
                const skillsHtml = mentor.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');

                html += `
                            <tr>
                                <td>
                                    <div class="mentor-info">
                                        <div class="mentor-avatar-small">${initials}</div>
                                        <div class="mentor-details">
                                            <div class="mentor-name">${mentor.name}</div>
                                            <div class="mentor-email">${mentor.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="skill-tags">${skillsHtml}</div>
                                </td>
                                <td>
                                    <span class="rating-badge">
                                        <i class="fas fa-star"></i>
                                        ${mentor.rating}
                                    </span>
                                </td>
                                <td>${mentor.students}</td>
                                <td>
                                    <span class="verification-badge ${verificationStatus}">
                                        <i class="fas fa-${mentor.verified ? 'check-circle' : 'clock'}"></i>
                                        ${mentor.verified ? 'Verified' : 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    <span class="status-badge ${statusClass}">
                                        <span class="status-dot"></span>
                                        ${mentor.status}
                                    </span>
                                </td>
                                <td>${formatDate(mentor.joinedDate)}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-action view" onclick="MentorManagement.viewMentor(${mentor.id})" title="View">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-action edit" onclick="MentorManagement.editMentor(${mentor.id})" title="Edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-action ${mentor.verified ? 'delete' : 'edit'}" 
                                                onclick="MentorManagement.${mentor.verified ? 'unverify' : 'verify'}Mentor(${mentor.id})" 
                                                title="${mentor.verified ? 'Unverify' : 'Verify'}">
                                            <i class="fas fa-${mentor.verified ? 'times-circle' : 'check-circle'}"></i>
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

                <div class="pagination">
                    <div class="pagination-info">
                        Showing ${startIndex + 1} to ${Math.min(endIndex, filteredMentors.length)} of ${filteredMentors.length} mentors
                    </div>
                    <div class="pagination-controls">
                        <button class="btn-pagination" onclick="MentorManagement.changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i> Previous
                        </button>
            `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += `<button class="btn-pagination ${i === currentPage ? 'active' : ''}" onclick="MentorManagement.changePage(${i})">${i}</button>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                html += `<span class="btn-pagination" style="border: none; cursor: default;">...</span>`;
            }
        }

        html += `
                        <button class="btn-pagination" onclick="MentorManagement.changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                            Next <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        pageContent.innerHTML = html;

        // Attach event listeners
        attachMentorManagementListeners();
    }

    // Attach event listeners for mentor management
    function attachMentorManagementListeners() {
        const searchInput = document.getElementById('mentorSearchInput');
        const statusFilter = document.getElementById('statusFilter');
        const verificationFilter = document.getElementById('verificationFilter');

        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    currentSearch = e.target.value;
                    currentPage = 1;
                    renderMentorManagement();
                }, 300);
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                currentStatusFilter = e.target.value;
                currentPage = 1;
                renderMentorManagement();
            });
        }

        if (verificationFilter) {
            verificationFilter.addEventListener('change', (e) => {
                currentVerificationFilter = e.target.value;
                currentPage = 1;
                renderMentorManagement();
            });
        }
    }

    // Public API
    window.MentorManagement = {
        render: renderMentorManagement,
        changePage: function(page) {
            const filteredMentors = getFilteredMentors();
            const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                renderMentorManagement();
            }
        },
        viewMentor: function(mentorId) {
            const mentor = currentMentors.find(m => m.id === mentorId);
            if (mentor) {
                alert(`View Mentor Details:\n\nName: ${mentor.name}\nEmail: ${mentor.email}\nSkills: ${mentor.skills.join(', ')}\nRating: ${mentor.rating}\nStudents: ${mentor.students}\nStatus: ${mentor.status}\nVerified: ${mentor.verified ? 'Yes' : 'No'}`);
            }
        },
        editMentor: function(mentorId) {
            const mentor = currentMentors.find(m => m.id === mentorId);
            if (mentor) {
                alert(`Edit Mentor: ${mentor.name}\n\nThis would open an edit form.`);
            }
        },
        verifyMentor: function(mentorId) {
            const mentor = currentMentors.find(m => m.id === mentorId);
            if (mentor) {
                mentor.verified = true;
                renderMentorManagement();
                console.log(`Mentor ${mentorId} verified`);
            }
        },
        unverifyMentor: function(mentorId) {
            const mentor = currentMentors.find(m => m.id === mentorId);
            if (mentor && confirm(`Are you sure you want to unverify mentor "${mentor.name}"?`)) {
                mentor.verified = false;
                renderMentorManagement();
                console.log(`Mentor ${mentorId} unverified`);
            }
        }
    };
})();



