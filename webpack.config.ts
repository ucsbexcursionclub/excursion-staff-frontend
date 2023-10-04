import path from "path";
import webpack, {Configuration as WebpackConfiguration} from "webpack";
import {Configuration as WebpackDevServerConfiguration} from "webpack-dev-server";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import {TsconfigPathsPlugin} from "tsconfig-paths-webpack-plugin";

import dotenv from "dotenv";
dotenv.config();

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

const webpackConfig = (env): Configuration => ({
    entry: "./src/index.tsx",
    ...(env.production || !env.development ? {} : {devtool: "eval-source-map"}),
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [new TsconfigPathsPlugin()]
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "build.js",
        publicPath: "/"
    },
    devServer: {
        historyApiFallback: true,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript"
                        ],
                        plugins: [env.development && require.resolve("react-refresh/babel")].filter(
                            Boolean
                        )
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {loader: "css-loader", options: {importLoaders: 1}},
                    "postcss-loader"
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new webpack.DefinePlugin({
            "process.env.PRODUCTION": env.production || !env.development,
            "process.env.NAME": JSON.stringify(require("./package.json").name),
            "process.env.VERSION": JSON.stringify(require("./package.json").version)
        }),
        new webpack.EnvironmentPlugin(["VERCEL_ENV"]), //these come from Vercel
        new ForkTsCheckerWebpackPlugin(),
        new ESLintPlugin({files: "./src/**/*.{ts,tsx,js,jsx}"}),
        new CopyWebpackPlugin({
            patterns: [{from: "meta", to: "meta"}]
        }),
        env.development && new ReactRefreshWebpackPlugin()
    ]
});

export default webpackConfig;
