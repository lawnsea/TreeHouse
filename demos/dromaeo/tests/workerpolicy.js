setPolicy({
    '!api': {
        postMessage: true,
        addEventListener: true
    },
    '!elements': {
        '!attributes': {
            '*': {
                style: {
                    '!set': true,
                    background: true
                }
            }
        }
    }
});
