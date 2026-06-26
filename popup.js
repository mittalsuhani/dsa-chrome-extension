document.addEventListener('DOMContentLoaded', () => {
    const titleEl = document.getElementById('problem-title');
    const hintsContainer = document.getElementById('hints-container');
    const showHintBtn = document.getElementById('show-hint-btn');
    const statusMessage = document.getElementById('status-message');

    let currentHints = [];
    let hintIndex = 0;

    // Ask Chrome for the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        
        // Ensure the user is actually on a LeetCode problem page
        if (activeTab.url && activeTab.url.includes("leetcode.com/problems/")) {
            
            // Send message to content.js injected in the tab
            chrome.tabs.sendMessage(activeTab.id, { action: "getProblemInfo" }, (response) => {
                if (chrome.runtime.lastError) {
                    titleEl.textContent = "Error";
                    statusMessage.textContent = "Could not connect to the page. Please refresh the LeetCode tab.";
                    return;
                }

                if (response) {
                    titleEl.textContent = response.title;
                    statusMessage.style.display = 'none';
                    
                    // Look up the slug in our local hints.js object
                    if (problemHints[response.slug]) {
                        currentHints = problemHints[response.slug];
                        showHintBtn.style.display = 'block';
                        
                        if (currentHints.length === 0) {
                            showNoHintsMessage();
                        }
                    } else {
                        showNoHintsMessage();
                    }
                }
            });
        } else {
            titleEl.textContent = "Not on a Problem Page";
            statusMessage.textContent = "Navigate to a LeetCode problem to see hints.";
        }
    });

    // Handle clicking the "Reveal Next Hint" button
    showHintBtn.addEventListener('click', () => {
        if (hintIndex < currentHints.length) {
            const hintEl = document.createElement('div');
            hintEl.className = 'hint-card';
            hintEl.innerHTML = `<strong>Hint ${hintIndex + 1}:</strong> ${currentHints[hintIndex]}`;
            hintsContainer.appendChild(hintEl);
            
            hintIndex++;

            // Hide the button if we run out of hints
            if (hintIndex >= currentHints.length) {
                showHintBtn.style.display = 'none';
            }
        }
    });

    function showNoHintsMessage() {
        statusMessage.textContent = "No local hints available for this problem yet.";
        statusMessage.style.display = 'block';
        showHintBtn.style.display = 'none';
    }
});