# start-watch-debounce

[![npm](https://img.shields.io/npm/v/start-watch-debounce.svg?style=flat-square)](https://www.npmjs.com/package/start-watch-debounce)

Debounce wrapper for [start-watch] task using [debounce-queue].

## Install

```sh
npm install --save-dev start-watch-debounce
# or
yarn add --dev start-watch-debounce
```

## Usage

```js
import Start from 'start';
import watch from 'start-watch-debounce';
import files from 'start-files';
import read from 'start-read';
import babel from 'start-babel';
import write from 'start-write';

const start = Start(reporter());

export const dev = () => start(
  watch('lib/**/*.js')(changedFiles => start(
    files(changedFiles),
    read(),
    babel(),
    write('build/')
  ))
);
```

`changedFiles` is an array of *all* changed files since last invocation.

## Arguments

Same as [start-watch] and [debounce-queue].

[start-watch]: https://github.com/start-runner/watch
[debounce-queue]: https://github.com/laggingreflex/debounce-queue

