/**
 * Handler for Cinecalidad.am
 * Extracts movie information from grid cards
 */
const CinecalidadAmHandler = {
    name: 'CinecalidadAM',
    MATCH_URL: 'cinecalidad.am',

    /**
     * Checks if this handler supports the current URL
     * @param {string} url
     * @returns {boolean}
     */
    canHandle: function(url) {
        return url.includes(this.MATCH_URL);
    },

    init: function() {
        document.body.classList.add('popcorn-cinecalidad-am');
    },

    /**
     * Extracts movies from the DOM
     * @returns {Array<{element: HTMLElement, title: string, year: string}>}
     */
    getMovies: function() {
        const movies = [];
        const cards = document.querySelectorAll('article.item.movies');

        cards.forEach(card => {
            const titleElement = card.querySelector('.in_title');
            let rawTitle = titleElement ? titleElement.textContent.trim() : '';

            if (!rawTitle) {
                const img = card.querySelector('img');
                rawTitle = img ? (img.alt || img.title || '') : '';
            }

            if (!rawTitle) return;

            // Year is in the 2nd <p> inside .home_post_content
            let year = '';
            const paragraphs = card.querySelectorAll('.home_post_content p');
            for (const p of paragraphs) {
                const text = p.textContent.trim();
                if (/^\d{4}$/.test(text)) {
                    year = text;
                    break;
                }
            }

            movies.push({
                element: card,
                title: rawTitle,
                year: year
            });
        });

        return movies;
    },
};
