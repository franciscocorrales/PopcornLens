/**
 * Handler for IMDb
 * Refactored from legacy Gandalf extension to fit PopcornLens architecture.
 * Adds year to title, calculates person age, and integrates with TMDB ratings.
 */
const ImdbHandler = {
    name: 'IMDb',
    MATCH_URL: 'imdb.com',

    titleSelectors: [
        '[data-testid="hero__primary-text"]',
        '[data-testid="hero-title-block__title"]',
        'h1[data-testid="hero__primary-text"]',
        '.titleBar-title h1',
        '.sc-afe43def-0'
    ],
    
    yearSelectors: [
        'a[href*="/releaseinfo/"]',
        '.sc-8c396aa2-2',
        '[data-testid="title-details-releasedate"] a',
        'ul[data-testid="hero-title-block__metadata"] li a[href*="releaseinfo"]',
        '.titleBar-year a'
    ],

    /**
     * Checks if this handler supports the current URL
     */
    canHandle: function(url) {
        return url.includes(this.MATCH_URL);
    },

    /**
     * Helper: Find element using multiple selectors
     */
    findElement: function(selectors) {
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        return null;
    },

    /**
     * Initialize handler-specific logic (DOM modifications)
     */
    init: function() {
        // Run immediately
        this._run();
        
        // Also setup a simple retry/observer because IMDb is dynamic
        // A simple interval for a few seconds is usually enough for the legacy logic
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            const success = this._run();
            if (success || attempts > 10) {
                clearInterval(interval);
            }
        }, 1000);
    },

    _run: function() {
        if (this.isMoviePage()) {
             return this.updateMovieTitle();
        } else if (this.isPersonPage()) {
             return this.updatePersonAge();
        }
        return false;
    },

    isMoviePage: function() {
        return window.location.pathname.includes('/title/');
    },

    isPersonPage: function() {
        return window.location.pathname.includes('/name/');
    },

    /**
     * PopcornLens Interface: Extract movies for Rating Injection
     * For IMDb, we want to inject the rating on the main title if possible.
     */
    getMovies: function() {
        if (!this.isMoviePage()) return [];

        const titleElement = this.findElement(this.titleSelectors);
        const yearElement = this.findElement(this.yearSelectors);
        
        if (!titleElement) return [];
        
        // Extract strictly existing text, cleaning up any injected stuff if we ran already
        // But getMovies usually runs once.
        let title = titleElement.textContent.trim();
        // Remove our own injection if present (e.g. "Title (2000)")
        title = title.replace(/\s\(\d{4}\)$/, '');

        // Extract year
        let year = '';
        if (yearElement) {
             const match = yearElement.textContent.match(/(\d{4})/);
             if (match) year = match[1];
        }

        return [{
            element: titleElement,
            title: title,
            year: year
        }];
    },

    // --- Legacy Features Migration ---

    calculateAge: function(birthDateString) {
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    },

    showNotification: function(message) {
        // Simple default notification since we don't have the Gandalf UIUtils
        const div = document.createElement('div');
        div.textContent = message;
        Object.assign(div.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#333',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: '10000',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            transition: 'opacity 0.5s'
        });
        document.body.appendChild(div);
        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 500);
        }, PopcornConfig.DEFAULTS.TOAST_DURATION || 2000);
    },

    updatePersonAge: function() {
        const nameElement = this.findElement(this.titleSelectors);
        if (!nameElement) return false;

        if (nameElement.textContent.includes('years)')) return true; // Already done

        // Check death
        const deathAgeElement = document.querySelector('[data-testid="birth-and-death-death-age"]');
        if (deathAgeElement) {
            const match = deathAgeElement.textContent.match(/(\d+)/);
            if (match) {
                nameElement.textContent = `${nameElement.textContent} (🪦 ${match[1]} years)`;
                return true;
            }
        }

        // Check birth
        const birthDateElement = document.querySelector('[data-testid="birth-and-death-birthdate"] span:nth-child(2)');
        if (!birthDateElement) return false;

        const birthDateText = birthDateElement.textContent.trim();
        if (!/\d{4}/.test(birthDateText)) return false;

        const age = this.calculateAge(birthDateText);
        if (isNaN(age)) return false;

        nameElement.textContent = `${nameElement.textContent} (${age} years)`;
        return true;
    },

    updateMovieTitle: function() {
        const titleElement = this.findElement(this.titleSelectors);
        if (!titleElement) return false;

        let originalTitle = titleElement.textContent.trim().replace(/:/g, '');
        
        // Skip if already has parens (often IMDb puts original title or year)
        // Note: Logic adapted from legacy.
        if (originalTitle.match(/\(\d{4}\)$/)) return true;

        const yearElement = this.findElement(this.yearSelectors);
        if (!yearElement) return false;

        const match = yearElement.textContent.match(/(\d{4})/);
        if (!match) return false;
        const year = match[1];

        const newTitle = `${originalTitle} (${year})`;
        titleElement.textContent = newTitle;
        
        // Add Copy Feature
        titleElement.style.cursor = 'pointer';
        titleElement.title = 'Click to copy title';
        titleElement.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(newTitle).then(() => {
                this.showNotification(`Copied: ${newTitle}`);
            });
        };

        return true;
    }
};
