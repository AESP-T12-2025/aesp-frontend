// Topic/Scenario Management Module
(function() {
    'use strict';

    // Topics management state
    let currentTopics = [];
    let currentDialogues = [];
    let currentScenarioId = null;

    // Format date helper
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Image preview handler
    function handleImagePreview(input) {
        const file = input.files[0];
        const preview = document.getElementById('imagePreview');
        const previewContainer = document.getElementById('imagePreviewContainer');
        
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                alert('Vui lòng chọn file ảnh hợp lệ!');
                input.value = '';
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Kích thước file không được vượt quá 5MB!');
                input.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            previewContainer.style.display = 'none';
        }
    }

    // Render topics page
    function renderTopics() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        let html = `
            <div class="page-container">
                <div class="topics-header">
                    <h2>Quản lý Bài học (Topic/Scenario)</h2>
                    <button class="btn-primary" onclick="TopicScenario.openAddTopicModal()">
                        <i class="fas fa-plus"></i>
                        Thêm Bài học Mới
                    </button>
                </div>

                <div class="topics-grid">
        `;

        if (currentTopics.length === 0) {
            html += `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <i class="fas fa-book"></i>
                        <h3>Chưa có bài học nào</h3>
                        <p>Thêm bài học đầu tiên để bắt đầu</p>
                    </div>
                `;
        } else {
            currentTopics.forEach(topic => {
                const statusClass = topic.status === 'active' ? 'active' : 'inactive';
                const typeClass = topic.type === 'Topic' ? 'topic' : 'scenario';
                const contentPreview = topic.content.length > 150 ? topic.content.substring(0, 150) + '...' : topic.content;

                html += `
                    <div class="topic-card">
                        <div class="topic-image-container">
                            <img src="${topic.image}" alt="${topic.title}" class="topic-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                            <span class="topic-type-badge ${typeClass}">${topic.type}</span>
                        </div>
                        <div class="topic-card-body">
                            <h3 class="topic-title">${topic.title}</h3>
                            <p class="topic-description">${topic.description}</p>
                            <div class="topic-content-preview">${contentPreview}</div>
                            <div class="topic-meta">
                                <div class="topic-meta-item">
                                    <i class="fas fa-signal"></i>
                                    <span>${topic.difficulty}</span>
                                </div>
                                <div class="topic-meta-item">
                                    <i class="fas fa-clock"></i>
                                    <span>${topic.duration}</span>
                                </div>
                                <div class="topic-meta-item">
                                    <i class="fas fa-calendar"></i>
                                    <span>${formatDate(topic.createdAt)}</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                                <span class="topic-status ${statusClass}">
                                    <span class="status-dot"></span>
                                    ${topic.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                                </span>
                            </div>
                            <div class="topic-actions">
                                <button class="btn-action view" onclick="TopicScenario.viewTopic(${topic.id})" title="Xem">
                                    <i class="fas fa-eye"></i> Xem
                                </button>
                                <button class="btn-action edit" onclick="TopicScenario.editTopic(${topic.id})" title="Sửa">
                                    <i class="fas fa-edit"></i> Sửa
                                </button>
                                ${topic.type === 'Scenario' ? `
                                <button class="btn-action dialogue" onclick="TopicScenario.manageDialogues(${topic.id})" title="Quản lý Lời thoại">
                                    <i class="fas fa-comments"></i> Lời thoại
                                </button>
                                ` : ''}
                                <button class="btn-action ${topic.status === 'active' ? 'delete' : 'edit'}" 
                                        onclick="TopicScenario.toggleStatus(${topic.id})" 
                                        title="${topic.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}">
                                    <i class="fas fa-${topic.status === 'active' ? 'toggle-off' : 'toggle-on'}"></i>
                                    ${topic.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                                </button>
                                <button class="btn-action delete" onclick="TopicScenario.deleteTopic(${topic.id})" title="Xóa">
                                    <i class="fas fa-trash"></i> Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        html += `
                </div>
            </div>

            <!-- Dialogue Management Modal -->
            <div class="modal" id="dialogueModal">
                <div class="modal-content" style="max-width: 900px;">
                    <div class="modal-header">
                        <h3 id="dialogueModalTitle">Quản lý Lời thoại</h3>
                        <button class="modal-close" onclick="TopicScenario.closeDialogueModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="dialogue-management-container">
                        <div class="dialogue-header-actions">
                            <button class="btn-primary" onclick="TopicScenario.openAddDialogueModal()">
                                <i class="fas fa-plus"></i>
                                Thêm Lời thoại Mới
                            </button>
                        </div>
                        <div id="dialoguesList" class="dialogues-list">
                            <!-- Dialogues will be rendered here -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add/Edit Dialogue Modal -->
            <div class="modal" id="dialogueFormModal">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3 id="dialogueFormTitle">Thêm Lời thoại Mới</h3>
                        <button class="modal-close" onclick="TopicScenario.closeDialogueFormModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="dialogueForm" onsubmit="TopicScenario.handleDialogueSubmit(event)">
                        <div class="form-group">
                            <label for="dialogueOrder">Thứ tự *</label>
                            <input type="number" id="dialogueOrder" name="order" required min="1" placeholder="1">
                            <small style="color: #6b7280; font-size: 12px; display: block; margin-top: 5px;">
                                Thứ tự hiển thị của lời thoại trong kịch bản
                            </small>
                        </div>
                        <div class="form-group">
                            <label for="dialogueSpeaker">Vai trò (Speaker) *</label>
                            <input type="text" id="dialogueSpeaker" name="speaker" required placeholder="e.g., Interviewer, Candidate, Person A">
                            <small style="color: #6b7280; font-size: 12px; display: block; margin-top: 5px;">
                                Tên người nói (ví dụ: Interviewer, Candidate, Person A, Person B)
                            </small>
                        </div>
                        <div class="form-group">
                            <label for="dialogueContent">Nội dung Lời thoại *</label>
                            <textarea id="dialogueContent" name="content" required placeholder="Nhập nội dung lời thoại..." style="min-height: 120px;" rows="5"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="TopicScenario.closeDialogueFormModal()">Hủy</button>
                            <button type="submit" class="btn-primary">Lưu Lời thoại</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Add/Edit Topic Modal -->
            <div class="modal" id="topicModal">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h3 id="modalTitle">Thêm Bài học Mới</h3>
                        <button class="modal-close" onclick="TopicScenario.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="topicForm" onsubmit="TopicScenario.handleSubmit(event)" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="topicTitle">Tiêu đề Bài học *</label>
                            <input type="text" id="topicTitle" name="title" required placeholder="e.g., Business Meeting">
                        </div>
                        <div class="form-group">
                            <label for="topicType">Loại *</label>
                            <select id="topicType" name="type" required>
                                <option value="Topic">Topic</option>
                                <option value="Scenario">Scenario</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="topicDescription">Mô tả ngắn *</label>
                            <textarea id="topicDescription" name="description" required placeholder="Mô tả ngắn về bài học..." rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="topicContent">Nội dung *</label>
                            <textarea id="topicContent" name="content" required placeholder="Nội dung chi tiết của bài học..." style="min-height: 150px;"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="topicDifficulty">Độ khó *</label>
                            <select id="topicDifficulty" name="difficulty" required>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="topicDuration">Thời lượng *</label>
                            <input type="text" id="topicDuration" name="duration" required placeholder="e.g., 30 minutes">
                        </div>
                        <div class="form-group">
                            <label for="topicImage">Ảnh bài học *</label>
                            <input type="file" id="topicImage" name="image" accept="image/*" onchange="TopicScenario.handleImagePreview(this)" required>
                            <small style="color: #6b7280; font-size: 12px; display: block; margin-top: 5px;">
                                Chấp nhận: JPG, PNG, GIF. Kích thước tối đa: 5MB
                            </small>
                            <div id="imagePreviewContainer" style="display: none; margin-top: 15px;">
                                <img id="imagePreview" src="" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px; border: 1px solid #e5e7eb;">
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="TopicScenario.closeModal()">Hủy</button>
                            <button type="submit" class="btn-primary">Lưu Bài học</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        pageContent.innerHTML = html;
    }

    // Public API
    window.TopicScenario = {
        render: renderTopics,
        openAddTopicModal: function() {
            const modal = document.getElementById('topicModal');
            const form = document.getElementById('topicForm');
            const title = document.getElementById('modalTitle');
            const previewContainer = document.getElementById('imagePreviewContainer');
            if (modal && form && title) {
                form.reset();
                form.dataset.topicId = '';
                title.textContent = 'Thêm Bài học Mới';
                if (previewContainer) {
                    previewContainer.style.display = 'none';
                }
                modal.classList.add('active');
            }
        },
        handleImagePreview: function(input) {
            handleImagePreview(input);
        },
        viewTopic: function(topicId) {
            const topic = currentTopics.find(t => t.id === topicId);
            if (topic) {
                alert(`Chi tiết Bài học:\n\nTiêu đề: ${topic.title}\nLoại: ${topic.type}\nMô tả: ${topic.description}\nĐộ khó: ${topic.difficulty}\nThời lượng: ${topic.duration}\nTrạng thái: ${topic.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}\nNgày tạo: ${formatDate(topic.createdAt)}\n\nNội dung:\n${topic.content}`);
            }
        },
        editTopic: function(topicId) {
            const topic = currentTopics.find(t => t.id === topicId);
            if (!topic) return;

            const modal = document.getElementById('topicModal');
            const form = document.getElementById('topicForm');
            const title = document.getElementById('modalTitle');
            const previewContainer = document.getElementById('imagePreviewContainer');
            const preview = document.getElementById('imagePreview');
            
            if (modal && form && title) {
                document.getElementById('topicTitle').value = topic.title;
                document.getElementById('topicType').value = topic.type;
                document.getElementById('topicDescription').value = topic.description;
                document.getElementById('topicContent').value = topic.content;
                document.getElementById('topicDifficulty').value = topic.difficulty;
                document.getElementById('topicDuration').value = topic.duration;
                
                // Show existing image
                if (preview && previewContainer) {
                    preview.src = topic.image;
                    previewContainer.style.display = 'block';
                }
                
                // Remove required from image input when editing
                const imageInput = document.getElementById('topicImage');
                if (imageInput) {
                    imageInput.removeAttribute('required');
                }
                
                form.dataset.topicId = topicId;
                title.textContent = 'Sửa Bài học';
                modal.classList.add('active');
            }
        },
        toggleStatus: function(topicId) {
            const topic = currentTopics.find(t => t.id === topicId);
            if (topic) {
                topic.status = topic.status === 'active' ? 'inactive' : 'active';
                renderTopics();
                console.log(`Topic ${topicId} status changed to ${topic.status}`);
            }
        },
        deleteTopic: function(topicId) {
            const topic = currentTopics.find(t => t.id === topicId);
            if (topic && confirm(`Bạn có chắc chắn muốn xóa "${topic.title}"?`)) {
                currentTopics = currentTopics.filter(t => t.id !== topicId);
                // Also delete associated dialogues
                currentDialogues = currentDialogues.filter(d => d.scenarioId !== topicId);
                renderTopics();
                console.log(`Topic ${topicId} deleted`);
            }
        },
        manageDialogues: function(scenarioId) {
            const scenario = currentTopics.find(t => t.id === scenarioId && t.type === 'Scenario');
            if (!scenario) {
                alert('Chỉ có thể quản lý lời thoại cho các kịch bản (Scenario)!');
                return;
            }

            currentScenarioId = scenarioId;
            const modal = document.getElementById('dialogueModal');
            const title = document.getElementById('dialogueModalTitle');
            if (modal && title) {
                title.textContent = `Quản lý Lời thoại - ${scenario.title}`;
                renderDialoguesList();
                modal.classList.add('active');
            }
        },
        renderDialoguesList: function() {
            const dialoguesList = document.getElementById('dialoguesList');
            if (!dialoguesList) return;

            const scenarioDialogues = currentDialogues
                .filter(d => d.scenarioId === currentScenarioId)
                .sort((a, b) => a.order - b.order);

            if (scenarioDialogues.length === 0) {
                dialoguesList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-comments"></i>
                        <h3>Chưa có lời thoại nào</h3>
                        <p>Thêm lời thoại đầu tiên để bắt đầu</p>
                    </div>
                `;
                return;
            }

            let html = '<div class="dialogues-container">';
            scenarioDialogues.forEach((dialogue, index) => {
                html += `
                    <div class="dialogue-item" data-dialogue-id="${dialogue.id}">
                        <div class="dialogue-item-header">
                            <div class="dialogue-order-badge">${dialogue.order}</div>
                            <div class="dialogue-speaker">${dialogue.speaker}</div>
                            <div class="dialogue-actions">
                                <button class="btn-action-small edit" onclick="TopicScenario.editDialogue(${dialogue.id})" title="Sửa">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-action-small up" onclick="TopicScenario.moveDialogue(${dialogue.id}, 'up')" title="Lên" ${index === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-arrow-up"></i>
                                </button>
                                <button class="btn-action-small down" onclick="TopicScenario.moveDialogue(${dialogue.id}, 'down')" title="Xuống" ${index === scenarioDialogues.length - 1 ? 'disabled' : ''}>
                                    <i class="fas fa-arrow-down"></i>
                                </button>
                                <button class="btn-action-small delete" onclick="TopicScenario.deleteDialogue(${dialogue.id})" title="Xóa">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="dialogue-content">${dialogue.content}</div>
                    </div>
                `;
            });
            html += '</div>';
            dialoguesList.innerHTML = html;
        },
        openAddDialogueModal: function() {
            const modal = document.getElementById('dialogueFormModal');
            const form = document.getElementById('dialogueForm');
            const title = document.getElementById('dialogueFormTitle');
            if (modal && form && title) {
                form.reset();
                form.dataset.dialogueId = '';
                title.textContent = 'Thêm Lời thoại Mới';
                
                // Set default order to next available
                const scenarioDialogues = currentDialogues.filter(d => d.scenarioId === currentScenarioId);
                const nextOrder = scenarioDialogues.length > 0 
                    ? Math.max(...scenarioDialogues.map(d => d.order)) + 1 
                    : 1;
                document.getElementById('dialogueOrder').value = nextOrder;
                
                modal.classList.add('active');
            }
        },
        editDialogue: function(dialogueId) {
            const dialogue = currentDialogues.find(d => d.id === dialogueId);
            if (!dialogue) return;

            const modal = document.getElementById('dialogueFormModal');
            const form = document.getElementById('dialogueForm');
            const title = document.getElementById('dialogueFormTitle');
            if (modal && form && title) {
                document.getElementById('dialogueOrder').value = dialogue.order;
                document.getElementById('dialogueSpeaker').value = dialogue.speaker;
                document.getElementById('dialogueContent').value = dialogue.content;
                form.dataset.dialogueId = dialogueId;
                title.textContent = 'Sửa Lời thoại';
                modal.classList.add('active');
            }
        },
        deleteDialogue: function(dialogueId) {
            const dialogue = currentDialogues.find(d => d.id === dialogueId);
            if (dialogue && confirm(`Bạn có chắc chắn muốn xóa lời thoại này?`)) {
                currentDialogues = currentDialogues.filter(d => d.id !== dialogueId);
                renderDialoguesList();
                console.log(`Dialogue ${dialogueId} deleted`);
            }
        },
        moveDialogue: function(dialogueId, direction) {
            const scenarioDialogues = currentDialogues
                .filter(d => d.scenarioId === currentScenarioId)
                .sort((a, b) => a.order - b.order);
            
            const currentIndex = scenarioDialogues.findIndex(d => d.id === dialogueId);
            if (currentIndex === -1) return;

            if (direction === 'up' && currentIndex > 0) {
                const temp = scenarioDialogues[currentIndex].order;
                scenarioDialogues[currentIndex].order = scenarioDialogues[currentIndex - 1].order;
                scenarioDialogues[currentIndex - 1].order = temp;
            } else if (direction === 'down' && currentIndex < scenarioDialogues.length - 1) {
                const temp = scenarioDialogues[currentIndex].order;
                scenarioDialogues[currentIndex].order = scenarioDialogues[currentIndex + 1].order;
                scenarioDialogues[currentIndex + 1].order = temp;
            } else {
                return;
            }

            renderDialoguesList();
        },
        handleDialogueSubmit: function(event) {
            event.preventDefault();
            const form = event.target;
            const dialogueId = form.dataset.dialogueId;
            const formData = new FormData(form);

            const dialogueData = {
                scenarioId: currentScenarioId,
                order: parseInt(formData.get('order')),
                speaker: formData.get('speaker'),
                content: formData.get('content'),
                createdAt: dialogueId ? currentDialogues.find(d => d.id === parseInt(dialogueId))?.createdAt || new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            };

            if (dialogueId) {
                // Edit existing dialogue
                const index = currentDialogues.findIndex(d => d.id === parseInt(dialogueId));
                if (index !== -1) {
                    currentDialogues[index] = { ...currentDialogues[index], ...dialogueData };
                }
            } else {
                // Add new dialogue
                const newId = Math.max(...currentDialogues.map(d => d.id), 0) + 1;
                currentDialogues.push({ id: newId, ...dialogueData });
            }

            this.closeDialogueFormModal();
            renderDialoguesList();
        },
        closeDialogueModal: function() {
            const modal = document.getElementById('dialogueModal');
            if (modal) {
                modal.classList.remove('active');
                currentScenarioId = null;
            }
        },
        closeDialogueFormModal: function() {
            const modal = document.getElementById('dialogueFormModal');
            if (modal) {
                modal.classList.remove('active');
            }
        },
        closeModal: function() {
            const modal = document.getElementById('topicModal');
            if (modal) {
                modal.classList.remove('active');
            }
        },
        handleSubmit: function(event) {
            event.preventDefault();
            const form = event.target;
            const topicId = form.dataset.topicId;
            const formData = new FormData(form);
            
            // Get image file or use existing image URL
            let imageUrl = '';
            const imageFile = formData.get('image');
            
            if (imageFile && imageFile.size > 0) {
                // In a real application, you would upload the file to a server
                // For now, we'll create a preview URL
                imageUrl = URL.createObjectURL(imageFile);
            } else if (topicId) {
                // Keep existing image when editing without new upload
                const existingTopic = currentTopics.find(t => t.id === parseInt(topicId));
                if (existingTopic) {
                    imageUrl = existingTopic.image;
                }
            } else {
                // Default placeholder if no image provided
                imageUrl = 'https://via.placeholder.com/300x200?text=No+Image';
            }
            
            const topicData = {
                title: formData.get('title'),
                type: formData.get('type'),
                description: formData.get('description'),
                content: formData.get('content'),
                difficulty: formData.get('difficulty'),
                duration: formData.get('duration'),
                image: imageUrl,
                status: 'active',
                createdAt: topicId ? currentTopics.find(t => t.id === parseInt(topicId))?.createdAt || new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            };

            if (topicId) {
                // Edit existing topic
                const index = currentTopics.findIndex(t => t.id === parseInt(topicId));
                if (index !== -1) {
                    currentTopics[index] = { ...currentTopics[index], ...topicData };
                }
            } else {
                // Add new topic
                const newId = Math.max(...currentTopics.map(t => t.id), 0) + 1;
                currentTopics.push({ id: newId, ...topicData });
            }

            this.closeModal();
            renderTopics();
        }
    };

    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const topicModal = document.getElementById('topicModal');
        const dialogueModal = document.getElementById('dialogueModal');
        const dialogueFormModal = document.getElementById('dialogueFormModal');
        
        if (topicModal && event.target === topicModal) {
            window.TopicScenario.closeModal();
        }
        if (dialogueModal && event.target === dialogueModal) {
            window.TopicScenario.closeDialogueModal();
        }
        if (dialogueFormModal && event.target === dialogueFormModal) {
            window.TopicScenario.closeDialogueFormModal();
        }
    });
})();

