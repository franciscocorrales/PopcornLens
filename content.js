/**
 * PopcornLens - Main Content Script
 * 
 * Orchestrates the loading of handlers and execution of movie searches.
 */

const Handlers = [
    CinecalidadHandler,
    MegaMkvHandler,
    ImdbHandler,
    PelisHD4KHandler,
    MegaPeliculasRipHandler
];

/**
 * Initializes the extension logic
 * Finds a suitable handler for the current URL and processes movie entities.
 */
async function initPopcornLens() {
    // Get user configuration
    const config = await new Promise(resolve => {
        const query = {};
        query[PopcornConfig.STORAGE.FONT_SIZE] = PopcornConfig.DEFAULTS.FONT_SIZE;
        chrome.storage.sync.get(query, resolve);
    });

    const currentUrl = window.location.href;
    const handler = Handlers.find(h => h.canHandle(currentUrl));

    if (!handler) {
        console.log("PopcornLens: No handler matched for this URL");
        return;
    }

    console.log(`PopcornLens: Activated ${handler.name} Handler`);
    
    // Optional: Handler specific initialization (e.g., dom modification)
    if (typeof handler.init === 'function') {
        handler.init();
    }

    // Check for exclusions
    if (PopcornConfig.RATING_EXCLUSIONS.some(domain => currentUrl.includes(domain))) {
        console.log("PopcornLens: Rating injection excluded for this site.");
        return;
    }

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
            
            injectRating(movie.element, match, config[PopcornConfig.STORAGE.FONT_SIZE]);
        } else {
            console.log(`PopcornLens MISS: "${movie.title}"`);
        }
    }
}

/**
 * Injects the rating badge into the movie element
 * @param {HTMLElement} element - The movie card element
 * @param {Object} movieData - The TMDB movie data
 * @param {string} fontSize - The font size in pixels
 */
function injectRating(element, movieData, fontSize = PopcornConfig.DEFAULTS.FONT_SIZE) {
    if (!element || !movieData) return;

    // Avoid duplicates
    if (element.querySelector(`.${PopcornConfig.UI.BADGE_CLASS}`)) return;

    // Ensure parent has positioning context
    const style = window.getComputedStyle(element);
    if (style.position === 'static') {
        element.classList.add(PopcornConfig.UI.RELATIVE_CLASS);
    }

    const badge = document.createElement('a');
    badge.className = PopcornConfig.UI.BADGE_CLASS;
    badge.target = '_blank';
    badge.href = `${PopcornConfig.API.WEBSITE_URL}/movie/${movieData.id}`;
    
    // Apply User Font Size
    badge.style.fontSize = `${fontSize}px`;

    // Stop propagation to prevent clicking the movie card behind the badge
    badge.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Format: 🍿 7.5
    const rating = movieData.vote_average ? movieData.vote_average.toFixed(1) : 'NR';
    badge.innerHTML = `<span>🍿</span> ${rating}`;
    badge.title = `${movieData.title} (${movieData.release_date?.split('-')[0] || 'Unknown'})\n${movieData.overview || ''}\n\nClick to view on TMDB`;

    // Append to card
    element.appendChild(badge);
}

// Ensure the DOM is fully loaded before running
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPopcornLens);
} else {
    initPopcornLens();
}
