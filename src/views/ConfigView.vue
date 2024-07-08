<template>
  <div>

    <div class="float_alert">
      <v-alert closable
        :title = "alertRef.title"
        :type = "alertRef.type"
        v-model = "alertRef.md" 
      >
      {{ alertRef.msg }}
      </v-alert>
    </div>

    <!-- ↓ Python 環境 -------------------------------------------------------------------------------------------------------------------------------------------- -->
    <v-container class="python_cfg_container">
      <h3 class="py_lang_head">Python Language</h3>
      <v-row class="file_sel_row"> 
          <div>
              <v-text-field
                  label="python executable file"
                  placeholder="「https://www.python.org/downloads/」から python-3.11.6-amd64.exe をダウンロードしインストールすることお勧めします"
                  prepend-icon="mdi-language-python"
                  v-model="pythonEnvRef.pythonExecutable"
              ></v-text-field>
          </div>
          <div>
            <v-btn 
              class="simple_btn file_sel_btn" 
              @click="open" 
              title="「https://www.python.org/downloads/」から python-3.11.6-amd64.exe をダウンロードしインストールすることお勧めします"
            >
              Sel
            </v-btn>
          </div>
      </v-row>
      <v-row class="file_sel_row"> 
          <div>
              <v-text-field
                  label="pip executable file"
                  placeholder="Windows の場合、pip executable file は、python インストール先フォルダの Scripts にインストールされるようです"
                  prepend-icon="mdi-tools"
                  v-model="pythonEnvRef.pipExecutable"
              ></v-text-field>
          </div>
          <div>
            <v-btn class="simple_btn file_sel_btn" @click="open" title="OS Default Python は使わない方が良いでしょう、Python を予めインストールして下さい">
              Sel
            </v-btn>
          </div>
      </v-row>

      <v-row><v-col> 
        <v-textarea clearable hide-details="auto" dense 
          label="Response"       
          v-model="pythonEnvMsgRef"   
          placeholder="python の version 及び path、pip の出力を確認し、必要なパッケージをインストールすると良いでしょう ※ 動作しない場合、手動で path 環境変数を設定して下さい" 
          ></v-textarea> 
      </v-col></v-row>

      <v-row class="py_pkgs_row"> 
        <v-col> <v-btn :disabled="pythonEnvRef.pythonExecutable==''" class="my_btn" v-on:click="onEnvPyTest"       title="python --version を実行します" > python test </v-btn> </v-col>
        <v-col> <v-btn :disabled="pythonEnvRef.pythonExecutable=='' || pythonEnvRef.pipExecutable==''" class="my_btn" v-on:click="onEnvPipTest"      title="pip -V を実行します" > pip test </v-btn> </v-col>
        <v-col> 
          <div class="py_pkgs_frame">
            <v-text-field
                label="packages"
                placeholder=""
                prepend-icon="mdi-language-python"
                v-model="pyPackagesRef"
            ></v-text-field>          
            <v-btn :disabled="pythonEnvRef.pythonExecutable == '' || pythonEnvRef.pipExecutable == ''" class="my_btn" v-on:click="onEnvPipInstall"   title="Python に必要なパッケージをインストールします" >install lib.</v-btn> 
            <v-btn :disabled="pythonEnvRef.pythonExecutable == '' || pythonEnvRef.pipExecutable == ''" class="my_btn" v-on:click="onEnvPkgsTest"     title="インストールされたパッケージをテストします" > test lib.</v-btn> 
          </div>
        </v-col>
        <v-col>
          <!-- 2024.02.02a .py 配布 ↓不要 -->
          <v-btn v-show="false" :disabled="true && (pythonEnvRef.pythonExecutable == '' || pythonEnvRef.pipExecutable == '')" class="my_btn" v-on:click="onEnvMakePysrc"  title="Python Script をインストールします" > install script</v-btn> 
        </v-col>
        <v-col>
          <v-btn :disabled="pythonEnvRef.pythonExecutable == '' || pythonEnvRef.pipExecutable == ''" class="my_btn" v-on:click="onEnvPyShellTest"  title="Python API Echo テストです" > test script </v-btn> 
        </v-col>
      </v-row>
    </v-container>

    
    <!-- ↓ System DB Master -------------------------------------------------------------------------------------------------------------------------------------------- -->
    <v-container class="user_cfg_container">
      <h3>Serial No & Licence</h3>
      <v-row ><v-col> <v-text-field label="Serial No." v-model="licenceRef.serial_no" placeholder="undefined" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>

      <!-- licence_id は、とりあえず、リリース毎に値を変えることにする、ユーザには入力させないことにした上、運用はしばらく決めることにする -->
      <v-row v-show="false"><v-col> <v-text-field label="Licence ID" v-model="licenceRef.licence_id" placeholder="undefined" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>

      <v-row ><v-col> 
        <v-text-field
          v-model="licenceRef.licence_pwd"         
          label="Password" 
          placeholder="undefined" clearable hide-details="auto" 
          :append-icon = "show_passphrase ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show_passphrase ? 'text' : 'password'"
          counter
          @click:append="show_passphrase = !show_passphrase"
        ></v-text-field> 
      </v-col></v-row>

      <v-row> 
         <!-- Database にて永続化記憶されている -->
        <v-col> 
          <!-- :disabled="authStatRef" -->
          <v-btn 
            class="my_btn2" v-on:click="onSysMstAuth"      title="S/N, Passphrase を持って認証します"      
          > 認証 </v-btn> 
        </v-col>
      </v-row>
    </v-container>

    <!-- User は ↑へ移行した。licence_id ⇒ licence_type licence_expire online_stat ad_type はこれから検討する -->
    <!-- ↓ User 旧コード、参考 ---------------------------------------------------------------------------------------------------------------------------------------------- -->
<!-- 
    <v-container class="user_cfg_container">
      <v-row><v-col> <v-text-field label="Serial No."           v-model="loc_userCfgRef.serial_no"         placeholder="undefined"                         clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
      <v-row><v-col> <v-text-field label="Licence Type"         v-model="loc_userCfgRef.licence_type"      placeholder="undefined"                         clearable hide-details="auto" dense readonly ></v-text-field> </v-col></v-row>
      <v-row><v-col> <v-text-field label="Licence ID"           v-model="loc_userCfgRef.licence_id"        placeholder="undefined"                         clearable hide-details="auto" dense readonly ></v-text-field> </v-col></v-row>
      <v-row><v-col> <v-text-field label="Licence Password"     v-model="loc_userCfgRef.licence_pwd"       placeholder="undefined"                         clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
      <v-row>
        <v-col> <v-btn color="blue-grey" v-on:click="applyUserCfg" > Apply </v-btn> </v-col>
      </v-row>
    </v-container>
 -->

    <!-- ↓ Database -------------------------------------------------------------------------------------------------------------------------------------------------------- -->
    <v-container class="db_cfg_container">
      <h3>Database</h3>
      <v-row>
        <v-col> 
          <v-combobox clearable hide-details="auto" dense
            v-model = "loc_dbCfgRef.db_type"
            label = "Select Or Input Database Type"
            :items = "['sqlite', 'postgresql']"
          ></v-combobox>
        </v-col>
      </v-row> 

      <v-row v-show="loc_dbCfgRef.db_type=='sqlite'" ><v-col> 
        <v-text-field clearable hide-details="auto" dense 
          label = "Sqlite Database Path"
          v-model = "loc_dbCfgRef.db_path"
          placeholder = "例:「memory (In-Memory ※For testing purposes only), 「C:\\DOCs\\BitEditor\\bitwaves.db」, 「bitwaves.db」、「path/to relative path/database.db」、「/path/to absolute path/database.db」"
        ></v-text-field> 
      </v-col></v-row>

      <v-row v-show="loc_dbCfgRef.db_type != 'sqlite'" ><v-col> <v-text-field label="Database Host"        v-model="loc_dbCfgRef.db_host"    placeholder="localhost"   clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
      <v-row v-show="loc_dbCfgRef.db_type != 'sqlite'" ><v-col> <v-text-field label="Database Port"        v-model="loc_dbCfgRef.db_port"    placeholder="25432"       clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
      <v-row v-show="loc_dbCfgRef.db_type != 'sqlite'" ><v-col> <v-text-field label="Database Name"        v-model="loc_dbCfgRef.db_name"    placeholder="bitwaves"    clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
      <v-row v-show="loc_dbCfgRef.db_type != 'sqlite'" ><v-col> <v-text-field label="Database User"        v-model="loc_dbCfgRef.db_user"    placeholder="postgres"    clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>

      <v-row v-show="loc_dbCfgRef.db_type != 'sqlite'" ><v-col> 
        <v-text-field 
          v-model="loc_dbCfgRef.db_pass" 
          label="Database Password"    
          placeholder="postgres"
          :append-icon = "show_passphrase ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show_passphrase ? 'text' : 'password'"
          counter
          @click:append="show_passphrase = !show_passphrase"
        ></v-text-field> 
      </v-col></v-row>

      <v-row v-show="loc_dbCfgRef.db_type != 'sqlite'" ><v-col> <v-text-field label="Admin Database Name "     v-model="loc_dbCfgRef.admin_db_name"    placeholder="postgres"    clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
      <v-row v-show="loc_dbCfgRef.db_type != 'sqlite'" ><v-col> <v-text-field label="Admin Database User"      v-model="loc_dbCfgRef.admin_db_user"    placeholder="postgres"    clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>

      <v-row v-show="loc_dbCfgRef.db_type != 'sqlite'" ><v-col> 
        <v-text-field 
          v-model="loc_dbCfgRef.admin_db_pass"
          label="Admin Database Password"  
          placeholder="postgres"    
          :append-icon = "show_passphrase ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show_passphrase ? 'text' : 'password'"
          counter
          @click:append="show_passphrase = !show_passphrase"
        ></v-text-field> 
      </v-col></v-row>

      <v-row><v-col> 
        <v-text-field readonly hide-details="auto" dense class="db_con_text"
          label       = "Database Connection String" 
          v-model     = "loc_dbConRef" 
          placeholder = "例:「postgresql://postgres:postgres@localhost:25432/bitwaves」、 「mylitedb」、 「sqlite:///C:\\local\\bitwaves\\db\\bitwaves.db」、「sqlite:///path/to relative path/database.db」、「sqlite:////path/to absolute path/database.db」" 
        ></v-text-field> 
      </v-col></v-row> 

      <v-row>
        <!-- pinia-plugin-persistedstate にて、永続化記憶されている -->
        <v-col> 
          <v-btn :disabled="!authStatRef" 
            color="primary" 
            title="入力データを記憶させます"
            v-on:click="applyDbCfg"  
          > Apply </v-btn> 
          <span v-show="!authStatRef"
            class="lic_notice"
          >License Required</span>
        </v-col>
      </v-row> 
    </v-container>  

    <v-container v-show="loc_dbCfgRef.db_type != 'sqlite'" class="db_cfg_container">
      <h3>Database 管理</h3>
      <v-row><v-col> 
        <v-text-field label="Admin Database Connection String" v-model="dbAdminConRef" placeholder="postgresql://postgres:postgres@localhost:25432/postgres" readonly hide-details="auto" dense class="db_con_text" ></v-text-field> 
      </v-col></v-row> 
      <v-row><v-col> 
        <v-text-field label="Backup File" v-model="backupDbFileRef" placeholder="C:\\DOCs\\SvgEditor\\db-backup.sql" clearable hide-details="auto" dense ></v-text-field> 
      </v-col></v-row> 
      <v-row>
        <!-- ↓ 未実装 -->
        <v-col> 
          <v-btn color="primary"
            :disabled="true"
            title="DB 管理者として、アプリデータベースのバックアップを作成します"
            v-on:click="backupDb" 
          > Backup DB</v-btn> 
        </v-col>

        <!-- ↓ 未実装 -->
        <v-col> 
          <v-btn color="error" 
            :disabled="true"
            title="DB 管理者として、アプリデータベースをリストアします ※ご注意：直近バックアップ以降の作業データが失われるため、バックアップしておくことお勧めします"
            v-on:click="restoreDb" 
          > Restore DB</v-btn> 
        </v-col>

        <v-col> 
          <v-btn color="error"
            title="DB 管理者として、アプリデータベースを初期化します ※ご注意：全ての作業データが失われるため、バックアップしておくことお勧めします"
            v-on:click="resetDb" 
          > Reset DB  </v-btn> 
        </v-col>
      </v-row> 
    </v-container>  

    <!-- ↓ App -------------------------------------------------------------------------------------------------------------------------------------------------------- -->
    <v-container class="app_cfg_container">
      <h3>Basic</h3>
<!-- 次期検討
      <v-row><v-col> <v-text-field label="System Path"            v-model="loc_appCfgRef.sys_path"           placeholder="C:\\workspace\\bitwaves"            clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
 -->
      <v-row><v-col> <v-text-field label="Document Directory"     v-model="loc_appCfgRef.doc_dir"            placeholder="C:\\DOCs\\SvgEditor"                clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
      <v-row><v-col> <v-text-field label="Inkscape Bin Directory" v-model="loc_appCfgRef.inkscape_bin_dir"   placeholder="C:\\Program Files\\Inkscape\\bin"   clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
      <v-row><v-col> <v-text-field label="Inkscape Bin File"      v-model="loc_appCfgRef.inkscape_bin_file"  placeholder="inkscape.exe"                       clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
<!-- 次期検討
      <v-row><v-col> <v-text-field label="Data Directory"         v-model="loc_appCfgRef.data_dir"           placeholder="undefined"                          clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
      <v-row><v-col> <v-text-field label="Variable Directory"     v-model="loc_appCfgRef.var_dir"            placeholder="undefined"                          clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
      <v-row><v-col> <v-text-field label="Temporary Directory"    v-model="loc_appCfgRef.tmp_dir"            placeholder="undefined"                          clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
      <v-row><v-col> <v-text-field label="Log Directory"          v-model="loc_appCfgRef.log_dir"            placeholder="undefined"                          clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
      <v-row><v-col> <v-text-field label="Log Level"              v-model="loc_appCfgRef.log_level"          placeholder="undefined"                          clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
 -->
      <v-row><v-col> <v-text-field label="Background Color"       v-model="loc_appCfgRef.back_color"         placeholder="rgba(255, 255, 255, 1.0)"           clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>
      <v-row><v-col> <v-text-field label="Foreground Color"       v-model="loc_appCfgRef.front_color"        placeholder="rgba(0, 0, 0, 1.0)"                 clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row>

      <v-row>
        <!-- Database にて永続化記憶されている -->
        <v-col> 
          <v-btn 
            color="primary" v-on:click="applyAppCfg" 
          > Apply </v-btn> 
          <span v-show="false"
            class="lic_notice"
          >License Required</span>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script setup lang="ts">
import {
  ref, reactive, computed,
  // defineExpose, defineProps, defineEmits,
  inject, onBeforeUpdate, watch, onMounted, onBeforeUnmount, nextTick
} from "vue";

import {
  useDraggable,
  useElementBounding,
  useEventListener,
  useMouse, useMousePressed, onKeyStroke, useMagicKeys, useMouseInElement, useParentElement, useElementSize, useActiveElement,
  whenever, useFileDialog
} from '@vueuse/core'

import { v4 as uuidv4 } from "uuid";
import { Buffer } from 'buffer';
import { Base64 } from "js-base64";

import { dbCfgStore } from '@/store/db_cfg' // .ts は省略可
import { storeToRefs } from 'pinia'

import { app } from "electron";

const developMode = inject('developMode') as any; // readonly process.env.NODE_ENV == "development"

const appSpecRef: any = inject("appSpecRef");
const userCfgRef: any = inject("userCfgRef");
const dbCfgRef: any = inject("dbCfgRef");
const dbConRef: any = inject("dbConRef");
const dbAdminConRef: any = inject("dbAdminConRef");
const appCfgRef: any = inject("appCfgRef");

const dbgAuthDB: any = inject('dbgAuthDB'); // true: Debug（開発中, use postgres） | false: 本番（use sqlite）
const dbSysConStr: any = inject("dbSysConStr");
const authStatRef: any = inject('authStatRef');
const DelayMSecWakeUp: any = inject("DelayMSecWakeUp");

const loadDbAppCfg = inject("loadDbAppCfg");    // function
const loadDbUserCfg = inject("loadDbUserCfg");  // function


const showRouterBar: any = inject("showRouterBar");

const show_passphrase = ref(false);

const genSysOwnerRecordNum = ref(1000);
const backupDbFileRef = ref("C:\\local\\bitwaves\\db-backup.sql");

const alertRef = ref({
  title: "alert",
  type: "success",  // success | info | warning | error
  md: false,
  msg: "",
})

console.log("BEGIN store --------------------------------------------------------------------------------->");
//= Destructuring from a Store
//    ref/reactive property, getters, and other
//= 
const dbcfg_store_obj = dbCfgStore();  // store instance を作成する

// const { db_cfg_obj, db_conn_str, db_admin_conn_str } = storeToRefs(dbcfg_store_obj);  // Destructuring

// //+ some test
// console.log("db_cfg_obj.value : ", JSON.stringify(db_cfg_obj.value, null, 2));
// console.log("db_conn_str.value : ", db_conn_str.value);
// console.log("db_admin_conn_str.value : ", db_admin_conn_str.value);
console.log("END store <---------------------------------------------------------------------------------");


const pythonEnvRef = ref({
  pythonExecutable: "python.exe",
  pipExecutable: "pip.exe",
});

const { files, open, reset, onChange } = useFileDialog({
  multiple: false,
  directory: false,
  reset: false,
})

onChange((files) => {
  console.log('Selected files:', files);
  if (files.length > 0) {
    const file = files[0];
    const name = file.name;
    if (name.includes("pip")) {
      pythonEnvRef.value.pipExecutable = file.path;
    }  
    else {
      pythonEnvRef.value.pythonExecutable = file.path;
    }
  }
})


const pythonEnvMsgRef = ref("");

async function onEnvPyTest() {
  console.log("onEnvPyTest");

  const response = await window.sysapi.testPythonVersion();

  console.log("  response: " + JSON.stringify(response, null, 2));
  pythonEnvMsgRef.value = JSON.stringify(response, null, 2);
}


async function onEnvPipTest() {
  console.log("onEnvPipTest");

  const response = await window.sysapi.testPipVersion();

  console.log("  response: " + JSON.stringify(response, null, 2));
  pythonEnvMsgRef.value = JSON.stringify(response, null, 2);
}


const pyPackagesRef = ref("dataset psycopg2-binary pycryptodome");  // 2024.02.01a + ModuleNotFoundError: psycopg2-binary to against module named 'psycopg2' in Python

async function onEnvPipInstall() {
  console.log("onEnvPipInstall");

  const response = await window.sysapi.pipInstall(pyPackagesRef.value);

  console.log("  response: " + JSON.stringify(response, null, 2));
  pythonEnvMsgRef.value = JSON.stringify(response, null, 2);
}


async function onEnvPkgsTest() {
  console.log("onEnvPkgsTest");

  const response = await window.sysapi.pipTestPkgs(pyPackagesRef.value);

  console.log("  response: " + JSON.stringify(response, null, 2));
  pythonEnvMsgRef.value = JSON.stringify(response, null, 2);
}


const onEnvPyShellTest = () => {
  console.log("onEnvPyShellTest");
  const item = {
    uuid: "sys_mst",
    com_type: "sys_mst",
    meta: {
    },
    content: {
    }
  };

  sys_mst_echo(item);
}


async function sys_mst_echo(item) {
  //= a) S/N, b) ID, c) Password を認証する

  console.log("sys_mst_auth");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: SYS_DB_CONN_STR,
    sql_req: {
      'kind': 'content',
      'op': 'echo',
    },
    content: content
  };

  const response = await window.unipyapi.rwSysMaster(sendData);
  console.log("  response: " + JSON.stringify(response, null, 2));
  pythonEnvMsgRef.value = JSON.stringify(response, null, 2);
}


async function onEnvMakePysrc() {
  console.log("onEnvMakePysrc");

  const response = await window.sysapi.makePysrc();

  console.log("  response: " + JSON.stringify(response, null, 2));
  pythonEnvMsgRef.value = JSON.stringify(response, null, 2);
}


//= 直接変更させたくないのでローカル変数を用意する ※ 「= ref(dbCfgRef.value) 」とすると、dbCfgRefはローカル変数の参照となり、直ちに反映されることに注意
const loc_dbCfgRef = ref(structuredClone(dbCfgRef.value));

const makeDbConnText = computed(() => { // 2024.01.11 ※ Local Echo に過ぎない。本格的計算は、store に行われている
  if (loc_dbCfgRef.value.db_type == 'sqlite') {
    return `${loc_dbCfgRef.value.db_type}:///${loc_dbCfgRef.value.db_path}`;
  } else {
    return `${loc_dbCfgRef.value.db_type}://${loc_dbCfgRef.value.db_user}:${loc_dbCfgRef.value.db_pass}@${loc_dbCfgRef.value.db_host}:${loc_dbCfgRef.value.db_port}/${loc_dbCfgRef.value.db_name}`;
  }
});

const makeAdminDbConnText = computed(() => {  // 2024.01.11 ※ Local Echo に過ぎない。本格的計算は、store に行われている
  if (loc_dbCfgRef.value.db_type == 'sqlite') {
    return `${loc_dbCfgRef.value.db_type}:///${loc_dbCfgRef.value.db_path}`;  // sqlite の場合、管理者 DB は存在しないので、アプリ DB と同じものを返す ※ 一応設定しておくが、sqlite の管理は非サポートであり、実際には使われない
  } else {
    return `${loc_dbCfgRef.value.db_type}://${loc_dbCfgRef.value.admin_db_user}:${loc_dbCfgRef.value.admin_db_pass}@${loc_dbCfgRef.value.db_host}:${loc_dbCfgRef.value.db_port}/${loc_dbCfgRef.value.admin_db_name}`;
  }
});


//= Local  DB 接続情報 e.g: 'postgresql://postgres:postgres@localhost:5432/bitwaves'
const loc_dbConRef = ref(makeDbConnText.value);

//= Local 管理者 DB 接続情報 e.g: 'postgresql://postgres:postgres@localhost:5432/postgres'
const lof_dbAdminConRef = ref(makeAdminDbConnText.value);


watch(loc_dbCfgRef, (val) => { // 2024.01.11 ※ Local Echo に過ぎない。本格的計算は、store に行われている
  console.log("watch loc_dbCfgRef : ", JSON.stringify(val, null, 2));
  loc_dbConRef.value = makeDbConnText.value;
  lof_dbAdminConRef.value = makeAdminDbConnText.value;
}, { deep: true });


const applyDbCfg = () => {
  console.log("$$$$ applyDbCfg");

  //= store に保存し、db_conn_str db_admin_conn_str を作成し永続化する
  dbcfg_store_obj.update_db_cfg(loc_dbCfgRef.value);

  //= Destructuring from a Store
  const { db_cfg_obj, db_conn_str, db_admin_conn_str } = storeToRefs(dbcfg_store_obj);

  // do some test
  console.log("$$$$$$$$ Do Some Test ...");
  console.assert(db_conn_str.value == loc_dbConRef.value, "db_conn_str.value != loc_dbConRef.value");
  console.assert(db_admin_conn_str.value == lof_dbAdminConRef.value, "db_admin_conn_str.value != lof_dbAdminConRef.value");
  console.log("$$$$$$$$ done.");

  //= to update injected global variable
  dbCfgRef.value = structuredClone(db_cfg_obj.value); // 入力データ
  dbConRef.value = db_conn_str.value;                 // DB 接続情報 e.g: 'postgresql://postgres:postgres@localhost:5432/bitwaves'
  dbAdminConRef.value = db_admin_conn_str.value;      // 管理者 DB 接続情報 e.g: 'postgresql://postgres:postgres@localhost:5432/postgres'

  //+ some test
  console.log("### Store db_cfg_obj.value : ", JSON.stringify(db_cfg_obj.value, null, 2));
  console.log("### Store db_conn_str.value : ", db_conn_str.value);
  console.log("### Store db_admin_conn_str.value : ", db_admin_conn_str.value);

  //= some log
  console.log('*** dbCfgRef.value  : ' + JSON.stringify(dbCfgRef.value, null, 2));
  console.log('*** ConfigView.vue :: applyDbCfg() :: dbConRef.value = ' + dbConRef.value); // DEBUG
  console.log('*** ConfigView.vue :: applyDbCfg() :: dbAdminConRef.value = ' + dbAdminConRef.value); // DEBUG

  alertRef.value.title = "success";
  alertRef.value.msg = "データベース接続情報を更新しました";
  alertRef.value.type = "success";
  alertRef.value.md = true;
}


const resetDb = () => {
  console.log("resetDb");

  const item = {
    uuid: "admin_db",
    com_type: "admin_db",
    meta: {
      'tables': 'all',  // 実データ Table を全て削除する ※ app_cfg etc. 管理用 Table は削除しない
    },
    content: {
    }
  };
  sql_reset_db(item);
}


async function sql_reset_db(item) {
  console.log("sql_save_content");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: dbConRef.value,   // 管理 DB ではなく、アプリ DB に対して操作する
    sql_req: {
      'kind': 'admin_db',
      'op': 'reset_table',
    },
    content: content
  };

  const result = await window.unipyapi.rwSqlContent(sendData);
  console.log("  result: " + JSON.stringify(result, null, 2));

  const success = result["code"] == 0 && result['readed_data'] != null && result['readed_data']['exit_code'] == 0;
  alertRef.value.title = success ? "success" : "failed";
  alertRef.value.msg = success ? "データベースを初期化しました" : "データベースの初期化に失敗しました： " + JSON.stringify(result, null, 2);
  alertRef.value.type = success ? "success" : "error";
  alertRef.value.md = true;
}





const backupDb = () => {
  console.log("backupDb");

  const item = {
    uuid: "admin_db",
    com_type: "admin_db",
    meta: {
      'backup_file': backupDbFileRef.value,
    },
    content: {
    }
  };
  sql_backup_db(item);
}


async function sql_backup_db(item) {
  console.log("sql_save_content");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: dbAdminConRef.value,
    sql_req: {
      'kind': 'admin_db',
      'op': 'backup_db',
    },
    content: content
  };

  const result = await window.unipyapi.rwSqlContent(sendData);
  console.log("  result: " + JSON.stringify(result, null, 2));

  const success = result["code"] == 0 && result['readed_data'] != null && result['readed_data']['exit_code'] == 0;
  alertRef.value.title = success ? "success" : "failed";
  alertRef.value.msg = success ? "データベースをバックアップしました" : "データベースのバックアップに失敗しました： " + JSON.stringify(result, null, 2);
  alertRef.value.type = success ? "success" : "error";
  alertRef.value.md = true;
}


const restoreDb = () => {
  console.log("restoreDb");

  const item = {
    uuid: "admin_db",
    com_type: "admin_db",
    meta: {
      'backup_file': backupDbFileRef.value,
    },
    content: {
    }
  };
  sql_restore_db(item);
}


async function sql_restore_db(item) {
  console.log("sql_save_content");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: dbAdminConRef.value,
    sql_req: {
      'kind': 'admin_db',
      'op': 'restore_db',
    },
    content: content
  };

  const result = await window.unipyapi.rwSqlContent(sendData);
  console.log("  result: " + JSON.stringify(result, null, 2));

  const success = result["code"] == 0 && result['readed_data'] != null && result['readed_data']['exit_code'] == 0;
  alertRef.value.title = success ? "success" : "failed";
  alertRef.value.msg = success ? "データベースをリストアしました" : "データベースのリストアに失敗しました： " + JSON.stringify(result, null, 2);
  alertRef.value.type = success ? "success" : "error";
  alertRef.value.md = true;  
}



const loc_appCfgRef = ref(structuredClone(appCfgRef.value));


const applyAppCfg = () => {
  appCfgRef.value = loc_appCfgRef.value;
  console.log('*** ConfigView.vue :: applyAppCfg() :: appCfgRef.value = ' + JSON.stringify(appCfgRef.value)); // DEBUG

  //= pyshell にて DB に保存する
  //  unipyapi.rwSqlContent を活かして DB に保存する
  //=
  const item = {
    uuid: "app_cfg",
    com_type: "app_cfg",
    meta: {
    },
    content: {
      "sys_path": appCfgRef.value.sys_path,           // installed dir
      "doc_dir": appCfgRef.value.doc_dir,            // .svg, .html etc.
      "inkscape_bin_dir": appCfgRef.value.inkscape_bin_dir,   // 実行エラー ⇒ 環境変数 path の設定した前提で実行すること
      "inkscape_bin_file": appCfgRef.value.inkscape_bin_file,
      "data_dir": appCfgRef.value.data_dir,           // （保留）data files
      "var_dir": appCfgRef.value.var_dir,            // （保留）temp files
      "tmp_dir": appCfgRef.value.tmp_dir,            // （保留）temp files
      "log_dir": appCfgRef.value.log_dir,            // （保留）log files
      "log_level": appCfgRef.value.log_level,          // （保留）log level
      "back_color": appCfgRef.value.back_color,         // 実コンテンツの background-color（個別指定されない時）
      "front_color": appCfgRef.value.front_color,        // 実コンテンツの color（個別指定されない時）
    }
  };

  sql_save_appcfg(item);
}


async function sql_save_appcfg(item) {
  console.log("sql_save_content");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: dbConRef.value,   // 2023.12.02
    sql_req: {
      'kind': 'content',
      'op': 'upsert',
    },
    content: content
  };

  const result = await window.unipyapi.rwSqlContent(sendData);
  console.log("  result: " + JSON.stringify(result, null, 2));

  const success = result["code"] == 0 && result['readed_data'] != null && result['readed_data']['exit_code'] == 0;
  alertRef.value.title = success ? "success" : "failed";
  alertRef.value.msg = success ? "アプリケーション設定を更新しました" : "アプリケーション設定の更新に失敗しました： " + JSON.stringify(result, null, 2);
  alertRef.value.type = success ? "success" : "error";
  alertRef.value.md = true;

  loadDbAppCfg();
  loc_appCfgRef.value = structuredClone(appCfgRef.value);
}



// const loc_userCfgRef = ref(structuredClone(userCfgRef.value));

// const applyUserCfg = () => {
//   userCfgRef.value = loc_userCfgRef.value;
//   console.log('*** ConfigView.vue :: applyUserCfg() :: userCfgRef.value = ' + JSON.stringify(userCfgRef.value)); // DEBUG

//   //= pyshell にて DB に保存する
//   //  unipyapi.rwSqlContent を活かして DB に保存する
//   //=
//   const item = {
//     uuid: "user_cfg",
//     com_type: "user_cfg",
//     meta: {
//     },
//     content: {
//       "serial_no": userCfgRef.value.serial_no,       // TODO 暗号化
//       "licence_type": userCfgRef.value.licence_type,       // 
//       "licence_id": userCfgRef.value.licence_id,       // TODO 暗号化
//       "licence_pwd": userCfgRef.value.licence_pwd,       // TODO 暗号化
//       "licence_stat": userCfgRef.value.licence_stat,   // フリー | お試し | （無料）許可 | 認証済 | (other)
//       "licence_expire": userCfgRef.value.licence_expire,       //
//       "online_stat": userCfgRef.value.online_stat,    // !! online 可 | その都度確認 | online 不可
//       "ad_type": userCfgRef.value.ad_type,       // !! AD 可 | AD 不可
//     }
//   };

//   sql_save_usercfg(item);
// }


const cancelUserCfg = () => {
  loc_userCfgRef.value = userCfgRef.value;
  console.log('*** ConfigView.vue :: cancalUserCfg() :: loc_userCfgRef.value = ' + JSON.stringify(loc_userCfgRef.value)); // DEBUG
}

async function sql_save_usercfg(item) {
  console.log("sql_save_content");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: dbConRef.value,   // 2023.12.02
    sql_req: {
      'kind': 'content',
      'op': 'upsert',
    },
    content: content
  };

  const result = await window.unipyapi.rwSqlContent(sendData);
  console.log("  result: " + JSON.stringify(result, null, 2));

  const success = result["code"] == 0 && result['readed_data'] != null && result['readed_data']['exit_code'] == 0;
  alertRef.value.title = success ? "success" : "failed";
  alertRef.value.msg = success ? "ユーザー設定を更新しました" : "ユーザー設定の更新に失敗しました： " + JSON.stringify(result, null, 2);
  alertRef.value.type = success ? "success" : "error";
  alertRef.value.md = true;

  loadDbUserCfg();
  loc_userCfgRef.value = structuredClone(userCfgRef.value);
}


const onDummy = () => {
  console.log("onDummy");
}


// BEGIN SYS-MST --------------------------------------------------------------------------------->
const MY_LICENCE_ID = "83813dd0-6a5b-4bcd-8117-aa609dd2dc3f";

// const SYS_DB_CONN_STR = dbSysConStr;      // !! 本番
const SYS_DB_CONN_STR = dbgAuthDB ? dbConRef.value : dbSysConStr;   // !! 

const licenceRef = ref({
  serial_no: authStatRef.value ? "認証済みです" : "",

  //= 【保留】licence_type 2024.01.16a
  //  [機能, 有効期限, 更新制限, 他] 特定のための ID
  //    ※ 取りあえず、リリースごとに異なるMY_LICENCE_ID値を設定する 2024.01.16a
  //    ※ 運用について、継続的に検討する
  licence_id: "",

  licence_pwd: "",
});


const onSysMstAuth = () => {
  console.log("onSysMstAuth");
  const item = {
    uuid: "sys_mst",
    com_type: "sys_mst",
    meta: {
    },
    content: {
      "serial_no": licenceRef.value.serial_no,
      "licence_id": licenceRef.value.licence_id,
      "licence_pwd": licenceRef.value.licence_pwd,
    }
  };

  sys_mst_auth(item);
}


async function sys_mst_auth(item) {
  //= a) S/N, b) ID, c) Password を認証する

  console.log("sys_mst_auth");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: SYS_DB_CONN_STR,
    sql_req: {
      'kind': 'content',
      'op': 'find',
    },
    content: content
  };

  const result = await window.unipyapi.rwSysMaster(sendData);
  console.log("  result: " + JSON.stringify(result, null, 2));

  let authorized = false;
  if (result["code"] == 0 && result['readed_data'] != null && result['readed_data']['exit_code'] == 0) {
    const readed_data = result['readed_data'];
    if (readed_data['authorized'] != null) {
      authorized = readed_data['authorized'];
    }
  }

  console.log("  authorized: " + authorized);

  if(authorized) {
    authStatRef.value = true; // store に保存する
  }
  console.log("  authStatRef.value: " + authStatRef.value); // store から読み出す

  alertRef.value.title = authorized ? "success" : "failed";
  alertRef.value.msg = authorized ? "認証が成功しました" : "認証が失敗しました： " + JSON.stringify(result, null, 2);
  alertRef.value.type = authorized ? "success" : "error";
  alertRef.value.md = true;
}


// END SYS-MST <---------------------------------------------------------------------------------


</script>



<style lang="scss" scoped>

.db_cfg_container {
  border: 1px solid #000;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: #eee;
}

.db_con_text {
  font-size: 0.8em;
  background-color: black;
  color: green;
}

.app_cfg_container {
  border: 1px solid #000;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: #eee;
}

.user_cfg_container {
  border: 1px solid #000;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: #eee;
}

.python_cfg_container {
  border: 1px solid #000;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: #eee;
}

.file_sel_row {
  display: grid;
  grid-template-columns: 1fr auto
}

.bath_gen_cell {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 8px;
}

.bath_gen_text {
  font-size: 0.8em;
  width: 192px !important;
}

.my_btn {
  width:fit-content;
  font-size: 11px;
  height: 32px;
  margin: 8px;
  background-color: rgb(68, 37, 4);
  color:white;  
}

.my_btn2 {
  width:fit-content;
  font-size: 11px;
  height: 32px;
  margin: 8px;
  background-color: rgb(6, 3, 85);
  color:gold;  
}

.simple_btn {
  width:fit-content;
  height: 32px;
  font-size: 11px;
  margin: 8px;
}

.file_sel_btn {
  background-color: rgb(68, 37, 4);
  color:white;
}

.py_lang_head {
  margin-bottom: 15px;
}

.py_pkgs_row {
  display: grid;
  grid-template-columns: 1fr 1fr 6fr 1fr 1fr;
  grid-gap: 8px;
}


.py_pkgs_frame {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  grid-gap: 8px;
}

.float_alert {
  display: block;
  position: absolute;
  z-index: 10000;
  left: 0;
  top: 0;
  right: 0;
}

.lic_notice {
  margin-left: 8px;
  color: red;
}
</style>