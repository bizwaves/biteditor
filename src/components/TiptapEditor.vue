<!-- 
  位置付け：
    EditHtmlNodeTree.vue :: const mii_content_ref = ref(' <z-math | z-diag | z-code | z-html
      TipTapEditor.vue :: addNodeView() { return VueNodeViewRenderer( NodeViewZ～ ); }  
        NodeViewZ [ CodeMirror | Memaid | MathLive | Html ].vue 
            :: miniEditorCompiled  ※ 1) 表示 2) Click to float-editor
            :: watch(fmini_stat_ref, => {
                  props.updateAttributes({ miniEditorLangSrc : floatMinieditorRef.value.src });   ※ 3a) ←
                  props.updateAttributes({ miniEditorCompiled: fmini_content_ref.value }); 
    SvgEditor.vue
      TipTapEditor.vue :: addNodeView() { return VueNodeViewRenderer( NodeViewZ～ ); }  
        Edit～ [ CodeMirror | Memaid | MathLive ].vue :: <MiniMathliveEditor
          Mini [ Mathlive, Mermaid ] Editor.vue 
              :: [ fmini_stat_ref = 'finish', floatMinieditorRef.value.src = _, fmini_content_ref.value  = _ ]  ※ 3b) ⇒
  
  参考：
    Tiptap
      https://tiptap.dev/installation/vue3?ref=morioh.com&utm_source=morioh.com
      https://github.com/ueberdosis/tiptap/blob/main/demos/src/GuideGettingStarted/VModel/Vue/Editor.vue
      https://github.com/banaoa/vue-tiptap/blob/master/src/components/Editor.vue
      https://tiptap.dev/guide/custom-extensions
      https://tiptap.dev/guide/configuration

      https://juejin.cn/post/7240833787159838775
          富文本编辑器Tiptap系列教程——5分钟认识Tiptap
      https://juejin.cn/post/7243413934765621307
          快速搭建一个简单的 Tiptap 应用


-->

<template>

  <div 
    class = "galaxy client_decided html_events"
    title = "galaxy: div, Position, Size の基準（当 Html Frame の 辺界線）" 
  >
    <!-- <div v-if = "isDevModeRef" class = "who_am_i">{{ props.com_type }} : {{ uuidRef.value }}</div> -->

    <div
      @click = "onMeClick"
      class = "tiptap_editor_canvas client_decided html_events "
      :style = "{ 'background-color': htmsvg_outer_ref.background_color, 'color': 'htmsvg_outer_ref.color' }"
      title = "earth_ref :- EditSvgText earth: div, canvas, to warp svg-root"
    >
      
      <div class = "tiptap_btn_bars" title = "Tiptap main button bar and table button-bar">

        <div v-show = "showBtnMenuBar && (!isPreviewModeRef)" class = "tool_bar" title="Tiptap Editor Tool-bar">
          <span >

            <!-- ICON 参考: https://materialdesignicons.com/ -->

            <v-menu
              open-on-hover
            >
              <template v-slot:activator="{ props }">
                <button class="tool_bar_btn" title="Add More"
                  v-bind="props"
                >
                  ＋
                </button>
              </template>
z
              <v-list>
                <v-list-item
                  v-for="(item, index) in insertMenuitems"
                  :key="index"
                >
                  <v-list-item-title>
                    <div @click="insertItemClick(item)" role="button">
                      {{ item.title }}
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>


            <button title="Bold"
              class="tool_bar_btn"
              @click="tiptap_editor.chain().focus().toggleBold().run()"
            >
              <v-icon>mdi-format-bold</v-icon>
            </button>

            <button title="Italic"
              class="tool_bar_btn"
              @click="tiptap_editor.chain().focus().toggleItalic().run()" 
            >
              <v-icon>mdi-format-italic</v-icon>
            </button>
      
            <button title="Underline"
              class="tool_bar_btn"
              @click="tiptap_editor.chain().focus().toggleUnderline().run()"
            >
              <v-icon>mdi-format-underline</v-icon>
            </button>
    

            <button title="Strike"
              class="tool_bar_btn"
              @click="tiptap_editor.chain().focus().toggleStrike().run()"
            >
              <v-icon>mdi-format-strikethrough-variant</v-icon>
            </button>


            <button title="Code"
              class="tool_bar_btn"
              @click="tiptap_editor.chain().focus().toggleCode().run()"
            >
              <v-icon>mdi-code-tags </v-icon>
            </button>

            
            <v-menu
              open-on-hover
            >
              <template v-slot:activator="{ props }">
                <button class="tool_bar_btn" title="Headings"
                  v-bind="props"
                >
                  H#
                </button>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in headingMenuitems"
                  :key="index"
                >
                  <v-list-item-title>
                    <div @click="headingItemClick(item)" role="button">
                      {{ item.title }}
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>


            <!-- TODO Font Family 動作 -->
            <v-menu
              open-on-hover
            >
              <template v-slot:activator="{ props }">
                <button class="tool_bar_btn" title="Font Family"
                  v-bind="props"
                >
                  <v-icon>mdi-format-font</v-icon>
                </button>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in fontFamilyMenuitems"
                  :key="index"
                >
                  <v-list-item-title>
                    <div @click="fontFamilyItemClick(item)" role="button">
                      {{ item.title }}
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            

            <v-menu
              open-on-hover
            >
              <template v-slot:activator="{ props }">
                <button class="tool_bar_btn vtn_text_color" title="Text Color"
                  v-bind="props"
                  @click="textColorListItemClick()"
                >
                  <v-icon>mdi-format-color-text </v-icon>
                </button>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in textColorListMenuitems"
                  :key="index"
                >
                  <v-list-item-title>
                    <div @click="textColorListItemClick(item)" role="button">
                      {{ item.title }}
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>



            <!-- TODO 動作 -->
    <!-- 
            <button title="Highlight Color"
              class="menu_bar_btn vtn_highlight_color"
              @click="editor.chain().focus().toggleBulletList().run()"
            >
              <v-icon>mdi-format-color-highlight</v-icon>
            </button>    
    -->

            <v-menu
              open-on-hover
            >
              <template v-slot:activator="{ props }">
                <button class="tool_bar_btn vtn_highlight_color" title="Highlight Color"
                  v-bind="props"
                  @click="highlightListItemClick()"
                >
                  <v-icon>mdi-format-color-highlight</v-icon>
                </button>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in highlightListMenuitems"
                  :key="index"
                >
                  <v-list-item-title>
                    <div @click="highlightListItemClick(item)" role="button">
                      {{ item.title }}
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>




            <button title="Remove Foamatting"
              class="tool_bar_btn"
              @click="clearFormatting"
            >
              <v-icon>mdi-format-clear</v-icon>
            </button>  


            <v-menu
              open-on-hover
            >
              <template v-slot:activator="{ props }">
                <button class="tool_bar_btn" title="align"
                  v-bind="props"
                >
                  <v-icon>mdi-format-align-center</v-icon>
                </button>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in alignFamilyMenuitems"
                  :key="index"
                >
                  <v-list-item-title>
                    <div @click="alignFamilyItemClick(item)" role="button">
                      {{ item.title }}
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>


            <!-- 
              TODO  
                https://github.com/siadou/tiptap-extension-indent
                  https://github.com/ueberdosis/tiptap/issues/1036
                https://github.com/evanfuture/tiptaptop-extension-indent
            -->
    <!-- 
            <button title="Increase indentation"
              class="menu_bar_btn"
              @click="editor.chain().focus().toggleBulletList().run()"
            >
              <v-icon>mdi-format-indent-increase </v-icon>
            </button>  

            <button title="Decrease indentation"
              class="menu_bar_btn"
              @click="editor.chain().focus().toggleBulletList().run()"
            >
              <v-icon>mdi-format-indent-decrease </v-icon>
            </button>  
    -->

            <!-- 
              TODO  
                https://gist.github.com/gregveres/8757756d56becc2c053c46540cb6b314
                  https://github.com/ueberdosis/tiptap/pull/1990
                I had already created gist for font-size based on the existing font-family extension
                  https://gist.github.com/gregveres/64ec1d8a733feb735b7dd4c46331abae   
            -->
    <!-- 
            <button title="Line Height"
              class="menu_bar_btn"
              @click='editor.chain().focus().setLineHeight("1.7rem").run()'
            >
              <v-icon>mdi-format-line-spacing </v-icon>
            </button>  
    -->

            <button title="Horizontal Rule"
              class="tool_bar_btn"
              @click="tiptap_editor.chain().focus().setHorizontalRule().run()"
            >
              <v-icon>mdi-minus</v-icon>
            </button>

            <!-- TODO 領域外まで表示されている -->
            <v-menu
              open-on-hover
            >
              <template v-slot:activator="{ props }">
                <button class="tool_bar_btn" title="align"
                  v-bind="props"
                >
                  <v-icon>mdi-format-list-bulleted</v-icon>
                </button>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in bulletListMenuitems"
                  :key="index"
                >
                  <v-list-item-title>
                    <div @click="bulletListItemClick(item)" role="button">
                      {{ item.title }}
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>


    <!-- 
            <button title="Ordered List"
              class="menu_bar_btn"
              @click="editor.chain().focus().toggleOrderedList().run()"
            >
              <v-icon>mdi-format-list-numbered</v-icon> 
            </button>
    -->

            <v-menu
              open-on-hover
            >
              <template v-slot:activator="{ props }">
                <button class="tool_bar_btn" title="align"
                  v-bind="props"
                >
                  <v-icon>mdi-format-list-numbered</v-icon>
                </button>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in orderedListMenuitems"
                  :key="index"
                >
                  <v-list-item-title>
                    <div @click="orderedListItemClick(item)" role="button">
                      {{ item.title }}
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>


            <v-menu
              open-on-hover
            >
              <template v-slot:activator="{ props }">
                <button class="tool_bar_btn" title="align"
                  v-bind="props"
                >
                  <v-icon>mdi-format-list-checkbox </v-icon>
                </button>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in taskListMenuitems"
                  :key="index"
                >
                  <v-list-item-title>
                    <div @click="taskdListItemClick(item)" role="button">
                      {{ item.title }}
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>


            <v-menu
              open-on-hover
            >
              <template v-slot:activator="{ props }">
                <button class="tool_bar_btn" title="align"
                  v-bind="props"
                >
                  <v-icon>mdi-format-quote-close</v-icon>
                </button>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in blockquoteListMenuitems"
                  :key="index"
                >
                  <v-list-item-title>
                    <div @click="blockquoteListItemClick(item)" role="button">
                      {{ item.title }}
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

    <!-- 
            <button title="Code Block"
              class="menu_bar_btn"
              @click="editor.chain().focus().toggleCodeBlock().run()"
            >
              <v-icon>mdi-code-braces</v-icon>
            </button>
    -->


            <v-menu
              open-on-hover
            >
              <template v-slot:activator="{ props }">
                <button class="tool_bar_btn" title="align"
                  v-bind="props"
                >
                  <v-icon>mdi-code-braces</v-icon>
                </button>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in codeBlockListMenuitems"
                  :key="index"
                >
                  <v-list-item-title>
                    <div @click="codeBlockListItemClick(item)" role="button">
                      {{ item.title }}
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>


            <v-menu
              open-on-hover
            >
              <template v-slot:activator="{ props }">
                <button class="tool_bar_btn" title="Hyperlink"
                  @mouseover="onMouseOverHyperlinkBtn"
                  v-bind="props"
                >
                  <v-icon>mdi-link</v-icon>
                </button>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in hyperlinkListMenuitems"
                  :key="index"
                >
                  <v-list-item-title>
                    <div @click="hyperlinkListItemClick(item)" role="button">
                      {{ item.title }}
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>


            <button title="Add Image"
              class="tool_bar_btn"
              @mouseover="onMouseOverImageBtn"
              @click="addImage"
            >
              <v-icon>mdi-image</v-icon>
            </button>

    <!-- 
            <button title="Add Table"
              class="menu_bar_btn"
              @click="editor.chain().focus().setHorizontalRule().run()"
            >
              <v-icon>mdi-table</v-icon>
            </button>
    -->

            <button title="Undo"
              class="tool_bar_btn"
              @click="tiptap_editor.chain().focus().undo().run()"
              :disabled="!tiptap_editor.can().undo()"
            >
              <v-icon>mdi-undo</v-icon>
            </button>

            <button title="Redo"
              class="tool_bar_btn"
              @click="tiptap_editor.chain().focus().redo().run()"
              :disabled="!tiptap_editor.can().redo()"
            >
              <v-icon>mdi-redo</v-icon>
            </button>


            <!-- TODO 
            -->
            <button v-if="false" title="Print"
              class="tool_bar_btn"
            >
              <v-icon>mdi-printer</v-icon>
            </button>

            <!-- TODO 
            -->
            <button v-if="false" title="page.view.full"
              class="tool_bar_btn"
            >
              <v-icon>mdi-overscan</v-icon>
            </button>

            <!-- TODO 
            -->
            <button v-if="false" title="page.view.page"
              class="tool_bar_btn"
            >
              <v-icon>mdi-fit-to-page-outline</v-icon>
            </button>


            <v-menu
              open-on-hover
            >
              <template v-slot:activator="{ props }">
                <button class="tool_bar_btn" title="設定"
                  @mouseover="onMouseOverHyperlinkBtn"
                  v-bind="props"
                >
                  <v-icon>mdi-toggle-switch-outline</v-icon>
                </button>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in cfgListMenuitems"
                  :key="index"
                >
                  <v-list-item-title>
                    <div @click="cfgListItemClick(item)" role="button">
                      {{ item.title }}
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
        </div>  <!-- END .menu_bar -->


        <div v-show = "showTableMenuBar" class = "menu_bar">
          <span >
            <button class="table_btn" @click="tiptap_editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
              insertTable
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().addColumnBefore().run()">
              addColumnBefore
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().addColumnAfter().run()">
              addColumnAfter
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().deleteColumn().run()">
              deleteColumn
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().addRowBefore().run()">
              addRowBefore
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().addRowAfter().run()">
              addRowAfter
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().deleteRow().run()">
              deleteRow
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().deleteTable().run()">
              deleteTable
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().mergeCells().run()">
              mergeCells
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().splitCell().run()">
              splitCell
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().toggleHeaderColumn().run()">
              toggleHeaderColumn
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().toggleHeaderRow().run()">
              toggleHeaderRow
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().toggleHeaderCell().run()">
              toggleHeaderCell
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().mergeOrSplit().run()">
              mergeOrSplit
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().setCellAttribute('colspan', 2).run()">
              setCellAttribute
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().fixTables().run()">
              fixTables
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().goToNextCell().run()">
              goToNextCell
            </button>
            <button class="table_btn" @click="tiptap_editor.chain().focus().goToPreviousCell().run()">
              goToPreviousCell
            </button>
          </span>
        </div>  <!-- END .menu_bar (table)-->
      </div>

      <div v-if="true" class = "tiptap_editor_outline" title = "Tiptap-Editor と Raw-Editor を grid-template-rows で纏める Outline">
        <div 
            class = "tiptap_content_outline client_decided html_events"
            title = "Tiptap Editor Content 領域を定義する Outline, 本出力領域なので、背景色は透過させるか定義された色を使うこと"
        >

          <!-- Tiptap editor-content  
            1) Table Borders Doesn't appear #498
              https://github.com/ueberdosis/tiptap/issues/498
              参照: App.vue style 
          -->
          <editor-content 
            ref = "tiptap_content_ref"
            v-bind:editor = "tiptap_editor" 
            class = "editor_content html_events svg_events" 
            title = "Tiptap Editor Content"
          ></editor-content>

        </div>  <!-- END .tiptap_content_outline -->

      </div>  <!-- END .editor_outline -->


      <div v-show = "showRawEditor && (!isPreviewModeRef)" 
          class="raw_editor_outline html_events svg_events"
      >
        <!-- :append-inner-icon = "raw_frame_ref.icon" -->
        <v-textarea clearable
            ref = "raw_text_ref"
            class = "raw_textarea"
            :placeholder = 'raw_frame_ref.placeholder'
            :label = "raw_frame_ref.label"            
            v-model = "modelValue"
        >
        </v-textarea>
      </div> <!-- END .raw_editor_outline -->


      <div v-if="showPicker" class="colorPickerframe">
        <v-color-picker
          v-model="pickedColor"
          show-swatches
        ></v-color-picker>

        <v-btn color="info" class="color_picker_btn"
          @click="colorPickerClicked"
        >
          適用
        </v-btn>

        <v-btn color="white" class="color_picker_btn"
          @click="colorPickerCancel"
        >
          中止
        </v-btn>
      </div>

    </div>  <!-- END .editor_container -->
  </div>  <!-- END .galaxy -->
</template>


<script setup lang="ts">

import { ref, watch, inject, nextTick, onMounted, onBeforeUnmount, computed } from "vue";

import { v4 as uuidv4 } from "uuid";

// import { Plugin, PluginKey } from '@tiptap/pm/state'
import {
  mergeAttributes,
  Node                                    // Node as Node ? https://discuss.prosemirror.net/t/update-node-attributes/4717
} from '@tiptap/core'

import {                                  // Vue 対応版
  Editor, EditorContent,                          // ↑と違う？
  VueNodeViewRenderer
} from '@tiptap/vue-3'                    // 参考: '@tiptap/vue-2'

//= Accessing ProseMirror internals, 要 npm i @tiptap/pm
//    https://tiptap.dev/guide/prosemirror
// @tiptap/pm/changeset
// @tiptap/pm/collab
// @tiptap/pm/commands
// @tiptap/pm/dropcursor
// @tiptap/pm/gapcursor
// @tiptap/pm/history
// @tiptap/pm/inputrules
// @tiptap/pm/keymap
// @tiptap/pm/markdown
// @tiptap/pm/menu
// @tiptap/pm/model
// @tiptap/pm/schema - basic
// @tiptap/pm/schema - list
import { EditorState } from '@tiptap/pm/state'
// @tiptap/pm/tables
// @tiptap/pm/trailing - node
// @tiptap/pm/transform
// @tiptap/pm/view

//= extensions, 要 
import StarterKit from '@tiptap/starter-kit'                      // The StarterKit extension loads the most common extensions
import UniqueID from '@tiptap-pro/extension-unique-id'
import Document from '@tiptap/extension-document'
import Focus from '@tiptap/extension-focus'
// import History from '@tiptap/extension-history'
import Link from '@tiptap/extension-link'
import Gapcursor from '@tiptap/extension-gapcursor'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@/extensions/paragraph';
import Text from '@tiptap/extension-text'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';

import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';

import { EventHandler } from '@/extensions/md';

import InvisibleCharacters from '@tiptap-pro/extension-invisible-characters';
import { Mathematics } from '@tiptap-pro/extension-mathematics';
import 'katex/dist/katex.min.css';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';

//= src/extensions/*.ts
import LineHeight from '@/extensions/LineHeight';
// import Diff from '@/extensions/diff';


import NodeViewZHtml from './NodeViewZHtml.vue'              // Html
import NodeViewZCodeMirror from './NodeViewZCodeMirror.vue'  // CodeMirror
import NodeViewZMermaid from './NodeViewZMermaid.vue'        // Mermaid
import NodeViewZMathLive from './NodeViewZMathLive.vue'      // MathLive

// import TiptapNodeView from './TiptapNodeView.vue'

import { viewDepthKey } from "vue-router";


const vueExtProps : any = inject('vueExtProps');

const fmini_content_ref: any = inject('fmini_content_ref');
const fmini_stat_ref: any = inject('fmini_stat_ref');

const floatMinieditorRef: any = inject('floatMinieditorRef');
const startupFloatMinieditor: any = inject('startupFloatMinieditor');
const testFloatMinieditor: any = inject('testFloatMinieditor');
const showFloatMinieditor: any = inject('showFloatMinieditor');
const hideFloatMinieditor: any = inject('hideFloatMinieditor');
const cancelFloatMinieditor: any = inject('cancelFloatMinieditor');
const finishFloatMinieditor: any = inject('finishFloatMinieditor');

const isDevModeRef = inject('isDevModeRef');
const isPreviewModeRef = inject('isPreviewModeRef');

const actingEditRef = inject('actingEditRef');        // 2023.11.10
const actingEditEventRef = inject('actingEditEventRef');   // 2023.11.10
const colorPickerRef = inject('colorPickerRef');       // 2023.11.10

const genInId    = inject('genInId');       // 入力待ち状態の表示が予想されている
const genInDataA = inject('genInDataA');    // 提示情報の表示が予想されている
const genInHintS = inject('genInHintS');    // 
const genInHintA = inject('genInHintA');    //
const genInDataB = inject('genInDataB');
const genInHintB = inject('genInHintB');    //
const genInDataC = inject('genInDataC');
const genInHintC = inject('genInHintC');    //
const updateGenInDataA = inject('updateGenInDataA');

const showBtnMenuBar = ref(true);           // 2024.01.04a 保留、現状は常に true
const showTableMenuBar = ref(false);
const showRawEditor = ref(true);            // 2024.01.04a Tool-bar で RawEditor を表示するか否か切り替え可

const raw_frame_ref = ref({
  label: `Plain Text Editor`,
  placeholder: "Write text",
  icon: "$vuetify",
});


const tipEditorUuid = uuidv4();
console.log("$$$$$ tipEditorUuid: " + tipEditorUuid);

const props = defineProps({
  com_type: {
    // edit_svg | edit_html | ..
    type: String,
    default: "tiptap_editor",
  },

  // uuid: { // このコンポーネントの uuid, Save, Load Etc
  //   type: String,
  //   required: true,
  // },

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
})

console.log("@@@@@@@@ props: " + JSON.stringify(props));

//=  2023.11.18 familyIdRef
const familyIdRef = defineModel<any>("familyIdRef", { local: true, default: null });
// const uuidRef = computed(() => { return `${props.com_type}.${familyIdRef.value}`; });   // 2023.12.10 旧仕様
const uuidRef = computed(() => { return `${familyIdRef.value}`; });   // 2023.12.10 お試し
console.log("######## uuidRef value: " + uuidRef.value);

const htmsvg_outer_ref = defineModel<any>("htmsvg_outer_ref", { local: true, default: null });  // 2024.01.04a 親 EditHtmNodeTree.vue の colors にアクセスするため


watch(familyIdRef, (v) => {
  if (v) {
    // console.log(`familyIdRef changed to ${familyIdRef.value}`);
    // console.log(`    uuidRef.value: ${uuidRef.value}`);

    // check actingEditRef is not defined
    if (actingEditRef == null) {
      console.log(`    actingEditRef is null`);
      return;
    }

    if (actingEditRef.value == null) {
      console.log(`    actingEditRef.value is null`);
      return;
    }

    actingEditRef.value.uuid = uuidRef.value;
  }
})


vueExtProps['tipeditor_' + tipEditorUuid] = {   // extension node-view .vue children の props
  parent_uuid        : uuidRef.value,
  editing_uuid       : props.editing_uuid,
  editing_id         : props.editing_id,
  being_edit_id      : props.being_edit_id,
};


const emit = defineEmits([
  'update:modelValue',
])


//= ↓↓↓↓↓↓↓↓　BEGIN Custom-Node z-html ↓↓↓↓↓↓↓↓
//  Interactive node views
//    https://tiptap.dev/guide/node-views
//  https://tiptap.dev/guide/custom-extensions#create-a-node
//    例: <z-html count="0"> <p> SLOT OF Z-HTML </p> </z-html>
//  【要】new Editor ({ extensions: [ Html.configure({ ...
//=
const ZHtml = Node.create({
  name: 'zHtml',              // 

  group: 'block',

  content: 'inline*',

  atom: true,

  //= Options
  //  1) 插件内部常量, renderHtml と parseHTML の動作を決める
  //      例: Heading.extend levels: [1, 2, 3]
  //  2) コンテンツとして出力される物ではない
  addOptions() {
    return {
      'exam_option': {
        default: 'this is the example option',
      },
    }
  },


  //= Attributes
  //   コンテンツ出力（例）: 
  //    <z-html data-type="my-z-html-node">
  addAttributes() {
    return {
      count: {
        default: 0,
      },
      'data-type': {
        default: 'my-z-html-node',
      }
    }
  },


//= Parse HTML
//  The same applies to restoring the content. You can configure what markup you expect, 
//  that can be something completely unrelated to the node view markup. 
//  It just needs to contain all the information you want to restore.
//  Attributes are automagically restored, if you registered them through addAttributes.
  parseHTML() {
    return [
      {
        tag: 'z-html',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(HTMLAttributes);
    return [      // 例: ['pre', ['code', HTMLAttributes, 0]]
      'z-html',   // the name of HTML tag, 例: 'my-custom-node'.
                  //      If you just need something generic markup like a <div>,
                  //      consider to add a data-type="my-custom-node".
      attrs,      // If the second element is an object, it’s interpreted as a set of attributes.
      0           // Any elements after that are rendered as children.
                  // The number zero (representing a hole) is used to indicate where the content should be inserted.
    ]
  },

  //= Render JavaScript/Vue/React
  //  Node views with Vue
  //    https://tiptap.dev/guide/node-views/vue
  //  備考:
  //    But what if you want to render your actual JavaScript/Vue/React code? Consider using Tiptap to render your output. 
  //    Just set the editor to 
  //        editable: false 
  //    and no one will notice you’re using an editor to render the content. :-)
  addNodeView() {                         // Register it with addNodeView()
    //= 
    //  VueNodeViewRenderer は passes a few very helpful props to your custom Vue component. One of them is the node prop
    //
    //=
    const view = VueNodeViewRenderer(     // Pass ↓ component to the provided VueNodeViewRenderer
      NodeViewZHtml                       // Create a Vue component
    );
    return view
  },
})
//= ↑↑↑↑↑↑↑↑　END Custom-Node z-html ↑↑↑↑↑↑↑↑



//= ↓↓↓↓↓↓↓↓　BEGIN Custom-Node z-code ↓↓↓↓↓↓↓↓
//  Interactive node views
//    https://tiptap.dev/guide/node-views
//  https://tiptap.dev/guide/custom-extensions#create-a-node
//    例: <z-html count="0"> <p> SLOT OF Z-HTML </p> </z-html>
//  【要】new Editor ({ extensions: [ Html.configure({ ...
//  https://tiptap.dev/api/schema
//    Content Marks ...
//=
const ZCode = Node.create({
  name: 'zCode',
  group: 'block',     // add to 'block' group
                      // Add this node to a group of extensions: 'block', 'inline', 'block list', ...
  content: 'text*',   // must not have anything else than 'text'
                      // defines exactly what kind of content the node can have.: 'block+', 'inline*',  'text*', '(paragraph|list?)+', 'heading block+', ...
  marks: '',          // disallows all marks
                      // define which marks are allowed inside of a node: 'bold italic', allows all '_', '', ...
  inline: false,      // be rendered inline: nodes are rendered in line with the text. That’s the case for mentions.
  atom: true,         // Nodes with atom: true aren’t directly editable and should be treated as a single unit
  selectable: false,  // Besides the already visible text selection, there is an invisible node selection
  draggable: false,   // to be draggable (by default they aren’t)
  code: true,         // For all kind of nodes containing code
  whitespace: 'pre',  // Controls way whitespace in this a node is parsed.
  defining: true,     // If a node should be kept for such replace operations
  isolating: true,    // For nodes that should fence the cursor for regular editing operations like backspacing, for example a TableCell, set isolating: true.
  allowGapCursor: true,  // The Gapcursor extension registers a new schema attribute to control if gap cursors are allowed everywhere in that node.
  // tableRole: 'cell',    // Allowed values are table, row, cell, and header_cell
  
  //= Options
  //  1) 插件内部常量, renderHtml と parseHTML の動作を決める
  //      例: Heading.extend levels: [1, 2, 3]
  //  2) コンテンツとして出力される物ではない
  addOptions() {
    console.log("$$$$ Node addOptions");
    return {
      'exam_option': {
        default: 'this is the example option',
      },
    }
  },


  //= Attributes
  //   コンテンツ出力（例）: 
  //    <z-html data-type="my-z-html-node">
  addAttributes() {
    console.log("$$$$ Node addAttributes");
    return {
      // mini-editor Raw 入力データ, mini-editor (例: mermaid) はそれを受け取り／入力・修正させ、
      // HTML（左記の例では svg データ）を生成し、Tiptop のレンダリング関数に与える 
      miniEditorLangSrc: {
        type: String,
        default: "const foo = 0",
      },
      miniEditorCompiled: {
        type: String,
        default: "const foo = 0;",
      },
      'data-type': {
        type: String,
        default: 'my-z-code-node',
      }
    }
  },

  parseHTML() {
    console.log("$$$$ Node parseHTML");
    return [
      {
        tag: 'z-code',
      },
    ]
  },


  //= renderHTML
  //  The renderHtmlfunction is called when you run editor.getHTML()
  //  click ⇒ float mini-editor
  renderHTML({ HTMLAttributes }) {
    console.log("$$$$ Node renderHTML");
    const attrs = mergeAttributes(HTMLAttributes);  // mergeAttributes is a exported function from @tiptap/core
    //= 例: ['pre', ['code', HTMLAttributes, 0]]
    // return [            
    //   'z-code',         // the name of HTML tag, 例: 'my-custom-node'.
    //                     //      If you just need something generic markup like a <div>,
    //                     //      consider to add a data-type="my-custom-node".
    //   attrs,            // If the second element is an object, it’s interpreted as a set of attributes.
    //   0                 // Any elements after that are rendered as children.
    //                     // The number zero (representing a hole) is used to indicate where the content should be inserted.
    // ]
    //=
    // console.log('$$$$ attrs: ' + JSON.stringify(attrs));

    //= Is it possible to have a complete custom renderHTML function in TipTap?
    // 
    return [
      'z-code',
      attrs,
      [
        'code',
        attrs["miniEditorLangSrc"],
      ]
    ]
  },


  addNodeView() {
    //=
    //  VueNodeViewRenderer は passes a few very helpful props to your custom Vue component. One of them is the node prop
    //     https://stackoverflow.com/questions/74549035/is-it-possible-to-have-a-complete-custom-renderhtml-function-in-tiptap
    //=
    console.log("$$$$ Node addNodeView");
    const view = VueNodeViewRenderer(     // Pass ↓ component to the provided VueNodeViewRenderer
      NodeViewZCodeMirror                 // Create a Vue component
    );
    return view
  },


  // //= 参考 Commands
  // addCommands() {
  //   console.log("$$$$ Node addCommands");
  //   return {

  //     updateMiniEdLangSrc: (source: string) => ({ commands }) => {
  //       console.log("    Node updateMiniEdLangSrc");
  //       return commands.updateAttributes("miniEditorLangSrc", source)
  //     },     

  //     //= 参考
  //     // insertMentionItem: (options) => ({ chain, commands }) => {
  //     //   return commands.insertContent({
  //     //     type: this.name,
  //     //     attrs: options
  //     //   })
  //     // },

  //     // updateCodemirrorAttribute: (options) => ({ tr, commands }) => {
  //     //   return commands.insertContent({
  //     //     type: this.name,
  //     //     attrs: {
  //     //       ...tr.selection.node.attrs,
  //     //       ...options
  //     //     }
  //     //   })
  //     // },

  //   }
  // }, 

})
//= ↑↑↑↑↑↑↑↑　END Custom-Node z-code ↑↑↑↑↑↑↑↑



//= ↓↓↓↓↓↓↓↓　BEGIN Custom-Node z-diag ↓↓↓↓↓↓↓↓
//  Interactive node views
//    https://tiptap.dev/guide/node-views
//  https://tiptap.dev/guide/custom-extensions#create-a-node
//    例: <z-html count="0"> <p> SLOT OF Z-HTML </p> </z-html>
//  【要】new Editor ({ extensions: [ Html.configure({ ...
//  https://tiptap.dev/api/schema
//    Content Marks ...
//=
const ZDiag = Node.create({
  name: 'zDiag',
  group: 'block',     // add to 'block' group
                      // Add this node to a group of extensions: 'block', 'inline', 'block list', ...
  content: 'text*',   // must not have anything else than 'text'
                      // defines exactly what kind of content the node can have.: 'block+', 'inline*',  'text*', '(paragraph|list?)+', 'heading block+', ...
  marks: '',          // disallows all marks
                      // define which marks are allowed inside of a node: 'bold italic', allows all '_', '', ...
  inline: false,      // be rendered inline: nodes are rendered in line with the text. That’s the case for mentions.
  atom: true,         // Nodes with atom: true aren’t directly editable and should be treated as a single unit
  selectable: false,  // Besides the already visible text selection, there is an invisible node selection
  draggable: false,   // to be draggable (by default they aren’t)
  code: true,         // For all kind of nodes containing code
  whitespace: 'pre',  // Controls way whitespace in this a node is parsed.
  defining: true,     // If a node should be kept for such replace operations
  isolating: true,    // For nodes that should fence the cursor for regular editing operations like backspacing, for example a TableCell, set isolating: true.
  allowGapCursor: true,  // The Gapcursor extension registers a new schema attribute to control if gap cursors are allowed everywhere in that node.
  // tableRole: 'cell',    // Allowed values are table, row, cell, and header_cell

  //= Options
  //  1) 插件内部常量, renderHtml と parseHTML の動作を決める
  //      例: Heading.extend levels: [1, 2, 3]
  //  2) コンテンツとして出力される物ではない
  addOptions() {
    console.log("$$$$ Node addOptions");
    return {
      'exam_option': {
        default: 'this is the example option',
      },
    }
  },


  //= Attributes
  //   コンテンツ出力（例）: 
  //    <z-html data-type="my-z-html-node">
  addAttributes() {
    console.log("$$$$ Node addAttributes");
    return {
      // mini-editor Raw 入力データ, mini-editor (例: mermaid) はそれを受け取り／入力・修正させ、
      // HTML（左記の例では svg データ）を生成し、Tiptop のレンダリング関数に与える 
      miniEditorLangSrc: {
        type: String,
        default: "",
      },
      miniEditorCompiled: {
        type: String,
        default: "",
      },
      'data-type': {
        default: 'my-z-diag-node',
      }
    }
  },

  parseHTML() {
    console.log("$$$$ Node parseHTML");
    return [
      {
        tag: 'z-diag',
      },
    ]
  },

  //= renderHTML
  //  The renderHtmlfunction is called when you run editor.getHTML()
  //  TODO click ⇒ float mini-editor
  renderHTML({ HTMLAttributes }) {
    console.log("$$$$ Node renderHTML");
    const attrs = mergeAttributes(HTMLAttributes);
    //= 例: ['pre', ['code', HTMLAttributes, 0]]
    // return [            
    //   'z-code',         // the name of HTML tag, 例: 'my-custom-node'.
    //                     //      If you just need something generic markup like a <div>,
    //                     //      consider to add a data-type="my-custom-node".
    //   attrs,            // If the second element is an object, it’s interpreted as a set of attributes.
    //   0                 // Any elements after that are rendered as children.
    //                     // The number zero (representing a hole) is used to indicate where the content should be inserted.
    // ]
    //=
    // console.log('$$$$ attrs: ' + JSON.stringify(attrs));

    //= Is it possible to have a complete custom renderHTML function in TipTap?
    // 
    return [
      'z-diag',
      attrs,
      [
        'div',  // TODO svg?
        attrs["miniEditorLangSrc"],
      ]
    ]
  },

  addNodeView() {
    //=
    //  VueNodeViewRenderer は passes a few very helpful props to your custom Vue component. One of them is the node prop
    //     https://stackoverflow.com/questions/74549035/is-it-possible-to-have-a-complete-custom-renderhtml-function-in-tiptap
    //=
    console.log("$$$$ Node addNodeView");
    const view = VueNodeViewRenderer(     // Pass ↓ component to the provided VueNodeViewRenderer
      NodeViewZMermaid                 // Create a Vue component
    );
    return view
  },

  // //= 参考 Commands
  // addCommands() {
  //   console.log("$$$$ Node addCommands");
  //   return {

  //     updateMiniEdLangSrc: (source: string) => ({ commands }) => {
  //       console.log("    Node updateMiniEdLangSrc");
  //       return commands.updateAttributes("miniEditorLangSrc", source)
  //     },     

  //     //= 参考
  //     // insertMentionItem: (options) => ({ chain, commands }) => {
  //     //   return commands.insertContent({
  //     //     type: this.name,
  //     //     attrs: options
  //     //   })
  //     // },

  //     // updateCodemirrorAttribute: (options) => ({ tr, commands }) => {
  //     //   return commands.insertContent({
  //     //     type: this.name,
  //     //     attrs: {
  //     //       ...tr.selection.node.attrs,
  //     //       ...options
  //     //     }
  //     //   })
  //     // },

  //   }
  // }, 

})
//= ↑↑↑↑↑↑↑↑　END Custom-Node z-diag ↑↑↑↑↑↑↑↑



//= ↓↓↓↓↓↓↓↓　BEGIN Custom-Node z-math ↓↓↓↓↓↓↓↓
//  Interactive node views
//    https://tiptap.dev/guide/node-views
//  https://tiptap.dev/guide/custom-extensions#create-a-node
//    例: <z-html count="0"> <p> SLOT OF Z-HTML </p> </z-html>
//  【要】new Editor ({ extensions: [ Html.configure({ ...
//  https://tiptap.dev/api/schema
//    Content Marks ...
//=
const ZMath = Node.create({
  name: 'zMath',
  group: 'block',     // add to 'block' group
                      // Add this node to a group of extensions: 'block', 'inline', 'block list', ...
  content: 'text*',   // must not have anything else than 'text'
                      // defines exactly what kind of content the node can have.: 'block+', 'inline*',  'text*', '(paragraph|list?)+', 'heading block+', ...
  marks: '',          // disallows all marks
                      // define which marks are allowed inside of a node: 'bold italic', allows all '_', '', ...
  inline: false,      // be rendered inline: nodes are rendered in line with the text. That’s the case for mentions.
  atom: true,         // Nodes with atom: true aren’t directly editable and should be treated as a single unit
  selectable: false,  // Besides the already visible text selection, there is an invisible node selection
  draggable: false,   // to be draggable (by default they aren’t)
  code: true,         // For all kind of nodes containing code
  whitespace: 'pre',  // Controls way whitespace in this a node is parsed.
  defining: true,     // If a node should be kept for such replace operations
  isolating: true,    // For nodes that should fence the cursor for regular editing operations like backspacing, for example a TableCell, set isolating: true.
  allowGapCursor: true,  // The Gapcursor extension registers a new schema attribute to control if gap cursors are allowed everywhere in that node.
  // tableRole: 'cell',    // Allowed values are table, row, cell, and header_cell

  //= Options
  //  1) 插件内部常量, renderHtml と parseHTML の動作を決める
  //      例: Heading.extend levels: [1, 2, 3]
  //  2) コンテンツとして出力される物ではない
  addOptions() {
    console.log("$$$$ Node addOptions");
    return {
      'exam_option': {
        default: 'this is the example option',
      },
    }
  },


  //= Attributes
  //   コンテンツ出力（例）: 
  //    <z-html data-type="my-z-html-node">
  addAttributes() {
    console.log("$$$$ Node addAttributes");
    return {
      // mini-editor Raw 入力データ, mini-editor (例: mermaid) はそれを受け取り／入力・修正させ、
      // HTML（左記の例では svg データ）を生成し、Tiptop のレンダリング関数に与える 
      miniEditorLangSrc: {
        type: String,
        default: "const foo = 0",
      },
      miniEditorCompiled: {
        type: String,
        default: "const foo = 0;",
      },
      'data-type': {
        default: 'my-z-math-node',
      }
    }
  },

  parseHTML() {
    console.log("$$$$ Node parseHTML");
    return [
      {
        tag: 'z-math',
      },
    ]
  },


  //= renderHTML
  //  The renderHtmlfunction is called when you run editor.getHTML()
  //  click ⇒ float mini-editor
  renderHTML({ HTMLAttributes }) {
    console.log("$$$$ Node renderHTML");
    const attrs = mergeAttributes(HTMLAttributes);  // mergeAttributes is a exported function from @tiptap/core
    //= 例: ['pre', ['code', HTMLAttributes, 0]]
    // return [            
    //   'z-code',         // the name of HTML tag, 例: 'my-custom-node'.
    //                     //      If you just need something generic markup like a <div>,
    //                     //      consider to add a data-type="my-custom-node".
    //   attrs,            // If the second element is an object, it’s interpreted as a set of attributes.
    //   0                 // Any elements after that are rendered as children.
    //                     // The number zero (representing a hole) is used to indicate where the content should be inserted.
    // ]
    //=
    // console.log('$$$$ attrs: ' + JSON.stringify(attrs));

    //= Is it possible to have a complete custom renderHTML function in TipTap?
    // 
    return [
      'z-math',
      attrs,
      [
        'div',  // TODO 仮 div
        attrs["miniEditorLangSrc"],
      ]
    ]
  },


  addNodeView() {
    //=
    //  VueNodeViewRenderer は passes a few very helpful props to your custom Vue component. One of them is the node prop
    //     https://stackoverflow.com/questions/74549035/is-it-possible-to-have-a-complete-custom-renderhtml-function-in-tiptap
    //=
    console.log("$$$$ Node addNodeView");
    const view = VueNodeViewRenderer(     // Pass ↓ component to the provided VueNodeViewRenderer
      NodeViewZMathLive                   // Create a Vue component
    );
    return view
  },

  // //= 参考 Commands
  // addCommands() {
  //   console.log("$$$$ Node addCommands");
  //   return {

  //     updateMiniEdLangSrc: (source: string) => ({ commands }) => {
  //       console.log("    Node updateMiniEdLangSrc");
  //       return commands.updateAttributes("miniEditorLangSrc", source)
  //     },     

  //     //= 参考
  //     // insertMentionItem: (options) => ({ chain, commands }) => {
  //     //   return commands.insertContent({
  //     //     type: this.name,
  //     //     attrs: options
  //     //   })
  //     // },

  //     // updateCodemirrorAttribute: (options) => ({ tr, commands }) => {
  //     //   return commands.insertContent({
  //     //     type: this.name,
  //     //     attrs: {
  //     //       ...tr.selection.node.attrs,
  //     //       ...options
  //     //     }
  //     //   })
  //     // },

  //   }
  // }, 

})
//= ↑↑↑↑↑↑↑↑　END Custom-Node z-math ↑↑↑↑↑↑↑↑


let mini_editing_node = null;
const editorClicked = (view, pos, node) => {
  console.log('$$$$ handleClickOn --------------------------------------------');
  console.log('  view: ', view);                  // view:  EditorView {_root: document, focused: true, trackWrites: div.mini_editor_outline, mounted: false, markCursor: null, …}
  console.log('  pos:  ', pos);                   // pos:   36
  console.log('  node: ', JSON.stringify(node));  // node:  {"type":"zCode","attrs":{"miniEditorLangSrc":"const foo = 0","data-type":"my-z-code-node"},"content":[{"type":"text","text":"const foo = 0"}]}

  // // TODO node type 限定
  // mini_editing_node = node;
  // fmini_content_ref.value = node["content"]["text"];
  // startupFloatMinieditor(node["type"]["name"], node["attrs"]["data-type"], node["attrs"]["miniEditorLangSrc"])
}


const modelValue = defineModel<string>({ local: true, default: '' });

const able_target_ref = defineModel<any>("able_target_ref", { local: true, default: null });  // the Moveable Target
const able_actmd_ref = defineModel<any>("able_actmd_ref", { local: true, default: null });  // 動作モード of the Moveable
const able_macro_ref = defineModel<any>("able_macro_ref", { local: true, default: null });  // in_ | out_ | io_, データ I/F of the Moveable

const tiptap_content_ref = ref(null);                         // DOM

const tiptap_editor = new Editor({                            // Tiptap Editor ノ instance
  // element: (document.querySelector('.element') as any),    // ↑vue 版では不要？

  editorProps: {
    handleClickOn: editorClicked,
  },
  
  extensions: [                                               // load the Document, Paragraph and Text extensions
    // Register your custom node with the editor.

    ZHtml.configure({
      'editor_uid' : tipEditorUuid,
    }),
    ZCode.configure({
      'editor_uid': tipEditorUuid,
    }),
    ZDiag.configure({
      'editor_uid': tipEditorUuid,
    }),
    ZMath.configure({
      'editor_uid': tipEditorUuid,
    }),

    // LineHeight.configure({
    //   heights: ['1.5rem', '1.8rem', '2rem']
    // }),

    // … and don’t forget all other extensions.
    StarterKit.configure({                                  // The StarterKit extension loads the most common extensions
      // history: false,                                    // Don’t want to load a specific extension (例: history) from the StarterKit
      heading : {
        levels: [1, 2, 3, 4, 5],
      },
    }),                                                     // ↓ to load additional extensions or add a custom extension
    Document,
    Paragraph,
    Text,
    TextStyle,
    FontFamily,
    Color,
    Highlight.configure({ multicolor: true }),
    // History,
    // Code,
    Link.configure({
      openOnClick: false,
    }),
    Image,
    Dropcursor,
    ListItem,
    Heading,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Strike,
    Underline,
    HorizontalRule.configure({
      HTMLAttributes: {
        class: 'my-custom-class',
      },
    }),
    BulletList.configure({
      HTMLAttributes: {
        class: 'my-custom-class',
      },
      // keepMarks: true,
      // keepAttributes: true,
    }),
    OrderedList,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Blockquote,
    CodeBlock,
    Gapcursor,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    UniqueID.configure({
      attributeName: 'uid',                                   // Name of the attribute that is attached to the HTML tag (will be prefixed with data-), Default: 'id'
      types: [                                                // All types that should get a unique ID, Default: []
        'heading', 'paragraph'
      ],                                                      // A function that generates and returns a unique ID, Default: () => uuidv4()
    }),
    Typography,                                               // https://tiptap.dev/api/extensions/typography
    Mathematics,                                              //    mathematics
    InvisibleCharacters,                                      //    invisible-characters
    Placeholder.configure({                                   //    placeholder
      // Use a placeholder:
      placeholder: 'Write something …',
      // Use different placeholders depending on the node type:
      // placeholder: ({ node }) => {
      //   if (node.type.name === 'heading') {
      //     return 'What’s the title?'
      //   }

      //   return 'Can you add some further context?'
      // },
    }),
    Focus.configure({
      className: 'has-focus',
      mode: 'all',
    }),
    Dropcursor,
  ],      

  content: modelValue.value,                                  // set the initial content

  autofocus: false,                                           // !! place the cursor in the editor after initialization
  editable:  true,                                            // !! make the text editable (but that’s the default anyway)
  injectCSS: false,                                           // disable the loading of the default CSS (which is not much anyway)

  onUpdate: () => {
    // HTML
    emit('update:modelValue', tiptap_editor.getHTML())
    // JSON
    // this.$emit('update:modelValue', this.editor.getJSON())
  },
});


watch(modelValue, (value) => {
  //= 2023.11.26 メモ
  //  TODO 失敗時 TiptapEditor.modelValue の Recovery
  //    ⇒ 単純に History を追加する方が良いと思われます
  //=
  console.log("######################################## watch modelValue, value:\n");
  console.log(value);

  // HTML
  const isSame = (tiptap_editor.getHTML() === value);

  // JSON
  // const isSame = JSON.stringify(editor.getJSON()) === JSON.stringify(value)

  if (isSame) {
    console.log("is same, do nothing");
    return
  }

  console.log("set content to editor");
  tiptap_editor.commands.setContent(value, false);
});



const insertMenuitems = [
  { title: 'Add Code',    name: 'z-code' },
  { title: 'Add Math',    name: 'z-math' },
  { title: 'Add Diagram', name: 'z-diag' }
]

const insertItemClick = (item) => {
  console.log("$$$$ insertItemClick: " + item.name);
  switch (item.name) {
    case 'z-code':  // 2023.11.26 TODO 前後 <p></p> がない時エラーかどうか確認待ち
      // editor.commands.insertContent('<z-code data-type="my-z-code-node" miniEditorLangSrc="const foo = 0" miniEditorCompiled="const foo = 0"  ></z-code>');
      tiptap_editor.commands.insertContent('<p></p> <z-code data-type="my-z-code-node" miniEditorLangSrc="const foo = 0" miniEditorCompiled="const foo = 0"  ></z-code> <p></p>');
      break;
    case 'z-math':  // 2023.11.26 メモ　前後 <p></p> がなければエラー
      tiptap_editor.commands.insertContent('<p></p> <z-math data-type="my-z-math-node"  miniEditorLangSrc=""  miniEditorCompiled="" ></z-math> <p></p>');
      break;
    case 'z-diag':  // 2023.11.26 メモ　前後 <p></p> がなければエラー
      tiptap_editor.commands.insertContent('<p></p> <z-diag data-type="my-z-diag-node"  miniEditorLangSrc=""  miniEditorCompiled="" ></z-diag> <p></p>');
      break;
  }
}

const fontFamilyMenuitems = [
  { title: 'Inter',           font: 'Inter' },                      // :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'Inter' }) }">
  { title: 'Comic Sans',      font: 'Comic Sans MS, Comic Sans' },  // :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'Comic Sans MS, Comic Sans' }) }">
  { title: 'serif',           font: 'serif' },                      // :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'serif' }) }">
  { title: 'monospace',       font: 'monospace' },                  // :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'monospace' }) }">
  { title: 'cursive',         font: 'cursive' },                    // :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'cursive' }) }">
  { title: 'unsetFontFamily', font: 'unset' },                      // 

]

const fontFamilyItemClick = (item) => {
  console.log("$$$$ fontFamilyItemClick: " + item.title);
  if (item.font === 'unset') {
    tiptap_editor.chain().focus().unsetFontFamily().run();
  } else {
    tiptap_editor.chain().focus().setFontFamily(item.font).run();
  }
}


const headingMenuitems = [
  { title: 'H1 Heading 1', level: 1 },
  { title: 'H2 Heading 2', level: 2 },
  { title: 'H3 Heading 3', level: 3 },
  { title: 'H4 Heading 4', level: 4 },
  { title: 'H5 Heading 5', level: 5 },
]

const headingItemClick = (item) => {
  console.log("$$$$ headingItemClick: " + item.level);
  tiptap_editor.chain().focus().toggleHeading({ level: item.level }).run();  // !! paragraph
}

const alignFamilyMenuitems = [  // TODO button with icon
  { title: 'Left align',    name: "left" },
  { title: 'Center align',  name: "center" },
  { title: 'Right align',   name: "right" },
  { title: 'Justify align', name: "justify" },
  { title: 'unset align',   name: "unset" },
]

const alignFamilyItemClick = (item) => {
  console.log("$$$$ alignFamilyItemClick: " + item.name);
  if (item.name === "unset") {
     tiptap_editor.chain().focus().unsetTextAlign().run();  // !! ['heading', 'paragraph'].
  } else {
    tiptap_editor.chain().focus().setTextAlign(item.name).run();  // !! ['heading', 'paragraph'].
  }
}


const bulletListMenuitems = [  // TODO button with icon
  { title: 'toggleBulletList',  name: "toggle" },   // :class="{ 'is-active': editor.isActive('bulletList') }"
  { title: 'splitListItem',     name: "split"  },   // :disabled="!editor.can().splitListItem('listItem')"
  { title: 'sinkListItem',      name: "sink"   },   // :disabled="!editor.can().sinkListItem('listItem')"
  { title: 'liftListItem',      name: "lift"   },   // :disabled="!editor.can().liftListItem('listItem')"
]

const bulletListItemClick = (item) => {
  console.log("$$$$ bulletListMenuitems: " + item.name);
  switch (item.name) {
    case 'toggle':
      tiptap_editor.chain().focus().toggleBulletList().run();
      break;
    case 'split':
      tiptap_editor.chain().focus().splitListItem('listItem').run();
      break;
    case 'sink':
      tiptap_editor.chain().focus().sinkListItem('listItem').run();
      break;
    case 'lift':
      tiptap_editor.chain().focus().liftListItem('listItem').run();
      break;
  }
}


const orderedListMenuitems = [  // TODO button with icon
  { title: 'toggleOrderedList', name: "toggle"  },   // :class="{ 'is-active': editor.isActive('orderedList') }"
  { title: 'splitListItem',     name: "split"   },   // :disabled="!editor.can().splitListItem('listItem')"
  { title: 'sinkListItem',      name: "sink"    },   // :disabled="!editor.can().sinkListItem('listItem')"
  { title: 'liftListItem',      name: "lift"    },   // :disabled="!editor.can().liftListItem('listItem')"
]

const orderedListItemClick = (item) => {
  console.log("$$$$ bulletListMenuitems: " + item.name);
  switch (item.name) {
    case 'toggle':
      tiptap_editor.chain().focus().toggleOrderedList().run();
      break;
    case 'split':
      tiptap_editor.chain().focus().splitListItem('listItem').run();
      break;
    case 'sink':
      tiptap_editor.chain().focus().sinkListItem('listItem').run();
      break;
    case 'lift':
      tiptap_editor.chain().focus().liftListItem('listItem').run();
      break;
  }
}



const taskListMenuitems = [  // TODO button with icon
  { title: 'toggleTaskList',    name: "toggle"  },   // :class="{ 'is-active': editor.isActive('taskList') }"
  { title: 'splitListItem',     name: "split"   },   // :disabled="!editor.can().splitListItem('listItem')"
  { title: 'sinkListItem',      name: "sink"    },   // :disabled="!editor.can().sinkListItem('listItem')"
  { title: 'liftListItem',      name: "lift"    },   // :disabled="!editor.can().liftListItem('listItem')"
]

const taskListItemClick = (item) => {
  console.log("$$$$ bulletListMenuitems: " + item.name);
  switch (item.name) {
    case 'toggle':
      tiptap_editor.chain().focus().toggleTaskList().run();
      break;
    case 'split':
      tiptap_editor.chain().focus().splitListItem('taskItem').run();
      break;
    case 'sink':
      tiptap_editor.chain().focus().sinkListItem('taskItem').run();
      break;
    case 'lift':
      tiptap_editor.chain().focus().liftListItem('taskItem').run();
      break;
  }
}


const blockquoteListMenuitems = [  // TODO button with icon
  { title: 'toggleBlockquote',  name: "toggle"  },   // :class="{ 'is-active': editor.isActive('blockquote') }"
  { title: 'setBlockquote',     name: "set"     },   // :disabled="!editor.can().setBlockquote()"
  { title: 'unsetBlockquote',   name: "unset"   },   // :disabled="!editor.can().unsetBlockquote()"

]

const blockquoteListItemClick = (item) => {
  console.log("$$$$ blockquoteListItemClick: " + item.name);
  switch (item.name) {
    case 'toggle':
      tiptap_editor.chain().focus().toggleBlockquote().run();
      break;
    case 'set':
      tiptap_editor.chain().focus().setBlockquote().run();
      break;
    case 'unset':
      tiptap_editor.chain().focus().unsetBlockquote().run();
      break;
  }
}


const setLink = () => {
  // const previousUrl = editor.getAttributes('link').href  // TODO
  const url = genInDataA.value;   // window.prompt('URL', previousUrl)
  console.log("$$$$ setLink")

  // cancelled
  if (url === null) {
    return
  }

  // empty
  if (url === '') {
    tiptap_editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .run()

    return
  }

  // update link
  tiptap_editor
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: url })
    .run()  
}


const onMouseOverHyperlinkBtn = (e) => {
  console.log("$$$$ onFocusImageBtn");
  genInId.value = 'Hyperlink';
  genInHintS.value = 'gA: Hyperlink URL'
  genInHintA.value = '例: https://tiptap.dev/api/marks/link'  // !!!!
  // genInDataA.value = 'https://picsum.photos/200/300';
  // TODO set focus to genInDataA
}



const hyperlinkListMenuitems = [  // TODO button with icon
  { title: 'setLink',     name: "set"       },   // :class="{ 'is-active': editor.isActive('link') }"
  { title: 'unsetLink',   name: "unset"     },   // :disabled="!editor.isActive('link')"
]

const hyperlinkListItemClick = (item) => {
  console.log("$$$$ codeBlockListMenuitems: " + item.name);
  switch (item.name) {
    case 'set':
      setLink();
      break;
    case 'unset':
      tiptap_editor.chain().focus().unsetLink().run();
      break;
  }
}


const codeBlockListMenuitems = [  // TODO button with icon
  { title: 'toggleCodeBlock', name: "toggle" },   // :class="{ 'is-active': editor.isActive('codeBlock') }"
  { title: 'setCodeBlock', name: "set" },   // :disabled="editor.isActive('codeBlock')"
]

const codeBlockListItemClick = (item) => {
  console.log("$$$$ codeBlockListMenuitems: " + item.name);
  switch (item.name) {
    case 'toggle':
      tiptap_editor.chain().focus().toggleCodeBlock().run();
      break;
    case 'set':
      tiptap_editor.chain().focus().setCodeBlock().run();
      break;
  }
}




const textColorListMenuitems = [  // TODO button with icon
  { title: 'setTextColor',    name: "set" },      // 
  { title: 'unsetTextColor',  name: "unset" },    //
]


const textColorListItemClick = (item = { title: 'setTextColor', name: "set" }) => {
  console.log("$$$$ textColorListItemClick: " + item.name);
  switch (item.name) {
    case 'set':
      pickedKind.value = "text"
      pickedColor.value = textColor.value;
      showPicker.value = true;
      break;
    case 'unset':
      tiptap_editor.chain().focus().unsetColor().run();
      showPicker.value = false;
      break;
  }
}



const highlightListMenuitems = [  // TODO button with icon
  { title: 'toggleHighlight', name: "toggle" },      // 
  { title: 'unsetHighlight',  name: "unset"  },      //
]


const highlightListItemClick = (item = { title: 'toggleHighlight', name: "toggle" }) => {
  console.log("$$$$ highlightListItemClick: " + item.name);
  switch (item.name) {
    case 'toggle':
      pickedKind.value = "highlight"
      pickedColor.value = highlight.value;
      showPicker.value = true;
      break;
    case 'unset':
      tiptap_editor.chain().focus().unsetHighlight().run();
      showPicker.value = false;
      break;
  }
}


const cfgListMenuitems = [  // TODO button with icon
  { title: 'toggleTableMenu',             name: "tableMenu"             },      // 
  { title: 'toggleInvisibleCharacters',   name: "invisibleCharacters"   },      //
  { title: 'toggleRawEditor',             name: "rawEditor"             },      // 
]


const cfgListItemClick = (item) => {
  console.log("$$$$ cfgListItemClick: " + item.name);
  switch (item.name) {
    case 'tableMenu':
      showTableMenuBar.value = !showTableMenuBar.value;
      break;
    case 'invisibleCharacters':
      tiptap_editor.commands.toggleInvisibleCharacters();
      break;
    case 'rawEditor':
      showRawEditor.value = !showRawEditor.value;
      break;
  }
}


const onMouseOverImageBtn = (e) => {
  console.log("$$$$ onFocusImageBtn");
  genInId.value = 'Image';
  genInHintS.value = 'gA: Image URL'
  genInHintA.value = '例: https://picsum.photos/200/300'  // !!!!
  // genInDataA.value = 'https://picsum.photos/200/300';
  // TODO set focus to genInDataA
}

const addImage = () => {
  const url = genInDataA.value;   // window.prompt('URL');

  if (url) {
    tiptap_editor.chain().focus().setImage({ src: url }).run();
  }
}


const clearFormatting = (e) => {
  //= https://github.com/ueberdosis/tiptap/issues/101
  console.log("$$$$ clearFormatting");
  tiptap_editor.chain().focus().clearNodes().unsetAllMarks().run();
}


const colorPickerClicked = () => {
  console.log("$$$$ colorPickerClicked");
  showPicker.value = false;

  if (pickedKind.value === "text") {
    textColor.value = pickedColor.value;
    tiptap_editor.chain().focus().setColor(pickedColor.value).run();
  } else if (pickedKind.value === "highlight") {
    highlight.value = pickedColor.value;
    tiptap_editor.chain().focus().toggleHighlight({ color: pickedColor.value }).run()
  }
}

const colorPickerCancel = () => {
  showPicker.value = false;
}

const textColor = ref('#ff0000');
const highlight = ref('#00ff00');
const showPicker = ref(false);
const pickedKind = ref("text");       // text | highlight
const pickedColor = ref('#00ff00')


const onMeClick = (e: any) => {
  console.log("$$$$ onMeClick");
}


onMounted(async () => { // after DOM nodes be inserted
  await nextTick();
  console.log("onMounted");

  tiptap_editor.commands.hideInvisibleCharacters();
})

onBeforeUnmount(() => {
  console.log("onBeforeUnmount");
  tiptap_editor.destroy()
})


</script>


<!-- 要 yarn add sass-loader sass -->
<style lang="scss" scoped>

// 全ての要素にborder-boxを適用させておく設定
*, *:before, *:after {
  box-sizing: border-box;
}


// BEGIN My Style ----------------------------------------------------->
.galaxy {
  position: relative;
  display: block;
  background-color: rgba(0, 0, 0, 0) !important;

  // height: 100% !important;
  // box-sizing: border-box;
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

.tiptap_editor_canvas { /* earth */
  position: relative;
  display: block;

  background-color: v-bind("htmsvg_outer_ref.background_color") !important;   // 2023.12.16a Editorの背景色
  color: v-bind("htmsvg_outer_ref.color") !important;                         // 2023.12.16a Editorの前景色

  pointer-events: auto !important; /* galaxy で OFF したイベントを再開する */
}

.tiptap_editor_outline {
  position: relative;
  display: grid;

  grid-template-rows: auto auto 1fr; 
  grid-gap: 1px;

  height: 100% !important;
  box-sizing: border-box;

  // background-color: rgba(22, 22, 22, 1.0);
}

.tiptap_btn_bars {
  display: block;
  position: absolute !important;
  left: 0;
  top: 0;
  z-index: 10000;

  background-color: rgba(22, 22, 22, 1.0);
  opacity: 0.85;
}

.tool_bar {
  padding: 4px;
  background-color: rgba(22, 22, 22, 1.0);
}

.tool_bar_btn {
  padding-left: 2px;
  padding-right: 2px;
  display: inline-block;
  margin-right: 4px;
  color:gold;

  background-color: black;
}

.vtn_text_color {
  border: none !important;
  outline: none !important;
  border-bottom : 2px solid red !important;
} 

.vtn_highlight_color {
  border: none !important;
  outline: none !important;
  border-bottom: 2px solid blue !important;
} 

.table_btn {
  padding-left: 2px;
  padding-right: 2px;
  display: inline-block;
  background-color: black;
  color:gold;
  margin-right: 4px;
}

.color_picker_btn {
  margin-top: 4px;
  margin-left: 8px;
}


.tiptap_content_outline {
  display: block;
  position: relative;

  /*（左側）範囲外表示対策 */
  padding-left: 1.5em;
  padding-right: 0.5em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;

  box-sizing: border-box;  
  overflow: auto !important; // visible hidden clip scroll auto "hidden visible"
}

.editor_content {
  display: block;
  position: relative;
}

.raw_editor_outline {
  display: block;
  position:absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  padding-left: 0.5em;
  padding-right: 0.5em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  box-sizing: border-box;  

  background-color: rgba(0, 0, 0, 0.85) !important; // 2024.01.04a 本物と異なる背景色・前景色を許す、が、float editor なので、薄ら透過させる
  color: rgba(255, 255, 255, 0.85) !important;      // 2024.01.04a 本物と異なる背景色・前景色を許す
}


.raw_content {
  border: 1px solid rgba(41, 41, 136, 0.964);
  border-radius: 2px;
  padding: 8px;
}


.raw_textarea {
  width: 100%;
}


// <------------------------------------------------------- END My Style 


/* BEGIN to style the editor-content -----------------------------------------------------> */

::deep(.ProseMirror:focus) {
  // outline: none; 
  outline: 1px solid rgba(255, 255, 0, 0.95) !important;
}

::deep(.ProseMirror) {
  //= お試し
  position: relative !important;
  display:block !important;
  // border: 1px solid rgba(41, 41, 136, 0.75) !important; // Debuger
  box-sizing: border-box;
  // box-sizing: content-box;
  // background-color: rgba(0, 0, 0, 1.0);

  > * + * {
    // 行間隔
    margin-top: 0.25em;
  }

  .Tiptap-mathematics-editor {
    background: #202020;
    color: #fff;
    font-family: monospace;
    padding: 0.2rem 0.5rem;
  }

  .Tiptap-mathematics-render {
    cursor: pointer;
    padding: 0 0.25rem;
    transition: background 0.2s;

    &:hover {
      background: #eee;
    }
  }

  .Tiptap-mathematics-editor,
  .Tiptap-mathematics-render {
    border-radius: 0.25rem;
    display: inline-block;
  }
}

/*  <---------------------------------------------------- END to style the editor-content */



/* Placeholder (at the top) */
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

/* Placeholder (on every new line) */
/*.tiptap p.is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}*/

.has-focus {
  border-radius: 3px;
  box-shadow: 0 0 0 3px #68cef8;
}

/* 【お試し】Global styling */
p {
  margin: 1em 0;
}



.tiptap {
  > * + * {
    margin-top: 0.75em;
  }
}

pre {
  background: #0D0D0D;
  color: #FFF;
  font-family: 'JetBrainsMono', monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

code {
  color: inherit;
  padding: 0;
  background: none;
  font-size: 0.8rem;
}


.colorPickerframe {
  display: block;
  position: absolute;
  top: 3em;
  left: 16em;
  /* z-index: 100; */
  background-color: black;
  border: 1px solid silver;
  border-radius: 2px;
  padding: 4px;
}




</style>