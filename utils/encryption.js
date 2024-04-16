const bcrypt = require('bcrypt');

const saltRounds = 10;

function hash(plainText) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return reject(err);
            bcrypt.hash(plainText, salt, (err, hashText) => {
                if (err) return reject(err);
                resolve(hashText);
            });
        });
    });
}

async function hashCheck(plainText,hashText) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainText, hashText, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

module.exports = { hash, hashCheck };