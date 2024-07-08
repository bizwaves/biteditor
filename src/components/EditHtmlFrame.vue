<template>
<div
  ref = "galaxy_ref" 
  class = "client_decided galaxy html_events"
  v-bind:class="[props.editor_kind == 'tiptap' ? 'galaxy_size_just' : 'galaxy_size_follow' ]"
  title = "galaxy_ref :- EditHtmlFrame galaxy: div, Position, Size の基準（当 Html Frame の 辺界線）" 
>

  <div v-if = "isDevModeRef" class = "who_am_i">{{ props.com_type }} : {{ props.uuid }}</div>

  <!-- 
    （特に出力ファイルでは）本体をすっきりさせるため、Library 的なものはここに書く
    （子、孫の svg がありますから、それらのために用意しておく）
  -->

  <div display="none">
    <svg display="none">
      <desc>SVG DEFS-SYMBOL Library</desc>
    </svg>
  </div>

  <!-- 
    【HTML Frame】※用語の Frame は、Container と同じ意味です（以降も同様）。 
    要素：HTML Tag (Layout 機能、予製 svg in html TABLE、raw html - ユーザ入力の raw html text) 
          尚、SVG Frame を含むことができます。
  -->
  
  <div v-if = "true"
    ref   = "earth_ref"
    class = "client_decided editor_canvas html_events "
    :style = "{ 'background-color': htmsvg_outer_ref.background_color, 'color': 'htmsvg_outer_ref.background_color' }"
    title = "earth_ref :- EditHtmlFrame earth: div, canvas, to warp svg-root"
  >

    <!-- 
      【済】エラー resizeobserver loop limit exceeded 
          watch z ⇒ c apply threshold にて対策した
          ※ Debug 時 vue.config.js devServer.client.overlay.errors を一時的 false にすることで、強制的実行することが出来ます
    -->
    <svg v-if = "true" ref = "moon_ref" class = "svg_root" :viewBox = "viewBoxStr" >
      <title>moon_ref :- svg of EditHtmlFrame</title> 

      <g v-if = "true" >
        <title> EditHtmlFrame 実要素 + Ctrl Group </title>

        <g v-if = "true">
          <title>EditHtmlFrame 【実要素】Group </title>

          <foreignObject ref = "moon_fobj_ref" class = "svg_events" :x = "rootMinX" :y = "rootMinY" :width = "rootWidth" :height = "rootHeight" >

            <div ref = "moon_xmlns_ref" class = "html_xmlns client_decided html_events" xmlns = "http://www.w3.org/1999/xhtml" title = "moon_xmlns_ref :- EditHtmlFrame Contents XMLNS" >

                <v-btn v-if = "isDevModeRef && false" color = "primary" title = "html-moon debuging button" >
                    Click EditHtmlFrame xmlns in Svg!
                </v-btn>

                <!-- 
                  ※ HTML 系 Component は、以下のような構造を持つ
                      Editor
                          ++ EditSvgFrame                     ※ ++ は、子供を追加できることを示す
                              ++ EditSvgFrame
                              ++ EditHtmlFrame
                          ++ EditHtmlFrame
                              is EditHtmlElem/html_paired     ※ is は、実体を示す
                              ++ EditSvgFrame
                              ++ EditHtmlFrame
                              ++ (o.p.t)EditHtmlElem

                      EditHtmlElem
                          is html_singleton: HTML Singleton Tags With No Closing Tag
                          is html_paired : HTML Paired Tags, With Closing Tag
                              ** EditHtml(Layout)             ※ ** は、Layout 機能を持つことを示す
                          is raw_html : Raw Html Text

                      EditHtml(Layout)
                          ++ layouted items
                              ++ EditSvgFrame
                              ++ EditHtmlFrame
                              ++ EditHtmlElem
                -->

                <!-- 【HTML コンテナ】
                    DIV ← slot vue com. nested トラブル避けるため、変えた。旧： ここで、Layout 機能を持つ EditHtmlElem を配置する
                    ↓ がなく、EditHtmlElem.galaxy のサイズは EditHtmlFrame.earth サイズとなっている
                      class = "client_decided"
                -->

                <div
                    class = "root_contents_frame client_decided html_events" 
                    title = "me-ref :- EditHtmlFrame Contents"
                    ref = "me_ref"
                    @click = "onMeClick"
                >
                    <!-- 【対策】2023.12.07 ここは SelConditions checkbox 動作 NG（div 外では OK）
                      【修正】
                        方法 1) ↓解説の通り、<SelConditions @click.stop></SelConditions> と書く ※これだけで動作する
                        方法 2) click.prevent = "onMeClick" から .prevent を削除する ※これだけで動作するが、原因についてはっきりしないので、方法 1) 推奨

                      【解説】                      
                      SelConditions コンポーネントのチェックボックスがクリックされたとき、div の @click イベントリスナーが同時にトリガーされ、予期しない動作を引き起こす可能性があります。
                      これはイベントバブリングと呼ばれる現象で、子要素で発生したイベントが親要素に伝播することを指します。

                      この問題を解決するためには、SelConditions コンポーネントのチェックボックスのクリックイベントが親要素に伝播しないようにする必要があります。
                      これは、@click.stop 修飾子を使用して実現できます。この修飾子は、イベント伝播を停止し、親要素のイベントリスナーがトリガーされるのを防ぎます。
                      以下のように SelConditions コンポーネントのチェックボックスに @click.stop 修飾子を追加してみてください：
                      これにより、チェックボックスがクリックされたときに onMeClick メソッドが呼び出されるのを防ぐことができます。
                        <SelConditions @click.stop></SelConditions>
                    -->

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

                    <!-- Some テスト -->
                    <v-btn v-if = "false" class="intent intent_exam_a" color = "primary" title = "debuging button" >
                        Click EditHtmlFrame root_contents_frame aaaaa!
                    </v-btn>

                    <v-btn v-if = "false" class="intent intent_exam_b" color = "primary" title = "debuging button" >
                        Click EditHtmlFrame root_contents_frame bbbbb!
                    </v-btn>


                    <!-- BEGIN HTML 子孫 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
                    <template v-if = "true" >

                      <template v-for = "item in items" :key = "item.uuid">

                        <!-- 
                          html_paired は 統一された html (Tiptap) へ転用 2023-08-18
                          2023.12.08 お試し修正 EditHtmlElem（複数）
                           「:parent_uuid = "item.uuid"」 から 「:parent_uuid = "props.uuid"」 へ
                         -->
                        <EditHtmlElem v-if = "[ 'html_paired' ].includes(item.tag_type) && !item.deletedRef"
                            :parent_uuid = "props.uuid"
                            :is_root  = "false"
                            :able     = "true"
                            :uuid     = "item.uuid"
                            :z_index  ="item.z_index"
                            :ref      = "setChildRef"
                            :tag_name = "item.tag_name"
                            :tag_type = "item.tag_type"
                            :init_x      = "item.init_x"
                            :init_y      = "item.init_y"
                            :init_width  = "item.init_width"
                            :init_height = "item.init_height"
                            v-model:deletedRef      = "item.deletedRef"
                            class     = "intent"
                            :style="{ 'z-index': item.z_index }"
                            @z_index_changed = "onZIndexChanged"
                            @uuid_changed = "childUuidChanged"
                            @pos_size_decided = "onPosSizeDecided"
                        >
                          <template v-slot:pairedElemCnts>
                              {{ item.content }}
                          </template>
                        </EditHtmlElem>

                        <!-- u_text := sec-text -->
                        <EditHtmlElem v-if = "[ 'u_text' ].includes(item.tag_type) && !item.deletedRef"
                            :parent_uuid = "props.uuid"
                            :is_root  = "false"
                            :able     = "true"
                            :uuid     = "item.uuid"
                            :z_index  ="item.z_index"
                            :ref      = "setChildRef"
                            :tag_name = "item.tag_name"
                            :tag_type = "item.tag_type"
                            :init_x      = "item.init_x"
                            :init_y      = "item.init_y"
                            :init_width  = "item.init_width"
                            :init_height = "item.init_height"
                            v-model:deletedRef      = "item.deletedRef"
                            class     = "intent"
                            :style="{ 'z-index': item.z_index }"
                            @z_index_changed = "onZIndexChanged"
                            @uuid_changed = "childUuidChanged"
                            @pos_size_decided = "onPosSizeDecided"
                        >
                          <template v-slot:pairedElemCnts>
                              {{ item.content }}
                          </template>
                        </EditHtmlElem>

                        <!-- 
                          html (Tiptap) の node views 
                            ※ cmenu より作成されたものではないことに注意
                        -->
                        <EditHtmlElem v-if = "[ 'code_mirror', 'mermaid', 'mathlive' ].includes(item.tag_type)"
                            :parent_uuid = "props.uuid"
                            :is_root  = "false"
                            :able     = "true"
                            :uuid     = "item.uuid"
                            :z_index  ="item.z_index"
                            :ref      = "setChildRef"
                            :tag_name = "item.tag_name"
                            :tag_type = "item.tag_type"
                            :init_x      = "item.init_x"
                            :init_y      = "item.init_y"
                            :init_width  = "item.init_width"
                            :init_height = "item.init_height"
                            class     = "intent"
                            @uuid_changed = "childUuidChanged"
                            @pos_size_decided = "onPosSizeDecided"
                        >
                          <template v-slot:pairedElemCnts>
                              {{ item.content }}
                          </template>
                        </EditHtmlElem>

                        <EditHtmlElem v-if = "[ 'raw_html' ].includes(item.tag_type)"
                            :parent_uuid = "props.uuid"
                            :is_root  = "false"
                            :able     = "true"
                            :uuid     = "item.uuid"
                            :z_index  ="item.z_index"
                            :ref      = "setChildRef"
                            :tag_name = "item.tag_name"
                            :tag_type = "item.tag_type"
                            :init_x      = "item.init_x"
                            :init_y      = "item.init_y"
                            :init_width  = "item.init_width"
                            :init_height = "item.init_height"
                            v-model:deletedRef      = "item.deletedRef"
                            class     = "intent"
                            :style="{ 'z-index': item.z_index }"
                            @z_index_changed = "onZIndexChanged"
                            @uuid_changed = "childUuidChanged"
                            @pos_size_decided = "onPosSizeDecided"
                        >
                          <template v-slot:rawElemCnts>
                              {{ item.content }}
                          </template>
                        </EditHtmlElem>

                        <EditHtmlElem v-if = "[ 'svg' ].includes(item.tag_type) && !item.deletedRef"
                            :parent_uuid = "props.uuid"
                            :is_root  = "false"
                            :able     = "true"
                            :uuid     = "item.uuid"
                            :z_index  ="item.z_index"
                            :ref      = "setChildRef"
                            :tag_name = "item.tag_name"
                            :tag_type = "item.tag_type"
                            :content = "item.elemName"
                            :init_x      = "item.init_x"
                            :init_y      = "item.init_y"
                            :init_width  = "item.init_width"
                            :init_height = "item.init_height"
                            v-model:deletedRef      = "item.deletedRef"
                            class     = "intent"
                            :style="{ 'z-index': item.z_index }"
                            @z_index_changed = "onZIndexChanged"
                            @uuid_changed = "childUuidChanged"
                            @pos_size_decided = "onPosSizeDecided"
                        >
                          <template v-slot:rawElemCnts>
                              {{ item.content }}
                          </template>
                        </EditHtmlElem>


                      </template>
                    </template>
                    <!-- END HTML 子孫 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->

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
                            title="Save DB"
                            @click="saveDbContent(null)"
                        > Save
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

                      <!-- 
                        @click.stop 動作しなかったら入れてみてください
                        廃止 :owner_uuid = "props.uuid" ※ 2023.12.08 md_owner_uuid へ移行したため
                      -->
                      <SelConditions v-if = "(!isPreviewModeRef) && show_mata_ref"
                          @click.stop
                          ref = "sel_conds_ref"
                          kind = "normal"
                          :owner_com_type = "props.com_type"
                          v-model:md_owner_uuid = "md_uuid"
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
                              {{ rec.author }} |
                              {{ rec.version }} |
                              {{ rec.variation }} |
                              {{ rec.uuid }} |
                              {{ rec.is_root }} |
                              {{ rec.parent_uuid }} |
                              {{ rec.groups }} |
                              {{ rec.keywords }}
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
                    <!-- END META, TOOL-BAR, LIST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->

                </div>  <!-- END me_ref -->
              
            </div>  <!-- END Html Frame XMLNS -->
          </foreignObject>

          <g v-if = "true" v-show = "being_edit" class = "mini_ctrl_svg">
            <rect 
              class = "mini_ctrl_border" :x = "0" :y = "0" :width = "c.w" :height = "c.h"  
              style = "fill:rgba(121,121,121,0.0);stroke-width:1;stroke:rgba(255,0,0,1.0)"
            >
            </rect>
          </g>

          <rect v-if = "isDevModeRef" 
            class = "mini_ctrl_border" 
            :x = "0" 
            :y = "0" 
            :width  = "c.w >= 4 ? c.w : 0" 
            :height = "c.h >= 4 ? c.h : 0" 
            style = "fill:rgba(0,0,0,0);" 
            :stroke = "ctrl_stroke_ref"
            :stroke-width = "(c.w >= 32) && (c.w >= 32) ? 16 : 1"
            v-on:mouseover  = "mouseOverMiniCtrl"
            v-on:mouseleave = "mouseLeaveMiniCtrl"
          >
              <title> EditHtmlFrame svg debuger: moon_ref の位置、サイズが正しく設定されなければ、これが表示されない </title>
          </rect>

        </g>  <!-- END 実 HTML 要素 -->
      </g> <!-- translate x,y -->
    </svg> <!-- moon: svg of EditHtmlFrame -->
  </div> <!-- earth: div, canvas, to warp svg-root -->

</div> <!-- galaxy -->
</template>


<script setup lang="ts">
// import electron from "electron";
// import { ipcRenderer } from 'electron'

import {
  effectScope, getCurrentScope, onScopeDispose, markRaw, toRaw, reactive, shallowReactive, shallowReadonly, isReactive, computed, shallowRef, triggerRef, customRef, ref, unref, toRef, toRefs, isRef,
  provide, // defineExpose, defineProps, defineEmits,
  h, inject, hasInjectionContext, mergeProps, cloneVNode, isVNode, resolveComponent, resolveDirective, withDirectives, withModifiers, watch, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onErrorCaptured, onRenderTracked, onRenderTriggered, nextTick
} from "vue";


import {
  useDraggable, useElementBounding, useEventListener,
  useMouse, useMousePressed, onKeyStroke, useMagicKeys, useMouseInElement, useParentElement, useElementSize, useActiveElement,
  whenever
} from '@vueuse/core'

import { UseDraggable as Draggable, } from '@vueuse/components'
import { isClient } from '@vueuse/shared'

import { v4 as uuidv4 } from 'uuid'; // このuuid の代り、独自のルールで共通的作成する
import { Buffer } from 'buffer';
import { Base64 } from "js-base64";


import EditHtmlElem from "./EditHtmlElem.vue";
import SelConditions from "./SelConditions.vue";


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

const actingEditRef       = inject('actingEditRef');        // 2023.11.10
const actingEditEventRef  = inject('actingEditEventRef');   // 2023.11.10
const colorPickerRef      = inject('colorPickerRef');       // 【廃止】2023.12.16a 旧 2023.11.10

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editingObjRef = inject('editingObjRef');          // is_actived 系から移行させる
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateEditingObj = inject('updateEditingObj');    // function

const edit_html_frame_ref:any = inject('edit_html_frame_ref');

const appSpecRef: any = inject("appSpecRef");
const userCfgRef: any = inject("userCfgRef");
const appCfgRef: any = inject("appCfgRef");
const dbConRef: any = inject("dbConRef");

const DelayMSecWakeUp: any = inject("DelayMSecWakeUp");

const sel_conds_ref: any = inject("sel_conds_ref");             // 2023.12.14f DOM of SelConditions.vue

const selColorsRef: any = inject('selColorsRef');               // 2023.12.16a color picker info, 参考 const htmsvg_outer_ref
const initSelColorPicker: any = inject('initSelColorPicker');   // 2023.12.16a

const memoryEditStatRef: any = inject('memoryEditStatRef');   // 2024.01.01c
const memoryEditRef: any = inject('memoryEditRef');           // 2024.01.01c

const app_msg_ref: any = inject('app_msg_ref');

const selDocFileRef: any = inject("selDocFileRef");           // {}
const docFileName: any = inject("docFileName");               // function

const assets_ref: any = inject("assets_ref");
const MathJaxCDN: any = inject("MathJaxCDN");
const MathJaxCfg: any = inject("MathJaxCfg");

const outline_assets_ref: any = inject("outline_assets_ref");
const outline_root_assets_ref: any = inject("outline_root_assets_ref");

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


const galaxy_ref    = ref(null);    //
const earth_ref     = ref(null);    //
const moon_ref      = ref(null);    //
const moon_fobj_ref = ref(null);    //
const moon_xmlns_ref = ref(null);    //

const me_ref        = ref(null);    // 自分自身の ref



const props = defineProps({     // 「props」 という変数はリアクティブな変数ですが、分割代入によってリアクティブを消失することは要注意です
  com_type: { // edit_svg | edit_html | ..
    type: String,
    default: "edit_html_frame",
  },
  uuid: {                     // このコンポーネントの uuid, Save, Load Etc
    type: String,
    required: true,
  },
  editor_kind: {
    type: String,
    default: "able",          // able := 当アプリ固有仕様, nonable := able なし, tiptap := TiptapEditor.vue like, ...
  },
  parent_uuid: {              // 制御権限を親へ明け渡す用, DB 上親特定用
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
  writeable_ctrl_on_other: {
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

console.log("@@@@ props :: tag_name: " + props.tag_name + " tag_type: " + props.tag_type);


const familyZIndexRef = defineModel<any>("familyZIndexRef", { local: true, default: null });  // 2023.12.18a Family EdiyHtmlElem の z-index on EditHtmlFrame
console.log("######## familyZIndexRef value: " + familyZIndexRef.value);


//= svg | html 系統一的な変数
const prefer_posize_ref: any = ref(null);  // 2023.12.30a null | { x, y, w, h, transform} , 確定した位置とサイズ

const mii_htmsvg_ref = ref(null);         // 自分自身の ref
const htmsvg_dom_ref = ref(null);         // defineModel svg_ref of EditSvgDefs.vue
const htmsvg_container_ref = ref(null);   // defineModel htmsvg_container_ref of EditSvgDefs.vue

const htmsvg_inner_ref = ref({});         // htmlFrame は、children 以外、中身ありません

let madeInHis = false; // 2024.01.01a History から作成される時 true にする（History に追加されることを防ぐため） ※ 内容が変更された時、false にすることを忘れずに

const htmsvg_outer_ref = ref({  // 2024.01.08s DB Fix Save/Load ↓ .value にした ※ あくまでも初期値であって、watch で更新されることを期待している
  draw: htmsvg_inner_ref.value,         // 2024.01.08s

  z_index: familyZIndexRef.value,      // 2024.01.08s L-attrs のみ更新更新されるため、それ以外の watch(familyZIndexRef) 更新は不要; Family EdiyHtmlElem の z-index on EditHtmlFrame

  //= background_color color ※ 親 container earth_ref に（も）適用する
  //  2023.12.16a 初期値について: 
  //    EditHtmlFrame.vue when is_root のみ、background_color color を持つ、それ以外、background_color color は透明にする方針（children component は重ねるため）
  //      ※ EditHtmlFrame.vue when is_root は、assets の background_color color になるため、真っ白を初期値とする
  //=
  background_color: props.is_root ? appCfgRef.value.back_color : "rgba(0, 0, 0, 0.0)",  // 2023.12.16a rgba format が 必要（picker に設定するため）; 参考: appCfgRef.value.back_color,
  color: "rgba(0, 0, 0, 1.0)",          // 2023.12.16a hex | hexa format 必要（picker に設定するため）; 参考: appCfgRef.value.front_color,
});

// updateLPanelAttrs(); // 2024.01.06c L-attr に反映, onMounted へ移動した


const float_editor_ref = ref(null);   // 2023.11.19


const menu_container_ref  = ref(null);
const menu_area_ref       = ref(null);
const menu_ref            = ref<any>(null);

const mini_ctrl_ref = ref(null);
const ctrl_stroke_ref = ref("rgba(0, 88, 88, 0.05)"); 

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

//= Local で使われているもの
const md_title = ref("Exam Prj-01");
const md_subtitle = ref("Exam Prj-01 Sub-title");
const md_author = ref("Example Author");        
const md_version = ref("0.0.1");                
const md_variation = ref("normal");             
const md_keywords = ref("Example Prj Develop");
const md_groups = ref("Develop Prj");

const md_passphrase = ref("password123");         // 保留
const md_expiration = ref("");                    // 保留

const show_passphrase = ref(false);               // 保留


//= SelConditions v-model 用
const selCondMdsRef = ref({
  title: toRef(md_title),
  subtitle: toRef(md_subtitle),
  author: toRef(md_author),
  version: toRef(md_version),
  variation: toRef(md_variation),
  keywords: toRef(md_keywords),
  groups: toRef(md_groups),
});


watch(md_variation, (val, oldVal) => {
  console.log("EditHtmlFrame watch md_variation val: " + val + " oldVal: " + oldVal);
});


const fandall_rc_ref = ref([]);
const show_findall_ref = ref(false);


//= download 用
const raw_content_ref = ref({
  //  myjson  := 独自仕様 json
  //  dict    := dict
  //  tipjson := TipTap Json  【key】raw のキーにもなれる
  //  html    := html text    【key】
  //  css     := css text     【key】※ html や tipjson 他 と同時に存在することがある
  //  svg     := svg text     【key】
  kind: "html",
});

const out_assts_ref = ref("");  // html コード
const out_style_ref = ref("");  // style の部: class 定義


//= Resize 無限ループ対策
const threshold = (props.editor_kind == 'tiptap') ? 1.5 : 1.5;   // 閾値 1.5 が良いだろう 備考： 当初 bug あり、10 で無理やり動作した
const c = reactive({
  x: 0,
  y: 0,
  w: 0,
  h: 0,
});

// galaxy_ref === earth_ref 前提
const { x : galaxy_x, y : galaxy_y, top : galaxy_top, right : galaxy_right, bottom : galaxy_bottom, left : galaxy_left, width : galaxy_width, height : galaxy_height } = useElementBounding(galaxy_ref)
const z = reactive({    // 旧 const c
  x: 0,                 // galaxy_x や galaxy_top ではないことに注意（↓ Debug データ参考）
  y: 0,
  w: galaxy_width,
  h: galaxy_height,

  //= DEBUG ...
  //  gx: 321.22918701171875 gy: 224 gtop: 224 gright: 961.2291870117188 gbottom: 704 gleft: 321.22918701171875
  gx      : galaxy_x,
  gy      : galaxy_y,
  gtop    : galaxy_top,
  gright  : galaxy_right,
  gbottom : galaxy_bottom,
  gleft   : galaxy_left,
});

watch(z, (val, oldVal) => { // SvgEditor resizing_frame サイズが反映されたと確認出来た 2023/06/14
  console.log("$$$$EditHtmlFrame watch galaxy Z val: " + val.w + " - " + + val.h + " oldVal: " + oldVal.w + " - " + + oldVal.h);
  
  // console.log("  gx: " + val.gx + " gy: " + val.gy + " gtop: " + val.gtop + " gright: " + val.gright + " gbottom: " + val.gbottom + " gleft: " + val.gleft);
  let updated = false; 
  if (Math.abs(z.w - c.w) > threshold) {
    c.w = z.w;
    updated = true;
  }

  if (Math.abs(z.h - c.h) > threshold) {
    c.h = z.h;
    updated = true;
  }

  //= 【不要】LayoutItem.vie　側で対策済　
  //  2023 / 10 /01 LayoutItem.vie 時振動の特別対策
  //=
  // if ((val.w == oldVal.w) && (val.h == oldVal.h)) {
  //   updated = false;
  // }

  if (updated && (c.w > 0) && (c.h > 0)) {
    prefixedItemRef.value["init_x"     ] = Math.floor(c.w * 0.25);    // 【暫】2023/08/18
    prefixedItemRef.value["init_y"     ] = Math.floor(c.h * 0.25);    // 【暫】2023/08/18
    prefixedItemRef.value["init_width" ] = Math.floor(c.w * 0.5);     // 【暫】2023/08/18
    prefixedItemRef.value["init_height"] = Math.floor(c.h * 0.75);    // 【暫】2023/11/20
    console.log("prefixedItemRef updated " + JSON.stringify(prefixedItemRef.value));
    // console.log("  !! prefixedItemRef be updated " + JSON.stringify(items.value));                             // !!
  } else {
    // console.log("  .. prefixedItemRef not updated " + JSON.stringify(prefixedItemRef.value));
  }
});
 

const viewBoxStr        = computed(() => { return  c.x + ' ' + c.y + ' ' + c.w + ' ' + c.h; });  // view-Box
const rootMinX          = computed(() => { return  c.x + 'px'; });          // foreignObject
const rootMinY          = computed(() => { return  c.y + 'px'; });          // foreignObject
const rootWidth         = computed(() => { return (c.w + 'px'); });         // foreignObject, View-Port
const rootHeight        = computed(() => { return (c.h + 'px'); });         // foreignObject, View-Port

const able_target_ref = defineModel<any>("able_target_ref", { local: true, default: null });  // the Moveable Target
const able_actmd_ref  = defineModel<any>("able_actmd_ref",  { local: true, default: null });  // 動作モード of the Moveable
const able_macro_ref  = defineModel<any>("able_macro_ref",  { local: true, default: null });  // in_ | out_ | io_, データ I/F of the Moveable


//= 【DEPRECATED】自分がアクティブかどうか
//    is_editing へ移行
// const is_actived = computed(() => { return editingObjRef.value.uuid == props.uuid; }); 

const is_editing = computed(() => {
  return (editingObjRef.value.uuid === props.editing_uuid && editingObjRef.value.editing_id === props.editing_id);
})

const being_edit = computed(() => {
  return (editingObjRef.value.uuid === props.editing_uuid && editingObjRef.value.editing_id === props.being_edit_id);
})


const prefixedItemRef = ref({});

const items = ref([] as Array<any>);  //
const childRefs = ref({});            // 2023.12.08 {} へ変更し復活, 子コンポーネントの ref, childRefs.value[key] でアクセスし子コンポーネントを制御します。



const setChildRef = (el) => {   // el := REF of EditHtmlElem
  //=
  // TODO 2033.12.10 解析まち childs が存在する時、mouse-move 毎に、当関数が呼ばれている、何故？ 
  //=
  if (el) {
    //= 2023.12.08 謎の defineExpose ref
    // console.log('$$$$ ~~~~~~~~~~~~~ setChildRef');
    // console.log(' props.uuid: ' + props.uuid);
    // console.log(' el: ' + JSON.stringify(el, null, 2));
    // console.log('items: ' + JSON.stringify(items.value, null, 2));
    // console.log('isRef el.md_uuid ' + isRef(el.md_uuid));           // !! false, EditHtmlElem.vue 「const md_uuid = ref | toRef(props.uuid);」 で定義されているのに
    // console.log('unref el.md_uuid ' + unref(el.md_uuid));           // !! unref el.md_uuid 359525ba-083c-47ba-adc9-95e1ac32220f, undefined ではない
    // console.log('el.md_uuid ' + el.md_uuid);                        // !! el.md_uuid 359525ba-083c-47ba-adc9-95e1ac32220f

    let i = -1;
    for (let j = 0; j < items.value.length; j++) {
      if (items.value[j].uuid === unref(el.md_uuid)) {   // 2023.12.08 過去の仮コードを参考に、md_uuid へ変更した
        // console.log('found item ' + JSON.stringify(items.value[j], null, 2));
        i = j;        
        break;
      }
    }

    console.assert(i >= 0, `setChildRef: not found item uuid: ${unref(el.md_uuid)}`);
    if (i >= 0) {
      //= 廃止 2023.12.08 dom を items[i] に Write-Back すべきではない（繰り返し component instance 作成に陥る危険）
      // items.value[i]['dom'] = el; 
      //=
      childRefs.value[unref(el.md_uuid)] = el;   // 2023.12.08 ここで、子コンポーネントの ref を childRefs.value[key] へ格納します。
    }
  }
}


onBeforeUpdate(() => {
    // childRefs.value = [];   // 画面に更新処理が走る度に、テンプレート参照を格納した配列に参照がpushされてしまいます。そのため、更新前に配列を初期化する必要があります。
})


const ctrl_on_other = defineModel<boolean>("ctrl_on_other", { local: true, default: true })
console.log("ctrl_on_other: " + ctrl_on_other.value);


//= 2023.12.08 メモ defineModel に移行する方が良いが、影響が大きいため、次期に回す
// const md_uuid = defineModel<any>("md_uuid", { local: true, default: null });
//= 
const md_uuid = ref(props.uuid);    // 2023.12.08 children との連携のため、props.uuid とは別に、md_uuid を用意する
watch(md_uuid, (val, oldVal) => {   // 2023.12.08 取りあえず、これで凌ぐ
  console.log("md_uuid changed val: " + val + " oldVal: " + oldVal);
  if (val != oldVal) {
    emit("uuid_changed", val, oldVal);  // FIXED 2023.12.09
  }
});


watch(toRef(props, 'uuid'), (val, oldVal) => {
  console.log("props.uuid changed val: " + val + " oldVal: " + oldVal);
});


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
      emit("uuid_changed", new_uuid, props.uuid); // 2024.01.09j familyIdRef value 変更 ⇒ 遡って変更 ⇒ 当 instance 再作成（その際に、新しい uuid を持って　DB Load）
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
      emit("uuid_changed", new_uuid, props.uuid);
    })
  }, DelayMSecWakeUp.low); // !!
}


const show_toolbar_ref = ref(false);  // show | hide 2023.12.25b


const updateLPanelAttrs = () => { // 2024.01.06c L-attr に反映
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == props.uuid))) {  // 2024.01.06b
    console.log(`${props.uuid} L-Panel is not for me, do nothing!`);
    return;
  }

  console.log("#### ${uuidRef.value} updateLPanelAttrs");
  try {
    edit_html_frame_ref.value = structuredClone(htmsvg_outer_ref.value); // 2024.01.06c L-attr に反映

    //+ COLOR Tab, 2024.01.08b ここに移動した
    selColorsRef.value = {  // 2023.12.16a
      "background_color": htmsvg_outer_ref.value.background_color,
      "color": htmsvg_outer_ref.value.color,
    }
    initSelColorPicker("background_color", htmsvg_outer_ref.value.background_color, props.uuid);  // 2023.12.16a
  } catch (e) {
    console.log("  error: " + e);
  }
}


watch(actingEditRef, (val) => { //  2023.12.16a
  if ((val.com_type != props.com_type) || (val.uuid != props.uuid)) {
    console.log(`changed actingEditRef is not  me, do nothing!`);
    return;
  }

  nextTick(() => {
    console.log("$$$$$$$$ actingEditRef changed to me, update L-attr htmsvg_outer_ref and selColorsRef"); // 2024.01.06b 
    updateLPanelAttrs(); // 2024.01.06c L-attr に反映
  })
}, { deep: true });


// 【HTML コンテナ】
function makeMyHtmlFrame() {
    const frame = {
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        uuid    : props.uuid === "editor_html_frame" ? "editor_html_elem" : uuidv4(), // .elem の一意の識別子です
        w       : c.w,                  // 初期化, 後に contents に応じて動的変更される
        h       : c.h,                  // 初期化, 後に contents に応じて動的変更される
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    };

    console.log("初期値:", frame);
    return frame;
}

const myHtmlFrame = ref(makeMyHtmlFrame());   // !! b 該当, このコンポーネントの Local 座標系

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits([
    'props_updated',    // （uuid 以外の）props が更新された
    'deleted',          // 子コンポーネントが削除されたときに親コンポーネントに通知するためのイベントです
    'uuid_changed'      // 2023/10/09, val, oldVal
]);


const deletedRef = defineModel<any>("deletedRef", { local: true, default: null });

// //=== BEGIN バブリング (Bubbling) Mouse Event chain 調査
// const Layers = [];
// //= ここから branch master
// Layers.push({ 'name': 'galaxy',                 'ref': galaxy_ref,        'pressed': null });
// Layers.push({ 'name': 'earth',                  'ref': earth_ref,         'pressed': null });
// Layers.push({ 'name': 'moon svg',               'ref': moon_ref,          'pressed': null });

// //= ここから branch contents
// Layers.push({ 'name': 'moon-foreignObject',     'ref': moon_fobj_ref,     'pressed': null });
// Layers.push({ 'name': 'moon-xmlns-div',         'ref': moon_xmlns_ref,    'pressed': null }); 
// Layers.push({ 'name': 'me-elem-container',      'ref': me_ref,            'pressed': null });   // TODO 発火しない ⇒ EditHtmlElem 解析中
// //    contents EditHtmlFrame[] 確認待ち

// for (let i = 0; i < Layers.length; i++) {
//   const { pressed } = useMousePressed({ target: Layers[i].ref });
//   Layers[i].pressed = pressed;
//   whenever(Layers[i].pressed, () => {
//     console.log(";;;; ↑ " + Layers[i].name + " pressed: ", props.com_type + " " + props.uuid);
//   });
// }
// //=== END バブリング (Bubbling) Mouse Event chain 調査


const { current : currentKeySet } = useMagicKeys();



const SINGLETON_TAGS = ['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'command', 'embed', 'keygen', 'param', 'source', 'track', 'wbr'];

function createPureHtml(cmd: any, uuid = "", pos_size = null) {
    if (uuid == "") {
      uuid = uuidv4();
    }

    let tag_name = cmd.tag;
    let tag_type = 'html_paired';    // Default
    
    if (cmd.id == 'u_text') {
        tag_type = cmd.id;
    } else if (SINGLETON_TAGS.includes(tag_name.toLowerCase())) {
        tag_type = 'html_singleton';
    }

    const item = {
        z_index     : items.value.length * 10 + 1,  // 2023.12.18a
        tag_type    : tag_type,
        tag_name    : tag_name.toLowerCase(),
        com_target  : cmd["com_target"],
        com_type    : "edit_html_elem", // EditHtmlElem.vue ※ EditSvgEmbed.vue Etc. ではないことに注意
        uuid        : uuid,             // ↑ の uuid        ※ EditSvgEmbed.vue Etc. ではないことに注意
        deletedRef  : ref(false),
        // init_x      : my_just_ref.value.x,
        // init_y      : my_just_ref.value.y,
        // init_width  : Math.floor(my_just_ref.value.w * 0.5),  // 【暫】2023/07/28
        // init_height : Math.floor(my_just_ref.value.h * 0.5),
        content     : tag_name.toUpperCase(),      // ! Debug 用, 本来は空文字列
        style       : {                            // ↓ お試し Default
            pointerEvents   : 'auto',
        },
    };

    item["init_x"       ] = (pos_size != null) ? pos_size['x'] : my_just_ref.value.x;
    item["init_y"       ] = (pos_size != null) ? pos_size['y'] : my_just_ref.value.y;
    item["init_width"   ] = (pos_size != null) ? pos_size['w'] : Math.floor(my_just_ref.value.w * 0.5);
    item["init_height"  ] = (pos_size != null) ? pos_size['h'] : Math.floor(my_just_ref.value.h * 0.75);

    //= cmd.com_target へ移行した
    // if (cmd.id === 'u_text') {
    //   item["com_target"] = "EditSecText";
    // } else if (cmd.id === 'u-paired') {
    //   item["com_target"] = "EditHtmlNodeTree";    // TODO 確認
    // } else {
    //   item["com_target"] = "undefined!";          // !!
    // }

    //= Left Panel Add Event 時, init_ はない ⇒ 適当に設定する
    if ((item.init_width == 0) || (item.init_height == 0)) {
      item.innt_x = 0;
      item.init_y = 0;
      item.init_width = Math.floor(c.w / 4);
      item.init_height = Math.floor(c.h / 4);
    }

    console.log("$$$$$ createPureHtml " + props.com_type + ' ' + props.uuid + " createPureHtml: ", item);
    return item;
}

// function createRawHtml(tag_name, rawHtml) {
//     const item = {
//         tag_type    : 'raw_html',
//         tag_name    : tag_name ? tag_name.toLowerCase() : null,      // null | "div" | "span" | TODO 他にもある？
//         com_type    : "edit_html_elem", // EditHtmlElem.vue ※ EditSvgEmbed.vue ではないことに注意
//         uuid        : uuidv4(),         // ↑ の uuid        ※ EditSvgEmbed.vue ではないことに注意
//         deletedRef: ref(false),
//         init_x      : my_just_ref.value.x,
//         init_y      : my_just_ref.value.y, 
//         init_width  : Math.floor(my_just_ref.value.w * 0.5),  // 【暫】2023/07/28
//         init_height : Math.floor(my_just_ref.value.h * 0.5),
//         content     : rawHtml,
//         style       : {                           // ↓ お試し Default
//           pointerEvents: 'auto',
//         },
//     };
    
//     console.log(props.com_type + ' ' + props.uuid + " createRawHtml: ", item);
//     return item;
// }


function createSvgElem(cmd: any, uuid = "", pos_size = null) {
  if (uuid == "") {
    uuid = uuidv4();
  }

  let tag_name = cmd.tag;
  let elemName = cmd.elem;

  const item = {
    z_index     : items.value.length * 10 + 1,  // 2023.12.18a
    tag_type    : 'svg',
    com_target  : cmd["com_target"],
    tag_name    : tag_name.toLowerCase(),               // u-svg
    elemName    : elemName.toLowerCase(),               // line | rect | text | path | ..
    com_type    : "edit_html_elem",                     // EditHtmlElem.vue ※ EditSvgEmbed.vue ではないことに注意
    uuid        : uuid,                                 // ↑ の uuid        ※ EditSvgEmbed.vue ではないことに注意
    deletedRef  : ref(false),
    // init_x      : my_just_ref.value.x,
    // init_y      : my_just_ref.value.y,
    // init_width  : Math.floor(my_just_ref.value.w * 0.5),  // 【暫】2023/07/28
    // init_height : Math.floor(my_just_ref.value.h * 0.5),
    content     : elemName.toUpperCase(),               // ! Debug 用, 本来は空文字列
    style: {                                            // ↓ お試し Example
      pointerEvents: 'all',                             // （実は未使用）お試し
    },
  };

  item["init_x"       ] = (pos_size != null) ? pos_size['x'] : my_just_ref.value.x;
  item["init_y"       ] = (pos_size != null) ? pos_size['y'] : my_just_ref.value.y;
  item["init_width"   ] = (pos_size != null) ? pos_size['w'] : Math.floor(my_just_ref.value.w * 0.5);
  item["init_height"  ] = (pos_size != null) ? pos_size['h'] : Math.floor(my_just_ref.value.h * 0.75);

  //= cmd.com_target へ移行した
  // if (cmd.id === 'u_svg_line') {
  //   item["com_target"] = "EditSvgLine";
  // } else if (cmd.id === 'u_svg_rect') {
  //   item["com_target"] = "EditSvgRect";
  // } else if (cmd.id === 'u_svg_text') {
  //   item["com_target"] = "EditSvgText";
  // } else if (cmd.id === 'u_svg_path') {
  //   item["com_target"] = "EditSvgPath";
  // } else if (cmd.id === 'u_svg_fitcurve') {
  //   item["com_target"] = "EditSvgFitCurve";
  // } else if (cmd.id === 'u_svg_embed') {
  //   item["com_target"] = "EditSvgembed";
  // } else if (cmd.id === 'u_text') {
  //   item["com_target"] = "EditSecText";
  // } else if (cmd.id === 'u-paired') {
  //   item["com_target"] = "EditHtmlNodeTree";
  // } else {
  //   item["com_target"] = "undefined!";          // !!
  // }


  //= Left Panel Add Event 時, init_ はない ⇒ 適当に設定する
  if ((item.init_width == 0) || (item.init_height == 0)) {
    item.innt_x = 0;
    item.init_y = 0;
    item.init_width = Math.floor(c.w / 2);
    item.init_height = Math.floor(c.h / 2);
  }

  console.log(props.com_type + ' ' + props.uuid + " createSvgElem: ", item);
  return item;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const myTestClass = ref("html_button_tag"); // 「v-bind:class="myTestClass" 」で使用する⇒OKと確認できた


function childBeDeleted(uuid) { // 子コンポーネントが削除されたときに呼ばれる関数です
    console.log(props.com_type + ' ' + props.uuid + ' childBeDeleted ' + uuid);
    const index = items.value.findIndex(item => item.uuid == uuid);
    if (index >= 0) {
        items.value.splice(index, 1);   // 削除
        updateEditingObj({ uuid : "", com_type : "" });   // 自分をアクティブにする
    } else {
        console.log("childBeDeleted not found uuid: " + uuid);
    }
}

function childPropsUpdated(uuid, newProps) { // 子コンポーネントが更新されたときに呼ばれる関数です
    console.log(props.com_type + ' ' + props.uuid + ' childPropsUpdated ' + uuid);
    const index = items.value.findIndex(item => item.uuid == uuid);
    if (index >= 0) {
        // items.value[index] = props;     // TODO 更新
    }
}


const onPosSizeDecided = (ps) => {
  //= child のサイズを管理しないので、何もしなくて良い？
  console.log("$$$$$ onPosSizeDecided " + JSON.stringify(ps));
}


function childUuidChanged(uuid, newValue, oldValue) { // 初期 Empty EditHtmlFrame ⇒ Listup ⇒ Selected
  console.log(props.com_type + ' ' + props.uuid + ' childUuidChanged ' + newValue + ' <= ' + oldValue);

  const index = items.value.findIndex(item => item.uuid == uuid);
  if (index >= 0) {
    items.value[index].uuid = newValue;
  } else {
    console.log("childUuidChanged not found uuid: " + uuid);
  }
}


function onZIndexChanged(uuid, newValue, oldValue) { // 初期 Empty EditHtmlFrame ⇒ Listup ⇒ Selected
  console.log(props.com_type + ' ' + props.uuid + ' onZIndexChanged ' + newValue + ' <= ' + oldValue);

  const index = items.value.findIndex(item => item.uuid == uuid);
  if (index >= 0) {
    items.value[index].z_index = newValue;
  } else {
    console.log("onZIndexChanged not found uuid: " + uuid);
  }
}


function itemStyle(item) {
    console.log(props.com_type + ' ' + props.uuid + ' itemStyle ' + item.uuid);
    if (item.tag_type == 'edit_svg') {
        return {
        };
    } else if (item.tag_type == 'edit_html') {
        return {
        };
    } else if (item.tag_type == 'raw_html') {
        return {
        };
    } else if (item.tag_type == 'html_singleton') {
        return {
        };
    } else if (item.tag_type == 'html_paired') {
        return item.style;
    } else {
        return {
        };
    }
}


const my_just_ref = ref({ x: 0, y: 0, w: 0, h: 0 });


//= 親に渡されたコンテンツをレンダリングさせる
//  1) TipTap node-view
//=
const createPrefixedItem = () => {
  var created = false;

  if ([ "code_mirror", "mermaid", "mathlive" ].includes(props.tag_type)) {
    let tag_name = props.tag_name;
    let tag_type = props.tag_type;

    prefixedItemRef.value["tag_type"] = tag_type;
    prefixedItemRef.value["tag_name"] = tag_name.toLowerCase();
    prefixedItemRef.value["uuid"] = uuidv4();
    prefixedItemRef.value["init_x"     ] = Math.floor(c.w * 0.25);    // 【暫】2023/08/18
    prefixedItemRef.value["init_y"     ] = Math.floor(c.h * 0.25);    // 【暫】2023/08/18
    prefixedItemRef.value["init_width" ] = Math.floor(c.w * 0.5);     // 【暫】2023/08/18
    prefixedItemRef.value["init_height"] = Math.floor(c.h * 0.75);    // 【暫】2023/08/18
    prefixedItemRef.value["content"] = props.content;
    prefixedItemRef.value["style"] = {                           // ↓ お試し Default
      pointerEvents: 'auto',
    };
    created = true;
  }

  console.log("$$$$$ createPrefixedItem " + props.com_type + ' ' + props.uuid + " prefixedItemRef.value: ", prefixedItemRef.value);
  return created;
}


//= @click の位置、使える領域 :- e.clientXY - me_ref.clientRect
//  v-menu
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const cmenu_use_loc_ref = ref(false);       // false := local area 表示 | true := global area (main_container) 表示
const attached_ref = ref('cmenuid' + getRandomInt(Number.MAX_SAFE_INTEGER));
const sel_cmenu_attach = computed(() => {
  return cmenu_use_loc_ref.value ? `#${attached_ref.value}` : '#rel_cmenu_attached';
})


const onMeClick = (e: any) => {
  actingEditRef.value.com_type = props.com_type;
  actingEditRef.value.uuid = props.uuid;
  actingEditRef.value.familyId = "";    // r/w お試し2023.11.19

  //= cmenu
  //    1) ctrl_on_other サポート
  //    2) cmenu 動作すべき時だけ stopPropagation する
  //    3) props.editor_kind サポート
  //=
  console.log("######## onMeClick ctrl_on_other.value: " + ctrl_on_other.value + " being_edit: " + being_edit.value + " menu : " + cmenu.value);

  for (var value of currentKeySet) {  // control shift etc.
    console.log("currentKeySet has: " + value);
  }

  if (!currentKeySet.has('control')) {   // CTRL + L-Click  TODO R-Click  を除く
    console.log("control key not be detected, return AAA");
    return false; 
  }

  console.log("  ctrl_on_other 制御権限を " + ctrl_on_other.value ? "持っている" : "持っていない ..");
  if (!ctrl_on_other.value) {
    console.log("not ctrl_on_other, return BBB");
    return false;
  }

  if (props.editor_kind == 'able') {
    if (!being_edit.value) {
      console.log("（親の）Moveable 動作中, return CCC");
      return false;
    }
  } else {
    console.log("editor_kind is not able, （親の）Moveable は動作しているかチェックせず続く..");
  }


  if (cmenu.value) {
    // menu.value = false; // TODO v-menu 次回? 表示障害
    console.log("cmenu 表示中です、return DDD");
    return false;
  }

  // //= 2023/07/29 cmenu 動作するのに、uuid の同一が必要とする要因は見出せない、余計な副作用を避けるため、暫定的、当処理を投入しない
  // if (editingObjRef.value.uuid != props.uuid) {
  //   console("editingObj.uuid は 自分の uuid ではない ⇒ 自分の uuid を書き込みます..")
  //   updateEditingObj({ editing_id: props.editing_id, uuid: props.uuid, com_type: props.com_type, url: 'EditEmbed', state: "is_editing", caused_by: "onMeClick" });
  // }

  //= 位置・領域 my_just を計算する
  const clientRect = me_ref.value.getBoundingClientRect();
  console.log("  me clientRect: left = " + Math.round(clientRect.left) + ", top = " + Math.round(clientRect.top));            //  .x, y も可
  console.log("  me clientRect: width = " + Math.round(clientRect.width) + ", height = " + Math.round(clientRect.height));    // 
  console.log('  e clientX = ' + e.clientX + ', clientY = ' + e.clientY);                                                     // 参考 .x y pageX Y screenX Y

  const my_x = Math.round(e.clientX - clientRect.left);
  const my_y = Math.round(e.clientY - clientRect.top);
  my_just_ref.value = {
    x: my_x,
    y: my_y,
    w: Math.round(clientRect.width - my_x),
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

const cmenuItems = ref([              // cmenu 名前になった経緯: context menu(right click) ⇒ click menu TODO menu: nested-menu
  { id: 'who_am_i',         visible: true,  name: props.com_type + ' : ' + props.uuid                 },  // who am i

  //= 必要と判明したら、投入して下さい
  { id: 'give_back_ctrl',   visible: false, name: 'Give Back'                                         },  // 制御権限を親へ返上する 
  { id: 'take_away_ctrl',   visible: false, name: 'Take Away'                                         },  // 制御権限を親から奪う ※ cmenu 表示されないため、動作することがない, shouldShow 参照


  { id: 'listup',           visible: false,  name: 'Listup '                                           },  // 一覧表示 TODO 3)

  { id: 'save_db',          visible: false,  name: 'Save It to DB'                                     },  // !! TODO 1)
  { id: 'load_db',          visible: false,  name: 'Load It from DB'                               },  // !! TODO 2)
  { id: 'remove_it',        visible: false,  name: 'Delete'                                         },  // !! TODO 親ノードから切り離す（DBにはそのまま残す）, shouldShow 参照, hide when is root
  { id: 'delete_db',        visible: false,  name: 'Delete It From DB'                                 },  // ↑＋ TODO


  { id: 'download_assets',  visible: false,  name: 'Download Assets'                                   }, // download html, css
  { id: 'download_svg',     visible: false,  name: 'Download Svg File'                                 }, // download .svg file

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

  
  { id: 'u_paired',       visible: true,   name: '+ WYSIWYG',            tag: 'u-paired',  elem: 'wysiwyg',   'com_target': 'EditHtmlNodeTree',  'creator': 'createPureHtml',  },  // !! u-paired は転用  
  { id: 'u_svg_embed',    visible: true,   name: '+ SVG',                tag: 'u-svg',     elem: 'embed',     'com_target': 'EditSvgEmbed',      'creator': 'createSvgElem',   },  // svg embedded 処理～印刷  
  { id: 'u_layout',       visible: true,   name: '+ Layout',             tag: 'u-layout',  elem: 'u_layout',  'com_target': 'EditLayout',        'creator': 'createPureHtml',  },  // !!  
  { id: 'u_text',         visible: true,   name: '+ Text',               tag: 'u-text',    elem: 'sec_text',  'com_target': 'EditSecText',       'creator': 'createPureHtml',  },  // !! 暗号化テキスト 

  { id: 'u_html',         visible: true,   name: '+ Frame',              tag: 'u-html',    elem: 'u_html',    'com_target': 'EditHtmlFrame',     'creator': 'createPureHtml',  },  // EditHtmlFrame.vue, 検討 必要？
  
  { id: 'u_svg_src',      visible: true,   name: '+ Svg Code',           tag: 'u-svg',     elem: 'src_code',  'com_target': 'EditSvgSrc',        'creator': 'createSvgElem',   },  // U-svg-src
  { id: 'u_svg_line',     visible: true,   name: '+ Svg Line',           tag: 'u-svg',     elem: 'line',      'com_target': 'EditSvgLine',       'creator': 'createSvgElem',   },  // U-svg-line
  { id: 'u_svg_rect',     visible: true,   name: '+ svg Rect',           tag: 'u-svg',     elem: 'rect',      'com_target': 'EditSvgRect',       'creator': 'createSvgElem',   },  // U-svg-rect
  { id: 'u_svg_path',     visible: true,   name: '+ Svg path',           tag: 'u-svg',     elem: 'path',      'com_target': 'EditSvgPath',       'creator': 'createSvgElem',   },  // U-svg-path
  { id: 'u_svg_fitcurve', visible: true,   name: '+ Svg Fitcurve',       tag: 'u-svg',     elem: 'fitcurve',  'com_target': 'EditSvgFitCurve',   'creator': 'createSvgElem',   },  // U-svg-fitcurve
  { id: 'u_svg_text',     visible: true,   name: '+ Svg Text',           tag: 'u-svg',     elem: 'text',      'com_target': 'EditSvgText',       'creator': 'createSvgElem',   },  // U-svg-text

  { id: 'u_svg_circle',   visible: true,   name: '+ svg Circle',         tag: 'u-svg',     elem: 'circle',    'com_target': 'EditSvgCircle',     'creator': 'createSvgElem',   },  // 
  { id: 'u_svg_ellipse',  visible: true,   name: '+ svg Ellipse',        tag: 'u-svg',     elem: 'ellipse',   'com_target': 'EditSvgEllipse',    'creator': 'createSvgElem',   },  // 
  { id: 'u_svg_polyline', visible: true,   name: '+ svg Polyline',       tag: 'u-svg',     elem: 'polyline',  'com_target': 'EditSvgPolyline',   'creator': 'createSvgElem',   },  // 
  { id: 'u_svg_polygon',  visible: true,   name: '+ svg Polygon',        tag: 'u-svg',     elem: 'polygon',   'com_target': 'EditSvgPolygon',    'creator': 'createSvgElem',   },  //
]);


const pdfOpts = ref({           // PDF 出力時のサイズなどを設定
  landscape: false,             // !! 用紙の向き。true で横向き、false で縦向きです ※ @page CSS ルールがウェブページ内で使われている場合、landscape は無視されます
  displayHeaderFooter: false,   // !! ヘッダーとフッターを表示するかどうか 
  printBackground: false,       // !! 背景グラフィックを印刷するかどうか
  scale: 1.0,                   // !! number , 用紙に対するスケール
  pageSize: "A4",               // !! string, 用紙のサイズ。A0、A1、A2、A3、A4、A5、A6、Legal、Letter、Tabloid、Ledger | インチ単位の height と width を含む Object
  margins: {                    // !! 余白のサイズ。単位はインチです。省略値は 1cm (約 0.4 インチ) です。
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  },
  pageRanges: "",               // !! string, 印刷するページ範囲。例えば、"1-5, 8, 11-13"、"" は全ページ
  headerTemplate: "",           // !! string, ヘッダーの HTML テンプレート
  footerTemplate: "",           // !! string, フッターの HTML テンプレート
  preferCSSPageSize: false,     // !! true で CSS のページサイズを優先します
  generateTaggedPDF: false,     // true でタグ付き PDF を生成します
});


const onCmenuItemClick = async (cmd: any) => {
  console.log('^^^^^^^^^ id: ' + cmd.id + ' name: ' + cmd.name);

  var item = {};

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
      if (props.is_root) {  // !! EditHtmlFrame 
        console.log("can not delete it from DB because is_root is true.");
      } else {
        if (sel_conds_ref.value == null) {  // 2023.12.14c
          console.log("sel_conds_ref.value is null, do nothing!");
          return;
        }

        await sel_conds_ref.value.deleteFromDb();
        nextTick(() => {
          familyIdRef.value = null;
          deletedRef.value = true;
        })
      }
      break;

    case 'take_away_ctrl':
      if (props.writeable_ctrl_on_other) {
        ctrl_on_other.value = true;
      }
      break;
    case 'give_back_ctrl':
      if (props.writeable_ctrl_on_other) {
        ctrl_on_other.value = false;
      }
      break;

    case 'download_assets':
      makeHtmlFile();
      break;

    case 'download_svg':
      makeSvgFile();
      break;

    case 'print_to_pdf':
      //= copy pdfOpts.value to options
      const options = JSON.parse(JSON.stringify(pdfOpts.value));
      create_content_pdf(options);
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

    case 'u_svg_src':
    case 'u_svg_line':
    case 'u_svg_rect':
    case 'u_svg_circle':
    case 'u_svg_ellipse':
    case 'u_svg_polyline':
    case 'u_svg_polygon':
    case 'u_svg_path':
    case 'u_svg_fitcurve':
    case 'u_svg_text':
    // case 'u_svg_load_img':
    // case 'u_svg_load_pdf':
    case 'u_svg_embed':
      item = createSvgElem(cmd);
      console.log(JSON.stringify(item));
      items.value.push(item);
      break;

    // case 'u_div_raw':
    //   item = createRawHtml('div', 'Raw-Html-Text');
    //   console.log(JSON.stringify(item));
    //   items.value.push(item);
    //   break;
    // case 'u_span_raw':
    //   item = createRawHtml('span', 'Raw-Html-Text');
    //   console.log(JSON.stringify(item));
    //   items.value.push(item);
    //   break;
    // case 'u_raw':
    //   item = createRawHtml(null, 'Raw');
    //   console.log(JSON.stringify(item));
    //   items.value.push(item);
    //   break;

    default:
      // u_html u_png2svg u_named v_btn button u_layout u_paired
      item = createPureHtml(cmd);
      console.log(JSON.stringify(item));
      items.value.push(item);
      break;
  }
  
  menu_ref.value.isActive = false;
  cmenu.value = false;
}


const makeDocFileName = (type: String, name: String) => {
  if ((selDocFileRef.value["type"] != type) || (selDocFileRef.value["name"] == "")) {
    nextTick(() => {
      selDocFileRef.value["type"] = type;
      selDocFileRef.value["name"] = name;
    })
  }
}


const onCmenuItemMouseOver = (item: any) => {
  console.log('^^^^^^^^^ onCmenuItemMouseOver id: ' + item.id + ' name: ' + item.name);

  switch (item.id) {
    case 'u_layout':
      if (genInId.value != "Layout") {
        nextTick(() => {
          updateGenInDataA("gB: Number of Rows, gc: Number of Columns", "Layout", "Grid Layout を作成します", "");
          genInId.value = "Layout"
          genInDataB.value = "2";
          genInDataC.value = "3";
        })
      }
      break;

    case 'download_assets':
        makeDocFileName("assets", "assets.html");
      break;

    case 'download_svg':
        makeDocFileName("svg", "noname.svg");
      break;

    case 'download_pdf':
      makeDocFileName("pdf", "noname.pdf");
      break;

    // case 'print_to_pdf':
    //   makeDocFileName("pdf", "noname.pdf");
    //   break;

    default:
      break;
  }
}


//= cmenu.id 該当の event
watch(actingEditEventRef, (val) => {
  console.log("$$$$$$$$ watch actingEditEventRef");
  if (!val) {
    console.log(`val is ${val}, do nothing!`);
    return;
  };

  if (!((val.com_type == props.com_type) && (val.uuid == props.uuid))) {
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
        memoryEditRef.value['uuid'] = props.uuid;
        saveDbContent(null);
        break;
      default:
        console.log(`unknown event: ${val.event}`);
        break;
    }

    return;
  }

  if ( !( [ "inout", "able", "add", "database" ].includes(val.cate) ) ) {
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


watch(edit_html_frame_ref, (newVal) => { // 2023.12.19a
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == props.uuid))) {  // 2024.01.06b
    // console.log(` not changed for my L-htmsvg_outer_ref, do nothing!`);
    return;
  } 
  
  htmsvg_outer_ref.value = { ...newVal };
  familyZIndexRef.value = Number(newVal["z_index"]); // !!
  console.log(`$$$$ ${props.uuid} watch edit_html_frame_ref: htmsvg_outer_ref.value updated to ${JSON.stringify(htmsvg_outer_ref.value, null, 2)}`);
}, { deep: true });



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


const mouseOverMiniCtrl = (e) => {
  // console.log(props.com_type + " : " + props.uuid + " mouseOverMiniCtrl");
  ctrl_stroke_ref.value = "rgba(0, 88, 88, 0.25)";
  e.stopPropagation();
}

const mouseLeaveMiniCtrl = (e) => {
  // console.log(props.com_type + " : " + props.uuid + " mouseLeaveMiniCtrl");
    ctrl_stroke_ref.value = "rgba(0, 88, 88, 0.05)";
  e.stopPropagation();
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
}


const { Ctrl_T } = useMagicKeys();  // 2023.12.30a
watch(Ctrl_T, (v) => {
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == props.uuid))) {
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
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == props.uuid))) {
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




const build_meta = (
  dom_name, dom_ref, develop, product, title,
  containerRequired = true,
  border = `border: solid 1px rgba(0, 0, 0, 1.0); box-sizing: border-box;`,
  background = `rgba(255, 255, 255, 0.0)`,
) => {
  //=  meta, Raw Content := meta + raw[]

  console.log(`$$$$ ~~~~~~~~~~~~ build_meta ${dom_name}`);
  let meta = {};

  meta['com_type'] = props.com_type;        // component-type
  meta['uuid'] = props.uuid;                // component-id
  meta['dom_name'] = dom_name;              // !! component.dom
  meta['kind'] = 'myjson';
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



const makeRawContentJson = async (rootContainerRequired) => {
  console.log("$$$$ ~~~~~~~~~~~~ makeRawContentJson");

  const outlineIt = props.is_root ? outline_root_assets_ref.value : outline_assets_ref.value;
  let outlineAlpha = outlineIt ? 1.0 : 0.0;

  //= EditHtmlFrame galaxy_ref を child として作る
  let galaxy = build_meta(
    'galaxy',
    galaxy_ref,
    true,
    true,
    'EditHtmlFrame galaxy, Position Size の基準, div',
    true,
    `outline: dotted 6px rgba(33, 33, 33, ${outlineAlpha});`
  );
  raw_content_ref.value = galaxy;
  let galaxy_raw = [];
  galaxy['raw'] = galaxy_raw;


  //=【DEBUG】model able_target_ref を child として作る
  //  ↑ galaxy_ref と同様であるはず 2023/11/04
  //=
  // let root = build_meta(
  //   'galaxy',
  //   able_target_ref,
  //   true,
  //   true,
  //   'EditHtmlFrame model able_target_ref',
  //   rootContainerRequired,
  //   `outline: solid 1px rgba(0, 0, 0, 1.0);`,
  //   `rgba(255, 255, 255, 1.0)`,
  // );
  // raw_content_ref.value = root;
  // let root_raw = [];
  // root['raw'] = root_raw;


  // 子 EditHtmlElem のコンテンツを収集する
  let child_ref, child_raw;
  for (const [i, item] of items.value.entries()) {
    //= 削除済みの場合は、スキップする
    if (item["deletedRef"]) {  // 2023/12/05 注釈：なぜ .value が不要？
      console.log("child item is deleted, skep it");
      continue;
    } else {
      console.log("child item is not deleted");
    }
    console.log("    make it");

    //= EditSecText は、除外する
    if (item["com_target"] == "EditSecText") {
      console.log("child item is EditSecText, skep it");
      continue;
    } else {
      console.log("child item is not EditSecText");
    }

    child_ref = childRefs.value[item['uuid']];  // 2023.12.08
    child_raw = await child_ref.makeRawContentJson(true);
    galaxy_raw.push(child_raw);
  }

  console.log('galaxy' + JSON.stringify(galaxy, null, 2));

  return galaxy;
}


const makeDownloadAssets = () => {
  console.log("makeDownloadAssets");

  let meta = raw_content_ref.value;

  //= 本文
  let assets = mkAssets(meta, 0);   //= nested 展開 to out_assts_ref & out_style_ref

  // console.log(`assets: \n${assets}`);

  return assets
}


async function saveAssetsSvgFile(fileName = 'C:\\DOCs\\SvgEditor\\exam01-assets.svg') {
  console.log("saveAssetsSvgFile " + fileName);

  const payload = JSON.stringify(
    {
      out_assts: out_assts_ref.value,
      out_style: out_style_ref.value,
    }
  )

  const content = Buffer.from(payload).toString('base64');

  const sendData = {
    fileName: fileName,
    content: content
  };

  const result = await window.unipyapi.writeAssetsSvgFile(sendData);
  console.log("  result: " + JSON.stringify(result, null, 2));
  app_msg_ref.value = result["readed_data"] != null ? `Exit Code: ${result["readed_data"]["exit_code"]}, File: ${result["readed_data"]["path"]}` : `Code: ${result["code"]}, success: ${result["success"]}, Message: ${result["err"]}, File: ${fileName}`;

}


async function saveAssetsFile(fileName = 'C:\\DOCs\\SvgEditor\\exam01-assets.html') { // .html .css Flie を Save する
  console.log("saveAssetsFile " + fileName);

  const payload = JSON.stringify(
    {
      out_assts: out_assts_ref.value,
      out_style: out_style_ref.value,
    }
  )

  const content = Buffer.from(payload).toString('base64');

  const sendData = {
    fileName: fileName,
    content: content
  };

  const result = await window.unipyapi.writeAssetsFile(sendData);
  console.log("  result: " + JSON.stringify(result, null, 2));
  app_msg_ref.value = result["readed_data"] != null ? `Exit Code: ${result["readed_data"]["exit_code"]}, File: ${result["readed_data"]["path"]}` : `Code: ${result["code"]}, success: ${result["success"]}, Message: ${result["err"]}, File: ${fileName}`;
}



const makeHtmlFile = async () => {  // cmenu id download_assets
  //=
  //   TODO generated by ～ という記述を入れる （Licence による）
  //=

  console.log("+++++++++++++++++++ makeHtmlFile")
  
  if (!selDocFileRef.value["name"].endsWith(".html") && !selDocFileRef.value["name"].endsWith(".htm")) {
    app_msg_ref.value = "File name should be end with .html";
    return;
  } else {
    app_msg_ref.value = "";
  }

  //= clean
  assets_ref.value["hasLaTex"] = 0;
    
  out_assts_ref.value = "";   // !required
  out_style_ref.value = "";   // !required


  out_assts_ref.value +=
`<!DOCTYPE html>
<html lang="ja">

<head>
<meta charset="utf-8" >
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name=”description” content=”SvgEditor Example”>

<link rel="stylesheet" href="styles.css">
<style>
body {background-color: rgba(255, 255, 255, 1.0);}
</style>

<title>テストページ</title>

${MathJaxCDN}
${MathJaxCfg}
</head>

<body style="background-color:rgba(255, 255, 255, 1.0);">
`;

  await makeRawContentJson(true); // 収集 コンテンツ to raw_content_ref
  makeDownloadAssets();           // !! 本文, nested 展開 to out_assts_ref & out_style_ref

  //= script
  //  BABEL_PARSER_SYNTAX_ERROR reasonCode UnterminatedRegExp
  //  ⇒ u-jscode と書くように
  //=
  out_assts_ref.value += `
<u-jscode>
// document.getElementById("demo").innerHTML = "Hello JavaScript!";
</u-jscode>

</body>
</html>
`;

  //= pyshell にて file を書き出す
  let fileName = docFileName();
  saveAssetsFile(fileName);
}



const makeSvgFile = async () => {  // Download Svg File
  //=
  //  【重要】
  //      ここで生成した svg ファイルは、html 埋め込む用です、
  //      .svg 単体を browser で開く時、LaTeX 式は mathjax でのレンダリングになりません。
  //      ⇒ LaTeX式を含むSVGを適切に表示するためには、SVGをHTMLファイル内に埋め込み、そのHTMLファイルをブラウザで開くことをお勧めします。
  //=
  console.log('$$$$ ~~~~~~~~ makeSvgFile');

  if (!selDocFileRef.value["name"].endsWith(".svg")) {
    app_msg_ref.value = "File name should be end with .svg";
    return;
  } else {
    app_msg_ref.value = "";
  }

  //= clean
  out_assts_ref.value = "";   // !required
  out_style_ref.value = "";   // !required

  // 収集 コンテンツ to raw_content_ref
  await makeRawContentJson(true);

  const ct = raw_content_ref.value["container"];

  //= svg
  out_assts_ref.value +=
`<?xml version="1.0" encoding="UTF-8"?>

<svg version="1.1"
  width = "${ct.w}" height = "${ct.h}"
  viewBox = "0 0 ${ct.w} ${ct.h}"
  xmlns = "http://www.w3.org/2000/svg"
  xmlns:svg = "http://www.w3.org/2000/svg">

<defs id="defs0">
</defs>

<g>
<foreignObject
  x = "0" y = "0" width = "${ct.w}" height = "${ct.h}">

<body xmlns="http://www.w3.org/1999/xhtml" style="background-color:rgba(255, 255, 255, 1.0);">

`;

  // 本文, nested 展開 to out_assts_ref & out_style_ref
  makeDownloadAssets();

  out_assts_ref.value += `
</body>

</foreignObject>
</g>

</svg>
`;

  //= TODO styles.css データ

  //= pyshell にて file を書き出す
  let fileName = docFileName();
  saveAssetsSvgFile(fileName);
}



async function create_content_pdf(options) {
  console.log('$$$$ ~~~~~~~~ printToPdfFile');

  let pdfname = appCfgRef.value.doc_dir.endsWith('\\')
    ? appCfgRef.value.doc_dir + selDocFileRef.value["name"]
    : appCfgRef.value.doc_dir + '\\' + selDocFileRef.value["name"];

  await window.sysapi.printWinContentsToPdf(pdfname, options);   
}


const is_object = (myVar) => {
  return typeof myVar === 'object' && !Array.isArray(myVar) && myVar !== null;
}

const is_array = (myVar) => {
  return typeof myVar === 'object' && Array.isArray(myVar) && myVar !== null;
} 



const mkAssets = (subTree, level) => {
  //= nested 展開 to out_assts_ref, out_style_ref
  //  HTML コードが生成され、それを .html ファイルへ書くと良い
  //=

  console.log('mkAssets level = ' + level);

  let meta = subTree;
  let kind, raw,ct, s, shouldDraw, sizepos, style, mode, trans;

  //= review 時表示させる container, 本コンテンツではありません
  let border; // 【廃止】
  let outline, background, title;

  const outlineIt = props.is_root ? outline_root_assets_ref.value : outline_assets_ref.value;
  let outlineAlpha = outlineIt ? 1.0 : 0.0;

  console.assert(is_object(meta), "meta is not object");
  kind = meta['kind'];
  raw = meta['raw'];
  ct = meta['container'];

  //= container <div> を描画する
  if (ct != null) {
    mode = isDevModeRef.value ? "develop" : "product";
    shouldDraw = "should_draw" in ct ? ct["should_draw"][mode] : true;  // !!
    console.assert(shouldDraw, "no supported shouldDraw = false"); // 2023.12.14a false 時、children のoffset がなくなっている様子　⇒ outlineAlpha にて表現すると良いかも

    if (shouldDraw) {
      if (level == 0) {
        sizepos = `left:0px; top:0px; width:${ct.w - ct.x}px; height:${ct.h - ct.y}px;`;
      } else {
        sizepos = `left:${ct.y}px; top:${ct.x}px; width:${ct.w}px; height:${ct.h}px;`;
      }

      //= 廃止
      // border = "border" in ct ? `${ct["border"]}` : `border: solid 1px; box-sizing: border-box;`;

      //= 【暫定】ct.outline は未対応で、とりあえず ct.border を使う
      if ("outline" in ct) {
        outline = `${ct["outline"]}`;
        console.log("in ct, outline: " + outline)
      } else if ("border" in ct) {              // !! 暫く
        outline = `${ct["border"].replace("border", "outline")}`;
        console.log("border in ct, outline: " + outline)
      } else {
         outline = `not in ct, outline: solid 1px rgba(0, 0, 0, ${outlineAlpha});`;
      }

      if ("transform" in ct && ct["transform"] != "") {
        trans = ` transform: ${ct["transform"]};`;
      } else {
        trans = '';
      }

      style = `display:block; position: ${level == 0 ? 'relative' : 'absolute'}; ${sizepos} ${trans} ${outline}`;   // 2024.01.12b お試し frame children 同士同時表示障害対策 

      if ("background" in ct) {
        style += ` background-color: ${ct["background"]};`;
      }

      title = "title" in ct ? ct["title"] : "";
      out_assts_ref.value += `<div style="${style}" title="${title}"> \n`;
    }
  }


  if (['myjson'].includes(kind) && is_array(raw)) {
    for (const [i, value] of raw.entries()) {
      console.log("myjson/array を解析し do nested mkAssets")
      mkAssets(value, level + 1);
    }
  } else if (['dict'].includes(kind) && is_object(raw)) {
    console.log("$$$$ ~~~~~~~~ dict/object を解析し出力する")
    //= 末ノード、解析し出力

    if (raw["html"] != null) {                // html は最優先で使われる
      out_assts_ref.value += raw["html"];
    } else if (raw["svg"] != null) {
      s = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${ct.w}" height="${ct.h}" viewBox="0 0 ${ct.w} ${ct.h}">\n`;
      out_assts_ref.value += s;

      s = `<style type="text/css">\n`;
      out_assts_ref.value += s;

      // s = `.st0{fill:#7AC385;stroke:#356837;}`;   // !! Example
      // out_assts_ref.value += s;                   // !! Example

      s = `</style>\n`
      out_assts_ref.value += s;

      out_assts_ref.value += raw["svg"];   // TODO 仮コードを修正して下さい

      s = `\n</svg>\n`
      out_assts_ref.value += s;
    } else if (raw["tipjson"] != null) {
      console.log("mkAssets: unsupported raw of tipjson!");   // TODO
    } else {
      console.log("mkAssets: unknown raw: " + raw);
    }

    if (raw["css"] != null) {
      out_style_ref.value += raw["css"];
    }

  } else {
    console.log("mkAssets: unknown raw: " + raw);
  }

  //= container </div> を描画する
  if (ct != null) {
    mode = isDevModeRef.value ? "develop" : "product";
    shouldDraw = "should_draw" in ct ? ct["should_draw"][mode] : true;  // !!
    if (shouldDraw) {
      out_assts_ref.value += `</div> \n`;
    }
  }

  return out_assts_ref.value;
}


const loadDbRecList = async () => { // 2023.12.07
  if (sel_conds_ref.value == null) {
    console.log("sel_conds_ref.value is null, do nothing!");
    return;
  }

  const recordset = await sel_conds_ref.value.loadDbRecList();

  console.log(`loadDbRecList: ${JSON.stringify(recordset)}`);

  fandall_rc_ref.value = recordset;
  show_findall_ref.value = true;
}


const saveDbContent = (mod_uuid, self_only = false) => {    // 2023.12.10a + mod_uuid
  console.log("saveContent mod_uuid: " + mod_uuid + " self_only: " + self_only);

  let uuid = props.uuid;
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
    children: [] as any[],             // !!
    content: {
      jdata: JSON.stringify({
        inner: htmsvg_outer_ref.value,       // 2024.01.08s inner := htmsvg_outer_ref
      }),
      // TODO 他の html/svg 埋め込み関連データ
    }
  }


  //= children
  let child, child_pos_size;
  for (const [i, em] of items.value.entries()) {
    child = childRefs.value[em['uuid']];    // 2023.12.08

    //= 2023/11/07 child.raResizingSize から child.resizing_container_ref へ移行
    // child_pos_size = child.raResizingSize;                //  .computed ※ ↑ EditHtmlElem root ではなく、Able content の pos/size であることに注意
    //=
    child_pos_size = domPosSize(child.resizing_container_ref);  // ※ 何故か child.resizing_container_ref は ref ではなくなった（.value 不要）
    console.log(`$$$$ child_pos_size: ~~~~~~~~~~~~~~~~~~` + JSON.stringify(child_pos_size));

    if (!self_only) {
      child.saveDbContent(null, self_only);   // child 実体を DB に保存させる
    }

    item.children.push(
      {
        "com_target"  : em["com_target"],     // "EditSecText" | EditHtmlNodeTree | ...
        "com_type"    : em["com_type"],       // EditHtmlElem.vue ※ EditSvgEmbed.vue ではないことに注意
        "uuid"        : em["uuid"],           // ↑ の uuid        ※ EditSvgEmbed.vue ではないことに注意
        "pos_size"    : child_pos_size,       // { "x"  97, "y" : 427, "w" : 911, "h" : 911, "transform" : "translate(43px, 123px)" }
      }
    )
  }


  sql_save_content(item, self_only);
}


const loadDbContent = (self_only = false, recordUuid = "", useRecordUuid = false) => {   // 2024.01.01c on btnLoad DB
  //=
  //  useRecordUuid: ※ 2024.01.01c 現時点で、true で呼び出す必要な時がない（↓コメント参考）
  //    1) true  ⇒ recordUuid は props.uuid にする　※ recordUuid が "" の時は、props.uuidで DB Load するので、実際に props.uuid は変更しない
  //    2) false ⇒ 別 recordUuid のデータだけ取得し、props.uuid は変更しない ※ Memory 機能で使用している、この時、読み込んだデータの uuid を廃棄する必要がある
  //=
  const item = {
    uuid: recordUuid != "" ? recordUuid : props.uuid,   // !! key
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
  //     "id": 75,
  //     "uuid": "2fd13bdb-9340-4fcc-98b0-89b17e86cf77",
  //     "pos_size": "{\"x\": 0, \"y\": 0, \"w\": 1920, \"h\": 1080, \"transform\": \"translate(32px, 54px)\"}",
  //     "is_root": true,
  //     "children": "[{\"com_target\": \"EditSvgRect\", \"com_type\": \"edit_html_elem\", \"uuid\": \"a0b10b37-e7a2-420a-ae86-7057a2ade5a1\", \"pos_size\": {\"x\": 0, \"y\": 0, \"w\": 868, \"h\": 868, \"transform\": \"translate(137px, 123px)\"}}]",
  //     "title": "Exam Prj-01",
  //     "subtitle": "Exam Prj-01 Sub-title",
  //     "keywords": "Example Prj Develop",
  //     "groups": "Develop Prj",
  //     "parent_uuid": "root",
  //     "com_type": "edit_html_frame",
  //     "author": "Example Author",
  //     "version": "0.0.1",
  //     "variation": {
  //         "_value": "normal",
  //         "__v_isRef": true,
  //         "_rawValue": "normal",
  //         "__v_isShallow": false
  //     }
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

  updateLPanelAttrs(); // L-attr に反映

  let pos_size, dom;
  dom = able_target_ref.value;
  pos_size = JSON.parse(record['pos_size']);
  applyDomPosSize(dom, pos_size); // 自らの x y w h trans

  //= items.value <= record['children']
  //  1) record['children'] から、item を生成する
  //  2) items.value に追加する
  //  3) 1) 2) を繰り返す
  //=
  items.value = [];
  const children = JSON.parse(record['children']);
  for (var child of children) {
    makeChildItem(child, self_only);
  }
  
  console.log("  $$$$ changed items.value: " + JSON.stringify(items.value, null, 2));
}


const makeChildItem = (child: any, self_only = false) => {
  //= child
  // {
  //     "com_target": "EditSvgRect",
  //     "com_type": "edit_html_elem",
  //     "uuid": "1fedb112-3979-4ec0-ac7f-1030185e2667",
  //     "pos_size": {
  //         "x": 0,
  //         "y": 0,
  //         "w": 869,
  //         "h": 869,
  //         "transform": "translate(103px, 83px)"
  //     }
  // }
  //=
  console.log(`$$$$ makeChildItem child: JSON.stringify(child, null, 2)`);

  const pos_size = child['pos_size'];
  
  let item = null, cmd = null;

  //= cmenu + を真似し children を作成する
  for (var cm of cmenuItems.value) {
    if (cm["com_target"] == child["com_target"]) {
      cmd = cm;
      break;
    }
  }

  if (cmd != null) {
    console.log('  cmd found:' + JSON.stringify(cmd, null, 2));
    
    if (cmd["creator"] == 'createPureHtml') {
      item = createPureHtml(cmd, child["uuid"], pos_size);  // !! pos_size は transform が追加されたが、使用しないとなったため、問題なし
    } else if (cmd["creator"] == 'createSvgElem') {
      item = createSvgElem(cmd, child["uuid"], pos_size);   // !! pos_size は transform が追加されたが、使用しないとなったため、問題なし
    } else {
      console.log("  error: cmd creator not found: " + cmd["creator"]);
    }
  } else {
    console.log("  error: cmd not found: " + child["com_target"]);
  }

  if (item != null) {
    console.log('  item maked:' + JSON.stringify(item, null, 2));

    console.assert(item["com_target"] === child["com_target"], "diffent item and child com_target"); // !!
    console.assert(item["com_type"  ] === child["com_type"  ], "diffent item and child com_type"  ); // !!
    console.assert(item["uuid"      ] === child["uuid"      ], "diffent item and child uuid"      ); // !!

    items.value.push(item);

    nextTick(() => {            // !! Component instance 作成待ち
      const dom = childRefs.value[item['uuid']];  // 2023.12.08

      if (!self_only) {
        dom.loadDbContent(false, item["uuid"], false);
      } else {
        dom.configPosSize(pos_size);
      }
    })
  } 
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

  //= 2023/11/08 コメント
  //  when 親 is SvgEditor  : OK
  //  when 親 is LayoutItem : TODO
  emit('uuid_changed', record["uuid"], props.uuid);   // !!

  show_findall_ref.value = false;

  //= TODO 別 version variation 入力を提示する （2023/11/08 コメント）

  nextTick(() => {    // uuid が変わったため、instance 作り直しを待つ
    loadDbContent(false, record["uuid"], false);
  })
}


defineExpose({
  makeRawContentJson,
  makeDownloadAssets,
})


const { escape } = useMagicKeys();

watch(escape, (v) => {
  if (v) {
    // console.log('escape has been pressed');
    show_findall_ref.value = false;
  }
})


watch(selColorsRef, (val) => {  // 2023.12.16a
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == props.uuid))) {
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
    console.log("  After cur_index: " + historyRef.cur_index);
  })
}


//+ htmsvg_outer_ref が変わる度に記憶する
watch(htmsvg_outer_ref, (newVal, oldVal) => {
  //++
  //  4) 【仕様】データ記憶は、ui 操作中（actingEditRef 参照）しか行わない
  //      ⇒問題あれば、当条件を外すこと検討して下さい
  //++
  if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == props.uuid))) {  // !!
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
    if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == props.uuid))) {  // !!
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
    if (!((actingEditRef.value.com_type == props.com_type) && (actingEditRef.value.uuid == props.uuid))) {  // !!
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


onBeforeMount(() => {   // after template be compiled
  console.log(props.com_type + "::" + props.uuid + " BeforeMount!");
})

onMounted(async () => { // after DOM nodes be inserted
  await nextTick();
  console.log(props.com_type + ' ' + props.uuid + ' is mounted!');

  updateLPanelAttrs(); // 2024.01.06c L-attr に反映 
  
  console.log(`memoryEditStat: ${memoryEditStatRef.value}`);
  console.log(`memoryEdit: ${JSON.stringify(memoryEditRef.value, null, 2)}`);

  if (memoryEditStatRef.value && (memoryEditRef.value["com_type"] == props.com_type)) {  // 2024.01.01c
    const memoryUuid = memoryEditRef.value["uuid"];
    console.log(`  Load DB memoryUuid: ${memoryUuid}`);
    loadDbContent(false, memoryUuid, false);
  } else {
    console.log(`  Load DB default uuid: ${props.uuid}`);
    loadDbContent(false, props.uuid, false);
  }

  let created = createPrefixedItem();
  if (created) {
    items.value.push(prefixedItemRef.value);
  }

  // document.addEventListener('keydown', onKeyDown)

  // 疑似的にクリックイベントを発生させる
  // initialEditCmdParas(props.com_type, props.uuid, 'onMounted',
  //                                 props.x, // parent_x
  //                                 props.y, // parent_y
  //                                 0,       // x
  //                                 0);      // y

  // if (!props.is_root) {
  //   try {
  //     loadDbContent();
  //   } catch (error) {
  //     //= New の時、error は異常に示すものではない
  //     console.log("loadDbContent error: " + error);
  //   }
  // }
})


// onBeforeUpdate(() => {   // after data changed
//   //=
//   //  このフックの内部でコンポーネントの状態を変更することも安全です。
//   //=
//   console.log(props.com_type + "::" + props.uuid + " BeforeUpdate!");
// })

// onUpdated(() => {     // after re-renter and patch
//   //=
//   //  親コンポーネントの更新フックは、子コンポーネントの更新フックの後に呼び出されます。
//   //  WARNING 更新フックでコンポーネントの状態を変更しないでください - 無限更新ループになる可能性があります！
//   //=
//   console.log(props.com_type + "::" + props.uuid + " Updated!");
// })


onBeforeUnmount(() => { // after unmounted? Vue 2.x beforeDestroy
  console.log(props.com_type + ' ' + props.uuid + ' beforeUnmount!');
  // document.removeEventListener('keydown', onKeyDown);
})

onUnmounted(() => {   // after unmounted
  console.log(props.com_type + "::" + props.uuid + " Unmounted!");
})


//= Dev のみ
// https://ja.vuejs.org/guide/extras/reactivity-in-depth
//=
onRenderTracked((event) => {
  if (process.env.NODE_ENV !== 'production') { return }

  try {
    const info = {
      type: event.type,
      key: event.key,
      oldValue: event.oldValue,
      newValue: event.newValue,
      target: event.target,
    }
    console.log(props.com_type + "::" + props.uuid + " onRenderTracked: " + JSON.stringify(info));
  } catch (e) {
    console.log(props.com_type + "::" + props.uuid + " onRenderTracked: " + e);
  }
})

onRenderTriggered((event) => {
  if (process.env.NODE_ENV !== 'production') { return }
  
  try {
    const info = {
      type: event.type,
      key: event.key,
      oldValue: event.oldValue,
      newValue: event.newValue,
      target: event.target,
    }
    console.log(props.com_type + "::" + props.uuid + " onRenderTriggered: " + JSON.stringify(info));
  } catch (e) {
    console.log(props.com_type + "::" + props.uuid + " onRenderTriggered: " + e);
  }
})

</script>

<script lang="ts">
import { defineComponent } from "vue";

import { stringToRGBA } from "@daybrush/utils";

export default defineComponent({
  name: "EditHtmlFrame",
});
</script>


<style lang="scss" scoped>

// 全ての要素にborder-boxを適用させておく設定
*, *:before, *:after {
  box-sizing: border-box;
}


/* ↓ galaxy （vue component 之 ROOT DOM）だけ 効かない
      background-color: rgba(255, 0, 0, 1.0) !important; 
    下記に情報があるかも？
      【Vue.js】vue-color 透明が選択できるように #12
          https://github.com/kyoruni/til/issues/12
    ⇒ 現時点で判明した有効な対策：親の template に下記のように書く：
        <EditHtmlFrame style="background-color: rgba(0, 0, 0, 0.0) !important"
*/
.galaxy {
    position: relative;
    display: block;
    // background-color: rgba(0, 0, 0, 0) !important;                           // 2024.01.06c ↓ 動作確認できたので、コメントアウト
    background-color: v-bind("htmsvg_outer_ref.background_color") !important;   // 2024.01.06c 下記の代り: <EditHtmlFrame style="background-color: rgba(0, 0, 0, 0.0) !important"

    /* 以下 debug */
    /* outline: 4px solid rgba(255, 204, 0, 0.25); */
    /* height: 256px !important; */
}

.galaxy_size_follow {  /* 従来仕様: 親のサイズを追跡する */
  height: 100% !important;
}

.galaxy_size_just {  /* tiptop node-view 仕様: サイズは自主的決める, min-height ではないことに注意 */
  height: 256px !important;
}


.svg_events {
    pointer-events: all;
}

.html_events {
    pointer-events: auto;
} 

.client_decided {
    left: 0;
    top:  0;
    width:  100%;
    height: 100%;
    margin:  0px;
    padding: 0px;
    background-color: rgba(0, 0, 0, 0); // 2023.12.16a 一般的、透明にすることで、Editorの背景色 (earth)editor_canvas を邪魔させない　
}

.who_am_i {
    pointer-events: none;
    position: absolute;
    display: inline-block;
/* 
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
 */
    background-color: rgba(0, 0, 0, 0);
    color: gray;      // 2023.12.16a 特例
    font-size: 0.75em;
}

.test_btn {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    opacity: 0.50;
    font-size: 0.75em;
}

/* galaxy のような background-color 障害はない */
.editor_canvas { /* earth := 本体（見立） */
  position: relative;
  display: block;
  background-color: v-bind("htmsvg_outer_ref.background_color") !important;   // 2023.12.16a Editorの背景色
  color: v-bind("htmsvg_outer_ref.color") !important;                         // 2023.12.16a Editorの前景色
}

.svg_root {
  width:  v-bind(rootWidth);
  height: v-bind(rootHeight);
  background-color:rgba(0, 0, 0, 0) !important;
}

.foreign_obj_container {
  position: relative;
  left: 0;
  top:  0;
  width:  100%;
  height: 100%;
  margin:  0px;
  padding: 0px;
  background-color:rgba(0, 0, 0, 0) !important;
}

.html_xmlns {
  display: block;
  position:relative;
  background-color:rgba(0, 0, 0, 0) !important;

  /* 以下 debug */
  /* border: 1px solid rgba(0, 128, 31, 1); */
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
  background-color:rgba(0, 0, 0, 0) !important;
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
  background-color:rgba(0, 0, 0, 0) !important;
  border: solid 1px red;
}

// intent がなければ、Meta, Btn-bar, Listup が表示されない
.intent {
  position: absolute;
  background-color:rgba(0, 0, 0, 0) !important; // 2024.01.08f 裏側の EditHtmlElem が表示されない障害対策
  display: block;
  margin: 0px;
  padding: 0px;
  left: 0;
  top: 0;
}

.mini_ctrl_svg {
  pointer-events:none;
}

.mini_ctrl_border {
  pointer-events: stroke;
}

.meta-toolbar-list {
  z-index: 100000;                   // 2024.01.08b
  display:block;
  position:absolute !important;     // ← relative children が有る時表示されない障害対策 2024.01.08b
  left: 0px;
  top: 0px;
  height: fit-content;
  background-color: rgb(120, 130, 138);
}

</style>
