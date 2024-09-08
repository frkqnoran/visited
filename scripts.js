document.addEventListener('DOMContentLoaded', () => {
    const blogEntriesSection = document.querySelector('#blog-entries');
    const pagination = document.querySelector('#pagination');
    const postsPerPage = 3;
    let blogPosts = [];
    let currentPage = 1;

    // Blog verilerini JSON'dan çek
    function fetchBlogPosts() {
        return fetch('blog.json')
            .then(response => response.json())
            .then(data => {
                blogPosts = data;
                renderPosts();
                renderPagination();
            })
            .catch(error => console.error('Error fetching blog posts:', error));
    }

    function renderPosts() {
        blogEntriesSection.innerHTML = '';
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = Math.min(startIndex + postsPerPage, blogPosts.length);

        for (let i = startIndex; i < endIndex; i++) {
            const post = blogPosts[i];
            const postElement = document.createElement('div');
            postElement.classList.add('blog-post');

            const titleElement = document.createElement('h3');
            const linkElement = document.createElement('a');
            linkElement.href = post.url;
            linkElement.textContent = post.title;

            titleElement.appendChild(linkElement);

            const contentElement = document.createElement('p');
            contentElement.textContent = getFirstWords(post.content, 25); // İlk 25 kelimeyi al

            postElement.appendChild(titleElement);
            postElement.appendChild(contentElement);

            blogEntriesSection.appendChild(postElement);
        }
    }

    function getFirstWords(text, wordCount) {
        const words = text.split(/\s+/); // Kelimeleri ayır
        return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '...' : ''); // İlk 'wordCount' kelimeyi al ve '...' ekle
    }

    function renderPagination() {
        pagination.innerHTML = '';

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Önceki';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPosts();
                renderPagination();
            }
        });
        pagination.appendChild(prevButton);

        // Page numbers
        const totalPages = Math.ceil(blogPosts.length / postsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.textContent = i;
            if (i === currentPage) {
                pageLink.classList.add('active');
            }
            pageLink.href = 'javascript:void(0)';
            pageLink.addEventListener('click', () => {
                currentPage = i;
                renderPosts();
                renderPagination();
            });
            pagination.appendChild(pageLink);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Sonraki';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPosts();
                renderPagination();
            }
        });
        pagination.appendChild(nextButton);
    }

    fetchBlogPosts();
});
