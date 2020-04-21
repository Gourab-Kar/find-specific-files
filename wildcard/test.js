var regExGenerator = require('./regExGenerator');
/*
* Examples
*
* *.js
* ([a-zA-Z0-9])*.js
*
*
* */

var astrxCard = regExGenerator.convertWildCardToRegex('*Specs.js');
var questionCard = regExGenerator.convertWildCardToRegex('?Specs.js');

var isSuccess = astrxCard.test('D:\\Work\\projects\\stock_data_collector\\tests\\mocha\\units\\dao\\dbConflictResolverSpecs.js');
console.log(isSuccess); // true

isSuccess = astrxCard.test('D:\\Work\\projects\\stock_data_collector\\tests\\mocha\\units\\dao\\Specs.js');
console.log(isSuccess); // true

isSuccess = questionCard.test('D:\\Work\\projects\\stock_data_collector\\tests\\mocha\\units\\dao\\dbConflictResolverSpecs.js');
console.log(isSuccess); // false

isSuccess = questionCard.test('D:\\Work\\projects\\stock_data_collector\\tests\\mocha\\units\\dao\\Specs.js');
console.log(isSuccess); // false