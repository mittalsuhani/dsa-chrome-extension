// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getProblemInfo") {
        
        // 1. Get the exact problem slug from the URL (e.g., "two-sum")
        const pathParts = window.location.pathname.split('/');
        const problemSlug = pathParts[2]; // /problems/two-sum/...
        
        // 2. Try to grab the title from the page DOM
        // Fallback title generated from the slug in case the DOM query fails
        let title = problemSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        // LeetCode changes its DOM often, but titles are usually in an <a> tag or <h1>
        const titleElements = [
            document.querySelector('.text-title-large a'),
            document.querySelector('a.text-label-1'),
            document.querySelector('h1')
        ];

        for (let el of titleElements) {
            if (el && el.innerText) {
                title = el.innerText;
                // Sometimes titles are prefixed with the problem number (e.g., "1. Two Sum")
                if (title.match(/^\d+\.\s/)) {
                    title = title.split('. ')[1]; 
                }
                break;
            }
        }

        // Send data back to the popup
        sendResponse({ slug: problemSlug, title: title });
    }
    return true; // Keep the message channel open for asynchronous response
});