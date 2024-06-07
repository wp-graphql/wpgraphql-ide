const defaults = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const glob = require('glob');

// Define the path to the plugins directory
const pluginsPath = path.resolve(__dirname, 'plugins');

// Use glob to find all plugin directories
const plugins = glob.sync(`${pluginsPath}/*`);

// Define entry points for the main app and plugins
const mainAppEntry = {
  'wpgraphql-ide': path.resolve(process.cwd(), 'src', 'wpgraphql-ide.js'),
  'wpgraphql-ide-render': path.resolve(process.cwd(), 'src', 'wpgraphql-ide-render.js'),
  'graphql': path.resolve(process.cwd(), 'src', 'graphql.js'),
};

const pluginsEntry = plugins.reduce((entries, plugin) => {
  const pluginName = path.basename(plugin);
  entries[pluginName] = path.resolve(plugin, 'src', `${pluginName}.js`);
  return entries;
}, {});

console.log(pluginsEntry);

// Export an array of Webpack configurations, one for the main app and one for each plugin
module.exports = [
  // Configuration for the main app
  {
    ...defaults,
    entry: {
      ...pluginsEntry,
      ...mainAppEntry
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      graphql: 'graphql',
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name]/[name].js',

      // devtoolNamespace: 'wpgraphql-ide',
      // filename: './build/[name].js',
      // path: path.join( __dirname, '..', '..' ),
      // devtoolModuleFilenameTemplate: ( info ) => {
      //   console.log({ info });
      //   if ( info.resourcePath.includes( '/@wpgraphql-ide/' ) ) {
      //     const resourcePath = info.resourcePath.split( '/@wpgraphql-ide/' )[ 1 ];
      //     return `../../packages/${ resourcePath }`;
      //   }
      //   return `webpack://${ info.namespace }/${ info.resourcePath }`;
      // },
    },
  },
];
