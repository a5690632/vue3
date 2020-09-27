const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

const path = require('path')
const TerserPlugin = require("terser-webpack-plugin");
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production';

function resolve(dir) {
  return path.join(__dirname, dir)
}


// vue.config.js额
module.exports = {

  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,

  //打包app时放开该配置
  publicPath: "./",
  chainWebpack: config => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
      .set('@mobile', resolve('src/modules/mobile'))
    if (isProduction) {
      // 删除预加载
      config.plugins.delete('preload');
      config.plugins.delete('prefetch');
      // 压缩代码
      config.optimization.minimize(true);
      // 分割代码
    }
  },
  configureWebpack: config => {
    //生产环境取消 console.log
    if (isProduction) {
      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugins.push(new AntdDayjsWebpackPlugin())
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' + productionGzipExtensions.join('|') + ')$'
          ),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      )
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: 'all',
              test: /node_modules/,
              name: 'vendor',
              minChunks: 1,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 100
            },
            common: {
              chunks: 'all',
              test: /[\\/]src[\\/]js[\\/]/,
              name: 'common',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 60
            },
            styles: {
              name: 'styles',
              test: /\.(sa|sc|c)ss$/,
              chunks: 'all',
              enforce: true
            },
            runtimeChunk: {
              name: 'manifest'
            }
          }
        },
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                warnings: false,
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log']
              },
            },
          }),
        ],
      }
    }
  },
  parallel: require('os').cpus().length > 1,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#11a984',
          'link-color': '#11a984',
          // 'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  },

  devServer: {
    port: 3000,
    compress: false, // 开启压缩
    proxy: {
      '/dev': {
        //  target: "http://121.36.30.62:3000/jcpt", //测试
        target: "http://localhost:8088/jcpt",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/dev': ''
        }
      },

    }
  },

}