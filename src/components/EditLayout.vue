<!-- 
  図で理解する Grid Layout
    https://zenn.dev/umatoma/articles/b970bdd3a148cd
  グリッドレイアウトでのボックス配置
    https://developer.mozilla.org/ja/docs/Web/CSS/CSS_box_alignment/Box_alignment_in_grid_layout
  グリッドレイアウトの基本概念
    https://developer.mozilla.org/ja/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout
  CSS Grid Layout を極める！（基礎編）
    https://qiita.com/kura07/items/e633b35e33e43240d363
  一番分かりやすいCSS Grid Layoutの使い方ガイド
    https://webdesign-trends.net/entry/11086
  CSSは確実に進化している！ 変数、条件分岐、ループ、論理演算など、ロジックに記述するCSSの実装テクニック
    https://coliss.com/articles/build-websites/operation/css/writing-logic-in-css.html
 -->

<template>
  <div 
    ref = "galaxy_ref" 
    class = "galaxy client_decided able_galaxy"
    title = "EditLayout galaxy: div, Position, Size の基準（辺界線）" 
  >
      <div v-if = "isDevModeRef" class = "who_am_i who_am_i_layout able" title = "who am i">{{ props.com_type }} : {{ uuidRef.value }} </div>

    <!-- 
    （特に出力ファイルでは）本体をすっきりさせるため、Library 的なものはここに書く
    （子、孫の svg がありますから、それらのために用意しておく）
   -->
    <div display = "none">
      <svg display = "none">
        <desc>SVG DEFS-SYMBOL Library</desc>
      </svg>
    </div>

    <!-- 
    【HTML Frame】※用語の Frame は、Container と同じ意味です（以降も同様）。
    【試】 BG Color/Color は、CSS で指定している 
  -->
    <div 
      ref = "earth_ref"
      class = "editor_canvas client_decided html_events "
      :style = "{ 'background-color': htmsvg_outer_ref.background_color, 'color': 'htmsvg_outer_ref.background_color' }"
      title = "EditLayout earth: div, canvas, to warp svg-root"
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

        <div v-if="true" class = "meta-content-container client_decided">


          <!-- BEGIN META, TOOL-BAR, LIST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
          <div v-if = "true" class = "meta-toolbar-list">

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

          </div>
          <!-- BEGIN META, TOOL-BAR, LIST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->


          <!-- BEGIN コンテンツ実体 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
          <div 
              class = "edit_html_container client_decided html_events" 
              ref = "html_container_ref"
              title = "EditLayout container"
          >
            <!-- 
              TODO component :is = "props.tag_name" では、v-btn 表示が違う、他の不安要因がある
                    ⇒ 現行 Version は、v-btn 等は、v-if で表示する。                        
            -->
            

            <template v-if = "true"> 

              <!-- ↓↓↓↓ The SvgEditor SDK 拡張 Html-Tag u-layout =============================================================================-->
              <!--
                  1) 仕様: 
                    最も上の注釈を参照して下さい
                  2) u-layout は、slot が無く、代って、Layouted 子要素を持つ
                  3) 表示モード
                      1. Items
                          TODO 表示モード切り替え後中身データが失われた
                            【済】D キー (LayoutItem.vue)
              -->
              <div v-if = "true" class="edit-html-frame client_decided html_events"> 

                <!-- 
                  class="exam-grid-container"    [OK]
                  :class = "['exam-grid-container-shape', 'exam-grid-container-area']"  [OK]
                  v-bind:style="examGridStyle"   [NG]
                  v-bind:class="examGridStyle"   []
                -->


                <div v-show = "(!htmlMeta.layoutingOnCell) && false"
                  :class = "['exam-grid-container-shape', 'exam-grid-container-area']"
                >
                  <!-- ↓ OK -->
                  <div v-if="false" class="box header">Header</div>
                  <!-- ↓ OK -->
                  <div v-if="false" :class="[ 'box', 'header' ]">Header</div>

                  <!-- ↓ OK -->
                  <div v-if="true" :class="['box']" v-bind:style="demoHeader" >Header</div>

                  <div class="box menu">Menu</div>

                  <!-- ↓ OK -->
                  <div v-if="false" class="box main">Main</div>
                  
                  <!-- ↓ OK -->
                  <div v-if="false" class="box" :class="'main'">Main</div>

                  <!-- ↓ OK -->
                  <div v-if="true" class="box" :style="examItemStyle">Main</div>

                  <div class="box footer">Footer</div>
                </div>


                <div 
                    v-show = "(!htmlMeta.layoutingOnCell) || isPreviewModeRef" 
                    class = "edit_html_frame client_decided html_events" 
                    title = "layouted html-frame 之 実体: items"
                >
                  <!-- BEGIN LAYOUTED 実 HTML Items ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
                  <!-- ↓ Grid コンテナ
                  -->
                  <component
                    ref          = "me_items_ref"
                    v-bind:is    = "props.tag_name"
                    v-bind:style = "[ makeGridStyle ]"
                    :class       = "[ 'grid-container-basic', 'grid-container-shape', 'grid-container-areas' ]"
                    title        = "Here is Me: EditLayout contents 之 layout-items"
                  >

                    <template v-if = "true">
                      <template v-for = "(item, index) in htmlMeta.layItem" :key = "item.uuid" >
                        <!-- ↓ Gridアイテム
                          【廃止】 2023/11/02
                            :myPosSizeRef       = "props.myPosSizeRef"
                            :raResizingSize     = "props.raResizingSize"
                            :raResizingViewbox  = "props.raResizingViewbox"
                        -->
                        <LayoutItem
                            class         = "box"
                            v-bind:style  = "itemGridArea(item)" 
                            :ref          = "setItemRef" 
                            :uuid               = "item.uuid"
                            :is_root            = "false"
                            :editing_uuid       = "props.editing_uuid"
                            :editing_id         = "props.editing_id"
                            :being_edit_id      = "props.being_edit_id"
                            :idx                = "index"
                            :area               = "item.area"
                            :layoutor           = "htmlMeta"
                            v-model:able_pointed ="able_pointed"
                            v-model:emitedPosSizeRef ="emitedPosSizeRef"
                            v-model:htmsvg_outer_ref = "htmsvg_outer_ref"
                        >
                        </LayoutItem>

                      </template>
                    </template>
                  </component>  
                  <!-- END LAYOUTED 実 HTML Items ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
                </div>

                <div
                    v-show = "htmlMeta.layoutingOnCell && (!isPreviewModeRef)" 
                    class = "edit_html_frame layout_html_frame client_decided" 
                    title = "layouted html-frame LAYOUT 之 ツール: cells"
                >
                  <!-- BEGIN LAYOUT 制御 Layout-Cells ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
                  <!-- ↓ Grid コンテナ -->
                  <component
                    ref            = "me_cells_ref"
                    v-bind:is      = "props.tag_name"
                    v-bind:style   = "[ makeGridStyle ]"
                    :class         = "[ 'layoutor-cells-container', 'grid-container-basic', 'grid-container-shape', 'grid-cells-container-areas' ]"
                    title          = "Here is Me: EditLayout contents 之 layout-cells"
                    v-element-size = "onResize"                            
                  >
                    
                    <template v-if = "true">
                      <!-- 
                        【注意】 :key を正しく設定しないと、Layout-Drag 障害：
                              :key="cell.content" : 動作する
                              :key="cell.uuid" : 【解決済】動作しない（原因: insertLayCells() に uuid が変わってしまう実装不足でした）
                      -->

                      <template v-for = "(cell, index) in htmlMeta.layCell" :key = "cell.uuid">
                        <!-- ↓ Gridアイテム of Cells Design Mode
                        -->

                        <div v-if = "false"
                          class = "box"
                          v-bind:style = "designCellGridArea(cell)" 
                        >
                          {{ cell.i }} : {{ cell.j }}
                        </div>

                        <!-- TODO
                          class       = "grid_cell"
                          v-bind:style = "[ makeGridCellStyle(cell) ]" も OK 
                         -->
                        <LayoutCell v-if = "true"
                            class         = "box"
                            v-bind:style  = "designCellGridArea(cell)" 
                            :ref          = "setCellRef" 
                            :idx      = "index"
                            :i        = "cell.i"
                            :j        = "cell.j"
                            :uuid     = "cell.uuid"
                            :content  = "cell.content"
                            :dragH    = "layCellEnableDrog(cell).enH"
                            :dragV    = "layCellEnableDrog(cell).enV"
                            :layoutor = "htmlMeta"
                            v-model:htmsvg_outer_ref = "htmsvg_outer_ref"
                            @cellSizeChanged = "onCellSizeChanged"
                            @cellResize      = "onLayCellResizeEv"
                            @areaTextChanged = "onCellAreaChanged"
                            @request         = "onCellRequest"
                            >
                        </LayoutCell>
                      </template>

                    </template>
                  </component>  
                  <!-- END LAYOUT 制御 Layout-Cell ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
                </div>

              </div> 
              <!-- ↑↑↑↑ The SvgEditor SDK 拡張 Html-Tag u-layout =============================================================================-->

              <component v-else  v-bind:is = "props.tag_name"
                ref = "html_tag_ref"
                class = "client_decided html_events"
                color = "primary"
                :title = "'EditLayout contents 之 実体 html-tag: ' + props.tag_name + ' typs is ' + props.tag_type"
              >
                <slot name = "pairedLayoutCnts"></slot>
              </component>

            </template> <!-- END html_paired -->

            <!-- END コンテンツ実体 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->

          </div>  <!-- END meta-content-container -->
        </div>  <!-- END edit_html_container -->



      <!-- 【廃止】 2023/11/02 -->
<!-- 
      <div  v-show = "being_edit" ref = "mini_ctrl_ref" class = "mini_ctrl">
        <svg class="mini_ctrl_svg" :width = "props.raResizingSize.w" :height = "props.raResizingSize.h" :viewBox = "props.raResizingViewbox">
          <title> ↓ 子 に重ねる表示があるため、ここは薄ら表示で良い </title>
          <rect class="mini_ctrl_border" :x = "0" :y = "0" :width = "props.raResizingSize.w" :height = "props.raResizingSize.h"  
                style = "fill:rgba(121,121,121,0.0);stroke-width:1;stroke:rgba(255,0,0,0.25)"
          > 
          </rect>
        </svg>
      </div>
 -->
    </div>
    <!-- editor_canvas -->
    <!-- editor_canvas: transform scale -->
  </div>
</template>



<script setup lang="ts">


import {
  effectScope, getCurrentScope, onScopeDispose, markRaw, toRaw, reactive, shallowReactive, shallowReadonly, isReactive, computed, shallowRef, triggerRef, customRef, ref, unref, toRef, toRefs, isRef,
  // defineExpose, defineProps, defineEmits,                         // vue3, これらは import 不要（↓も同様）
  // defineSlots, defineOptions,                                     // vue3.3
  // defineModel,                                                    // vue3.3 实验特性, not in macros ⇒ vue3.3 動作確認にもなる
  // !! defineModels,                                                // macros, no in ~vue3.3 ⇒ macros 動作確認にもなる
  inject, onBeforeUpdate, watch,
  onBeforeMount,
  onMounted, onBeforeUnmount, onUnmounted,
  nextTick,
} from "vue";


import {
  useDraggable,
  useElementBounding,
  useEventListener,
  useFocus,
  useMouse, useMousePressed, onKeyStroke, useMagicKeys, useMouseInElement, useParentElement, useElementSize, useActiveElement,
  useResizeObserver, useMounted, useFocusWithin,
  whenever
} from '@vueuse/core'


import { vElementSize } from "@vueuse/components"; // v-element-size
import { UseElementBounding as ElementBounding } from "@vueuse/components"
import { UseDraggable as Draggable } from '@vueuse/components'

import { v4 as uuidv4 } from "uuid"; // このuuid の代り、独自のルールで共通的作成する
import { Buffer } from 'buffer';
import { Base64 } from "js-base64";

import SelConditions from "./SelConditions.vue";  // 2023.12.08

import _ from 'lodash'

import { mainMachine } from "./mainFsmMachine";

// import EditHtmlFrame from "./EditHtmlFrame.vue";

// import EditSvgRect from "./EditSvgRect.vue";
// import EditSvgLine from "./EditSvgLine.vue";
// import EditSvgText from "./EditSvgText.vue";
// import EditSvgPath from "./EditSvgPath.vue";
// import EditSvgFitCurve from "./EditSvgFitCurve.vue";
// import EditSvgEmbed from "./EditSvgEmbed.vue"
// import EditSecText from "./EditSecText.vue"
// import EditHtmNodeTree from "./EditHtmNodeTree.vue"


// import EditCodeMirror from "./EditCodeMirror.vue"
// import EditMermaid from "./EditMermaid.vue"
// import EditMathlive from "./EditMathlive.vue"


// eslint-disable-next-line @typescript-eslint/no-unused-vars
import LayoutCell from "./LayoutCell.vue";
import LayoutItem from "./LayoutItem.vue";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isDevModeRef = inject("isDevModeRef");
const isPreviewModeRef = inject('isPreviewModeRef');

// //= 2022.11.01 版： 子コンポーネントの add-edit-svg 呼び出すの代り、cmd をセットし、actived obj が自ら
// // その cmd を実行するようにする。
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const editCmdRef = inject("editCmdRef");
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const updateEditCmd = inject("updateEditCmd"); // function
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const editCmdParasRef = inject("editCmdParasRef"); // object
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const initialEditCmdParas = inject("initialEditCmdParas"); // function

const actingEditRef: any = inject('actingEditRef');        // 2023.11.10
const actingEditEventRef = inject('actingEditEventRef');   // 2023.11.10
const colorPickerRef = inject('colorPickerRef');       // 2023.11.10

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editingObjRef = inject("editingObjRef"); //  isEditFocus 系から移行させる
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateEditingObj = inject("updateEditingObj"); // function

const outline_assets_ref: any = inject("outline_assets_ref");

const edit_layout_ref: any = inject('edit_layout_ref');

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


const genInId    = inject('genInId');
const genInHintS = inject('genInHintS');
const genInDataA = inject('genInDataA');
const genInHintA = inject('genInHintA');
const genInDataB = inject('genInDataB');
const genInHintB = inject('genInHintB');
const genInDataC = inject('genInDataC');
const genInHintC = inject('genInHintC');
const updateGenInDataA = inject('updateGenInDataA');
const updateGenInDataB = inject('updateGenInDataB');
const updateGenInDataC = inject('updateGenInDataC');

const inDataC_ref = inject('inDataC_ref');


const galaxy_ref = ref(null);   //
const earth_ref = ref(null);    //
const moon_ref = ref(null);     //



//= macros
// https://vue-macros.sxzz.moe/macros/


defineOptions({
  inheritAttrs: true,
  customOptions: {
    /* ... */
  }
});

defineSlots<{
  rawLayoutCnts?: () => Node[]
  pairedLayoutCnts?: () => Node[]

  //= example
  // slot name
  title: {
    // scoped slot
    foo: 'bar' | boolean
  }

}>()



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({ // I/F: 親⇒子のデータの受け渡し
  com_type: {
    // edit_svg | edit_html | ..
    type: String,
    default: "edit_layout",
  },

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
  is_root: {
    type: Boolean,
    default: false,
  },

  able: { // true | false
    type: Boolean,
    default: false,
  },

  tag_name: {                 // u-svg
    // div | span | ..
    type: String,
    default: "div", // v-btn | ..
  },

  tag_type: {                // svg
    // html_singleton | html_paired | raw_html | null
    type: String,
    default: "html_paired",
  },

  content: {                // rect | line | path | text
    type: String,
    default: "",
  },

});

console.log("$$$$$$$$ EditLayout props: " + JSON.stringify(props));

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
const deletedRef = defineModel<any>("deletedRef", { local: true, default: null })

const able_target_ref = defineModel<any>("able_target_ref", { local: true, default: null });  // the Moveable Target
const able_actmd_ref = defineModel<any>("able_actmd_ref", { local: true, default: null });  // 動作モード of the Moveable
const able_macro_ref = defineModel<any>("able_macro_ref", { local: true, default: null });  // in_ | out_ | io_, データ I/F of the Moveable


const moon_fobj_ref = ref(null); // moon の foreignObject の ref
const html_container_ref = ref(null); // html_container の ref

const html_tag_ref = ref(null); // html_tag の ref

//= OTHER := 子 EditHtmlFrame.vue
const other_uuid = uuidv4();       // 拡張性を提供する EditHtmlFrame.vue

const menu_container_ref = ref(null);
const menu_area_ref = ref(null);
const menu_ref = ref<any>(null);


const mini_ctrl_ref = ref(null);

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



// BEGIN emitedPosSizeRef へ移行中 ..........................................
let myBoundingElRef = null;
let tag_width  = 32;  // onMounted に更新されている WHEN u-html etc.
let tag_height = 24;  // 
if ([ 'u-html' ].includes(props.tag_name)) {
  // Vue Component の場合, useElementBounding は使えない、html_tag_ref.value.galaxy_ref を使う必要がある。
  // が、この時点では、html_tag_ref.value.galaxy_ref は null であり、使えない。
  //   ⇒ 後で、onMounted に 改めて設定する。
  myBoundingElRef = null;             // html_tag_ref.value.galaxy_ref
} else {
  myBoundingElRef = html_tag_ref;     // Default, WHEN is a html tag
  const { width: ta_width, height: ta_height } = useElementBounding(myBoundingElRef);
  tag_width  = ta_width;
  tag_height = ta_height;
}

const ractag = reactive({
  x: 0, y: 0,           // !!
  w: tag_width,         // tag_width, tag_height は、onMounted に更新されている WHEN u-html etc.
  h: tag_height,
});


// nextTick(() => {
//   watch(ractag, (val, oldval) => {
//     console.log('$$$$$EditLayout uuid " + uuidRef.value + " ractag changed: val = ' + JSON.stringify(val) + ' oldval = ' + JSON.stringify(oldval));

//     //= 概ね同値でも親コンポーネントには通知する必要があり、↓ skip はできない
//     // if ( Math.round(oldval.x) == Math.round(val.x) && Math.round(oldval.y) == Math.round(val.y) && Math.round(oldval.w) == Math.round(val.w) && Math.round(oldval.h) == Math.round(val.h)) {
//     //   console.log('  but 概ね同値, so  return');
//     //   return;
//     // }

//     let ps = { x: val.x, y: val.y, w: val.w, h: val.h, edit_html: { uuid: uuidRef.value, tag_type: props.tag_type, tag_name: props.tag_name } };
//     nextTick(() => {
//       console.log('  emit pos_size_decided in nextTick')
//       emit('pos_size_decided', ps);
//     });
//   });
// });

// END emitedPosSizeRef へ移行中 ..........................................

const me_items_ref = ref(null); // The Layout items Grid コンテナ の ref
const me_cells_ref = ref(null); // The Layout cells Grid コンテナ の ref


const items = ref([]); 
const childRefs = ref([]); // 子コンポーネントの ref, childRefs.value[i] でアクセスし子コンポーネントを制御します。

const setChildRef = (el) => {
  if (el) {
    // console.log('setChildRef push: ' + el.myUuid());
    childRefs.value.push(el);
  }
};


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
  console.log("$$$$EditLayout watch galaxy c val: " + val.w + " - " + + val.h + " oldVal: " + oldVal.w + " - " + + oldVal.h);
  console.log("  gx: " + val.gx + " gy: " + val.gy + " gtop: " + val.gtop + " gright: " + val.gright + " gbottom: " + val.gbottom + " gleft: " + val.gleft);
});

const viewBoxStr = computed(() => { return c.x + ' ' + c.y + ' ' + c.w + ' ' + c.h; });  // view-Box
const rootMinX = computed(() => { return c.x + 'px'; });           // foreignObject
const rootMinY = computed(() => { return c.y + 'px'; });           // foreignObject
const rootWidth = computed(() => { return (c.w + 'px'); });         // foreignObject, View-Port
const rootHeight = computed(() => { return (c.h + 'px'); });         // foreignObject, View-Port



//= 【DEPRECATED】自分がアクティブかどうか
//    is_editing へ移行
// const isEditFocus = computed(() => {
//   return editingObjRef.value.uuid == uuidRef.value;
// });

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
  { id: 'who_am_i',         visible: true,   name: props.com_type + " : " + uuidRef.value },  //
  
  { id: 'off_able_pointer', visible: false,   name: 'Disable Resize'       },
  { id: 'on_able_pointer',  visible: false,   name: 'Enable Resize'        },


  { id: 'listup',           visible: true, name: 'Listup '                                             },  // 一覧表示 TODO 3)

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



watch(edit_layout_ref, (newVal) => { // 2023.12.19a
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {  // 2024.01.06b
    // console.log(`${uuidRef.value} changed L-htmsvg_outer_ref is not  me, do nothing!`);
    return;
  }

  htmsvg_outer_ref.value = { ...newVal };
  familyZIndexRef.value = Number(newVal["z_index"]); // !!
  console.log(`$$$$ watch edit_layout_ref: htmsvg_outer_ref.value updated to ${JSON.stringify(htmsvg_outer_ref.value, null, 2)}`);
}, { deep: true });



watch(is_editing,
  (newVal, oldVal) => {
    console.log("@@@@@@@@ watch is_editing: " + newVal + " oldVal: " + oldVal);
  },
  {
    deep: true,
    // immediate: true
  }
);


watch(
  being_edit,
  (newVal, oldVal) => {
    console.log("@@@@@@@@ watch being_edit: " + newVal + " oldVal: " + oldVal);
    // console.log("  being_edit is " + being_edit.value);
    // console.log("  editingObjRef.value.uuid: " + editingObjRef.value.uuid);
    // console.log("  props.editing_uuid: " + props.editing_uuid);
    // console.log("  editingObjRef.value.editing_id: " + editingObjRef.value.editing_id);
    // console.log("  props.being_edit_id: " + props.being_edit_id);

    // if (newVal) {
    // } else if (oldVal) {
    // }
  },
  {
    deep: true,
    // immediate: true
  }
);




const emit = defineEmits([
  "props_updated",    // props が更新された
  "deleted",          // 子コンポーネントが削除されたときに親コンポーネントに通知するためのイベントです
]);


// onKeyStroke('|', (e) => {
//   e.preventDefault();
//   console.log("##### is_editing = " + is_editing.value + ", being_edit = " + being_edit.value);
// })


// //=== BEGIN バブリング (Bubbling) Mouse Event chain 調査
// const Layers = [];
// //= ここから branch master
// Layers.push({ 'name': 'galaxy', 'ref': galaxy_ref, 'pressed': null });
// Layers.push({ 'name': 'earth', 'ref': earth_ref, 'pressed': null });
// Layers.push({ 'name': 'moon svg', 'ref': moon_ref, 'pressed': null });

// //= ここから branch contents
// Layers.push({ 'name': 'moon-foreignObject', 'ref': moon_fobj_ref, 'pressed': null });
// Layers.push({ 'name': 'html_container', 'ref': html_container_ref, 'pressed': null });
// // Layers.push({ 'name': 'me-elem-container', 'ref': me_ref, 'pressed': null });   // TODO 発火しない ⇒ EditHtmlElem 解析中
// //    contents EditHtmlFrame[] 確認待ち



// for (let i = 0; i < Layers.length; i++) {
//   const { pressed } = useMousePressed({ target: Layers[i].ref });
//   Layers[i].pressed = pressed;
//   whenever(Layers[i].pressed, () => {
//     console.log(";;;; ↑ " + Layers[i].name + " pressed: ", props.com_type + " " + uuidRef.value);
//   });
// }
// //=== END バブリング (Bubbling) Mouse Event chain 調査


//= BEGIN LAYOUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
const modify = (v, diff, min = 0) => {
  let cv = (v === undefined || v === null || v < min) ? 0 : v;
  cv += diff;
  return cv;
};

const selColOrRow = (value, i, j, direction) => {
  let track0, track2;         // row | col
  let t_end, t2;              // 0 .. 

  if (direction == "x") {
    track0 = value.layCol[j];         //
    t2 = j + 1;                                   // := j2 | i2
    track2 = value.layCol[t2];        // 
    t_end = value.layCol.length - 1;  // := j_end | i_end
  } else if (direction == "y") {
    track0 = value.layRow[i];         //
    t2 = i + 1;                                   // := j2 | i2
    track2 = value.layRow[t2];        //
    t_end = value.layRow.length - 1;  // := j_end | i_end
  }

  return { track0, track2, t_end, t2 };
};

function onLayCellResizeEv( lc ) {    //  Drag リサイズ Req. of LayoutCell.vue
  //= Mouse Down, Mouse Move, Mouse Up で呼ばれ、レイアウトセルのリサイズを行います。
  // Para. lc:
  // {
  //     "state": "start" := Mouse Down on Element | doing := Mouse Move on outside? | "end" := Mouse Up on outside?,
  //     "idx": 0,
  //     "i": 0 ..,
  //     "j": 0 ..,
  //     "direction": "x" | "y",
  //     "dx": 0,
  //     "dy": 0
  // }
  // console.log("+++ onLayCEllResize", lc);
  htmlMeta.value.layCellResizeReq = lc;
  let { state, idx, i, j, direction, dx, dy } = lc;
  // console.log("+++++ onLayCEllResize", state, idx, i, j, direction, dx, dy);

  let { track0, track2, t_end, t2 } = selColOrRow(htmlMeta.value, i, j, direction);

  let diff = (direction == "x") ? dx : dy;  

  if (state == "start") {
    track0.dc.initPx = modify(track0.dc['px'], 0);  // 0 はダミー
    track0.dc.initUnit = track0.unit;               // 古い値を保存しておく
    track0.unit = "px"; 

    track2.dc.initPx = modify(track2.dc['px'], 0);  // 0 はダミー
    track2.dc.initUnit = track2.unit;               // 古い値を保存しておく

    if (!(t2 >= t_end)) {      // 最後の Track である
      // console.log("##### change fr to px because it is not the last trace, t2: " + t2 + " t_end: " + t_end)
      track2.unit = "px";
    } 
    // else {
    //   console.log("##### leave fr のまま because it is the last trace, t2: "     +  t2 + " t_end: " + t_end);
    // }

    //= 対策: y-pos 突変 when start ⇒ doing 
    //  start 時の mouse x/y は不使用に変更したため、↓反映する処理はしない
    //=
    // buildLayout(direction);   // !!
    // makeLayItem();            // !!

  } else if (state == "doing") {
    track0.dc['px'] = modify(track0.dc.initPx, diff, 0);
    if (track2.unit == "px") {
      track2.dc['px'] = modify(track2.dc.initPx, -diff, 0);
    } else {
      // console.log("  do nothing because track2.unit is not px");
    }
    buildLayout(direction);
    insertLayCells(undefined, undefined); // ↓ isUpdate は未実装なので、insertLayCells で代用している
    // makeLayCells(undefined, undefined, true);
  } else if (state == "end") {
    // track0.dc['px'] = mod(track0.dc.initPx, diff, 0);
    // if (track2.unit == "px") {
    //   track2.dc['px'] = mod(track2.dc.initPx, -diff, 0);
    // } else {
    //   // console.log("  do nothing because track2.unit is not px");
    // }
    // // buildLayout(direction);
    // // makeLayItem();
  }
}


function onCellAreaChanged(i, j, idx, uuid, area) {
  console.log(`$$$$ onCellAreaChanged i: ${i}, j: ${j}`);
  makeLayItems();
  buildLayoutAreas("layouted_items");
  buildLayoutAreas("design_cells");
}


function onCellRequest(rc) {
  console.log("$$$$onCellRequest " + JSON.stringify(rc, null, 2));
  switch (rc.req) {
    case "+C":
       layInsertGridCol(rc.j);
      break;
    case "-C":
      layRemoveGridCol(rc.j);
      break;
    case "-R":
      layRemoveGridRow(rc.i);
      break;
    case "+R":
      layInsertGridRow(rc.i);
      break;
    default:
      break;
  }
}


function onCellSizeChanged( gc ) {  // レンダリングされたサイズの通知
  //= 考え方：
  // Cell unit が px でない時、レンダリングされたサイズを ["px] に蓄積する。
  // でなければ、unit が px にに変更された時、サイズは未知となり、Style を生成できません。
  // 

  // console.log("*** onCellSizeChanged", gc);
  let { idx, i, j, w, h } = gc;

  let lc = htmlMeta.value.layCellResizeReq;   // req 時の情報

  let col = htmlMeta.value.layCol[j];
  let row = htmlMeta.value.layRow[i];

  if ((lc != null) && ((lc.state == "start") || (lc.state == "doing") || (lc.state == "rendered"))) {  // リサイズ中
    //= リサイズ中の場合: 意図的に Drag 中の cell / direction のサイズだけ保存する 
    // ※ direction x なのに、y のサイズが変わることはないはずで、
    //    y のサイズを無闇に保存⇒レイアウト⇒再描画⇒再通知 と繰り返すの恐れがあり、
    //    それは、レイアウトが不安定になるし、x resize の邪魔にもなる。
    //    （但し、uint が fr であれば、y を保存してもかまわない: style 生成に使わないから）
    // 【検討】当レンダリングの通知を使わず、必要なだけ、DOM のサイズを取得する方が良いかもしれない。
    //        ⇒ レンダリング完了でななければならないので、難しそう。

    // if (lc.direction != direction) {
    //   console.log("##### onCellSizeChanged: skip because direction is not matched");
    //   return;
    // }

    if (lc.i != i || lc.j != j) {     // !! 試し
      // console.log("##### onCellSizeChanged: skip because i, j is not matched");
      return;
    }

    // if (lc.i == i && lc.j == j) {     // !! 試し
    //   console.log("##### onCellSizeChanged: skip because i, j is the requested cell");
    //   return;
    // }
    
    if (lc.state == "rendered") {
      // console.log("##### onCellSizeChanged: skip because state is rendered");
      return;
    }

    if (lc.direction == "x") {
      // col.dc['px'] = Math.round(w);
      col.dc['px'] = w;

      // if (row.unit != "px") {
      //   row.dc['px'] = Math.round(h);
      // } 
    } else {
      // row.dc['px'] = Math.round(h);
      row.dc['px'] = h;

      // if (col.unit != "px") {
      //   col.dc['px'] = Math.round(w);
      // }
    }

    lc.state = "rendered";  // !! レンダリング完了
  } else {
    //= Drag 中でない時: サイズを保存する
    // col.dc['px'] = Math.round(w);
    // row.dc['px'] = Math.round(h);

    col.dc['px'] = w;
    row.dc['px'] = h;
  }
}

function onResize({ width, height }) {
  // console.log("#####onResize", width, height, htmlMeta.value.w, htmlMeta.value.h);
  if (width != htmlMeta.value.w || height != htmlMeta.value.h) {
    //     throw new Error('svg と edit-html のサイズが一致しません、Layout を確認下さい!');
    htmlMeta.value.w = width;
    htmlMeta.value.h = height;
  }
}


//= 定数値（2023/09/26 一部しかサポートしていない）
//  1) Align  （ブロック軸: 縦軸）
//  2) Justify（インライン軸: 水平軸）
//  3) Place  （align justify 一括指定）
//      例: .container { place-content: start end;
//= 
const JUST = {
  content: [          // .container { justify-items: start;
    "start",          // 先頭側に配置
    "end",            // 末尾側に配置
    "center",         // 中央に配置
    "space-between",  // 均等に配置, コンテナとアイテム間の余白なし
    "space-around",   // space-around：均等に配置, コンテナとアイテム間の余白は、隣接するアイテム間の余白の半分になる
    "space-evenly",   // 均等に配置, コンテナとアイテム間の余白は、隣接するアイテム間の余白と同じになる
  ],
  items: [            // .container { justify-items: start;
    "start",          // 先頭側に配置
    "end",            // 末尾側に配置
    "center",         // 中央に配置
    "stretch",        // 各アイテムのサイズが同じになるよう配置
  ],
  self: [             // .item { justify-self: start; ↑に上書き
    "start",          // 先頭側に配置 
    "end",            // 末尾側に配置
    "center",         // 中央に配置
    "stretch",        // 各アイテムのサイズが同じになるよう配置
  ],
};

// 【LAYOUT データ】
const htmlMeta = ref({
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  w: c.w,                             // w of the Grid Container, 2023/06/06
  h: c.h,                             // h of the Grid Container, 2023/06/06
  layouting: false,                   // Layout は既に初期化したか
  layoutingOnCell: false,              // false := item モード, true := cell モード

  force_size: true,                   // Size of the Grid Container, 初期値 is true: fit to galaxy_ref
  position: "relative",               // CSS of the Grid Container

  // 参照： initLayoutingMode makeLayItem makeGridItemStyle
  display: "grid",                    // CSS of the Grid Container, 2023/09/26 現在: grid しかサポートしていない
  grid_gap: '1px',                    // 【暫】row-gap column-gap | gap
  // grid_gap: '6px 3px',
  // grid_row_gap: '6px',
  // grid_column_gap: '3px',

  // ↓↓↓↓ 以下、数字は JUST string に示すものである、layShape に依存しない ↓↓↓↓
  justify: {          // X := インライン軸 （横軸）の配置
    content : 2,      //  justify-content = "center"
    items   : 3       //  justify-items = "stretch"
  },  
  align: {            // Y := ブロック軸 （縦軸）の配置
    content : 2,      //  align-content = "center"
    items   : 3       //  align-items = = "stretch"
  },
  //= BEGIN 不要: [ justify, align ] と同一でああるため
  // place: {            // XY インライン軸 （横軸）の配置, ブロック軸 （縦軸）の配置
  //   content : [0, 0],
  //   items   : [0, 0],
  //   self    : [0, 0]
  // }, 
  //= END 不要: [ justify, align ] と同一でああるため
  // ↑↑↑↑ 以上、数字は JUST string に示すものである、layShape に依存しない ↑↑↑↑

  layShape: { cols: 1, rows: 1 },     // !! 列数, 行数
  // ↓↓↓↓ 以下、layShape に依存するものです ↓↓↓↓
  layCol      : [],                       // 列トラック, i, 要素 := instance of LayTrackType ( '50%' | '1fr' | '1px' | .. )
  layRow      : [],                       // 行トラック, j, 要素 := instance of LayTrackType ( '50%' | '1fr' | '1px' | .. )

  layCell     : [],                       // Grid セル, i * j, { i : i, j : j, area : 'a' },
  // layCellRef  : [],                       // ↑ ref of LayoutItem
  layItem     : [],                       // Grid アイテム, i * j, { cell : { i : i, j : j }, content: 'A', justify_self: 0, align_self: 0 },
  // layItemRef  : [],                       // ↑ ref of LayoutItem
  //= BEGIN ↑ lay で生成された css データ
  grid_template_columns     : "1fr 1fr 1fr",    // 列トラックのサイズ, ['1fr',  '1fr', ],
  grid_template_rows        : "1fr 1fr",        // 行トラックのサイズ, ['1fr',  '1fr', ],
  grid_template_areas       : '"a a c" "r2c1 r2c2 c"',                // grid areas for items (preview mode)
  grid_template_cell_areas  : '"r1c1 r1c2 r1c3" "r2c1 r2c2 r2c3"',    // grid areas for cells (cells design mode)
  //= END ↑ lay で生成された css データ
  
  // ↑↑↑↑ 以上、layShape に依存するものです ↑↑↑↑

  layCellResizeReq: null,             //  Drag リサイズ Req, レイアウト編集対象セル
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}); // END htmlMeta


const show_toolbar_ref = ref(false);  // show | hide 2023.12.25b

const familyZIndexRef = defineModel<any>("familyZIndexRef", { local: true, default: null });  // 2023.12.18a Family EdiyHtmlElem の z-index on EditHtmlFrame
console.log("######## familyZIndexRef value: " + familyZIndexRef.value);


//= svg 系統一的な変数
const prefer_posize_ref: any = ref(null);  // 2023.12.30a null | { x, y, w, h, transform} , 確定した位置とサイズ

const mii_htmsvg_ref       = ref(null);  // 自分自身の ref
const htmsvg_dom_ref       = ref(null);  // defineModel svg_ref of EditSvgDefs.vue
const htmsvg_container_ref = ref(null);  // defineModel htmsvg_container_ref of EditSvgDefs.vue

const htmsvg_inner_ref = htmlMeta;   // alais

let madeInHis = false; // 2024.01.01a History から作成される時 true にする（History に追加されることを防ぐため） ※ 内容が変更された時、false にすることを忘れずに

const htmsvg_outer_ref = ref({            // 2024.01.08s DB Fix Save/Load ↓ .value にした ※ あくまでも初期値であって、watch で更新されることを期待している
  draw: htmsvg_inner_ref.value,           // 2024.01.08s

  z_index: familyZIndexRef.value,         // 2024.01.08s L-attrs のみ更新更新されるため、それ以外の watch(familyZIndexRef) 更新は不要; Family EdiyHtmlElem の z-index on EditHtmlFrame

  //= background_color color ※ 親 container earth_ref に（も）適用する TODO assets etc. 出力に適用させ
  //  "" | null | undefined の時、appCfgRef.back_color front_color を適用する
  //=
  background_color: "rgba(0, 0, 0, 0.0)", // 2023.12.16a 透明 if not is_root EditHtmlFrame
  color: appCfgRef.value.front_color,     // 2023.12.16a ※ 旧 "white"

  item_background: "rgba(0, 0, 0, 0.0)",  // 2023.12.16a 透明 if not is_root EditHtmlFrame
  cell_background: "rgba(0, 0, 0, 0.0)",  // 2023.12.16a 透明 if not is_root EditHtmlFrame

  lauout_mode: true,                      // 2024.01.06f true := Layout 動作する, false := Layout 動作不可（item 内 EditHtmlFrame は優先的動作する）

  // TODO style 情報
  // style: "fill:rgba(124, 237, 127, 0.15);stroke-width:1;stroke:rgba(33,33,255,1.0)"  // TODO R-Panel で実装する予定の属性
});


watch(htmsvg_inner_ref, (newVal) => { // 2024.01.08s
  console.log("$$$$ watch htmsvg_inner_ref");
  htmsvg_outer_ref.value.draw = newVal;
  // console.log(`$$$$ watch htmsvg_inner_ref: htmsvg_outer_ref.value updated to ${JSON.stringify(htmsvg_outer_ref.value, null, 2)}`);
}, { deep: true });

// updateLPanelAttrs(); // 2024.01.06c L-attr に反映, onMounted へ移動した

const updateLPanelAttrs = () => { // 2024.01.06c L-attr に反映
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == uuidRef.value))) {  // 2024.01.06b
    console.log(`${uuidRef.value} L-Panel is not for me, do nothing!`);
    return;
  }

  console.log("#### ${uuidRef.value} updateLPanelAttrs");
  try {
    edit_layout_ref.value = structuredClone(htmsvg_outer_ref.value); // 2024.01.06c L-attr に反映
    
    //+ COLOR Tab, 2024.01.08b ここに移動した
    selColorsRef.value = {  // 2023.12.16a
      "background_color": htmsvg_outer_ref.value.background_color,  // 2023.12.16a ※実コンテンツの色ではなく、Editor の背景色であることに注意
      "color": htmsvg_outer_ref.value.color,
      "item_background": htmsvg_outer_ref.value.item_background,
      "cell_background": htmsvg_outer_ref.value.cell_background,
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


const itemGridArea = (item) => {
  return { "grid-area": item["area"] }
}


const designCellGridArea = (cell) => {
  return { "grid-area": `r${cell.i + 1}c${cell.j + 1}` }
}

const examItemGrid_r1c1 = ref({ // OK
  "grid-area": "r1c1"
});
const examItemGrid_r1c2 = ref({ // OK
  "grid-area": "r1c2"
});
const examItemGrid_r1c3 = ref({ // OK
  "grid-area": "r1c3"
});
const examItemGrid_r2c1 = ref({ // OK
  "grid-area": "r2c1"
});
const examItemGrid_r2c2 = ref({ // OK
  "grid-area": "r2c2"
});
const examItemGrid_r2c3 = ref({ // OK
  "grid-area": "r2c3"
});



const demoHeader = ref({ // OK
  "grid-area": "header"
});


const examGridStyle = ref({ // TODO NG
  "display": "grid",  // OK
  "width": "30rem",   // OK
  "height": "15rem",  // OK
  "grid-template-areas": '"header header" "menu main" "footer footer"', // NG
  // "grid-template-rows": "1.5rem auto 1.5rem",
  // "grid-template-columns": "6rem auto"
});

// OK
const examAreaStyle = ref('"header header" "menu main" "footer footer"');

const examItemStyle = ref({ // OK
  "grid-area": "main"
});

class LayTrackType {       // Grid セル
  constructor( uiit = "fr", value = 1 ) {
    this.unit = uiit;     // !! default, fr | auto | px | % | em | rem | vw | vh | vmin | vmax
    this.dc = {
      fr: 1,              // !! default
      auto: 'auto',       // auto は値を持たないが、出力値を記載する
      percentage: null,   // %
      px: 1,              // これ以降は値を持つ項目で、値を記載する。
      em: 1,              // 未登録の単位は、利用禁止とする。
      // rem: 1,
      // vw: 1,
      // vh: 1,
      // vmin: 1,
      // vmax: 1,
    };
    this.dc[this.unit] = value;
    this.initPx = 0;            // リサイズ開始時のセルサイズ
    this.initUnit = 'px';       // リサイズ開始時のセルサイズの単位
  } // end constructor

  get value() {
    switch (this.unit) {
      case "auto":
        return this.dc[this.unit];              // 'auto'
      case "percentage":
        return this.dc[this.unit] + "%";        // '50%'
      default:
        return this.dc[this.unit] + this.unit;  // '1fr' | '1px' | '1em' | '1rem' | '1vw' | '1vh' | '1vmin' | '1vmax'
    }
  }

} // end class LayTrackType


const htmlFrameStyle = ref({  // makeGridStyle の Base
  "background-color": "rgba(196, 196, 196, 0.0)",
});


//= computed makeGridStyle へ移行した
// const gridStyle = ref({
//   "background-color": "rgba(196, 196, 196, 0.0)",
//   "width": "895.9942016601562px",
//   "height": "895.9942016601562px",
//   "gap": "1px",
//   "justify-content": "center",
//   "justify-items": "stretch",
//   "align-content": "center",
//   "align-items": "stretch"
// });


const makeGridStyle = computed(() => {
  const data = JSON.parse(JSON.stringify(htmlFrameStyle.value));
  if (htmlMeta.value.force_size) {
    data.width  = c.w + "px";
    data.height = c.h + "px";
  } else {
    data.width  = "auto"; // auto := 中身のサイズに合わせて拡大する
    data.height = "auto";
  }

  data["display"] = "grid";   // === htmlMeta.display

  if (htmlMeta.value.display === "grid") {
    if (htmlMeta.value.grid_gap) {
      data["gap"] = htmlMeta.value.grid_gap;
    }
    if (htmlMeta.value.grid_row_gap) {
      data["row-gap"] = htmlMeta.value.grid_row_gap;
    }
    if (htmlMeta.value.grid_column_gap) {
      data["column-gap"] = htmlMeta.value.grid_column_gap;
    }
    if (htmlMeta.value.justify) {
      if (htmlMeta.value.justify.content) {
        data["justify-content"] = JUST.content[htmlMeta.value.justify.content];
      }
      if (htmlMeta.value.justify.items) {
        data["justify-items"] = JUST.items[htmlMeta.value.justify.items];
      }
    }
    if (htmlMeta.value.align) {
      if (htmlMeta.value.align.content) {
        data["align-content"] = JUST.content[htmlMeta.value.align.content];
      }
      if (htmlMeta.value.align.items) {
        data["align-items"] = JUST.items[htmlMeta.value.align.items];
      }
    }
  }

  console.log("~~~~~~~~~~~~~~~~~~~~~~ makeGridStyle ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log("makeGridStyle: ", data);
  return data;
});



function initLayoutingMode() {
  const c = htmlMeta.value;

  //= The Shape を作る
  //  if [genInDataB, genInDataC] is use able, then use it else use default.
  if ( parseInt(genInDataB.value) && parseInt(genInDataC.value) ) {
    c.layShape.rows = parseInt(genInDataB.value);
    c.layShape.cols = parseInt(genInDataC.value);
  } else {
    c.layShape.rows = 2;
    c.layShape.cols = 3;
  }

  //= The Track := layCol[] layRow[] を作る
  c.layouting = true;   // 初期化済フラグを設定する
  c.display = "grid";
  c.layCol = [];
  for (let i = 0; i < c.layShape.cols; i++) {
    c.layCol.push(new LayTrackType("fr", 1 ));    // '50%' | '1fr' | '1px' | .. 
  }
  c.layRow = [];
  for (let i = 0; i < c.layShape.rows; i++) {
    c.layRow.push(new LayTrackType("fr", 1 ));    // '50%' | '1fr' | '1px' | .. 
  } 

  //= grid-template-rows と grid-template-columns を作成する
  buildLayout("xy");

  //= layCell[], layItem[] を作る
  makeLayCells();
  makeLayItems();

  //= grid_template_areas, grid_template_cell_areas を作る
  buildLayoutAreas("layouted_items");
  buildLayoutAreas("design_cells");

  //= computed makeGridStyle に戻した
  // gridStyle.value = makeGridStyle();

  console.log("~~~~~~~~~~~~~~~~~~~~~~~~ htmlMeta ~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log(htmlMeta.value);
}


function layInsertGridCol(index) {
  //= insert new CELL to the left of the index 0..
  console.log("$$$$ layInsertGridCol: ", index)
  const c = htmlMeta.value;
  if (index === 0) {
    c.layCol.unshift(new LayTrackType("fr", 1 ));
  } else {
    c.layCol.splice(index, 0, new LayTrackType("fr", 1 ));
  }
  c.layShape.cols = c.layCol.length;
  buildLayout();
  insertLayCells(index, undefined);
  makeLayItems();                     // 旧 insertLayItems(index, undefined);

  nextTick(() => {
    buildLayoutAreas("layouted_items");
    buildLayoutAreas("design_cells");
  })
}

function layInsertGridRow(index) {
  //= insert new ROW to the top of the index
  console.log("$$$$ layInsertGridRow: ", index)
  const c = htmlMeta.value;
  c.layRow.splice(index, 0, new LayTrackType("fr", 1 ));
  c.layShape.rows++;
  buildLayout();
  insertLayCells(undefined, index);
  makeLayItems();                     // 旧 insertLayItems(index, undefined);

  nextTick(() => {
    buildLayoutAreas("layouted_items");
    buildLayoutAreas("design_cells");
  })
}

function layRemoveGridCol(index) {
  //= remove the cell at the index
  console.log("$$$$ layRemoveGridCol: ", index)
  const c = htmlMeta.value;
  if (c.layShape.cols > 1) {
    c.layCol.splice(index, 1);
    c.layShape.cols--;
    buildLayout();
    removeLayCells(index, undefined);
    makeLayItems();                     // 旧 removeLayItems(index, undefined);
  
    nextTick(() => {
      buildLayoutAreas("layouted_items");
      buildLayoutAreas("design_cells");
    })
  }
 }

function layRemoveGridRow(index) {
  //= remove the cell at the index
  console.log("$$$$ layRemoveGridRow: ", index)
  const c = htmlMeta.value;
  if (c.layShape.rows > 1) {
    c.layRow.splice(index, 1);
    c.layShape.rows--;
    buildLayout();
    removeLayCells(undefined, index);
    makeLayItems();                     // 旧 removeLayItems(index, undefined);
  
    nextTick(() => {
      buildLayoutAreas("layouted_items");
      buildLayoutAreas("design_cells");
    })
  }
}


function makeLayCells(newCol = undefined, newRow = undefined, isUpdate = false) {
  //= Cells を作成・更新する
  // TODO isUpdate
  // TODO :key="uuid" は、item 追加の時に、既存 item.button etc. が新しい Cell に現れる
  //      謎の挙動、さらに、:key="content" は動作している ⇒ 要解明
  //=
  let cell, mi_ref, newFlag;
  const c = htmlMeta.value;
  const layCell = [];

  for (let i = 0; i < c.layShape.rows; i++) {
    for (let j = 0; j < c.layShape.cols; j++) {
      mi_ref = ref(null);

      newFlag = (newCol == j || newRow == i) ? 'N_' : '._';
      cell = {  // Grid セル: Layout w, h 操作対象
        mi_ref: mi_ref,
        i: i, 
        j: j, 
        content: i + ", " + j,   // 仮 
        uuid: newFlag + uuidv4(),
        area: `r${i + 1}c${j + 1}`,
      };
      layCell.push(cell);       // !!
    }
  }

  htmlMeta.value.layCell = layCell;
}


const NO_INSERT_LAY_CELLS = false;  // makeLayCells para. isUpdate は未実装なので、false にする
const NO_REMOVE_LAY_CELLS = false;  // makeLayCells para. isUpdate は未実装なので、false にする

function removeLayCells(rmCol = undefined, rmRow = undefined) {
  if (NO_REMOVE_LAY_CELLS) {
    makeLayCells(undefined, undefined); // !!
    return
  }
  
  //= 【お試し版】削除分の Cells を作成する
  //  
  //=
  let cell
  const c = htmlMeta.value;
  // const oldLayCell = _.cloneDeep(htmlMeta.value.layCell);
  const oldLayCell = htmlMeta.value.layCell;
  const layCell = [];
  
  let orgShape = {rows: c.layShape.rows, cols: c.layShape.cols};
  if (rmCol !== undefined) {
    orgShape.cols++;  // 変更前の列数
  }
  if (rmRow !== undefined) {
    orgShape.rows++;  // 変更前の行数
  }

  for (let i = 0; i < orgShape.rows; i++) {
    for (let j = 0; j < orgShape.cols; j++) {
      cell = oldLayCell.shift();
      if (rmCol == j || rmRow == i) {
        console.log("remove Lay Cell: " + cell.uuid + " " + cell.i + " " + cell.j)
      } else {
        if (rmCol !== undefined && j > rmCol) {
          cell.j--;
        }
        if (rmRow !== undefined && i > rmRow) {
          cell.i--;
        }
        console.log("upload Lay Cell: " + cell.uuid + " " + cell.i + " " + cell.j)
        layCell.push(cell);
      }
    }
  }

  htmlMeta.value.layCell = layCell;
}


function insertLayCells(newCol = undefined, newRow = undefined) {
  if (NO_INSERT_LAY_CELLS) {
    makeLayCells(newCol, newRow);
    return
  }
  
  //= 【お試し版】追加分の Cells を作成する
  //
  //=
  let cell, mod_i, mod_j, uuid, mi_ref;
  const c = htmlMeta.value;
  // const oldLayCell = _.cloneDeep(htmlMeta.value.layCell);
  const oldLayCell = htmlMeta.value.layCell;
  const layCell = [];

  let old_i;  // oldLayCell の i
  let old_j;  // oldLayCell の j

  old_i = 0;
  for (let i = 0; i < c.layShape.rows; i++) {
    old_j = 0;
    for (let j = 0; j < c.layShape.cols; j++) {
      if ((j == newCol) || (i == newRow)) {
        mi_ref = ref(null);

        uuid = 'n_' + uuidv4();
        cell = {
          mi_ref: mi_ref,
          i: i, 
          j: j, 
          content : i + ", " + j,   // 仮
          uuid: uuid,
          area: uuid,               // `r${i + 1}c${j + 1}` であるべきだが、重複を避けるのが難しい
        };
        console.log("New LayCell: " + i + ", " + j  + " " + uuid + " Created");
      } else {
        cell = oldLayCell.shift();
        console.assert(cell.i == old_i, "i: " + cell.i + " " + old_i);
        console.assert(cell.j == old_j, "j: " + cell.j + " " + old_j);

        mod_i = i;
        //= ↓ 動作も一緒
        // mod_i = cell.i;
        // if ((newRow != undefined) && (i >= newRow)) { 
        //     mod_i ++;
        // }

        mod_j = j;
        //= ↓ 動作も一緒
        // mod_j = cell.j;
        // if ((newCol != undefined) && (j >= newCol)) { 
        //     mod_j ++;
        // }

        cell.i = mod_i;
        cell.j = mod_j;
        cell.content = mod_i + ", " + mod_j;   // 仮

        console.log("Old LayCell: " + cell.uuid + " " + old_i + ", " + old_j + " -> " + mod_i + ", " + mod_j + " Updated");
      }

      layCell.push(cell);       // !!

      if (!(j == newCol)) {
        old_j ++;
      }

    } // end for j

    if (!(i == newRow)) {
      old_i ++;
    }
  }  // end for i

  htmlMeta.value.layCell = layCell;
}


function makeLayItems() {
  //= Items を作成する
  //
  //=
  console.log("#### makeLayItems");
  const areas = <any>[];
  let cell, area;
  let item, mi_ref;
  const layItem = [];

  for (let i = 0; i < htmlMeta.value.layCell.length; i++) {
    mi_ref = ref(null);
    cell = htmlMeta.value.layCell[i];
    area = cell['area'];
    if ((areas.indexOf(area) == -1) && (area != ".")) {
      areas.push(area);

      item = {
        mi_ref: mi_ref,         // 後に動的作成
        area: area,
        uuid: uuidv4(),         // !!
        index: layItem.length,
      };
      layItem.push(item);       // !!
    }
  }

  htmlMeta.value.layItem = layItem;
}


const setItemRef = (el) => {
  console.log(`$$$$ ;;;;;;;; setItemRef ${el}`);
  if (el) {
    const me = el.whoami();
    console.log(`  me: ${me}`);
    const idx = me["idx"]                           // TODO uuid の方が良い
    htmlMeta.value.layItem[idx]["mi_ref"] = el;     // !!
  }
}


const setCellRef = (el) => {
  console.log(`$$$$ ;;;;;;;; setCellRef ${el}`);
  if (el) {
    const me = el.whoami();
    console.log(`  me: ${me}`);
    const idx = me["idx"]                           // TODO uuid の方が良い
    htmlMeta.value.layCell[idx]["mi_ref"] = el;     // !!
  }
}


function makeGridCellStyle(cell) {
  console.log("#### makeGridCellStyle");
  const data = {
    "grid-column-start" : 1 + cell.j,       // これらは 1 ..
    "grid-column-end"   : 1 + cell.j + 1,
    "grid-row-start"    : 1 + cell.i,
    "grid-row-end"      : 1 + cell.i + 1,
  };

  // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ makeGridCellStyle:")
  // console.log(data);
  return data;
}


function makeGridItemStyle(item) {
  console.log("#### makeGridItemStyle");
  const data = {
    "grid-area" : `${item.area}`,
  };

  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ makeGridItemStyle:")
  console.log(data);
  return data;
}

function buildLayout( direction = "xy" ) {   // "x" | "y" | "xy"
  //= grid-template-rows, grid-template-columns, grid_template_areas を作成する
  console.log("#### buildLayout");

  if (direction == "x" || direction == "xy") {
    let cols = "";
    for (let i = 0; i < htmlMeta.value.layCol.length; i++) {
      cols += htmlMeta.value.layCol[i].value + " ";
    }
    htmlMeta.value.grid_template_columns = cols;
  }

  if (direction == "y" || direction == "xy") {
    let rows = "";
    for (let i = 0; i < htmlMeta.value.layRow.length; i++) {
      rows += htmlMeta.value.layRow[i].value + " ";
    }
    htmlMeta.value.grid_template_rows = rows;
  }
}


function buildLayoutAreas(mode = "layouted_items") {
  //= grid_template_areas を作成する
  //  mode : "layouted_items" | "design_cells"
  //=
  console.log(`#### buildLayoutAreas mode: ${mode}`);
  let k = 0;
  let area, rowAreas;
  let rowColAreas = '';   // '"r1c1 r1c2 r1c3" "r2c1 r2c2 r2c3"',
  for (let i = 0; i < htmlMeta.value.layRow.length; i++) {
    //= "r1c1 r1c2 r1c3" 作成
    rowAreas = '';
    for (let j = 0; j < htmlMeta.value.layCol.length; j++) {
      if (mode === "layouted_items") {
        area = htmlMeta.value.layCell[k]["area"];
      } else {
        area = `r${i + 1}c${j + 1}`;
      }

      if (j == 0) {
        rowAreas = area;
      } else {
        rowAreas += " " + area;
      }
      k = k + 1;
    }
    if (i == 0) {
      rowColAreas = '"' + rowAreas + '"';
    } else {
      rowColAreas += ' "' + rowAreas + '"';
    }
  }

  if (mode === "layouted_items") {
    htmlMeta.value.grid_template_areas = structuredClone(rowColAreas);
  } else {
    htmlMeta.value.grid_template_cell_areas = structuredClone(rowColAreas);
  }

  console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ grid_template_areas mode = ${mode}:`);
  console.log( mode === "layouted_items" ? htmlMeta.value.grid_template_areas : htmlMeta.value.grid_template_cell_areas);
}


const layCellEnableDrog = (cell) => {
  console.log("#### layCellEnableDrog");
  const enH = cell.j < htmlMeta.value.layCol.length - 1;
  const enV = cell.i < htmlMeta.value.layRow.length - 1;
  return { enH, enV };
};

//= END LAYOUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->


// "translate(x, y)"
const transMeToXY = computed(() => {
  return (
    "translate(" + (props.x - props.parent_x) + " " + (props.y - props.parent_y) + ")"
  );
});


const ctrlBoundUpdated = (dc) => {
  // console.log("boundUpdated: ", props.com_type + " " + uuidRef.value + " ", dc);
  if (dc.name === "dx") {
    emit("props_updated", uuidRef.value, { name: "dx", value: dc.value });
  } else if (dc.name === "dy") {
    emit("props_updated", uuidRef.value, { name: "dy", value: dc.value });
  } else if (dc.name === "dw") {
    htmlMeta.value.w =
      htmlMeta.value.w + dc.value >= 0 ? htmlMeta.value.w + dc.value : 0;
  } else if (dc.name === "dh") {
    htmlMeta.value.h =
      htmlMeta.value.h + dc.value >= 0 ? htmlMeta.value.h + dc.value : 0;
  }
};


function childBeDeleted(uuid) {
  // 子コンポーネントが削除されたときに呼ばれる関数です
  console.log(props.com_type + " " + uuidRef.value + " childBeDeleted " + uuid);
  const index = items.value.findIndex((item) => item.uuid == uuid);
  if (index >= 0) {
    items.value.splice(index, 1); // 削除
    updateEditingObj({ uuid: "", com_type: "" }); // 自分をアクティブにする
  }
}

function childPropsUpdated(uuid, dc) {
  // 子コンポーネントのプロパティが更新されたときに呼び出されます。
  console.log(
    props.com_type + " " + uuidRef.value + " received childPropsUpdated " + uuid + " dc: ",
    dc
  );
  const index = items.value.findIndex((item) => item.uuid == uuid);
  if (index >= 0) {
    if (dc.name === "dx") {
      items.value[index].x =
        items.value[index].x + dc.value >= 0 ? items.value[index].x + dc.value : 0;
    } else if (dc.name === "dy") {
      items.value[index].y =
        items.value[index].y + dc.value >= 0 ? items.value[index].y + dc.value : 0;
    }
  }
}


const { focused } = useFocus(inDataC_ref)   // TODO 動作しない
watch(focused, focused => {
  if (focused) { 
    console.log('input element has been focused')
  } else {
    console.log('input element has lost focus')
  }
})


onKeyStroke(true, (e) => {  // TODO 動作しない時がある
  console.log('#### onKeyStroke: ', e.key);
  updateGenInDataC(undefined, "ENTERキーで確定");
}, { target: inDataC_ref })


onKeyStroke('Enter', (e) => {
  console.log('#### onKeyStroke Enter, pressed on InDataC');
  inDataC_ref.value.blur();       // 要素からキーボードフォーカスを取り除きます

  if (genInId.value == "Layout") {
    e.preventDefault();
    console.log(`$$$$ genInId is ${genInId.value}`);

    htmlMeta.value.layouting = false;   // !! 強制的進め
    if (!htmlMeta.value.layouting) {
      console.log("    Layout 初期作成を実行します");
      initLayoutingMode();
    } 
  } else {
    e.preventDefault();
    console.log(`unsupported ${genInId.value}`);
  }
}, { target: inDataC_ref })



function onKeyDown(e) {
  console.log('#### onKeyDown: ', e.key);

  // TODO ここで、自分の状態を変更する
  // if (!isEditFocus.value) {
  //   return;
  // }

  let inData;
  let item;

  try {
    //= key: d, s, r, t, b, l, c, p, n, m, u, i, o, a, e, f, g, j, k, w, x, y, z
    if (e.key == "f") {
      htmlMeta.value.force_size = !htmlMeta.value.force_size;
    } else if (e.key == "g") {                // !! required
      htmlMeta.value.display = "grid";        //  現状、grid しかサポートしていない
    } else if (e.key == "w") {                // !! required
      //= align.content
      if (htmlMeta.value.align.content >= JUST.content.length - 1) {
        htmlMeta.value.align.content = 0;
      } else {
        htmlMeta.value.align.content += 1;
      }
    } else if (e.key == "x") {                // !! required
      //= align.items
      if (htmlMeta.value.align.items >= JUST.items.length - 1) {
        htmlMeta.value.align.items = 0;
      } else {
        htmlMeta.value.align.items += 1;
      }
    } else if (e.key == "a") {                // !! required
      //= justify.content
      console.log("d");
      if (htmlMeta.value.justify.content >= JUST.content.length - 1) {
        htmlMeta.value.justify.content = 0;
      } else {
        htmlMeta.value.justify.content += 1;
      }
    } else if (e.key == "d") {                // !! required
      //= justify.items
      console.log("a");
      if (htmlMeta.value.justify.items >= JUST.items.length - 1) {
        htmlMeta.value.justify.items = 0;
      } else {
        htmlMeta.value.justify.items += 1;
      }

    } else if (e.key == "/") {            // !! required
      //= 表示切り替え Cells / Items
      //  OK tested on 2023 /09 / 27
      htmlMeta.value.layoutingOnCell = !htmlMeta.value.layoutingOnCell;
    } else if (e.key == '_') {
      //= Remove Grid 行 トラック
      //  OK tested on 2023 /09 / 27
      genInDataB.value = JSON.stringify({ "op": "-", "kind": "row", "data": { "i": 0 } });   // デモ
      inData = JSON.parse(genInDataB.value);
      if (inData.kind == 'row') {
        layRemoveGridRow(inData.data.i);    // 0..
      }
    } else if (e.key == '-') {
      //= Remove Grid 列 トラック
      //  OK tested on 2023 /09 / 27
      genInDataB.value = JSON.stringify({ "op": "-",  "kind": "cell", "data": { "j": 0 } });   // デモ
      inData = JSON.parse(genInDataB.value);
      if (inData.kind == 'cell') {
        layRemoveGridCol(inData.data.j);    // 0..
      }
    } else if (e.key == '+') {              // !! required
      //= Insert Grid 行 トラック
      //  OK tested on 2023 /09 / 27
      genInDataB.value = JSON.stringify({ "op": "+",  "kind": "row", "data": { "i": 0 } });   // デモ
      inData = JSON.parse(genInDataB.value);
      if (inData.kind == 'row') {
        layInsertGridRow(inData.data.i);    // 0..
      }
    } else if (e.key == '=') {              // !! required
      //= Insert Grid 列 トラック
      //  OK tested on 2023 /09 / 27
      genInDataB.value = JSON.stringify( { "op": "+",  "kind": "cell", "data": { "j": 0 } } );   // デモ
      inData = JSON.parse(genInDataB.value);
      if (inData.kind == 'cell') {
        layInsertGridCol(inData.data.j);    // !! TODO 0..
      }
    } else if (e.key == 'c') {              // !! TODO 本呼出し, area name 変更後処理 デモ 
      console.log("$$$$ area name changed, build it");
      makeLayItems();
      buildLayoutAreas("layouted_items");
      buildLayoutAreas("design_cells");
    } else if (e.key == 'p') {              // !! required
      console.log("$$$$ htmlMeta:");
      console.log(JSON.stringify(htmlMeta.value, null, 2));
    } else {
      console.log("EditLayout " + uuidRef.value + " received onKeyDown " + e.key + " 【未定義】");
    }

  } catch (e) { // 【暫】別 component の入力なのに、↓動作している 誤動作対策
    console.log('  error');
    console.log(e);
  }

}


function ctrlBeDeleted() {
  console.log(props.com_type + " " + uuidRef.value + " Delete");
  emit("deleted", uuidRef.value);
}

onBeforeUpdate(() => {
  childRefs.value = []; // 画面に更新処理が走る度に、テンプレート参照を格納した配列に参照がpushされてしまいます。そのため、更新前に配列を初期化する必要があります。
});

onBeforeMount(() => {
  console.log("{{{{ " + props.com_type + "::" + uuidRef.value + " is_toot = " + props.is_root + ", able = " + props.able + ", tag_name = " + props.tag_name + ", tag_type = " + props.tag_type + ", is mounted!");

  // Vue 2.x beforeDestroy
  document.removeEventListener("keydown", onKeyDown);
});


//= 初期（デモ）表示
nextTick(() => {
  // genInId.value = "Layout"
  // genInDataB.value = "2";
  // genInDataC.value = "3";  
  initLayoutingMode();
})



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
      jdata: JSON.stringify({
        inner: htmsvg_outer_ref.value,       // 2024.01.08s inner := htmsvg_outer_ref
      }),
      // TODO 他の html/svg 埋め込み関連データ
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
  let html, style;

  //= grid container
  // 参照: makeGridStyle
  //=
  style = ``;
  style += `display: grid;\n`;
  style += `  position: ${htmlMeta.value.position};\n`;

  const gap = `${htmlMeta.value.grid_gap}`;
  style += `  gap: ${gap};\n`;

  if (htmlMeta.value.grid_row_gap) {
    const row_gap = `${htmlMeta.value.grid_row_gap}`;
    style += `  grid-row-gap: ${row_gap};\n`;
  }

  if (htmlMeta.value.grid_column_gap) {
    const column_gap = `${htmlMeta.value.grid_column_gap}`;
    style += `  grid-column-gap: ${column_gap};\n`;
  }

  if (htmlMeta.value.justify) {
    if (htmlMeta.value.justify.content) {
      style += `  justify-items: ${JUST.content[htmlMeta.value.justify.content]};\n`;
    }
    if (htmlMeta.value.justify.items) {
      style += `  justify-items: ${JUST.items[htmlMeta.value.justify.items]};\n`;
    }
  }

  if (htmlMeta.value.align) {
    if (htmlMeta.value.align.content) {
      style += `  align-content: ${JUST.content[htmlMeta.value.align.content]};\n`;
    }
    if (htmlMeta.value.align.items) {
      style += `  align-items: ${JUST.items[htmlMeta.value.align.items]};\n`;
    }
  }

  if (htmlMeta.value.grid_template_rows) {
    style += `  grid-template-rows: ${htmlMeta.value.grid_template_rows};\n`;
  }

  if (htmlMeta.value.grid_template_columns) {
    style += `  grid-template-columns: ${htmlMeta.value.grid_template_columns};\n`;
  }

  if (htmlMeta.value.grid_template_areas) {
    style += `  grid-template-areas: ${htmlMeta.value.grid_template_areas};\n`;
  }

  style += `  width: 100%; height: 100%;\n`


  html = `<div style = '${style}'>\n`;

  //= items
  let childMeta, childAssets;
  for (const [index, item] of Object.entries(htmlMeta.value.layItem)) {
    style = `grid-area: ${item["area"]}; border: solid 1px; box-sizing: border-box; display:block; position: relative;`;  // !! relative がなけらば ↓ 表示不正
    html += `<div style = "${style}">\n`;

    //= TODO LayoutItem 中身
    //
    //=
    console.log(`$$$$ ~~~~~~~~~~~~~~~~~~~~ CALC item.mi_ref.makeRawContentJson()`)
    childMeta = item['mi_ref'].makeRawContentJson(false);
    console.log(`    childMeta: ${JSON.stringify(childMeta, null, 2)}`);

    console.log(`$$$$ ~~~~~~~~~~~~~~~~~~~~ CALC item.mi_ref.makeDownloadAssets()`)
    childAssets = item['mi_ref'].makeDownloadAssets();
    console.log(`    childAssets: ${childAssets}`);
    
    if (childAssets != null) {
      html += childAssets;
    } else {
      html += `${item.index}`;  // 標識情報
    }

   html += `</div>\n`;
  }

  html += `\n</div>`;


  //= 子 本コンテンツを収集する
  let view_raw = {
    tipjson: null,
    html: html,
    css: null,
  }
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
// 2024.01.08a error WHEN 4) structuredClone(ot) 
//    b.structured-clone.js:290 Uncaught (in promise) DOMException: Failed to execute 'structuredClone' on 'Window': () => {
//       return {
//         idx: props.idx,
//         i: props.i,
//         j: props.j,
//         uuid: props.uuid
//       };
//     } could not be cloned.
//+ 
const pushDataToHistory = () => {
  console.log("**** pushDataToHistory");

  const ot = unref(htmsvg_outer_ref.value);
  // console.log("  ot: " + JSON.stringify(ot, null, 2));  // 2024.01.08a 調査のため

  const data = {
    timestamp: Date.now(),
    //++ oulter := ディープコピー  of htmsvg_outer_ref.value, 下記のいずれかを選択して下さい（各方法の制限に注意）
    oulter: JSON.parse(JSON.stringify(ot)),     // 1) basic                     ※ 2024.01.08a OK ↓4) NGなので、こっちにした
    // oulter: _.cloneDeep(ot),                 // 2) lodash library            ※ 2024.01.08a OK
    // oulter: { ...ot },                       // 3) お試し                     ※ 2024.01.08a OK
    // oulter: structuredClone(ot),             // 4) js 新しい structuredClone  ※ 2024.01.08a NG !  

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
  console.log("}}}} " + props.com_type + "::" + uuidRef.value + " is_toot = " + props.is_root + ", able = " + props.able + ", tag_name = " + props.tag_name + ", tag_type = " + props.tag_type + ", is mounted!");

  updateLPanelAttrs(); // 2024.01.06c L-attr に反映 

  updateGenInDataA("gB: Number of Rows, gc: Number of Columns", "Layout", "Grid Layout を作成します", "");

  if (['u-html'].includes(props.tag_name)) {
    myBoundingElRef = html_tag_ref.value.galaxy_ref;
    const { width: ta_width, height: ta_height } = useElementBounding(myBoundingElRef);
    tag_width = ta_width;
    tag_height = ta_height;
  }

  document.addEventListener("keydown", onKeyDown);

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

  //= TODO is_editing 版: 追加された直後、自分をアクティブにする
  // if (!isEditFocus.value) {
  //   // 自分がアクティブでないなら、
  //   updateEditingObj({ uuid: uuidRef.value, com_type: props.com_type }); // 自分をアクティブにする
  //   // mainMachine.send({ type : 'SW_TO_EDITING_HTML' });
  // }

  // // 疑似的にクリックイベントを発生させる
  // initialEditCmdParas(
  //   props.com_type,
  //   uuidRef.value,
  //   "onMounted",
  //   props.x, // parent_x
  //   props.y, // parent_y
  //   0,  // x
  //   0   // y
  // )

});



onUnmounted(() => {
  // Vue 3.x unmounted
  console.log(props.com_type + " " + uuidRef.value + " be unmounted!");
});



const layInfo = computed(() => {
    const info = {
        content : {
            justify : JUST['content'][htmlMeta.value.justify.content],
            align   : JUST['content'][htmlMeta.value.align.content],
        },
        items : {
            justify : JUST['items'][htmlMeta.value.justify.items],
            align   : JUST['items'][htmlMeta.value.align.items],
        },
    }

    return JSON.stringify(info);
});



</script>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "EditLayout",
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
    opacity: 1.0 !important;
}

.svg_events {
    pointer-events: all;
}

.html_events {
    pointer-events: auto;
} 

.able {
    pointer-events: v-band("props.able ? 'auto' : 'auto'"); /* TODO none */
}

.able_galaxy {
    pointer-events: v-band("props.able ? 'auto' : 'auto'"); /* TODO none galaxy が手前に来る対策 */
}

.able_svg {
    pointer-events: v-band("props.able ? 'all' : 'all'"); /* TODO none */
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

.who_am_i_layout {
    padding-top: 2em;
}

.who_am_i_next {
    padding-top: 3em;
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
}

.html_body {
  background-color:rgba(0, 0, 0, 0);
}


// .lay_cell_exam {
//     position: relative;
//     text-align: left;
//     display: inline-block;
//     vertical-align: middle; /* TODO */
//     background-color: rgba(10, 80, 209, 0);
//     color: rgba(250, 235, 215, 0) ;
//     outline: 1px solid rgba(255, 0, 0, 0);
//     margin: 1x;
// }


.meta-content-container {
  display: block;
  position: relative;
  left: 0px;
  top: 0px;
}

.edit_html_container {
  display: block;
  position: absolute !important;
  left: 0px;
  top: 0px;
}

.old_meta-toolbar-list {
  display:block;
  position: absolute !important;   // !!
  z-index: 128;
  width: 100%;
  height: fit-content;

  background-color: rgb(59, 76, 85);
  color: rgba(255, 255, 255, 1.0);
  // border: solid 1px rgba(0, 0, 0, 1.0);
  // width: 320px;
  // height: 320px;
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


.edit-html-frame {
  display: block;
  position: relative !important;
}


.layout_html_frame {
  background-color: rgba(10, 80, 209, 0);
}

.layoutor-cells-container {
  opacity: 0.75;   /* ALL */

}

.grid_cell {  // TODO .box の代りに
    position: relative;
    text-align: left;
    display: inline-block;
    vertical-align: middle; /* TODO */
    background-color: rgba(10, 80, 209, 0);
    color: rgba(250, 235, 215, 0) ;
    outline: 1px solid rgba(255, 0, 0, 0);
    margin: 1x;
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

.box {
  // width: 64px;
  // height: 64px;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: .1rem;
  color: blue;
}

.grid-container-basic {
  pointer-events: auto;
  position: v-bind("htmlMeta.position");
  
  //= makeGridStyle へ移動した
  // display: v-bind("htmlMeta.display");    // grid;
  // display: grid; 
}

.grid-container-shape {
  grid-template-rows: v-bind("htmlMeta.grid_template_rows");
  grid-template-columns: v-bind("htmlMeta.grid_template_columns");
}

.grid-container-areas {
  grid-template-areas: v-bind("htmlMeta.grid_template_areas");   // OK
}

.grid-cells-container-areas {
  grid-template-areas: v-bind("htmlMeta.grid_template_cell_areas");   // OK
}

.exam-grid-container {
  display: grid;
  width: 30rem;
  height: 15rem;
  grid-template-areas: "header header"
                       "menu main"
                       "footer footer";
  grid-template-rows: 1.5rem auto 1.5rem;
  grid-template-columns: 6rem auto;
}

.exam-grid-container-area {
  display: grid;
  width: 30rem;
  height: 15rem;
  // grid-template-areas: "header header"
  //                      "menu main"
  //                      "footer footer";

  // grid-template-areas: "header header" "menu main" "footer footer";
  grid-template-areas: v-bind("examAreaStyle");   // OK
}

.exam-grid-container-shape {
  grid-template-rows: 1.5rem auto 1.5rem;
  grid-template-columns: 6rem auto;
}


.header { grid-area: header; }
.menu { grid-area: menu; }
.main { grid-area: main; }
.footer { grid-area: footer; }


</style>
