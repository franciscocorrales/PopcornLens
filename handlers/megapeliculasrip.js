/**
 * Handler for MegaPeliculasRip.net
 * Extracts movie information from grid cards
 */
const MegaPeliculasRipHandler = {
    name: 'MegaPeliculasRip',
    MATCH_URL: 'megapeliculasrip.net',
    
    canHandle: function(url) {
        return url.includes(this.MATCH_URL);
    },

    getMovies: function() {
        const movies = [];
        const cards = document.querySelectorAll('.pelicula');

        cards.forEach(card => {
            const anchor = card.querySelector('h2 a');
            if (!anchor) return;

            const rawText = anchor.textContent || anchor.title || "";
            if (!rawText) return;

            // Use the centralized parser with aggressive bracket cleaning
            const { title, year } = MovieParser.parse(rawText, { removeBracketContents: true });
            
            // Prefer injecting into the poster container if available
            const poster = card.querySelector('.poster');

            if (title) {
                movies.push({
                    element: poster || card,
                    title: title,
                    year: year || ""
                });
            }
        });

        return movies;
    }
};
