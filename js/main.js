// Data storage and management
const DATA_FILE = 'data/posts.json';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    loadPosts();
    setupEventListeners();
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

// Event Listeners
function setupEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => filterPosts(e.target.value));
    }

    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            filterTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            filterByCategory(e.target.dataset.filter);
        });
    });
}

// Load Posts
let allPosts = [];

async function loadPosts() {
    showLoading();
    
    try {
        const response = await fetch(DATA_FILE);
        if (!response.ok) {
            // If no data file exists, show empty state
            hideLoading();
            showEmptyState();
            return;
        }
        
        const data = await response.json();
        allPosts = data.posts || [];
        
        displayFeaturedPosts(allPosts.filter(post => post.featured));
        displayPosts(allPosts);
        hideLoading();
    } catch (error) {
        console.error('Error loading posts:', error);
        hideLoading();
        showEmptyState();
    }
}

// Display Featured Posts
function displayFeaturedPosts(posts) {
    const featuredSection = document.getElementById('featuredSection');
    const featuredGrid = document.getElementById('featuredGrid');
    
    if (!posts || posts.length === 0) {
        if (featuredSection) featuredSection.style.display = 'none';
        return;
    }
    
    if (featuredSection) featuredSection.style.display = 'block';
    if (!featuredGrid) return;
    
    featuredGrid.innerHTML = posts.slice(0, 3).map(post => `
        <div class="featured-card fade-in" onclick="viewPost('${post.id}')">
            <span class="featured-badge"><i class="fas fa-star"></i> Featured</span>
            ${post.image ? `
                <div class="post-image-wrapper">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                </div>
            ` : ''}
            <div class="post-body">
                <span class="post-category">${post.category}</span>
                <h3 class="post-card-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-footer">
                    <span class="post-meta-item">
                        <i class="fas fa-user"></i> ${post.author}
                    </span>
                    <span class="post-meta-item">
                        <i class="fas fa-calendar"></i> ${formatDate(post.date)}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// Display Posts
function displayPosts(posts) {
    const postsGrid = document.getElementById('postsGrid');
    if (!postsGrid) return;
    
    if (posts.length === 0) {
        showEmptyState();
        return;
    }
    
    postsGrid.innerHTML = posts.map(post => `
        <div class="post-card fade-in" onclick="viewPost('${post.id}')">
            ${post.image ? `
                <div class="post-image-wrapper">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                </div>
            ` : ''}
            <div class="post-body">
                <span class="post-category">${post.category}</span>
                <h3 class="post-card-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-footer">
                    <span class="post-meta-item">
                        <i class="fas fa-calendar"></i> ${formatDate(post.date)}
                    </span>
                    <span class="post-meta-item">
                        <i class="fas fa-eye"></i> ${getViewCount(post.id)}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Posts
function filterPosts(searchTerm) {
    const filtered = allPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    displayPosts(filtered);
}

function filterByCategory(category) {
    if (category === 'all') {
        displayPosts(allPosts);
    } else if (category === 'featured') {
        displayPosts(allPosts.filter(post => post.featured));
    } else {
        displayPosts(allPosts.filter(post => 
            post.category.toLowerCase() === category.toLowerCase()
        ));
    }
}

// View Post
function viewPost(postId) {
    incrementViewCount(postId);
    window.location.href = `post.html?id=${postId}`;
}

// View Counter
function getViewCount(postId) {
    const views = JSON.parse(localStorage.getItem('post_views') || '{}');
    return views[postId] || 0;
}

function incrementViewCount(postId) {
    const views = JSON.parse(localStorage.getItem('post_views') || '{}');
    views[postId] = (views[postId] || 0) + 1;
    localStorage.setItem('post_views', JSON.stringify(views));
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'block';
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

function showEmptyState() {
    const emptyState = document.getElementById('emptyState');
    const postsGrid = document.getElementById('postsGrid');
    
    if (emptyState) emptyState.style.display = 'block';
    if (postsGrid) postsGrid.innerHTML = '';
}
