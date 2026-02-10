/**
 * Handler for PelisHD4K
 * Extracts movie information from grid cards
 */
const PelisHD4KHandler = {
    name: 'PelisHD4K',
    MATCH_URL: 'pelishd4k.com',
    
    canHandle: function(url) {
        return url.includes(this.MATCH_URL);
    },

    getMovies: function() {
        const movies = [];
        const cards = document.querySelectorAll('article.TPost');

        cards.forEach(card => {
            const titleEl = card.querySelector('.Title');
            const yearEl = card.querySelector('.Qlty.Yr');
            
            let rawTitle = titleEl ? titleEl.textContent : "";
            
            // Fallback to image alt if title is missing
            if (!rawTitle) {
                const img = card.querySelector('img');
                if (img) rawTitle = img.alt || "";
            }

            if (!rawTitle) return;

            // Use the centralized parser
            const { title, year } = MovieParser.parse(rawTitle);
            
            // If parser didn't find year, try the explicit year element
            const finalYear = year || (yearEl ? yearEl.textContent.trim() : "");

            if (title) {
                movies.push({
                    element: card,
                    title: title,
                    year: finalYear
                });
            }
        });

        return movies;
    }
};
