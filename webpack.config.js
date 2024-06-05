const defaults = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const glob = require('glob');

const pluginsPath = path.resolve(__dirname, 'plugins');
const plugins = glob.sync(`${pluginsPath}/*`);

const entry = plugins.reduce((entries, plugin) => {
  const pluginName = path.basename(plugin);
  entries[pluginName] = path.resolve(plugin, 'src', `${pluginName}.js`);
  return entries;
}, {});

module.exports = {
  ...defaults,
  entry,
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    graphql: 'graphql',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name]/[name].js',
  },
};
