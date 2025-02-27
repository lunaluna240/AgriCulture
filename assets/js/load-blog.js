document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
  
    fetch('assets/data/blogs.json')
      .then((response) => response.json())
      .then((blogs) => {
        const blog = blogs.find((b) => b.id == blogId);
        if (blog) {
          displayBlog(blog);
        } else {
          console.warn('Blog not found. Showing static content as fallback.');
        }
      })
      .catch((error) => {
        console.error('Error loading blog data:', error);
      });
  });
  
  function displayBlog(blog) {
    // Isi data ke elemen HTML
    document.getElementById('blog-image').src = blog.image;
    document.getElementById('blog-title').textContent = blog.title;
    document.getElementById('blog-author').textContent = blog.author;
    document.getElementById('blog-date').textContent = blog.date;
    document.getElementById('blog-date').setAttribute('datetime', blog.date);
  
    // Isi konten blog
    const blogContent = document.getElementById('blog-content');
    blogContent.innerHTML = blog.content
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join('');
  
    // Isi kategori
    const blogCategory = document.getElementById('blog-category');
    blogCategory.innerHTML = `<li><a href="#">${blog.category}</a></li>`;
  
    // Isi tags
    const blogTags = document.getElementById('blog-tags');
    blogTags.innerHTML = blog.tags
      .map((tag) => `<li><a href="#">${tag}</a></li>`)
      .join('');
  }