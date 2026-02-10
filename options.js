// Saves options to chrome.storage
const saveOptions = () => {
    const apiKey = document.getElementById('apiKey').value;
    const language = document.getElementById('language').value;
    const cacheEnabled = document.getElementById('cacheEnabled').checked;
    const fontSize = document.getElementById('fontSize').value;
  
    const settings = {};
    settings[PopcornConfig.STORAGE.API_KEY] = apiKey;
    settings[PopcornConfig.STORAGE.LANGUAGE] = language;
    settings[PopcornConfig.STORAGE.CACHE_ENABLED] = cacheEnabled;
    settings[PopcornConfig.STORAGE.FONT_SIZE] = fontSize;

    chrome.storage.sync.set(settings, () => {
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, PopcornConfig.DEFAULTS.TOAST_DURATION);
      }
    );
  };
  
  // Restores select box and checkbox state
  const restoreOptions = () => {
    const defaults = {
        [PopcornConfig.STORAGE.API_KEY]: PopcornConfig.DEFAULTS.API_KEY,
        [PopcornConfig.STORAGE.LANGUAGE]: PopcornConfig.DEFAULTS.LANGUAGE,
        [PopcornConfig.STORAGE.CACHE_ENABLED]: PopcornConfig.DEFAULTS.CACHE_ENABLED,
        [PopcornConfig.STORAGE.FONT_SIZE]: PopcornConfig.DEFAULTS.FONT_SIZE
    };

    chrome.storage.sync.get(defaults, (items) => {
        document.getElementById('apiKey').value = items[PopcornConfig.STORAGE.API_KEY];
        document.getElementById('language').value = items[PopcornConfig.STORAGE.LANGUAGE];
        document.getElementById('cacheEnabled').checked = items[PopcornConfig.STORAGE.CACHE_ENABLED];
        
        // Font Size
        document.getElementById('fontSize').value = items[PopcornConfig.STORAGE.FONT_SIZE];
        document.getElementById('fontSizeDisplay').textContent = `${items[PopcornConfig.STORAGE.FONT_SIZE]}px`;
      }
    );
  };

  const updateFontSizeDisplay = (e) => {
      document.getElementById('fontSizeDisplay').textContent = `${e.target.value}px`;
  };

  const clearCache = async () => {
      const btn = document.getElementById('flushCache');
      const originalText = btn.textContent;
      
      btn.disabled = true;
      btn.textContent = "Clearing...";

      // Assuming Cache.clear returns the count or void
      const result = await Cache.clear();
      const count = (typeof result === 'number') ? result : 'all';
      
      btn.textContent = `Cleared ${count} items`;
      setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
      }, PopcornConfig.DEFAULTS.TOAST_DURATION);
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
  document.getElementById('flushCache').addEventListener('click', clearCache);
  document.getElementById('fontSize').addEventListener('input', updateFontSizeDisplay);
