# Synd
[![npm version](https://badge.fury.io/js/synd.svg)](https://badge.fury.io/js/synd)
[![CI](https://github.com/antonk52/synd/workflows/CI/badge.svg)](https://github.com/antonk52/synd/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![install size](https://packagephobia.now.sh/badge?p=synd)](https://packagephobia.now.sh/result?p=synd)
[![Coverage Status](https://coveralls.io/repos/github/antonk52/synd/badge.svg?branch=master)](https://coveralls.io/github/antonk52/synd?branch=master)

Opinionated rsync wrapper written in javascript.

## Install

```sh
npm install --global synd
```

## Usage

Create a `~/synd.config.js` file in your home directory with a configuration preset for your project.

```js
module.exports = {
    // remote sync
    presetName: {
        src: '/Users/yourUserName/path/to/a/project/to/sync/',
        dest: '/home/yourUserName/path/to/dir/to/sync/to',
        server: 'your.company.org'
    },
    // local sync
    anotherPreset: {
        src: '/Users/yourUserName/path/to/another/project/to/sync/',
        dest: '/Users/yourUserName/path/to/another/dir'
    }
};
```

To start sync process run the following

```
synd presetName
```

## Preset Options

|Name                                        | Type         | Default | Description                                            |
|--------------------------------------------|--------------|---------|--------------------------------------------------------|
|**[`src`](#src)**                           | `{String}`   |         | Absolute path to the directory you want to sync        |
|**[`dest`](#dest)**                         | `{String}`   |         | Absolute path to the directory you want to sync to     |
|**[`server`](#server)**                     | `{String}`   |         | Name of the server you want to sync to                 |
|**[`initSync`](#initSync)**                 | `{Boolean}`  | `false` | Enables/Disables syncing upon program start            |
|**[`watch`](#watch)**                       | `{Boolean}`  | `true`  | Enables/Disables watching for file/directory changes   |
|**[`globalGitignore`](#gitignores)**        | `{Boolean}`  | `false` | Enables/Disables using global `.gitignore` for syncing |
|**[`localGitignore`](#gitignores)**         | `{Boolean}`  | `false` | Enables/Disables using local `.gitignore` for syncing  |
|**[`showRsyncCommand`](#showRsyncCommand)** | `{Boolean}`  | `false` | Enables/Disables displaying `rsync` command upon start |
|**[`parseOutput`](#parseOutput)**           | `{Boolean}`  | `false` | Enables/Disables attempting to parse `rsync` output    |
|**[`include`](#include)**                   | `{String[]}` | `false` | Paths to include                                       |
|**[`exclude`](#exclude)**                   | `{String[]}` | `false` | Paths to exclude                                       |

### `src`
if ends with a slash it's contents will be synced into `dest` directory.

Example: `'/users/anon/path/to/project/'`

### `server`
Optional. If you want to sync to a remote machine. You need to specify the server name.

Example: `'machine.host.org'`

### `initSync`
By default `synd` waits for a file change to start syncing, set to `true` to start syncing upon running `synd <presetName>`.

Example: `true`

### `gitignores`
You can use your project and global gitignore to generate `rsync` filter file to avoid syncing not wanted files.

Example: `true`

### `showRsyncCommand`
`Synd` uses `rsync` under the hood to sync your files. If you want to see what commands it generates set it to true.

Example: `true`

### `include`
Use this option to specify additional rules to include files to syncing process which otherwise would not be synced.

Example: `['**/test']`

### `exclude`
Use this option to specify additional rules to exclude files from syncing process which otherwise would be synced.

Example: `['**/.DS_Store', '**/node_modules']`

## Notes

After you run synd it will generate a filter file for your project and place it in `~/.synd/presetName.[hash].filter`. If file already exists synd will use it instead.

You can also see a list of all your presets by running

```
synd --list
```
