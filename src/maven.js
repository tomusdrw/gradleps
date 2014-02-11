var rest = require('restler');
var Q = require('q');

var timeout = 10000;
var mavenUrl = function(term, limit) {
    return 'http://search.maven.org/solrsearch/select?wt=json&rows=' + limit + '&q=' + encodeURIComponent(term.replace(/:/g, '.'));
};

exports.search = function(term, limit) {
    var deferred = Q.defer();

    rest.get(mavenUrl(term, limit), {
        timeout: timeout
    }).on('complete', function(data) {
        var res = data.response;
        if (!res) {
            deferred.reject(data);
            return;
        }
        deferred.resolve({
            count: res.numFound,
            docs: res.docs.map(function(doc) {
                return {
                    id: doc.id,
                    latestVersion: doc.latestVersion,
                    str: doc.id + ':' + doc.latestVersion
                };
            })
        });
    }).on('timeout', function() {
        deferred.reject("Timeout");
    });

    return deferred.promise;
};