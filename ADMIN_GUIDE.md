# Admin Workflow Guide

## Overview

The InfoVerve admin panel uses a Pull Request-based workflow for creating and managing blog posts. This ensures all content is reviewed before being published and provides a complete audit trail.

## Setup Instructions

### 1. Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens/new
2. Name: `Blog Admin`
3. Expiration: Choose based on your security requirements
4. Scopes required:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)

5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### 2. Access Admin Panel

- URL: `https://yourusername.github.io/admin.html`
- **Bookmark this URL** - it's not linked from public pages
- On first visit, you'll be prompted to enter your GitHub token
- Token is stored securely in browser localStorage

### 3. Configure GitHub Pages

1. Go to repository Settings → Pages
2. Source: **GitHub Actions** (not "Deploy from branch")
3. Save changes

This allows the automated workflow to deploy your site.

## Creating a Blog Post

### Step-by-Step Process

1. **Access Admin Panel**
   - Visit your bookmarked admin.html URL
   - Authenticate with GitHub token (first time only)

2. **Fill in Post Details**
   - Title: Your blog post headline
   - Author: Your name
   - Category: Select from dropdown
   - Date: Publication date
   - Excerpt: Brief summary (2-3 sentences)
   - Image URL: Featured image (optional)
   - Tags: Comma-separated keywords
   - Read Time: Estimated minutes to read
   - Featured: Check to pin on homepage
   - Content: Full post in Markdown

3. **Click "Create Pull Request"**
   - Admin panel creates a new branch
   - Commits changes to `data/posts.json`
   - Opens a Pull Request automatically
   - Shows success modal with PR link

4. **Review Pull Request**
   - Go to your repository on GitHub
   - Navigate to Pull Requests tab
   - Review the changes
   - Check the preview in PR description
   - Add comments if needed
   - Request reviews from collaborators (optional)

5. **Merge and Publish**
   - Click "Merge pull request" when ready
   - Confirm merge
   - GitHub Actions automatically deploys
   - Your blog post is live in 1-2 minutes!

## Editing Existing Posts

1. In admin panel, scroll to "All Posts" section
2. Find the post you want to edit
3. Click "Edit" button
4. Form auto-fills with current content
5. Make your changes
6. Click "Create Pull Request"
7. Review and merge PR as usual

## Deleting Posts

1. In admin panel, find the post
2. Click "Delete" button
3. Confirm deletion
4. Click "Create Pull Request"
5. Review and merge PR to finalize deletion

## Workflow Benefits

### ✅ Quality Control
- All posts reviewed before publishing
- Catch errors and typos
- Ensure brand consistency

### ✅ Collaboration
- Multiple authors can submit posts
- Editors review and approve
- Comment and discuss changes

### ✅ Version Control
- Complete history of all changes
- Revert unwanted changes easily
- See who made what changes when

### ✅ Automated Deployment
- No manual file uploads
- No SSH or FTP needed
- Instant deployment after merge

## Security Best Practices

### Token Management
- **Never share your token** with anyone
- **Never commit token** to repository
- Rotate tokens every 90 days
- Revoke immediately if compromised

### Access Control
- Only give repository access to trusted users
- Use GitHub Teams for organization
- Review access periodically
- Enable 2FA on GitHub account

### Admin Panel Access
- Don't link admin.html from public pages
- Use strong, unique GitHub password
- Clear browser data on shared computers
- Log out when done (click Logout button)

## Troubleshooting

### "Failed to create Pull Request"

**Causes:**
- Invalid or expired token
- Insufficient permissions
- Network issues

**Solutions:**
1. Click Logout and re-authenticate
2. Generate new token with correct scopes
3. Check internet connection
4. Verify repository access

### "Branch already exists"

**Cause:** Previous PR with same post ID wasn't merged

**Solution:**
1. Merge or close the existing PR
2. Delete the branch in GitHub
3. Try creating post again

### Changes not appearing on site

**Causes:**
- PR not merged yet
- GitHub Actions failed
- Caching issues

**Solutions:**
1. Check if PR is merged
2. Go to Actions tab → Check workflow status
3. Hard refresh browser (Ctrl+Shift+R)
4. Wait 2-3 minutes for deployment

### Token not saving

**Cause:** Browser localStorage disabled

**Solution:**
1. Enable cookies/localStorage in browser
2. Try different browser
3. Disable privacy extensions temporarily

## GitHub Actions Workflow

The automated deployment workflow:

1. **Triggered by:** Push to main branch (merged PR)
2. **Builds:** Prepares site files
3. **Deploys:** Publishes to GitHub Pages
4. **Time:** 1-2 minutes typically

**Check Status:**
- Repository → Actions tab
- Green checkmark = Success
- Red X = Failed (click to see logs)

## Multiple Authors

To add collaborators:

1. Repository Settings → Collaborators
2. Add GitHub username
3. They receive invitation email
4. They generate their own token
5. They can create PRs independently

**Workflow:**
- Authors create PRs
- Maintainers review and merge
- Everyone sees published posts

## Tips for Great Blog Posts

### Markdown Tips
- Use headings (##, ###) for structure
- Add code blocks with syntax highlighting
- Include images for visual appeal
- Use lists for scannable content
- Add blockquotes for emphasis

### Content Tips
- Start with compelling headline
- Write engaging excerpt
- Use relevant tags
- Choose appropriate category
- Set realistic read time
- Add high-quality featured image

### SEO Tips
- Use keywords naturally
- Write descriptive excerpts
- Use meaningful tags
- Choose clear titles
- Update posts regularly

## Backup and Recovery

### Manual Backup
Admin panel still has "Download JSON" option for backups.

### Recovery
If something goes wrong:
1. Find last working commit on GitHub
2. Create new branch from that commit
3. Open PR to restore
4. Merge to roll back changes

## Getting Help

**Resources:**
- README.md - Full documentation
- GitHub Issues - Report bugs
- Repository Wiki - Extended guides

**Common Issues:**
- Check GitHub Status page
- Review Actions logs
- Verify token permissions
- Test in different browser

---

**Remember:** The Pull Request workflow ensures quality and safety. Every change is reviewed and versioned!
