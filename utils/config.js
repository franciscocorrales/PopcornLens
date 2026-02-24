const PopcornConfig = {
    // Default Values
    DEFAULTS: {
        FONT_SIZE: '12',
        CACHE_ENABLED: true,
        RATING_EFFECTS: true,
        API_KEY: '',
        LANGUAGE: '',
        TOAST_DURATION: 2000
    },
    
    // Storage Keys
    STORAGE: {
        API_KEY: 'apiKey',
        LANGUAGE: 'language',
        CACHE_ENABLED: 'cacheEnabled',
        RATING_EFFECTS: 'ratingEffects',
        FONT_SIZE: 'fontSize',
       // CACHE_PREFIX: 'popcorn_cache_' // Moving this to CACHE object for clarity
    },

    // Cache Settings
    CACHE: {
        TTL: 7 * 24 * 60 * 60 * 1000, // 1 Week in ms
        PREFIX: 'popcorn_cache_'
    },

    // API Configuration
    API: {
        BASE_URL: 'https://api.themoviedb.org/3',
        WEBSITE_URL: 'https://www.themoviedb.org',
    },

    // Sites where rating injection should be skipped
    RATING_EXCLUSIONS: [
        'imdb.com',
        'themoviedb.org'
    ],

    // UI Constants
    UI: {
        BADGE_CLASS: 'popcorn-lens-badge',
        RELATIVE_CLASS: 'popcorn-lens-relative',
    }
};
