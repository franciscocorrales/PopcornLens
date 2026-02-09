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

            const rawText = anchor.title || ""; 

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
