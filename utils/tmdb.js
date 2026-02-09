/**
 * TMDB API Utility
 * Search and retrieve movie information
 */
const TMDB_API = {
    // Default placeholder or empty. Should be set via settings.
    BASE_URL: 'https://api.themoviedb.org/3',
    WEBSITE_URL: 'https://www.themoviedb.org',

    /**
     * Get Configuration from Storage
     */
    getConfig: function() {
        return new Promise((resolve) => {
            chrome.storage.sync.get({ apiKey: '', language: '' }, (items) => {
                resolve(items);
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
            const query = encodeURIComponent(cleanTitle);
            const queryYear = cleanYear ? `&primary_release_year=${cleanYear}` : '';
            const url = `${this.BASE_URL}/search/movie?api_key=${apiKey}&query=${query}${queryYear}&language=${language}`;
            
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
