<template>
  <div
  >

    <v-container>
      <v-row>
        <v-col>
          <v-checkbox
            v-model="showSelCondsRef"
            label="Show Search Conditions"
            color="primary"
            hide-details
          ></v-checkbox>  
        </v-col>

        <v-col>
          <v-btn 
              class="mini-toolbar-btn"
              color="warning"
              title="Soft Delete from DB"
              @click="deleteFromDb()"
          > Delete from DB
          </v-btn>
        </v-col>

        <v-col v-show="isDevModeRef">
          <v-btn 
              class="mini-toolbar-btn"
              color="error"
              title="Hard Delete All Records From The DB Table"
              @click="ResetMyTable"
          > Reset My Table
          </v-btn>
        </v-col>

      </v-row>
    </v-container>

    <div class="my_new_uuid_row">
      <v-text-field
        clearable
        ref = "mod_uuid_el_ref"
        v-model="mod_uuid_v_ref"
        hide-details = "auto"
        label="New UUID"
        placeholder="新しい UUID"
        type='text'
      >
      </v-text-field>
      <v-btn 
          class="my_btn"
          color="primary"
          title="現データのままで指定のUUIDにする"
          @click="changeOwnerUuid()"
      > Change
      </v-btn>
      <v-btn 
          class="my_btn"
          color="primary"
          title="現データを捨てて、指定の UUID をDBから読み込む"
          @click="loadOwnerUuid"
      > Load new UUID
      </v-btn>
    </div>

    <v-container id="add_svg_panel" class="add_panel">
 
      <v-row v-for="(cond, key) in selCondsRef" v-bind:key="key"
        class="my_cond_row"
      >

        <template v-if="showSelCondsRef">
          <v-col class="my_cond_col">
            <v-radio-group v-model="cond.relating" inline>     
              <v-radio v-for="item in redioRelating" :key="item.value"
                :label="item.label"
                :value="item.value"
              ></v-radio>
            </v-radio-group>
          </v-col>

          <v-col class="my_cond_col">
            <v-radio-group v-model="cond.include" inline>          
              <v-radio v-for="item in redioInclude" :key="item.value"
                :label="item.label"
                :value="item.value"
              ></v-radio>
            </v-radio-group>
          </v-col>

          <v-col class="my_cond_col">
            <v-checkbox
              v-model="cond.reverse"
              label="Prefix-Not"
              color="primary"
              value="title"
              hide-details
            ></v-checkbox>                 
          </v-col>
        </template>

        <v-col class="my_cond_col">
          <v-text-field v-if="props.kind == 'sectext' && key == 'passphrase'"
            clearable
            ref = "meta_passphrase_ref"
            v-model="cond.value"
            hide-details = "auto"
            :label="selCondsText[key].label"
            :placeholder="selCondsText[key].placeholder"
            :append-icon = "show_passphrase ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show_passphrase ? 'text' : 'password'"
            counter
            @click:append="show_passphrase = !show_passphrase"
          >
          </v-text-field>

          <v-text-field v-else
            clearable
            ref = "meta_title_ref"
            v-model="cond.value"
            hide-details="auto"
            :label="selCondsText[key].label"
            :placeholder="selCondsText[key].placeholder"
          >
          </v-text-field>
        </v-col>
      </v-row> 
    </v-container>
  
  </div>
</template>



<script setup lang="ts">
import {
  effectScope, getCurrentScope, onScopeDispose, markRaw, toRaw, reactive, shallowReactive, shallowReadonly, isReactive, computed, shallowRef, triggerRef, customRef, ref, unref, toRef, toRefs, isRef, 
  // defineExpose, defineProps, defineEmits,
  inject, onBeforeUpdate, watch, watchEffect, onMounted, onBeforeUnmount, nextTick
} from "vue";

import { Buffer } from 'buffer';
import { Base64 } from "js-base64";

const isDevModeRef = inject('isDevModeRef');
const isPreviewModeRef = inject('isPreviewModeRef');

const appSpecRef: any = inject("appSpecRef");
const userCfgRef: any = inject("userCfgRef");
const appCfgRef: any = inject("appCfgRef");
const dbConRef: any = inject("dbConRef");

const app_msg_ref: any = inject('app_msg_ref');

const selDocFileRef: any = inject("selDocFileRef");

const DelayMSecWakeUp: any = inject("DelayMSecWakeUp");


const props = defineProps({
  kind: { type: String, default: 'normal' },            // "normal" | "sectext" | _
  owner_com_type: { type: String,  required: true },
  // owner_uuid: { type: String, required: true },      // 2023.12.08 props.owner_uuid から md_owner_uuid へ移行
});

const show_passphrase = ref(false);

const showSelCondsRef = ref(false);

const redioRelating = [
  { label: 'None',  value: 'none' },
  { label: 'AND',   value: 'and' },
  { label: 'OR',    value: 'or' },
]

const redioInclude = [
  { label: 'Equal',     value: 'equql' },
  { label: 'included',  value: 'included' },
]


const selCondsText = {  // 参考 selCondsRef
  "uuid": {
    "label": "UUID",
    "placeholder": "UUID"
  },
  "title": {
    "label": "Title",
    "placeholder": "タイトル"
  },
  "subtitle": {
    "label": "Sub-Title",
    "placeholder": "サブタイトル"
  },
  "author": {
    "label": "Author",
    "placeholder": "作者"
  },
  "version": {
    "label": "Version",
    "placeholder": "Version"
  },
  "variation": {
    "label": "Variation",
    "placeholder": "Variation"
  },
  "keywords": {
    "label": "Keywords",
    "placeholder": "検索キーワード（半角スペースで区切り）"
  },
  "groups": {
    "label": "Groups",
    "placeholder": "カテゴリ（半角スペースで区切り）"
  },
};

if (props.kind == "sectext") {
  selCondsText["passphrase"] = {
    "label": "パスワード",
    "placeholder": "@mypass: グローバルパスワードを使用する"
  };
}


const selCondMdsRef = defineModel<any>("selCondMdsRef", { local: true, default: null });
console.log("selCondMdsRef: ", JSON.stringify(selCondMdsRef, null, 2));

const md_owner_uuid = defineModel<any>("md_owner_uuid", { local: true, default: null });
console.log("isRef md_owner_uuid: ", isRef(md_owner_uuid)); // temp. debug
console.log("unref md_owner_uuid: ", unref(md_owner_uuid)); // temp. debug
console.log("toRef md_owner_uuid value: ", toRef(md_owner_uuid).value); // temp. debug

//= Local で使われている物
const selCondsRef = ref({ // 参考 selCondsText
  "uuid": {
    "relating": "none",
    "include": "equql",
    "reverse": false,
    "value": md_owner_uuid,              // ↓ と同じように、変更を親に伝えるために、props.owner_uuid から defineModel md_owner_uuid に変更した
  },
  "title": {
    "relating": "none",
    "include": "equql",
    "reverse": false,
    "value": selCondMdsRef.value["title"],  // 親側の .title は toRef() でであることに注意, 以下も同様
  },
  "subtitle": {
    "relating": "none",
    "include": "equql",
    "reverse": false,
    "value": selCondMdsRef.value["subtitle"],
  },
  "author": {
    "relating": "none",
    "include": "equql",
    "reverse": false,
    "value": selCondMdsRef.value["author"],
  },
  "version": {
    "relating": "none",
    "include": "equql",
    "reverse": false,
    "value": selCondMdsRef.value["version"],
  },
  "variation": {
    "relating": "none",
    "include": "equql",
    "reverse": false,
    "value": selCondMdsRef.value["variation"],
  },
  "keywords": {
    "relating": "none",
    "include": "equql",
    "reverse": false,
    "value": selCondMdsRef.value["keywords"],
  },
  "groups": {
    "relating": "none",
    "include": "equql",
    "reverse": false,
    "value": selCondMdsRef.value["groups"],
  },
});

if (props.kind == "sectext") {
  selCondsRef.value["passphrase"] = {
    "relating": "none",
    "include": "equql",
    "reverse": false,
    "value": selCondMdsRef.value["passphrase"],
  };
}

const mod_uuid_el_ref = ref(null);
const mod_uuid_v_ref = ref(unref(md_owner_uuid.value));

watch(selCondsRef, (newVal, oldVal) => {
  console.log("selCondsRef: ", JSON.stringify(newVal, null, 2));
  for (const key in newVal) {
    selCondMdsRef.value[key] = newVal[key]["value"];
  }
}, { deep: true });


const loadDbRecList = () => {
  console.log("loadDbRecList");

  const item = {
    com_type: props.owner_com_type, // DB Table を特定するための情報
    conds: selCondsRef.value,
  }

  const recordset = sql_load_rec_list(item);
  console.log("  recordset: " + JSON.stringify(recordset, null, 2));

  return recordset;
}


async function sql_load_rec_list(item) {
  console.log("sql_load_rec_list");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: dbConRef.value,   // 2023.12.02
    sql_req: {
      'kind': 'content',
      'op': 'find_by_conds',
    },
    content: content
  };

  const result = await window.unipyapi.rwSqlContent(sendData);  // .text_data
  console.log("  result: " + JSON.stringify(result, null, 2));
  app_msg_ref.value = result["readed_data"] != null ? `Exit Code: ${result["readed_data"]["exit_code"]}, Operation: ${sendData["sql_req"]["op"]}` : `Code: ${result["code"]}, success: ${result["success"]}, Message: ${result["err"]}, Operation: ${sendData["sql_req"]["op"]}`;

  const base64Str = result['readed_data']['recordset']
  const normalStr = Base64.decode(base64Str)
  const recordset = JSON.parse(normalStr)

  console.log("  recordset: " + JSON.stringify(recordset, null, 2));

  return recordset;
}


const changeOwnerUuid = () => {
  console.log(`changeOwnerUuid`);

  const new_uuid = mod_uuid_v_ref.value;
  console.log("  new_uuid: " + new_uuid);

  emit('req_mod_uuid', new_uuid);
}

const loadOwnerUuid = () => {
  console.log("loadOwnerUuid");

  const new_uuid = mod_uuid_v_ref.value;
  console.log("  new_uuid: " + new_uuid);

  emit('req_load_uuid', new_uuid);
}

const ResetMyTable = () => {
  console.log("ResetMyTable");

  const item = {
    com_type: props.owner_com_type, // DB Table を特定するための情報
    conds: selCondsRef.value,
  }
  console.log("  item: " + JSON.stringify(item, null, 2));

  const result = sql_reset_my_table(item);
  console.log("  result: " + JSON.stringify(result, null, 2));

  return result;
}


async function sql_reset_my_table(item) {
  console.log("sql_reset_my_table");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: dbConRef.value,   // 2023.12.02
    sql_req: {
      'kind': 'content',
      'op': 'delete_all',   // 'delete_by_key' | 'delete_by_conds' | 'delete_all'
      'op_md': 'hard',         // 'hard' | 'soft      
      'key': 'uuid',           // 'uuid' | 'title' | 'subtitle' | 'author' | 'version' | 'variation' | 'keywords' | 'groups' | 'passphrase
    },
    content: content
  };

  const result = await window.unipyapi.rwSqlContent(sendData);  // .text_data
  console.log("  result: " + JSON.stringify(result, null, 2));

  return result;
};



const deleteFromDb = () => {
  console.log("deleteFromDb");

  const item = {
    com_type: props.owner_com_type, // DB Table を特定するための情報
    conds: selCondsRef.value,
  }
  console.log("  item: " + JSON.stringify(item, null, 2));

  const result = sql_delete_rec(item);
  console.log("  result: " + JSON.stringify(result, null, 2));

  return result;
}


async function sql_delete_rec(item) {
  console.log("sql_delete_rec");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: dbConRef.value,   // 2023.12.02
    sql_req: {
      'kind': 'content',
      'op': 'delete_by_key',   // 'delete_by_key' | 'delete_by_conds' | 'delete_all'
      'op_md': 'soft',         // 'hard' | 'soft      
      'key': 'uuid',           // 'uuid' | 'title' | 'subtitle' | 'author' | 'version' | 'variation' | 'keywords' | 'groups' | 'passphrase
    },
    content: content
  };

  const result = await window.unipyapi.rwSqlContent(sendData);  // .text_data
  console.log("  result: " + JSON.stringify(result, null, 2));
  app_msg_ref.value = result["readed_data"] != null ? `Exit Code: ${result["readed_data"]["exit_code"]}, Operation: ${sendData["sql_req"]["op"]}` : `Code: ${result["code"]}, success: ${result["success"]}, Message: ${result["err"]}, Operation: ${sendData["sql_req"]["op"]}`;

  return result;
}


const emit = defineEmits([
  'req_mod_uuid',
  'req_load_uuid',
])


defineExpose({
  loadDbRecList,
  ResetMyTable,
  deleteFromDb,
})

</script>



<style lang="scss" scoped>
// 全ての要素にborder-boxを適用させておく設定
*, *:before, *:after {
  box-sizing: border-box;
}


::deep(.my_chkbox .v-label) {
  font-size: 11px;
}


.my_new_uuid_row {
  position: relative;
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr auto auto auto;
}

.my_btn {
  width:fit-content;
  font-size: 11px;
  margin-left: 2px;
  margin-right: 2px;  
}

.my_cond_row {
  margin: 0px;
  padding: 0px;
}

.my_cond_col {
  margin: 0px;
  padding: 0px;
}

</style>