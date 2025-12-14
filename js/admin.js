// Admin Panel Functionality
const DATA_FILE = 'data/posts.json';
const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'infoverve';
const REPO_NAME = 'infoverve.github.io';

let allPosts = [];
let editingPostId = null;
let githubToken = null;

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    checkAuthentication();
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

// Authentication
function checkAuthentication() {
    githubToken = localStorage.getItem('github_token');
    
    if (!githubToken) {
        showAuthPrompt();
    } else {
        verifyToken();
    }
}

function showAuthPrompt() {
    const authOverlay = document.createElement('div');
    authOverlay.id = 'authOverlay';
    authOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    authOverlay.innerHTML = `
        <div style="background: var(--bg-primary); padding: 3rem; border-radius: 16px; max-width: 500px; width: 90%;">
            <h2 style="margin-bottom: 1rem; color: var(--text-primary);">
                <i class="fas fa-lock"></i> GitHub Authentication Required
            </h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">
                To create and manage blog posts via Pull Requests, you need to authenticate with GitHub.
            </p>
            
            <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <h3 style="font-size: 1rem; margin-bottom: 1rem; color: var(--text-primary);">
                    📋 Step-by-step token creation:
                </h3>
                <ol style="color: var(--text-secondary); line-height: 2; padding-left: 1.5rem;">
                    <li>Go to <a href="https://github.com/settings/tokens/new" target="_blank" style="color: var(--primary-color);">GitHub Settings → Personal Access Tokens</a></li>
                    <li><strong>Click "Generate new token (classic)"</strong> (not fine-grained)</li>
                    <li>Name it "Blog Admin"</li>
                    <li>Set expiration (recommend: 90 days)</li>
                    <li><strong>IMPORTANT:</strong> Select these scopes:
                        <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                            <li>✅ <code style="background: var(--bg-secondary); padding: 0.2rem 0.5rem; border-radius: 4px;">repo</code> (Full control of private repositories)</li>
                            <li>✅ <code style="background: var(--bg-secondary); padding: 0.2rem 0.5rem; border-radius: 4px;">workflow</code> (Update GitHub Action workflows)</li>
                        </ul>
                    </li>
                    <li>Scroll down and click "Generate token"</li>
                    <li>Copy the token (starts with ghp_) and paste below</li>
                </ol>
                <div style="background: #fef3c7; color: #92400e; padding: 1rem; border-radius: 6px; margin-top: 1rem; font-size: 0.875rem;">
                    <strong>⚠️ Common Issues:</strong><br>
                    • Using fine-grained token instead of classic<br>
                    • Missing "repo" or "workflow" scope<br>
                    • Token expired or revoked
                </div>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">
                    GitHub Personal Access Token:
                </label>
                <input type="password" id="tokenInput" 
                    style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; font-family: monospace; background: var(--bg-primary); color: var(--text-primary);"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx">
            </div>
            
            <div style="display: flex; gap: 1rem;">
                <button onclick="saveToken()" class="btn btn-primary" style="flex: 1;">
                    <i class="fas fa-save"></i> Save Token
                </button>
            </div>
            
            <p style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 1rem; text-align: center;">
                <i class="fas fa-shield-alt"></i> Token is stored locally in your browser
            </p>
        </div>
    `;
    
    document.body.appendChild(authOverlay);
    document.getElementById('tokenInput').focus();
    
    // Allow Enter key to submit
    document.getElementById('tokenInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveToken();
    });
}

async function saveToken() {
    const token = document.getElementById('tokenInput').value.trim();
    
    if (!token) {
        showNotification('Please enter a valid token', 'error');
        return;
    }
    
    // Verify token
    try {
        const response = await fetch(`${GITHUB_API}/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            localStorage.setItem('github_token', token);
            localStorage.setItem('github_user', user.login);
            githubToken = token;
            
            document.getElementById('authOverlay')?.remove();
            showNotification(`Authenticated as ${user.login}`, 'success');
        } else {
            showNotification('Invalid token. Please check and try again.', 'error');
        }
    } catch (error) {
        showNotification('Failed to verify token. Check your internet connection.', 'error');
    }
}

async function verifyToken() {
    try {
        const response = await fetch(`${GITHUB_API}/user`, {
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            localStorage.removeItem('github_token');
            localStorage.removeItem('github_user');
            showAuthPrompt();
        }
    } catch (error) {
        console.error('Token verification failed:', error);
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('github_token');
        localStorage.removeItem('github_user');
        githubToken = null;
        showNotification('Logged out successfully', 'info');
        setTimeout(() => location.reload(), 1000);
    }
}

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
async function savePost() {
    if (!githubToken) {
        showNotification('Please authenticate with GitHub first', 'error');
        showAuthPrompt();
        return;
    }
    
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
    
    // Add or update post in local array
    if (editingPostId) {
        const index = allPosts.findIndex(p => p.id === editingPostId);
        if (index !== -1) {
            allPosts[index] = formData;
        }
        editingPostId = null;
    } else {
        allPosts.unshift(formData);
    }
    
    // Create Pull Request
    await createPullRequest(formData);
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

// Create Pull Request
async function createPullRequest(postData) {
    try {
        showNotification('Creating Pull Request...', 'info');
        
        // 1. Get the default branch SHA
        const mainRef = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/main`, {
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        }).then(r => r.json());
        
        const baseSha = mainRef.object.sha;
        
        // 2. Create a new branch
        const branchName = `blog-post-${postData.id}`;
        await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ref: `refs/heads/${branchName}`,
                sha: baseSha
            })
        });
        
        // 3. Get current posts.json
        const currentFile = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/posts.json?ref=main`, {
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        }).then(r => r.json());
        
        // 4. Update posts data
        const updatedData = {
            posts: allPosts,
            lastUpdated: new Date().toISOString()
        };
        
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(updatedData, null, 2))));
        
        // 5. Commit the change
        await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/posts.json`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `${editingPostId ? 'Update' : 'Add'} blog post: ${postData.title}`,
                content: content,
                sha: currentFile.sha,
                branch: branchName
            })
        });
        
        // 6. Create Pull Request
        const prResponse = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/pulls`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `${editingPostId ? 'Update' : 'Add'} Blog Post: ${postData.title}`,
                head: branchName,
                base: 'main',
                body: `## Blog Post Details

**Title:** ${postData.title}
**Author:** ${postData.author}
**Category:** ${postData.category}
**Date:** ${postData.date}
**Featured:** ${postData.featured ? 'Yes' : 'No'}

### Excerpt
${postData.excerpt}

### Tags
${postData.tags.join(', ')}

---

This Pull Request was automatically generated by the InfoVerve Admin Panel.
Review and merge to publish this blog post.`
            })
        });
        
        const pr = await prResponse.json();
        
        if (prResponse.ok) {
            displayPostsList();
            clearForm();
            showPRSuccess(pr.html_url, pr.number);
        } else {
            throw new Error(pr.message || 'Failed to create PR');
        }
        
    } catch (error) {
        console.error('Error creating PR:', error);
        
        let errorMessage = error.message;
        let helpText = '';
        
        if (errorMessage.includes('not accessible by personal access token') || 
            errorMessage.includes('Resource not accessible')) {
            helpText = '<br><br><strong>Solution:</strong> Your token is missing required permissions.<br>' +
                      '1. Go to <a href="https://github.com/settings/tokens" target="_blank">GitHub Tokens</a><br>' +
                      '2. Delete the old token<br>' +
                      '3. Create a new <strong>classic</strong> token with:<br>' +
                      '   • ✅ repo (full control)<br>' +
                      '   • ✅ workflow<br>' +
                      '4. Click Logout and re-authenticate';
        } else if (errorMessage.includes('Reference already exists')) {
            helpText = '<br><br><strong>Solution:</strong> A branch with this post ID exists.<br>' +
                      '1. Merge or close the existing PR<br>' +
                      '2. Or edit the post to change its ID';
        } else if (errorMessage.includes('Not Found')) {
            helpText = '<br><br><strong>Solution:</strong> Check repository name in js/admin.js<br>' +
                      'Update REPO_OWNER and REPO_NAME constants';
        }
        
        showNotification(`Failed to create Pull Request: ${errorMessage}${helpText}`, 'error');
    }
}

function showPRSuccess(prUrl, prNumber) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="background: var(--bg-primary); padding: 3rem; border-radius: 16px; max-width: 600px; width: 90%; text-align: center;">
            <div style="font-size: 4rem; color: #10b981; margin-bottom: 1rem;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="color: var(--text-primary); margin-bottom: 1rem;">Pull Request Created!</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">
                Your blog post has been submitted as Pull Request #${prNumber}.<br>
                Once approved and merged, it will be automatically published to your blog.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <a href="${prUrl}" target="_blank" class="btn btn-primary" style="text-decoration: none;">
                    <i class="fab fa-github"></i> View Pull Request
                </a>
                <button onclick="this.closest('div').parentElement.parentElement.remove()" class="btn btn-secondary">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Download posts data as JSON (backup method)
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
        max-width: 500px;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}" style="margin-top: 2px;"></i>
            <div style="flex: 1; line-height: 1.5;">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem; padding: 0; margin-left: 0.5rem;">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, type === 'error' ? 10000 : 5000);
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
