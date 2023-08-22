// webpack.dev.js
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { DefinePlugin } = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const BundleAnaly = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const getStyleLoaders = (preProcessor) => {
    return [
        "vue-style-loader",
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                },
            },
        },
        preProcessor,
    ].filter(Boolean);
};

module.exports = {
    entry: "./src/main.js",
    output: {
        path: undefined,
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name].chunk.js",
        assetModuleFilename: "static/js/[hash:10][ext][query]",
    },
    module: {
        rules: [
            {
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                // use 数组里面 Loader 执行顺序是从右到左
                use: getStyleLoaders(),
            },
            {
                test: /\.less$/,
                use: getStyleLoaders("less-loader"),
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders("sass-loader"),
            },
            {
                test: /\.styl$/,
                use: getStyleLoaders("stylus-loader"),
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
                    },
                },
            },
            {
                test: /\.(ttf|woff2?)$/,
                type: "asset/resource",
            },
            {
                test: /\.(js)$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    plugins: [
                        "dynamic-import-webpack"
                    ],
                },
            },
            // vue-loader不支持oneOf
            {
                test: /\.vue$/,
                loader: "vue-loader", // 内部会给vue文件注入HMR功能代码
                options: {
                    // 开启缓存
                    cacheDirectory: path.resolve(
                        __dirname,
                        "node_modules/.cache/vue-loader"
                    ),
                    lintOnSave: false
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        // 打包结果分析,得到一个report.html文件
        // new BundleAnaly({
        //     analyzerMode: 'static' // 使用生成静态文件的方式来
        // }),
        new ESLintWebpackPlugin({
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",
            cache: true,
            cacheLocation: path.resolve(
                __dirname,
                "../node_modules/.cache/.eslintcache"
            ),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist"),
                    toType: "dir",
                    noErrorOnMissing: true,
                    globOptions: {
                        ignore: ["**/index.html"],
                    },
                    info: {
                        minimized: true,
                    },
                },
            ],
        }),
        new VueLoaderPlugin(),
        // 解决页面警告
        new DefinePlugin({
            __VUE_OPTIONS_API__: "true",
            __VUE_PROD_DEVTOOLS__: "false",
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial' // 只打包初始时依赖的第三方
                },
                elementUI: {
                    name: 'chunk-elementUI', // 单独将 elementUI 拆包
                    priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                    test: /[\\/]node_modules[\\/]element-ui[\\/]/
                },
            }
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        },
    },
    resolve: {
        extensions: [".vue", ".js", ".json"], // 自动补全文件扩展名，让vue可以使用
    },
    devServer: {
        open: true,
        host: "localhost",
        port: 3000,
        hot: true,
        compress: true,
        historyApiFallback: true, // 解决vue-router刷新404问题
    },
    mode: "development",
    devtool: "cheap-module-source-map",
};