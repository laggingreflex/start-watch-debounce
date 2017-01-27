module.exports = (files, opts = {}) => (callback) => () => {
  return function watchDebounce(log, reporter) {
    const Start = require('start').default;
    const watch = require('start-watch').default;
    const debounce = require('debounce-queue');

    const start = new Start(reporter);

    const debouncedCallback = debounce(callback, Object.assign({}, opts, {
      enqueue(data, queue, defaultEnqueue) {
        // because start-watch returns `[ [ ...files ] ]` (nested array) on the first run
        let ret
        if (Array.isArray(data)) {
          ret = queue.concat(data.filter(d => !queue.includes(d)));
        } else {
          ret = defaultEnqueue();
        }
        if (opts.enqueue) {
          ret = opts.enqueue(data, ret, defaultEnqueue)
        }
        return ret;
      }
    }));
    // none of these work:
    return start(watch(files, opts)(debouncedCallback));
    // return start(watch(files, opts)((files) => start(debouncedCallback(files))));
    // return start(watch(files, opts)((files) => start(() => debouncedCallback(files))));
    // return start(watch(files, opts)((files) => start(() => start(() => debouncedCallback(files)))));
    // return watch(files, opts)(() => start(debouncedCallback));
  };
};
