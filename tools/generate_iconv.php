#!/usr/bin/env php
<?php
/**
 * PHP script to generate representation of a code page as a small brick of text, so that the characters used in escpos-php can be viewed on the web.
 */

/**
 * From CodePage.php in escpos-php.
 */
class CodePage
{
    /**
     * The input encoding for generating character maps with iconv.
     */
    const INPUT_ENCODING = "UTF-8";
    
    /*
     *
     * Given an iconv encoding name, generate a 128-character UTF-8 string, containing code points 128-255.
     *
     * This string is used to map UTF-8 characters to their location in this code page.
     *
     * @param string $iconvName
     *            Name of the encoding
     * @return string 128-character string in UTF-8.
     */
    public static function generateEncodingMap($iconvName)
    {
        // Start with array of blanks (" " indicates unknown character).
        $charMap = array_fill(0, 128, " ");
        // Loop through 128 code points
        for ($char = 128; $char <= 255; $char ++) {
            // Try to identify the UTF-8 character that would go here
            $utf8 = @iconv($iconvName, self::INPUT_ENCODING, chr($char));
            if ($utf8 == '') {
                continue;
            }
            if (iconv(self::INPUT_ENCODING, $iconvName, $utf8) != chr($char)) {
                // Avoid non-canonical conversions (no known examples)
                continue;
            }
            // Replace the ' ' with the correct character if we found it
            $charMap[$char - 128] = $utf8;
        }
        // Join into a 128-character string and return.
        $charMapStr = implode("", $charMap);
        assert(mb_strlen($charMapStr, self::INPUT_ENCODING) == 128);
        return $charMapStr;
    }
}

$enc = $argv[1];
echo CodePage::generateEncodingMap($enc);

?>