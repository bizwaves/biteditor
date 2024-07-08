
//= preload.js
//  Electron では、レンダラープロセスで Node.js の API を使用することはできません。
//  これは、レンダラープロセスがブラウザのコンテキストで実行されるためです。
//  しかし、特権的なモードであり preload スクリプトを使用すると、レンダラープロセスで Node.js の API を使用できます。
//  preload スクリプトは "隔離ワールド" で実行され, レンダラープロセスのコンテキストと分離（contextIsolation）されます。
//=


//= プリロード (隔離ワールド)
//  メインプロセスとレンダラープロセスを中継するファイルです。
//=

import { contextBridge, ipcRenderer } from 'electron'


const { PythonShell } = require('python-shell');

// import { crypto } from 'crypto'

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const path = require('path');

const DefaultPyOptions = {
  mode          : 'text',
  encoding      : 'utf8',
  args          : [],
  pythonOptions : ['-u']
};

async function asyncPyJsonIO(options) {
  console.log(`asyncPyJsonIO: ${options.py_script}, process.env.NODE_ENV: ${process.env.NODE_ENV}`);
  console.assert(options["py_script"], "options.py_script is null");
  
  //= py_script := .py ファイルのパスを取得します

  let py_script;
  const { sendData = null, py_opts = DefaultPyOptions } = options;
  
  //+ when run electron:build
  //  py_script: C:\Users\taich\Documents\GitHub\vue3-electron\dist_electron\win-unpacked\resources\app.asar.unpacked\pysrc\uni_dump_json.py
  //+
  if (process.env.NODE_ENV === 'production') {
    const src = options["py_script"];

    const [py_dir, py_file] = path.dirname(src).split(path.sep).filter((v) => v).concat(path.basename(src));
    console.log(`py_dir: ${py_dir}, py_file: ${py_file}`);  // py_dir: pysrc, py_file: uni_sql_content.py

    const app_dir = __dirname.split(path.sep).filter((v) => v).slice(0, -1).join(path.sep); // app_dir: ~\resources
    console.log(`app_dir: ${app_dir}`);

    //実際 path は resources\app.asar.unpacked\pysrc となっているので、path.join で結合し、py_script　を作成する
    py_script = path.join(app_dir, 'app.asar.unpacked', py_dir, py_file);
  } else {  //+ when run electron:serve
    py_script = options["py_script"].replace(".py", ".py");  // .py -> .py 2022.01.21a
  }

  console.log(`py_script: ${py_script}`);

  //= 送信するJSONデータを定義します。
  const sendJson = JSON.stringify(sendData);

  //= Python-shellオプションとともに、送信するJSONデータを渡して、pythonスクリプトを実行します。
  const pyShell = new PythonShell(py_script, {
    mode: py_opts.mode,
    encoding: py_opts.encoding,
    args: py_opts.args,
    pythonOptions: py_opts.pythonOptions
  });

  // sends a message to the Python script via stdin
  if (sendData) { 
    console.log("BEGIN sendData");
    pyShell.send(sendJson);
    console.log("END sendData");
  }

  // 受信したレスポンスを変数に格納します。
  let receivedData;
  pyShell.on('message', function(message) {
    // received a message sent from the Python script (a simple "print" statement)
    // console.log(json_text);
    receivedData = JSON.parse(message);
    // console.log("AAAAAAAA");
    // console.log( json_data );
  });

  // Pythonスクリプトの実行が終了したら、受信したレスポンスを返します。
  const result = {}

  const { success, err = '' } = await new Promise((resolve, reject) => {
    pyShell.end(function (err, code, signal) {
      result["code"  ] = code;
      result["signal"] = signal;  
      // console.log(`${py_script} exit code   was: ${code}`  );
      // console.log(`${py_script} exit signal was: ${signal}`);

      if (err) { 
        console.log(`${py_script} Failed, exit err was: ${err}`);
        reject({ success: false, err });
      } else {
        console.log(`${py_script} success`);
        resolve({ success: true });
      }

      resolve(receivedData);
    });
  }); // Promise

  // console.log(`BBBBBBBB After do ${py_script}:`);
  result["success"] = success;
  result["err"] = err;
  result["readed_data"] = receivedData;

  return result;
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//= プリロード (隔離ワールド)
//  分離されたコンテキスト間に、安全、双方向で同期されたブリッジを作成します
//  preload スクリプトは "隔離ワールド" で実行されます
//  プロセス: Renderer
//    ※1 contextBridge はElectron側が用意した安全な仕組みで、コンテキストが分離されていても（本来、Electronのみで使える）Node.js （RPC等）を問題なく使える
//    ※2 可能なら ipcRenderer.send は、より機能が限定されている ipcRendere.invoke に置き換えましょう
//    ※3 ipcRenderer そのものをレンダラープロセス側に露出してはいけません（preload を除き、レンダラープロセス側で import 出来ません）
//  参考：
//    https://stackoverflow.com/questions/63615355/how-to-import-ipcrenderer-in-vue-js-dirname-is-not-defined
//=
contextBridge.exposeInMainWorld(                // IPC デモ, ↓ send, receive は、強力ですが、より安全的、unipyapi のような １つの IPC 通信につき、１処理とした方が良いでしょう
  'ipcApi',                                     // apiKey string - window に API を注入するキー。 その API には window[apiKey] でアクセスできます
  {                                             // api Record - あなたの API です
    send: (channel, data) => {                  // レンダラー送信 ⇒ Main 
      let validChannels = ['toMain'];           // whitelist channels
      if (validChannels.includes(channel)) {
        console.log('sending', channel, data);
        ipcRenderer.send(channel, data);         // ※ backend.ts ipcMain.on('toMain', (event, data) => { ... } で受信
      } else {
        console.log('sending', channel, 'is not valid channel');
      }
    },

    receive: (channel, func) => {               // レンダラー受信 ← Main
      let validChannels = ['fromMain'];         // whitelist channels
      if (validChannels.includes(channel)) {
        console.log(`PRELOAD receiving ${channel} ...`);
        ipcRenderer.on(channel, (event, ...args) => func(...args))  // ※ backend.ts event.reply('fromMain', 'pong') で送信?
      } else {
        console.log(`PRELOAD receive: ${channel} is not valid`);
      }
    },

    doThing: () => ipcRenderer.send('do-a-thing'),

    // myPromises: [Promise.resolve(), Promise.reject(new Error('whoops'))],

    anAsyncFunction: async () => 123,

    data: {
      myFlags: ['a', 'b', 'c'],
      bootTime: 1234
    },
    
    nestedAPI: {
      evenDeeper: {
        youCanDoThisAsMuchAsYouWant: {
          fn: () => ({
            returnData: 123
          })
        }
      }
    }
})

//= Node のグローバルシンボルの公開
// Node API の多くはローカルシステムのリソースへのアクセスを許してしまいます。 
// 信頼できない外部コンテンツにおいては、公開するグローバルや API について注意が必要です
// contextBridge.exposeInMainWorld('nodeCrypto', {
//   sha256sum (data) {
//     const hash = crypto.createHash('sha256')
//     hash.update(data)
//     return hash.digest('hex')
//   }
// })


//= プリロード (隔離ワールド)
//  分離されたコンテキスト間に、安全、双方向で同期されたブリッジを作成します
//  preload スクリプトは "隔離ワールド" で実行されます
//  プロセス: Renderer
//=
contextBridge.exposeInMainWorld('pyexam', { // PythonShell Example 
  doThing: () => {
    PythonShell.runString('import os;print(os.getcwd())', null, function (err, result) {
        if (err) throw err;
    
        console.log(result);
    });   
  },
  doSample: () => {
    var pyshell = new PythonShell('pysrc/sample.py');
    pyshell.send('Py-Node Tairo');    
    pyshell.on('message', function (data) {
      console.log(data);
    });
  }
})  


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ExamWriteJsonToDbData = {
  "name": "WriteTransferClip",              // 機能 ID
  "version": "0.0.1",                       // バージョン
  "description": "Write TransferClip",      // 任意の説明
  "source": {
    "config": { },                          // 通信設定
    "data": { "Field01": "ExamField" }      // 入力データ
  }
};



//= プリロード (隔離ワールド)
//  分離されたコンテキスト間に、安全、双方向で同期されたブリッジを作成します
//  preload スクリプトは "隔離ワールド" で実行されます
//  プロセス: Renderer
//  使い方:
//    var result = await(window as any).unipyapi.dumpJson(sendData);
//      sendData: ExamWriteJsonToDbData 参照
//=
contextBridge.exposeInMainWorld(
  'unipyapi',                     // 汎用API, apiKey string - window に API を注入するキー。 その API には window[apiKey] でアクセスできます
  {  
    dumpJson: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_dump_json.py', sendData : sendData });   // write to tmp 
      return result;   
    },
    writeJsonFile: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_write_json.py', sendData : sendData });  //
      return result;   
    },
    readJsonFile: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_read_json.py', sendData : sendData });
      return result;   
    },
    readSvgFile: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_read_svg.py', sendData : sendData });
      return result;   
    },
    writeSvgFile: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_write_svg.py', sendData : sendData });
      return result;   
    },
    pdf2Svg: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_pdf2svg.py', sendData : sendData });
      return result;   
    },
    pnmBmp2Svg: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_pnmbmp2svg.py', sendData : sendData });
      return result;   
    },
    img2Svg: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_img2svg.py', sendData : sendData });
      return result;   
    },
    writeTextFile: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_write_text.py', sendData : sendData });
      return result;   
    },
    writeCipherTextFile: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_write_cipher_text.py', sendData : sendData });
      return result;   
    },
    readTextFile: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_read_text.py', sendData : sendData });
      return result;   
    },
    readCipherTextFile: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_read_cipher_text.py', sendData : sendData });
      return result;   
    },
    rwSqlContent: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_sql_content.py', sendData : sendData });
      return result;   
    },
    writeAssetsFile: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_write_assets.py', sendData : sendData });
      return result;   
    },
    writeAssetsSvgFile: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_write_svg_assets.py', sendData : sendData });
      return result;   
    },
    makeTiptapContent: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_make_tiptap_content.py', sendData : sendData });
      return result;   
    },

    // BEGIN SYS-MST --------------------------------------------------------------------------------->
    rwSysMaster: async (sendData) => {
      var result = await asyncPyJsonIO({ py_script: 'pysrc/uni_sys_master.py', sendData : sendData });
      return result;   
    },  
    // END SYS-MST <---------------------------------------------------------------------------------
  })



//= プリロード (隔離ワールド)
//  分離されたコンテキスト間に、安全、双方向で同期されたブリッジを作成します
//  preload スクリプトは "隔離ワールド" で実行されます
//  プロセス: Renderer
//  使い方:
//    await window.sysapi.printWinContentsToPdf(pdfname);  ※ 戻り値がありません
//=
contextBridge.exposeInMainWorld('sysapi', {
  //= 操作結果受信 API
  //  参考：background.ts 送信側の実装
  //        event.sender.send('wrote-pdf', { pdfPath: outputPath, exit_code: 0, result: "OK" });
  //  このAPIは、レンダラープロセスに、wrote-pdf 結果を受け取れるようにするためのものです。
  //  レンダラープロセス側で、以下のように実装して下さい
  //    await window.sysapi.receive('wrote-pdf', (...args) => {
  //      console.log('  args: ' + JSON.stringify(args)); //　args: [{"pdfPath":"～\\exam2023.pdf","exit_code":0,"result":"OK"}]
  //=
  receive: (channel, func) => {               // レンダラー受信 ← Main
    let validChannels = ['wrote-pdf'];        // whitelist channels
    if (validChannels.includes(channel)) {
      console.log(`PRELOAD receiving ${channel} ...`);
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    } else {
      console.log(`PRELOAD receive: ${channel} is not valid`);
    }
  },

  printWinContentsToPdf: async (
    pdfPath,  // string of pdf path-name
    options   // null | object of printToPDF options
  ) => {        
    //= 
    //  ipcRendererを使用してメインプロセスにPDF作成のリクエストを送り、
    //    メインプロセス側でウィンドウオブジェクトを取得してPDF作成を行うようにする。
    //      メインプロセス側のbackground.tsで、以下のようにprint-win-pdfイベントを受け取ってPDFを作成します。
    //  pdfPath は レンダラープロセスから渡されるものです。
    //    【注意】win は pdfPath のようにされることが出来ません（ipcRenderer.invoke() 内部で win が変換されないため）。
    //             セキュリティ上の理由から、メインプロセスとレンダラープロセス間でウィンドウオブジェクトを直接渡すことはできません。       
    //=
    console.log(`printWinContentsToPdf: ${pdfPath}, options: ${options}`);
    ipcRenderer.send('print-win-pdf', pdfPath, options);
  },
  
  printFileOrTextToPdf: async (
    filePathname,   // string of .html .svg path-name  | 拡張子のみ（テキストコンテンツ使用）
    textContents,   // string, 出力元のテキストコンテンツ    
    pdfPath,        // null = html/svg と同じ場所 | "" = Desktop | path-name
    winSpecs,       // null | object of window
    options,        // null | object of printToPDF options
  ) => {     
    console.log(`printFileOrTextToPdf: ${filePathname}, ${pdfPath}, ${winSpecs}, ${options}`);   
    ipcRenderer.send('print-to-pdf', filePathname, textContents, pdfPath, winSpecs, options);
  },

  testPythonVersion: () => {
    return new Promise((resolve, reject) => {
      const result = {};
      const { spawn } = require('child_process');
      const py = spawn('python', ['--version']);
  
      py.stdout.on('data', function(data) {
        console.log('stdout: ' + data.toString());
        result["stdout"] = data.toString();
      });
  
      py.stderr.on('data', function(data) {
        console.log('stderr: ' + data.toString());
        result["stderr"] = data.toString();
      });
  
      py.on('exit', function(code) {
        console.log('child process exited with code ' + code.toString());
        result["exit_code"] = code.toString();
        resolve(result);
      });
  
      py.on('error', function(err) {
        reject(err);
      });
    });
  },

  testPipVersion: () => {
    return new Promise((resolve, reject) => {
      const result = {};
      const { spawn } = require('child_process');
      const py = spawn('pip', ['-V']);
  
      py.stdout.on('data', function(data) {
        console.log('stdout: ' + data.toString());
        result["stdout"] = data.toString();
      });
  
      py.stderr.on('data', function(data) {
        console.log('stderr: ' + data.toString());
        result["stderr"] = data.toString();
      });
  
      py.on('exit', function(code) {
        console.log('child process exited with code ' + code.toString());
        result["exit_code"] = code.toString();
        resolve(result);
      });
  
      py.on('error', function(err) {
        reject(err);
      });
    });
  },

  pipInstall: (pkgs) => {
    return new Promise((resolve, reject) => {
      let pip_pkgs = pkgs.split(" ");
      let cmdArgs = ['install'].concat(pip_pkgs).concat(['--upgrade']);
      console.log(cmdArgs);

      const result = { stdout: "", stderr: "", exit_code: "", "error": ""};

      const { spawn } = require('child_process');
      const py = spawn('pip', cmdArgs);
  
      py.stdout.on('data', function(data) {
        console.log('stdout: ' + data.toString());
        result["stdout"] += data.toString();
      });
  
      py.stderr.on('data', function(data) {
        console.log('stderr: ' + data.toString());
        result["stderr"] += data.toString();
      });
  
      py.on('exit', function(code) {
        console.log('child process exited with code ' + code.toString());
        result["exit_code"] = code.toString();
        resolve(result);
      });
  
      py.on('error', function (err) {
        // result["rror"] += err.toString();
        reject(err);
      });
    });
  },   

  pipTestPkgs: (pkgs) => {
    return new Promise((resolve, reject) => {
      let pip_pkgs = pkgs.split(" ");
      let cmdArgs = ['show'].concat(pip_pkgs);
      console.log(cmdArgs);

      const result = { stdout: "", stderr: "", exit_code: "", "error": ""};

      const { spawn } = require('child_process');
      const py = spawn('pip', cmdArgs);
  
      py.stdout.on('data', function(data) {
        console.log('stdout: ' + data.toString());
        result["stdout"] += data.toString();
      });
  
      py.stderr.on('data', function(data) {
        console.log('stderr: ' + data.toString());
        result["stderr"] += data.toString();
      });
  
      py.on('exit', function(code) {
        console.log('child process exited with code ' + code.toString());
        result["exit_code"] = code.toString();
        resolve(result);
      });
  
      py.on('error', function (err) {
        // result["rror"] += err.toString();
        reject(err);
      });
    });
  },


  makePysrc: () => {
    return new Promise((resolve, reject) => {
      console.log(`makePysrc: process.env.NODE_ENV: ${process.env.NODE_ENV}`);

      const result = {};

      if (process.env.NODE_ENV === 'development') {
        console.log("  do nothing");
        result["stdout"] = "do nothing";
        return result;
      }

      const { spawn } = require('child_process');
  
      console.log(`makePysrc: process.env.NODE_ENV: ${process.env.NODE_ENV}`);

      const app_dir = __dirname.split(path.sep).filter((v) => v).slice(0, -1).join(path.sep); // app_dir: ~\resources
      console.log(`app_dir: ${app_dir}`);

      //実際 path は resources\app.asar.unpacked\pysrc となっているので、path.join で結合し、pysrc　を作成する
      const pysrc_dir = path.join(app_dir, 'app.asar.unpacked', 'pysrc');
      
      const py = spawn('cmd.exe', ['/c', 'ren', '*.py_', '*.py'], { cwd: pysrc_dir });
  
      py.stdout.on('data', function(data) {
        console.log('stdout: ' + data.toString());
        result["stdout"] = data.toString();
      });
  
      py.stderr.on('data', function(data) {
        console.log('stderr: ' + data.toString());
        result["stderr"] = data.toString();
      });
  
      py.on('exit', function(code) {
        console.log('child process exited with code ' + code.toString());
        result["exit_code"] = code.toString();
        resolve(result);
      });
  
      py.on('error', function(err) {
        reject(err);
      });
    });

    // console.log(`BBBBBBBB After do ${py_script}:`);
    result["success"] = success;
    result["err"] = err;
    result["readed_data"] = receivedData;

    return result;  
  },


})

/** sysapi.printWinContentsToPdf について議論
Q. EditHtmlFrame.vue の child div をPDF化したいの時、直接指定できないという認識合っていますか
A.
  はい、その認識は正確です。ElectronのwebContents.printToPDF({})メソッドは、特定のウィンドウ（またはウェブコンテンツ）全体をPDFに変換します。
  特定のDOM要素（この場合はEditHtmlFrame.vueの子div）だけを直接PDFに変換することはできません。

  特定のDOM要素だけをPDFに変換するには、一般的には以下のような手順を踏む必要があります：

  1. 必要なDOM要素だけを含む新しいHTMLページを作成します（他の要素は削除または非表示にします）。
  2. その新しいページを新しいウィンドウまたはオフスクリーンレンダラーで開きます。
  3. そのウィンドウまたはオフスクリーンレンダラーのwebContents.printToPDF({})を呼び出してPDFを作成します。

  このような手順は複雑で、パフォーマンスに影響を与える可能性があります。そのため、可能であればPDF作成の前に表示内容を適切に設定することをお勧めします。
  例えば、PDFに含めたい要素だけを表示し、それ以外の要素は非表示にするなどです。
 */

// alert("It Worked!") // Remove this line once you confirm it worked