document.addEventListener('DOMContentLoaded', () => {
    const titleEl = document.getElementById('problem-title');
    const hintsContainer = document.getElementById('hints-container');
    const showHintBtn = document.getElementById('show-hint-btn');
    const statusMessage = document.getElementById('status-message');

    let currentHints = [];
    let hintIndex = 0;

    // Local dictionary containing conceptual strategies for common topics
    const topicStrategies = {
        "Array": "Consider checking if sorting the array simplifies the problem, or look into a single-pass hash map approach to optimize runtime.",
        "String": "Think about using two-pointers, sliding window patterns, or frequency arrays (size 26 for lowercase alphabet) to track characters efficiently.",
        "Linked List": "Watch out for null-pointer exceptions at the boundaries. Utilizing a temporary 'dummy' head node often streamlines node rewiring significantly.",
        "Math": "Watch out for integer overflow or underflow limits. Try simulating operations with paper and pencil to uncover a cyclic pattern or algebraic formula.",
        "Two Pointers": "Try setting elements at opposite ends moving inward ($O(N)$ sorting companion), or use a fast/slow pointer setup to detect cycles.",
        "Sliding Window": "Maintain a dynamic subarray window. Expand from the right to absorb elements, and shrink from the left as soon as conditions break down.",
        "Hash Table": "Leverage a hash map or hash set to trade memory for speed, achieving instantaneous $O(1)$ lookups for elements you have already processed.",
        "Binary Search": "If the dataset is sorted, or if the solution space follows a predictable true/false monotonic cliff, use a mid-point boundary calculation.",
        "Dynamic Programming": "Break the problem down into repetitive subproblems. Track states using a memoization cache (top-down) or an iterative DP table (bottom-up).",
        "Stack": "Useful for parsed syntax tracking (like matching parentheses) or maintaining monotonic ranges where processing relies strictly on the most recent elements.",
        "Tree": "Most tree problems decompose beautifully with recursion (DFS). If tracking horizontal structural layouts, utilize a queue for level-order traversal (BFS).",
        "Graph": "Map out nodes and edges. Use Breadth-First Search (BFS) if you need the absolute shortest path, or Depth-First Search (DFS) for connectivity checks.",
        "Recursion": "Clearly anchor your base case first to prevent fatal stack overflows, then design how subproblem returns merge into the final result."
    };

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

                    // Case A: Official hints exist
                    if (response.hints && response.hints.length > 0) {
                        currentHints = response.hints;
                    } 
                    // Case B: No official hints, fallback to generating topic-based hints
                    else if (response.topics && response.topics.length > 0) {
                        response.topics.forEach(topic => {
                            if (topicStrategies[topic]) {
                                currentHints.push(`[Topic: ${topic}] ${topicStrategies[topic]}`);
                            }
                        });
                    }

                    // Toggle visibility of the action button based on hint queue
                    if (currentHints.length > 0) {
                        showHintBtn.style.display = 'block';
                    } else {
                        showNoHintsMessage("No official hints or matching topic strategies found.");
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
            
            // Highlight structural tag prefixes differently if it's a topic hint
            if (currentHints[hintIndex].startsWith("[Topic:")) {
                hintEl.innerHTML = `<strong>Strategy Hint:</strong> ${currentHints[hintIndex]}`;
                hintEl.style.borderLeft = "4px solid #00b8a3"; // Give topic hints a distinct green border accent
            } else {
                hintEl.innerHTML = `<strong>Hint ${hintIndex + 1}:</strong> ${currentHints[hintIndex]}`;
            }
            
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