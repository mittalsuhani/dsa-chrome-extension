document.addEventListener('DOMContentLoaded', () => {
    const titleEl = document.getElementById('problem-title');
    const hintsContainer = document.getElementById('hints-container');
    const showHintBtn = document.getElementById('show-hint-btn');
    const statusMessage = document.getElementById('status-message');

    let currentHints = [];
    let hintIndex = 0;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        
        if (activeTab.url && activeTab.url.includes("leetcode.com/problems/")) {
            
            chrome.tabs.sendMessage(activeTab.id, { action: "getProblemInfo" }, (response) => {
                if (chrome.runtime.lastError) {
                    titleEl.textContent = "Error";
                    statusMessage.textContent = "Could not connect to page. Please refresh your LeetCode tab.";
                    return;
                }

                if (response && response.success) {
                    titleEl.textContent = response.title;
                    statusMessage.style.display = 'none';
                    currentHints = response.hints;

                    if (currentHints.length > 0) {
                        showHintBtn.style.display = 'block';
                    } else {
                        showNoHintsMessage("This problem does not contain any official hints.");
                    }
                } else {
                    titleEl.textContent = "Error";
                    showNoHintsMessage(response?.error || "Failed to read LeetCode data.");
                }
            });
        } else {
            titleEl.textContent = "Not on a Problem Page";
            statusMessage.textContent = "Navigate to a LeetCode problem to see hints.";
        }
    });

    showHintBtn.addEventListener('click', () => {
        if (hintIndex < currentHints.length) {
            const hintEl = document.createElement('div');
            hintEl.className = 'hint-card';
            hintEl.innerHTML = `<strong>Hint ${hintIndex + 1}:</strong> ${currentHints[hintIndex]}`;
            hintsContainer.appendChild(hintEl);
            
            hintIndex++;

            if (hintIndex >= currentHints.length) {
                showHintBtn.style.display = 'none';
            }
        }
    });

    function showNoHintsMessage(message) {
        statusMessage.textContent = message;
        statusMessage.style.display = 'block';
        showHintBtn.style.display = 'none';
    }
});