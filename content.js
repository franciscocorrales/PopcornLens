/**
 * PopcornLens - Main Content Script
 * 
 * Orchestrates the loading of handlers and execution of movie searches.
 */

const Handlers = [
    CinecalidadHandler,
    MegaMkvHandler
];

/**
 * Initializes the extension logic
 * Finds a suitable handler for the current URL and processes movie entities.
 */
async function initPopcornLens() {
    const currentUrl = window.location.href;
    const handler = Handlers.find(h => h.canHandle(currentUrl));

    if (!handler) {
        console.log("PopcornLens: No handler matched for this URL");
        return;
    }

    console.log(`PopcornLens: Activated ${handler.name} Handler`);
    
    // 1. Extract movies from page
    const movies = handler.getMovies();
    if (movies.length === 0) {
        console.log("PopcornLens: No movies found on page");
        return;
    }

    console.log(`PopcornLens: Found ${movies.length} movies. Fetching metadata...`);

    // 2. Process each movie
    // If handler doesn't specify language, pass undefined so TMDB utils can decide default
    const lang = handler.getLanguage ? handler.getLanguage() : undefined;

    for (const movie of movies) {
        if (!movie.title) continue;

        // Perform API Search
        const searchResult = await TMDB_API.search(movie.title, movie.year, lang);
        
        if (searchResult && searchResult.results && searchResult.results.length > 0) {
            const match = searchResult.results[0];
            console.log(`PopcornLens MATCH: "${movie.title}" -> "${match.title}" | Rating: ${match.vote_average}`);
            
            injectRating(movie.element, match);
        } else {
            console.log(`PopcornLens MISS: "${movie.title}"`);
        }
    }
}

/**
 * Injects the rating badge into the movie element
 * @param {HTMLElement} element - The movie card element
 * @param {Object} movieData - The TMDB movie data
 */
function injectRating(element, movieData) {
    if (!element || !movieData) return;

    // Avoid duplicates
    if (element.querySelector('.popcorn-lens-badge')) return;

    // Ensure parent has positioning context
    const style = window.getComputedStyle(element);
    if (style.position === 'static') {
        element.classList.add('popcorn-lens-relative');
    }

    const badge = document.createElement('div');
    badge.className = 'popcorn-lens-badge';
    
    // Format: 🍿 7.5
    const rating = movieData.vote_average ? movieData.vote_average.toFixed(1) : 'NR';
    badge.innerHTML = `<span>🍿</span> ${rating}`;
    badge.title = `${movieData.title} (${movieData.release_date?.split('-')[0] || 'Unknown'})\n${movieData.overview || ''}`;

    // Append to card
    element.appendChild(badge);
}

// Ensure the DOM is fully loaded before running
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPopcornLens);
} else {
    initPopcornLens();
}
