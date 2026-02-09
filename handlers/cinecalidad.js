/**
 * Handler for Cinecalidad.rs
 * Extracts movie information from grid cards
 */
const CinecalidadHandler = {
    name: 'Cinecalidad',
    MATCH_URL: 'cinecalidad.rs',
    
    /**
     * Checks if this handler supports the current URL
     * @param {string} url 
     * @returns {boolean}
     */
    canHandle: function(url) {
        return url.includes(this.MATCH_URL);
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
            let rawText = "";

            // Strategy 1: Title div
            if (titleElement) {
                 rawText = titleElement.textContent;
            } else {
                 // Strategy 2: Image attribute fallback
                 const img = card.querySelector('img');
                 if (img) rawText = img.title || img.alt || "";
            }

            if (!rawText) return;

            // Use the centralized parser
            const { title, year } = MovieParser.parse(rawText);
            
            if (title) {
                movies.push({
                    element: card,
                    title: title,
                    year: year || ""
                });
            }
        });

        return movies;
    },
};
