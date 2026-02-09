// Saves options to chrome.storage
const saveOptions = () => {
    const apiKey = document.getElementById('apiKey').value;
    const language = document.getElementById('language').value;
  
    chrome.storage.sync.set(
      { apiKey: apiKey, language: language },
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 2000);
      }
    );
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { apiKey: '', language: '' }, // Defaults
      (items) => {
        document.getElementById('apiKey').value = items.apiKey;
        document.getElementById('language').value = items.language;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
