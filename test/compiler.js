/**
 * Fixture, setup webpack compiler
 */

import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

export default (entry, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${entry}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.properties$/,
          use: {
            loader: path.resolve(__dirname, '../index.js'),
            options
          }
        }
      ]
    }
  });

  compiler.outputFileSystem = new memoryfs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) reject(err || stats.toString());

      resolve(stats);
    });
  });
};
