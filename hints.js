// Local JavaScript object containing hints mapped by the problem's URL slug
const problemHints = {
    "two-sum": [
        "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
        "Try to use a hash map to store the numbers you've seen so far.",
        "As you iterate through the array, check if the target minus the current number exists in the hash map."
    ],
    "reverse-linked-list": [
        "You need to keep track of the previous node, the current node, and the next node.",
        "Don't forget to update the pointers one by one as you iterate.",
        "Make sure your new tail points to null."
    ],
    "longest-substring-without-repeating-characters": [
        "Can you use a sliding window approach?",
        "Use a hash set to store the characters in the current window.",
        "If you encounter a duplicate, shrink the window from the left until the duplicate is removed."
    ]
};