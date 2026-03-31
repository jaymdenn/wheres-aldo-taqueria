const { getStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" })
        };
    }

    try {
        const payload = JSON.parse(event.body);

        // Validate required fields
        if (!payload.action || !payload.article) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing required fields: action and article" })
            };
        }

        // Optional: Validate webhook token
        const expectedToken = process.env.BLOG_WEBHOOK_SECRET;
        if (expectedToken && payload.token !== expectedToken) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Invalid webhook token" })
            };
        }

        const { action, article } = payload;

        // Validate article fields
        if (!article.id || !article.slug || !article.title || !article.content) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing required article fields: id, slug, title, content" })
            };
        }

        // Get the blog store
        const blogStore = getStore("blog-articles");

        if (action === "create" || action === "update") {
            // Store the article
            const articleData = {
                id: article.id,
                slug: article.slug,
                title: article.title,
                excerpt: article.excerpt || "",
                content: article.content,
                category: article.category || "uncategorized",
                featuredImage: article.featuredImage || null,
                wordCount: article.wordCount || 0,
                publishedAt: article.publishedAt || new Date().toISOString(),
                client: article.client || null,
                updatedAt: new Date().toISOString()
            };

            // Store by slug for easy retrieval
            await blogStore.setJSON(article.slug, articleData);

            // Update the articles index
            let index = [];
            try {
                index = await blogStore.get("_index", { type: "json" }) || [];
            } catch (e) {
                index = [];
            }

            // Remove existing entry if updating
            index = index.filter(item => item.slug !== article.slug);

            // Add to index
            index.unshift({
                id: article.id,
                slug: article.slug,
                title: article.title,
                excerpt: article.excerpt || "",
                category: article.category || "uncategorized",
                featuredImage: article.featuredImage || null,
                publishedAt: articleData.publishedAt
            });

            // Sort by publish date (newest first)
            index.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

            await blogStore.setJSON("_index", index);

            return {
                statusCode: action === "create" ? 201 : 200,
                body: JSON.stringify({
                    success: true,
                    message: `Article ${action}d successfully`,
                    slug: article.slug
                })
            };

        } else if (action === "delete") {
            // Delete the article
            await blogStore.delete(article.slug);

            // Update index
            let index = [];
            try {
                index = await blogStore.get("_index", { type: "json" }) || [];
            } catch (e) {
                index = [];
            }

            index = index.filter(item => item.slug !== article.slug);
            await blogStore.setJSON("_index", index);

            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: "Article deleted successfully"
                })
            };

        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid action. Use 'create', 'update', or 'delete'" })
            };
        }

    } catch (error) {
        console.error("Webhook error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error", details: error.message })
        };
    }
};
