/* eslint-disable no-magic-numbers */
import gulp from "gulp";
import util from "gulp-util";
import del from "del";
import concat from "gulp-concat";
import minifier from "gulp-uglify";
import mainBower from "main-bower-files";
import webpack from "webpack";
import {HotModuleReplacementPlugin} from "webpack";
import webpackStream from "webpack-stream";
import WebpackDevServer from "webpack-dev-server";
import runSequence from "run-sequence";
import webpackConfig from "./webpack.config.babel";

/**
 * Clean build files
 */
gulp.task("clean", (callback) => {
  del.sync("public/", callback);
});

/**
 * Build JSX Components for Production
 */
gulp.task("webpack-build", () => {
  return gulp.src("./src/app.module.js")
    .pipe(webpackStream(webpackConfig, webpack))
    .on("error", (error) => { util.log(error); })
    .pipe(gulp.dest("public/"));
});

/**
 * Start Dev server with Webpack
 */
gulp.task("webpack-dev-server", () => {
  let devConfig = Object.assign({}, webpackConfig);
  // devConfig.entry.unshift("react-hot-loader/patch");
  devConfig.entry.unshift("webpack-dev-server/client/index.js?http://localhost:8080");
  devConfig.plugins.unshift(new HotModuleReplacementPlugin());

  new WebpackDevServer(webpack(devConfig), {
    contentBase: "public/",
    stats: {colors: true},
    historyApiFallback: true,
    hot: true,
    hotOnly: true
  })
    .listen(8080, "localhost", (error) => {
      if(error) {
        util.log("Error in webpack-dev-server", error);
      }
      util.log("Application started at localhost:8080...");
    });
});

/**
 * Run in development environment
 */
gulp.task("dev", (callback) => {
  runSequence([
    "clean",
    "webpack-dev-server"
  ], callback);
});

/**
 * Run in production environment
 */
gulp.task("build", (callback) => {
  runSequence([
    "clean",
    "webpack-build"
  ], callback);
});