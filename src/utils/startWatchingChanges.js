const fs = require('fs');

const startWatchingChanges = data => {

    if (data.watch) {
        fs.watch(
            data.src,
            {recursive: true},
            data.onFileChangeFunc,
        );
    }

    if (data.initSync === true) data.syncFunc();

    return data;
};

module.exports = startWatchingChanges;
