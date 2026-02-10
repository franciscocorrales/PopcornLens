/**
 * Caching Utility for PopcornLens
 * Stores API responses to reduce network calls
 */
const Cache = {
    // Use constants from config
    PREFIX: PopcornConfig.CACHE.PREFIX,
    DEFAULT_EXPIRY: PopcornConfig.CACHE.TTL,

    /**
     * Generate storage key
     */
    _getKey: function(title, year, language) {
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const safeLang = (language || 'en-US').toLowerCase();
        return `${this.PREFIX}${safeTitle}_${year || 'na'}_${safeLang}`;
    },

    /**
     * Check if cache is enabled in settings
     * @returns {Promise<boolean>}
     */
    isEnabled: function() {
        return new Promise((resolve) => {
            const key = PopcornConfig.STORAGE.CACHE_ENABLED;
            const defaultValue = PopcornConfig.DEFAULTS.CACHE_ENABLED;
            
            const query = {};
            query[key] = defaultValue;

            chrome.storage.sync.get(query, (items) => {
                resolve(items[key]);
            });
        });
    },

    /**
     * Retrieve item from cache
     */
    get: async function(title, year, language) {
        if (!(await this.isEnabled())) return null;

        const key = this._getKey(title, year, language);
        
        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                const item = result[key];
                
                if (!item) {
                    resolve(null);
                    return;
                }

                // Check Expiration
                if (Date.now() - item.timestamp > this.DEFAULT_EXPIRY) {
                    console.log(`PopcornLens: Cache EXPIRED for "${title}"`);
                    chrome.storage.local.remove(key); // Cleanup
                    resolve(null);
                } else {
                    resolve(item.data);
                }
            });
        });
    },

    /**
     * Save item to cache
     */
    set: async function(title, year, language, data) {
        if (!(await this.isEnabled())) return;

        const key = this._getKey(title, year, language);
        const item = {
            timestamp: Date.now(),
            data: data
        };

        const storageItem = {};
        storageItem[key] = item;
        
        chrome.storage.local.set(storageItem, () => {
           // console.log(`PopcornLens: Cached "${title}"`);
        });
    },

    /**
     * Clear all PopcornLens cache items
     */
    clear: async function() {
        return new Promise((resolve) => {
            chrome.storage.local.get(null, (items) => {
                const keysToRemove = Object.keys(items).filter(k => k.startsWith(this.PREFIX));
                if (keysToRemove.length > 0) {
                    chrome.storage.local.remove(keysToRemove, () => {
                        console.log(`PopcornLens: Flushed ${keysToRemove.length} cache items.`);
                        resolve(keysToRemove.length);
                    });
                } else {
                    resolve(0);
                }
            });
        });
    }
};
