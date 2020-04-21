module.exports = {
    convertWildCardToRegex: function (wildcardStr) {
        var updateStr = wildcardStr;
        var asterixRegEx = getRegExForSymbol('*');
        var questionRegEx = getRegExForSymbol('?');

        updateStr = updateStr.replace(/\*/g, asterixRegEx);
        updateStr = updateStr.replace(/\?/g, questionRegEx);

        return new RegExp(updateStr);
    }
}

function getRegExForSymbol(symbol) {
    var requiredRegEx = '';

    switch (symbol) {
        case '*':
        case '**': {
            requiredRegEx = '(([a-zA-Z0-9])*)';
            break;
        }
        case '?': {
            requiredRegEx = '([a-zA-Z0-9]{1})';
            break;
        }
    }

    return requiredRegEx;
}
