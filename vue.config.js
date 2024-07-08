
const { defineConfig } = require('@vue/cli-service');
const copyPlugin = require('copy-webpack-plugin');

const WriteFilePlugin = require('write-file-webpack-plugin'); // お試し

/** @type {typeof import("unplugin-vue-macros/webpack").default} */
const VueMacros = require('unplugin-vue-macros/webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,

  parallel: false,

  // 共通変数などの SCSS (.scss) ファイルをグローバルで読み込み
  css: {
    loaderOptions: {
      css: {
        import: true
      },
      scss: {
        additionalData: `
          @import "@/css/variables.scss";
          @import "@/css/svg-editor.scss";
        `,
        //= dart-sassを使っている場合
        // prependData: `@use "@/assets/scss/variables.scss";`
        //= 名前空間を持たせたい場合
        // prependData: `@use "@/assets/scss/variables.scss" as hoge;`
      }
    },
  },
  
  // https://github.com/webpack/webpack-dev-server/issues/4804
  //  ResizeObserver loop limit exceeded in Chromium browsers #4804
  devServer: {
    devMiddleware: { writeToDisk: true },
    client: {
      // overlay: false,   // If you don't need overlay you can use this
      overlay: {
        errors: false,
        warnings: false,
        // runtimeErrors: false,
      },
    },
  },

  chainWebpack: (config) => { // defineModel (Alternatives defineModels) is implemented and shipped as an experimental feature in 3.3 beta and requires explicit opt-in.
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          defineModel: true,
          defineModels: true,
          propsDestructure: true,     // お試し
          reactivityTransform: true,  // お試し

        }
      })
  },

  configureWebpack: {  // === webpack.config.js or configure-webpack.js module.exports = {
    performance: {
      //= これらの値を大きくすることで警告が表示されなくなるだけで、実際のパフォーマンス問題は解決しません。
      // 大きなファイルサイズは、特にWebでの配信においてパフォーマンスに悪影響を及ぼす可能性があります。
      // 可能であれば、コードの分割や不要な依存関係の削除など、パフォーマンスの最適化を検討してみてください。
      maxEntrypointSize: 1024*1024*3,
      maxAssetSize: 1024*1024*3,
    },
    // target: 'electron-renderer',  // !! 要 「nodeIntegration: true」
    resolve: {
      extensions: [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
      ],
      alias: {
        'vue$': 'vue/dist/vue.esm-bundler.js',  // !! Component provided template option but runtime compilation is not supported in this build of Vue
      },
    },

    plugins: [
      VueMacros({}),
      new copyPlugin({
        patterns: [
          { 
            from: 'preload.js', 
            to: './dist_electron',
            context: "src",
          },        
          { from: 'dbsample.py',                 to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'sample.py',                   to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'txt_crypter.py',              to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_dump_json.py',            to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_img2svg.py',              to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_make_tiptap_content.py',  to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_pdf2svg.py',              to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_pnmbmp2svg.py',           to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_read_cipher_text.py',     to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_read_json.py',            to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_read_svg.py',             to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_read_text.py',            to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_sql_base.py',             to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_sql_content.py',          to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_sys_base.py',             to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_sys_master.py',           to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_write_assets.py',         to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_write_cipher_text.py',    to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_write_json.py',           to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_write_svg.py',            to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_write_svg_assets.py',     to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'uni_write_text.py',           to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'write_json_to_db.py',         to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          { from: 'bitwaves.sys',                to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          // { from: 'bitwaves.sys-wal',             to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
          // { from: 'bitwaves.sys-shm',             to: './pysrc', context: "pysrc", globOptions: { gitignore: false } },     
        ],
        options: {
          concurrency: 10,
          // ignore: ['*.gitignore'],  // .gitignore ファイルを無視する
        },
      }),
    ],

    externals: {
      'MathLive': 'MathLive'
    },
    
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		},
    electronBuilder: {
      
      //= 【暫定対策】app.js:384 Uncaught ReferenceError: require is not defined
      // Electronのレンダラープロセスでは、デフォルトではNode.jsのAPIにアクセスできません。
      // そのため、requireやfs、pathなどのNode.jsのAPIをレンダラープロセスで使用しようとすると、このようなエラーが発生します。
      // ↓ nodeIntegration: true 1行 を追加した
      //=
      nodeIntegration: false,   // !! nodeIntegration と contextIsolation は同時に設定できません ⇒ false に戻した
      contextIsolation: true,   // !! preloadスクリプト には必要なので、変更出来ません

      preload: 'src/preload.js', // preloadスクリプトのパスを指定
      // Or, for multiple preload files:
      // preload: { preload: 'src/preload.js', otherPreload: 'src/preload2.js' }

      files: [
        "**/*",
        "./pysrc/**/*"
      ],

      build: {  // package.json で書けない、ここで書くように
        "appId": "jp.co.dskllc.bitwaves.biteditor"
      },
      builderOptions: {
        win: {
          icon: './icon.ico'
        },        
        asar: true,
        asarUnpack: [
          "./pysrc/**/*"
        ],
        publish: [ 
          {
            provider: "github",
            owner: "dskllc",
            repo: "bitwaves",
            releaseType: "draft",
            channel: "latest",
          }
         ]
      },

    }
  },
})
