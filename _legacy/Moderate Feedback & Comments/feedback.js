// Moderate Feedback & Comments Module
(function() {
    'use strict';

    // Feedback management state
    let currentFeedback = [];
    let currentPage = 1;
    const feedbackPerPage = 10;
    let currentSearch = '';
    let currentStatusFilter = 'all';
    let currentTypeFilter = 'all';

    // Format date helper
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Get filtered feedback
    function getFilteredFeedback() {
        return currentFeedback.filter(item => {
            const matchesSearch = !currentSearch || 
                item.content.toLowerCase().includes(currentSearch.toLowerCase()) ||
                item.authorName.toLowerCase().includes(currentSearch.toLowerCase());
            const matchesStatus = currentStatusFilter === 'all' || item.status === currentStatusFilter;
            const matchesType = currentTypeFilter === 'all' || item.type === currentTypeFilter;
            
            return matchesSearch && matchesStatus && matchesType;
        });
    }

    // Render feedback page
    function renderFeedback() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        const filteredFeedback = getFilteredFeedback();
        const totalPages = Math.ceil(filteredFeedback.length / feedbackPerPage);
        const startIndex = (currentPage - 1) * feedbackPerPage;
        const endIndex = startIndex + feedbackPerPage;
        const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex);

        const stats = {
            total: currentFeedback.length,
            pending: currentFeedback.filter(f => f.status === 'pending').length,
            approved: currentFeedback.filter(f => f.status === 'approved').length,
            rejected: currentFeedback.filter(f => f.status === 'rejected').length
        };

        let html = `
            <div class="page-container">
                <div class="feedback-header">
                    <h2>Moderate Feedback & Comments</h2>
                    <div class="feedback-filters">
                        <div class="feedback-search">
                            <i class="fas fa-search"></i>
                            <input type="text" id="feedbackSearchInput" placeholder="Search feedback..." value="${currentSearch}">
                        </div>
                        <select class="filter-select" id="statusFilter">
                            <option value="all" ${currentStatusFilter === 'all' ? 'selected' : ''}>All Status</option>
                            <option value="pending" ${currentStatusFilter === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="approved" ${currentStatusFilter === 'approved' ? 'selected' : ''}>Approved</option>
                            <option value="rejected" ${currentStatusFilter === 'rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                        <select class="filter-select" id="typeFilter">
                            <option value="all" ${currentTypeFilter === 'all' ? 'selected' : ''}>All Types</option>
                            <option value="feedback" ${currentTypeFilter === 'feedback' ? 'selected' : ''}>Feedback</option>
                            <option value="comment" ${currentTypeFilter === 'comment' ? 'selected' : ''}>Comments</option>
                        </select>
                    </div>
                </div>

                <div class="feedback-stats">
                    <div class="feedback-stat-card">
                        <div class="feedback-stat-label">Total Items</div>
                        <div class="feedback-stat-value">${stats.total}</div>
                    </div>
                    <div class="feedback-stat-card warning">
                        <div class="feedback-stat-label">Pending Review</div>
                        <div class="feedback-stat-value">${stats.pending}</div>
                    </div>
                    <div class="feedback-stat-card success">
                        <div class="feedback-stat-label">Approved</div>
                        <div class="feedback-stat-value">${stats.approved}</div>
                    </div>
                    <div class="feedback-stat-card danger">
                        <div class="feedback-stat-label">Rejected</div>
                        <div class="feedback-stat-value">${stats.rejected}</div>
                    </div>
                </div>

                <div class="feedback-items-container">
        `;

        if (paginatedFeedback.length === 0) {
            html += `
                    <div class="empty-state">
                        <i class="fas fa-comments"></i>
                        <h3>No feedback found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                `;
        } else {
            paginatedFeedback.forEach(item => {
                const initials = item.authorName.split(' ').map(n => n[0]).join('').toUpperCase();
                const stars = Array.from({ length: 5 }, (_, i) => 
                    i < item.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
                ).join('');

                html += `
                    <div class="feedback-item ${item.status}">
                        <div class="feedback-item-header">
                            <div>
                                <div class="feedback-author">
                                    <div class="feedback-author-avatar">${initials}</div>
                                    <div class="feedback-author-info">
                                        <div class="feedback-author-name">${item.authorName}</div>
                                        <div class="feedback-date">${formatDate(item.createdAt)}</div>
                                        <div class="feedback-rating">${stars}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span class="moderation-status ${item.status}">
                                    <i class="fas fa-${item.status === 'approved' ? 'check-circle' : item.status === 'rejected' ? 'times-circle' : 'clock'}"></i>
                                    ${item.status}
                                </span>
                            </div>
                        </div>
                        <div class="feedback-content">
                            ${item.content}
                        </div>
                        <div class="feedback-actions">
                            ${item.status === 'pending' ? `
                            <button class="btn-action edit" onclick="Feedback.approve(${item.id})" title="Approve">
                                <i class="fas fa-check"></i> Approve
                            </button>
                            <button class="btn-action delete" onclick="Feedback.reject(${item.id})" title="Reject">
                                <i class="fas fa-times"></i> Reject
                            </button>
                            ` : ''}
                            ${item.status === 'approved' ? `
                            <button class="btn-action delete" onclick="Feedback.reject(${item.id})" title="Reject">
                                <i class="fas fa-times"></i> Reject
                            </button>
                            ` : ''}
                            ${item.status === 'rejected' ? `
                            <button class="btn-action edit" onclick="Feedback.approve(${item.id})" title="Approve">
                                <i class="fas fa-check"></i> Approve
                            </button>
                            ` : ''}
                            <button class="btn-action delete" onclick="Feedback.delete(${item.id})" title="Delete">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `;
            });
        }

        html += `
                </div>

                <div class="pagination">
                    <div class="pagination-info">
                        Showing ${startIndex + 1} to ${Math.min(endIndex, filteredFeedback.length)} of ${filteredFeedback.length} items
                    </div>
                    <div class="pagination-controls">
                        <button class="btn-pagination" onclick="Feedback.changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i> Previous
                        </button>
            `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += `<button class="btn-pagination ${i === currentPage ? 'active' : ''}" onclick="Feedback.changePage(${i})">${i}</button>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                html += `<span class="btn-pagination" style="border: none; cursor: default;">...</span>`;
            }
        }

        html += `
                        <button class="btn-pagination" onclick="Feedback.changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                            Next <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        pageContent.innerHTML = html;

        // Attach event listeners
        attachFeedbackListeners();
    }

    // Attach event listeners
    function attachFeedbackListeners() {
        const searchInput = document.getElementById('feedbackSearchInput');
        const statusFilter = document.getElementById('statusFilter');
        const typeFilter = document.getElementById('typeFilter');

        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    currentSearch = e.target.value;
                    currentPage = 1;
                    renderFeedback();
                }, 300);
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                currentStatusFilter = e.target.value;
                currentPage = 1;
                renderFeedback();
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                currentTypeFilter = e.target.value;
                currentPage = 1;
                renderFeedback();
            });
        }
    }

    // Public API
    window.Feedback = {
        render: renderFeedback,
        changePage: function(page) {
            const filteredFeedback = getFilteredFeedback();
            const totalPages = Math.ceil(filteredFeedback.length / feedbackPerPage);
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                renderFeedback();
            }
        },
        approve: function(feedbackId) {
            const item = currentFeedback.find(f => f.id === feedbackId);
            if (item) {
                item.status = 'approved';
                renderFeedback();
                console.log(`Feedback ${feedbackId} approved`);
            }
        },
        reject: function(feedbackId) {
            const item = currentFeedback.find(f => f.id === feedbackId);
            if (item) {
                item.status = 'rejected';
                renderFeedback();
                console.log(`Feedback ${feedbackId} rejected`);
            }
        },
        delete: function(feedbackId) {
            const item = currentFeedback.find(f => f.id === feedbackId);
            if (item && confirm(`Are you sure you want to delete this ${item.type}?`)) {
                currentFeedback = currentFeedback.filter(f => f.id !== feedbackId);
                renderFeedback();
                console.log(`Feedback ${feedbackId} deleted`);
            }
        }
    };
})();



