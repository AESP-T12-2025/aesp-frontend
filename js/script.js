// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle for Mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Notification Dropdown Toggle
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationBadge = document.getElementById('notificationBadge');
    const markAllRead = document.getElementById('markAllRead');
    const notificationList = document.getElementById('notificationList');

    // Update notification badge count
    function updateNotificationBadge() {
        if (!notificationList || !notificationBadge) return;
        const unreadCount = notificationList.querySelectorAll('.notification-item.unread').length;
        if (unreadCount > 0) {
            notificationBadge.textContent = unreadCount;
            notificationBadge.style.display = 'flex';
        } else {
            notificationBadge.style.display = 'none';
        }
    }

    if (notificationIcon && notificationDropdown) {
        notificationIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('active');
        });
    }

    if (markAllRead && notificationList && notificationBadge) {
        markAllRead.addEventListener('click', (e) => {
            e.stopPropagation();
            const unreadItems = notificationList.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
            notificationBadge.textContent = '0';
            notificationBadge.style.display = 'none';
        });
    }

    // Mark individual notification as read
    if (notificationList) {
        const notificationItems = notificationList.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.addEventListener('click', function() {
                if (this.classList.contains('unread')) {
                    this.classList.remove('unread');
                    updateNotificationBadge();
                }
            });
        });
    }

    // Initialize notification badge on page load
    updateNotificationBadge();

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (notificationIcon && notificationDropdown) {
            if (!notificationIcon.contains(e.target) && !notificationDropdown.contains(e.target)) {
                notificationDropdown.classList.remove('active');
            }
        }
    });

    // Menu Item Click Handler
    const menuItems = document.querySelectorAll('.menu-item');
    const pageContent = document.getElementById('pageContent');

    // Update page content function
    function updatePageContent(page, pageTitle, pageSubtitle) {
        const pageData = {
            'dashboard': {
                title: 'Dashboard',
                subtitle: 'Welcome back! Here\'s what\'s happening with your system today.'
            },
            'users': {
                title: 'Manage User Accounts',
                subtitle: 'View and manage all user accounts in the system.'
            },
            'mentors': {
                title: 'Manage Mentor List',
                subtitle: 'View and manage all mentors in the system.'
            },
            'mentor-skills': {
                title: 'Mentor Skills',
                subtitle: 'Provide mentor skills for learners to choose as guides.'
            },
            'enable-disable': {
                title: 'Enable/Disable Account',
                subtitle: 'Enable or disable user accounts.'
            },
            'packages': {
                title: 'Service Packages & Pricing',
                subtitle: 'Manage service packages and their pricing.'
            },
            'purchases': {
                title: 'Package Purchases',
                subtitle: 'Manage learner package purchases.'
            },
            'purchase-history': {
                title: 'Purchase History',
                subtitle: 'View learner package purchase history.'
            },
            'support': {
                title: 'Learner Support Services',
                subtitle: 'Provide learner support services.'
            },
            'feedback': {
                title: 'Moderate Feedback & Comments',
                subtitle: 'Moderate feedback and comments from users.'
            },
            'policies': {
                title: 'System Policies',
                subtitle: 'Create and manage system policies.'
            },
            'statistics': {
                title: 'Statistics & Reports',
                subtitle: 'View statistics and generate reports.'
            }
        };

        if (pageData[page] && pageTitle && pageSubtitle && pageContent) {
            pageTitle.textContent = pageData[page].title;
            pageSubtitle.textContent = pageData[page].subtitle;
            
            // You can load different content here based on the page
            pageContent.innerHTML = `
                <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                    <h2 style="margin-bottom: 20px; color: #111827;">${pageData[page].title}</h2>
                    <p style="color: #6b7280;">Content for ${pageData[page].title} will be displayed here.</p>
                </div>
            `;
        }
    }

    if (menuItems.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all items
                menuItems.forEach(mi => mi.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Get page name
                const page = item.getAttribute('data-page');
                
                // Handle logout
                if (page === 'logout') {
                    if (confirm('Are you sure you want to logout?')) {
                        // Redirect to login page
                        window.location.href = 'login.html';
                    }
                    return;
                }
                
                // Update page title
                const pageTitle = document.querySelector('.page-title');
                const pageSubtitle = document.querySelector('.page-subtitle');
                
                // Update content based on page
                updatePageContent(page, pageTitle, pageSubtitle);
                
                // Close sidebar on mobile after selection
                if (window.innerWidth <= 768 && sidebar) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar && menuToggle) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
});

