module.exports = (opts = {}, callback) => (input) => {
  return function watchDebounce(log, reporter) {
    const Start = require('start').default;
    const watch = require('start-watch').default;
    const debounce = require('debounce-queue');

    if (!callback && typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    if (typeof opts === 'string' || Array.isArray(opts)) {
      opts = { files: opts };
    }

    if (input && input.length && !opts.files) {
      opts.files = input;
    }

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

    return start(watch(opts, debouncedCallback));
  };
};
