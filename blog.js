/* ========================================
   Where's Aldo? Taqueria - Blog JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Determine which page we're on
    const isBlogListing = document.getElementById('blog-grid') !== null;
    const isArticlePage = document.getElementById('article-page') !== null;

    if (isBlogListing) {
        initBlogListing();
    }

    if (isArticlePage) {
        initArticlePage();
    }

    // Initialize navigation (for both pages)
    initNavigation();
});

/* ========================================
   Blog Listing Page
   ======================================== */
let currentPage = 1;
let currentCategory = 'all';
let totalPages = 1;

function initBlogListing() {
    // Load initial articles
    loadArticles();

    // Set up filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            currentPage = 1;
            loadArticles();
        });
    });

    // Set up pagination
    document.getElementById('prev-page')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadArticles();
        }
    });

    document.getElementById('next-page')?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadArticles();
        }
    });

    // Newsletter form
    document.getElementById('newsletter-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        // For now, just show a success message
        alert('Thanks for subscribing! You\'ll hear from us soon.');
        this.reset();
    });
}

async function loadArticles() {
    const grid = document.getElementById('blog-grid');
    const emptyState = document.getElementById('blog-empty');
    const pagination = document.getElementById('blog-pagination');

    // Show loading
    grid.innerHTML = `
        <div class="blog-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading articles...</p>
        </div>
    `;

    try {
        let url = `/.netlify/functions/get-articles?page=${currentPage}&limit=9`;
        if (currentCategory !== 'all') {
            url += `&category=${currentCategory}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to load articles');
        }

        const data = await response.json();
        totalPages = data.totalPages;

        if (data.articles.length === 0) {
            grid.innerHTML = '';
            emptyState.style.display = 'block';
            pagination.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            renderArticles(data.articles);
            updatePagination(data);
        }

    } catch (error) {
        console.error('Error loading articles:', error);
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        pagination.style.display = 'none';
    }
}

function renderArticles(articles) {
    const grid = document.getElementById('blog-grid');

    grid.innerHTML = articles.map(article => `
        <article class="blog-card">
            <div class="blog-card-image">
                ${article.featuredImage
                    ? `<img src="${article.featuredImage}" alt="${escapeHtml(article.title)}" loading="lazy">`
                    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:4rem;">🌮</div>`
                }
                <span class="category-badge">${escapeHtml(formatCategory(article.category))}</span>
            </div>
            <div class="blog-card-content">
                <h3><a href="article.html?slug=${encodeURIComponent(article.slug)}">${escapeHtml(article.title)}</a></h3>
                <p class="blog-card-excerpt">${escapeHtml(truncate(article.excerpt, 120))}</p>
                <div class="blog-card-meta">
                    <span><i class="fas fa-calendar-alt"></i> ${formatDate(article.publishedAt)}</span>
                </div>
            </div>
        </article>
    `).join('');
}

function updatePagination(data) {
    const pagination = document.getElementById('blog-pagination');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const info = document.getElementById('pagination-info');

    if (data.totalPages <= 1) {
        pagination.style.display = 'none';
    } else {
        pagination.style.display = 'flex';
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= data.totalPages;
        info.textContent = `Page ${currentPage} of ${data.totalPages}`;
    }
}

/* ========================================
   Article Page
   ======================================== */
function initArticlePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        showArticleNotFound();
        return;
    }

    loadArticle(slug);
}

async function loadArticle(slug) {
    const loadingEl = document.getElementById('article-loading');
    const notFoundEl = document.getElementById('article-not-found');
    const articleEl = document.getElementById('article-page');
    const relatedEl = document.getElementById('related-articles');

    try {
        const response = await fetch(`/.netlify/functions/get-articles?slug=${encodeURIComponent(slug)}`);

        if (!response.ok) {
            throw new Error('Article not found');
        }

        const article = await response.json();

        // Hide loading, show article
        loadingEl.style.display = 'none';
        articleEl.style.display = 'block';

        // Populate article content
        populateArticle(article);

        // Load related articles
        loadRelatedArticles(article.category, article.slug);

    } catch (error) {
        console.error('Error loading article:', error);
        showArticleNotFound();
    }
}

function populateArticle(article) {
    // Update page title and meta
    document.getElementById('page-title').textContent = `${article.title} | Where's Aldo? Taqueria`;
    document.getElementById('page-description').content = article.excerpt;
    document.getElementById('og-title').content = article.title;
    document.getElementById('og-description').content = article.excerpt;
    if (article.featuredImage) {
        document.getElementById('og-image').content = article.featuredImage;
    }

    // Hero section
    const heroEl = document.getElementById('article-hero');
    if (article.featuredImage) {
        heroEl.style.backgroundImage = `url(${article.featuredImage})`;
    }

    document.getElementById('article-category').textContent = formatCategory(article.category);
    document.getElementById('article-title').textContent = article.title;
    document.getElementById('article-date').innerHTML = `<i class="fas fa-calendar-alt"></i> ${formatDate(article.publishedAt)}`;

    // Calculate read time (average 200 words per minute)
    const readTime = Math.ceil((article.wordCount || 500) / 200);
    document.getElementById('article-read-time').innerHTML = `<i class="fas fa-clock"></i> ${readTime} min read`;

    // Article content
    document.getElementById('article-content').innerHTML = article.content;

    // Share buttons
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(article.title);

    document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
    document.getElementById('share-linkedin').href = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`;

    document.getElementById('share-copy').addEventListener('click', function() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            const icon = this.querySelector('i');
            icon.className = 'fas fa-check';
            setTimeout(() => {
                icon.className = 'fas fa-link';
            }, 2000);
        });
    });
}

async function loadRelatedArticles(category, currentSlug) {
    try {
        const response = await fetch(`/.netlify/functions/get-articles?category=${category}&limit=3`);

        if (!response.ok) return;

        const data = await response.json();

        // Filter out current article and limit to 3
        const related = data.articles
            .filter(a => a.slug !== currentSlug)
            .slice(0, 3);

        if (related.length > 0) {
            const relatedEl = document.getElementById('related-articles');
            const gridEl = document.getElementById('related-grid');

            gridEl.innerHTML = related.map(article => `
                <article class="blog-card">
                    <div class="blog-card-image">
                        ${article.featuredImage
                            ? `<img src="${article.featuredImage}" alt="${escapeHtml(article.title)}" loading="lazy">`
                            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">🌮</div>`
                        }
                    </div>
                    <div class="blog-card-content">
                        <h3><a href="article.html?slug=${encodeURIComponent(article.slug)}">${escapeHtml(article.title)}</a></h3>
                        <div class="blog-card-meta">
                            <span><i class="fas fa-calendar-alt"></i> ${formatDate(article.publishedAt)}</span>
                        </div>
                    </div>
                </article>
            `).join('');

            relatedEl.style.display = 'block';
        }

    } catch (error) {
        console.error('Error loading related articles:', error);
    }
}

function showArticleNotFound() {
    document.getElementById('article-loading').style.display = 'none';
    document.getElementById('article-not-found').style.display = 'flex';
}

/* ========================================
   Navigation (shared)
   ======================================== */
function initNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            this.classList.toggle('active');

            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Header background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Set initial state
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }
}

/* ========================================
   Utility Functions
   ======================================== */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function truncate(text, length) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatCategory(category) {
    if (!category) return 'Uncategorized';
    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
