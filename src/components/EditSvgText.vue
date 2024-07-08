<template>
  <div 
    ref = "galaxy_ref" 
    class = "galaxy client_decided html_events" 
    title = "galaxy_ref :- EditSvgText galaxy: div, Position, Size の基準（当 Html Frame の 辺界線）" 
  >
        
    <div v-if = "isDevModeRef" class = "who_am_i">{{ props.com_type }} : {{ uuidRef.value }}</div>

    <v-btn v-if = "false" color = "primary" title = "html-galaxy debuging button" >
        Click EditSvgText galaxy!
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
      :style = "{ 'background-color': htmsvg_outer_ref.background_color, 'color': 'htmsvg_outer_ref.color' }"
      title = "earth_ref :- EditSvgText earth: div, canvas, to warp svg-root"
    >  

      <v-container  
        :id = "attached_ref" 
        ref = "menu_container_ref" 
        class = "menu_container" 
        title = "menu_container_ref :- EditSvgText Menu Container"
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

            <v-btn v-if="embed_mode"
                :prepend-icon="show_attrs_ref ? 'mdi-arrow-up-drop-circle' : 'mdi-arrow-down-drop-circle'"
                class="mini-toolbar-btn"
                title="Show/Hide Attrs Info"
                @click="toggleShowAttrs"
            > Attrs
            </v-btn>

            <v-btn v-if="embed_mode && show_attrs_ref"
                prepend-icon="mdi-text-box-plus"
                class="mini-toolbar-btn"
                title="Add Svg The Text To Current Layer"
                @click="addEmbedSvgText()"
            > Add Text
            </v-btn>

            <v-btn
                :prepend-icon="showRawEditorRef ? 'mdi-raw' : 'mdi-raw-off'"
                class="mini-toolbar-btn"
                title="Raw Editor を表示するか否か"
                @click="showRawEditorRef = !showRawEditorRef"
            > Toggle Raw
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
                title="Save DB"
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
                title="Load DB"
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

          <!-- 2024.01.09j req_load_uuid req_mod_uuid -->
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
          
          <TagPlusAttrs v-if = "(!isPreviewModeRef) && show_attrs_ref"
              @click.stop
              v-bind="attrs"
              ref = "sel_plus_attrs_ref"
              kind = "normal"
              :owner_com_type = "props.com_type"
              v-model:md_owner_uuid = "familyIdRef"
              v-model:plusAttrsRef = "plusAttrsRef"
          >
          </TagPlusAttrs>


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


      <!-- BEGIN Raw-Editor ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
      <div class = "raw_edit_frame" v-show="!isPreviewModeRef && showRawEditorRef">
        <!-- 
        auto-grow clearable 
        label     = "Label"
      -->
        <v-textarea 
            counter
            class       = "raw_edit"
            placeholder = "Edit Raw Svg Source"
            bg-color    = "black"
            color       = "yellow"
            v-model     = "htmsvg_outer_ref.text"
        >
        </v-textarea>
      </div>
      <!-- END Raw-Editor ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->


      <!-- BEGIN コンテンツ実体 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
      <svg v-if = "true" ref = "moon_ref" class = "svg_root" :viewBox = "viewBoxStr" >
        <title>moon_ref :- svg of EditSvgText</title> 

        <g v-if = "true" >
          <title> EditSvgText 実要素 + Ctrl Group </title>

          <g v-if = "true">
            <title>EditSvgText 【実要素】Group </title>

            <svg ref = "htmsvg_container_ref" 
                class = "svg_container"
            >
              <!-- 検討
                :id="htmsvg_outer_ref.id" class="htmsvg_outer_ref.cls"
                style = "fill:rgba(64,64,64,0.75);stroke-width:1;stroke:rgba(33,33,255,1.0)"  
              -->
              <text 
                  ref = "mii_htmsvg_ref"
                  class = "mii_svg" 
                  :x = "htmsvg_outer_ref.x" 
                  :y = "htmsvg_outer_ref.y"
                  :textLength = "htmsvg_outer_ref.textLength"
                  :lengthAdjust = "htmsvg_outer_ref.lengthAdjust"
                  :text-anchor = "htmsvg_outer_ref.text_anchor" 
                  :font-family = "htmsvg_outer_ref.font_family" 
                  :font-size = "htmsvg_outer_ref.font_size" 
                  :fill = "htmsvg_outer_ref.fill"
                  :stroke = "htmsvg_outer_ref.stroke"
                  :stroke-width = "htmsvg_outer_ref.stroke_width"
                  paint-order = "stroke"
                  :transform = "htmsvg_outer_ref.transform"
              >  
                {{ htmsvg_outer_ref.text }} 
              </text>
            </svg>

          </g>  
        </g> 
      </svg> 
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
  inject, onBeforeUpdate, watch, onMounted, onBeforeUnmount, nextTick, useSlots, useAttrs
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
import TagPlusAttrs from "./TagPlusAttrs.vue";    // 2023.12.25c

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

const svg_text_ref = inject('svg_text_ref');

const appSpecRef: any = inject("appSpecRef");
const userCfgRef: any = inject("userCfgRef");
const appCfgRef: any = inject("appCfgRef");
const dbConRef: any = inject("dbConRef");

const DelayMSecWakeUp: any = inject("DelayMSecWakeUp");

const sel_conds_ref: any = inject("sel_conds_ref");  // 2023.12.14f DOM of SelConditions.vue

const selColorsRef: any = inject('selColorsRef');               // 2023.12.16a color picker info, 参考 htmsvg_outer_ref
const initSelColorPicker: any = inject('initSelColorPicker');   // 2023.12.16a

const memoryEditStatRef: any = inject('memoryEditStatRef');   // 2024.01.01c
const memoryEditRef: any = inject('memoryEditRef');           // 2024.01.01c

const app_msg_ref: any = inject('app_msg_ref');

const galaxy_ref    = ref(null);    //
const earth_ref     = ref(null);    //
const moon_ref      = ref(null);    //


defineOptions({
  inheritAttrs: true, // 2023.12.26a
})

// 親コンポーネントから子コンポーネントに文字列、数値、配列やオブジェクトを渡す
const props = defineProps({ // I/F: 親⇒子のデータの受け渡し
  com_type: { // edit_svg | edit_html_tag | ..
    type: String,
    default: "edit_svg_text",
  },

  // uuid: { // uuid は、このコンポーネントの一意の識別子です
  //   type: String,
  //   required: true,
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

console.log("@@@@@@@@ props: " + JSON.stringify(props, null, 2));

const attrs = useAttrs(); // 2023.12.25c
console.log("@@@@@@@@ attrs: " + JSON.stringify(attrs, null, 2));


const show_toolbar_ref = ref(false);  // show | hide 2023.12.25b

const familyZIndexRef = defineModel<any>("familyZIndexRef", { local: true, default: null });  // 2023.12.18a Family EdiyHtmlElem の z-index on EditHtmlFrame
console.log("######## familyZIndexRef value: " + familyZIndexRef.value);


const ExamNormalContent = {
  id: "",                             // !! 未対応
  cls: "",                            // !! 未対応
  x: 0,                               // Local 座標系
  y: Math.round(96 * 1.25),           // !! ベースラインより上の領域で描画され、精確なサイズは↓ getBBox() でしか知り得ない ⇒ 概算 ?1.2 に
  textLength: 1280,                   // ↓ required by
  lengthAdjust: "spacing",            // spacing | spacingAndGlyphs
  text_anchor: "start",               // 文字揃え(text-anchor), start := 左端を基準に配置 | middle := 文字列の中心を基準に配置 | end := 右端を基準に配置
  font_family: "Verdana",             // 
  font_size: 96,                      // !! y と同時に更新することを忘れずに
  fill: "rgba(255, 255, 255, 0.1)",   // 2023.12.16a
  stroke_width: 1,                    // 2023.12.16a プレゼンテーション属性  
  stroke: "rgba(0, 0, 0, 1.0)",       // 2023.12.16a プレゼンテーション属性
  text: "日本語漢字abwgjypm AGJYPM",
  transform: "rotate(30 20, 40)",      // 

  z_index: familyZIndexRef.value,      // 2024.01.08s L-attrs のみ更新更新されるため、それ以外の watch(familyZIndexRef) 更新は不要; Family EdiyHtmlElem の z-index on EditHtmlFrame

  //= background_color color ※ 親 container earth_ref に（も）適用する TODO assets etc. 出力に適用させ
  //  "" | null | undefined の時、appCfgRef.back_color front_color を適用する
  //=
  background_color: "rgba(0, 0, 0, 0.0)", // 2023.12.16a 透明 if not is_root EditHtmlFrame
};

const ExamEmbedContent = {
  id: "",                             // !! 未対応
  cls: "",                            // !! 未対応
  x: 0,                               // Local 座標系
  y:28,                               // !! ベースラインより上の領域で描画され、精確なサイズは↓ getBBox() でしか知り得ない ⇒ 概算 ?1.2 に
  textLength: 128,                    // ↓ required by
  lengthAdjust: "spacing",            // spacing | spacingAndGlyphs
  text_anchor: "start",               // 文字揃え(text-anchor), start := 左端を基準に配置 | middle := 文字列の中心を基準に配置 | end := 右端を基準に配置
  font_family: "sans-serif",          // 
  font_size: 20,                      // !! y と同時に更新することを忘れずに
  fill: "rgba(0, 0, 0, 1.0)",         // 2023.12.16a
  stroke_width: 1,                    // 2023.12.16a プレゼンテーション属性
  stroke: "rgba(0, 0, 0, 1.0)",       // 2023.12.16a プレゼンテーション属性
  text: "123456.78",
  transform: "rotate(0 0, 0)",        // 

  z_index: familyZIndexRef.value,     // 2024.01.08s L-attrs のみ更新更新されるため、それ以外の watch(familyZIndexRef) 更新は不要; Family EdiyHtmlElem の z-index on EditHtmlFrame

  //= background_color color ※ 親 container earth_ref に（も）適用する TODO assets etc. 出力に適用させ
  //  "" | null | undefined の時、appCfgRef.back_color front_color を適用する
  //=
  background_color: "rgba(0, 0, 0, 0.0)", // 2023.12.16a 透明 if not is_root EditHtmlFrame
};

const showRawEditorRef = ref(false);

//= svg | html 系統一的な変数
const prefer_posize_ref: any = ref(null);  // 2023.12.30a null | { x, y, w, h, transform} , 確定した位置とサイズ

const mii_htmsvg_ref = ref(null);      // 自分自身の ref
const htmsvg_dom_ref = ref(null);        // 
const htmsvg_container_ref = ref(null);  //

let madeInHis = false; // 2024.01.01a History から作成される時 true にする（History に追加されることを防ぐため） ※ 内容が変更された時、false にすることを忘れずに

//= 参考
//   ベースラインより上の領域で描画され、ベースラインから特にアルファベットのgjyは下にはみ出る点に気をつける必要があります
//  TODO 汎用的「SVG 属性リファレンス」実装
//=
const htmsvg_outer_ref = ref( ((attrs["content"] === 'text_embed') || (props.content === 'text_embed')) ? ExamEmbedContent : ExamNormalContent ); // 2023.12.25c


// updateLPanelAttrs(); // 2024.01.06c L-attr に反映, onMounted へ移動した

const updateLPanelAttrs = () => { // 2024.01.06c L-attr に反映
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {  // 2024.01.06b
    console.log(`${uuidRef.value} L-Panel is not for me, do nothing!`);
    return;
  }

  console.log("#### ${uuidRef.value} updateLPanelAttrs");
  try {
    svg_text_ref.value = structuredClone(htmsvg_outer_ref.value); // 2024.01.06c L-attr に反映

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
const show_attrs_ref = ref(false);  // 2023.12.25c svg_text -plus attrs

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
const md_author = ref("Example Author");            // !!
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


//=
//  2023.12.25c 【メモ】plus-attrs は DB Save/Load, Assets File 等の W/R 除外（親 EditSvgEmbed 側は記憶機能を持っているため）
//=

const sel_plus_attrs_ref = ref(null); // DOM 2023.12.25c

const plusAttrsRef = ref({                        // 2023.12.25c svg text 要素に付け加える attrs 想定, 「!!」項目は、出力に影響する、それ以外は、JSON 仕様作成用想定                      
  "id"            : {                             // 1) unique id
    val         : "0",
    placeholder : "unique id",
    required    : true,
  },
                                                  // 2) json データ仕様情報, svg data-* として SVG コンテンツ に埋め込む
  "data-name"     : {                             //    !! Required, 例: "data-name": "Example 01"
    val         : "owner",
    placeholder : "Required",
    required    : true,
  },
  "data-group"    : {                             //    Optional, 例: "data-group": "books"
    val         : "books",
    placeholder : "Optional",
  },
  "data-desc"     : {                             //    Optional, 例: "data-desc": "2nd author"
    val         : "2nd author",
    placeholder : "Optional",
  },
  "data-version"  : {                             //    Optional, 例: "data-version": "0.0.1"
    val         : "0.0.1",
    placeholder : "Optional",
  },
  "data-variation": {                             //    Optional, 例: "data-variation": "normal"
    val         : "normal",
    placeholder : "Optional",
  },
  "data-keywords" : {                             //    Optional, 例: "data-keywords": "Example Develop" ※データ仕様のキーワード, 半角 space | "," 区切り
    val         : "Example Develop",
    placeholder : "Optional",
  },
  "data-id"       : {                             //    Optional ※データ仕様の ID、逆引き用想定
    val         : "author",
    placeholder : "Optional",
  },
  "data-path"     : {                             //    !! Required ※ .json からデータを取り出すための情報, "." 区切り、配列は [0..] で指定
    val         : "books.math.paper.author[1]",
    placeholder : "Required",
    required    : true,
  },
  "data-lang"     : {                             //    !! Required "js" | "py" ※ ↓ javascript | python 仕様
    val         : "js",
    placeholder : "Optional",
    required    : true,
  },
  "data-numfmt"   : {                             //    !! Required ※ 数値の表示フォーマット
    val         : "0.00",
    placeholder : "Optional",
    required    : true,
  },
                                                  // 3) SVG の仕様情報 ※保留
  "desc"         : {                             //    Optional, <desc> は、SVG の内容を説明するために使用されます。 この要素は、SVG ファイルの先頭に配置する必要があります。
    val         : "2nd author",
    placeholder : "Optional",
  },
  "title"        : {                             //    Optional, <title> は、SVG ファイルの先頭に配置する必要があります。 この要素は、SVG の内容を説明するために使用されます。
    val         : "2nd author",
    placeholder : "Optional",
  }
});

watch(plusAttrsRef, (val) => {
  console.log("######## plusAttrsRef changed: " + JSON.stringify(val, null, 2));
}, { deep: true });


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
});

const viewBoxStr = computed(() => { return c.x + ' ' + c.y + ' ' + c.w + ' ' + c.h; });  // view-Box
const rootMinX = computed(() => { return c.x + 'px'; });           // foreignObject
const rootMinY = computed(() => { return c.y + 'px'; });           // foreignObject
const rootWidth = computed(() => { return (c.w + 'px'); });         // foreignObject, View-Port
const rootHeight = computed(() => { return (c.h + 'px'); });         // foreignObject, View-Port

const editPlusReqRef = defineModel<any>("editPlusReqRef", { local: true, default: null });  // 2023.12.25c

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


const embed_mode = computed(() => {
  return props.content.includes("embed") ? true : false;  // 2023.12.25 EditSvgEmbed Float Add-Svg-Text で使用
})
console.log("######## embed_mode: " + embed_mode.value);



const emitedPosSizeRef = defineModel<any>("emitedPosSizeRef", { local: true, default: null });  // 位置とサイズが確定した, 旧 emit pos_size_decided
const deletedRef = defineModel<any>("deletedRef", { local: true, default: null });

const able_target_ref = defineModel<any>("able_target_ref", { local: true, default: null });  // the Moveable Target
const able_actmd_ref = defineModel<any>("able_actmd_ref", { local: true, default: null });  // 動作モード of the Moveable
const able_macro_ref = defineModel<any>("able_macro_ref", { local: true, default: null });  // in_ | out_ | io_, データ I/F of the Moveable


const emit = defineEmits([
  // 'props_updated',    // 親コンポーネントに、props の更新を通知
  // 'deleted',          // 親コンポーネントに、削除を通知
  'reqAddEmbedSvgText', // 2023.12.25 EditSvgEmbed Float Add-Svg-Text で使用
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
  actingEditRef.value.com_type = props.com_type;    // r
  actingEditRef.value.uuid = uuidRef.value;         // r
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

  console.log(`  val: ${JSON.stringify(val, null, 2)}`);

  if ((val.cate == 'attr') && (val.event == props.com_type)) {
    htmsvg_outer_ref.value = val.val;
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
        memoryEditRef.value['embed'] = (attrs["content"] === 'text_embed') || (props.content === 'text_embed'); // is embed, 使うかどうかわからないが、一応入れておく
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


watch(svg_text_ref, (newVal) => { // 2023.12.19a
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {  // 2024.01.06b
    // console.log(`${uuidRef.value} changed L-htmsvg_outer_ref is not  me, do nothing!`);
    return;
  }

  htmsvg_outer_ref.value = { ...newVal };
  familyZIndexRef.value = Number(newVal["z_index"]); // !!
  console.log(`$$$$ watch svg_text_ref: htmsvg_outer_ref.value updated to ${JSON.stringify(htmsvg_outer_ref.value, null, 2)}`);
}, { deep: true });


const toggleShowMeta = () => {
  show_mata_ref.value = !show_mata_ref.value;
}

const toggleShowAttrs = () => {  // 2023.12.25c
  show_attrs_ref.value = !show_attrs_ref.value;
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
    pos_size = { x: 0, y: 0, w: 96, 64: 0, transform: ""};  // 適当な値を入れておく
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


const addEmbedSvgText = () => {  // 2023.12.24r
  console.log("addEmbedSvgText");

  //= svg text コード V2 2023.12.25c 
  //  参照: 
  //    makeRawContentJson Edition: 1) svg text コード  2) Meta
  //    addEmbedSvgText Edition   : 1) svg text コード ※ Plus-Attrs 情報が埋め込まれたもの 2) Meta 3) Plus-Attrs
  //  参考:
  //    <text id="_金額_25_" data-name="637,000" transform="translate(1743 2155)" font-size="30" font-family="sans-serif"><tspan x="0" y="0">637,000</tspan></text>
  //=
  let c = plusAttrsRef.value;
  let b = htmsvg_outer_ref.value;
  let svg = `
  <text
    id="${c.id.val}"
    data-name="${c["data-name"].val}"
    data-path="${c["data-path"].val}"
    data-lang="${c["data-lang"].val}"
    data-numfmt="${c["data-numfmt"].val}"
    x="${b.x}" y="${b.y}" 
    textLength="${b.textLength}" 
    lengthAdjust="${b.lengthAdjust}" 
    text-anchor="${b.text_anchor}" 
    font-family="${b.font_family}" 
    font-size="${b.font_size}" 
    fill="${b.fill}" 
    stroke="${b.stroke}" 
    stroke-width="${b.stroke_width}"
    transform = "${b.transform}"
    paint-order="stroke"
  >
    <tspan x="0" y="0">${b.text}</tspan>
  </text>
  `;
  console.log("  svg: " + svg);

  const plus_pos_size = domPosSize(able_target_ref.value);

  const data = {
    svg: structuredClone(svg),
    htmsvg: structuredClone(b),
    plus: structuredClone(c),
    pos_size: structuredClone(plus_pos_size)
  };

  data["svg"] = ""; // 2023.12.25c 親 EditSvgEmbed が自ら作成する仕様となった、↑Debug のため残しますが、 一旦、svg text コードをクリア

  emit('reqAddEmbedSvgText', c.id.val, data);
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
    // children: [] as any[],             // !! 子 EditHtmlFrame があれば実装して下さい 2023/10/12
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

  //= エラーチェック 2023/11/09 ※ Memory を除き、onMounted での呼び出し時は、データがないので、エラーとなる ⇒問題ではない
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


const onRecordSelected = (record) => {
  console.log("onRecordSelected " + JSON.stringify(record, null, 2));

  md_title.value = record["title"];
  md_subtitle.value = record["subtitle"];
  md_author.value = record["author"];
  md_version.value = record["version"];
  md_variation.value = record["variation"];
  md_keywords.value = record["keywords"];
  md_groups.value = record["groups"];

  my_just_ref.value = record["pos_size"];

  //= 【2023-10-12】EditHtml.vue では、子 EditSvgEmbed 等 uuid は変更出来ない（固定 uuid ルール elem -> html -> これら子 仕様なので）
  //  遡って EditHtml.vue を上書き出来なく、uuidRef.value を修正出来ず、当関数は、下記の何れかになる：
  //  1) Debug 機能：uuidRef.value と record.uuid の 違いを許容する（即ち、record.uuid を無視する）
  //  2) 本 機能：record.uuid を無視する、または、
  //  3) 本 機能：uuidRef.value を DB の同 record に強制的上書き　
  //      ※ 左記 record が再利用される予想なので、左記の処理を実行すべきではない
  //            ⇒ ↑ のため、version variation を設けた. TODO 別 version variation 入力を提示する
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


const makeRawContentJson = (rootContainerRequired) => { // 参照 addEmbedSvgText
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

  //= svg text コード V1 2023.12.05
  //  参照: makeRawContentJson addEmbedSvgText
  //=
  let b = htmsvg_outer_ref.value; // !! 2023.12.05
  // svg = `<text x="${b.x}" y="${b.y}" textLength="${b.textLength}" lengthAdjust="${b.lengthAdjust}" text-anchor="${b.text_anchor}" ` +
  //   `font-family="${b.font_family}" font-size="${b.font_size}" fill="${b.fill}" stroke="${b.stroke}" transform = "${b.transform}">\n` +
  //   `${b.text}\n` +
  //   `</text>\n`

  let svg = `
  <text x="${b.x}" y="${b.y}" textLength="${b.textLength}" lengthAdjust="${b.lengthAdjust}" text-anchor="${b.text_anchor}" font-family="${b.font_family}" font-size="${b.font_size}" fill="${b.fill}" stroke="${b.stroke}" transform = "${b.transform}"
  >
    ${b.text}
  </text>
  `;
  
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

  console.log(`htmsvg_outer_ref changed to ${JSON.stringify(newVal, null, 2)}, push it to historyRef`);
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


watch(editPlusReqRef, (val) => {  // 2023.12.25c
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {
    console.log(` not for me editPlusReqRef, do nothing!`);
    return;
  }

  console.log("$$$$ watch editPlusReqRef");
  if (!val) {
    console.log(`val is ${val}, do nothing!`);
    return;
  } else {
    console.log("  val: " + JSON.stringify(val, null, 2));
  }

  const id = val["id"];
  const data = val["data"];
  const c = data["plus"];
  const b = data["htmsvg"];
  const pos_size = data["pos_size"];

  htmsvg_outer_ref.value = { ...b };
  plusAttrsRef.value = { ...c };
  const plus_pos_size = { ...pos_size };

  nextTick(() => {
    console.log("  plus_pos_size: " + JSON.stringify(plus_pos_size, null, 2));
    applyDomPosSize(able_target_ref.value, plus_pos_size);

    updateLPanelAttrs(); // 2024.01.06c L-attr に反映
  })
}, { deep: true })


onMounted(async () => { // after DOM nodes be inserted
  await nextTick();
  console.log(props.com_type + ' ' + uuidRef.value + ' is mounted!');

  updateLPanelAttrs(); // 2024.01.06c L-attr に反映 

  //= 2024.01.01c memory 機能の追加に伴い、下記の処理をコメントアウトした
  if ((attrs["content"] === 'text_embed') || (props.content === 'text_embed')) {
    console.log("  content is text_embed, do nothing!");
    return;
  }

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


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  // inheritAttrs: true, // !! 2023.12.26a defineOptions へ移動した

  //= 副作用のある操作を一度だけ実行したいとき( <script setup> はコンポーネントが作成されるたびに実行されます)  
});
</script>


<style lang="scss" scoped>

// 全ての要素にborder-boxを適用させておく設定
*, *:before, *:after {
  box-sizing: border-box;
}


.galaxy {
    position: relative;
    display: block;
    background-color: rgba(0, 0, 0, 0) !important;
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
    color: gray;
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

.svg_container {
}

.raw_edit_frame {
  display: block;
  position: absolute !important;
  z-index: 10000;
  left: 0px;
  top: 0px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.0);
  opacity: 0.85;
}

.raw_edit {
  pointer-events: auto;
}


</style>