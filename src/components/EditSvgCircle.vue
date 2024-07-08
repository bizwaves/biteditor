<template>
  <div 
    ref = "galaxy_ref" 
    class = "galaxy client_decided html_events" 
    title = "galaxy_ref :- EditSvgCircle galaxy: div, Position, Size の基準（当 Html Frame の 辺界線）" 
  >
        
    <div v-if = "isDevModeRef" class = "who_am_i">{{ props.com_type }} : {{ uuidRef.value }}</div>

    <v-btn v-if = "false" color = "primary" title = "html-galaxy debuging button" >
        Click EditSvgCircle galaxy!
    </v-btn>


    <div display="none">
      <svg display="none">
        <desc>SVG DEFS-SYMBOL Library</desc>
      </svg>
    </div>


    <div
      ref   = "earth_ref"
      @click = "onMeClick"
      class = "editor_canvas client_decided html_events "
      :style = "{ 'background-color': htmsvg_outer_ref.background_color, 'color': 'htmsvg_outer_ref.background_color' }"
      title = "earth_ref :- EditSvgEllipse earth: div, canvas, to warp svg-root"
    >  


      <v-container  
        id = "SvgMmenuArea" 
        ref = "menu_container_ref" 
        class = "menu_container" 
        title = "menu_container_ref :- EditSvgRect Menu Container"
      >
        <div v-if="false"
          ref="menu_area_ref" 
          class="limited_menu_area"
          title = "menu_area_ref := Limited Active v-menu area, Debuger"
        >
        </div>

        <!--【Issues】
        [Bug Report] Menu/Tooltip attach with absolute positioning does not work #6877
            https://github.com/vuetifyjs/vuetify/issues/6877
         【現状】WHEN limited_menu_area is relative; v-menu absolute
            attach="#SvgMmenuArea"
              「[vue warn]: Unable to locate target #SvgMmenuArea 」出るが、其の内に表示されている
              但し、position-x y は効かない
            attach="#app"
              position-x y は効かない
                  :position-x="x"
                  :position-y="y"
              absolute
            ⇒ 暫定対策として、
              earth_ref onclick で、menu x, y, width, height を計算し、
              menu_container_ref に left, top を設定することで、clicked position に表示させた
            
      -->
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


      <v-btn v-if = "false" color = "primary" title = "html-earth debuging button" >
          Cliek EditRectangle Earth!
      </v-btn>


      <!-- BEGIN META, TOOL-BAR, LIST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
      <div v-if="true" class = "meta-toolbar-list">

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
                title="Save self only"
                @click="saveDbContent(null)"
            > Save
            </v-btn>

            <!-- Save the tree は必要なし？ -->
            <v-btn v-if="false" prepend-icon="mdi-content-save-all"
                class="mini-toolbar-btn"
                title="Save the tree"
                @click="saveDbContent(null)"
            > Save Tree
            </v-btn>

            <v-btn prepend-icon="mdi-reload"
                class="mini-toolbar-btn"
                title="Reload self only"
                @click="loadDbContent(false, '', false)"
            >Load
            </v-btn>

            <!-- Reload the tree は必要なし -->

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

          <!-- 
            @click.stop 動作しなかったら入れてみてください
            廃止 :owner_uuid = "props.uuid" ※ 2023.12.08 md_owner_uuid へ移行したため
          -->
          <SelConditions v-if = "(!isPreviewModeRef) && show_mata_ref"
              @click.stop
              ref = "sel_conds_ref"
              kind = "normal"
              :owner_com_type = "props.com_type"
              v-model:md_owner_uuid = "familyIdRef"
              v-model:selCondMdsRef = "selCondMdsRef"
              v-on:req_mod_uuid = "onReqModUuid"
              v-on:req_load_uuid="onReqLoadUuid"
          >
          </SelConditions>
          

          <!-- && (show_mata_ref) -->
          <div v-show = "show_findall_ref && (!isPreviewModeRef)">
            <v-list>
              <v-list-item v-for = "rec in fandall_rc_ref" :key = "rec.uuid"
              >
                <v-list-item-title>
                  {{ rec.title }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ rec.subtitle }} |
                  {{ rec.uuid }} |
                  {{ rec.is_root }} |
                  {{ rec.parent_uuid }} |
                  {{ rec.groups }} |
                  {{ rec.keywords }} |
                  {{ rec.children }}
                </v-list-item-subtitle>

                <v-list-item-action>
                  <v-btn icon @click="onRecordSelected(rec)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-list-item-action>

              </v-list-item>
            </v-list>
          </div>


      </div>  <!-- END meta-toolbar-list -->
      <!-- END META, TOOL-BAR, LIST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->


      <!-- BEGIN コンテンツ実体 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
      <div v-if = "true" class = "svg_outer">

        <svg v-if = "true" ref = "moon_ref" class = "svg_root" :viewBox = "viewBoxStr" >
          <title>moon_ref :- svg of EditRectangle</title> 

          <g v-if = "true" >
            <title> EditSvgCircle 実要素 + Ctrl Group </title>

            <g v-if = "true">
              <title>EditSvgCircle 【実要素】Group </title>


              <circle 
                  :cx = "htmsvg_outer_ref.cx" 
                  :cy = "htmsvg_outer_ref.cy" 
                  :r = "htmsvg_outer_ref.r" 
                  :stroke = "htmsvg_outer_ref.stroke" 
                  :stroke-width = "htmsvg_outer_ref.stroke_width" 
                  :fill = "htmsvg_outer_ref.fill"
              />

            </g>  
          </g> 
        </svg> 

      </div>
      <!-- END コンテンツ実体 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->

    </div> 

    <!-- 【廃止】 2023/11/02 -->
<!-- 
    <div v-show = "being_edit" ref = "mini_ctrl_ref" class = "mini_ctrl">
      <svg class="mini_ctrl_svg" :width = "props.raResizingSize.w" :height = "props.raResizingSize.h" :viewBox = "props.raResizingViewbox">
        <rect class="mini_ctrl_border" :x = "0" :y = "0" :width = "props.raResizingSize.w" :height = "props.raResizingSize.h"  style = "fill:rgba(121,121,121,0.0);stroke-width:1;stroke:rgba(255,0,0,0.75)"> </rect>
      </svg>
    </div>
 -->
  </div>
</template>


<script setup lang="ts">
import {
  effectScope, getCurrentScope, onScopeDispose, markRaw, toRaw, reactive, shallowReactive, shallowReadonly, isReactive, computed, shallowRef, triggerRef, customRef, ref, unref, toRef, toRefs, isRef,  // 2023.12.08
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

const outline_assets_ref: any = inject("outline_assets_ref");

const svg_circle_ref = inject('svg_circle_ref');

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


const galaxy_ref    = ref(null);    //
const earth_ref     = ref(null);    //
const moon_ref      = ref(null);    //


const show_toolbar_ref = ref(false);  // show | hide 2023.12.25b

const familyZIndexRef = defineModel<any>("familyZIndexRef", { local: true, default: null });  // 2023.12.18a Family EdiyHtmlElem の z-index on EditHtmlFrame
console.log("######## familyZIndexRef value: " + familyZIndexRef.value);


//= svg | html 系統一的な変数
const prefer_posize_ref: any = ref(null);  // 2023.12.30a null | { x, y, w, h, transform} , 確定した位置とサイズ

const mii_htmsvg_ref = ref(null);      // 自分自身の ref
const htmsvg_dom_ref = ref(null);        // 
const htmsvg_container_ref = ref(null);  // 

let madeInHis = false; // 2024.01.01a History から作成される時 true にする（History に追加されることを防ぐため） ※ 内容が変更された時、false にすることを忘れずに

const htmsvg_outer_ref = ref({           // !! 後に watch(c に更新される 2023.11.15
  cx : 50,
  cy : 40,
  r  : 40,
  stroke: "rgba(0, 0, 0, 1.0)",       // 2023.12.16a
  stroke_width: 1,
  fill: "rgba(255, 255, 255, 0.1)",   // 2023.12.16a
  
  z_index: familyZIndexRef.value,     // 2024.01.08s L-attrs のみ更新更新されるため、それ以外の watch(familyZIndexRef) 更新は不要; Family EdiyHtmlElem の z-index on EditHtmlFrame

  //= background_color color ※ 親 container earth_ref に（も）適用する TODO assets etc. 出力に適用させ
  //  "" | null | undefined の時、appCfgRef.back_color front_color を適用する
  //=
  background_color: "rgba(0, 0, 0, 0.0)", // 2023.12.16a 透明 if not is_root EditHtmlFrame

  // TODO style 情報
});


// updateLPanelAttrs(); // 2024.01.06c L-attr に反映, onMounted へ移動した

const updateLPanelAttrs = () => { // 2024.01.06c L-attr に反映
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {  // 2024.01.06b
    console.log(`${uuidRef.value} L-Panel is not for me, do nothing!`);
    return;
  }

  console.log("#### ${uuidRef.value} updateLPanelAttrs");
  try {
    svg_circle_ref.value = structuredClone(htmsvg_outer_ref.value); // 2024.01.06c L-attr に反映

    //+ COLOR Tab, 2024.01.08b ここに移動した
    selColorsRef.value = {  // 2023.12.16a
      "background_color": htmsvg_outer_ref.value.background_color,  // 2023.12.16a ※実コンテンツの色ではなく、Editor の背景色であることに注意
      "stroke": htmsvg_outer_ref.value.stroke,
      "fill": htmsvg_outer_ref.value.fill,
    }
    initSelColorPicker("stroke", htmsvg_outer_ref.value.stroke, uuidRef.value);  // 2023.12.16a
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


const able_pointed = defineModel<boolean>("able_pointed", { local: true, default: true })		// name able_pointed 使用, parent: v-model:able_pointed="able_pointed"

const menu_container_ref  = ref(null);
const menu_area_ref       = ref(null);
const menu_ref            = ref<any>(null);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const cmenu_use_loc_ref = ref(false);       // false := local area 表示 | true := global area (main_container) 表示
const attached_ref = ref('cmenuid' + getRandomInt(Number.MAX_SAFE_INTEGER));
const sel_cmenu_attach = computed(() => {
  return cmenu_use_loc_ref.value ? `#${attached_ref.value}` : '#rel_cmenu_attached';
})


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

const md_title = ref("Example 01");
const md_subtitle = ref("Example 01 Sub-title");
const md_author = ref("Example Author");           // !!
const md_version = ref("0.0.1");                    // !!
const md_variation = ref("normal");                 // !!
const md_keywords = ref("Example Develop");
const md_groups = ref("Example Test");
const md_passphrase = ref("password123");
const md_expiration = ref("");

const show_passphrase = ref(false);

//= SelConditions v-model 用 2023.12.08
const selCondMdsRef = ref({
  title: toRef(md_title),
  subtitle: toRef(md_subtitle),
  author: toRef(md_author),
  version: toRef(md_version),
  variation: toRef(md_variation),
  keywords: toRef(md_keywords),
  groups: toRef(md_groups),
});


const fandall_rc_ref = ref([]);
const show_findall_ref = ref(false);


const mini_ctrl_ref = ref(null);

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

  if (!(val.w > 0 && val.h > 0)) {
    console.log("  c.w or c.h is 0, do nothing!");
    return;
  }

  //= val.w と val.h の内、より小さい値
  const min_wh = Math.min(val.w, val.h);

  //= htmsvg_outer_ref を作る
  htmsvg_outer_ref.value["cx"] = Math.round(val.w / 2);
  htmsvg_outer_ref.value["cy"] = Math.round(val.h / 2);
  htmsvg_outer_ref.value["r" ] = Math.floor(min_wh / 2 - htmsvg_outer_ref.value["stroke_width"] / 2);

  updateLPanelAttrs(); // 2024.01.06c L-attr に反映 ※ 2023.12.16a color と関係ないため、initSelColorPicker は不要
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
    default: "edit_svg_circle",
  },

  // uuid: { // uuid は、このコンポーネントの一意の識別子です
  //   type: String,
  //   default: uuidv4(),
  // },

  parent_uuid: {              // DB 上親特定用
    type: String,
    required: true,
  },
  editing_uuid: {             // Able を含む上流の editor | elem の uuid
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

  //= BEGIN 【廃止】 2023/11/02
  // myPosSizeRef: {             // inject から props へ変更
  //   type: Object,
  //   required: true,
  // },
  // raResizingSize: {           // inject から props へ変更
  //   type: Object,
  //   required: true,
  // },
  // raResizingViewbox: {        // inject から props へ変更
  //   type: String,
  //   required: true,
  // },
  //= END 【廃止】 2023/11/02

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
  // 'props_updated',    // 親コンポーネントに、props の更新を通知
  // 'deleted',          // 親コンポーネントに、削除を通知
])


const is_editing = computed(() => {
  return (editingObjRef.value.uuid === props.editing_uuid && editingObjRef.value.editing_id === props.editing_id);
})

const being_edit = computed(() => {
  return (editingObjRef.value.uuid === props.editing_uuid && editingObjRef.value.editing_id === props.being_edit_id);
})



// watch(editCmdRef, (newVal, oldVal) => {
//     // alert("Hello, watch of EditSvg.vue");
//     if (isEditFocus.value) {
//         console.log(props.com_type + ' ' + uuidRef.value + ' received editCmdRef ' + newVal.cmd);
//         if (newVal.cmd == 'applyColor') {             // 色を変える
//             console.log("color: " + newVal.color);
//             if (editCmdParasRef.value.src_seltor.name == "stroke") {
//                 b.value.stroke =newVal.color;
//             } else if (editCmdParasRef.value.src_seltor.name == "fill") {
//                 b.value.fill = newVal.color;
//             }
//         }
//     }
// });



//= @click の位置、使える領域 :- e.clientXY - earth_ref.clientRect
//  v-menu
const my_just_ref = ref({ x: 0, y: 0, w: 0, h: 0 });


const { current: currentKeySet } = useMagicKeys();

const onMeClick = (e: any) => {
  actingEditRef.value.com_type = props.com_type;
  actingEditRef.value.uuid = uuidRef.value;
  actingEditRef.value.familyId = familyIdRef.value;    // r/w お試し2023.11.19

  console.log('######## onMeClick ' + " menu = " + cmenu.value);

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
  { id: 'who_am_i',         visible: true,  name: props.com_type + ' : ' + uuidRef.value },  //

  { id: 'off_able_pointer', visible: false,   name: 'Disable Resize' },
  { id: 'on_able_pointer',  visible: false,   name: 'Enable Resize' },

  { id: 'listup',           visible: true,   name: 'Listup '                                             },  // 一覧表示 TODO 3)

  { id: 'save_db',          visible: true,   name: 'Save It to DB'                                     },  // !! TODO 1)
  { id: 'load_db',          visible: true,   name: 'Load It from DB'                               },  // !! TODO 2)
  { id: 'remove_it',        visible: true,   name: 'Delete'                                         },  // !! TODO 親ノードから切り離す（DBにはそのまま残す）, shouldShow 参照, hide when is root
  { id: 'delete_db',        visible: true,   name: 'Delete It From DB'                                 },  // ↑＋ TODO


  //= BEGIN 親の MoveAble を制御する
  { id: 'DEFAULT',          visible: true, name: 'Sel DEFAULT'         },
  { id: 'Resizable',        visible: true, name: 'Sel Resizable'       },
  { id: 'Scalable',         visible: true, name: 'Sel Scalable'        },

  { id: 'Warpable',         visible: true, name: 'Sel Warpable'        },
  { id: 'Clippable',        visible: true, name: 'Sel Clippable'       },
  { id: 'Roundable',        visible: true, name: 'Sel Roundable'       },
  
  { id: 'Dra_Res',          visible: true, name: 'Sel Draggable Resizable' },
  { id: 'Dra_Res_Rot',      visible: true, name: 'Sel Draggable Resizable Rotatable' },
  { id: 'Dra_Sca',          visible: true, name: 'Sel Draggable Scalable' },
  { id: 'Dra_Sca_Rot',      visible: true, name: 'Sel Draggable Scalable Rotatable'  },
  { id: 'All_In_One',       visible: true, name: 'Sel All In One' },
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

  if ((val.cate == 'attr') && (val.event == "svg_circle")) {
    //= 2023.12.19a watch(svg_circle_ref へ移動した
    // htmsvg_outer_ref.value = val.val;

    // //= val.w と val.h の内、より小さい値
    // const min_wh = Math.min(c.w, c.h);

    // //= htmsvg_outer_ref.r を修正する
    // htmsvg_outer_ref.value["cx"] = Math.round(c.w / 2);  // !!
    // htmsvg_outer_ref.value["cy"] = Math.round(c.h / 2);  // !!
    // htmsvg_outer_ref.value["r"] = Math.floor(min_wh / 2 - htmsvg_outer_ref.value["stroke_width"] / 2);
    
    // familyZIndexRef.value = Number(val.val["z_index"]);
    return;
  }

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


watch(svg_circle_ref, (newVal) => { // 2023.12.19a
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {  // 2024.01.06b
    // console.log(` not changed for my L-htmsvg_outer_ref, do nothing!`);
    return;
  }

  htmsvg_outer_ref.value = { ...newVal };
  familyZIndexRef.value = Number(newVal["z_index"]); // !!
  console.log(`$$$$ watch svg_circle_ref: htmsvg_outer_ref.value updated to ${JSON.stringify(htmsvg_outer_ref.value, null, 2)}`);

  //= val.w と val.h の内、より小さい値
  const min_wh = Math.min(c.w, c.h);

  //= htmsvg_outer_ref.r を修正する
  htmsvg_outer_ref.value["cx"] = Math.round(c.w / 2);  // !!
  htmsvg_outer_ref.value["cy"] = Math.round(c.h / 2);  // !!
  htmsvg_outer_ref.value["r"] = Math.floor(min_wh / 2 - htmsvg_outer_ref.value["stroke_width"] / 2);  

}, { deep: true });


const toggleShowMeta = () => {
  show_mata_ref.value = !show_mata_ref.value;
}

const saveClearTextFile = () => {
  show_mata_ref.value = false;
}


const saveCipherTextFile = () => {
  show_mata_ref.value = false;
}


const loadClearTextFile = () => {
  show_mata_ref.value = false;
}


const loadCipherTextFile = () => {
  show_mata_ref.value = false;
}


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
    },
    // children: [] as any[],             // !! TODO 子 EditHtmlFrame 2023/10/12
    content: {
      svg: htmsvg_outer_ref.value,
      // TODO 他の svg 埋め込み関連データ
    }
  }

  //= children
  //  子 EditHtmlFrame の必要性、実装方法を検討する必要があり、取りあえず外す

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
  //   "uuid": "8cbd3c8f-df19-4e79-9454-ec9e95e87bf8",
  //   "pos_size": "\"{\\\"x\\\": 140, \\\"y\\\": 389, \\\"w\\\": 1780, \\\"h\\\": 691}\"",
  //   "is_root": true,
  //   "children": "[{\"com_target\": \"EditSvgembed\", \"com_type\": \"edit_html_elem\", \"uuid\": \"b969300d-a3a0-44b3-a5b5-a684795b7d68\"}]",
  //   "title": "Exam Prj-01",
  //   "subtitle": "Exam Prj-01 Sub-title",
  //   "keywords": "Example Prj Develop",
  //   "groups": "Develop Prj"
  // }
  //=

  md_title.value = record["title"];
  md_subtitle.value = record["subtitle"];
  md_author.value = record["author"];
  md_version.value = record["version"];
  md_variation.value = record["variation"];
  md_keywords.value = record["keywords"];
  md_groups.value = record["groups"];

  htmsvg_outer_ref.value = record["svg"];
  familyZIndexRef.value = Number(record['svg']["z_index"]); // !!
  
  updateLPanelAttrs(); // 2024.01.06c L-attr に反映

  let pos_size, dom;
  dom = able_target_ref.value;
  pos_size = JSON.parse(record['pos_size']);
  applyDomPosSize(dom, pos_size); // 自らの x y w h trans 
}


//=
// {
//   "id": 39,
//   "uuid": "5ea7b6a2-d577-46de-a42a-11b79d3c5e4a",
//   "pos_size": "{\"x\": 117, \"y\": 185, \"w\": 1920, \"h\": 1080}",
//   "is_root": true,
//   "children": "[{\"com_target\": \"EditSvgembed\", \"com_type\": \"edit_html_elem\", \"uuid\": \"8a75fc0b-8758-44c4-b907-6461fdb3aa5a\", \"pos_size\": {\"x\": 73, \"y\": 163, \"w\": 923, \"h\": 923}}]",
//   "title": "Exam Prj-01",
//   "subtitle": "Exam Prj-01 Sub-title",
//   "keywords": "Example Prj Develop",
//   "groups": "Develop Prj",
//   "parent_uuid": "root",
//   "com_type": "edit_html_frame"
// }
//=
const onRecordSelected = (record) => {
  console.log("onRecordSelected " + JSON.stringify(record, null, 2));

  md_title.value = record["title"];
  md_subtitle.value = record["subtitle"];
  md_keywords.value = record["keywords"];
  md_groups.value = record["groups"];

  my_just_ref.value = record["pos_size"];

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


const build_meta = (
  dom_name, dom_ref, develop, product, title,
  containerRequired = true,
  border = `border: solid 1px rgba(0, 0, 0, 1.0); box-sizing: border-box;`,
  kind = 'myjson',
  background = `rgba(255, 255, 255, 0.0)`,
) => {
  //=  meta, Raw Content := meta + raw[]

  console.log(`$$$$ ~~~~~~~~~~~~ build_meta ${dom_name}`);
  let meta = {};

  meta['com_type'] = props.com_type;        // component-type
  meta['uuid'] = uuidRef.value;                // component-id
  meta['dom_name'] = dom_name;              // !! component.dom
  meta['kind'] = kind;
  meta['version'] = '0.0.1';
  meta['istext'] = false;

  if (containerRequired) {
    let dom = dom_ref;
    meta['container'] = {
      x: dom.value.offsetLeft,      // 36
      y: dom.value.offsetTop,       // 104
      w: dom.value.offsetWidth,     // 
      h: dom.value.offsetHeight,    // 
      should_draw: {                // draw ↓
        develop: develop,
        product: product,
      },
      border: border,
      background: background,       // background-color
      title: title,                 // default ""
    };

    if (("style" in dom.value) && ("transform" in dom.value.style)) {   // object.style.transform := MoveAble, e.g `transform: scale(2, 0.5);`
      meta['container']['transform'] = dom.value.style.transform;
    } else {
      meta['container']['transform'] = "";  // !!
    }
  }

  return meta;
}


const makeRawContentJson = (rootContainerRequired) => {
  console.log("makeRawContentJson");
  let outlineAlpha = outline_assets_ref.value ? 1.0 : 0.0;

  //= earth_ref を child として作る
  let view = build_meta(
    'earth',
    earth_ref,
    true,
    true,
    `${props.com_type} earth: div, canvas, to warp svg-root`,
    true,
    `border: solid 1px rgba(0, 255, 255, ${outlineAlpha}); box-sizing: border-box;`,
    'dict'  // !!
  );

  //= 子 本コンテンツを収集する
  let svg = "";
  svg += `<circle cx = "${htmsvg_outer_ref.value.cx}" cy = "${htmsvg_outer_ref.value.cy}" r = "${htmsvg_outer_ref.value.r}" stroke = "${htmsvg_outer_ref.value.stroke}" stroke-width = "${htmsvg_outer_ref.value.stroke_width}" fill = "${htmsvg_outer_ref.value.fill}" />`
  let view_raw = { 'svg': svg };  // TODO htmsvg_dom_ref から取り出す方が良い？
  view['raw'] = view_raw; // !!

  return view;
}


defineExpose({
  // galaxy_ref,
  makeRawContentJson,
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
    htmsvg_outer_ref.value.stroke = val["stroke"];
    htmsvg_outer_ref.value.fill = val["fill"];
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


onMounted(async () => { // after DOM nodes be inserted
  await nextTick();
  console.log(props.com_type + ' ' + uuidRef.value + ' is mounted!');

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
    background-color: rgba(0, 0, 255, 0.0) !important;
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

.desc {
  color: aliceblue;
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
  background-color:rgba(0, 0, 0, 0) !important;
}


.foreign_obj_container {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    background-color:rgba(0, 0, 0, 0) !important;
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
  pointer-events:none;
}


.svg_outer {
  display: block;
  position: relative !important;
  width: 100%;
  height: 100%;
  background-color:rgba(0, 0, 0, 0) !important;
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

</style>