/**
 * TMDB API Utility
 * Search and retrieve movie information
 */
const TMDB_API = {
    // Default placeholder or empty. Should be set via settings.
    BASE_URL: 'https://api.themoviedb.org/3',

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
     * @param {string|number} year - Release year (optional)
     * @param {string} detectedLang - Language detected from the page
     * @returns {Promise<Object|null>} Search results or null on error
     */
    search: async function(title, year, detectedLang) {
        if (!title) return null;

        const config = await this.getConfig();
        const apiKey = config.apiKey;
        
        if (!apiKey) {
            console.warn("PopcornLens: No API Key configured.");
            return null;
        }

        // Use user preference if set, otherwise use detected page language
        const language = config.language || detectedLang || 'en-US';
        
        try {
            const query = encodeURIComponent(title);
            const queryYear = year ? `&primary_release_year=${year}` : '';
            const url = `${this.BASE_URL}/search/movie?api_key=${apiKey}&query=${query}${queryYear}&language=${language}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn(`PopcornLens: TMDB API Error ${response.status}`);
                return null;
            }
            
            return await response.json();
        } catch (error) {
            console.error("PopcornLens: Network Error", error);
            return null;
        }
    }
};
