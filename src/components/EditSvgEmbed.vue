<!-- 
  SVG 1.1 仕様 （第２版） 日本語訳 
    https://triple-underscore.github.io/SVG11/index.html#minitoc
-->


<template>
  <div 
    ref = "galaxy_ref" 
    class = "galaxy client_decided html_events" 
    title = "galaxy_ref :- EditSvgEmbed galaxy: div, Position, Size の基準（当 Html Frame の 辺界線）" 
  >
        
    <div v-if = "isDevModeRef" class = "who_am_i">{{ props.com_type }} : {{ uuidRef.value }}</div>
<!-- 
    <v-btn v-if = "false" color = "primary" title = "html-galaxy debuging button" >
        Click EditSvgEmbed galaxy!
    </v-btn>
 -->

    <div display="none">
      <svg display="none">
        <desc>SVG DEFS-SYMBOL Library</desc>
      </svg>
    </div>


    <div v-if = "true"
      ref   = "earth_ref"
      @click = "onMeClick"
      class = "editor_canvas client_decided html_events "
      :style = "{ 'background-color': htmsvg_outer_ref.background_color, 'color': 'htmsvg_outer_ref.background_color' }"
      title = "earth_ref :- EditSvgEmbed earth: div, canvas, to warp svg-root"
    >  


      <v-container  
          :attach="sel_cmenu_attach"
          ref = "menu_container_ref" 
          class = "menu_container" 
          title = "menu_container_ref :- EditSvgEmbed Menu Container"
      >
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
                  @mouseover = "onCmenuItemMouseOver(item)"
              >
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>

      </v-container>

      <!-- BEGIN コンテンツ実体 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->

      <div v-if="true" class = "svg_outer">
        <svg v-if = "true" ref = "moon_ref" class = "svg_root" :viewBox = "viewBoxStr" >
          <title>moon_ref :- svg of EditSvgEmbed</title> 

          <g v-if = "true" >
            <title> EditSvgEmbed 実要素 + Ctrl Group </title>

            <g v-if = "true">
              <title>EditSvg 【実要素】Group </title>

              <!-- 
                方法 3) 「.innerHTML = 」in EditSvgDefs.vue, See EditSvgDefs.vue
                        watch(svg_content_ref
                        onMounted(
                方法 2) v-html: OK （EditSvgDefs Top svg Tag を上書きしたくないので、不使用）
                  v-html = "htmsvg_inner_ref"
              -->
              <template v-for="(n, i) in layers_length_ref" :key="i">
                <EditSvgDefs v-if="layer_show_ref[i]"
                      v-model:svg_ref = "htmsvg_dom_ref[i]"
                      v-model:htmsvg_container_ref = "htmsvg_container_ref[i]"
                      v-model:svg_content_ref = "htmsvg_inner_ref[i]"
                      class = "mii_svg" 
                >
                </EditSvgDefs>
              </template>
            </g>  
          </g> 
        </svg> 
      </div>


      <!-- Svg Text 追加ツール -->
      <EditHtmlElem v-show = "svg_text_show_ref && enableAddSvgTextRef"
          :parent_uuid = "uuidRef"
          :is_root  = "false"
          :able     = "true"
          :uuid     = "svg_text_uuid"
          :z_index  ="2000"
          ref       = "svg_text_ref"
          tag_name  = "u-svg"
          tag_type  = "svg"
          content   = "text_embed"
          :plus     = "true"
          :init_x       = "0"
          :init_y       = "0"
          :init_width   = "320"
          :init_height  = "240"
          class     = "intent"
          :style    ="{ 'z-index': 2000 }"
          v-model:editPlusReqRef = "edit_plus_req_ref"
          @pos_size_decided = "onSvgTextPosSizeDecided"
          v-on:reqAddEmbedSvgText = "onReqAddEmbedSvgText"
      >
        <template v-slot:rawElemCnts>
           text
        </template>
      </EditHtmlElem>



      <!-- ↓ TODO 
        ↓ の必要性、実装方法を検討する必要があり、取りあえず外す 2023/10/12
        Save/Load も未対応 
      -->
      <div v-if = "false && show_other_ref" class="other_frame">
        <!-- 
          TODO
          1) ↓ 内 すべて background-color rgba(, , , 0.0) にした: 透過と表示されない（※ galaxy だけ効かないと判明した）
          2) style="background-color: rgba(255, 0, 0, 0.5)" : 効かない
          3) style="background-color: rgba(255, 0, 0, 0.5) !important" : 効く！
              ⇒ 子孫に影響が様子、対策として、「style="background-color: rgba(0, 0, 0, 0.0) !important"」と書くように
          4) style="opacity: 0.5": 効く
          　　⇒ 仕様上、子孫も透過となるので、使う本意ではない
          【廃止】 2023/11/02
          :myPosSizeRef       = "props.myPosSizeRef"
          :raResizingSize     = "props.raResizingSize"
          :raResizingViewbox  = "props.raResizingViewbox"

          2024.01.06c EditHtmlFrame.vue style galaxy に移動した
            style = "background-color: rgba(0, 0, 0, 0.0) !important" 
        -->
        <EditHtmlFrame
          ref                 = "other_tag_ref"        
          :is_root            = "false"
          :uuid               = "other_uuid"
          :parent_uuid        = "(uuidRef.value as string)"
          :editing_uuid       = "props.editing_uuid"
          :editing_id         = "props.editing_id"
          :being_edit_id      = "props.being_edit_id"

          :writeable_ctrl_on_other = "true"
          v-model:ctrl_on_other = "ctrl_on_other"
        >
        </EditHtmlFrame>
      </div>  

      <!-- END コンテンツ実体 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->


      <!-- BEGIN META, TOOL-BAR, LIST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
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

          <v-btn prepend-icon="mdi-playlist-plus"
              class="mini-toolbar-btn"
              title="Listup"
              :disabled="sel_conds_ref == null"
              @click="loadDbRecList"
          > Listup
          </v-btn>

          <!--
          一覧表示
          選択
          レコード表示
          :disabled="(Object.keys(htmsvg_plus_ref).length > 0)"
        -->
          <v-btn prepend-icon="mdi-view-list"
              class="mini-toolbar-btn"
              title="Show Plus-Attrs List"
              
              @click="showPlusAttrsList"
          > Text List
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

        <div class="plus_frame" v-if="showPlusListRef" >
          <v-container>
            <v-row class="plus_item">
              <v-col class="plus_header">
                id
              </v-col>
              <v-col class="plus_header">
                data-name
              </v-col>
              <v-col class="plus_header">
                data-id
              </v-col>  
              <v-col class="plus_header">
                desc
              </v-col>   
              <v-col class="plus_header">
                text
              </v-col>  
              <v-col class="plus_header">
                data-path
              </v-col>
              <v-col class="plus_header">
                Edit
              </v-col>
            </v-row>
            <template v-for="(v, key) in htmsvg_plus_ref" :key="key">
              <v-row class="plus_item">
                <v-col class="plus_item_content">
                  {{ key }}
                </v-col>
                <v-col class="plus_item_content">
                  {{ v.plus["data-name"]["val"] }}
                </v-col>
                <v-col class="plus_item_content">
                  {{ v.plus["data-id"]["val"] }}
                </v-col>  
                <v-col class="plus_item_content">
                  {{ v.plus["desc"]["val"] }}
                </v-col>   
                <v-col class="plus_item_content">
                  {{ v.htmsvg.text }}
                </v-col>  
                <v-col class="plus_item_content">
                  {{ v.plus["data-path"]["val"] }}
                </v-col>
                <v-col>
                  <v-btn icon @click="onPlusItemClicked(key)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </v-container>
        </div>

      </div>
      <!-- END META, TOOL-BAR, LIST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->

    </div>  <!-- END earth_ref -->

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
  effectScope, getCurrentScope, onScopeDispose, markRaw, toRaw, reactive, shallowReactive, shallowReadonly, isReactive, computed, shallowRef, triggerRef, customRef, ref, unref, toRef, toRefs, isRef,
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

const fsmService = inject('fsmService');

const isDevModeRef = inject('isDevModeRef');
const isPreviewModeRef = inject('isPreviewModeRef');

import EditSvgDefs from "./EditSvgDefs.vue"
import EditHtmlElem from "./EditHtmlElem.vue"
import EditHtmlFrame from "./EditHtmlFrame.vue";

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

const MAX_SVG_LAYER_NUM: any = inject("MAX_SVG_LAYER_NUM");
const svg_em_lay_show_ref: any = inject("svg_em_lay_show_ref");
const svg_em_lay_length_ref: any = inject("svg_em_lay_length_ref");
const svg_em_cur_layer_ref: any = inject("svg_em_cur_layer_ref");
const svg_embed_ref: any = inject('svg_embed_ref');

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

const enableAddSvgTextRef:any = inject('enableAddSvgTextRef');

const selDocFileRef = inject('selDocFileRef');
const docFileName = inject('docFileName');


const galaxy_ref    = ref(null);    // DOM
const earth_ref     = ref(null);    // DOM
const moon_ref      = ref(null);    // DOM

const show_toolbar_ref = ref(false);  // show | hide 2023.12.25b

const familyZIndexRef = defineModel<any>("familyZIndexRef", { local: true, default: null });  // 2023.12.18a Family EdiyHtmlElem の z-index on EditHtmlFrame
console.log("######## familyZIndexRef value: " + familyZIndexRef.value);

const layers_length_ref = ref(10);   // Layer 数           2023.12.24r 使われている数、いつまでも変更可能。　
const cur_layer_ref     = ref(0);   // current layer 0..  2023.12.24r ↓に合わせる
const layer_show_ref    = ref(      // []show | hide      2023.12.24r 後に [0] は true にする
          Array(MAX_SVG_LAYER_NUM).fill(false));

//= svg | html 系統一的な変数
const prefer_posize_ref: any = ref(null);  // 2023.12.30a null | { x, y, w, h, transform} , 確定した位置とサイズ

const mii_htmsvg_ref        = ref(null);  // 自分自身の ref

const htmsvg_dom_ref        = ref( Array(MAX_SVG_LAYER_NUM).fill(null) );  // DOM,                    2023.12.24r null, defineModel svg_ref of EditSvgDefs.vue
const htmsvg_container_ref  = ref( Array(MAX_SVG_LAYER_NUM).fill(null) );  // DOM,                    2023.12.24r null, defineModel htmsvg_container_ref of EditSvgDefs.vue
const htmsvg_inner_ref      = ref( Array(MAX_SVG_LAYER_NUM).fill("")   );  // SVG テキストコンテンツ,   2023.12.24r '',   defineModel svg_content of EditSvgDefs.vue

const PLUS_LAYER_IDX = 5;           // 2023.12.25c
const htmsvg_plus_ref = ref({});    // SVG-TXT 元データ 2023.12.25c { id : _, data : { svg, htmsvg, plus } }

//= v-model:editPlusReqRef = "edit_plus_req_ref"
//  useAttrs は、reactive ではなく、watch 出来ないため、v-model OR props を使う必要がある
//= 2023.12.25c
const edit_plus_req_ref = ref({});  // ↑ { id: {svg, htmsvg, plus, ...} } 2023.12.25c

let madeInHis = false; // 2024.01.01a History から作成される時 true にする（History に追加されることを防ぐため） ※ 内容が変更された時、false にすることを忘れずに

const htmsvg_outer_ref = ref({            // 2024.01.08s DB Fix Save/Load ↓ .value にした ※ あくまでも初期値であって、watch で更新されることを期待している
  draw          : htmsvg_inner_ref.value,   // [] 2024.01.08s SVG テキストコンテンツ
  layer_show    : layer_show_ref.value,     // [] 2024.01.08s show | hide
  layers_length : layers_length_ref.value,  //    2024.01.08s Layer 数
  cur_layer     : cur_layer_ref.value,      //    2024.01.08s current layer 0..
  
  z_index: familyZIndexRef.value,           // 2024.01.08s L - attrs のみ更新更新されるため、それ以外の watch(familyZIndexRef) 更新は不要; Family EdiyHtmlElem の z - index on EditHtmlFrame

  //= background_color color ※ 親 container earth_ref に（も）適用する TODO assets etc. 出力に適用させ
  //  "" | null | undefined の時、appCfgRef.back_color front_color を適用する
  //=
  background_color: "rgba(0, 0, 0, 0.0)",   // 2023.12.16a 透明 if not is_root EditHtmlFrame
  color: appCfgRef.value.front_color,

  // TODO style 情報
  // style: "fill:rgba(124, 237, 127, 0.15);stroke-width:1;stroke:rgba(33,33,255,1.0)"  // TODO R-Panel で実装する予定の属性
});
console.log("######## htmsvg_outer_ref value: " + JSON.stringify(htmsvg_outer_ref.value, null, 2));


watch(htmsvg_inner_ref, (newVal) => { // 2024.01.08s
  console.log("#### htmsvg_inner_ref changed: " + newVal);
  htmsvg_outer_ref.value.draw = newVal;
}, { deep: true });

watch(layer_show_ref, (newVal) => { // 2024.01.08s
  console.log("#### layer_show_ref changed: " + newVal);
  htmsvg_outer_ref.value.layer_show = newVal;
}, { deep: true });

watch(layers_length_ref, (newVal) => { // 2024.01.08s
  console.log("#### layers_length_ref changed: " + newVal);
  htmsvg_outer_ref.value.layers_length = newVal;
}, { deep: true });

watch(cur_layer_ref, (newVal) => { // 2024.01.08s
  console.log("#### cur_layer_ref changed: " + newVal);
  htmsvg_outer_ref.value.cur_layer = newVal;
}, { deep: true });


layer_show_ref.value[PLUS_LAYER_IDX] = true;  // 2023.12.25c

//= MAX_SVG_LAYER_NUM まで ↑ を初期化する
for (let i = 0; i < MAX_SVG_LAYER_NUM; i++) {
  switch (i) {  // サンプルコンテンツで初期化する
    case 0: // circle stroke red fill 透明
      layer_show_ref.value[i] = true;
      htmsvg_inner_ref.value[i] = '<circle cx="20" cy="20" r="15" stroke="red" fill="rgba(0, 0, 0, 0.0)" stroke-width="2" />';
      break;
    case 1: // Ellipse stroke red fill 透明
      htmsvg_inner_ref.value[i] = '<ellipse cx="20" cy="20" rx="15" ry="10" stroke="red" fill="rgba(0, 0, 0, 0.0)" stroke-width="2" />';
      break;
    case 2: // 三角形 stroke red fill 透明
      htmsvg_inner_ref.value[i] = '<polygon points="20,5 40,40 5,40" stroke="red" fill="rgba(0, 0, 0, 0.0)" stroke-width="2" />';
      break
    case 3: // 四角形 stroke red fill 透明
      htmsvg_inner_ref.value[i] = '<rect x="10" y="10" width="100" height="100" stroke="red" fill="rgba(0, 0, 0, 0.0)" stroke-width="2" />';
      break;
    case 4: // 三角形 stroke green fill 透明
      htmsvg_inner_ref.value[i] = '<polygon points="20,5 40,40 5,40" stroke="green" fill="rgba(0, 0, 0, 0.0)" stroke-width="2" />';
      break;
    case 5: // circle stroke blue fill 透明
      htmsvg_inner_ref.value[i] = '<circle cx="20" cy="20" r="15" stroke="blue" fill="rgba(0, 0, 0, 0.0)" stroke-width="2" />';
      break;
    case 6: // Ellipse stroke blue fill 透明
      htmsvg_inner_ref.value[i] = '<ellipse cx="20" cy="20" rx="15" ry="10" stroke="blue" fill="rgba(0, 0, 0, 0.0)" stroke-width="2" />';
      break;
    case 7: // 三角形 stroke blue fill 透明
      htmsvg_inner_ref.value[i] = '<polygon points="20,5 40,40 5,40" stroke="blue" fill="rgba(0, 0, 0, 0.0)" stroke-width="2" />';
      break
    case 8: // 四角形 stroke blue fill 透明
      htmsvg_inner_ref.value[i] = '<rect x="10" y="10" width="100" height="100" stroke="blue" fill="rgba(0, 0, 0, 0.0)" stroke-width="2" />';
      break;
    case 9: // 三角形 stroke yellow fill 透明
      htmsvg_inner_ref.value[i] = '<polygon points="20,5 40,40 5,40" stroke="yellow" fill="rgba(0, 0, 0, 0.0)" stroke-width="2" />';
      break;
    default:
      htmsvg_inner_ref.value[i] = '';
      break;
  }
}


const updateLPanelAttrs = () => { // 2024.01.06c L-attr に反映
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {  // 2024.01.06b
    console.log(`${uuidRef.value} L-Panel is not for me, do nothing!`);
    return;
  }

  console.log("#### ${uuidRef.value} updateLPanelAttrs");
  try {
    //+ DATA Tab
    svg_em_lay_length_ref.value = layers_length_ref.value;
    svg_em_cur_layer_ref.value = cur_layer_ref.value;
    svg_em_lay_show_ref.value = layer_show_ref.value;

    svg_embed_ref.value['z_index'] = htmsvg_outer_ref.value['z_index'];
    svg_embed_ref.value['background_color'] = htmsvg_outer_ref.value['background_color'];
    svg_embed_ref.value['color'] = htmsvg_outer_ref.value['color'];

    //+ COLOR Tab, 2024.01.08b ここに移動した
    selColorsRef.value = {  // 2023.12.16a
      "background_color": htmsvg_outer_ref.value.background_color,
      "color": htmsvg_outer_ref.value.color,
    }

    initSelColorPicker("background_color", htmsvg_outer_ref.value.background_color, uuidRef.value);  // 2024.01.08b
  } catch (e) {
    console.log("  error: " + e);
  }
}


// updateLPanelAttrs(); // 2024.01.06c L-attr に反映, onMounted へ移動した

watch(actingEditRef, (val) => { //  2023.12.16a
  if ((val.com_type != props.com_type) || (val.uuid != uuidRef.value)) {
    console.log(`changed actingEditRef is not  me, do nothing!`);
    return;
  }

  nextTick(() => {
    console.log("$$$$$$$$ actingEditRef changed to me, update L-attr htmsvg_outer_ref and selColorsRef"); // 2024.01.06b 
    updateLPanelAttrs(); // 2024.01.08b L-attr に反映: DATA Tab + COLOR Tab (selColorsRef, initSelColorPicker)
  })
}, { deep: true });


const svg_uuid          = ref('');    // svg template （↓ id[]）を特定するための id
const svg_embed_items   = ref([]);    // 埋め込みデータ（テキスト、INPUT）
const svg_xml_declaration = ref('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n');    // .svg 一行目

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

const able_pointed = defineModel<boolean>("able_pointed", { local: true, default: true })		// name able_pointed 使用, parent: v-model:able_pointed="able_pointed"


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


//= svg text 追加ツール
const svg_text_ref = ref(null);       // DOM 2023.12.25c
const svg_text_uuid = uuidv4();       // uuid 2023.12.25
const svg_text_show_ref = ref(true);  // show | hide 2023.12.25c

const svg_text_posize = ref({         // 2023.12.25c Current 位置とサイズ
  x: 0,
  y: 0,
  w: 0,
  h: 0,
});


//= OTHER := 子 EditHtmlFrame.vue
const other_tag_ref     = ref(null);      // 拡張性を提供する EditHtmlFrame.vue
const other_uuid        = uuidv4();       // 拡張性を提供する EditHtmlFrame.vue
const show_other_ref    = ref(false);     // 廃止? 2023/10/11

const ctrl_on_other     = ref(false);     // Ctrl On OTHOR | SELF


const mini_ctrl_ref   = ref(null);

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
  console.log("$$$$EditSvgEmbed watch galaxy c val: " + val.w + " - " + + val.h + " oldVal: " + oldVal.w + " - " + + oldVal.h);
  console.log("  gx: " + val.gx + " gy: " + val.gy + " gtop: " + val.gtop + " gright: " + val.gright + " gbottom: " + val.gbottom + " gleft: " + val.gleft);
});

const viewBoxStr = computed(() => { return c.x + ' ' + c.y + ' ' + c.w + ' ' + c.h; });  // view-Box
const rootMinX = computed(() => { return c.x + 'px'; });           // foreignObject
const rootMinY = computed(() => { return c.y + 'px'; });           // foreignObject
const rootWidth = computed(() => { return (c.w + 'px'); });         // foreignObject, View-Port
const rootHeight = computed(() => { return (c.h + 'px'); });         // foreignObject, View-Port


const b = ref({ // Debuger
  id: "",
  cls: "",
  x1: 12,
  y1: 12,           
  x2: 640 - 12 * 2, 
  y2: 480 - 12 * 2,         
  stroke: "red",
  stroke_width: 5,
});

defineOptions({
  inheritAttrs: true, // 2023.12.26a
})

// 親コンポーネントから子コンポーネントに文字列、数値、配列やオブジェクトを渡す
const props = defineProps({ // I/F: 親⇒子のデータの受け渡し
  com_type: {                // edit_svg | edit_html_tag | ..
    type: String,
    default: "edit_svg_embed",
  },

  // uuid: {                     // uuid は、このコンポーネントの一意の識別子です ↓debug 値
  //   type: String,             //    "47ecdd97-218c-4f5a-bb51-dec3ff87e6ad"
  //   required: true,
  // },

  parent_uuid: {              // DB 上親特定用
    type: String,
    required: true,
  },  
  editing_uuid: {             // Able を含む上流の editor | elem の uuid
    type: String,             //    "cdf51dd6-d1b2-46c7-ab6e-39c2430f8aa2"
    required: true,
  },
  editing_id: {               // is_editing := [ uuid, editing_id    ] MATCHING, Moaveable 動作中
    type: String,             //    "elem_moveable"
    required: true,           //    親の editing_id と同一を保つことで、親の is_editing を追跡する
  },
  being_edit_id: {            // being_edit := [ uuid, being_edit_id ] MATCHING, コンテンツ操作中
    type: String,             //     "elem_contents"
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

  is_root: {                  //
    type: Boolean,            //    false
    default: false,
  },
  able: {                     // true | false
    type: Boolean,            //    false
    default: false,           
  },
  tag_name: {                 // div | span | ..
    type: String,             //    div
    default: "div",
  },
  tag_type: {                 // html_singleton | html_paired | raw_html | null
    type: String,             //    "html_paired"
    default: "html_paired",
  },
  content: {                  // tag の中身
    type: String,             //     ""
    default: "",
  },
})

console.log("@@@@@@@@ EditSvgEmbed props: " + JSON.stringify(props, null, 2));
const attrs = useAttrs(); // 2023.12.25c
console.log("@@@@@@@@ attrs: " + JSON.stringify(attrs, null, 2));

console.log("other_uuid: " + other_uuid);

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



const onSvgTextPosSizeDecided = (ps) => {
  console.log("$$$$$ onSvgTextPosSizeDecided " + JSON.stringify(ps));
}

const onReqAddEmbedSvgTextStable = (data) => {  // 2023.12.25c
  console.log("$$$$$ onReqAddEmbedSvgText " + JSON.stringify(data, null, 2));
  htmsvg_inner_ref.value[cur_layer_ref.value] += data['svg'];
}


const onReqAddEmbedSvgText = (id, data) => {  // 2023.12.25c
  //= htmsvg_plus_ref 対応版
  //  1) htmsvg_plus_ref に追加 ⇒ 上書き、後に EditSvgText にて再編集を可能にするため
  //  2) htmsvg_inner_ref Layer[5] : Plus Layer ※ PLUS_LAYER_IDX, jSON 書き換えデータ層
  //    本来、最終の svg コード = htmsvg_inner_ref + htmsvg_plus_ref の合成となるが、簡単のため、Layer[5] は htmsvg_plus_ref 専用とする
  //    a) そのため、htmsvg_inner_ref は、Layer[0] から Layer[8] までとする ※ 空の Layer は、出力時に除外される
  //    b) 想定使い方
  //        例: Layer 0: 帳票テンプレート, 1～4: データの裏に表示されるべき物, 5: plus layer（データ書き換え可能）, 6～: データより手前の表示物（署名、他）
  //  3) ↑の設計より、データの書き換えは、.svg ファイル書き換えの他、htmsvg_plus_ref の書き換えを可能にした
  //    c) 本書き換えは別途としても、試し書き換え、微調整等は必要な機能と考えられる
  //= 
  console.log(`$$$$$ onReqAddEmbedSvgText id: ${id}`);
  console.log("  data:\n" + JSON.stringify(data, null, 2));
  const plus = htmsvg_plus_ref.value;
  if (plus[id]) {
    console.log('  update it');
  } else {
    console.log('  add it');
  }
  plus[id] = data;
  console.log("  plus:\n" + JSON.stringify(plus, null, 2));
}


watch(htmsvg_plus_ref, (val) => { // 2023.12.25c val := { id : { svg, htmsvg, plus, pos_size } }
  console.log("$$$$$ htmsvg_plus_ref changed val: " + JSON.stringify(val, null, 2));

  if (val) {


    const plus = htmsvg_plus_ref.value;
    const keys = Object.keys(plus);
    console.log("  keys: " + JSON.stringify(keys, null, 2));

    htmsvg_inner_ref.value[PLUS_LAYER_IDX] = "";   // !! 2023.12.25c

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const data = plus[key];
      console.log("  key: " + key + " data: " + JSON.stringify(data, null, 2));

      makePlusSvgText(data);  // 2023.12.25c data := { svg: svg, htmsvg: b, plus: c }
      htmsvg_inner_ref.value[PLUS_LAYER_IDX] += data['svg'];   // !!
    }
  }
}, { deep: true });


//= 2023.12.25c Plus-Attrs
//  1) List 表示
//  2) ↑の List から選択して、EditSvgTextにて編集させ、変更を反映させる
//    a) List UI を作る
//=
const showPlusListRef = ref(false);
const showPlusAttrsList = () => {
  
  // const plus = htmsvg_plus_ref.value;
  // console.log("  showPlusAttrsList: " + JSON.stringify(htmsvg_plus_ref.value, null, 2));

  showPlusListRef.value = !showPlusListRef.value;
}


const onPlusItemClicked = (id) => {
  //= EditSvgText にて編集させ、変更を反映させる
  console.log("$$$$$ onPlusItemClicked id: " + id);
  const plus = htmsvg_plus_ref.value;
  const data = plus[id];
  // console.log("  data: " + JSON.stringify(data, null, 2));

  showPlusListRef.value = false;
  

  nextTick(() => {  
    svg_text_show_ref.value = true;     // Local Show/Hide
    enableAddSvgTextRef.value = true;   // L-Panel Show/Hide

    edit_plus_req_ref.value = {
      id: id,
      data: data,
    }
  })
}


const makePlusSvgText = (data: object) => {  // 2023.12.25c data := { svg, htmsvg, plus, pos_size } 
  console.log("$$$$ makePlusSvgText data: " + JSON.stringify(data, null, 2));

  //= svg text コード V2 2023.12.25c 
  //  参照: 
  //    EditSvgText.makeRawContentJson Edition  : 1) svg text コード  2) Meta
  //    makePlusSvgText Edition                 : 1) svg text コード ※ Plus-Attrs 情報が埋め込まれたもの 2) Meta 3) Plus-Attrs
  //  参考:
  //    <text id="_金額_25_" data-name="637,000" transform="translate(1743 2155)" font-size="30" font-family="sans-serif"><tspan x="0" y="0">637,000</tspan></text>
  //  TODO: x, y, 要修正？
  //=
  let c = data['plus'];
  let b = data['htmsvg'];
  let p = data['pos_size'];  // EditSvgText の { x, y, w, h, transform }　TODO 適用

  let pt = p.transform.replaceAll("px", "");  // 2023.12.19b 【制限】1px === svg 1単位 を前提としている, "translate(47px, 101px)" ⇒ "translate(47, 101)"

  //= 
  //  a) 位置・サイズ情報の適用案 2023.12.29a
  //    1) p pos_size   : { x ⇒ text,   y ⇒ text,  transform ⇒ text,  w ※1,   h ※1,  }※1: 現時点では、w, h は、無現時点では、w, h は、無視する  例: "transform": "translate(47px, 101px)"
  //    2) b htmsvg     : { x ⇒ tspan,  y⇒ tspan,  transform ⇒ text ※2                }※2 tspan には、transform がない  例:  "transform": "rotate(30 20,40)"
  //    3) c plus       : なし
  // 
  //  b) テキスト情報の適用案 2023.12.29a
  //    1) b.text       : ここでは、placeholder として、そのまま <tspan> の実データとして出力する ※ 別途 c の情報を使って、置換する想定
  //
  // 【参考】http://defghi1977.html.xdomain.jp/tech/svgMemo/svgMemo_08.htm　svg要素の基本的な使い方まとめ
  //=
  let svg = `
  <text
    id="${c.id.val}"
    data-name="${c["data-name"].val}"
    data-path="${c["data-path"].val}"
    data-lang="${c["data-lang"].val}"
    data-numfmt="${c["data-numfmt"].val}"
    textLength="${b.textLength}"
    lengthAdjust="${b.lengthAdjust}"
    text-anchor="${b.text_anchor}" 
    font-family="${b.font_family}" 
    font-size="${b.font_size}" 
    fill="${b.fill}" 
    stroke="${b.stroke}" 
    x="${p.x}" y="${p.y}" 
    transform="${pt} ${b.transform}"
  >
    <tspan x="${b.x}" y="${b.y}">${b.text}</tspan>
  </text>
  `;
  console.log("  svg: " + svg);
  data['svg'] = svg;  // !!
}


const emitedPosSizeRef = defineModel<any>("emitedPosSizeRef", { local: true, default: null });  // 位置とサイズが確定した, 旧 emit pos_size_decided
const deletedRef = defineModel<any>("deletedRef", { local: true, default: null });

const able_target_ref = defineModel<any>("able_target_ref", { local: true, default: null });  // the Moveable Target
const able_actmd_ref = defineModel<any>("able_actmd_ref", { local: true, default: null });  // 動作モード of the Moveable
const able_macro_ref = defineModel<any>("able_macro_ref", { local: true, default: null });  // in_ | out_ | io_, データ I/F of the Moveable


//= お試し 2023/11/02
const raResizingSize = computed(() => {
  let ct = {
    x: 0,
    y: 0,
    w: 160,   // 適当的
    h: 120,   // 適当的
  };
  let dom = able_target_ref;  // !! お試し
  if (dom.value) {
    ct.x = dom.value.offsetLeft;
    ct.y = dom.value.offsetTop;
    ct.w = dom.value.offsetWidth;
    ct.h = dom.value.offsetHeight;
  }
  return ct;
})

const emit = defineEmits([
  'props_updated',    // 親コンポーネントに、props の更新を通知
  'deleted',          // 親コンポーネントに、削除を通知
  'uuid_changed'      // 2023/10/09, oldValue, newValue
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

  //= cmenu
  //    1) ctrl_on_other サポート
  //    2) cmenu 動作すべき時だけ stopPropagation する
  //=
  console.log("######## onMeClick ctrl_on_other.value: " + ctrl_on_other.value + " being_edit: " + being_edit.value + " menu : " + cmenu.value);
  for (var value of currentKeySet) {  // control shift etc.
    console.log("currentKeySet has: " + value);
  }

  if (!currentKeySet.has('control')) {   // CTRL + L-Click  TODO R-Click  を除く
    console.log("control key not be detected, return AA");
    return false;
  }

  console.log("  ctrl_on_other 制御権限を " + ctrl_on_other.value ? "持っていない" : "持っている ..");
  if (ctrl_on_other.value) {
    console.log("return BB");
    return false;
  }

  if (!being_edit.value) {
    console.log("（親の）Moveable 動作中, return CC");
    return false;
  }

  if (cmenu.value) {
    // menu.value = false; // TODO v-menu 次回? 表示障害
    console.log("cmenu 表示中です、return DD");
    return false;
  }
    
  // //= 2023/07/29 cmenu 動作するのに、uuid の同一が必要とする要因は見出せない、余計な副作用を避けるため、暫定的、当処理を投入しない
  // if (editingObjRef.value.uuid != uuidRef.value) {
  //   console("editingObj.uuid は 自分の uuid ではない ⇒ 自分の uuid を書き込みます..")
  //   updateEditingObj({ editing_id: props.editing_id, uuid: uuidRef.value, com_type: props.com_type, url: 'EditEmbed', state: "is_editing", caused_by: "onMeClick" });
  // }

  //= 位置・領域 my_just を計算する
  const clientRect = earth_ref.value.getBoundingClientRect();
  console.log("  me clientRect: left = " + Math.round(clientRect.left) + ", top = " + Math.round(clientRect.top));            //  .x, y も可
  console.log("  me clientRect: width = " + Math.round(clientRect.width) + ", height = " + Math.round(clientRect.height));    // 
  console.log('  e clientX = ' + e.clientX + ', clientY = ' + e.clientY);                                                     // 参考 .x y pageX Y screenX Y

  const my_x = Math.round(e.clientX - clientRect.left);
  const my_y = Math.round(e.clientY - clientRect.top);
  my_just_ref.value = {
    x: my_x,
    y: my_y,
    w: Math.round(clientRect.width  - my_x),
    h: Math.round(clientRect.height - my_y)
  }
  console.log("  my_just: " + JSON.stringify(my_just_ref.value));

  //= cmenu 表示
  nextTick(() => {
    cmenu.value = true;
  })

  console.log("cmenu 表示を予約した、DO stopPropagation");
  e.stopPropagation();
}


const cmenu = ref(false);  // ref でないと、後に mouse move しない限り、menu は描画されない

//= 
//  TODO pysrc 側で apply embed vars （svg file の base64 転送を回避し、より簡素的、強固に）
const cmenuItems = ref([
  { id: 'who_am_i',             visible: true, name: 'EditSvgEmbed :' + uuidRef.value },  //

  { id: 'off_able_pointer',     visible: false, name: 'Disable Resize'              },
  { id: 'on_able_pointer',      visible: false, name: 'Enable Resize'               },

  { id: 'listup',               visible: true, name: 'Listup '                                                   },  // 一覧表示 TODO 3)

  { id: 'save_db',              visible: true,   name: 'Save It to DB'                                     },  // !! TODO 1)
  { id: 'load_db',              visible: true,   name: 'Load It from DB'                               },  // !! TODO 2)
  { id: 'remove_it',            visible: true,   name: 'Delete'                                         },  // !! TODO 親ノードから切り離す（DBにはそのまま残す）, shouldShow 参照, hide when is root
  { id: 'delete_db',            visible: true,   name: 'Delete It From DB'                                 },  // ↑＋ TODO

  { id: 'Resizable',            visible: true, name: 'Sel Resizable' },
  { id: 'Scalable',             visible: true, name: 'Sel Scalable' },

  { id: 'Warpable',             visible: true, name: 'Sel Warpable' },
  { id: 'Clippable',            visible: true, name: 'Sel Clippable' },
  { id: 'Roundable',            visible: true, name: 'Sel Roundable' },

  { id: 'Dra_Res',              visible: true, name: 'Sel Draggable Resizable' },
  { id: 'Dra_Res_Rot',          visible: true, name: 'Sel Draggable Resizable Rotatable' },
  { id: 'Dra_Sca',              visible: true, name: 'Sel Draggable Scalable' },
  { id: 'Dra_Sca_Rot',          visible: true, name: 'Sel Draggable Scalable Rotatable' },
  { id: 'All_In_One',           visible: true, name: 'Sel All In One' },


  //= 必要と判明したら、投入して下さい
  { id: 'drop_off_ctrl',        visible: true, name: 'Drop Off'                    },  // 制御権限をSubへ譲る ※ sub 側の操作で返さない限り、cmenu 表示出来ない 
  { id: 'takeup_ctrl',          visible: true, name: 'Takeup'                      },  // 制御権限を取り上げる ※ cmenu 表示されないため、動作することがない
  
  { id: 'load_svg_file',        visible: true, name: 'Load SVG File'               },  // !! 動的読み込み, 参考: https://github.com/damianstasik/vue-svg-loader
  { id: 'load_db_spec',         visible: true, name: 'Load key-set from DB'        },  // TODO DB から svg template （↓ id[]）を取り込む
  { id: 'save_db_spec',         visible: true, name: 'Save key-set to DB'          },  // TODO
  { id: 'make_embed_vars',      visible: true, name: 'Make Embed Vars'             },  // !! （例）会計アプリ API にてデータ取り込み
//{ id: 'check_embed_vars',     visible: true, name: 'Check Embed Vars'            },  // TODO ↑ 機能の一部? Template（id[] of svg_embed_items）に対して、データが足りるかどうか  
  { id: 'save_json_file',       visible: true, name: 'Save Json File'              },  // !! 中間データ保存する   
  { id: 'load_json_file',       visible: true, name: 'Load Json File'              },  // !! 中間データ vars file 読み込み
  { id: 'apply_embed_vars',     visible: true, name: 'Apply Embed Vars'            },  // !! 適用
  { id: 'save_svg_file',        visible: true, name: 'Save SVG File'               },  // !! 修正結果を保存する
  { id: 'pdf_2_svg',            visible: true, name: 'Convert PDF to SVG'          },  // !! Inkscape コマンド 
  { id: 'potrace_2_svg',        visible: true, name: 'Convert bmp/pnm to SVG'      },  // TODO Potrace コマンド, bw mode
  { id: 'Vtracer_2_svg',        visible: true, name: 'Convert PNG to SVG'          },  // TODO Vtracer コマンド, png jpg other, color 可
  { id: 'svg_2_pdf',            visible: true, name: 'Convert SVG to PDF'          },  // TODO Inkscape コマンド 可能か調査中
  { id: 'print',                visible: true, name: 'print'                       },  // TODO 印刷 検討：代って「Save PDF File」にする？


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

 if (item.id === 'off_able_pointer') {
    if (!able_pointed.value) {
      showIt = false;
    }
  } else if (item.id === 'on_able_pointer') {
    if (able_pointed.value) {
      showIt = false;
    }
  } else if (item.id === 'drop_off_ctrl') {
    if (ctrl_on_other.value) {
      showIt = false;
    }
  } else if (item.id === 'takeup_ctrl') {
    if (!ctrl_on_other.value) {
      showIt = false;
    }
  }

  return showIt;
}


const onCmenuItemClick = async (cmd: any) => {
  console.log('^^^^^^^^^ onCmenuItemClick id: ' + cmd.id + ' name: ' + cmd.name);

  var item = {}

  switch (cmd.id) {
    case 'who_am_i': break;
    case 'save_db':
      saveDbContent((null));
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
    case 'drop_off_ctrl':
      ctrl_on_other.value = true;
      break;
    case 'takeup_ctrl':
      ctrl_on_other.value = false;
      break;
    case 'load_svg_file':           // to load 'C:\\DOCs\\SvgEditor\\exam01.svg' into htmsvg_inner_ref
      loadSvgFile();
      break;
    case 'save_svg_file':
      saveSvgFile();
      break;
    case 'make_embed_vars':
      makeSvgEmbedItems();
      break;
    case 'save_json_file':
      saveSvgEmbedJsonFile();
      break;
    case 'load_json_file':
      loadSvgEmbedJsonFile();
      break;
    case 'check_embed_vars':
      const svgHtml = (htmsvg_container_ref.value as any).innerHTML;               // outerHTML
      const result = (svgHtml.indexOf("YOKOHAMA") >= 0) ? 'OK' : 'not-found';
      console.log(result);
      break;
    case 'apply_embed_vars':
      applySvgEmbedItems();
      break;
    case 'pdf_2_svg':
      inkscapePdf2Svg();
      break;
    case 'potrace_2_svg':
      potracePmnBmp2svg();
      break;
    case 'Vtracer_2_svg':
      vtracerPng2svg();
      break;
    case 'print':
      // TODO
      break;

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

  if ((val.cate == 'attr') && (val.event == "svg_embed")) {  // !!
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
        console.log("show_toolbar_ref.value: " + show_toolbar_ref.value);
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


  if (!(["inout", "able", "add", "database", "svg"].includes(val.cate))) {  // !! 2023.12.24a "svg" 追加 because of add ではなく、svg となっている
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



watch(svg_embed_ref, (val) => { // 2023.12.19a
  console.log("$$$$$$$$ watch svg_embed_ref");
  if (!val) {
    console.log(`val is ${val}, do nothing!`);
    return;
  };

  familyZIndexRef.value = Number(val["z_index"]); // !!
}, { deep: true });


watch(svg_em_cur_layer_ref, (val) => { // 2023.12.24r
  console.log("$$$$$$$$ watch svg_em_cur_layer_ref");
  cur_layer_ref.value = val;
  console.log(`  cur_layer_ref.value: ${cur_layer_ref.value}`);
}, { deep: true });


watch(svg_em_lay_show_ref, (val) => { // 2023.12.24r
  console.log("$$$$$$$$ watch svg_em_lay_show_ref");
  layer_show_ref.value = JSON.parse(JSON.stringify(val)); 
  console.log(`  lay_show_ref.value:` + JSON.stringify(layer_show_ref.value, null, 2));
}, { deep: true });


//= TODO ↑に統合
// //= cmenu.id 該当の event
// watch(actingEditEventRef, (val) => {
//   console.log("$$$$$$$$ watch actingEditEventRef");
//   if (!val) {
//     console.log(`val is ${val}, do nothing!`);
//     return;
//   };

//   console.log(`  val: ${JSON.stringify(val)}`);

//   if (!((val.com_type == props.com_type) && (val.uuid == uuidRef.value))) {
//     console.log(`is not for me, do nothing!`);
//     return;
//   }

//   if (!(["svg"].includes(val.cate))) {
//     console.log(`not maching cate, do nothing!`);
//     return;
//   }

//   let item = null, cmd = null;

//   //= cmenu id を特定する
//   for (var cm of cmenuItems.value) {
//     if (cm["id"] == val.event) {
//       cmd = cm;
//       break;
//     }
//   }

//   //= onCmenuItemClick 参照
//   if (cmd != null) {
//     onCmenuItemClick(cmd);
//   } else {
//     console.log("cmenu id が特定できませんでした..");
//   }

// });



const makeDocFileName = (type: String, name: String) => {
  if ((selDocFileRef.value["type"] != type) || (selDocFileRef.value["name"] == "")) {
    nextTick(() => {
      selDocFileRef.value["type"] = type;
      selDocFileRef.value["name"] = name;
    })
  }
}


const onCmenuItemMouseOver = (cmd: any) => {
  console.log('^^^^^^^^^ onCmenuItemMouseOver id: ' + cmd.id + ' name: ' + cmd.name);

  var item = {}

  switch (cmd.id) {
    case 'load_svg_file':
      makeDocFileName("svg", "noname.svg");
      break;
    case 'save_svg_file':
      makeDocFileName("svg", "noname.svg");
      break;
    case 'save_json_file':
      makeDocFileName("json", "noname.json");
      break;
    case 'load_json_file':
      makeDocFileName("json", "noname.json");
      break;
    case 'pdf_2_svg':
      makeDocFileName("pdf", "noname.pdf");
      break;
    case 'potrace_2_svg':
      makeDocFileName("png", "noname.png");
      break;
    case 'Vtracer_2_svg':
      makeDocFileName("png", "noname.png");
      break;
    case 'print':
      makeDocFileName("pdf", "noname.pdf");
      break;

    default:
      break;
  }
}


const makeSvgEmbedItems = () => {   // Local Example 版, TODO 作成画面
  const source = [
    ["YOKOHAMA",      "横浜"],
    ["SHICHOSAMA",    "市長様"],
    ["YY",            "6"],
    ["MM",            "05"],
    ["DD",            "31"],
    ["1234",          "1111"],
    ["5678",          "2222"],
    ["90AB",          "3333"],
    ["045-123-4567",  "03-1111-2222"],
    ["KAISYA",        "ABC株式会社"],
    ["FURIKANA",      "ABCカブシキカイシャ"],
    ["yz",            "05"],
    ["mz",            "03"],
    ["dz",            "01"]
  ];

  const items = [];
  let em = {};  

  for (let so of source) {
    em = {};
    em["id"     ] = uuidv4();
    em["kind"   ] = "text";           // "text" | "html_tag"
    em["holder" ] = so[0];
    em["content"] = { data: so[1] };  // data, TODO format, style, etc.
    items.push(em);
  }

  (svg_embed_items.value as any) = items;
  console.log("svg_embed_items: " + JSON.stringify(svg_embed_items.value, null, 2));
}


const applySvgEmbedItems = () => {  // 2023.12.24r replace htmsvg_inner[]
  const items = svg_embed_items.value;
  // console.log("applySvgEmbedItems items: " + JSON.stringify(items, null, 2));

  let holder, content, newHtml;

  for (let i = 0; i < layers_length_ref.value; i++) {
    let svgHtml = htmsvg_inner_ref.value[i];  // string
    // console.log("applySvgEmbedItems svgHtml: " + svgHtml);

    for (let item of items) {
      // console.log("applySvgEmbedItems item: " + JSON.stringify(item, null, 2));

      holder  = item["holder"];
      content = item["content"]["data"];
      console.log("applySvgEmbedItems holder: " + holder + " content: " + content);

      newHtml = svgHtml.replace(holder, content);
      svgHtml = newHtml; 
      // console.log("applySvgEmbedItems newHtml: " + newHtml);

      htmsvg_inner_ref.value[i] = svgHtml;  // 必要？
    }
  }

}



async function loadSvgFile(fileName = docFileName()) {  // 2023.12.24r Load .svg File to cur_layer, ※ Save と違い、Current Layer のみ対象としていることに注意
  //= .svg Flie を Load する
  //  1. EditHtmlFrame の 作成された（Html 埋め込む用）.svg: OK
  //    2.1 z-diag: OK
  //    2.2 z-code: 未確認　※要 MathJax
  //    2.3 z-math: 未確認
  //  2. 外部 ツールで作成された .svg: OK
  //= 
  console.log("loadSvgFile " + fileName);
  const sendData = {
    fileName: fileName,
    content: {
      svg_uuid: svg_uuid.value,
    }  
  };

  const result = await window.unipyapi.readSvgFile(sendData);
  // console.log("loadSvgFile result: " + JSON.stringify(result));

  let svgHtml = null;
  if (result.code == 0) {
    let readed_data = result["readed_data"];
    if (readed_data["exit_code"] == 0) {
      svgHtml = readed_data["svg_data"];
    }
  } 

  if (!(svgHtml == null)) {
    htmsvg_inner_ref.value[cur_layer_ref.value] = svgHtml;
    // console.log("htmsvg_inner_ref.value: ");
    // console.log(htmsvg_inner_ref.value);

    //= 方法 1) innerHTML: OK
    // htmsvg_container_ref.value.innerHTML = htmsvg_inner_ref.value;
  } else {
    console.log(" Bad readSvgFile result: " + JSON.stringify(result));
  }
}


async function saveSvgFile(fileName = docFileName()) {  // 2023.12.24r Save .svg File from htmsvg_inner[0 .. Layers_length - 1] ※ Load と違い、All Layers を対象としていることに注意
  //= .svg Flie を Save する
  //  EditHtmlFrame の 作成された（Html 埋め込む用）.svg が Load された時、書き出した .svg も同様、Html 埋め込む用です
  //=
  console.log("saveSvgFile " + fileName);

  let svg_text = "";  // 2023.12.24r TODO  layer を表現しているgroupに、Layer-id みたいなのを付与すると良いでしょう　
  for (let i = 0; i < layers_length_ref.value; i++) {
    svg_text += `<g>\n`;
    svg_text += `${ htmsvg_inner_ref.value[i] }\n`;  // string
    svg_text += `</g>\n`;
  }

  const payload = JSON.stringify(
    {
      svg_uuid: svg_uuid.value,
      svg_xml_declaration: svg_xml_declaration.value,
      svg_text: svg_text,
    }
  )

  const content = Buffer.from(payload).toString('base64');
    
  const sendData = {
    fileName: fileName,
    content : content
  };

  const result = await window.unipyapi.writeSvgFile(sendData);
  console.log("saveSvgFile result: " + JSON.stringify(result));
}



async function loadSvgEmbedJsonFile(fileName = docFileName()) {
  console.log("loadSvgEmbedJsonFile " + fileName);
  const sendData = {
    fileName: fileName,
    content: {
      svg_uuid: svg_uuid.value,
    }
  };

  const result = await window.unipyapi.readJsonFile(sendData);
  console.log("loadSvgEmbedJsonFile result: " + JSON.stringify(result));

  let embedJson = null;
  if (result.code == 0) {
    let readed_data = result["readed_data"];
    if (readed_data["exit_code"] == 0) {
      const base64Payload = readed_data["json_data"];
      const payload = Buffer.from(base64Payload, 'base64').toString('utf8');
      embedJson = JSON.parse(payload);
    }
  }

  if (!(embedJson == null)) {
    svg_uuid.value = embedJson.svg_uuid,
    svg_embed_items.value = embedJson.svg_embed_items
    console.log("svg_uuid.value: " + svg_uuid.value);
    console.log("svg_embed_items.value: " + JSON.stringify(svg_embed_items.value, null, 2));
  } else {
    console.log(" Bad loadSvgEmbedJsonFile result: " + JSON.stringify(result));
  }
}


async function saveSvgEmbedJsonFile(fileName = docFileName()) {
  console.log("saveSvgEmbedJsonFile " + fileName);

  const payload = JSON.stringify(
    {
      svg_uuid: svg_uuid.value,
      svg_embed_items: svg_embed_items.value,
    }
  )

  const content =  Buffer.from(payload).toString('base64');
      
  const sendData = {
    fileName: fileName,
    content :  content
  };

  // console.log("sendData: " + JSON.stringify(sendData, null, 2));

  const result = await window.unipyapi.writeJsonFile(sendData);
  console.log("loadSvgFile result: " + JSON.stringify(result));
}


async function inkscapePdf2Svg(fileName = docFileName()) {
  //=
  //  PS C:\Users\nakan> inkscape -o C:\DOCs\SvgEditor\exam02_inkscape.svg  C:\DOCs\SvgEditor\exam02.pdf
  //  【前提】環境変数path 設定 C:\Program Files\Inkscape\bin
  //  参照: https://wiki.inkscape.org/wiki/Using_the_Command_Line
  //=
  console.log("inkscapePdf2Svg " + fileName);

  const payload = JSON.stringify(
    {
      cmd: 'inkscape',
      options: {
        'sys_path': appCfgRef.value.inkscape_bin_dir, // 実行エラー ⇒ 環境変数 path の設定した前提で実行すること
        'bin_file': appCfgRef.value.inkscape_bin_file,
        'out_stem': 'exam02_inkscape'
      }
    }
  )

  const content = Buffer.from(payload).toString('base64');

  const sendData = {
    fileName: fileName,
    content: content
  };
  const result = await window.unipyapi.pdf2Svg(sendData);
  console.log("inkscapePdf2Svg result: " + JSON.stringify(result));
}


async function potracePmnBmp2svg(fileName = docFileName()) {  // !! bmp
  //=
  //  PS C:\home\local\bin\potrace> .\potrace.exe -b svg C:\DOCs\SvgEditor\k1_drawing.bmp -o  C:\DOCs\SvgEditor\k1_drawing_potrace.svg
  //  PS C: \home\local\bin\potrace > .\potrace.exe--help
  //  Possible input file formats are: pnm (pbm, pgm, ppm), bmp.
  //  【前提】Local Installed C:\\home\local\\bin\\potrace
  //=
  console.log("potracePmnBmp2svg " + fileName);

  const payload = JSON.stringify(
    {
      cmd: 'potrace',
      options: {
        'sys_path': 'C:\\home\\local\\bin\\potrace',
        'bin_file': 'potrace.exe',
        'out_stem': 'k1_drawing_potrace'
      }
    }
  )

  const content = Buffer.from(payload).toString('base64');

  const sendData = {
    fileName: fileName,
    content: content
  };
  const result = await window.unipyapi.pnmBmp2Svg(sendData);
  console.log("potracePmnBmp2svg result: " + JSON.stringify(result));
}


async function vtracerPng2svg(fileName = docFileName()) {  // !! jpg
  //=
  //  PS C:\home\local\bin> .\vtracer.exe -m spline --colormode bw --input C:\DOCs\SvgEditor\k1_drawing.jpg -o  C:\DOCs\SvgEditor\k1_drawing_vtracer.svg
  //  【前提】Local Installed  C:\home\local\bin
  //      PS C:\home\local\bin> .\vtracer.exe --help
  //=
  console.log("vtracerPng2svg " + fileName);

  const payload = JSON.stringify(
    {
      cmd: 'vtracer',
      options: {
        'sys_path': 'C:\\home\\local\\bin',
        'bin_file': 'vtracer.exe',
        'out_stem': 'k1_drawing_vtracer',
        'args': {
          'm': 'spline',
          'colormode': 'bw'
        }
      }
    }
  )

  const content = Buffer.from(payload).toString('base64');

  const sendData = {
    fileName: fileName,
    content: content
  };
  const result = await window.unipyapi.img2Svg(sendData);
  console.log("vtracerPng2svg result: " + JSON.stringify(result));
}


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
      svg: JSON.stringify({
        inner: htmsvg_outer_ref.value,    // 2024.01.08s +inner := htmsvg_outer_ref
      }),
      // TODO 他の svg 埋め込み関連データ
    }
  }

  //= children
  //  子 EditHtmlFrame の必要性、実装方法を検討する必要があり、取りあえず外す

  console.log("  item \n" + JSON.stringify(item, null, 2));

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

  const svg = JSON.parse(record["svg"]);
  console.log("  svg: " + JSON.stringify(svg, null, 2));
  htmsvg_outer_ref.value  = svg['inner'];                 // 2024.01.08s
  htmsvg_inner_ref.value  = svg['inner']["draw"];         // 2024.01.08s ※ watch で 余計な htmsvg_outer_ref.value に再び反映が行われるが、とりあえず、このまま
  layer_show_ref.value    = svg['inner']["layer_show"];   // 2024.01.08s ※ 同上
  layers_length_ref.value = svg['inner']["draw"].length;  // 2024.01.08s ※ 同上
  cur_layer_ref.value     = svg['inner']["cur_layer"];    // 2024.01.08s ※ 同上
  familyZIndexRef.value   = Number(svg['inner']["z_index"]);

  updateLPanelAttrs(); // L-attr に反映

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

  let svg_text = "";  // 2023.12.24r TODO  layer を表現しているgroupに、Layer-id みたいなのを付与すると良いでしょう　
  for (let i = 0; i < layers_length_ref.value; i++) {
    if (!layer_show_ref.value[i]) {
      continue;
    }
    
    svg_text += `<g>\n`;
    svg_text += `${htmsvg_inner_ref.value[i]}\n`;  // string
    svg_text += `</g>\n`;
  }

  let view_raw = { 'svg': svg_text };  // TODO htmsvg_dom_ref から取り出す方が良い？
  view['raw'] = view_raw; // !!

  return view;
}


defineExpose({
  // galaxy_ref,
  // galaxy_left,
  // galaxy_top,
  // c,
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



onMounted(async () => { // after DOM nodes be inserted
  await nextTick();
  console.log(props.com_type + ' ' + uuidRef.value + ' is mounted!');

  updateLPanelAttrs(); // 2024.01.06c L-attr に反映 

  nextTick(() => {
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

.desc {
  color: aliceblue;
}
.who_am_i {
    pointer-events: none;
    position: absolute;
    display: inline-block;
    left: 0;
    top: 1.5em;
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
  color: v-bind("htmsvg_outer_ref.color") !important;                         // 2023.12.16a Editorの前景色

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
  pointer-events: auto;
  position: absolute !important;
  left: 0px;
  top:  0px;

  /* TODO ↓サイズ不正？ */
  width : v-bind("raResizingSize.w + 'px'");
  height: v-bind("raResizingSize.h + 'px'");

  background-color:rgba(0, 0, 0, 0) !important;
}


.old_meta-toolbar-list {
  display:block;
  position:relative !important;   // でなければ、コンテンツ実体

  background-color: rgb(233, 240, 245);
  color: rgba(0, 0, 0, 1.0);
  // border: solid 1px rgba(0, 0, 0, 1.0);
  // width: 320px;
  // height: 320px;
}

.meta-toolbar-list {
  z-index: 9000;  
  display:block;
  position:absolute !important;
  left: 0px;
  top: 0px;
  height: fit-content;
  background-color: rgb(120, 130, 138);
}

.svg-defs-meta {

}

.plus_frame {
  position: relative;
  display: block;

  background-color:rgba(0, 0, 0, 0.0);
}

.plus_header {
  color: blue;
  font-weight: bold;
}

.plus_item_content {
  color: black;
  font-weight: normal;
}


.intent {
  position: absolute;
  background-color:rgba(0, 0, 0, 0) !important; // 2024.01.08f 裏側の EditHtmlElem が表示されない障害対策
  display: block;
  margin: 0px;
  padding: 0px;
  left: 0;
  top: 0;
}
</style>