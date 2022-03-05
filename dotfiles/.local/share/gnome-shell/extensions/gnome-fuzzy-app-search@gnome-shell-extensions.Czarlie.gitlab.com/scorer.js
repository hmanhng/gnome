/**
 * A key that all objects that are indexable with an {@linkcode Index} have,
 * as well as a tokenizer and a weight
 *
 * @typedef {Object} KeyWeight
 * @property {string} [key] - The key itself. May be something like "name" or "id".
 *                            Either key or keys has to be specified, not both
 * @property {string} [keys] - An Array of keys to consider, like "name" and "nameEN".
 *                             Either key or keys has to be specified, not both
 * @property {number} weight - The weight that each token of the key's content will have.
 *                             For instance, the key "name" might have weight 8,
 *                             "keywords" weight 3 and "description" weight 1
 * @property {tokenizer} tokenizer - A function that returns an array of all tokens that
 *                                   a value of this key contains. See {@linkcode tokenizer}
 */

/**
 * Tokenize the keys of an object and assing each token a score.
 *
 * Technically, you could use this to *not* tokenize anything and
 * return other things mapped to scores, but I don't see the use in that.
 *
 * If you have consistent object keys and a tokenizer function for each of them,
 * you can use {@linkcode getTokenizedScorer} to easily get a scorer.
 *
 * @callback scorer
 * @param {Object} value - the object whose keys' tokens to score.
 * @return {Object.<string, number>} An object containing all tokens found in the
 *                                   passed object, each mapped to a score that
 *                                   indicates how prominent that token is in the object
 */

/**
 * Get a scoring function based on the passed weights for each key to be scored.
 *
 * @param {KeyWeight[]} keyWeights - An array of keys, their content type
 *                                   and weights. See {@linkcode KeyWeight}
 * @return {scorer} A scoring function that returns tokens mapped to scores
 */
var getTokenizedScorer = (keyWeights) => {
    return (indexEntry) => {
        const tokenScores = {};

        keyWeights.forEach((keyWeight) => {
            let allTokens = [];

            if (keyWeight && "key" in keyWeight) {
                allTokens = keyWeight.tokenizer(indexEntry[keyWeight.key]);
            } else {
                keyWeight.keys.forEach((key) => {
                    allTokens = [...allTokens, ...keyWeight.tokenizer(indexEntry[key])];
                });
            }

            const tokens = Array.from(new Set(allTokens));

            tokens.forEach((token) => {
                tokenScores[token] = Math.max(
                    tokenScores[token] != null &&
                        tokenScores[token] != undefined
                        ? tokenScores[token]
                        : 0,
                    keyWeight.weight * token.length
                );
            });
        });

        return tokenScores;
    };
};
