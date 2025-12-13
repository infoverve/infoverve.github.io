// Post page functionality
const DATA_FILE = 'data/posts.json';

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    loadPost();
    setupShareButtons();
});

// Theme Management
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    updateUtterancesTheme(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    updateUtterancesTheme(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

function updateUtterancesTheme(theme) {
    const utterancesTheme = theme === 'light' ? 'github-light' : 'github-dark';
    const iframe = document.querySelector('.utterances-frame');
    if (iframe) {
        iframe.contentWindow.postMessage(
            { type: 'set-theme', theme: utterancesTheme },
            'https://utteranc.es'
        );
    }
}

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Load Post
async function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const response = await fetch(DATA_FILE);
        const data = await response.json();
        const post = data.posts.find(p => p.id === postId);
        
        if (!post) {
            window.location.href = 'index.html';
            return;
        }
        
        displayPost(post);
        incrementViewCount(postId);
        loadRating(postId);
        loadRelatedPosts(post.category, postId);
    } catch (error) {
        console.error('Error loading post:', error);
        window.location.href = 'index.html';
    }
}

// Display Post
function displayPost(post) {
    // Update meta
    document.title = `${post.title} - InfoVerve`;
    document.querySelector('meta[name="description"]').content = post.excerpt;
    
    // Update header
    document.getElementById('postCategory').textContent = post.category;
    document.getElementById('postDate').textContent = formatDate(post.date);
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postAuthor').textContent = post.author;
    document.getElementById('viewCount').textContent = getViewCount(post.id);
    document.getElementById('readTime').textContent = `${post.readTime || 5} min read`;
    
    // Update image
    if (post.image) {
        document.getElementById('postImage').src = post.image;
        document.getElementById('postImage').alt = post.title;
    } else {
        document.getElementById('postImageContainer').style.display = 'none';
    }
    
    // Update content
    const contentDiv = document.getElementById('postContent');
    if (post.contentFile) {
        loadMarkdownContent(post.contentFile, contentDiv);
    } else {
        contentDiv.innerHTML = marked.parse(post.content || '');
    }
    
    // Update tags
    displayTags(post.tags);
}

// Load Markdown Content
async function loadMarkdownContent(filename, container) {
    try {
        const response = await fetch(`posts/${filename}`);
        const markdown = await response.text();
        container.innerHTML = marked.parse(markdown);
    } catch (error) {
        console.error('Error loading markdown:', error);
        container.innerHTML = '<p>Error loading content.</p>';
    }
}

// Display Tags
function displayTags(tags) {
    const tagsContainer = document.getElementById('postTags');
    if (!tags || tags.length === 0) {
        tagsContainer.style.display = 'none';
        return;
    }
    
    tagsContainer.innerHTML = tags.map(tag => 
        `<a href="index.html?tag=${encodeURIComponent(tag)}" class="tag">#${tag}</a>`
    ).join('');
}

// Rating System
function loadRating(postId) {
    const ratings = JSON.parse(localStorage.getItem('post_ratings') || '{}');
    const postRatings = ratings[postId] || { ratings: [], userRating: 0 };
    
    const avgRating = postRatings.ratings.length > 0
        ? (postRatings.ratings.reduce((a, b) => a + b, 0) / postRatings.ratings.length).toFixed(1)
        : 0;
    
    document.getElementById('avgRating').textContent = avgRating;
    document.getElementById('ratingCount').textContent = postRatings.ratings.length;
    
    // Highlight user's rating
    const stars = document.querySelectorAll('#ratingStars i');
    stars.forEach((star, index) => {
        if (index < postRatings.userRating) {
            star.className = 'fas fa-star';
        }
        
        star.addEventListener('click', () => ratePost(postId, index + 1));
    });
}

function ratePost(postId, rating) {
    const ratings = JSON.parse(localStorage.getItem('post_ratings') || '{}');
    
    if (!ratings[postId]) {
        ratings[postId] = { ratings: [], userRating: 0 };
    }
    
    // Update user rating
    if (ratings[postId].userRating > 0) {
        // Replace existing rating
        const index = ratings[postId].ratings.indexOf(ratings[postId].userRating);
        if (index > -1) {
            ratings[postId].ratings[index] = rating;
        }
    } else {
        // Add new rating
        ratings[postId].ratings.push(rating);
    }
    
    ratings[postId].userRating = rating;
    localStorage.setItem('post_ratings', JSON.stringify(ratings));
    
    // Update display
    loadRating(postId);
    
    // Show feedback
    showNotification('Thank you for rating!');
}

// Share Functions
function setupShareButtons() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.querySelector('title').textContent);
    
    document.getElementById('shareTwitter')?.addEventListener('click', () => {
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
    });
    
    document.getElementById('shareLinkedIn')?.addEventListener('click', () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    });
    
    document.getElementById('shareFacebook')?.addEventListener('click', () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    });
    
    document.getElementById('shareCopy')?.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Link copied to clipboard!');
        });
    });
}

// Related Posts
async function loadRelatedPosts(category, currentPostId) {
    try {
        const response = await fetch(DATA_FILE);
        const data = await response.json();
        const related = data.posts
            .filter(p => p.category === category && p.id !== currentPostId)
            .slice(0, 3);
        
        displayRelatedPosts(related);
    } catch (error) {
        console.error('Error loading related posts:', error);
    }
}

function displayRelatedPosts(posts) {
    const relatedGrid = document.getElementById('relatedGrid');
    if (!posts || posts.length === 0) {
        relatedGrid.parentElement.style.display = 'none';
        return;
    }
    
    relatedGrid.innerHTML = posts.map(post => `
        <div class="post-card" onclick="viewPost('${post.id}')">
            ${post.image ? `
                <div class="post-image-wrapper">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                </div>
            ` : ''}
            <div class="post-body">
                <span class="post-category">${post.category}</span>
                <h3 class="post-card-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
            </div>
        </div>
    `).join('');
}

function viewPost(postId) {
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
