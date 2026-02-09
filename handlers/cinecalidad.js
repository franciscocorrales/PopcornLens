/**
 * Handler for Cinecalidad.rs
 * Extracts movie information from grid cards
 */
const CinecalidadHandler = {
    name: 'Cinecalidad',
    
    /**
     * Checks if this handler supports the current URL
     * @param {string} url 
     * @returns {boolean}
     */
    canHandle: function(url) {
        return url.includes('cinecalidad.rs');
    },

    /**
     * Extracts movies from the DOM
     * @returns {Array<{element: HTMLElement, title: string, year: string}>}
     */
    getMovies: function() {
        const movies = [];
        const cards = document.querySelectorAll('.home_post_cont.post_box');

        cards.forEach(card => {
            const titleElement = card.querySelector('.in_title');
            let titleRaw = "";

            // Strategy 1: Title div
            if (titleElement) {
                 titleRaw = titleElement.textContent.trim();
            } else {
                 // Strategy 2: Image attribute fallback
                 const img = card.querySelector('img');
                 if (img) titleRaw = img.title || img.alt || "";
            }

            if (!titleRaw) return;

            // Regex matches "Title (Year)" format commonly used on this site
            const match = titleRaw.match(/^(.*)\s*\((\d{4})\)$/);
            
            if (match) {
                movies.push({
                    element: card,
                    title: match[1].trim(),
                    year: match[2]
                });
            } else {
                // Fallback if regex fails (use full text as title)
                movies.push({
                    element: card,
                    title: titleRaw,
                    year: ""
                });
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
