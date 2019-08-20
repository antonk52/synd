# Synd

Javascript wrapper around rsync with a command line interface.

## Instalation

lol

## Usage

Create a `~/.synd.config.js` file in your home directory with a configuration preset for your project.

```js
// ~/.synd.config.js

module.exports = {
    presetName: {
        // path to source directory
        // should end with a slash
        // string
        src: '/Users/yourUserName/path/to/a/project/to/sync/',
        // path to destination directory
        // should not end with a slash
        // string
        dest: '/home/yourUserName/path/to/dir/to/sync/to',
        // server address
        // string
        server: 'your.server.name.org',
        // force sync before first file change
        // boolean
        // default false
        initSync: true,
        // parse global .gitignore to exclude ignored files
        // boolean
        // default false
        globalGitignore: false,
        // parse local .gitignore to exclude ignored files
        // boolean
        // default false
        localGitignore: false,
        // show rsync command
        // boolean
        // default false
        showRsyncCommand: true,
        // miserably attempt to parse rsync output
        // boolean
        // default false
        parseOutput: false,
        // explicitly include
        // array
        include: [
            'thisSpecialFileName.js',
        ],
        // explicitly exclude
        // array
        exclude: [
            '**/.git',
            '**/.DS_Store',
        ],
    },
    // local sync
    anotherPreset: {
        src: '/Users/yourUserName/path/to/another/project/to/sync/',
        dest: '/Users/yourUserName/path/to/another/dir/',
    },
},
```

To start sync process run the following

```
synd presetName
```

## Notes

After you run synd it will generate a filter file for your project and place it in `~/.synd/presetName.[hash].filter`. If file already exists synd will use it instead.
