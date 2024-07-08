<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
 <Suspense>

  <v-app class="app">
<!-- ↓↓↓↓ v-app 内 ↓↓↓↓<br> -->

    <v-main class="main">
<!-- ↓↓↓↓ v-main 内 ↓↓↓↓<br> -->

      <!-- BEGIN ↓↓↓↓ TODO useElementByPoint 実験 .................................................................... -->
      <div v-if="show_box_ElemByPt"
        :style="boxStyles"
        fixed
        pointer-events-none
        z-9999
        border="1 $vp-c-brand"
      />
      <div v-if="show_points_ElemByPt"
        :style="pointStyles"
        fixed
        top-0
        left-0
        pointer-events-none
        w-2
        h-2
        rounded-full
        bg-green-400
        shadow
        z-999
      />
      <!-- END ↑↑↑↑ TODO useElementByPoint 実験 .................................................................... -->


<!-- ↓↓↓↓ BEGIN nav ↓↓↓↓<br> -->
      <nav clsss="router_bar" v-show="showRouterBar">
        <router-link to="/svgeditor">Editor</router-link> |
        <router-link to="/svgviewer">SVG Viewer</router-link> |
        <router-link to="/config">Config</router-link> |
        <router-link to="/">Home</router-link>
      </nav>
<!-- ↑↑↑↑ END nav ↑↑↑↑<br> -->

<!-- ↓↓↓↓ BEGIN router-view ↓↓↓↓<br> -->
      <router-view />
<!-- ↑↑↑↑ END router-view ↑↑↑↑<br> -->

<!-- ↑↑↑↑ v-main 内 ↑↑↑↑<br> -->
    </v-main>

<!-- ↑↑↑↑ v-app 内 ↑↑↑↑<br> -->
  </v-app>

 </Suspense>  
</template>


<script setup lang="ts">
import {
  ref, provide, reactive, computed, h,
  inject, onBeforeUpdate, watch,
  onBeforeMount,
  onMounted, onBeforeUnmount, onUnmounted,
  nextTick,
} from "vue";

import { useElementBounding, useElementByPoint, useEventListener, 
    useMouse, onKeyStroke, 
} from '@vueuse/core'


import { Buffer } from 'buffer';
import { Base64 } from "js-base64";

import { dbCfgStore } from '@/store/db_cfg' // .ts は省略可
import { storeToRefs } from 'pinia'


const fsmService: any = inject('fsmService');
const editingObjRef = inject('editingObjRef');

const isPreferPage = ref(false);          // router で /prefer にアクセスしたかどうか
provide('isPreferPage', isPreferPage);

const developMode = inject('developMode') as any; // readonly process.env.NODE_ENV == "development"

const isDevModeRef: any = inject('isDevModeRef');         // r/w
const isPreviewModeRef: any = inject('isPreviewModeRef'); // r/w

const dbgAuthDB: any = inject('dbgAuthDB'); // true: Debug（開発中, use postgres） | false: 本番（use sqlite）
const dbSysConStr: any = inject("dbSysConStr");
const authStatRef: any = inject('authStatRef');

const appSpecRef: any = inject("appSpecRef");
const userCfgRef: any = inject("userCfgRef");
const dbCfgRef: any = inject("dbCfgRef");
const dbConRef: any = inject("dbConRef");
const dbAdminConRef: any = inject("dbAdminConRef");

const DelayMSecWakeUp: any = inject("DelayMSecWakeUp");

const appCfgRef: any = inject("appCfgRef");



fsmService.onTransition((state: any) => {
  isPreferPage.value = state.context.isPreferPage;

  // BEGIN DEPRECATED
  const svgEditor = state.value['svgEditor'];
  if (svgEditor != undefined) {
    isDevModeRef.value = svgEditor.si == 'develop' ? true : false;
    isPreviewModeRef.value = svgEditor.edit == 'preview' ? true : false;
  }
  // END DEPRECATED

  // 廃止 2023.11.29
  // if (state.context.isPreferPage) {
  //   if (showRouterBar.value) {
  //       showRouterBar.value = false;
  //       console.log('*** App.vue :: writed showRouterBar = ' + showRouterBar.value); // DEBUG
  //   }
  // }

  // console.log('*** App.vue :: fsmService.onTransition( history: ' + (state.history == undefined ? 'undefined' : JSON.stringify(state.history.value)) + ' value: ' + JSON.stringify(state.value)); // DEBUG
})


const showRouterBar = ref(true);
provide('showRouterBar', showRouterBar);

onKeyStroke('`', (e) => {
  console.log('` key pressed');
  if (showRouterBar.value) {
    if (isPreferPage.value) {
      showRouterBar.value = false;
      e.preventDefault();
    }
  } else {
    if (isPreferPage.value) { // TODO Debug 時以外は左記のコードを動作させない
      showRouterBar.value = true;
      e.preventDefault();
    }
  }
})



//= BEGIN TODO useElementByPoint 対象 Style ===============================>
const show_box_ElemByPt = ref(false);
const show_points_ElemByPt = ref(false);
const showElemByPoint = computed (() => show_box_ElemByPt.value || show_points_ElemByPt.value);

const { x, y } = useMouse({ type: 'client' });
const { element } = useElementByPoint({ x, y });
const bounding = reactive(useElementBounding(element));

useEventListener('scroll', bounding.update, true);  // ??

const boxStyles = computed(() => {
  if (element.value) {
    return {
      display: 'block',
      width: `${bounding.width}px`,
      height: `${bounding.height}px`,
      left: `${bounding.left}px`,
      top: `${bounding.top}px`,
      backgroundColor: '#3eaf7c44',
      transition: 'all 0.05s linear',
    } as Record<string, string | number>
  }
  return {
    display: 'none',
  }
})

const pointStyles = computed<Record<string, string | number>>(() => ({
  transform: `translate(calc(${x.value}px - 50%), calc(${y.value}px - 50%))`,
}))

watch(element, (el) => {
  if (showElemByPoint.value) {
    console.log('Point element changed to', el);        // !! 
  }
})

onKeyStroke('~', (e) => {
    e.preventDefault();
    show_box_ElemByPt.value = !show_box_ElemByPt.value;
})

onKeyStroke('!', (e) => {
    e.preventDefault();
    show_points_ElemByPt.value = !show_points_ElemByPt.value;
})

provide('show_box_ElemByPt', show_box_ElemByPt);
provide('show_points_ElemByPt', show_points_ElemByPt);
provide('x', x);
provide('y', y);
provide('element', element);
provide('bounding', bounding);


//= <=========================================== END TODO useElementByPoint 対象 Style


function onKeyDown(e) {
  console.log('#### onKeyDown: ', e.key);
  try {
    if (e.key == ',') {
      console.clear();
    }
    // else
    // {
    //   console.log(" 【未定義】");
    // }
  } catch (e) { // 【暫】別 component の入力なのに、↓動作している 誤動作対策
    console.log('  error: ');
    console.log(e);
  }
}


//= BEGIN 共通的な処理 ===========================================================>

const loadDbAppCfg = () => {
  //= pyshell にて DB から読み込む
  //  unipyapi.rwSqlContent を活かして DB から読み込む
  //=
  console.log("loadDbAppCfg");

  const item = {
    uuid: "app_cfg",
    com_type: "app_cfg",
    meta: {
    },
    content: {
    }
  };

  sql_load_appcfg(item);
}
provide('loadDbAppCfg', loadDbAppCfg);


async function sql_load_appcfg(item) {
  console.log("sql_load_appcfg");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: dbConRef.value,   // 2023.12.02
    sql_req: {
      'kind': 'content',
      'op': 'find',
    },
    content: content
  };

  const result = await window.unipyapi.rwSqlContent(sendData);
  // console.log("  result: " + JSON.stringify(result, null, 2));

  //= エラーチェック 2023/11/09 
  if (result["code"] != 0) {
    console.log("  result.code != 0");
    return;
  }

  if (!('readed_data' in result)) {
    console.log("  'readed_data' not in result");
    return;
  }

  if (result['readed_data']["exit_code"] != 0) {
    console.log("  result['readed_data']['exit_code'] != 0");
    return;
  }

  if (!("recordset" in result['readed_data'])) {
    console.log("  'recordset' not in result['readed_data']");
    return;
  }

  const base64Str = result['readed_data']['recordset']
  const normalStr = Base64.decode(base64Str)
  const recordset = JSON.parse(normalStr)
  // console.log("  recordset: " + JSON.stringify(recordset, null, 2));

  if (recordset.length == 0) {
    console.log("  recordset.length == 0");
    return;
  } else if (recordset.length > 1) {
    console.log("  recordset.length > 1");
    return;
  }

  const record = recordset[0];
  // console.log("  record: " + JSON.stringify(record, null, 2));

  appCfgRef.value = record["jdata"];
  console.log('*** sql_load_appcfg() :: appCfgRef.value = ' + JSON.stringify(appCfgRef.value, null, 2)); // DEBUG
}
provide('sql_load_appcfg', sql_load_appcfg);


const loadDbUserCfg = () => {
  //= pyshell にて DB から読み込んで userCfgRef.value に格納する
  //  unipyapi.rwSqlContent を活かして DB から読み込む
  //=
  const item = {
    uuid: "user_cfg",
    com_type: "user_cfg",
    meta: {
    },
    content: {
    }
  };

  sql_load_usercfg(item);
}
provide('loadDbUserCfg', loadDbUserCfg);


async function sql_load_usercfg(item) {
  console.log("sql_load_usercfg");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: dbConRef.value,   // 2023.12.02
    sql_req: {
      'kind': 'content',
      'op': 'find',
    },
    content: content
  };

  const result = await window.unipyapi.rwSqlContent(sendData);
  // console.log("  result: " + JSON.stringify(result, null, 2));

  //= エラーチェック 2023/11/09 
  if (result["code"] != 0) {
    console.log("  result.code != 0");
    return;
  }

  if (!('readed_data' in result)) {
    console.log("  'readed_data' not in result");
    return;
  }

  if (result['readed_data']["exit_code"] != 0) {
    console.log("  result['readed_data']['exit_code'] != 0");
    return;
  }

  if (!("recordset" in result['readed_data'])) {
    console.log("  'recordset' not in result['readed_data']");
    return;
  }

  const base64Str = result['readed_data']['recordset']
  const normalStr = Base64.decode(base64Str)
  const recordset = JSON.parse(normalStr)
  // console.log("  recordset: " + JSON.stringify(recordset, null, 2));

  if (recordset.length == 0) {
    console.log("  recordset.length == 0");
    return;
  } else if (recordset.length > 1) {
    console.log("  recordset.length > 1");
    return;
  }

  const record = recordset[0];
  // console.log("  record: " + JSON.stringify(record, null, 2));

  userCfgRef.value = record["jdata"];
  console.log('*** sql_load_usercfg() :: userCfgRef.value = ' + JSON.stringify(userCfgRef.value, null, 2)); // DEBUG
}
provide('sql_load_usercfg', sql_load_usercfg);


//= <============================================================ END 共通的な処理



const testAuthState = () => {
  console.log("$$$$ testAuthState");
  const item = {
    uuid: "sys_auth",
    com_type: "sys_auth",
    meta: {
    },
    content: {
    }
  };

  sys_test_auth_stat(item);
}

async function sys_test_auth_stat(item) {
  console.log("$$$$ sys_test_auth_stat");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: dbgAuthDB ? dbConRef.value : dbSysConStr,
    sql_req: {
      'kind': 'content',
      'op': 'test',
    },
    content: content
  };

  const result = await window.unipyapi.rwSysMaster(sendData);
  if (developMode) console.log("^^^^ result: " + JSON.stringify(result, null, 2));

  let authorized = false;
  if (result["code"] == 0 && result['readed_data'] != null && result['readed_data']['exit_code'] == 0) {
    const readed_data = result['readed_data'];
    if (readed_data['authorized'] != null) {
      authorized = readed_data['authorized'];
    }
  }

  if (developMode) console.log("^^  authorized: " + authorized);

  if (authorized) {
    authStatRef.value = true; // store に保存する
  }

  if (developMode) console.log("^^^^ authStatRef.value: " + authStatRef.value); // store から読み出す
}



//= BEGIN APP 起動時に DB から app_cfg を読み込む　Etc.=============================>

console.log("App BEGIN Read store --------------------------------------------------------------------------------->");
//= Destructuring from a Store
//    ref/reactive property, getters, and other
//= 
const dbcfg_store_obj = dbCfgStore();  // store instance を作成する
const { db_cfg_obj, db_conn_str, db_admin_conn_str } = storeToRefs(dbcfg_store_obj);   // Destructuring

//+ some test
if (developMode) {
  console.log("^^## Store db_cfg_obj.value : ", JSON.stringify(db_cfg_obj.value, null, 2));
  console.log("^^## Store db_conn_str.value : ", db_conn_str.value);
  console.log("^^## Store db_admin_conn_str.value : ", db_admin_conn_str.value);
}

//= Load 記憶データ from dbCfgStore
dbCfgRef.value = db_cfg_obj.value;
dbConRef.value = db_conn_str.value;
dbAdminConRef.value = db_admin_conn_str.value;

if (developMode) {
  console.log('^** dbCfgRef.value: ' + JSON.stringify(dbCfgRef.value, null, 2));
  console.log('^** dbConRef.value: ' + dbConRef.value);
  console.log('^** dbAdminConRef.value: ' + dbAdminConRef.value);
}
console.log("App END Read store <---------------------------------------------------------------------------------");


loadDbAppCfg();   // 2023.12.02
loadDbUserCfg();  // 2023.12.02

testAuthState();
//= <=============================== END APP 起動時に DB から app_cfg を読み込む　Etc.


onBeforeMount(() => {
  console.log("before mount");
  document.removeEventListener("keydown", onKeyDown);
});


onMounted(async () => {
  await nextTick();
  console.log("mounted");
  document.addEventListener("keydown", onKeyDown);
});

</script>




<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',

  data () {
    return {
      //
    }
  },
})
</script>



<style lang="scss" scoped>
.abs_root_area { /* useElementByPoint 一時的実験用 */
    position:absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color:rgba(022, 149, 212, 0.2);
    outline: 1px solid #000000;
}

.app .main .router_bar {
  overscroll-behavior: none;
}

</style>



<style lang="scss">
/* ↓に代わって、min.ts 「import 'katex/dist/katex.min.css'; 」にした
  @import "../node_modules/katex/dist/katex.min.css";
*/

.editor__content table td, .editor__content table th { 
  min-width: 1em; 
  border: 2px solid #ddd; 
  padding: 3px 5px; 
  vertical-align: top; 
  -webkit-box-sizing: border-box; 
  box-sizing: border-box; 
  position: relative; 
}


</style>

