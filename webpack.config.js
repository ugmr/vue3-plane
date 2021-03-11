const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: {
        example: path.resolve(__dirname, "./example/plane-game/src/main.js")
    },
    output: {
        filename: "main.[hash].js",
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/"
    },

    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "assets",
                            publicPath: "./assets"
                        }
                    }
                ]
            }
        ]
    },

    devServer: {
        contentBase: path.resolve(__dirname, "./dist"),
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./example/plane-game/public/index.html")
        })
    ]
}