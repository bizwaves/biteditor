<template>
  <div 
    ref = "galaxy_ref" 
    class = "galaxy client_decided html_events" 
    title = "galaxy_ref :- EditSecText galaxy: div, Position, Size の基準（当 Html Frame の 辺界線）" 
  >
        
    <div v-if = "isDevModeRef" class = "who_am_i">{{ props.com_type }} : {{ uuidRef.value }}, {{ deletedRef}}}</div>

    <v-btn v-if = "false" color = "primary" title = "html-galaxy debuging button" >
        Click EditSecText galaxy!
    </v-btn>


    <div display="none">
      <svg display="none">
        <desc>SVG DEFS-SYMBOL Library</desc>
      </svg>
    </div>


    <div
      ref   = "earth_ref"
      class = "editor_canvas client_decided html_events "
      title = "earth_ref :- EditSecText earth: div, canvas, to warp svg-root"
      :style = "{ 'background-color': htmsvg_outer_ref.background_color, 'color': 'htmsvg_outer_ref.background_color' }"
      @click = "onMeClick"
    >

      <v-container  
          :id = "attached_ref" 
          ref = "menu_container_ref" 
          class = "menu_container" 
          title = "menu_container_ref :- EditHtmlFrame Menu Container"
      >
        <div v-if="false"
          ref="menu_area_ref" 
          class="limited_menu_area"
          title = "menu_area_ref := Limited Active v-menu area, Debuger"
        >
        </div>

        <v-menu
            :attach="sel_cmenu_attach"
            ref = "menu_ref"
            v-model = "cmenu"
            :open-delay = "100" 
            :close-delay = "100"
            :close-on-click = "false"
            :close-on-content-click = 'false'
        >
          <v-list>
            <template v-for = "item in cmenuItems" :key = "item.id">
              <v-list-item v-if="shouldShow(item)"
                  @click.prevent.stop = "onCmenuItemClick(item)"
              >
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>

      </v-container>

      <!-- BEGIN META, TOOL-BAR, LIST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
      <div class = "meta-toolbar-list">

       <div v-if="(!isPreviewModeRef) && (being_edit || is_editing) && show_toolbar_ref"
              class="mini-top-toolbar"
        >
          <v-btn 
              :prepend-icon="show_mata_ref ? 'mdi-arrow-up-drop-circle' : 'mdi-arrow-down-drop-circle'"
              class="mini-toolbar-btn"
              title="Show/Hide Meta Info"
              @click="toggleShowMeta"
          > Meta
          </v-btn>

          <v-btn
              prepend-icon="mdi-move-resize"
              class="mini-toolbar-btn"
              title="位置・サイズを決定する"
              @click="decidePosSize()"
          > Pos Size!
          </v-btn>

          <v-btn prepend-icon="mdi-content-save-edit"
              class="mini-toolbar-btn"
              title="Save"
              @click="saveDbContent(null)"
          > Save
          </v-btn>

          <v-btn prepend-icon="mdi-reload"
              class="mini-toolbar-btn"
              title="Reload"
              @click="loadDbContent(false, '', false)"
          >Load
          </v-btn>

          <v-btn prepend-icon="mdi-download"
              class="mini-toolbar-btn"
              title="Download Text"
              @click="saveClearTextFile"
          > DL Text
          </v-btn>

          <v-btn prepend-icon="mdi-download-lock"
              class="mini-toolbar-btn"
              title="Download Encrypted"
              @click="saveCipherTextFile"
          > DL Cipher
          </v-btn>

          <v-btn prepend-icon="mdi-download"
              class="mini-toolbar-btn"
              title="Upload Text"
              @click="loadClearTextFile"
          > UP Text
          </v-btn>

          <v-btn prepend-icon="mdi-download-lock"
              class="mini-toolbar-btn"
              title="Upload Encrypted"
              @click="loadCipherTextFile"
          > UP Cipher
          </v-btn>

          <!--
            一覧表示
            選択
            レコード表示
           -->
          <v-btn prepend-icon="mdi-view-list"
              class="mini-toolbar-btn"
              title="Listup"
              :disabled="sel_conds_ref == null"
              @click="loadDbRecList"
          > Listup
          </v-btn>
        </div>


        <SelConditions v-if = "(!isPreviewModeRef) && show_mata_ref"
            @click.stop
            ref = "sel_conds_ref"
            kind = "sectext"
            :owner_com_type = "props.com_type"
            v-model:md_owner_uuid = "familyIdRef"
            v-model:selCondMdsRef = "selCondMdsRef"
            v-on:req_mod_uuid = "onReqModUuid"
            v-on:req_load_uuid="onReqLoadUuid"
        >
        </SelConditions>


        <div 
            v-show = "show_findall_ref"
        >
          <v-list>
            <v-list-item v-for = "rec in fandall_rc_ref" :key = "rec.uuid"
            >
              <v-list-item-title>
                {{ rec.title }}
              </v-list-item-title>

              <v-list-item-subtitle>
                {{ rec.subtitle }}
                {{ rec.uuid }}
              </v-list-item-subtitle>

              <v-list-item-action>
                <v-btn icon @click="onRecordSelected(rec)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-list-item-action>

            </v-list-item>
          </v-list>
        </div>

      </div>
      <!-- END META, TOOL-BAR, LIST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->



      <!-- BEGIN コンテンツ実体 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
      <div
        class="content-container"
      >
        <v-container v-show="!isPreviewModeRef"
          class="simple_container"
        >
          <v-row class="search_bar">
            <v-col class="search_col">
              <v-text-field persistent-hint
                  v-model = "search_text_ref"
                  label = "Search Text"
                  :hint = "search_msg_ref"
                  :clearable = "true"
              >
              </v-text-field>
            </v-col>
            <v-col class="search_col">
              <v-btn class="simple_btn"
                  color = "primary"
                  @click = "onSearchText"
              > Search
              </v-btn>
            </v-col>
            <v-col class="search_col">
              <v-btn class="simple_btn"
                  color = "secondary"
                  @click = "onSearchPrevText"
              > Pre
              </v-btn>
            </v-col>
            <v-col class="search_col">
              <v-btn class="simple_btn"
                  color = "secondary"
                  @click = "onSearchNextText"
              > Next
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        
        <v-container class="simple_container"
          fluid 
        >
          <!-- 

            clearable
          -->
          <v-textarea auto-grow counter 
              ref           = "mii_text_ref"
              class         = "mii_svg"
              :placeholder  = "isPreviewModeRef ? '' : b.placeholder"
              :label        = "isPreviewModeRef ? '' : b.label"            
              v-model       = "b.text"
              :bg-color     = "htmsvg_outer_ref.background_color"
              :color        = "htmsvg_outer_ref.color"
              autocomplete  = "email"
          >
          </v-textarea>
        </v-container>

      </div>  <!-- END content-container -->
      <!-- END コンテンツ実体 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->




    </div> <!-- END earth_ref -->

  </div>
</template>


<script setup lang="ts">
import {
  effectScope, getCurrentScope, onScopeDispose, markRaw, toRaw, reactive, shallowReactive, shallowReadonly, isReactive, computed, shallowRef, triggerRef, customRef, ref, unref, toRef, toRefs, isRef,
  // defineExpose, defineProps, defineEmits,
  inject, onBeforeUpdate, watch, onMounted, onBeforeUnmount, nextTick
} from "vue";

import {
  useDraggable,
  useElementBounding,
  useEventListener,
  useMouse, useMousePressed, onKeyStroke, useMagicKeys, useMouseInElement, useParentElement, useElementSize, useActiveElement,
  whenever
} from '@vueuse/core'

import { v4 as uuidv4 } from "uuid";
import { Buffer } from 'buffer';
import { Base64 } from "js-base64";

import SelConditions from "./SelConditions.vue";  // 2023.12.08

const fsmService = inject('fsmService');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isDevModeRef = inject('isDevModeRef');
const isPreviewModeRef = inject('isPreviewModeRef');

// 2022.11.01 版： 子コンポーネントの add-edit-svg 呼び出すの代り、cmd をセットし、actived obj が自ら
// その cmd を実行するようにする。
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editCmdRef = inject('editCmdRef');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateEditCmd = inject('updateEditCmd');  // function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editCmdParasRef = inject('editCmdParasRef'); // object
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialEditCmdParas = inject('initialEditCmdParas'); // function

const actingEditRef = inject('actingEditRef');        // 2023.11.10
const actingEditEventRef = inject('actingEditEventRef');   // 2023.11.10
const colorPickerRef = inject('colorPickerRef');       // 2023.11.10

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editingObjRef = inject('editingObjRef');          // is_actived 系から移行させる
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateEditingObj = inject('updateEditingObj');    // function

const edit_sec_text_ref = inject('edit_sec_text_ref');

const appSpecRef: any = inject("appSpecRef");
const userCfgRef: any = inject("userCfgRef");
const appCfgRef: any = inject("appCfgRef");
const dbConRef: any = inject("dbConRef");

const DelayMSecWakeUp: any = inject("DelayMSecWakeUp");

const sel_conds_ref: any = inject("sel_conds_ref");  // 2023.12.14f DOM of SelConditions.vue

const selColorsRef: any = inject('selColorsRef');               // 2023.12.16a color picker info, 参考 const htmsvg_outer_ref
const initSelColorPicker: any = inject('initSelColorPicker');   // 2023.12.16a

const memoryEditStatRef: any = inject('memoryEditStatRef');   // 2024.01.01c
const memoryEditRef: any = inject('memoryEditRef');           // 2024.01.01c

const app_msg_ref: any = inject('app_msg_ref');

const selDocFileRef: any = inject('selDocFileRef');
const docFileName: any = inject('docFileName');

const galaxy_ref    = ref(null);    //
const earth_ref     = ref(null);    //
const moon_ref      = ref(null);    //

const mii_text_ref  = ref(null);    // 自分自身の ref

const able_pointed = defineModel<boolean>("able_pointed", { local: true, default: true })		// name able_pointed 使用, parent: v-model:able_pointed="able_pointed"

const menu_container_ref  = ref(null);
const menu_area_ref       = ref(null);
const menu_ref            = ref<any>(null);


const b = ref({
  label       : "暗号化可能なテキスト",
  placeholder : "Write text here",
  // icon        : "$vuetify",                              // 2024.01.06a 廃止
  text        : `日本語漢字 カタカナ ひらがな english`,
  pass        : "password123",                              // TODO
  encrypted   : { 'encrypted': '', 'iv': '', 'salt': '' },  // TODO
});

const search_text_ref = ref("");  // 2024.01.07a
const search_msg_ref = ref("検索テキストを入力してください");   // 2024.01.07a

const show_toolbar_ref = ref(false);  // show | hide 2023.12.25b

const familyZIndexRef = defineModel<any>("familyZIndexRef", { local: true, default: null });  // 2023.12.18a Family EdiyHtmlElem の z-index on EditHtmlFrame
console.log("######## familyZIndexRef value: " + familyZIndexRef.value);


//= svg | html 系統一的な変数
const prefer_posize_ref: any = ref(null);  // 2023.12.30a null | { x, y, w, h, transform} , 確定した位置とサイズ

const mii_htmsvg_ref = ref(null);  // 自分自身の ref
const htmsvg_dom_ref = ref(null);  // defineModel svg_ref of EditSvgDefs.vue
const htmsvg_container_ref = ref(null);  // defineModel htmsvg_container_ref of EditSvgDefs.vue

const htmsvg_inner_ref = b;   // alais

let madeInHis = false; // 2024.01.01a History から作成される時 true にする（History に追加されることを防ぐため） ※ 内容が変更された時、false にすることを忘れずに

const htmsvg_outer_ref = ref({  // 2024.01.08s DB Fix Save/Load ↓ .value にした ※ あくまでも初期値であって、watch で更新されることを期待している
  draw: htmsvg_inner_ref.value,         // 2024.01.08s

  z_index: familyZIndexRef.value,      // 2024.01.08s L-attrs のみ更新更新されるため、それ以外の watch(familyZIndexRef) 更新は不要; Family EdiyHtmlElem の z-index on EditHtmlFrame

  //= background_color color ※ 親 container earth_ref に（も）適用する TODO assets etc. 出力に適用させ
  //  "" | null | undefined の時、appCfgRef.back_color front_color を適用する
  //=
  background_color: "rgba(0, 0, 0, 0.0)", // 2023.12.16a ※ 旧 "black", 透明 if not is_root EditHtmlFrame  
  color: appCfgRef.value.front_color,     // 2023.12.16a ※ 旧 "white"

  // TODO style 情報
  // style: "fill:rgba(124, 237, 127, 0.15);stroke-width:1;stroke:rgba(33,33,255,1.0)"  // TODO R-Panel で実装する予定の属性
});


watch(htmsvg_inner_ref, (newVal) => { // 2024.01.08s
  console.log("htmsvg_inner_ref changed to: " + JSON.stringify(newVal));
  htmsvg_outer_ref.value.draw = newVal;
}, { deep: true });


// updateLPanelAttrs(); // 2024.01.06c L-attr に反映, onMounted へ移動した

const updateLPanelAttrs = () => { // 2024.01.06c L-attr に反映
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {  // 2024.01.06b
    console.log(`${uuidRef.value} L-Panel is not for me, do nothing!`);
    return;
  }

  console.log("#### ${uuidRef.value} updateLPanelAttrs");
  try {
    edit_sec_text_ref.value = structuredClone(htmsvg_outer_ref.value); // 2024.01.06c L-attr に反映

    //+ COLOR Tab, 2024.01.08b ここに移動した
    selColorsRef.value = {  // 2023.12.16a
      "background_color": htmsvg_outer_ref.value.background_color,  // 2023.12.16a ※実コンテンツの色ではなく、Editor の背景色であることに注意
      "color": htmsvg_outer_ref.value.color,
    }
    initSelColorPicker("background_color", htmsvg_outer_ref.value.background_color, uuidRef.value);  // 2023.12.16a
  } catch (e) {
    console.log("  error: " + e);
  }
}


watch(actingEditRef, (val) => { //  2023.12.16a
  if ((val.com_type != props.com_type) || (val.uuid != uuidRef.value)) {
    console.log(`changed actingEditRef is not  me, do nothing!`);
    return;
  }

  nextTick(() => {
    console.log("$$$$$$$$ actingEditRef changed to me, update L-attr htmsvg_outer_ref and selColorsRef"); // 2024.01.06b 
    updateLPanelAttrs(); // 2024.01.06c L-attr に反映
  })
}, { deep: true });


const mini_ctrl_ref = ref(null);


const show_mata_ref = ref(false);

const meta_title_ref = ref(null);
const meta_subtitle_ref = ref(null);
const meta_author_ref = ref(null);      // !!
const meta_version_ref = ref(null);     // !!
const meta_variation_ref = ref(null);   // !!
const meta_keywords_ref = ref(null);
const meta_groups_ref = ref(null);
const meta_passphrase_ref = ref(null);
const meta_expiration_ref = ref(null);

const md_title = ref("メモ");
const md_subtitle = ref("日々のメモ");
const md_author = ref("Example Author");           // !!
const md_version = ref("0.0.1");                    // !!
const md_variation = ref("normal");                 // !!
const md_keywords = ref("メモ");
const md_groups = ref("メモ");
const md_passphrase = ref("password123");
const md_expiration = ref("");


const selCondMdsRef = ref({
  title: toRef(md_title),
  subtitle: toRef(md_subtitle),
  author: toRef(md_author),
  version: toRef(md_version),
  variation: toRef(md_variation),
  keywords: toRef(md_keywords),
  groups: toRef(md_groups),
  passphrase: toRef(md_passphrase),
});


const fandall_rc_ref = ref([]);
const show_findall_ref = ref(false);


const { x: galaxy_x, y: galaxy_y, top: galaxy_top, right: galaxy_right, bottom: galaxy_bottom, left: galaxy_left, width: galaxy_width, height: galaxy_height } = useElementBounding(galaxy_ref);
const c = reactive({
  x: 0,
  y: 0,
  w: galaxy_width,
  h: galaxy_height,

  gx: galaxy_x,
  gy: galaxy_y,
  gtop: galaxy_top,
  gright: galaxy_right,
  gbottom: galaxy_bottom,
  gleft: galaxy_left,
});

watch(c, (val, oldVal) => { // SvgEditor resizing_frame サイズが反映されたと確認出来た 2023/06/14
  console.log("$$$$EditRectangle watch galaxy c val: " + val.w + " - " + + val.h + " oldVal: " + oldVal.w + " - " + + oldVal.h);
  console.log("  gx: " + val.gx + " gy: " + val.gy + " gtop: " + val.gtop + " gright: " + val.gright + " gbottom: " + val.gbottom + " gleft: " + val.gleft);
});

const viewBoxStr = computed(() => { return c.x + ' ' + c.y + ' ' + c.w + ' ' + c.h; });  // view-Box
const rootMinX = computed(() => { return c.x + 'px'; });           // foreignObject
const rootMinY = computed(() => { return c.y + 'px'; });           // foreignObject
const rootWidth = computed(() => { return (c.w + 'px'); });         // foreignObject, View-Port
const rootHeight = computed(() => { return (c.h + 'px'); });         // foreignObject, View-Port


// 親コンポーネントから子コンポーネントに文字列、数値、配列やオブジェクトを渡す
const props = defineProps({ // I/F: 親⇒子のデータの受け渡し
  com_type: { // edit_svg | edit_html_tag | ..
    type: String,
    default: "edit_sec_text",
  },

  // uuid: { // uuid は、このコンポーネントの一意の識別子です
  //   type: String,
  //   required: true,
  // },

  editing_uuid: {             // Able を含む上流の editor | elem の uuid
    type: String,
    required: true,
  },
  parent_uuid: {              // DB 上親特定用
    type: String,
    required: true,
  },
  editing_id: {               // is_editing := [ uuid, editing_id    ] MATCHING, Moaveable 動作中
    type: String,
    required: true,           //    親の editing_id と同一を保つことで、親の is_editing を追跡する
  },
  being_edit_id: {            // being_edit := [ uuid, being_edit_id ] MATCHING, コンテンツ操作中
    type: String,
    required: true,           //    親の being_edit_id と同一を保つことで、親の being_edit を追跡する
  },

  is_root: {
    type: Boolean,
    default: false,
  },
  able: { // true | false
    type: Boolean,
    default: false,
  },
  tag_name: { // div | span | ..
    type: String,
    default: "div",
  },
  tag_type: { // html_singleton | html_paired | raw_html | null
    type: String,
    default: "html_paired",
  },
  content: { // tag の中身
    type: String,
    default: "",
  },
})

console.log("@@@@@@@@ props: " + JSON.stringify(props));

//=  2023.11.18 familyIdRef
const familyIdRef = defineModel<any>("familyIdRef", { local: true, default: null });
// const uuidRef = computed(() => { return `${props.com_type}.${familyIdRef.value}`; });   // 2023.12.10 旧仕様
const uuidRef = computed(() => { return `${familyIdRef.value}`; });   // 2023.12.10 お試し
console.log("######## uuidRef value: " + uuidRef.value);

watch(familyIdRef, (v) => { // 2023.12.10a
  if (v) {
    console.log(`familyIdRef changed to ${familyIdRef.value}`);
    // actingEditRef.value.uuid = uuidRef.value;   // 必要か？
  }
})


const onReqModUuid = (new_uuid: string) => {  // 2024.01.09j v-on emit req_mod_uuid(new_uuid, save)  
  console.log(`onReqModUuid: ${new_uuid}`);

  //= Change to 新しい　uuid（現データをのまま使う）
  //  familyIdRef value 変更 ⇒ 遡って変更 ⇒ 当 instance 再作成（その際に、新しい uuid を持って　DB Load）となっているため、
  //  ここで、familyIdRef.value が変更される前で、新しい UUID で DB Save しておく。※1 Side 効果にご注意
  //    ご注意：familyIdRef.value が変更される前に、旧 UUID で DB Save していない ※2 あらかじめ手動で DB Save しておくと良い。
  //=
  saveDbContent(new_uuid);  // 2024.01.09j 現状の内容を新しい uuid で DB Save

  setTimeout(() => {  // 2023.12.11c 特別対策 load record 障害 when triggered by req_mod_uuid
    console.log("wake up");

    nextTick(() => {
      familyIdRef.value = new_uuid; // 2024.01.09j familyIdRef value 変更 ⇒ 遡って変更 ⇒ 当 instance 再作成（その際に、新しい uuid を持って　DB Load）
    })
  }, DelayMSecWakeUp.low); // !!
}


const onReqLoadUuid = (new_uuid: string) => {  // 2024.01.09j v-on emit req_load_uuid(new_uuid)  
  console.log(`onReqLoadUuid: ${new_uuid}`);

  //= 新しい　uuid の DB Load（現データを捨ててる）
  //  familyIdRef value 変更 ⇒ 遡って変更 ⇒ 当 instance 再作成（その際に、新しい uuid を持って　DB が Loadされる。
  //    ご注意：familyIdRef.value が変更される前に、DB Save していない ※ あらかじめ手動で DB Save しておくと良い。
  //=
  setTimeout(() => {  // 2023.12.11c 特別対策 load record 障害 when triggered by req_mod_uuid
    console.log("wake up");

    nextTick(() => {
      familyIdRef.value = new_uuid;
    })
  }, DelayMSecWakeUp.low); // !!
}



const emitedPosSizeRef = defineModel<any>("emitedPosSizeRef", { local: true, default: null });  // 位置とサイズが確定した, 旧 emit pos_size_decided
const deletedRef = defineModel<any>("deletedRef", { local: true, default: null });

const able_target_ref = defineModel<any>("able_target_ref", { local: true, default: null });  // the Moveable Target
const able_actmd_ref = defineModel<any>("able_actmd_ref", { local: true, default: null });  // 動作モード of the Moveable
const able_macro_ref = defineModel<any>("able_macro_ref", { local: true, default: null });  // in_ | out_ | io_, データ I/F of the Moveable


const emit = defineEmits([
  'props_updated',    // （uuid 以外の）props が更新された
  'deleted',          // 子コンポーネントが削除されたときに親コンポーネントに通知するためのイベントです
  'uuid_changed'      // 2023/10/09, oldValue, newValue
])


const is_editing = computed(() => {
  return (editingObjRef.value.uuid === props.editing_uuid && editingObjRef.value.editing_id === props.editing_id);
})

const being_edit = computed(() => {
  return (editingObjRef.value.uuid === props.editing_uuid && editingObjRef.value.editing_id === props.being_edit_id);
})

//= @click の位置、使える領域 :- e.clientXY - earth_ref.clientRect
//  v-menu
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const cmenu_use_loc_ref = ref(false);       // false := local area 表示 | true := global area (main_container) 表示
const attached_ref = ref('cmenuid' + getRandomInt(Number.MAX_SAFE_INTEGER));
const sel_cmenu_attach = computed(() => {
  return cmenu_use_loc_ref.value ? `#${attached_ref.value}` : '#rel_cmenu_attached';
})

const my_just_ref = ref({ x: 0, y: 0, w: 0, h: 0 });

const { current: currentKeySet } = useMagicKeys();


const onMeClick = (e: any) => {
  actingEditRef.value.com_type = props.com_type;
  actingEditRef.value.uuid = uuidRef.value;
  actingEditRef.value.familyId = familyIdRef.value;    // r/w お試し2023.11.19

  // console.log('######## onMeClick ' + " menu = " + cmenu.value);

  const clientRect = earth_ref.value.getBoundingClientRect();
  console.log("  me clientRect: left = " + Math.round(clientRect.left) + ", top = " + Math.round(clientRect.top));       //  .x, y も可
  console.log("  me clientRect: width = " + Math.round(clientRect.width) + ", height = " + Math.round(clientRect.height));    // 
  console.log('  e clientX = ' + e.clientX + ', clientY = ' + e.clientY);                                                     // 参考 .x y pageX Y screenX Y

  for (var value of currentKeySet) {  // control shift etc.
    console.log("  currentKeySet has: " + value);
  }

  const my_x = Math.round(e.clientX - clientRect.left);
  const my_y = Math.round(e.clientY - clientRect.top);
  my_just_ref.value = {
    x: my_x,
    y: my_y,
    w: Math.round(clientRect.width - my_x),
    h: Math.round(clientRect.height - my_y)
  }

  console.log("  my_just: " + JSON.stringify(my_just_ref.value));

  if (currentKeySet.has('control') && being_edit) {
    if (cmenu.value) {
      // menu.value = false; // TODO v-menu 次回? 表示障害
      console.log("Menu 表示中です、do nothing");
      return;
    }

    nextTick(() => {
      cmenu.value = true;
    })

    console.log("  menu changed: " + cmenu.value);
  }
}

const cmenu = ref(false);  // ref でないと、後に mouse move しない限り、menu は描画されない

const cmenuItems = ref([              // cmenu 名前になった経緯: context menu(right click) ⇒ click menu TODO menu: nested-menu
  { id: 'who_am_i',             visible: true,  name: 'EditSecText ' + uuidRef.value },  //

  //= 必要と判明したら、投入して下さい 
  { id: 'off_able_pointer',     visible: true,   name: 'Disable Resize'       },
  { id: 'on_able_pointer',      visible: true,   name: 'Enable Resize'        },

  { id: 'listup',               visible: true, name: 'Listup '               },        // 一覧表示 TODO 3)

  { id: 'save_db',              visible: true,   name: 'Save It to DB'       },        // !! TODO
  { id: 'load_db',              visible: true,   name: 'Load It from DB'  },       // !! TODO
  { id: 'remove_it',            visible: true,   name: 'Delete'            },       // 親ノードから切り離す（DBにはそのまま残す）
  { id: 'delete_db',            visible: true,   name: 'Delete It From DB'     },      // ↑＋ TODO

  { id: 'download_cleartext',   visible: true,   name: 'Download Text File'  },
  { id: 'upload_cleartext',     visible: true,   name: 'Upload Text File'  },  
  
  { id: 'download_ciphertext',  visible: true,   name: 'Download Encrypted File' },
  { id: 'upload_ciphertext',    visible: true,   name: 'Upload Encrypted File' },

  
  // { id: 'load_bin_file',    visible: true,   name: 'Load Biniary File'    },       // 【次期】biniary ⇒ hex text ⇒ save_ciphertext
  // { id: 'save_bin_file',    visible: true,   name: 'Save Biniary File'    },       // 【次期】ciphertext ⇒ plaintext(hex) ⇒ biniary
  
  // { id: 'save_cipher_png',  visible: true,   name: 'Save Ciphertext .png File' },  // 【次期】暗号化データを含む .png 作成, 離散化 Ciphertext を含むデータ
  // { id: 'load_cipher_png',  visible: true,   name: 'Load Ciphertext .png File' },  // 【次期】復元
  // { id: 'save_qrcode',      visible: true,   name: 'Save QR-Code File'    },       // 【次期】
  // { id: 'load_qrcode',      visible: true,   name: 'Load QR-Code File'    },       // 【次期】
  // { id: 'save_4dqrcode',    visible: true,   name: 'Save 4D-QR-Code File' },       // 【次期】拡張フォーマット QR Code
  // { id: 'load_4dqrcode',    visible: true,   name: 'Load 4D-QR-Code File' },       // 【次期】復元  
  // { id: 'config',           visible: true,   name: 'Config'               },       // in/out dir, key file, TODO global config に取り込む
  // TODO AI 機能
  // TODO 文字コード、改行コード変換
  // TODO diff view


  //= BEGIN 親の MoveAble を制御する
  { id: 'DEFAULT',          visible: false, name: 'Sel DEFAULT'         },
  { id: 'Resizable',        visible: false, name: 'Sel Resizable'       },
  { id: 'Scalable',         visible: false, name: 'Sel Scalable'        },

  { id: 'Warpable',         visible: false, name: 'Sel Warpable'        },
  { id: 'Clippable',        visible: false, name: 'Sel Clippable'       },
  { id: 'Roundable',        visible: false, name: 'Sel Roundable'       },
  
  { id: 'Dra_Res',          visible: false, name: 'Sel Draggable Resizable' },
  { id: 'Dra_Res_Rot',      visible: false, name: 'Sel Draggable Resizable Rotatable' },
  { id: 'Dra_Sca',          visible: false, name: 'Sel Draggable Scalable' },
  { id: 'Dra_Sca_Rot',      visible: false, name: 'Sel Draggable Scalable Rotatable'  },
  { id: 'All_In_One',       visible: false, name: 'Sel All In One' },
  //= END 親の MoveAble を制御する
]);


const shouldShow = (item) => {
  let showIt = true;

  if (item.id === 'who_am_i') {
    if (!isDevModeRef.value) {
      showIt = false;
    }
  }

  if (!item.visible) {
    showIt = false;
  }

  if (item.id === 'take_away_ctrl') {
    if (ctrl_on_other.value) {
      showIt = false;
    }
  } else if (item.id === 'give_back_ctrl') {
    if (!ctrl_on_other.value) {
      showIt = false;
    }
  }

  return showIt;
}


const onCmenuItemClick = async (cmd: any) => {
  console.log('^^^^^^^^^ id: ' + cmd.id + ' name: ' + cmd.name);

  var item = {}

  switch (cmd.id) {
    case 'who_am_i': break;
    case 'save_db':
      saveDbContent(null);
      break;
    case 'load_db':
      loadDbContent(false, '', false);
      break;
    case 'listup':
      loadDbRecList();
      break;
    case 'remove_it':
      deletedRef.value = true;
      break;

    case 'delete_db': // !! 2023.12.14c
      if (sel_conds_ref.value == null) {  // 2023.12.14c
        console.log("sel_conds_ref.value is null, do nothing!");
        return;
      }

      await sel_conds_ref.value.deleteFromDb();
      nextTick(() => {
        familyIdRef.value = null;
        deletedRef.value = true;
      })
      break;

    case 'off_able_pointer':
      able_pointed.value = false;
      b.value.label = `..able is ${props.editing_uuid}, ap is ${able_pointed.value}; Plain Text`;   // debug
      break;
    case 'on_able_pointer':
      able_pointed.value = true;
      b.value.label = `..able is ${props.editing_uuid}, ap is ${able_pointed.value}; Plain Text`;   // debug
      break;
    case 'download_cleartext':
      saveClearTextFile();      // to save _ to 'C:\\DOCs\\SvgEditor\\exam01.txt' 
      break;
    case 'upload_cleartext':
      loadClearTextFile();      // to load 'C:\\DOCs\\SvgEditor\\exam01.txt'
      break;
    case 'download_ciphertext':
      saveCipherTextFile();     // 暗号化, to save _ to 'C:\\DOCs\\SvgEditor\\exam01.txt' 
      break;
    case 'upload_ciphertext':
      loadCipherTextFile()      // 復号
      break;

    case 'DEFAULT':
    case 'Resizable':
    case 'Scalable':
    case 'Warpable':
    case 'Clippable':
    case 'Roundable':
    case 'Dra_Res':
    case 'Dra_Res_Rot':
    case 'Dra_Sca':
    case 'Dra_Sca_Rot':
    case 'All_In_One':
      able_actmd_ref.value = cmd.id;
      break;

    default:
      break;
  }

  menu_ref.value.isActive = false;
  cmenu.value = false;
}


//= cmenu.id 該当の event
watch(actingEditEventRef, (val) => {
  console.log("$$$$$$$$ watch actingEditEventRef");
  if (!val) {
    console.log(`val is ${val}, do nothing!`);
    return;
  };

  if (!((val.com_type == props.com_type) && (val.uuid == uuidRef.value))) {
    console.log(`is not for me, do nothing!`);
    return;
  }

  console.log(`  val: ${JSON.stringify(val)}`);

  if (val.cate == 'ui') {
    switch (val.event) {
      case 'show':
        show_mata_ref.value = true;
        break;
      case 'hide':
        show_mata_ref.value = false;
        break;
      case 'toggleToolBar': // !! 2023.12.25b
        show_toolbar_ref.value = !show_toolbar_ref.value;
        break;

      case 'undo':  // !! 2023.12.30a
        undo();
        break;
      case 'redo':  // !! 2023.12.30a
        redo();
        break;
      case 'decidePosSize':  // !! 2023.12.30a
        decidePosSize();
        break;
      case 'memory':  // 2024.01.01c
        console.log("memory");
        memoryEditRef.value['com_type'] = props.com_type;
        memoryEditRef.value['uuid'] = uuidRef.value;
        saveDbContent(null);
        break;
      default:
        console.log(`unknown event: ${val.event}`);
        break;
    }

    return;
  }

  if (!(["inout", "able", "add", "database"].includes(val.cate))) {
    console.log(`not maching cate, do nothing!`);
    return;
  }

  let item = null, cmd = null;

  //= cmenu id を特定する
  for (var cm of cmenuItems.value) {
    if (cm["id"] == val.event) {
      cmd = cm;
      break;
    }
  }

  //= onCmenuItemClick 参照
  if (cmd != null) {
    onCmenuItemClick(cmd);
  } else {
    console.log("cmenu id が特定できませんでした..");
  }

});


watch(edit_sec_text_ref, (newVal) => { // 2023.12.19a
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {  // 2024.01.06b
    // console.log(` not changed for my L-htmsvg_outer_ref, do nothing!`);
    return;
  }   

  htmsvg_outer_ref.value = { ...newVal };
  familyZIndexRef.value = Number(newVal["z_index"]); // !!
  console.log(`$$$$ watch edit_sec_text_ref: htmsvg_outer_ref.value updated to ${JSON.stringify(htmsvg_outer_ref.value, null, 2)}`);
}, { deep: true });


async function saveClearTextFile() {
  const fileName = docFileName();
  console.log("saveClearTextFile " + fileName);

  const payload = JSON.stringify(
    {
      sec_uuid: uuidRef.value,
      sec_text: b.value.text,
    }
  )

  const content = Buffer.from(payload).toString('base64');

  const sendData = {
    fileName: fileName,
    content: content
  };

  const result = await window.unipyapi.writeTextFile(sendData);
  console.log("  result: " + JSON.stringify(result));
  app_msg_ref.value = result["readed_data"] != null ? `Exit Code: ${ result["readed_data"]["exit_code"] }, File: ${result["readed_data"]["path"]}` : `Code: ${result["code"]}, success: ${result["success"]}, Message: ${result["err"]}, File: ${fileName}`;
}


async function loadClearTextFile() {
  const fileName = docFileName();
  console.log("loadClearTextFile " + fileName);

  const payload = JSON.stringify(
    {
      sec_uuid: uuidRef.value,
      sec_text: b.value.text,   // used to debug
    }
  )

  const content = Buffer.from(payload).toString('base64');

  const sendData = {
    fileName: fileName,
    content: content
  };

  const result = await window.unipyapi.readTextFile(sendData);  // .text_data
  console.log("  result: " + JSON.stringify(result, null, 2));
  const text_data = Base64.decode(result["readed_data"]["text_data"]);
  b.value.text = text_data;
  app_msg_ref.value = result["readed_data"] != null ? `Exit Code: ${result["readed_data"]["exit_code"]}, File: ${result["readed_data"]["path"]}` : `Code: ${result["code"]}, success: ${result["success"]}, Message: ${result["err"]}, File: ${fileName}`;
}


async function loadCipherTextFile() {   // 復号
  const fileName = docFileName();
  console.log("loadCipherTextFile " + fileName);

  const payData = {
      name      : 'readCipherTextFile',
      sec_uuid  : uuidRef.value,
      sec_pass  : b.value.pass,
      encrypted : b.value["encrypted"],
      sec_text  : b.value.text,        // used to debug
  }

  const payload = JSON.stringify(payData);
  console.log(`payload: ${payload}`);

  const content = Buffer.from(payload).toString('base64');

  const sendData = {
    fileName: fileName,
    content: content
  };

  const result = await window.unipyapi.readCipherTextFile(sendData);  // .decrypted
  console.log("  result: " + JSON.stringify(result, null, 2));
  const text_data = Base64.decode(result["readed_data"]["decrypted"]);
  console.log(`text_data: ${text_data}`)
  b.value.text = text_data;
  app_msg_ref.value = result["readed_data"] != null ? `Exit Code: ${result["readed_data"]["exit_code"]}, File: ${result["readed_data"]["path"]}` : `Code: ${result["code"]}, success: ${result["success"]}, Message: ${result["err"]}, File: ${fileName}`;
}


async function saveCipherTextFile() {   // 暗号化
  const fileName = docFileName();
  console.log("saveCipherTextFile " + fileName);

  const payload = JSON.stringify(
    {
      sec_uuid: uuidRef.value,
      sec_text: b.value.text,
      sec_pass: b.value.pass,
    }
  )

  const content = Buffer.from(payload).toString('base64');

  const sendData = {
    fileName: fileName,
    content: content
  };

  const result = await window.unipyapi.writeCipherTextFile(sendData);   // .encryptedData ;=  {'encrypted': '', 'iv': '', 'salt': ''}
  b.value["encrypted"] = result["readed_data"]["encryptedData"]
  console.log("  b: " + JSON.stringify(b.value, null, 2));
  console.log("  result: " + JSON.stringify(result, null, 2));
  app_msg_ref.value = result["readed_data"] != null ? `Exit Code: ${result["readed_data"]["exit_code"]}, File: ${result["readed_data"]["path"]}` : `Code: ${result["code"]}, success: ${result["success"]}, Message: ${result["err"]}, File: ${fileName}`;
}


const toggleShowMeta = () => {
  show_mata_ref.value = !show_mata_ref.value;
}


watch(md_passphrase, (val, oldVal) => {
  console.log("md_passphrase changed: " + val + " oldVal: " + oldVal);
  b.value.pass = val;
  // TODO encrypted, DB 更新
});


const loadDbRecList = async () => { // 2023.12.08 async function sql_load_rec_list( の削除も忘れずに
  if (sel_conds_ref.value == null) {
    console.log("sel_conds_ref.value is null, do nothing!");
    return;
  }

  const recordset = await sel_conds_ref.value.loadDbRecList();

  console.log(`loadDbRecList: ${JSON.stringify(recordset)}`);

  fandall_rc_ref.value = recordset;
  show_findall_ref.value = true;
}


const applyDomPosSize = (dom, pos_size) => {
  let style;
  //= 参考 2023/11/07
  // dom.request("draggable", { deltaX: pos_size["x"], deltaY: pos_size["y"] }, true);  ※ TODO 動作しない
  // 取りあえず、下記のように実装
  //=
  style = `display: block; position: absolute; left: ${pos_size["x"]}px; top: ${pos_size["y"]}px; width: ${pos_size["w"]}px; height: ${pos_size["h"]}px;`;
  dom.setAttribute("style", style);

  if ((pos_size["transform"] != "") && ("style" in dom)) {
    dom.style.transform = pos_size["transform"];
  }
}



const decidePosSize = () => { // 2023.12.30a
  console.log("$$$$ decidePosSize");
  const pos_size = domPosSize(able_target_ref.value, true);  // 2023.12.30a true := no_prefer
  prefer_posize_ref.value = pos_size;
  console.log("  prefer_posize_ref: " + JSON.stringify(prefer_posize_ref.value, null, 2));
  app_msg_ref.value = `Position & Size Decided: ${JSON.stringify(prefer_posize_ref.value, null, 2)}`;
}


const { Ctrl_T } = useMagicKeys();  // 2023.12.30a
watch(Ctrl_T, (v) => {
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {
    console.log(` not for me Ctrl_T, do nothing!`);
    return;
  }

  console.log("$$$$ Ctrl_T watch: " + v);
  if (v) {
    console.log('(Ctrl_T has been pressed, decidePosSize!');
    decidePosSize();
  }
}, { deep: true });


const { Ctrl_O } = useMagicKeys();  // 2023.12.30a
watch(Ctrl_O, (v) => {
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {
    console.log(` not for me Ctrl_O, do nothing!`);
    return;
  }

  console.log("$$$$ Ctrl_O watch: " + v);
  if (v) {
    prefer_posize_ref.value = null;
    console.log('(Ctrl_O has been pressed, prefer_posize_ref.value be initialized!');
  }
}, { deep: true });


const domPosSize = (dom, no_prefer = false) => {     // 2023.12.30a dom := ref.value of dom, e.g target of MoveAble
  console.log("domPosSize dom is null: " + (dom == null) + " no_prefer: " + no_prefer);
  let pos_size;

  if (dom == null) {  // 1) 新規作成の時
    console.log("  適当な値を入れておく");
    pos_size = { x: 0, y: 0, w: 96, 64: 0, transform: "" };  // 適当な値を入れておく
  } else if ((!no_prefer) && (prefer_posize_ref.value != null)) { // 2) 決定された pos/size を使う
    console.log("  prefer_posize_ref.value is not null, use it");
    pos_size = structuredClone(prefer_posize_ref.value);
  } else {  // 3) dom の pos/size を使う
    console.log("  dom の pos/size を使う");
    pos_size = {
      x: dom.offsetLeft,      // 36
      y: dom.offsetTop,       // 104
      w: dom.offsetWidth,     // 
      h: dom.offsetHeight,    // 
    };

    //= transform
    if (("style" in dom) && ("transform" in dom.style)) {   // object.style.transform := MoveAble, e.g `transform: scale(2, 0.5);`
      pos_size['transform'] = dom.style.transform;
    } else {
      pos_size['transform'] = "";  // !!
    }
  }

  return pos_size;
}



const saveDbContent = (mod_uuid, self_only = false) => {    // 2023.12.10a + mod_uuid
  console.log("saveContent mod_uuid: " + mod_uuid + " self_only: " + self_only);

  let uuid = uuidRef.value;
  if (mod_uuid != null) {
    uuid = mod_uuid;
  }
  console.log("  uuid: " + uuid);


  const pos_size = domPosSize(able_target_ref.value);   // !! 2023/11/07

  const item = {
    uuid: uuid,                         // 2023.12.10a key 
    parent_uuid: props.parent_uuid,     // !! 2023/10/11
    com_type: props.com_type,           // !!
    is_root: props.is_root,             // !! 2023/10/09
    pos_size: pos_size,                 // 自らの pos/size 
    meta: {
      title: md_title.value,
      subtitle: md_subtitle.value,
      author: md_author.value,
      version: md_version.value,
      variation: md_variation.value,
      keywords: md_keywords.value,
      groups: md_groups.value,
      expiration: md_expiration.value,  // !! SecText Only
      passphrase: md_passphrase.value,  // !! SecText Only
    },
    // children: [] as any[],             // !! EditSecText には無し 2023/10/12
    content: {
      jdata: JSON.stringify({
        inner: htmsvg_outer_ref.value,       // 2024.01.08s inner := htmsvg_outer_ref
      }),
      // TODO 他の html/svg 埋め込み関連データ
    }
  }

  console.log("  item: " + JSON.stringify(item, null, 2));
  sql_save_content(item, self_only);
}


const loadDbContent = (self_only = false, recordUuid = "", useRecordUuid = false) => {   // 2024.01.01c on btnLoad DB
  //=
  //  useRecordUuid: ※ 2024.01.01c 現時点で、true で呼び出す必要な時がない（↓コメント参考）
  //    1) true  ⇒ recordUuid は uuidRef.value にする　※ recordUuid が "" の時は、uuidRef.valueで DB Load するので、実際に uuidRef.value は変更しない
  //    2) false ⇒ 別 recordUuid のデータだけ取得し、uuidRef.value は変更しない ※ Memory 機能で使用している、この時、読み込んだデータの uuid を廃棄する必要がある
  //=
  const item = {
    uuid: recordUuid != "" ? recordUuid : uuidRef.value,   // !! key
    // parent_uuid: props.parent_uuid,     // !! 2023/10/11
    com_type: props.com_type,           // !!
  };

  console.log("loadContent " + JSON.stringify(item, null, 2));
  sql_load_content(item, self_only);
}


async function sql_save_content(item, self_only = false) {
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
  app_msg_ref.value = result["readed_data"] != null ? `Exit Code: ${result["readed_data"]["exit_code"]}, Operation: ${sendData["sql_req"]["op"]}` : `Code: ${result["code"]}, success: ${result["success"]}, Message: ${result["err"]}, Operation: ${sendData["sql_req"]["op"]}`;
}


async function sql_load_content(item, self_only = false) {
  console.log("sql_load_content");

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

  const result = await window.unipyapi.rwSqlContent(sendData);  // .text_data
  console.log("  result: " + JSON.stringify(result, null, 2));
  app_msg_ref.value = result["readed_data"] != null ? `Exit Code: ${result["readed_data"]["exit_code"]}, Operation: ${sendData["sql_req"]["op"]}` : `Code: ${result["code"]}, success: ${result["success"]}, Message: ${result["err"]}, Operation: ${sendData["sql_req"]["op"]}`;
  
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
  console.log("  recordset: " + JSON.stringify(recordset, null, 2));

  if (recordset.length == 0) {
    console.log("  recordset.length == 0");
    return;
  } else if (recordset.length > 1) {
    console.log("  recordset.length > 1");
    return;
  }

  const record = recordset[0];
  //=
  // {
  //   "id": 4,
  //   "uuid": "95929ddb-726e-4fce-8523-e120e61a7ba3",
  //   "text": "日本語漢字 カタカナ ひらがな english",
  //   "encrypted": "{\"encrypted\": \"\", \"iv\": \"\", \"salt\": \"\"}",
  //   "pos_size": "{\"x\": 370, \"y\": 11, \"w\": 539, \"h\": 898}",
  //   "title": "メモ",
  //   "subtitle": "日々のメモ",
  //   "keywords": "メモ",
  //   "groups": "メモ",
  //   "passphrase": "password123",
  //   "expiration": ""
  // }
  //=

  md_title.value = record["title"];
  md_subtitle.value = record["subtitle"];
  md_keywords.value = record["keywords"];
  md_author.value = record["author"];
  md_version.value = record["version"];
  md_variation.value = record["variation"];
  md_groups.value = record["groups"];
  md_passphrase.value = record["passphrase"];
  md_expiration.value = record["expiration"];

  //= 旧コード
  // b.value.encrypted = JSON.parse(record['encrypted']);
  // b.value.text = record['size'];  // !! 2023-10-12
  //=
  const my_jdata = JSON.parse(record["jdata"]);
  htmsvg_outer_ref.value = my_jdata['inner'];           // 2024.01.08s 
  htmsvg_inner_ref.value = my_jdata['inner']['draw'];   // 2024.01.08s ※ watch で 余計な htmsvg_outer_ref.value に再び反映が行われるが、とりあえず、このまま
  familyZIndexRef.value = Number(my_jdata['inner']["z_index"]); // !!
  
  updateLPanelAttrs(); // 2024.01.06c L-attr に反映
  
  let pos_size, dom;

  dom = able_target_ref.value;
  pos_size = JSON.parse(record['pos_size']);
  applyDomPosSize(dom, pos_size); // 自らの x y w h trans 
}


const onRecordSelected = (record) => {
  console.log("onFindallItemClick " + JSON.stringify(record, null, 2));

  md_title.value = record["title"];
  md_subtitle.value = record["subtitle"];
  md_keywords.value = record["keywords"];
  md_groups.value = record["groups"];

  my_just_ref.value = record["pos_size"];

  emit('uuid_changed', record["uuid"], uuidRef.value);

  //= 【2023-10-12】EditHtml.vue では、子 EditSvgEmbed 等 uuid は変更出来ない（固定 elem -> html -> 子 dot 仕様なので）
  //  遡って EditHtml.vue を上書き出来なく、uuidRef.value を修正出来ず、当関数は、下記の何れかになる：
  //  1) Debug 機能：uuidRef.value と record.uuid の 違いを許容する（即ち、record.uuid を無視する）
  //  2) 本 機能：record.uuid を無視する、または、
  //  3) 本 機能：uuidRef.value を DB の同 record に強制的上書き　※ 左記 record が再利用される予想なので、左記の処理を実行すべきではない
  //=
  // emit('uuid_changed', record["uuid"], uuidRef.value);

  show_findall_ref.value = false;

  nextTick(() => {
    loadDbContent(false, record["uuid"], false);
  })
}


// const makeRawContentJson = (rootContainerRequired) => {
//   console.log("makeRawContentJson");

//   const meta = {};
//   meta['com_type'] = props.com_type;
//   meta['uuid'] = uuidRef.value;
//   meta['kind'] = 'dict';      // myjson := 独自仕様 json | dict := dict | tipjson := TipTap Json | html := html text | css := css text | svg := svg text
//   meta['version'] = "0.0.1";
//   meta['istext'] = false;     // json-text | object
//   meta['raw'] = {
//     html: `<pre>${b.value.text}</pre>`,
//   }
//   return meta;
// }



defineExpose({
  // galaxy_ref,
  // makeRawContentJson,
  saveDbContent,
  loadDbContent,
})


const { escape } = useMagicKeys();

watch(escape, (v) => {
  if (v) {
    // console.log('escape has been pressed');
    show_findall_ref.value = false;
  }
})


watch(selColorsRef, (val) => {  // 2023.12.16a !!
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {
    console.log(` not for me changed selColorsRef, do nothing!`);
    return;
  }

  nextTick(() => {
    console.log("selColorsRef changed to ", JSON.stringify(val, null, 2));
    htmsvg_outer_ref.value.background_color = val["background_color"];
    htmsvg_outer_ref.value.color = val["color"];
  })
}, { deep: true })  // deep: true で、ネストしたオブジェクトの変更も監視する


//= BEGIN 2023.12.19v Edit History 機能 ----------------------------------------------------->
//  Edition 0.1 2023.12.19v
//    1) 【制限】domPosSize で、transform は、対応していない
//    2) 【仕様】undo, redo は、完全なデータコピーであり、それ以降の編集は、undo, redo の記憶に影響しない（再取り出し可能）
//    3) 【仕様】Historyサイズは、設けていない（メモリ不足になる可能性がある、アプリ起動毎にクリアされる）
//    4) 【仕様】データ記憶は、ui 操作中（actingEditRef 参照）しか行わない
//          初期記憶を除く
//    

//+ History 記憶データ
const historyRef = ({
  data: [] as object[],     // { timestamp: 保存時time, oulter: htmsvg_outer_ref.value, ...保留 }
  cur_index: -1,            // 編集中データ := data[cur_index], 初期値は、-1（データなし）
  busy_cnt: 0,              // undo, redo が連続して呼ばれるのを防ぐ
});


//+ Write entry to historyRef
const pushDataToHistory = () => {
  // console.log("pushDataToHistory");

  const ot = unref(htmsvg_outer_ref.value);

  const data = {
    timestamp: Date.now(),
    //++ oulter := ディープコピー  of htmsvg_outer_ref.value, 下記のいずれかを選択して下さい（各方法の制限に注意）
    // oulter: JSON.parse(JSON.stringify(ot)),   // basic
    // oulter: _.cloneDeep(ot),                  // lodash library 
    // oulter: { ...ot },                        // お試し
    oulter: structuredClone(ot),              // js 新しい structuredClone

    // ...保留
  }

  historyRef.data.push(data);
  historyRef.cur_index = historyRef.data.length - 1;  // 編集中データ := data[cur_index]

  // console.log("  historyRef: " + JSON.stringify(historyRef, null, 2));
}


//+ Read the cursor entry from historyRef and apply it to htmsvg_outer_ref
const applyDataFromHistory = () => {
  console.log("applyDataFromHistory");

  if (historyRef.cur_index < 0) {
    console.log("  historyRef.cur_index < 0, do nothing!");
    return;
  }

  if (historyRef.cur_index >= historyRef.data.length) {
    console.log("  historyRef.cur_index >= historyRef.data.length, do nothing!");
    return;
  }

  const data = historyRef.data[historyRef.cur_index];
  console.log("  data: " + JSON.stringify(data, null, 2));

  nextTick(() => {
    const ot = unref(data["oulter"]);
    htmsvg_outer_ref.value = structuredClone(ot);
    madeInHis = true;  // 2024.01.01a
    console.log("  madeInHis: " + madeInHis);
    console.log("  After cur_index: " + historyRef.cur_index);
  })
}


//+ htmsvg_outer_ref が変わる度に記憶する
watch(htmsvg_outer_ref, (newVal, oldVal) => {
  //++
  //  4) 【仕様】データ記憶は、ui 操作中（actingEditRef 参照）しか行わない
  //      ⇒問題あれば、当条件を外すこと検討して下さい
  //++
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {
    console.log(` not for me changed htmsvg_outer_ref, do nothing!`);
    return;
  }

  if (newVal == null) {
    console.log(` newVal is null, do nothing!`);
    return;
  }

  // if (newVal == oldVal) { // !! 動作するか確認
  //   console.log(` newVal == oldVal, do nothing!`);
  //   return;
  // }

  if (madeInHis) {  // 2024.01.01a
    madeInHis = false;
    console.log(` madeInHis, change madeInHis to ${madeInHis} then return!`);
    return;
  }

  if (historyRef.busy_cnt > 0) {
    console.log(` historyRef.busy_cnt > 0, do nothing!`);
    historyRef.busy_cnt -= 1;
    return;
  }

  // console.log(`htmsvg_outer_ref changed from ${JSON.stringify(oldVal, null, 2)} to ${JSON.stringify(newVal, null, 2)}, push it to historyRef`);
  nextTick(() => {
    pushDataToHistory();
  })
}, { deep: true })


//+ Undo := ctrl + z
const undo = () => {
  //++
  //  工作領域 <= .data[cur_index - 1]
  //++
  console.log("undo");

  if (historyRef.cur_index < 0) {
    console.log("  historyRef.cur_index < 0, do nothing!");
    return;
  }

  historyRef.busy_cnt += 1; // 連続して呼ばれるのを防ぐ

  historyRef.cur_index -= 1;
  applyDataFromHistory();
  console.log("  After cur_index: " + historyRef.cur_index);
}

const { Ctrl_Z } = useMagicKeys();
watch(Ctrl_Z, (v) => {
  if (v) {
    if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {
      console.log(` Ctrl_Z has been pressed, but not for me changed htmsvg_outer_ref, do nothing!`);
    } else {
      console.log('(Ctrl_Z has been pressed, do undo');
      undo();
    }
  }
})


//+ Redo := ctrl + y
const redo = () => {
  //++
  //  工作領域 <= .data[cur_index + 1]
  //++
  console.log("redo");

  if (historyRef.cur_index == historyRef.data.length - 1) {
    console.log("  historyRef.cur_index == historyRef.data.length - 1, do nothing!");
    return;
  }

  historyRef.busy_cnt += 1; // 連続して呼ばれるのを防ぐ

  historyRef.cur_index += 1;
  applyDataFromHistory();
  console.log("  After cur_index: " + historyRef.cur_index);
}

const { Ctrl_Y } = useMagicKeys();
watch(Ctrl_Y, (v) => {
  if (v) {
    if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {
      console.log(` Ctrl_Y has been pressed, but not for me changed htmsvg_outer_ref, do nothing!`);
    } else {
      console.log('(Ctrl_Y has been pressed, do redo');
      redo();
    }
  }
})

//+ 初期データを記憶する
nextTick(() => {
  pushDataToHistory();
})

//= END 2023.12.19v Edit History 機能 <-------------------------------------------------------


//= BEGIN 検索機能 2024.01.07a --------------------------------------------------------------->
// このコードは、検索されたテキストのすべてのインデックスを searchIndices 配列に格納し、currentSearchIndex を使用して現在選択されている検索結果を追跡します。
// onSearchNextText と onSearchPrevText メソッドは、このインデックスを使用して前後の検索結果を選択します。
// このロジックを実装する際には、検索結果がない場合や、検索テキストが変更された場合の処理を適切に行うことが重要です。
// また、ユーザーがテキストを編集した場合には、検索結果のインデックスを更新する必要があるかもしれません。

let currentSearchIndex = -1;
const searchIndices = [];


const onSearchText = () => {
  console.log("$$$$ onSearchText");

  //= 検索ロジック 
  const searchText = search_text_ref.value;
  console.log(`searchText: ${searchText}`);

  const content = b.value.text;
  console.log(`content: ${content}`);

  if (!searchText) {
    search_msg_ref.value = "検索テキストが空です";
    return; // 検索テキストが空の場合は何もしない
  }

  // 検索結果のインデックスをリセット
  searchIndices.length = 0;
  let startIndex = 0;
  let index;

  while ((index = content.indexOf(searchText, startIndex)) !== -1) {
    searchIndices.push(index);
    startIndex = index + searchText.length;
  }

  console.log(`searchIndices: ${JSON.stringify(searchIndices)}`);

  currentSearchIndex = 0; // 最初の検索結果に設定
  selectSearchText();
}


const onSearchNextText = () => {
  if (searchIndices.length > 0 && currentSearchIndex < searchIndices.length - 1) {
    currentSearchIndex++;
    selectSearchText();
  }
};


const onSearchPrevText = () => {
  if (searchIndices.length > 0 && currentSearchIndex > 0) {
    currentSearchIndex--;
    selectSearchText();
  }
};


const selectSearchText = () => {
  const textarea = mii_text_ref.value;  // DOM
  const index = searchIndices[currentSearchIndex];

  if (textarea && index !== undefined) {
    textarea.focus();
    textarea.setSelectionRange(index, index + search_text_ref.value.length);
  } else {
    search_msg_ref.value = "検索結果がありません";
  }

  console.log(`currentSearchIndex: ${currentSearchIndex}`);

  if (searchIndices.length > 0) {
    search_msg_ref.value = `検索結果: ${searchIndices.length} 件, ${currentSearchIndex + 1} 件目`;
  } else {
    search_msg_ref.value = "検索結果: 0 件";
  }  
};

//= END 検索機能 2024.01.07a <----------------------------------------------------------------


onMounted(async () => { // after DOM nodes be inserted
  await nextTick();
  console.log('$$$$$$$$' + props.com_type + ' ' + uuidRef.value + ' is mounted, v-textarea DOM:');
  console.log(mii_text_ref.value);

  updateLPanelAttrs(); // 2024.01.06c L-attr に反映 

  console.log(`memoryEditStat: ${memoryEditStatRef.value}`);
  console.log(`memoryEdit: ${JSON.stringify(memoryEditRef.value, null, 2)}`);

  if (memoryEditStatRef.value && (memoryEditRef.value["com_type"] == props.com_type)) {  // 2024.01.01c
    const memoryUuid = memoryEditRef.value["uuid"];
    console.log(`  Load DB memoryUuid: ${memoryUuid}`);
    loadDbContent(false, memoryUuid, false);
  } else {
    console.log(`  Load DB default uuid: ${uuidRef.value}`);
    loadDbContent(false, uuidRef.value, false);
  }

  selDocFileRef.value = { type: "text", name: "noname.txt", placeholder: "noname.txt" };
})


onBeforeUnmount(() => {
  console.log(props.com_type + ' ' + uuidRef.value + ' is unmounted!');
})

</script>



<style lang="scss" scoped>

// 全ての要素にborder-boxを適用させておく設定
*, *:before, *:after {
  box-sizing: border-box;
}

.galaxy {
    position: relative;
    display: block;
    background-color: v-bind("htmsvg_outer_ref.background_color") !important;   // 2023.12.16a Editorの背景色
    color: v-bind("appCfgRef.color") !important;                                // 2023.12.16a Editorの前景色
}

.svg_events {
    pointer-events: all;
}

.html_events {
    pointer-events: auto;
} 


.client_decided {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    background-color: rgba(0, 0, 0, 0); // 2023.12.16a 一般的、透明にすることで、本物の背景色 (earth)editor_canvas を邪魔させない　
}


.who_am_i {
    pointer-events: none;
    position: absolute;
    display: inline-block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    background-color: rgba(0, 0, 0, 0);
    color: gray;      // 2023.12.16a 特例
    font-size: 0.75em;
}


.editor_canvas { /* earth */
  position: relative;
  display: block;

  background-color: v-bind("htmsvg_outer_ref.background_color") !important;   // 2023.12.16a Editorの背景色
  color: v-bind("appCfgRef.color") !important;                                // 2023.12.16a Editorの前景色

  pointer-events: auto !important; /* galaxy で OFF したイベントを再開する */
}

.svg_root {
  width: v-bind(rootWidth);
  height: v-bind(rootHeight);
}


.foreign_obj_container {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
}

.html_xmlns {
  display: block;
  position:relative;
  background-color:rgba(0, 0, 0, 0) !important;
}

.root_contents_frame {
  position: relative;
  display: block;
  background-color:rgba(0, 0, 0, 0) !important;
}

.menu_container {
  position: absolute;
  display: block;
  margin: auto;
  padding: 20px;
  left : v-bind("my_just_ref.x + 'px'");
  top  : v-bind("my_just_ref.y + 'px'");
  width :v-bind("my_just_ref.w + 'px'");
  /* width: 192px; */
  height: v-bind("my_just_ref.h + 'px'");
  overflow-x: hidden;
  overflow-y: auto;
  background-color:rgba(33, 33, 33, 0);
  border: solid 1px rgba(128, 128, 128, 0.0);
}

.limited_menu_area {  /* v-menu atached */
  position: relative;
  margin: 0px;
  padding: 0px;
  left: 0px;
  top : 0px;
  width : 100%;
  height: 95%;
  border: solid 1px red;
}


.mii_svg {
  pointer-events: auto;
}


.mini_ctrl_svg {
  pointer-events:none;
}

.mini_ctrl_border {
  pointer-events: stroke;
}


.sec-text-meta {

}

.mini-top-toolbar {
  margin: 4px;
}
.mini-toolbar-btn {
  margin-right: 4px;
  background-color: rgba(44, 48, 65, 0.9);
  color: rgb(254, 184, 7);
}

.content-container {
  display:block;
  position:relative !important;   // でなければ、EditHtmlElem
}


.old_meta-toolbar-list {
  display:block;
  position:relative !important;   // でなければ、EditHtmlElem
}

.meta-toolbar-list {
  display:block;
  position:absolute !important;
  z-index: 90000;
  left: 0px;
  top: 0px;
  height: fit-content;
  background-color: rgb(120, 130, 138);
}

.search_bar {
  position: relative;
  display: grid;
  gap: 2px;
  grid-template-columns: 1fr auto auto auto;
}

.search_col {
  margin-left: 2px;
  margin-right: 2px;
  padding-left: 2px;
  padding-right: 2px;
}

.simple_container {
    display: block;
    position: relative;
    margin: 0px;
    padding: 4px;
}

.simple_btn {
  width:fit-content;
  height: 32px;
  font-size: 11px;
}
</style>