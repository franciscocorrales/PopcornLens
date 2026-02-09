/**
 * Handler for Mega-Mkv.com
 * Extracts movie information from grid cards
 */
const MegaMkvHandler = {
    name: 'MegaMkv',
    
    /**
     * Checks if this handler supports the current URL
     * @param {string} url 
     * @returns {boolean}
     */
    canHandle: function(url) {
        return url.includes('mega-mkv.com');
    },

    /**
     * Extracts movies from the DOM
     * @returns {Array<{element: HTMLElement, title: string, year: string}>}
     */
    getMovies: function() {
        const movies = [];
        // Based on the snippet, .pelicula implies a movie card
        const cards = document.querySelectorAll('.pelicula');

        cards.forEach(card => {
            const anchor = card.querySelector('a');
            if (!anchor) return;

            // "Anaconda (2025) HD 1080p y 720p Latino Castellano"
            const titleRaw = anchor.title || ""; 

            if (!titleRaw) return;

            // Regex: Match title followed by (Year), ignoring the rest
            const match = titleRaw.match(/^(.*?)\s*\((\d{4})\)/);
            
            if (match) {
                movies.push({
                    element: card,
                    title: match[1].trim(),
                    year: match[2]
                });
            } else {
                // Warning: The title string on this site seems very messy with resolutions etc.
                // If regex doesn't match (YYYY), it might not be a movie or format differs.
                // We'll skip for now to avoid bad search queries.
            }
        });

        return movies;
    },

    /**
     * specific language for this site
     * @returns {string}
     */
    getLanguage: function() {
        return 'es-ES';
    }
};
