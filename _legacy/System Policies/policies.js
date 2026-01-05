// System Policies Module
(function() {
    'use strict';

    // Policies management state
    let currentPolicies = [];

    // Format date helper
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Render policies page
    function renderPolicies() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        let html = `
            <div class="page-container">
                <div class="policies-header">
                    <h2>System Policies</h2>
                    <button class="btn-primary" onclick="Policies.openAddPolicyModal()">
                        <i class="fas fa-plus"></i>
                        Add New Policy
                    </button>
                </div>

                <div class="policies-grid">
        `;

        if (currentPolicies.length === 0) {
            html += `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <i class="fas fa-file-contract"></i>
                        <h3>No policies available</h3>
                        <p>Add your first policy to get started</p>
                    </div>
                `;
        } else {
            currentPolicies.forEach(policy => {
                const statusClass = policy.status === 'active' ? 'active' : 'inactive';
                const contentPreview = policy.content.length > 200 ? policy.content.substring(0, 200) + '...' : policy.content;

                html += `
                    <div class="policy-card">
                        <div class="policy-card-header">
                            <div style="flex: 1;">
                                <h3 class="policy-title">${policy.title}</h3>
                            </div>
                            <div class="policy-icon">
                                <i class="fas fa-${policy.icon}"></i>
                            </div>
                        </div>
                        <p class="policy-description">${policy.description}</p>
                        <div class="policy-content-preview">${contentPreview}</div>
                        <div class="policy-meta">
                            <div class="policy-meta-item">
                                <i class="fas fa-tag"></i>
                                <span>${policy.category}</span>
                            </div>
                            <div class="policy-meta-item">
                                <i class="fas fa-calendar"></i>
                                <span>Updated: ${formatDate(policy.lastUpdated)}</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <span class="policy-status ${statusClass}">
                                <span class="status-dot"></span>
                                ${policy.status}
                            </span>
                        </div>
                        <div class="policy-actions">
                            <button class="btn-action view" onclick="Policies.viewPolicy(${policy.id})" title="View">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="btn-action edit" onclick="Policies.editPolicy(${policy.id})" title="Edit">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-action ${policy.status === 'active' ? 'delete' : 'edit'}" 
                                    onclick="Policies.toggleStatus(${policy.id})" 
                                    title="${policy.status === 'active' ? 'Deactivate' : 'Activate'}">
                                <i class="fas fa-${policy.status === 'active' ? 'toggle-off' : 'toggle-on'}"></i>
                                ${policy.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button class="btn-action delete" onclick="Policies.deletePolicy(${policy.id})" title="Delete">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `;
            });
        }

        html += `
                </div>
            </div>

            <!-- Add/Edit Policy Modal -->
            <div class="modal" id="policyModal">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h3 id="modalTitle">Add New Policy</h3>
                        <button class="modal-close" onclick="Policies.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="policyForm" onsubmit="Policies.handleSubmit(event)">
                        <div class="form-group">
                            <label for="policyTitle">Policy Title</label>
                            <input type="text" id="policyTitle" name="title" required placeholder="e.g., Privacy Policy">
                        </div>
                        <div class="form-group">
                            <label for="policyDescription">Description</label>
                            <textarea id="policyDescription" name="description" required placeholder="Brief description..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="policyContent">Content</label>
                            <textarea id="policyContent" name="content" required placeholder="Full policy content..." style="min-height: 200px;"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="policyCategory">Category</label>
                            <select id="policyCategory" name="category" required>
                                <option value="Legal">Legal</option>
                                <option value="Billing">Billing</option>
                                <option value="Community">Community</option>
                                <option value="Technical">Technical</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="policyIcon">Icon (Font Awesome class)</label>
                            <input type="text" id="policyIcon" name="icon" required placeholder="e.g., shield-alt" value="file-contract">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="Policies.closeModal()">Cancel</button>
                            <button type="submit" class="btn-primary">Save Policy</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        pageContent.innerHTML = html;
    }

    // Public API
    window.Policies = {
        render: renderPolicies,
        openAddPolicyModal: function() {
            const modal = document.getElementById('policyModal');
            const form = document.getElementById('policyForm');
            const title = document.getElementById('modalTitle');
            if (modal && form && title) {
                form.reset();
                form.dataset.policyId = '';
                title.textContent = 'Add New Policy';
                modal.classList.add('active');
            }
        },
        viewPolicy: function(policyId) {
            const policy = currentPolicies.find(p => p.id === policyId);
            if (policy) {
                alert(`Policy Details:\n\nTitle: ${policy.title}\nDescription: ${policy.description}\nCategory: ${policy.category}\nStatus: ${policy.status}\nLast Updated: ${formatDate(policy.lastUpdated)}\n\nContent:\n${policy.content}`);
            }
        },
        editPolicy: function(policyId) {
            const policy = currentPolicies.find(p => p.id === policyId);
            if (!policy) return;

            const modal = document.getElementById('policyModal');
            const form = document.getElementById('policyForm');
            const title = document.getElementById('modalTitle');
            if (modal && form && title) {
                document.getElementById('policyTitle').value = policy.title;
                document.getElementById('policyDescription').value = policy.description;
                document.getElementById('policyContent').value = policy.content;
                document.getElementById('policyCategory').value = policy.category;
                document.getElementById('policyIcon').value = policy.icon;
                form.dataset.policyId = policyId;
                title.textContent = 'Edit Policy';
                modal.classList.add('active');
            }
        },
        toggleStatus: function(policyId) {
            const policy = currentPolicies.find(p => p.id === policyId);
            if (policy) {
                policy.status = policy.status === 'active' ? 'inactive' : 'active';
                policy.lastUpdated = new Date().toISOString().split('T')[0];
                renderPolicies();
                console.log(`Policy ${policyId} status changed to ${policy.status}`);
            }
        },
        deletePolicy: function(policyId) {
            const policy = currentPolicies.find(p => p.id === policyId);
            if (policy && confirm(`Are you sure you want to delete "${policy.title}"?`)) {
                currentPolicies = currentPolicies.filter(p => p.id !== policyId);
                renderPolicies();
                console.log(`Policy ${policyId} deleted`);
            }
        },
        closeModal: function() {
            const modal = document.getElementById('policyModal');
            if (modal) {
                modal.classList.remove('active');
            }
        },
        handleSubmit: function(event) {
            event.preventDefault();
            const form = event.target;
            const policyId = form.dataset.policyId;
            const formData = new FormData(form);
            
            const policyData = {
                title: formData.get('title'),
                description: formData.get('description'),
                content: formData.get('content'),
                category: formData.get('category'),
                icon: formData.get('icon'),
                status: 'active',
                lastUpdated: new Date().toISOString().split('T')[0]
            };

            if (policyId) {
                // Edit existing policy
                const index = currentPolicies.findIndex(p => p.id === parseInt(policyId));
                if (index !== -1) {
                    currentPolicies[index] = { ...currentPolicies[index], ...policyData };
                }
            } else {
                // Add new policy
                const newId = Math.max(...currentPolicies.map(p => p.id), 0) + 1;
                currentPolicies.push({ id: newId, ...policyData });
            }

            this.closeModal();
            renderPolicies();
        }
    };

    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('policyModal');
        if (modal && event.target === modal) {
            window.Policies.closeModal();
        }
    });
})();



