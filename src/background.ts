/* eslint-disable @typescript-eslint/no-explicit-any */

//= background.ts【Node.js側】
//  electron entry file (for Electron's main process)
//= 

'use strict'

import { app, protocol, BrowserWindow, ipcMain, shell } from 'electron'

import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

import fs from 'fs'
import os from 'os'
import path from 'path'

// import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  //= Create the browser window.
  // VGA	                640×480	  4: 3	307, 200
  // SVGA(Super - VGA)	  800×600	  4: 3	480,000
  // SXGA (Super-XGA)	    1280×1024	5:4	  1,310,720	
  // XGA +                1152×864	4: 3	995, 328	
  // 2K / FHD(Full - HD)	1920×1080	16: 9	2,073, 600	
  // 4K/UHD	              3840×2160	16:9	8,294,400	
  // 8K/SHV	              7680×4320	16:9	33,177,600	
  
  const win = new BrowserWindow({
    width : 800,                    // Window's width in pixels. Default is `800`.
    height: 600,                    // Window's height in pixels. Default is `600`.
    frame : true,                   // frameless := Chrome Frame 有無    
    webPreferences: {
      //= 【暫】electron v20.0.0 以降 preload.js が動かない問題の対応
      //    VM4 sandbox_bundle:2 Unable to load preload script: C:\workspace\vue3\bitvue\dist_electron/preload.js
      //    VM4 sandbox_bundle:2 Error: module not found: python-shell
      //        at preloadRequire (VM4 sandbox_bundle:2:82057)
      //=
      sandbox: false,

      //= 2024.01.05a to disable devtools only when in production mode
      //  アプリケーションがパッケージ化されている場合（つまり、yarn run electron:build でビルドされている場合）、開発者ツールは無効化されます
      //     ※ this also prevents using shortcuts like ctrl+shift+i to toggle the devtools
      //=
      devTools: !app.isPackaged,  // !! when release
      // devTools: true,             // !! when debug
      
      //= Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration : (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,  // false, レンダラープロセスは Node.js の統合（Enable）を使用するかどうか
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,                         // true
      preload: __dirname + '/preload.js'  // ↑ には preload.js が必要: contextBridge という仕組みを使って、レンダラープロセスに、機能を提供します
    }
  })


  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    //= 2024.01.05a 開発ツールは自動的に開かれないように、↓をコメントアウトした
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // await installExtension(VUEJS3_DEVTOOLS)
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e: any) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}


//= PDF 出力用ウィンドウ
const DefWinSpecs = {
  width: 1280,
  height: 1024,
  show: false,
  webPreferences: {
  }
};

//= PDF 出力時のサイズなどを設定
const DefOptions = {
  landscape: false,             // 用紙の向き。true で横向き、false で縦向きです ※ @page CSS ルールがウェブページ内で使われている場合、landscape は無視されます
  displayHeaderFooter: false,   // ヘッダーとフッターを表示するかどうか 
  printBackground: false,       // 背景グラフィックを印刷するかどうか
  scale: 1.0,                   // number , 用紙に対するスケール
  pageSize: "A4",               // string, 用紙のサイズ。0、A1、A2、A3、A4、A5、A6、Legal、Letter、Tabloid、Ledger | インチ単位の height と width を含む Object
  margins: {                    // 余白のサイズ。単位はインチです。省略値は 1cm (約 0.4 インチ) です。
    // bottom: 1,
    // left: 1,
    // right: 1,
    // top: 1
  },
  pageRanges: "",               // string, 印刷するページ範囲。例えば、"1-5, 8, 11-13"、"" は全ページ
  headerTemplate: "",           // string, ヘッダーの HTML テンプレート
  footerTemplate: "",           // string, フッターの HTML テンプレート
  preferCSSPageSize: false,     // true で CSS のページサイズを優先します
  generateTaggedPDF: false,     // true でタグ付き PDF を生成します
};


//= API sysapi.printWinContentsToPdf のメインプロセス側（background.ts）
//  メインプロセス側でPDF作成が完了したらwrote-pdfイベントをレンダラープロセスに送信し、
//  レンダラープロセス側でそのイベントを待機するという方法です。
//
//  PDF 生成結果の受け取り：
//    レンダラープロセス側（.vueファイル）
//      ipcRenderer.on('wrote-pdf', (event, path) => {  
//        console.log(`PDFを ${path} に作成しました。`); 
//      }); 
//      ※ Nodeintegration disabled and contextIsolation enabled の現状では、ipcRenderer　は使えない、
//         preload.js で ipcRenderer を使えるようになっています、なので、preload.js で実装する必要があります。
//         2023.11.28 暫くペンディングにします。
//=
ipcMain.on('print-win-pdf', async (
  event,    // IpcMainEvent
  pdfPath,  // string, 出力先のPDFファイル path-name
  options,  // object, 出力時のサイズなどを設定
) => {
  //=
  //  [in] 工作中の Browser Window コンテンツ   ※ event.sender から BrowserWindow を取得する
  //         html | svg | canvas | webgl | pdf | png | jpeg | gif | bmp | tiff
  //  [in] PDF 出力先の path-name
  //=
  console.log('pdfPath = ' + pdfPath);

  const win = BrowserWindow.fromWebContents(event.sender)   // 印刷コンテンツが含まれるウィンドウを取得する

  const myOptions = Object.assign({}, DefOptions);    // copy DefOptions to myOptions 
  if (options !== null && options !== undefined) {
    Object.assign(myOptions, options);                // merge options to myOptions
  }

  console.log('myOptions = ' + JSON.stringify(myOptions, null, 2));


  try {
    const data = await win.webContents.printToPDF(myOptions);
    await fs.promises.writeFile(pdfPath, data);

    shell.openExternal('file://' + pdfPath); // PDF を開く

    console.log(`print-win-pdf Wrote PDF successfully to ${pdfPath}`);
    event.sender.send('wrote-pdf', { pdfPath: pdfPath, exit_code: 0, result: "OK" }); // レンダラープロセスに送信
  } catch (error) {
    console.log(error.message);    
    event.sender.send('print-win-pdf wrote-pdf', { pdfPath: pdfPath, exit_code: 1, result: error}); // レンダラープロセスに送信
  }
})


const ContentsFileExt = ['.html', '.htm', '.svg', '.txt', '.pdf', '.png', '.jpeg', '.gif', '.bmp', '.tiff' ];

ipcMain.on('print-to-pdf', async (
  event,        // IpcMainEvent
  filePathname, // string, 出力元の .html | .svg ファイル path-name | 拡張子のみ（テキストコンテンツ使用）
  textContents, // string, 出力元のテキストコンテンツ
  pdfPath,      // string, 出力先のPDFファイル path-name, null = html/svg と同じ場所 | "" = Desktop | path-name 
  winSpecs,     // object, 出力用ウィンドウの仕様
  options,      // object, 出力時のサイズなどを設定
) => {
  //=
  //  [in ] 1) filePathname
  //            ア) 出力元ファイルの path - name（通常）
  //              html | svg | canvas | webgl | pdf | png | jpeg | gif | bmp | tiff
  //            イ) in ContentsFileExt[]（拡張子のみ）
  //  [in ] 2) textContents - 出力元のテキストコンテンツ | null
  //            ※ 1) が イ) の場合に有効、尚、印刷先は 3) - c) で指定
  //  [out] 3) pdfPath - 出力先のPDFファイル path-name
  //            a) null = html と同じ場所で同じファイル名の .pdf
  //            b) "" = Desktop に同じファイル名の .pdf
  //            c) path-name = 指定した path-name の .pdf
  //=
  console.log('filePathname = ' + filePathname);
  console.assert(filePathname !== null && filePathname !== undefined, 'filePathname is null or undefined');

  //= 出力元HTMLファイルの情報取得
  const htmlParent = path.dirname(filePathname); // 最後の path.sep を除いたパス
  const htmlExt = path.extname(filePathname); // 拡張子
  const htmlStem = path.basename(filePathname, htmlExt); // 拡張子を除いたファイル名

  console.log('html parent = ' + htmlParent); // 最後の path.sep を除いたパス
  console.log('html stem = ' + htmlStem);     // 拡張子を除いたファイル名  

  //= 出力先定義
  let outputPath: string;
  if (pdfPath === null || pdfPath === undefined) {
    outputPath = path.join(htmlParent, `${htmlStem}.pdf`);
  } else if (pdfPath === "") {
    const desktopPath = path.join(os.homedir(), 'Desktop');
    outputPath = path.join(desktopPath, `${htmlStem}.pdf`);
  } else {
    outputPath = pdfPath; // ↓ check している
  }

  console.log('output path = ' + outputPath);
  console.assert(path.basename);
  console.assert(path.extname(outputPath));

  //= when filePathname is in ContentsFileExt[], textContents is not null
  //  1) temp. file の path-name を生成する
  //  2) temp. file に textContents を書き込み、そのファイルを出力元とする
  //  3) let filePathname = temp. file の path-name
  //=
  if (ContentsFileExt.includes(filePathname)) {
    console.log('#### use textContents');
    console.assert((textContents != null && textContents !== undefined), 'textContents is null or undefined');
    console.assert(pdfPath !== null && pdfPath !== undefined, 'pdfPath is null or undefined');

    const tempPath = path.join(os.tmpdir(), `${htmlStem}${filePathname}`);
    console.log('temp path = ' + tempPath);
    fs.writeFileSync(tempPath, textContents);
    filePathname = tempPath;
  }

  const myWinSpecs = Object.assign({}, DefWinSpecs);  // copy DefWinSpecs to myWinSpecs
  if (winSpecs !== null && winSpecs !== undefined) {
    Object.assign(myWinSpecs, winSpecs);              // merge winSpecs to myWinSpecs
  }
  console.log('myWinSpecs = ' + JSON.stringify(myWinSpecs, null, 2));

  let win = new BrowserWindow(myWinSpecs);

  //= 出力元HTMLファイルを読み込む
  win.loadFile(filePathname);

  const myOptions = Object.assign({}, DefOptions);    // copy DefOptions to myOptions 
  if (options !== null && options !== undefined) {
    Object.assign(myOptions, options);                // merge options to myOptions
  }
  console.log('myOptions = ' + JSON.stringify(myOptions, null, 2));

  //= outputPDFWindowを起動して、ロードが完了したらPDFとして出力
  win.webContents.on('did-finish-load', () => {
    win.webContents.printToPDF(myOptions).then(data => {  // 出力時のサイズなどを設定
      fs.writeFile(outputPath, data, (error) => {
        if (error) {
          throw error
        }

        shell.openExternal('file://' + outputPath); // PDF を開く
        
        console.log(`print-to-pdf Wrote PDF successfully to ${outputPath}`);
        event.sender.send('wrote-pdf', { pdfPath: outputPath, exit_code: 0, result: "OK" }); // レンダラープロセスに送信
      })
    }).catch(error => {
      console.log(`print-to-pdf Failed to write PDF to ${outputPath}: `, error);
       event.sender.send('wrote-pdf', { pdfPath: outputPath, exit_code: 1, result: error}); // レンダラープロセスに送信
    })
  })
  
})


