/**
 * TMDB API Utility
 * Search and retrieve movie information
 */
const TMDB_API = {
    // Use constants from config
    BASE_URL: PopcornConfig.API.BASE_URL,
    WEBSITE_URL: PopcornConfig.API.WEBSITE_URL,

    /**
     * Get Configuration from Storage
     */
    getConfig: function() {
        return new Promise((resolve) => {
            const keys = {
                [PopcornConfig.STORAGE.API_KEY]: PopcornConfig.DEFAULTS.API_KEY,
                [PopcornConfig.STORAGE.LANGUAGE]: PopcornConfig.DEFAULTS.LANGUAGE
            };
            
            chrome.storage.sync.get(keys, (items) => {
                // Return normalized keys if needed by converting back from storage keys to props, 
                // but for now we consume the storage keys directly or map them here.
                // Let's map them to a clean config object to keep the rest of the code clean
                // IF strictly necessary, but actually we can just use the items as they are returned
                // with the keys defined in PopcornConfig.STORAGE.
                resolve({
                    apiKey: items[PopcornConfig.STORAGE.API_KEY],
                    language: items[PopcornConfig.STORAGE.LANGUAGE]
                });
            });
        });
    },

    /**
     * Search for a movie on TMDB
     * @param {string} title - Movie title
     * @param {string|number} [year] - Release year (optional)
     * @param {string} [detectedLang] - Language detected from the page (optional)
     * @returns {Promise<Object|null>} Search results or null on error
     */
    search: async function(title, year, detectedLang) {
        // Validation: Title is strictly required and must not be empty
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return null;
        }

        const config = await this.getConfig();
        const apiKey = config.apiKey;
        
        if (!apiKey) {
            console.warn("PopcornLens: No API Key configured.");
            return null;
        }

        const language = config.language || detectedLang || 'en-US';
        
        // Prepare keys for cache lookup
        const cleanTitle = title.trim();
        const cleanYear = (year && String(year).trim().length === 4) ? String(year).trim() : '';
        
        // --- Cache Check ---
        const cachedResult = await Cache.get(cleanTitle, cleanYear, language);
        if (cachedResult) {
            console.log(`PopcornLens: Cache HIT for "${cleanTitle}"`);
            return cachedResult;
        }

        try {
            const params = new URLSearchParams({
                api_key: apiKey,
                query: cleanTitle,
                language: language,
                page: 1,
                include_adult: false
            });

            if (cleanYear) {
                params.append('primary_release_year', cleanYear);
            }

            const url = `${this.BASE_URL}/search/movie?${params.toString()}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn(`PopcornLens: TMDB API Error ${response.status}`);
                return null;
            }
            
            const data = await response.json();

            // --- Cache Save ---
            // Only cache if we actually found results (avoid caching bad queries/misses)
            if (data && data.results && data.results.length > 0) {
                Cache.set(cleanTitle, cleanYear, language, data);
            }

            return data;
        } catch (error) {
            console.error("PopcornLens: Network Error", error);
            return null;
        }
    }
};
