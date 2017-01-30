module.exports = (files, opts = {}) => (callback) => () => {
  return function watchDebounce(log, reporter) {
    const Start = require('start').default;
    const watch = require('start-watch_16b').default;
    const debounce = require('debounce-queue');

    const start = new Start(reporter);

    return new Promise((resolve, reject) => {

      const callbackWrapper = (...args) => callback(...args).then(resolve, reject);

      const debounced = debounce(callbackWrapper, Object.assign({}, opts, {
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

      const debouncedCallback = (...args) => new Promise((resolve, reject) => {
        debounced(...args);
        resolve();
      });

      return start(watch(files, opts)(debouncedCallback));
    });
  };
};
