chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getProblemInfo") {
        
        // Extract the exact problem slug from the URL path
        const pathParts = window.location.pathname.split('/');
        const problemSlug = pathParts[2]; 

        if (!problemSlug) {
            sendResponse({ success: false, error: "Could not detect problem slug from URL." });
            return true;
        }

        // LeetCode's public GraphQL query structure for pulling problem metadata
        const graphQLQuery = {
            query: `
                query questionHints($titleSlug: String!) {
                    question(titleSlug: $titleSlug) {
                        questionFrontendId
                        title
                        hints
                    }
                }
            `,
            variables: { titleSlug: problemSlug }
        };

        // Query LeetCode's backend API directly from the page context
        fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(graphQLQuery)
        })
        .then(response => response.json())
        .then(result => {
            if (result.data && result.data.question) {
                const questionData = result.data.question;
                
                sendResponse({
                    success: true,
                    title: `${questionData.questionFrontendId}. ${questionData.title}`,
                    hints: questionData.hints || []
                });
            } else {
                sendResponse({ success: false, error: "Problem not found in LeetCode database." });
            }
        })
        .catch(err => {
            console.error("GraphQL Fetch Error:", err);
            sendResponse({ success: false, error: "Network error fetching LeetCode API." });
        });

        return true; // Keeps the message pipeline open for asynchronous network responses
    }
});