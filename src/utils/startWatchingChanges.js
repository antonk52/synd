const fs = require('fs');

const startWatchingChanges = data => {
    fs.watch(
        data.src,
        {recursive: true},
        data.onFileChangeFunc,
    );

    if (data.initSync !== undefined) data.syncFunc();

    return data;
};

module.exports = startWatchingChanges;
