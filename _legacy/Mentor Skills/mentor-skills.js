// Mentor Skills Module
(function() {
    'use strict';

    // Skills management state
    let currentSkills = [];

    // Render mentor skills page
    function renderMentorSkills() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        let html = `
            <div class="page-container">
                <div class="mentor-skills-header">
                    <h2>Mentor Skills</h2>
                    <button class="btn-primary" onclick="MentorSkills.openAddSkillModal()">
                        <i class="fas fa-plus"></i>
                        Add New Skill
                    </button>
                </div>

                <div class="skills-grid">
        `;

        if (currentSkills.length === 0) {
            html += `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <i class="fas fa-star"></i>
                        <h3>No skills available</h3>
                        <p>Add your first skill to get started</p>
                    </div>
                `;
        } else {
            currentSkills.forEach(skill => {
                html += `
                    <div class="skill-card">
                        <div class="skill-card-header">
                            <div>
                                <h3 class="skill-title">${skill.name}</h3>
                            </div>
                            <div class="skill-icon">
                                <i class="fas fa-${skill.icon}"></i>
                            </div>
                        </div>
                        <p class="skill-description">${skill.description}</p>
                        <div class="skill-stats">
                            <div class="skill-stat">
                                <div class="skill-stat-label">Mentors</div>
                                <div class="skill-stat-value">${skill.mentors}</div>
                            </div>
                            <div class="skill-stat">
                                <div class="skill-stat-label">Learners</div>
                                <div class="skill-stat-value">${skill.learners}</div>
                            </div>
                        </div>
                        <div class="skill-actions">
                            <button class="btn-action edit" onclick="MentorSkills.editSkill(${skill.id})" title="Edit">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-action delete" onclick="MentorSkills.deleteSkill(${skill.id})" title="Delete">
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

            <!-- Add/Edit Skill Modal -->
            <div class="modal" id="skillModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">Add New Skill</h3>
                        <button class="modal-close" onclick="MentorSkills.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="skillForm" onsubmit="MentorSkills.handleSubmit(event)">
                        <div class="form-group">
                            <label for="skillName">Skill Name</label>
                            <input type="text" id="skillName" name="name" required placeholder="e.g., Business English">
                        </div>
                        <div class="form-group">
                            <label for="skillDescription">Description</label>
                            <textarea id="skillDescription" name="description" required placeholder="Describe the skill..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="skillIcon">Icon (Font Awesome class)</label>
                            <input type="text" id="skillIcon" name="icon" required placeholder="e.g., briefcase" value="star">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="MentorSkills.closeModal()">Cancel</button>
                            <button type="submit" class="btn-primary">Save Skill</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        pageContent.innerHTML = html;
    }

    // Public API
    window.MentorSkills = {
        render: renderMentorSkills,
        openAddSkillModal: function() {
            const modal = document.getElementById('skillModal');
            const form = document.getElementById('skillForm');
            const title = document.getElementById('modalTitle');
            if (modal && form && title) {
                form.reset();
                form.dataset.skillId = '';
                title.textContent = 'Add New Skill';
                modal.classList.add('active');
            }
        },
        editSkill: function(skillId) {
            const skill = currentSkills.find(s => s.id === skillId);
            if (!skill) return;

            const modal = document.getElementById('skillModal');
            const form = document.getElementById('skillForm');
            const title = document.getElementById('modalTitle');
            if (modal && form && title) {
                document.getElementById('skillName').value = skill.name;
                document.getElementById('skillDescription').value = skill.description;
                document.getElementById('skillIcon').value = skill.icon;
                form.dataset.skillId = skillId;
                title.textContent = 'Edit Skill';
                modal.classList.add('active');
            }
        },
        deleteSkill: function(skillId) {
            const skill = currentSkills.find(s => s.id === skillId);
            if (skill && confirm(`Are you sure you want to delete "${skill.name}"?`)) {
                currentSkills = currentSkills.filter(s => s.id !== skillId);
                renderMentorSkills();
                console.log(`Skill ${skillId} deleted`);
            }
        },
        closeModal: function() {
            const modal = document.getElementById('skillModal');
            if (modal) {
                modal.classList.remove('active');
            }
        },
        handleSubmit: function(event) {
            event.preventDefault();
            const form = event.target;
            const skillId = form.dataset.skillId;
            const formData = new FormData(form);
            
            const skillData = {
                name: formData.get('name'),
                description: formData.get('description'),
                icon: formData.get('icon'),
                mentors: 0,
                learners: 0
            };

            if (skillId) {
                // Edit existing skill
                const index = currentSkills.findIndex(s => s.id === parseInt(skillId));
                if (index !== -1) {
                    currentSkills[index] = { ...currentSkills[index], ...skillData };
                }
            } else {
                // Add new skill
                const newId = Math.max(...currentSkills.map(s => s.id), 0) + 1;
                currentSkills.push({ id: newId, ...skillData });
            }

            this.closeModal();
            renderMentorSkills();
        }
    };

    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('skillModal');
        if (modal && event.target === modal) {
            window.MentorSkills.closeModal();
        }
    });
})();



