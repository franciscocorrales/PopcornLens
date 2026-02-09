/**
 * Utility to parse and clean movie titles
 */
const MovieParser = {
    
    // Words to remove from the title to get a clean search query
    NOISE_PATTERNS: [
        /\b\d{3,4}p\b/gi,           // 720p, 1080p
        /\b4k\b/gi,                 // 4k
        /\b(Full)?\s*HD\b/gi,       // HD, Full HD
        /\bUHD\b/gi,                // UHD
        /\bBluRay\b/gi,             // BluRay
        /\bWEB-?DL\b/gi,            // WEB-DL
        /\bWEB-?Rip\b/gi,           // WEBRip
        /\bHDRip\b/gi,              // HDRip
        /\bHDR10\b/gi,              // HDR10
        /\bDVDRip\b/gi,             // DVDRip
        /\bH\.?26[45]\b/gi,         // H.264, H.265
        /\bx26[45]\b/gi,            // x264, x265
        /\bHEVC\b/gi,               // HEVC
        /\bLatino\b/gi,             // Latino
        /\bCastellano\b/gi,         // Castellano
        /\bDual\b/gi,               // Dual
        /\bSub(?:titulada)?\b/gi,   // Sub, Subtitulada
        /\bMulti\b/gi,              // Multi
        /\bExtended\b/gi,           // Extended
        /\bDirector'?s\s*Cut\b/gi,  // Director's Cut
    ],

    /**
     * Parses a raw text string into a clean title and year
     * @param {string} rawText 
     * @returns {{title: string, year: string|null}}
     */
    parse: function(rawText) {
        if (!rawText) return { title: "", year: null };

        let cleanText = rawText;
        let year = null;

        // 1. Extract Year
        // Supports: "Title (2024)", "Title [2024]", "Title 2024"
        // We look for a 4-digit year between 1900 and 2099
        const yearMatch = cleanText.match(/(?:^|\D)((?:19|20)\d{2})(?:\D|$)/);
        if (yearMatch) {
            year = yearMatch[1];
            // Identify where the year is to potentially cut off everything after it
            // (Often garbage comes after the year: "Title (2024) 1080p...")
            const yearIndex = cleanText.indexOf(year);
            if (yearIndex > -1) {
                 // But wait, sometimes years are part of the title like "2001: A Space Odyssey"
                 // If the year is very early in the string (char index < 5), it might be title.
                 // Safer approach: Use the regex to find year, but keep standard cleaning.
            }
        }

        // 2. Remove Year from string (optional, usually good to remove parenthesized year)
        cleanText = cleanText.replace(/\(\s*\d{4}\s*\)/g, ' ');
        cleanText = cleanText.replace(/\[\s*\d{4}\s*\]/g, ' ');

        // 3. Remove Noise
        this.NOISE_PATTERNS.forEach(pattern => {
            cleanText = cleanText.replace(pattern, ' ');
        });

        // 4. Cleanup Whitespace and Special Chars
        cleanText = cleanText.replace(/[._\-]/g, ' '); // Replace separators with space
        cleanText = cleanText.replace(/\s+/g, ' ').trim(); // Collapse spaces
        
        // 5. Special case: If we have "Title Year", and we extracted the year, maybe remove the trailing year number for the search query
        if (year && cleanText.endsWith(year)) {
            cleanText = cleanText.substring(0, cleanText.length - year.length).trim();
        }

        return {
            title: cleanText,
            year: year
        };
    }
};
