define(function () {
    function dashedToCamelCase(s) {
        var i;

        s = s.split('-');
        for (i = 1; i < s.length; i++) {
            s[i] = s[i][0].toUpperCase() + s[i].slice(1);
        }

        return s.join('');
    }

    function camelCaseToDashed(s) {
        return s.replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    return {
        dashedToCamelCase: dashedToCamelCase,
        camelCaseToDashed: camelCaseToDashed
    };
});
