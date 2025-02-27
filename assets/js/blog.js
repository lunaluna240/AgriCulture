document.addEventListener("DOMContentLoaded", function () {
  const blogContainer = document.getElementById("blog-container");
  const paginationContainer = document.getElementById("pagination-list");

  if (blogContainer && paginationContainer) {
    const postsPerPage = 3;
    let currentPage = 1;
    let totalPages = 1;
    let posts = [];

    fetch("assets/data/data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data");
        }
        return response.json();
      })
      .then((data) => {
        posts = data.blog_posts;
        totalPages = Math.ceil(posts.length / postsPerPage);
        renderPosts();
        setupPagination();
      })
      .catch((error) => {
        console.error("Error:", error);
        blogContainer.innerHTML = `<p class="error">Gagal memuat postingan blog.</p>`;
      });

    function renderPosts() {
      blogContainer.innerHTML = "";
      const start = (currentPage - 1) * postsPerPage;
      const end = start + postsPerPage;
      const paginatedPosts = posts.slice(start, end);

      if (paginatedPosts.length === 0) {
        blogContainer.innerHTML = `<p class="no-posts">Tidak ada postingan yang tersedia.</p>`;
        return;
      }

      paginatedPosts.forEach((post) => {
        const articleHTML = `
              <div class="col-lg-4">
                <article>
                  <div class="post-img">
                    <img src="${post.image}" class="img-fluid" alt="${post.title}">
                  </div>
                  <h3 class="post-title">${post.title}</h3>
                  <p>${post.contentp ? post.contentp.substring(0, 100) + "..." : "Tidak ada konten yang tersedia."}</p>
                  <a href="blog-details.html?id=${post.id}" class="readmore" target="_blank">
                    Baca lebih lanjut <i class="bi bi-arrow-right"></i>
                  </a>
                </article>
              </div>
            `;
        blogContainer.innerHTML += articleHTML;
      });
    }

    function setupPagination() {
      paginationContainer.innerHTML = "";
      if (totalPages <= 1) return;

      let paginationHTML = `<li><a href="#" data-page="${currentPage - 1}" class="prev ${currentPage === 1 ? "disabled" : ""}"><i class="bi bi-chevron-left"></i></a></li>`;

      for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<li><a href="#" data-page="${i}" class="${i === currentPage ? "active" : ""}">${i}</a></li>`;
      }

      paginationHTML += `<li><a href="#" data-page="${currentPage + 1}" class="next ${currentPage === totalPages ? "disabled" : ""}"><i class="bi bi-chevron-right"></i></a></li>`;
      paginationContainer.innerHTML = paginationHTML;

      document.querySelectorAll("#pagination-list a").forEach((button) => {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          const page = parseInt(this.getAttribute("data-page"));
          if (page >= 1 && page <= totalPages && page !== currentPage) {
            currentPage = page;
            renderPosts();
            setupPagination();
          }
        });
      });
    }
  }

  // Skrip untuk blog-details.html
  if (window.location.href.includes("blog-details.html")) {
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get("id");

    if (!blogId) {
      console.error("ID artikel tidak ditemukan di URL");
      document.getElementById("blog-content").innerHTML = `<p class="error">Artikel tidak ditemukan.</p>`;
      return;
    }

    fetch("assets/data/data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data");
        }
        return response.json();
      })
      .then((data) => {
        const post = data.blog_posts.find((p) => p.id == blogId);
        if (!post) {
          console.error("Artikel tidak ditemukan!");
          document.getElementById("blog-content").innerHTML = `<p class="error">Artikel tidak ditemukan.</p>`;
          return;
        }

        document.getElementById("blog-image").src = post.image;
        document.getElementById("blog-title").textContent = post.title;
        document.getElementById("blog-author").textContent = post.author || "Penulis tidak tersedia";
        document.getElementById("blog-date").textContent = post.date;

        const fullContent = Array.isArray(post.content) ? post.content.map((paragraph) => `<p>${paragraph}</p>`).join("") : `<p>${post.content}</p>`;
        document.getElementById("blog-content").innerHTML = fullContent;
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("blog-content").innerHTML = `<p class="error">Gagal memuat detail artikel.</p>`;
      });
  }
});
