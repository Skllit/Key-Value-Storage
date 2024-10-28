document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('addBtn');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const clearBtn = document.getElementById('clearBtn');
    const toggleEntriesBtn = document.getElementById('toggleEntriesBtn');
    const toggleDarkMode = document.getElementById('toggleDarkMode');
    const searchKey = document.getElementById('searchKey');
    const keyInput = document.getElementById('key');
    const valueInput = document.getElementById('value');
    const suggestions = document.getElementById('suggestions');
    const status = document.getElementById('status');
    const displayKey = document.getElementById('displayKey');
    const displayValue = document.getElementById('displayValue');
    const displayArea = document.getElementById('displayArea');

    // Load data from storage
    chrome.storage.local.get('notepadData', (data) => {
        window.notepadData = data.notepadData || {};
        renderSuggestions();
    });

    // Add new key-value pair
    addBtn.addEventListener('click', () => {
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();
        if (key && value) {
            window.notepadData[key] = value;
            saveData();
            status.textContent = 'Added: ' + key;
            clearInputs();
            renderSuggestions();
        }
    });

    // Update existing key-value pair
    updateBtn.addEventListener('click', () => {
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();
        if (key in window.notepadData) {
            window.notepadData[key] = value;
            saveData();
            status.textContent = 'Updated: ' + key;
            clearInputs();
            renderSuggestions();
        } else {
            status.textContent = 'Key not found!';
        }
    });

    // Delete key-value pair
    deleteBtn.addEventListener('click', () => {
        const key = keyInput.value.trim();
        if (key in window.notepadData) {
            delete window.notepadData[key];
            saveData();
            status.textContent = 'Deleted: ' + key;
            clearInputs();
            renderSuggestions();
        } else {
            status.textContent = 'Key not found!';
        }
    });

    // Clear all key-value pairs
    clearBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all data?")) {
            window.notepadData = {};
            saveData();
            status.textContent = 'All data cleared!';
            clearInputs();
            renderSuggestions();
        }
    });

    // Toggle visibility of display area
    toggleEntriesBtn.addEventListener('click', () => {
        if (displayArea.style.display === "none") {
            displayArea.style.display = "block";
            toggleEntriesBtn.textContent = "Hide Entries";
        } else {
            displayArea.style.display = "none";
            toggleEntriesBtn.textContent = "Show Entries";
        }
    });

    // Toggle Dark Mode
    toggleDarkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        toggleDarkMode.textContent = isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
    });

    // Search and show suggestions
    searchKey.addEventListener('input', () => {
        const searchValue = searchKey.value.trim().toLowerCase();
        suggestions.innerHTML = '';
        for (const key in window.notepadData) {
            if (key.toLowerCase().includes(searchValue)) {
                const li = document.createElement('li');
                li.textContent = key;
                li.onclick = () => {
                    keyInput.value = key;
                    valueInput.value = window.notepadData[key];
                    displayKey.textContent = 'Key: ' + key;
                    displayValue.textContent = 'Value: ' + window.notepadData[key];
                    copyToClipboard(window.notepadData[key]);
                };
                suggestions.appendChild(li);
            }
        }
        // Display selected entry if a match is found
        if (suggestions.childElementCount > 0) {
            displayArea.style.display = "block"; // Show the display area
        } else {
            displayKey.textContent = 'Key: ';
            displayValue.textContent = 'Value: ';
            displayArea.style.display = "none"; // Hide if no match
        }
    });

    // Save data to local storage
    function saveData() {
        chrome.storage.local.set({ notepadData: window.notepadData });
    }

    // Render suggestions based on current data
    function renderSuggestions() {
        suggestions.innerHTML = '';
        for (const key in window.notepadData) {
            const li = document.createElement('li');
            li.textContent = key;
            li.onclick = () => {
                keyInput.value = key;
                valueInput.value = window.notepadData[key];
                displayKey.textContent = 'Key: ' + key;
                displayValue.textContent = 'Value: ' + window.notepadData[key];
                displayArea.style.display = "block"; // Show the display area
            };
            suggestions.appendChild(li);
        }
    }

    // Clear input fields
    function clearInputs() {
        keyInput.value = '';
        valueInput.value = '';
        searchKey.value = '';
        suggestions.innerHTML = '';
        displayKey.textContent = 'Key: ';
        displayValue.textContent = 'Value: ';
        displayArea.style.display = "none"; // Hide display area
    }

    // Copy value to clipboard
    function copyToClipboard(value) {
        navigator.clipboard.writeText(value).then(() => {
            status.textContent = 'Copied to clipboard!';
        }, () => {
            status.textContent = 'Failed to copy!';
        });
    }
});
