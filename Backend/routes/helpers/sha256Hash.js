const crypto = require("crypto")

/**
 * Return SHA-2 256-bit digest of a given object.
 * @param {String} params String (or instance of Buffer/TypedArray/DataView) to be hashed
 */
function sha256(params) {
    return crypto.createHash("sha256").update(params).digest("hex")
}

module.exports = sha256
