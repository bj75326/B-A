
//es6 配置
//todo: code spilt analysis

const path = require('path');
const {version} = require('./package.json');

export default {
  entry: {
    vendor: [
      'react',
      'react-dom'
    ],
    app: "./src/index.js"
  },
  outputPath: `./dist/${version}`,
  theme: './theme.config.js',
  extraBabelPlugins: [
    ["import", {"libraryName": "antd", "libraryDirectory": "es", "style": true}]
  ],
  env: {
    development: {
      extraBabelPlugins: [
        "dva-hmr"
      ],
      html: {
        template: "./src/index.ejs",
        headScripts: [],
        filename: 'index.html'
      },
      publicPath: "/"
    },
    production: {
      html: {
        template: "./src/index.ejs",
        headScripts: null,
        filename: '../../index.html',
        minify: {
          collapseWhitespace: true
        }
      },
      publicPath: `/B-A/dist/${version}/`
    }
  },
  ignoreMomentLocale: true,
  browserslist: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
  commons: [
    {
      name: ['vendor'],
      minChunks: Infinity
    }
  ],
  //disableDynamicImport: true,
  disableCSSModules: true,
  hash: true,
  //启用roadhog mock
  /*proxy: {
    "/api": {
      "target": "http://jsonplaceholder.typicode.com/",
      "changeOrigin": true,
      "pathRewrite": {"^/api" : ""}
    }
  }*/
};

//json 配置
