//= main.ts | index.ts 【画面側】
//  your app's entry file (for Electron's render process)
//=

import {
  computed,
  createApp,
  reactive, ref, watch
} from 'vue'

//= 2024.01.11a お試し リモート vuetifyjs.com material-design-icons 解消 
//  以下、yarn add & import しか行っていない（必要に応じて、vuetify 修正等を行って下さい）
//-
// import VueMaterial from 'vue-material'                // yarn add vue-material
// import 'vue-material/dist/vue-material.min.css'       // yarn add vue-material-design-icons
// import 'vue-material/dist/theme/default.css'
// import 'vue-material-design-icons/styles.css'         // !! required

// import '@mdi/font/css/materialdesignicons.css'        // !! required yarn add @mdi/font
// import "@fortawesome/fontawesome-free/css/all.css";   // yarn add @fortawesome/fontawesome-free

// import { mdiAccount } from '@mdi/js'               // 個別に import する場合


import App from './App.vue'

import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { interpret } from 'xstate';
import { mainMachine } from './components/mainFsmMachine';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid')

//= TODO
//  ここで投入すると vuetify サンプル画面のリンクが Blue で表示されない
// import './assets/tailwind.css'

//= TODO ?
// loadFonts()


//= pinia
//  Create a pinia instance (the root store)
//  参考: 
//    https://prazdevs.github.io/pinia-plugin-persistedstate/guide/
//=
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)


const app = createApp(App, 
  {
    // provide: {
    //   window : window
    // }
})

console.log(`$$$$$$$$ process.env: \n${JSON.stringify(process.env, null, 2)}`);  // NODE_ENV := development | production, BASE_URL, IS_ELECTRON := true | false
const developMode = ref(process.env.NODE_ENV == "development");  // 2024.01.05a 
app.provide('developMode', developMode);

app.provide('gViewBox', { // TODO viewBox, foreignObject, 最初、User に指定させる
  x : 0,
  y : 0,
  w : 10240,
  h : 7680,
})

const gFixedEditor = reactive({ // 固定的表示領域 TODO Drag でサイズ調整できるようにする
  w : 1200,
  h : 1172,
})
const updateGFixedEditor = (w: number, h: number) => { // 固定的表示領域
  gFixedEditor.w = w;
  gFixedEditor.h = h;
}
app.provide('gFixedEditor', gFixedEditor)
app.provide('updateGFixedEditor', updateGFixedEditor)

//= Interpret the machine and store it in data
const fsmService = interpret(mainMachine);

//= 各自のコンポーネントで、fsmService.send('EVENT') で、状態遷移させるように
app.provide('fsmService', fsmService);  

// ↓↓↓↓ TODO FSM-MACHINE に移行する ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// BEGIN DEPRECATED
//= TODO fsmMachine.developing へ移行中 【試し】当 SvgEditor 開発時のみ、デバッグ用に true にする
const isDevModeRef = ref(false);          // 2024.01.05a default: false に変更
app.provide('isDevModeRef', isDevModeRef)

//= Preview | Edit Mode
// TODO fsmMachine.operating? へ移行中: Preview | Edit Mode
const isPreviewModeRef = ref(false);  // !!
const updatePreviewMode = (md: boolean) => {
  isPreviewModeRef.value = md;
}
app.provide('isPreviewModeRef', isPreviewModeRef);
app.provide('updatePreviewMode', updatePreviewMode);
// END DEPRECATED
// ↑↑↑↑ TODO FSM-MACHINE に移行する ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const domUuidDB = {};   // uuid => { elem_ref, com_type, drag_able, ... }

const upsertDomUuid = (uuid: string, elem_dscr: any) => {
  domUuidDB[ uuid ] = elem_dscr;
  domUuidDB[ uuid ]['deleted'] = false;
  domUuidDB[ uuid ]['uuid'] = uuid;
}

const deleteDomUuid = (uuid: string, hardDelete = false) => {
  if (hardDelete) {
    delete domUuidDB[ uuid ];
  } else {
    domUuidDB[ uuid ]['deleted'] = true;
  }
  
  // TODO editingObjRef の更新
}

app.provide('domUuidDB', domUuidDB);
app.provide('upsertDomUuid', upsertDomUuid);
app.provide('deleteDomUuid', deleteDomUuid);


//= 2023.11.11
const appSpecRef = ref({  // read-only
  "app_name"        : "BitEditor",
  "app_version"     : "1.0.0",
  "app_uuid"        : "78b24889-7489-4382-afd7-a56984896905",
  "app_url"         : "http://localhost:8080",
  "app_desc"        : "Bitwaves BitEditor",
  "app_author"      : "nakano-h@dskllc.co.jp",
  "app_license"     : "shareware",              // 2024.02.01a shareware | freeware | donationware | adware | commercial | other    
  "app_license_url" : "",
  "app_logo"        : "",
  "app_about_url"   : "",
});
app.provide('appSpecRef', appSpecRef);

//= 立案中
//
//=
const userCfgRef = ref({
  serial_no           : "",       // TODO 暗号化
  licence_type        : "",       // 
  licence_id          : "",       // TODO 暗号化, alais license user
  licence_pwd         : "",       // TODO 暗号化
  licence_stat        : "free",   // フリー | お試し | （無料）許可 | 認証済 | (other)
  licence_expire      : "",       //
  online_stat         : false,    // !! online 可 | その都度確認 | online 不可（但し、licence 認証可）| offline 不可（licence 認証も不可）
  ad_type             : "",       // !! AD 可 | AD 不可
  openai_api_key      : "",       // TODO
  openai_api_enable   : false,    // TODO
  openai_api_info     : "",       // 保留: stat, expire etc.
  tiptap_ai_key       : "",       // TODO
  tiptap_ai_enable    : false,    // TODO
  gmail_addr          : "",       // TODO
  gmail_pwd           : "",       // TODO
});
app.provide('userCfgRef', userCfgRef);

const dbgAuthDB = false;  // !! true: Debug（開発中, use postgres） | false: 本番（use sqlite）
app.provide('dbgAuthDB', dbgAuthDB);

const authStatRef = ref(false);   // 認証済み？
app.provide('authStatRef', authStatRef);

//= DB 接続情報 := pinia-plugin-persistedstate にて、永続化記憶されている
//  1. DB 接続情報を変更した時: store に 記憶 させる
//    create DB も忘れずに
//  2. DB SvgEditor, SvgViewer が Mount した時: store から 取り出す
//  参照：uni_sql_base.py DB_CON_STR （2023.11.30 現在）
//=
const dbCfgRef = ref({            // DB 設定, 初期値は、db_cfg.ts に記載されている（以下、参考に過ぎない）
  "db_type": "sqlite",            // postgresql | sqlite

  "db_host": "localhost",         // postgresql | 未定義
  "db_port": "5432",
  "db_name": "",
  "db_user": "postgres",
  "db_pass": "",
  "admin_db_name": "postgres",
  "admin_db_user": "postgres",
  "admin_db_pass": "",

  //= sqlite のみ
  // "db_path": "C:\\local\\bitwaves\\db\\bitwaves.db", // absolute path
  "db_path": "mylitedb",                                // 2024.02.01a shareware 対応: 相対 path 文字列を変更した
});
const dbConRef = ref("");             // DB 接続情報 e.g: 'postgresql://postgres:postgres@localhost:5432/bitwaves'
const dbAdminConRef = ref("");        // 管理者 DB 接続情報 e.g: 'postgresql://postgres:postgres@localhost:5432/postgres'
    
app.provide('dbCfgRef', dbCfgRef);
app.provide('dbConRef', dbConRef);
app.provide('dbAdminConRef', dbAdminConRef);


//= Offline-認証 Database
//  1. .py Offline 認証 機能を実装する
//  2. Offline 認証 Database { sn, auth-key, license-type } がソフトウェアの一部としてリリースされる
//       ※1 販売時、sn, auth-key, license-type を別途購入者に送付する
//       ※2 購入者は、sn, auth-key を入力し、認証を行い、その結果を store に記憶させる（一回だけ認証）
//       ※3 Online 認証 へ移行を予定している
//  3. 当 Database データを生成するソースコードは、git 別 branch に格納し、外へ漏れないようにする
//=
const dbSysConStr = "sqlite:///pysrc\\bitwaves.sys";  // System DB 接続情報, 定数
app.provide('dbSysConStr', dbSysConStr);


//=  App 設定, DB に記憶させる考え
//  1. App 設定を変更した時、DB に Save する
//  2.  DB SvgEditor, SvgViewer が Mount した時、DB から Load する
//=
const appCfgRef = ref({
  "sys_path"          : "C:\\workspace\\bitwaves",            // installed dir
  "doc_dir"           : "C:\\local\\bitwaves\\docs",          // .svg, .html etc.
  "inkscape_bin_dir"  : "C:\\Program Files\\Inkscape\\bin",   // 実行エラー ⇒ 環境変数 path の設定した前提で実行すること
  "inkscape_bin_file" : "inkscape.exe",
  "data_dir"          : "undefined",  // （保留）data files
  "var_dir"           : "undefined",  // （保留）temp files
  "tmp_dir"           : "undefined",  // （保留）temp files
  "log_dir"           : "undefined",  // （保留）log files
  "log_level"         : "undefined",  // （保留）log level
  
  //= 実コンテンツの background-color（個別指定されない時）
  //  2023.12.16a 参照: EditHtmlFrame htmsvg_outer_ref 「初期値について」メモ
  //= 
  "back_color"        : "rgba(255, 255, 255, 1.0)", // 2023.12.16a Editorの背景色 rgba format が 必要（picker に設定するため）
  "front_color"       : "rgba(0, 0, 0, 1.0)",       // 2023.12.16a Editorの前景色
});
app.provide('appCfgRef', appCfgRef);


//= 
//  2023.11.19z
//    familyId ← familyIdRef ※ EditSvgRect uuid 消える障害対策
//  2023.11.10
//    editingObjRef は、MoveAble が含まれた SvgEditor や EditHtmlElem の com_type が設定されているため、Left Panel の表示切り替えには使いにくい
//    そこで、actingEditRef を導入する
//=
const actingEditRef = ref({
  com_type    : "",   // component type, 例: 'edit_html_frame'
  uuid        : "",   // component のキー
  familyId    : "",   // component の familyIdRef.value を与えて下さい ※ value であり、ref ではない 2023.11.19z
});
app.provide('actingEditRef', actingEditRef);

//= 2023.11.10
//  Add Layout のような button Event
//=
const actingEditEventRef = ref({
  com_type    : "",   // component type, 例: 'edit_html_frame'
  uuid        : "",   // component save/load のキー
  cate        : "",   // "able" | "add" | _
  event       : "",   // cmenuItems.id
  time        : 0,    // Time-Stame（↑同じ値が作成され検出出来ないことを防ぐため）
});
app.provide('actingEditEventRef', actingEditEventRef);


//= 2023.11.10
//  color picker
//=
const colorPickerRef = ref({
  name        : "",   // "front" | "back" | _
  color       : "",   // 
  time        : 0,    // Time-Stame（↑同じ値が作成され検出出来ないことを防ぐため）
});
app.provide('colorPickerRef', colorPickerRef);

//= (is actived? と言う ※厳密に違うため、actived 単語を避ける方が無難)編集中 Object の { uuid, comtype } を記憶する
//  関連： fsmMachine.editing
const editingObjRef = ref({
  com_type    : "",   // component type, 例: 'editor'
  uuid        : "",   // !! component save/load のキー, 例: 'root'
  editing_id  : "",   // !! is editing := [ uuid, editing_id ] MATCHING, 例: [ 'root', 'editor_moveable' ] | [ 'root', 'editor_infiniteviewer' ]
  url         : "",   // O.P.T. url := sub-obj の url, 例: 'moveable_div'
  state       : "",   // O.P.T. 例 DragAbleIng
  caused_by   : "",   // O.P.T. 例 onMoveableClicked
}); 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateEditingObj = (editing: any) => {
  console.log('*** updateEditingObj( ' + JSON.stringify(editing) + ' )');
  editingObjRef.value = editing;

  //= 【廃止】下記のコードは、domUuidDB が更新される前に実行されるため、正しく動作しないため、廃止 2023/06/27
  // if (domUuidDB[ editing.uuid ]) {
  //   editingObjRef.value['elem_desc'] = domUuidDB[ editing.uuid ];
  // } else {
  //   editingObjRef.value['elem_desc'] = {};
  // }
}

app.provide('editingObjRef', editingObjRef);
app.provide('updateEditingObj', updateEditingObj);

const boundingEditing_ref = ref(null);   // reactive
const updateBoundingEditing = (bounding: any) => {
  boundingEditing_ref.value = bounding;
}
app.provide('boundingEditing_ref', boundingEditing_ref);
app.provide('updateBoundingEditing', updateBoundingEditing);

const mouseOveringRef = ref({ uuid : "", com_type : "", url : "" });  // 'root_editsvg', url := sub-obj の url
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateMouseOvering = (mouseOvering: any) => {
  mouseOveringRef.value = mouseOvering;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const clearMouseOvering = (mouseOvering: any) => {
  if ((mouseOveringRef.value.uuid == mouseOvering.uuid) && (mouseOveringRef.value.url == mouseOvering.url)) {
    mouseOveringRef.value = { uuid : "", com_type : "", url : "" };
  }
}
app.provide('mouseOveringRef', mouseOveringRef);
app.provide('updateMouseOvering', updateMouseOvering);
app.provide('clearMouseOvering', clearMouseOvering);

//= cmd: { editCmdRef,  editCmdParasRef }
// 2022.11.01 版： 子コンポーネントの add-edit-svg 呼び出すの代り、cmd をセットし、actived obj が自ら
// その cmd を実行するようにする。
// TODO provide cmd result
const editCmdRef = ref( { "cmd" : "", "id" : "" } );                    // { cmd := addSvg | _ , ... }; Left-Panel Add-Button で指定されたコマンド Etc.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateEditCmd = (cmdDc: any) => {         // cmd を発行する関数
  for (const [key, value] of Object.entries(cmdDc)) {
    if (key == 'cmd') {
      editCmdRef.value = { 
        "cmd" : value as string, 
        "id" : uuid.v4() 
      };
    } else {
      editCmdParasRef.value[key] = value;
    }
  }

  console.log("updateEditCmd editCmdRef: " + JSON.stringify(editCmdRef.value));
  console.log("  ⇒editCmdParas : " + JSON.stringify(editCmdParasRef.value));
}

app.provide('editCmdRef', editCmdRef);
app.provide('updateEditCmd', updateEditCmd);

const editCmdParasRef = ref( {                    // （例）Left-Panel Add-Button で指定されたコマンドのパラメーター
  src_type    : "edit_svg",                       // 【予約元】edit_svg, edit_html, edit_text etc.
  src_uuid    : "root_editsvg",                   // 【予約元】
  src_seltor  : {},                               // 【予約元】click, onMounted
  event       : "init",                           // 【予約元】'click' | 'onMounted' | 'init'
  x : 0, y : 0, parent_x : 0, parent_y : 0,       // 【予約元】
} ); 

const initialEditCmdParas = (src_type: string, src_uuid: string, etype: string, parent_x: number, parent_y: number, x: number, y:number, src_seltor = {}) => {
  console.log(src_type + ' ' + src_uuid + " initialEditCmdParas: e.type " + etype + " x: " + x + " y: " + y  + " parent_x: " + parent_x + " parent_y: " + parent_y + " src_seltor: " + JSON.stringify(src_seltor));
  
  if ((etype == 'click') || (etype == 'onMounted') || (etype == 'mouseIn')) {
    editCmdParasRef.value = { src_type : src_type, src_uuid : src_uuid, src_seltor : src_seltor, event : etype, x: x, y: y, parent_x: parent_x, parent_y: parent_y };
    console.log("  ⇒ WRITED editCmdParas : " + JSON.stringify(editCmdParasRef.value));
  } else {
    console.log("  ⇒ NOT WRITE ditCmdParas because of etype: " + etype);
  }
}

app.provide('editCmdParasRef', editCmdParasRef);        // EditSvg, EditHtmlTag はコマンドのパラメーターを一時的記憶する
app.provide('initialEditCmdParas', initialEditCmdParas);  // なので、EditSvg, EditHtmlTag 以外のコンポーネントからは、使わない

// //= corlor Selector
// //  想定する使い方
// //    Rectangle Outlile Cliek              => Picker Color             => Rectangle 自ら Apply Color
// //      := updateColorSelSource(_, true),      := updateSeltedColor()       := reactive in Rectangle
// const colorSeltorRef = ref( { 
//   color : 'blue',           // color-name | RGB | RGBA
//   waiting : false,          // true: color 適用待ち（picked ～ applyed） | false: 空（color 値は使用済なので、そのまま再適用不可）
//   source: 'common',         // 予約の者, common := 先着順、1回誰でも使える | uuid + α 
// } );
// const updateSeltedColor = (color: string) => {
//   colorSeltorRef.value.color    = color;
//   colorSeltorRef.value.waiting  = true;
// }
// const updateColorSelSource = (source: string, reset: boolean) => {
//   colorSeltorRef.value.source   = source;
//   if (reset) {
//     colorSeltorRef.value.waiting = false;
//   }
// }
// const resetColorSeltor = () => {
//   colorSeltorRef.value.waiting = false;
// }
// app.provide('colorSeltorRef', colorSeltorRef);
// app.provide('updateSeltedColor', updateSeltedColor);
// app.provide('updateColorSelSource', updateColorSelSource);
// app.provide('resetColorSeltor', resetColorSeltor);

const SquareSize    =  0;   // 【廃止】制御四角のサイズ
app.provide('SquareSize', SquareSize);

const defSvgWidth   = 800;  // 例え、EditSvg, これを初期サイズとして設定してあげる
const defSvgHeight  = 600;  // 例え、EditSvg, これを初期サイズとして設定してあげる
app.provide('defSvgWidth', defSvgWidth);
app.provide('defSvgHeight', defSvgHeight);

const editorCanvasPosX = ref(32); // 2021.10.31 追加
const editorCanvasPosY = ref(24); // 2021.10.31 追加 
const updateEditorCanvasPos = (x: number, y: number) => {
  editorCanvasPosX.value = x;
  editorCanvasPosY.value = y;
}
app.provide('editorCanvasPosX', editorCanvasPosX);
app.provide('editorCanvasPosY', editorCanvasPosY);
app.provide('updateEditorCanvasPos', updateEditorCanvasPos);


//= BEGIN 見える！ 待ち受けシステム
const genInId    = ref('');                         // gS := 待ち受け ID
const genInDataA = ref('');                         // gA := 期待の動作・入力指示メッセージ
const genInHintS = ref('');                         // gS Hint
const genInHintA = ref('');                         // gA Hint
const updateGenInDataA = (data: any, gsId: any = undefined, hintS: any = "汎用記憶 gS", hintA: any = "汎用記憶 gA") => {
  genInDataA.value = data;
  if (gsId == undefined) {
    genInId.value = '';     // gsId が指定されない場合は、gS をクリアする（動作なし等時）
  } else {
    genInId.value = gsId;
  }
  genInHintS.value = hintS;
  genInHintA.value = hintA;
}

app.provide('genInId', genInId);
app.provide('genInDataA', genInDataA);
app.provide('genInHintS', genInHintS);
app.provide('genInHintA', genInHintA);
app.provide('updateGenInDataA', updateGenInDataA);

const genInDataB = ref('');                         // gB
const genInHintB = ref('');                         // gB Hint
const updateGenInDataB = (data: any, hint: any = "汎用記憶 gB") => {
  if (!(data == undefined)) {
    genInDataB.value = data;
  }
  genInHintB.value = hint;
}
app.provide('genInDataB', genInDataB);
app.provide('genInHintB', genInHintB);
app.provide('updateGenInDataB', updateGenInDataB);

const genInDataC = ref('');                         // gC
const genInHintC = ref('');                         // gC Hint
const updateGenInDataC = (data: any, hint: any = "汎用記憶 gC") => {
  if (!(data == undefined)) {
    genInDataC.value = data;
  }
  genInHintC.value = hint;
}
app.provide('genInDataC', genInDataC);
app.provide('genInHintC', genInHintC);
app.provide('updateGenInDataC', updateGenInDataC);
//= END 見える！ 待ち受けシステム

const vueExtProps = {};
app.provide('vueExtProps', vueExtProps);


//= ms, 2023.12.11c 特別対策 load record 障害 when triggered by req_mod_uuid
const DelayMSecWakeUp = { low: 250, middle: 1000, high: 2500, highest: 10000 }; // !! お試し値
app.provide('DelayMSecWakeUp', DelayMSecWakeUp);


//= BEGIN mini-float-editor --------------------------------------------------------------------->
const fmini_content_ref   = ref("");  // [inout] miniEditorCompiled
const fmini_stat_ref      = ref("");  // [inout]  "" := idle | "busy" | "finish"
const floatMinieditorRef  = ref({
  uid             : "",     // [out]
  node_type       : "",     // [in]     node.type, "zCode"
  data_type       : "",     // [in]     node.attrs.data-type, "my-z-code-node"
  src             : "",     // [inout]  node.attrs.miniEditorLangSrc, "const foo = 0"
})


const startupFloatMinieditor = (
  node_type,    // [in]     node.type, "zCode"
  data_type,    // [in]     node.attrs.data-type, "my-z-code-node"
  src,          // [inout]  node.attrs.miniEditorLangSrc, "const foo = 0"
) => {
  console.log("$$$$ startupFloatMinieditor on state: " + fmini_stat_ref.value);
  console.log("  node_type: " + node_type);
  console.log("  data_type: " + data_type);
  console.log("  src: " + src);

  if (fmini_stat_ref.value != "") {
    console.log("  !! busy: Already started");
    return;
  }

  fmini_stat_ref.value = "busy";
  floatMinieditorRef.value.uid = uuid.v4();
  floatMinieditorRef.value.node_type = node_type;
  floatMinieditorRef.value.data_type = data_type;
  floatMinieditorRef.value.src = src;
  fmini_content_ref.value = "";

  console.log("  uid: " + floatMinieditorRef.value.uid);
  console.log("  node_type: " + floatMinieditorRef.value.node_type);
  console.log("  data_type: " + floatMinieditorRef.value.data_type);
  return floatMinieditorRef.value.uid;
}


const showFloatMinieditor = (   // debug ための実装
  // node_type,    // [in]     node.type, "zCode"
  // data_type,    // [in]     node.attrs.data-type, "my-z-code-node"
  // src,          // [inout]  node.attrs.miniEditorLangSrc, "const foo = 0"
) => {
  console.log("$$$$ showFloatMinieditor");  
  // TODO
}

const hideFloatMinieditor = (   // debug ための実装
  // node_type,    // [in]     node.type, "zCode"
  // data_type,    // [in]     node.attrs.data-type, "my-z-code-node"
  // src,          // [inout]  node.attrs.miniEditorLangSrc, "const foo = 0"
) => {
  console.log("$$$$ hideFloatMinieditor");
  // TODO
}


const cancelFloatMinieditor = (
  // node_type,    // [in]     node.type, "zCode"
  // data_type,    // [in]     node.attrs.data-type, "my-z-code-node"
  // src,          // [inout]  node.attrs.miniEditorLangSrc, "const foo = 0"   
) => {
  console.log("$$$$ cancelFloatMinieditor");
    fmini_stat_ref.value = "";
}


const finishFloatMinieditor = (
  // node_type,    // [in]     node.type, "zCode"
  // data_type,    // [in]     node.attrs.data-type, "my-z-code-node"
  // src,          // [inout]  node.attrs.miniEditorLangSrc, "const foo = 0"
) => {
  console.log("$$$$ finishFloatMinieditor");
    fmini_stat_ref.value = "finish";
}

const testFloatMinieditor = (   // is busy?
  // node_type,    // [in]     node.type, "zCode"
  // data_type,    // [in]     node.attrs.data-type, "my-z-code-node"
  // src,          // [inout]  node.attrs.miniEditorLangSrc, "const foo = 0"
) => {
  console.log("$$$$ testFloatMinieditor");
  // TODO
}

app.provide('fmini_content_ref', fmini_content_ref);
app.provide('fmini_stat_ref', fmini_stat_ref);
app.provide('floatMinieditorRef', floatMinieditorRef);
app.provide('startupFloatMinieditor', startupFloatMinieditor);
app.provide('testFloatMinieditor', testFloatMinieditor);
app.provide('showFloatMinieditor', showFloatMinieditor);
app.provide('hideFloatMinieditor', hideFloatMinieditor);
app.provide('cancelFloatMinieditor', cancelFloatMinieditor);
app.provide('finishFloatMinieditor', finishFloatMinieditor);

//= END mini-float-editor -----------------------------------------------------------------------<


function onMathJaxReady() {
  const el = document.getElementById("elementId");
  renderByMathjax(el);
}

initMathJax({}, onMathJaxReady);


//= TODO 设置 vue对象的 prototype
//  vue2 書き方
//    const MathLive = require('MathLive')
//    Vue.prototype.$MathLive = MathLive
//=
// import * as MathLive from "https://unpkg.com/mathlive/dist/mathlive.mjs";
import * as MathLive from 'mathlive/dist/mathlive';
app.config.globalProperties.$MathLive = MathLive;                                         // TODO 使い方は不明です
console.log("$$$$$ MathLive is:" + MathLive);                                             // $$$$$ MathLive is:[object Module]
console.log("  MathLive.renderMathInDocument is: " + MathLive.renderMathInDocument);      // 少々 test it
app.provide('MathLive', MathLive);                                                        // !! OK

// import MathfieldComponent from "https://unpkg.com/mathlive/dist/vue-mathlive.mjs";
import MathfieldComponent from 'mathlive/dist/vue-mathlive.mjs';
app.config.globalProperties.$MathfieldComponent = MathfieldComponent;
console.log("$$$$$ MathfieldComponent is:" + MathfieldComponent);  
app.provide('MathfieldComponent', MathfieldComponent);                                    // !! OK

//= plugin
// pass instances to the app as a plugin
//=
app.use(router)
  .use(store)
  .use(vuetify)
  .use(pinia)     // Piniaを有効化します

app.use(
  MathfieldComponent,
  MathLive                                                                              // TODO 使い方は不明です
);

//= vatex ※ Vue3 Mathlive View Component 内表示には必要（2023.12.20 現在、vatex なければ表示されない ※）
//  install: yarn add vatex katex
//  参考:
//    https://github.com/Shimada666/VaTex
//    https://zhuanlan.zhihu.com/p/381788915
//  ※ VueLatex は明示的に使っていないのに、必要なのか？
//  2023.12.20 vatex は古いが、yarn run electron:build はできているので、とりあえず、このまま ⇒時期は独自 component に移行するように
//=
import VueLatex from 'vatex'
import 'katex/dist/katex.min.css'; 
app.use(VueLatex);


import
  MathJax,
  {
    initMathJax,      // $$$$$ initMathJax is function e(e2, t2) {
    renderByMathjax   // $$$$$ renderByMathjax is function t(e2) {
  }
  from "mathjax-vue3";
// console.log("$$$$$ initMathJax is " + initMathJax);
// console.log("$$$$$ renderByMathjax is " + renderByMathjax); 

app.use(MathJax);   // 赤 になっていますが、必要ですし、動作もOKなので、取りあえずこのまま


//= https://github.com/justforuse/vue-mathjax-next
//  TODO お試し 2023.12.15a
//    index.js:1 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'Config')
//=
import VueMathjax from 'vue-mathjax-next';
app.use(VueMathjax)

app.mount('#app');

console.log("******* Start fsmService of mainMachine");
fsmService.start();


