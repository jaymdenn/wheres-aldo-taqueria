const { getStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
    // Allow GET requests only
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Method not allowed" })
        };
    }

    try {
        const blogStore = getStore("blog-articles");
        const slug = event.queryStringParameters?.slug;

        if (slug) {
            // Get single article by slug
            const article = await blogStore.get(slug, { type: "json" });

            if (!article) {
                return {
                    statusCode: 404,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify({ error: "Article not found" })
                };
            }

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify(article)
            };

        } else {
            // Get all articles (index only, not full content)
            let index = [];
            try {
                index = await blogStore.get("_index", { type: "json" }) || [];
            } catch (e) {
                index = [];
            }

            // Optional filtering by category
            const category = event.queryStringParameters?.category;
            if (category) {
                index = index.filter(article => article.category === category);
            }

            // Optional pagination
            const page = parseInt(event.queryStringParameters?.page) || 1;
            const limit = parseInt(event.queryStringParameters?.limit) || 10;
            const startIndex = (page - 1) * limit;
            const paginatedArticles = index.slice(startIndex, startIndex + limit);

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    articles: paginatedArticles,
                    total: index.length,
                    page: page,
                    totalPages: Math.ceil(index.length / limit)
                })
            };
        }

    } catch (error) {
        console.error("Get articles error:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ error: "Internal server error", details: error.message })
        };
    }
};
