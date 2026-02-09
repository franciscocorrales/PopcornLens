// Saves options to chrome.storage
const saveOptions = () => {
    const apiKey = document.getElementById('apiKey').value;
    const language = document.getElementById('language').value;
    const cacheEnabled = document.getElementById('cacheEnabled').checked;
  
    chrome.storage.sync.set(
      { 
        apiKey: apiKey, 
        language: language,
        cacheEnabled: cacheEnabled
      },
      () => {
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 2000);
      }
    );
  };
  
  // Restores select box and checkbox state
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { apiKey: '', language: '', cacheEnabled: true }, // Defaults
      (items) => {
        document.getElementById('apiKey').value = items.apiKey;
        document.getElementById('language').value = items.language;
        document.getElementById('cacheEnabled').checked = items.cacheEnabled;
      }
    );
  };

  const clearCache = async () => {
      const btn = document.getElementById('flushCache');
      const originalText = btn.textContent;
      
      btn.disabled = true;
      btn.textContent = "Clearing...";

      const count = await Cache.clear();
      
      btn.textContent = `Cleared ${count} items`;
      setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
      }, 2000);
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
  document.getElementById('flushCache').addEventListener('click', clearCache);
