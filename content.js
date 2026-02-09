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
                console.log(`PopcornLens MATCH: "${movie.title}" -> "${match.title}" | Rating: ${match.vote_average}/10`);
                
                // TODO: Delegate UI injection to a separate module or handler method in the future
                // injectRating(movie.element, match);
        } else {
                console.log(`PopcornLens MISS: "${movie.title}"`);
        }
    }
}

// Ensure the DOM is fully loaded before running
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPopcornLens);
} else {
    initPopcornLens();
}
