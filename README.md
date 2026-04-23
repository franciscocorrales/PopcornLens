# PopcornLens 🍿

[Download on Chrome Web Store](https://chromewebstore.google.com/detail/popcornlens/oeenkmomcpjkpbnfoabeihlheaiffepf?hl=en&authuser=0)

PopcornLens is a powerful Chrome Extension that enhances your movie browsing experience by automatically injecting ratings, metadata, and useful information into various movie streaming and database websites. Powered by The Movie Database (TMDB) API.


## 🚀 Features

- **Universal Rating Injection**: Scans pages for movie cards and instantly displays the TMDB rating badge (🍿 8.5).
- **Smart Parsing**: Advanced cleaning algorithms handle messy titles (e.g., "Matrix 2021 4k 1080p HDRip") to ensure accurate matches.
- **IMDb Enhancements**: on IMDb, it appends the Release Year to titles for easier copying and calculates Actor Ages on profile pages (including deceased status).
- **Customizable UI**: Adjust badge font sizes directly from the settings to fit your screen.
- **Performance First**: Built-in 7-day caching system minimizes API calls and ensures instant loading on revisited pages.
- **Modular Architecture**: Clean, handler-based design makes it incredibly easy to add support for new sites.

## 📋 Supported Websites

PopcornLens currently supports the following platforms:

- [**IMDb**](https://imdb.com) (`imdb.com`) - *Age calculation & Year appending*
- [**Cinecalidad**](https://www.cinecalidad.rs) (`cinecalidad.rs`)
- [**Cinecalidad AM**](https://www.cinecalidad.am) (`cinecalidad.am`)
- [**Mega-Mkv**](https://mega-mkv.com) (`mega-mkv.com`)
- [**PelisHD4K**](https://pelishd4k.com/) (`pelishd4k.com`)
- [**MegaPeliculasRip**](https://www.megapeliculasrip.net/) (`megapeliculasrip.net`)

## 🛠️ Installation

1. **Get the Code**: Clone or download this repository.
2. **Load in Browser**:
   - Open Chrome (or Brave/Edge) and go to `chrome://extensions`.
   - Enable **Developer Mode** (top right toggle).
   - Click **Load unpacked** and select the `PopcornLens` folder.
3. **Configure**:
   - Click the extension icon (or right-click > Options).
   - Enter your [TMDB API Key](https://www.themoviedb.org/documentation/api) (Required).
   - Adjust the badge font size or preferred language.

## 🤝 Contributing / Requesting Sites

**Want PopcornLens on your favorite site?**

We love adding support for new websites! The best way to get a site added is to **submit a Pull Request**. 

If you are not a developer, please open an Issue with the **URL** of the website you want supported.

### How to Add a New Site (For Developers)

1.  Create a new file in `handlers/` (e.g., `mysite.js`).
2.  Implement the handler interface:
    ```javascript
    const MySiteHandler = {
        name: 'MySite',
        MATCH_URL: 'mysite.com',
        
        canHandle: function(url) {
            return url.includes(this.MATCH_URL);
        },
    
        getMovies: function() {
            // Select your movie elements
            // Use MovieParser.parse(rawText) to clean titles
            // Return array: [{ element, title, year }]
        }
    };
    ```
3.  Register the handler in `content.js` (`Handlers` array) and `manifest.json` (`content_scripts` "js" section).

## 🏗️ Project Structure

```text
PopcornLens/
├── manifest.json        # Extension config (Manifest V3)
├── content.js           # Main logic & Handler registry
├── ui/                  # User Interface
│   ├── options.html/css/js # Settings Page
│   └── popup.html/css/js   # Extension Popup
├── handlers/            # Site-Specific Logics
│   ├── imdb.js
│   ├── cinecalidad.js
│   ├── cinecalidad_am.js
│   ├── pelishd4k.js
│   └── ...
└── utils/
    ├── config.js        # Centralized constants
    ├── tmdb.js          # API Client
    ├── cache.js         # LocalStorage w/ TTL
    └── parser.js        # Title cleaner (Regex magic)
```

## 📦 Packaging

1. Create the zip (run from the project root):

   ```bash
   zip -r PopcornLens.zip . -x "*.git*"
   ```

2. Go to the [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole/).
3. Select the extension, click **Package** → **Upload new package**, and upload the zip.
4. Click **Submit for review**.

## ⚠️ Disclaimer

This project is for educational purposes. It scrapes publicly available information from third-party websites and uses the TMDB API to enhance the user experience. Please respect the terms of service of all visited websites and APIs.
