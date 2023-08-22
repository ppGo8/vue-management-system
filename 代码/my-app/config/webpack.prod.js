const path = require("path");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { DefinePlugin } = require("webpack");

// 打包分析工具
const BundleAnaly = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// 返回处理样式loader函数
const getStyleLoaders = (pre) => {
    return [
        MiniCssExtractPlugin.loader,
        "css-loader",
        {
            // 处理css兼容性问题
            // 配合package.json中browserslist来指定兼容性
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: ["postcss-preset-env"],
                },
            },
        },
        pre,
    ].filter(Boolean);
};

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "static/js/[name].[contenthash:10].js",
        chunkFilename: "static/js/[name].[contenthash:10].chunk.js",
        assetModuleFilename: "static/media/[hash:10][ext][query]",
        // 每次输出清除之前的内容
        clean: true,
    },
    module: {
        rules: [
            // 处理css
            {
                test: /\.css$/,
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
            // 处理图片
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                },
            },
            // 处理其他资源
            {
                test: /\.(woff2?|ttf)$/,
                type: "asset/resource",
            },
            // 处理js
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                },
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
        ],
    },
    // 处理html
    plugins: [
        // 分析打包后的结果
        new BundleAnaly({
            analyzerMode: 'static' // 使用生成静态文件的方式来
        }),
        new EslintWebpackPlugin({
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",
            cache: true,
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:10].css",
            chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist"),
                    globOptions: {
                        // 忽略index.html文件
                        ignore: ["**/index.html"],
                    },
                },
            ],
        }),
        new VueLoaderPlugin(),
        // cross-env定义的环境变量给打包工具使用
        // DefinePlugin定义环境变量给源代码使用，从而解决vue3页面警告的问题
        new DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
        }),
    ],
    mode: "production",
    devtool: "source-map",
    optimization: {
        splitChunks: {
            // 分块打包
            chunks: "all",
            cacheGroups: {
                vue: {
                    test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
                    name: "vue-chunk",
                    priority: 40,
                },
                elementui: {
                    test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                    name: "elementui-chunk",
                    priority: 30,
                },
                echarts: {
                    test: /[\\/]node_modules[\\/]echarts[\\/]/,
                    name: "echarts-chunk",
                    priority: 20,
                },
                wangeditor: {
                    test: /[\\/]node_modules[\\/]@wangeditor[\\/]/,
                    name: "wangeditor-chunk",
                    priority: 20,
                },
                vmeditor: {
                    test: /[\\/]node_modules[\\/]@kangc[\\/]v-md-editor[\\/]/,
                    name: "vm-editor-chunk",
                    priority: 22,
                },
                higheditor: {
                    test: /[\\/]node_modules[\\/]highlight.js[\\/]lib[\\/]/,
                    name: "high-editor-chunk",
                    priority: 22,
                },
                libs: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "libs-chunk",
                    priority: 10,
                },
            },

        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}.js`,
        },
        minimizer: [
            // 压缩操作
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ],
    },
    // webpack解析模块加载选项
    resolve: {
        // 自动补全文件扩展名
        extensions: [".vue", ".js", ".json"],
        // 配置用来解析el-table
        alias: {
            '@': path.resolve('./node_modules'),
            vue: 'vue/dist/vue.js',
        }
    },
};
