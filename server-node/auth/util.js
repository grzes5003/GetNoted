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

// works only if 'a' is number and 'b' is Categories array
function findNumberNewCategory(a, b) {
    if(b.length === 0) {
        return 0
    }
    const max = b.reduce((prev, current) => (prev.number > current.number) ? prev : current);
    const maxOfCat = max.number + 1;
    //console.log('VALUES: ', a, maxOfCat);
    if(a === maxOfCat) {
        return a + 1;
    }
    //console.log('new cat number: ', a > maxOfCat ? a : maxOfCat);
    return a > maxOfCat ? a : maxOfCat
}


// works only if 'a' is number and 'b' is also a number
function findNumberNewTask(a, b) {
    if(a === b) {
        return a + 1;
    }
    return a > b ? a : b
}

module.exports = {
    generateAccessToken,
    verifyAccessToken,
    getUser,
    findNumberNewCategory,
    findNumberNewTask
};
