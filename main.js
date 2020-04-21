var fs = require('fs');
var path = require('path');
var wildCardRegexGen = require('./wildcard/regExGenerator');

var argsArr = process.argv;
var filePattern;
var targetDirPathArr;
var masterFilePaths = [];

if(argsArr && argsArr[2]) {
    findFiles(argsArr[1],argsArr[2]);
}

function startTraversal(callerPath, givenDirPath) {
    var pathIdx = 0;
    var signals;
    var constructedPath = callerPath || __dirname;

    while (pathIdx < givenDirPath.length) {
        var pathItem = givenDirPath[pathIdx];
        if (pathItem) {
            signals = determineTypeOfPathItemAndTraverse(constructedPath, pathItem);

            if (signals.break) {
                break;
            }
            if (signals.newPath) {
                constructedPath = signals.newPath
            }
        }
        pathIdx++;
    }
}

function determineTypeOfPathItemAndTraverse(constructedPath, pathItem) {

    if (isTreeTraversal(pathItem)) {
        traverseDeepTree(constructedPath);
        return {
            break: true
        }
    } else if (isPattern(pathItem)) {
        triggerForAllUnderPrevDir(constructedPath, pathItem);

        return {
            break: true
        }
    } else {
        //this is directory
        var newPath = traverseLinear(constructedPath, pathItem);
        return {
            newPath: newPath
        };
    }
}

function isTreeTraversal(pathItem) {
    return (pathItem === "**") ? true : false
}

// pattern could be file or directory
// has to be differentiated later with isDirectory() or isFile()
function isPattern(pathItem) {
    return (pathItem.indexOf('*') > -1 || pathItem.indexOf('?') > -1) ? true : false;
}

function isFilePattern(pathItem) {
    return (new RegExp('/\.[a-z]{2,3}/').test(pathItem)) ? true : false;
}

function traverseDeepTree(dirPath) {
    if (fs.lstatSync(dirPath).isDirectory()) {
        var content = fs.readdirSync(dirPath)
        if (content.length > 0) {
            for (var contentIdx = 0; contentIdx < content.length; contentIdx++) {
                //this works
                traverseDeepTree(path.resolve(dirPath, content[contentIdx]));
            }
        }
    } else if (fs.lstatSync(dirPath).isFile()) {
        if (filePattern) {
            if (filePattern.test(dirPath)) {
                masterFilePaths.push(dirPath);
            }
        }
    }
}

function triggerForAllUnderPrevDir(constructedPath, pathItem) {

    var folderContent = fs.readdirSync(constructedPath);
    var pathItemRegex = wildCardRegexGen.convertWildCardToRegex(pathItem);

    for(var i=0; i<folderContent.length; i++) {
        var curItem = folderContent[i];
        var curPath = path.resolve(constructedPath, curItem);

        if(pathItemRegex.test(curPath)) {
            //if it is a file,
            if(fs.lstatSync(curPath).isFile()){
                //just append it with the constructed path and push them in the master file paths
                var filePath = curPath;
                masterFilePaths.push(filePath);
            } else if (fs.lstatSync(curPath).isDirectory()) {
                //if it not a file
                //concat the currentItem to the path
                determineTypeOfPathItemAndTraverse(path.resolve(curPath, '..'), curItem);
            }
        }
    }

    return {
        break: true
    }
}

function traverseLinear(constructedPath, pathItem) {
    var newPath = path.resolve(constructedPath, pathItem);

    if (targetDirPathArr.lastIndexOf(pathItem) === targetDirPathArr.length - 1) {
        masterFilePaths.push(newPath);
    }

    return newPath;
}

function findFiles(providedPath, rootPath) {
    var callerPath = (rootPath) || process.mainModule.filename;

    if (!fs.lstatSync(callerPath).isDirectory()){
        callerPath = path.resolve(callerPath, '../');
    }

    //split the path with '/'
    targetDirPathArr = providedPath.split('/');
    var lastItem = targetDirPathArr[targetDirPathArr.length - 1];

    if ((lastItem.indexOf('*') > -1 || lastItem.indexOf('?') > -1)) {
        filePattern = wildCardRegexGen.convertWildCardToRegex(lastItem);
    }

    startTraversal(callerPath, targetDirPathArr);

    return masterFilePaths;
}

module.exports = {
    findFiles: findFiles
}