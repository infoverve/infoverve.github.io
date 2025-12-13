// Admin Panel Functionality
const DATA_FILE = 'data/posts.json';
let allPosts = [];
let editingPostId = null;

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    loadExistingPosts();
    setupForm();
    setDefaultDate();
});

// Theme Management
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

// Set default date
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('postDate').value = today;
}

// Load existing posts
async function loadExistingPosts() {
    try {
        const response = await fetch(DATA_FILE);
        if (response.ok) {
            const data = await response.json();
            allPosts = data.posts || [];
            displayPostsList();
        }
    } catch (error) {
        console.log('No existing posts file found. Starting fresh.');
        allPosts = [];
    }
}

// Display posts list
function displayPostsList() {
    const postsList = document.getElementById('postsList');
    
    if (allPosts.length === 0) {
        postsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No posts yet. Create your first post!</p>';
        return;
    }
    
    postsList.innerHTML = allPosts.map(post => `
        <div class="post-item">
            <div class="post-item-info">
                <h3>${post.title}</h3>
                <p>
                    <span>${post.category}</span> • 
                    <span>${formatDate(post.date)}</span> • 
                    ${post.featured ? '<span style="color: var(--accent-color);"><i class="fas fa-star"></i> Featured</span>' : ''}
                </p>
            </div>
            <div class="post-item-actions">
                <button class="btn btn-secondary" onclick="editPost('${post.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="deletePost('${post.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Setup form submission
function setupForm() {
    document.getElementById('postForm').addEventListener('submit', function(e) {
        e.preventDefault();
        savePost();
    });
}

// Save post
function savePost() {
    const form = document.getElementById('postForm');
    const formData = {
        id: editingPostId || generateId(),
        title: document.getElementById('postTitle').value,
        author: document.getElementById('postAuthor').value,
        category: document.getElementById('postCategory').value,
        date: document.getElementById('postDate').value,
        excerpt: document.getElementById('postExcerpt').value,
        image: document.getElementById('postImage').value,
        tags: document.getElementById('postTags').value.split(',').map(t => t.trim()).filter(t => t),
        readTime: parseInt(document.getElementById('postReadTime').value) || 5,
        featured: document.getElementById('postFeatured').checked,
        content: document.getElementById('postContent').value
    };
    
    // Validate
    if (!formData.title || !formData.author || !formData.category || !formData.date || !formData.excerpt || !formData.content) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    // Add or update post
    if (editingPostId) {
        const index = allPosts.findIndex(p => p.id === editingPostId);
        if (index !== -1) {
            allPosts[index] = formData;
        }
        editingPostId = null;
    } else {
        allPosts.unshift(formData);
    }
    
    // Save to file
    downloadPostsData();
    displayPostsList();
    clearForm();
    showNotification('Post saved! Download the JSON file and update data/posts.json', 'success');
}

// Edit post
function editPost(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;
    
    editingPostId = postId;
    
    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postAuthor').value = post.author;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postDate').value = post.date;
    document.getElementById('postExcerpt').value = post.excerpt;
    document.getElementById('postImage').value = post.image || '';
    document.getElementById('postTags').value = post.tags.join(', ');
    document.getElementById('postReadTime').value = post.readTime || 5;
    document.getElementById('postFeatured').checked = post.featured || false;
    document.getElementById('postContent').value = post.content;
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('Post loaded for editing', 'info');
}

// Delete post
function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    allPosts = allPosts.filter(p => p.id !== postId);
    downloadPostsData();
    displayPostsList();
    showNotification('Post deleted! Download the updated JSON file', 'success');
}

// Clear form
function clearForm() {
    document.getElementById('postForm').reset();
    editingPostId = null;
    setDefaultDate();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Preview post
function previewPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    
    if (!title || !content) {
        showNotification('Please fill in title and content to preview', 'error');
        return;
    }
    
    const previewWindow = window.open('', 'Preview', 'width=800,height=600');
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Preview: ${title}</title>
            <link rel="stylesheet" href="css/style.css">
            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        </head>
        <body>
            <div class="container" style="padding: 2rem;">
                <h1>${title}</h1>
                <div id="content"></div>
            </div>
            <script>
                document.getElementById('content').innerHTML = marked.parse(\`${content.replace(/`/g, '\\`')}\`);
            </script>
        </body>
        </html>
    `);
}

// Download posts data as JSON
function downloadPostsData() {
    const data = {
        posts: allPosts,
        lastUpdated: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'posts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Generate unique ID
function generateId() {
    return 'post-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Show notification
function showNotification(message, type = 'info') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#6366f1'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
