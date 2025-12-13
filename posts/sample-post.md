# InfoVerve Sample Post

This is a sample markdown file that demonstrates how to create blog posts using separate markdown files instead of storing content directly in the JSON database.

## Why Use Separate Markdown Files?

- **Better organization** - Keep your content in separate, manageable files
- **Version control** - Track changes to individual posts more easily
- **Easier editing** - Edit posts in your favorite markdown editor
- **Cleaner JSON** - Keep your posts.json file lightweight

## How to Use

1. Create a `.md` file in the `posts/` directory
2. Write your content in Markdown
3. In your `posts.json`, reference the file:

```json
{
  "id": "my-post",
  "title": "My Post",
  "contentFile": "sample-post.md",
  ...other fields
}
```

## Markdown Features

You can use all standard Markdown features:

### Text Formatting

**Bold text**, *italic text*, and ***bold italic***

### Lists

Unordered:
- Item 1
- Item 2
- Item 3

Ordered:
1. First
2. Second
3. Third

### Links and Images

[Visit InfoVerve](https://infoverve.github.io)

### Code

Inline code: `const example = "Hello";`

Code blocks:

```javascript
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet("World"));
```

### Quotes

> "The best way to predict the future is to create it."
> - Peter Drucker

### Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Search | ✓ | High |
| Comments | ✓ | High |
| Ratings | ✓ | Medium |

## Conclusion

Using separate markdown files gives you more flexibility in managing your blog content while keeping your codebase organized.

Happy blogging!
