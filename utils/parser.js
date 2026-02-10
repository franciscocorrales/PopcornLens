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
     * @param {Object} [options] - Optional settings
     * @param {boolean} [options.removeBracketContents] - If true, removes all content inside [...]
     * @returns {{title: string, year: string|null}}
     */
    parse: function(rawText, options = {}) {
        if (!rawText) return { title: "", year: null };

        let cleanText = rawText;
        let year = null;

        // OPTIONAL: Aggressive Cleanup for sites that use brackets for metadata
        if (options.removeBracketContents) {
            cleanText = cleanText.replace(/\[.*?\]/g, ' ');
        }

        // STRATEGY 1: Structured Year (YYYY) or [YYYY]
        // If found, we assume everything after is metadata/garbage (e.g. "Title (2024) 1080p foo bar")
        // We capture 19xx or 20xx only.
        const explicitYearMatch = cleanText.match(/[\(\[]\s*((?:19|20)\d{2})\s*[\)\]]/);
        
        if (explicitYearMatch) {
            year = explicitYearMatch[1];
            // Cut text before the year
            // Ensure we're not cutting an empty string if year is at start
            if (explicitYearMatch.index > 0) {
                cleanText = cleanText.substring(0, explicitYearMatch.index);
            } else {
                // Year is at start, just remove the match
                cleanText = cleanText.replace(explicitYearMatch[0], ' ');
            }
        } else {
            // STRATEGY 2: Loose Year (word boundary 2024)
            // We don't cut text here to avoid breaking titles like "2001: A Space Odyssey"
            // But we extract it for the query.
            const yearMatch = cleanText.match(/(?:^|\D)((?:19|20)\d{2})(?:\D|$)/);
            if (yearMatch) {
                year = yearMatch[1];
            }
        }

        // 3. Remove Noise
        this.NOISE_PATTERNS.forEach(pattern => {
            cleanText = cleanText.replace(pattern, ' ');
        });

        // 4. Cleanup Whitespace and Special Chars
        cleanText = cleanText.replace(/[._\-]/g, ' '); // Replace separators with space
        cleanText = cleanText.replace(/\s+/g, ' ').trim(); // Collapse spaces
        
        // 5. Special case: If we have "Title Year" (loose year), and we extracted it
        // Remove trailing year if it matches the extracted year
        if (year && cleanText.endsWith(year)) {
            // Only remove if it's separate word
            cleanText = cleanText.replace(new RegExp(`\\b${year}$`), '').trim();
        }
        
        // 6. Final Cleanups: Trailing "y" or "and" (common artifacts from "Title y Quality")
        // Removes " y" at the end of the string
        cleanText = cleanText.replace(/\s+y$/i, ''); 

        return {
            title: cleanText,
            year: year
        };
    }
};
