/**
 * Split a value (ideally of specific type) into all tokens that may be relevant to a search.
 *
 * If this function is passed to a {@linkcode getScorer} in a {@linkcode KeyWeight},
 * this is passed values that the objects passed to the scorer contain under the specified key.
 *
 * If this function is passed to an {@linkcode Index} object,
 * it will be called on a list of terms, split at whitespace, of a query.
 *
 * @callback tokenizer
 * @param {Object} value - the value to tokenize, as described above
 * @return {string[]} An array of all relevant tokens that value contains
 */

const NONWORD_RE = /\W/g;

var getStringNgramTokenizer = (maxNGramLength = 5) => {
    return (str) => {
        const nGrams = [];

        if (typeof str === "string")
            for (var nGramLength = 1; nGramLength <= maxNGramLength; nGramLength++) {
                str.toLowerCase()
                    .split(NONWORD_RE)
                    .filter((word) => !NONWORD_RE.test(word))
                    .map((word) => getNGrams(word, nGramLength))
                    .reduce((a, b) => new Set([...a, ...b]), new Set())
                    .forEach((nGram) => nGrams.push(nGram));
            }

        return Array.from(nGrams);
    };
};

/**
 * Get a tokenizer function that takes an array of strings and
 *
 * @param  {number} [maxNGramLength=5] - The maximum length of the n-grams,
 *                                       e.g. 2 for ["hi", "hit"] -> ["h", "i", "t", "hi", "it"]
 * @return {tokenizer} A tokenizer that splits keywords (string array) into
 *                       n-grams of up to a certain length
 */
var getKeywordArrayNgramTokenizer = (maxNGramLength = 5) => {
    return (keywords) => {
        const nGrams = [];

        if (keywords && typeof keywords === "object" && "map" in keywords && "reduce" in keywords)
            for (var nGramLength = 1; nGramLength <= maxNGramLength; nGramLength++) {
                keywords
                    .map((kw) => kw.replace(NONWORD_RE, "").toLowerCase())
                    .map((word) => getNGrams(word, nGramLength))
                    .reduce((a, b) => new Set([...a, ...b]), new Set())
                    .forEach((nGram) => nGrams.push(nGram));
            }

        return Array.from(nGrams);
    };
};

/**
 * Get an array of all substrings of str that are n long, i.e. n-grams
 *
 * @param  {String} str - The string to split into n-grams
 * @param  {Number} n - The length of the substrings, e.g. 2 for ["he", "el", "lo"]
 * @return {Array} An array of all substrings of str of length n
 */
const getNGrams = (str, n) => {
    if (str.length < n) {
        return [];
    }

    const nGrams = [];

    for (let index = str.length - n; index >= 0; index--) {
        nGrams.unshift(str.slice(index, index + n));
    }

    return nGrams;
};
