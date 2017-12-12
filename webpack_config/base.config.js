var webpack = require("webpack");
module.exports = {
  entry: {
      home: "./src/home.js",
      "price-calendar": "./src/price-calendar.js",
      "search-result": "./src/search.js",
      "user-profile": "./src/user-profile.js",
      accommodation: "./src/accommodation-profile.js",
      "itinerary-list": "./src/itinerary-list.js",
      "reservation-list": "./src/reservation-list.js",
      "accommodation-list": "./src/accommodation-list.js",
      "reservation-details": "./src/reservation-details.js",
      "terms": "./src/terms.js",
      "favourite-list": "./src/favourite-list",
      "review": "./src/review.js",
      "inbox": "./src/inbox.js",
      "inbox-msg": "./src/inbox-msg.js",
      "payment": "./src/payment-book.js",
      "about": "./src/about.js",
      "contact-us": "./src/contact-us.js",
      Apptest: "./src/Apptest.js",
  },
  output: {
    path: './assets/javascript/',
    filename: "[name].bundle.js"
  },
  resolve: {
      extensions: ['*', '.js', '.jsx']
  },
  module: {
      loaders: [
          {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              query: {
                  cacheDirectory: true,
                  presets: ['react', 'es2015','stage-0'],
                  "plugins": [
                      "transform-decorators-legacy",
                      "transform-class-properties"
                  ]
              }
          }
      ]
  },
  plugins: [
      new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
};
