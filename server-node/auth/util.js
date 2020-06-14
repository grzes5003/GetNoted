const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

function generateAccessToken(username) {
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

function verifyAccessToken(token) {
    return jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        console.log(decoded);
        return decoded
    })
}

function getUser(token) {
    return jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        console.log('decoded ',decoded);
        return decoded.username
    })
}

module.exports = {
    generateAccessToken,
    verifyAccessToken,
    getUser
};
