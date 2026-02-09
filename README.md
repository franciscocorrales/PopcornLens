# PopcornLens 🍿

PopcornLens is a Chrome Extension that automatically injects movie ratings and metadata into your favorite streaming or download websites. It uses The Movie Database (TMDB) API to match movies found on the page and displays their ratings instantly.

## 🚀 Features

- **Automatic Recognition**: Scans the page for movie titles and release years using advanced text parsing to remove noise (e.g., "1080p", "WebRip").
- **Visual Badges**: Injects a clean, non-intrusive rating badge directly onto movie cards.
- **Smart Caching**: Caches API results for 1 week to minimize API usage and speed up loading.
- **Configurable**: Settings page to manage your API Key, preferred language, and cache controls.
- **Modular Design**: Easily extensible handler system to add support for new websites.

## 📋 Supported Websites

Currently, PopcornLens supports the following sites:

- [**Cinecalidad**](https://www.cinecalidad.rs) (`cinecalidad.rs`)
- [**Mega-Mkv**](https://mega-mkv.com) (`mega-mkv.com`)

*More sites can be added easily by creating new handlers.*

## 🛠️ Installation

1. Clone or download this repository.
2. Open Chrome/Brave/Edge and go to `chrome://extensions`.
3. Enable **Developer Mode** in the top right corner.
4. Click **Load unpacked** and select the `PopcornLens` folder.
5. **Configuration**:
   - Right-click the extension icon and select **Options**.
   - Enter your [TMDB API Key](https://www.themoviedb.org/documentation/api).
   - Select your preferred language (or leave as Auto).

## 🏗️ Development

### Project Structure

```text
PopcornLens/
├── manifest.json        # Extension configuration
├── content.js           # Main logic orchestrator
├── options.html         # Settings UI
├── styles.css           # UI Styling
├── utils/
│   ├── tmdb.js          # TMDB API interaction
│   ├── cache.js         # Local storage caching logic
│   └── parser.js        # Title cleaning and parsing
├── handlers/            # Site-specific logic
│   ├── cinecalidad.js
│   └── megamkv.js
└── icons/               # Extension icons
```

### Adding a New Website

To add support for a new website, create a new file in `handlers/`:

```javascript
const NewSiteHandler = {
    name: 'NewSite',
    MATCH_URL: 'newsite.com',
    
    canHandle: (url) => url.includes(NewSiteHandler.MATCH_URL),
    
    getMovies: () => {
        // Use MovieParser to clean titles
        // Return array of { element: HTMLElement, title: string, year: string }
    }
};
```

Then register it in `content.js` and `manifest.json`.

## ⚠️ Disclaimer

This project is for educational purposes. It scrapes information from third-party websites and uses the TMDB API. Please respect the terms of service of all visited websites and APIs.
