# PopcornLens 🍿

PopcornLens is a Chrome Extension that automatically injects movie ratings and metadata into your favorite streaming or download websites. It uses The Movie Database (TMDB) API to match movies found on the page and displays their ratings instantly.

## 🚀 Features

- **Automatic Recognition**: Scans the page for movie titles and release years.
- **Dynamic Ratings**: Fetches real-time ratings from TMDB.
- **Multi-Language Support**: optimized for recognizing titles in Spanish (es-ES) and English.
- **Modular Design**: Easily extensible handler system to add support for new websites.

## 📋 Supported Websites

Currently, PopcornLens supports the following sites:

- **Cinecalidad** (`cinecalidad.rs`)
- **Mega-Mkv** (`mega-mkv.com`)

*More sites can be added easily by creating new handlers.*

## 🛠️ Installation

1. Clone or download this repository.
2. Open Chrome/Brave/Edge and go to `chrome://extensions`.
3. Enable **Developer Mode** in the top right corner.
4. Click **Load unpacked** and select the `PopcornLens` folder.
5. Setup your TMDB API Key in `utils/tmdb.js`.
   *(Note: The project currently comes with a placeholder key for testing).*

## 🏗️ Development

### Project Structure

```text
PopcornLens/
├── manifest.json        # Extension configuration
├── content.js           # Main logic orchestrator
├── utils/
│   └── tmdb.js          # TMDB API interaction
├── handlers/            # Site-specific logic
│   ├── cinecalidad.js
│   └── megamkv.js
├── icons/               # Extension icons
└── styles.css           # UI Styling
```

### Adding a New Website

To add support for a new website, create a new file in `handlers/`:

```javascript
const NewSiteHandler = {
    name: 'NewSite',
    canHandle: (url) => url.includes('newsite.com'),
    getMovies: () => {
        // Return array of { element: HTMLElement, title: string, year: string }
    },
    getLanguage: () => 'es-ES'
};
```

Then register it in `content.js` and `manifest.json`.

## ⚠️ Disclaimer

This project is for educational purposes. It scrapes information from third-party websites and uses the TMDB API. Please respect the terms of service of all visited websites and APIs.
