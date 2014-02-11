var colors = require('colors');
var fs = require('fs');

exports.install = function(doc, gradleFile, isForTests) {
    fs.readFile(gradleFile, 'utf8', function(err, file) {
        if (err) {
            console.error('Cannot read ' + gradleFile.red + '!');
            return;
        }

        var entry = doc.id + ':' + doc.latestVersion;
        var prefix = isForTests ? 'testCompile' : 'compile';
        // find proper place
        var regex = /^(dependencies\s*{([\s\S]|.)*?)}/m;
        if (!regex.test(file)) {
            console.error(("Couldn't locate 'dependencies' section in " + gradleFile).red);
            return;
        }
        fs.writeFile(gradleFile, file.replace(regex, "$1    " + prefix + " '" + entry + "'\n}"), 'utf8', function(err) {
            if (err) {
                console.error(("Couldn't write to file " + gradleFile + ".").red);
                return;
            }
            console.log("All done!".cyan);
        });

    });

};