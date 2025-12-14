# InfoVerve - Modern Professional Blogging Platform

A beautiful, feature-rich blogging platform built for GitHub Pages. Create, manage, and share your ideas with a modern, responsive design and powerful interactive features.

![InfoVerve](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![GitHub Pages](https://img.shields.io/badge/hosting-GitHub%20Pages-black.svg)

## ✨ Features

### 🎨 Modern Design
- Clean, professional interface
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Dark/Light mode support with persistent preferences

### 📝 Content Management
- **Easy Admin Panel** - Create and edit posts with a user-friendly interface
- **Markdown Support** - Write naturally with full Markdown syntax
- **Live Preview** - See how your post looks before publishing
- **Featured Posts** - Pin important articles to the homepage
- **Categories & Tags** - Organize content for easy discovery

### 🔍 Discovery Features
- **Real-time Search** - Find articles instantly as you type
- **Category Filters** - Browse posts by topic
- **Related Posts** - Keep readers engaged with relevant content

### 💬 Engagement Tools
- **Comments System** - GitHub Issues-powered comments (controllable via repository)
- **Star Ratings** - 5-star rating system with average display
- **View Counter** - Track article popularity
- **Social Sharing** - Share to Twitter, LinkedIn, Facebook, or copy link

### 🚀 Performance
- Static site (fast loading)
- Lazy loading images
- Optimized CSS and JavaScript
- SEO-friendly structure

## 📁 Project Structure

```
infoverve.github.io/
├── index.html          # Homepage with post grid
├── post.html          # Individual post viewer
├── admin.html         # Admin panel for content management
├── css/
│   └── style.css      # Main stylesheet
├── js/
│   ├── main.js        # Homepage functionality
│   ├── post.js        # Post page functionality
│   └── admin.js       # Admin panel functionality
├── data/
│   └── posts.json     # Blog posts database
├── posts/             # Optional: Separate markdown files
├── assets/            # Images and other assets
└── README.md          # This file
```

## 🚀 Quick Start

### 1. Clone or Fork

**Option A: Use This Template**
1. Click "Use this template" on GitHub
2. Name your repository `username.github.io`

**Option B: Clone**
```bash
git clone https://github.com/infoverve/infoverve.github.io.git
cd infoverve.github.io
```

### 2. Configure Comments

Edit `post.html` and update the Utterances repo:

```html
<script src="https://utteranc.es/client.js"
        repo="YOUR-USERNAME/YOUR-REPO"
        issue-term="pathname"
        theme="preferred-color-scheme"
        crossorigin="anonymous"
        async>
</script>
```

### 3. Enable GitHub Issues

1. Go to your repository settings
2. Enable Issues (required for comments)
3. Install the [Utterances app](https://github.com/apps/utterances)

### 4. Deploy to GitHub Pages

1. Push code to your repository
2. Go to Settings → Pages
3. Select `main` branch as source
4. Save and wait a few minutes

Your blog will be live at `https://username.github.io`

## 📝 Creating Posts

### Using the Admin Panel (Automated PR Workflow)

The admin panel is now a **private, authenticated system** that automatically creates Pull Requests for blog posts.

#### First-Time Setup

1. **Generate a GitHub Personal Access Token:**
   - Go to [GitHub Settings → Personal Access Tokens](https://github.com/settings/tokens/new)
   - Click "Generate new token (classic)"
   - Name it "Blog Admin"
   - Select scopes: `repo` and `workflow`
   - Generate and copy the token

2. **Access Admin Panel:**
   - Visit `https://username.github.io/admin.html` (not linked publicly)
   - Bookmark this URL for future access
   - Enter your GitHub token when prompted
   - Token is stored securely in your browser

#### Creating a New Post

1. Fill in the post details:
   - **Title** - Your post headline
   - **Author** - Your name
   - **Category** - Choose from predefined categories
   - **Date** - Publication date
   - **Excerpt** - Brief description (shown in previews)
   - **Image URL** - Featured image (optional)
   - **Tags** - Comma-separated keywords
   - **Content** - Full post in Markdown

2. Click **"Create Pull Request"**
   - A new branch is automatically created
   - Changes are committed to the branch
   - A Pull Request is opened in your repository

3. **Review and Merge:**
   - Go to your repository's Pull Requests tab
   - Review the blog post changes
   - Merge the PR when ready
   - GitHub Actions automatically deploys to GitHub Pages

**Benefits:**
- ✅ No manual file editing required
- ✅ Full review process before publishing
- ✅ Automatic deployment after approval
- ✅ Complete change history
- ✅ Collaboration-friendly workflow

### Markdown Writing Tips

```markdown
# Main Heading
## Subheading

**Bold text** and *italic text*

- Bullet point 1
- Bullet point 2

1. Numbered list
2. Another item

[Link text](https://example.com)

![Image alt text](image-url.jpg)

> Blockquote for emphasis

```javascript
// Code block
const example = "Code with syntax highlighting";
```
\`\`\`

## 🎨 Customization

### Change Colors

Edit `css/style.css` and modify CSS variables:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #ec4899;
}
```

### Update Branding

1. Edit navigation brand in HTML files:
```html
<div class="nav-brand">
    <i class="fas fa-blog"></i>
    <span>Your Blog Name</span>
</div>
```

2. Update footer information in all HTML files

### Add Custom Categories

Edit `admin.html` and add options to the category select:

```html
<select id="postCategory">
    <option value="Your Category">Your Category</option>
</select>
```

Update filter tabs in `index.html`:

```html
<button class="filter-tab" data-filter="yourcategory">Your Category</button>
```

## � Admin Panel Security

The admin panel (`admin.html`) is **not linked** from public pages and requires:

- Direct URL access (bookmark it)
- GitHub Personal Access Token authentication
- Repository write permissions

**Security Best Practices:**

1. Never commit your token to the repository
2. Use tokens with minimal required scopes (`repo`, `workflow`)
3. Rotate tokens periodically
4. Revoke tokens if compromised
5. Consider IP restrictions on your GitHub account

**Access Control:**

Only users with:
- Repository write access
- Valid GitHub token
- Direct URL knowledge

...can create or edit blog posts.

## 🔧 Advanced Features

### Using External Markdown Files

Instead of storing content in JSON, you can use separate markdown files:

1. Create a file in `posts/` directory (e.g., `my-post.md`)
2. In your post JSON, use:

```json
{
    "contentFile": "my-post.md"
}
```

### Adding Custom Pages

Create new HTML files and link them in the navigation:

```html
<a href="about.html" class="nav-link">About</a>
```

### Analytics Integration

Add Google Analytics or other tracking:

```html
<!-- Add before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-ID');
</script>
```

## 🛠️ Development

### Local Development

Since this is a static site, you can use any local server:

**Python**:
```bash
python -m http.server 8000
```

**Node.js**:
```bash
npx serve
```

**VS Code**: Use the Live Server extension

Then visit `http://localhost:8000`

### Testing

1. Create test posts in admin panel
2. Verify all features work:
   - Search and filtering
   - Rating system
   - View counter
   - Share buttons
   - Comments (requires deployed site)
3. Test on different devices and browsers

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Posts not showing
- Check `data/posts.json` exists and is valid JSON
- Verify file path in JavaScript files
- Check browser console for errors

### Comments not loading
- Ensure GitHub Issues is enabled
- Verify Utterances is configured correctly
- Check that the repo name matches your repository

### Styles not loading
- Clear browser cache
- Check file paths are correct
- Verify CSS file is accessible

### Theme not switching
- Check localStorage is enabled in browser
- Verify JavaScript is running
- Check console for errors

## 🌟 Demo

Visit the live demo: [https://infoverve.github.io](https://infoverve.github.io)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/infoverve/infoverve.github.io/issues)
- **Discussions**: [GitHub Discussions](https://github.com/infoverve/infoverve.github.io/discussions)

## 🎯 Roadmap

- [ ] RSS feed generation
- [ ] Newsletter subscription
- [ ] Search engine sitemap
- [ ] Multi-author support
- [ ] Draft posts feature
- [ ] Post scheduling
- [ ] Image optimization
- [ ] Reading progress bar

## 💝 Acknowledgments

- Font Awesome for icons
- Utterances for comments
- Marked.js for Markdown parsing
- Unsplash for demo images

---

**Built with ❤️ for the blogging community**

*Happy Blogging! 🚀*
