const defaults = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const glob = require('glob');

const pluginsPath = path.resolve(__dirname, 'plugins');
const plugins = glob.sync(`${pluginsPath}/*`);

const pluginsEntry = plugins.reduce((entries, plugin) => {
  const pluginName = path.basename(plugin);
  entries[pluginName] = path.resolve(plugin, 'src', `${pluginName}.js`);
  return entries;
}, {});


module.exports = {
  ...defaults,
  entry: {
	'wpgraphql-ide': path.resolve( process.cwd(), 'src', 'index.js' ),
	'wpgraphql-ide-render': path.resolve( process.cwd(), 'src', 'render.js' ),
	'graphql': path.resolve( process.cwd(), 'src', 'graphql.js' ),
    ...pluginsEntry,
  },
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
