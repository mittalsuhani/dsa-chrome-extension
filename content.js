chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getProblemInfo") {
        
        const pathParts = window.location.pathname.split('/');
        const problemSlug = pathParts[2]; 

        if (!problemSlug) {
            sendResponse({ success: false, error: "Could not detect problem slug." });
            return true;
        }

        // Added 'topicTags' to the GraphQL query
        const graphQLQuery = {
            query: `
                query questionHints($titleSlug: String!) {
                    question(titleSlug: $titleSlug) {
                        questionFrontendId
                        title
                        hints
                        topicTags {
                            name
                        }
                    }
                }
            `,
            variables: { titleSlug: problemSlug }
        };

        fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(graphQLQuery)
        })
        .then(response => response.json())
        .then(result => {
            if (result.data && result.data.question) {
                const questionData = result.data.question;
                
                // Extract topic names into a simple array of strings
                const topics = questionData.topicTags ? questionData.topicTags.map(t => t.name) : [];

                sendResponse({
                    success: true,
                    title: `${questionData.questionFrontendId}. ${questionData.title}`,
                    hints: questionData.hints || [],
                    topics: topics
                });
            } else {
                sendResponse({ success: false, error: "Problem data not found." });
            }
        })
        .catch(err => {
            console.error(err);
            sendResponse({ success: false, error: "Network error fetching LeetCode API." });
        });

        return true; 
    }
});