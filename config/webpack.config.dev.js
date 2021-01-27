const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js'); // 引用公共的配置

const devConfig = {
    devtool: 'cheap-module-eval-source-map',
    entry: './demo/demo.js', // 入口文件
    mode: 'development', // 打包为开发模式
    output: {
        filename: 'demo.bundle.js', // 输出的文件名称
        path: path.resolve(__dirname, '../demo') // 输出的文件目录
    },
    devServer: { // 该字段用于配置webpack-dev-server
        contentBase: path.join(__dirname, '../demo'),
        compress: true,
        port: 9000, // 端口9000
        open: true // 自动打开浏览器
    },
    module: {
        rules: [
            { // 编译less
                test: /\.less$/,
                exclude: '/node_modules/',
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'less-loader'
                }]
            },
        ]
    },
}

module.exports = merge(devConfig, baseConfig);