'use strict';

module.exports = {
  source: {
      include: ["src"],
      includePattern: ".+\\.js(doc|x)?$",
      excludePattern: "(^|\\/|\\\\)_"
  },
  opts: {
    recurse: true,
    destination: "./doc"
  },
  plugins: ['plugins/markdown']
};
