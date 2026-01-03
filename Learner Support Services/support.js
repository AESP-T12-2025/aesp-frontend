// Learner Support Services Module
(function() {
    'use strict';

    // Support management state
    let currentTickets = [];
    let currentPage = 1;
    const ticketsPerPage = 10;
    let currentSearch = '';
    let currentStatusFilter = 'all';
    let currentPriorityFilter = 'all';

    // Format date helper
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Get filtered tickets
    function getFilteredTickets() {
        return currentTickets.filter(ticket => {
            const matchesSearch = !currentSearch || 
                ticket.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
                ticket.learnerName.toLowerCase().includes(currentSearch.toLowerCase()) ||
                ticket.ticketId.toLowerCase().includes(currentSearch.toLowerCase());
            const matchesStatus = currentStatusFilter === 'all' || ticket.status === currentStatusFilter;
            const matchesPriority = currentPriorityFilter === 'all' || ticket.priority === currentPriorityFilter;
            
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }

    // Render support services page
    function renderSupport() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        const filteredTickets = getFilteredTickets();
        const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
        const startIndex = (currentPage - 1) * ticketsPerPage;
        const endIndex = startIndex + ticketsPerPage;
        const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

        const stats = {
            total: currentTickets.length,
            open: currentTickets.filter(t => t.status === 'open').length,
            inProgress: currentTickets.filter(t => t.status === 'in-progress').length,
            resolved: currentTickets.filter(t => t.status === 'resolved').length
        };

        let html = `
            <div class="page-container">
                <div class="support-header">
                    <h2>Learner Support Services</h2>
                    <div class="support-filters">
                        <div class="support-search">
                            <i class="fas fa-search"></i>
                            <input type="text" id="supportSearchInput" placeholder="Search tickets..." value="${currentSearch}">
                        </div>
                        <select class="filter-select" id="statusFilter">
                            <option value="all" ${currentStatusFilter === 'all' ? 'selected' : ''}>All Status</option>
                            <option value="open" ${currentStatusFilter === 'open' ? 'selected' : ''}>Open</option>
                            <option value="in-progress" ${currentStatusFilter === 'in-progress' ? 'selected' : ''}>In Progress</option>
                            <option value="resolved" ${currentStatusFilter === 'resolved' ? 'selected' : ''}>Resolved</option>
                            <option value="closed" ${currentStatusFilter === 'closed' ? 'selected' : ''}>Closed</option>
                        </select>
                        <select class="filter-select" id="priorityFilter">
                            <option value="all" ${currentPriorityFilter === 'all' ? 'selected' : ''}>All Priority</option>
                            <option value="high" ${currentPriorityFilter === 'high' ? 'selected' : ''}>High</option>
                            <option value="medium" ${currentPriorityFilter === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="low" ${currentPriorityFilter === 'low' ? 'selected' : ''}>Low</option>
                        </select>
                    </div>
                </div>

                <div class="support-stats">
                    <div class="support-stat-card">
                        <div class="support-stat-label">Total Tickets</div>
                        <div class="support-stat-value">${stats.total}</div>
                    </div>
                    <div class="support-stat-card danger">
                        <div class="support-stat-label">Open</div>
                        <div class="support-stat-value">${stats.open}</div>
                    </div>
                    <div class="support-stat-card warning">
                        <div class="support-stat-label">In Progress</div>
                        <div class="support-stat-value">${stats.inProgress}</div>
                    </div>
                    <div class="support-stat-card success">
                        <div class="support-stat-label">Resolved</div>
                        <div class="support-stat-value">${stats.resolved}</div>
                    </div>
                </div>

                <div class="support-tickets-container">
        `;

        if (paginatedTickets.length === 0) {
            html += `
                    <div class="empty-state">
                        <i class="fas fa-headset"></i>
                        <h3>No support tickets found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                `;
        } else {
            paginatedTickets.forEach(ticket => {
                html += `
                    <div class="support-ticket">
                        <div class="support-ticket-header">
                            <div>
                                <div class="ticket-id">${ticket.ticketId}</div>
                                <h3 class="ticket-title">${ticket.title}</h3>
                                <div class="ticket-meta">
                                    <div class="ticket-meta-item">
                                        <i class="fas fa-user"></i>
                                        <span>${ticket.learnerName}</span>
                                    </div>
                                    <div class="ticket-meta-item">
                                        <i class="fas fa-calendar"></i>
                                        <span>${formatDate(ticket.createdAt)}</span>
                                    </div>
                                    <div class="ticket-meta-item">
                                        <i class="fas fa-tag"></i>
                                        <span>${ticket.category}</span>
                                    </div>
                                </div>
                            </div>
                            <div style="display: flex; gap: 10px; flex-direction: column; align-items: flex-end;">
                                <span class="ticket-priority ${ticket.priority}">
                                    <i class="fas fa-${ticket.priority === 'high' ? 'exclamation-circle' : ticket.priority === 'medium' ? 'exclamation-triangle' : 'info-circle'}"></i>
                                    ${ticket.priority}
                                </span>
                                <span class="ticket-status ${ticket.status}">
                                    <span class="status-dot"></span>
                                    ${ticket.status}
                                </span>
                            </div>
                        </div>
                        <p class="ticket-description">${ticket.description}</p>
                        <div class="ticket-actions">
                            <button class="btn-action view" onclick="Support.viewTicket(${ticket.id})" title="View">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            ${ticket.status === 'open' ? `
                            <button class="btn-action edit" onclick="Support.assignTicket(${ticket.id})" title="Assign">
                                <i class="fas fa-user-plus"></i> Assign
                            </button>
                            ` : ''}
                            ${ticket.status !== 'resolved' && ticket.status !== 'closed' ? `
                            <button class="btn-action edit" onclick="Support.updateStatus(${ticket.id})" title="Update Status">
                                <i class="fas fa-edit"></i> Update Status
                            </button>
                            ` : ''}
                            ${ticket.status === 'resolved' ? `
                            <button class="btn-action delete" onclick="Support.closeTicket(${ticket.id})" title="Close">
                                <i class="fas fa-times"></i> Close
                            </button>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
        }

        html += `
                </div>

                <div class="pagination">
                    <div class="pagination-info">
                        Showing ${startIndex + 1} to ${Math.min(endIndex, filteredTickets.length)} of ${filteredTickets.length} tickets
                    </div>
                    <div class="pagination-controls">
                        <button class="btn-pagination" onclick="Support.changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i> Previous
                        </button>
            `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += `<button class="btn-pagination ${i === currentPage ? 'active' : ''}" onclick="Support.changePage(${i})">${i}</button>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                html += `<span class="btn-pagination" style="border: none; cursor: default;">...</span>`;
            }
        }

        html += `
                        <button class="btn-pagination" onclick="Support.changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                            Next <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        pageContent.innerHTML = html;

        // Attach event listeners
        attachSupportListeners();
    }

    // Attach event listeners
    function attachSupportListeners() {
        const searchInput = document.getElementById('supportSearchInput');
        const statusFilter = document.getElementById('statusFilter');
        const priorityFilter = document.getElementById('priorityFilter');

        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    currentSearch = e.target.value;
                    currentPage = 1;
                    renderSupport();
                }, 300);
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                currentStatusFilter = e.target.value;
                currentPage = 1;
                renderSupport();
            });
        }

        if (priorityFilter) {
            priorityFilter.addEventListener('change', (e) => {
                currentPriorityFilter = e.target.value;
                currentPage = 1;
                renderSupport();
            });
        }
    }

    // Public API
    window.Support = {
        render: renderSupport,
        changePage: function(page) {
            const filteredTickets = getFilteredTickets();
            const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                renderSupport();
            }
        },
        viewTicket: function(ticketId) {
            const ticket = currentTickets.find(t => t.id === ticketId);
            if (ticket) {
                alert(`Ticket Details:\n\nTicket ID: ${ticket.ticketId}\nLearner: ${ticket.learnerName}\nEmail: ${ticket.learnerEmail}\nTitle: ${ticket.title}\nDescription: ${ticket.description}\nPriority: ${ticket.priority}\nStatus: ${ticket.status}\nCategory: ${ticket.category}\nCreated: ${formatDate(ticket.createdAt)}`);
            }
        },
        assignTicket: function(ticketId) {
            const ticket = currentTickets.find(t => t.id === ticketId);
            if (ticket) {
                const assignee = prompt('Enter assignee name:');
                if (assignee) {
                    ticket.status = 'in-progress';
                    renderSupport();
                    console.log(`Ticket ${ticketId} assigned to ${assignee}`);
                }
            }
        },
        updateStatus: function(ticketId) {
            const ticket = currentTickets.find(t => t.id === ticketId);
            if (ticket) {
                const newStatus = prompt('Enter new status (open, in-progress, resolved):', ticket.status);
                if (newStatus && ['open', 'in-progress', 'resolved'].includes(newStatus)) {
                    ticket.status = newStatus;
                    renderSupport();
                }
            }
        },
        closeTicket: function(ticketId) {
            const ticket = currentTickets.find(t => t.id === ticketId);
            if (ticket && confirm(`Close ticket ${ticket.ticketId}?`)) {
                ticket.status = 'closed';
                renderSupport();
            }
        }
    };
})();



