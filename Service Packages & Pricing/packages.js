// Service Packages & Pricing Module
(function() {
    'use strict';

    // Packages management state
    let currentPackages = [];

    // Render packages page
    function renderPackages() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        let html = `
            <div class="page-container">
                <div class="packages-header">
                    <h2>Service Packages & Pricing</h2>
                    <button class="btn-primary" onclick="Packages.openAddPackageModal()">
                        <i class="fas fa-plus"></i>
                        Add New Package
                    </button>
                </div>

                <div class="packages-grid">
        `;

        if (currentPackages.length === 0) {
            html += `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <i class="fas fa-box"></i>
                        <h3>No packages available</h3>
                        <p>Add your first package to get started</p>
                    </div>
                `;
        } else {
            currentPackages.forEach(pkg => {
                const featuresHtml = pkg.features.map(feature => 
                    `<li><i class="fas fa-check"></i> ${feature}</li>`
                ).join('');

                html += `
                    <div class="package-card ${pkg.featured ? 'featured' : ''}">
                        <div class="package-header">
                            <h3 class="package-name">${pkg.name}</h3>
                            <p class="package-description">${pkg.description}</p>
                        </div>
                        <div class="package-price">
                            <div class="package-price-amount">
                                <span class="package-price-currency">$</span>
                                <span>${pkg.price.toFixed(2)}</span>
                            </div>
                            <div class="package-price-period">per ${pkg.period}</div>
                        </div>
                        <ul class="package-features">
                            ${featuresHtml}
                        </ul>
                        <div class="package-stats">
                            <div class="package-stat">
                                <i class="fas fa-shopping-cart"></i>
                                <span>${pkg.sales} sales</span>
                            </div>
                            <div class="package-stat">
                                <i class="fas fa-dollar-sign"></i>
                                <span>$${pkg.revenue.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="package-actions">
                            <button class="btn-action edit" onclick="Packages.editPackage(${pkg.id})" title="Edit">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-action delete" onclick="Packages.deletePackage(${pkg.id})" title="Delete">
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

            <!-- Add/Edit Package Modal -->
            <div class="modal" id="packageModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">Add New Package</h3>
                        <button class="modal-close" onclick="Packages.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="packageForm" onsubmit="Packages.handleSubmit(event)">
                        <div class="form-group">
                            <label for="packageName">Package Name</label>
                            <input type="text" id="packageName" name="name" required placeholder="e.g., Premium Package">
                        </div>
                        <div class="form-group">
                            <label for="packageDescription">Description</label>
                            <textarea id="packageDescription" name="description" required placeholder="Describe the package..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="packagePrice">Price</label>
                            <input type="number" id="packagePrice" name="price" step="0.01" required placeholder="29.99">
                        </div>
                        <div class="form-group">
                            <label for="packagePeriod">Period</label>
                            <select id="packagePeriod" name="period" required>
                                <option value="month">Per Month</option>
                                <option value="week">Per Week</option>
                                <option value="year">Per Year</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="packageFeatured" name="featured"> Featured Package
                            </label>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="Packages.closeModal()">Cancel</button>
                            <button type="submit" class="btn-primary">Save Package</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        pageContent.innerHTML = html;
    }

    // Public API
    window.Packages = {
        render: renderPackages,
        openAddPackageModal: function() {
            const modal = document.getElementById('packageModal');
            const form = document.getElementById('packageForm');
            const title = document.getElementById('modalTitle');
            if (modal && form && title) {
                form.reset();
                form.dataset.packageId = '';
                title.textContent = 'Add New Package';
                modal.classList.add('active');
            }
        },
        editPackage: function(packageId) {
            const pkg = currentPackages.find(p => p.id === packageId);
            if (!pkg) return;

            const modal = document.getElementById('packageModal');
            const form = document.getElementById('packageForm');
            const title = document.getElementById('modalTitle');
            if (modal && form && title) {
                document.getElementById('packageName').value = pkg.name;
                document.getElementById('packageDescription').value = pkg.description;
                document.getElementById('packagePrice').value = pkg.price;
                document.getElementById('packagePeriod').value = pkg.period;
                document.getElementById('packageFeatured').checked = pkg.featured;
                form.dataset.packageId = packageId;
                title.textContent = 'Edit Package';
                modal.classList.add('active');
            }
        },
        deletePackage: function(packageId) {
            const pkg = currentPackages.find(p => p.id === packageId);
            if (pkg && confirm(`Are you sure you want to delete "${pkg.name}"?`)) {
                currentPackages = currentPackages.filter(p => p.id !== packageId);
                renderPackages();
                console.log(`Package ${packageId} deleted`);
            }
        },
        closeModal: function() {
            const modal = document.getElementById('packageModal');
            if (modal) {
                modal.classList.remove('active');
            }
        },
        handleSubmit: function(event) {
            event.preventDefault();
            const form = event.target;
            const packageId = form.dataset.packageId;
            const formData = new FormData(form);
            
            const packageData = {
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                period: formData.get('period'),
                featured: formData.get('featured') === 'on',
                features: [],
                sales: 0,
                revenue: 0
            };

            if (packageId) {
                // Edit existing package
                const index = currentPackages.findIndex(p => p.id === parseInt(packageId));
                if (index !== -1) {
                    currentPackages[index] = { ...currentPackages[index], ...packageData };
                }
            } else {
                // Add new package
                const newId = Math.max(...currentPackages.map(p => p.id), 0) + 1;
                currentPackages.push({ id: newId, ...packageData });
            }

            this.closeModal();
            renderPackages();
        }
    };

    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('packageModal');
        if (modal && event.target === modal) {
            window.Packages.closeModal();
        }
    });
})();



