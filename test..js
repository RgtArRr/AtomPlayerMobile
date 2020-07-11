const crypto = require('crypto');

let token = crypto.createHmac('SHA1', 'iGV7PetSJdgREnuXUSvhR59RHSzFv0C1').update('WUKaudOpx|1593392242').digest();

console.log(token.toString('base64'));

console.log(Math.round(new Date().getTime() / 1000));
const CryptoJS = require('crypto-js');
let currentTime = Math.round(new Date().getTime() / 1000);
const raw_signature = CryptoJS.HmacSHA1('WUKaudOpx|' + currentTime, 'iGV7PetSJdgREnuXUSvhR59RHSzFv0C1');
const signature = raw_signature.toString(CryptoJS.enc.Hex);
console.log("apikey=iGV7PetSJdgREnuXUSvhR59RHSzFv0C1&t="+currentTime+"&h="+signature);
