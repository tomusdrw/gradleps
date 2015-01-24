#!/usr/bin/env node

var program = require('commander');
var colors = require('colors');
var prompt = require('prompt');

var maven = require('./maven');
var gradle = require('./gradle');


var common = {
    badRequest: function(reason) {
        var msg = 'Couldn\'t fetch results: ' + reason
        console.error(msg.red);
    },
    hasResults: function(data, p) {
        if (!data.count) {
            console.log('No results found for query: '.yellow + p);
            return false;
        }
        return true;
    }
};

var promptData = {
    properties: {
        choice: {
            description: '',
            pattern: /^([yn1234])$/i,
            required: true
        }
    }
};

program
    .version('0.0.3');

program
    .command('install <package>')
    .option('-f, --file [file]', 'Provide alternate build.gradle location. [build.gradle]', './build.gradle')
    .option('-t, --tests', 'Add dependency for tests compilation rather then source compilation', false)
    .description('Add dependency to build.gradle')
    .action(function(p, cmd) {
        maven.search(p, 5).then(function(data) {
            var printDoc = function(doc, o) {
                console.log((" [" + o + "] ").yellow, doc.id, doc.latestVersion.green);
            };
            if (common.hasResults(data, p)) {
                var toInstall = data.docs[0];
                console.log("Possible options:");
                printDoc(toInstall, 'y');
                data.docs.slice(1).forEach(function(doc, i) {
                    printDoc(doc, i + 1);
                });
                console.log(" ");
                console.log("Installing " + (toInstall.id.green + '@' + toInstall.latestVersion.green).bold);

                prompt.message = 'Is it okay?'.bold + ' [Y/n/1/2/3/4]';
                prompt.delimiter = ' ';
                prompt.start();
                prompt.get(promptData, function(err, result) {
                    var c = result.choice;
                    if (c === 'n' || c === 'N') {
                        console.warn('3.. 2... 1.. Oh god what have I just done! Just kidding, installation canceled.'.red);
                    } else if (c === 'y' || c === 'Y') {
                        gradle.install(toInstall, cmd.file, cmd.tests);
                    } else {
                        if (data.docs[c]) {
                            gradle.install(data.docs[c], cmd.file, cmd.tests);
                        } else {
                            console.error('Hey mate! Please make your mind!'.red);
                        }
                    }
                });
            }
        }, common.badRequest);
    });

program
    .command('search <package>')
    .option('-n, --limit [limit]', 'Change amount of returned matches [20]', 20)
    .description('Search Maven Central for specific <package>')
    .action(function(p, cmd) {
        maven.search(p, cmd.limit).then(function(data) {
            if (common.hasResults(data, p)) {
                var count = "" + data.count
                console.log('Found ' + count.cyan + ' results. Displaying first ' + cmd.limit + ':');
                data.docs.forEach(function(doc) {
                    console.log(" ", doc.id, doc.latestVersion.green);
                });
            }
        }, common.badRequest);
    });

var d = program.parse(process.argv);
if (d.args.length === 0) {
    program.outputHelp();
}
