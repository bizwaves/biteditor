<!--
  位置付け：
    EditHtmlNodeTree.vue :: const mii_content_ref = ref(' <z-math | z-diag | z-code | z-html
      TipTapEditor.vue :: addNodeView() { return VueNodeViewRenderer( NodeViewZ～ ); }
  参考：
    https://github.com/ueberdosis/tiptap/blob/main/demos/src/GuideNodeViews/VueComponent/Vue/Component.vue
-->
<template>
    <node-view-wrapper 
      :class="isPreviewModeRef ? 'client_decided html_events zhtmlframe-node-com-preview' : 'client_decided html_events zhtmlframe-node-com'" 
    >

    <span v-if = "isDevModeRef && (!isPreviewModeRef)" class="vue3-view-label" contenteditable="false"> 
      NodeViewZHtml Vue Component
    </span>

      <node-view-content v-show = "false"
        class="my-tiptap-content" 
      >
      </node-view-content>


    <!-- Paired-Tag は、Sub-Tree を含むことが出来ます
      TODO
        1) ↓ 内 すべて background-color rgba(, , , 0.0) にした: 透過と表示されない（※ galaxy だけ効かないと判明した）
        2) style="background-color: rgba(255, 0, 0, 0.5)" : 効かない
        3) style="background-color: rgba(255, 0, 0, 0.5) !important" : 効く！
            ⇒ 子孫に影響が様子、対策として、「style="background-color: rgba(0, 0, 0, 0.0) !important"」と書くように
        4) style="opacity: 0.5": 効く
        　　⇒ 仕様上、子孫も透過となるので、使う本意ではない

        :parent_uuid        = "ext_props.parent_uuid"      

        2024.01.06c EditHtmlFrame.vue style galaxy に移動した
          style = "background-color: rgba(0, 0, 0, 0.0) !important"   
     -->

    <EdithtmlFrame
      ref                 = "childEditHtmlRef" 
      :is_root            = "false"  
      :uuid               = "other_uuid" 
      editor_kind         = "tiptap"
      :parent_uuid        = "ext_props.parent_uuid"
      :editing_uuid       = "ext_props.editing_uuid"
      :editing_id         = "ext_props.editing_id"
      :being_edit_id      = "ext_props.being_edit_id"
      :myPosSizeRef       = "ext_props.myPosSizeRef"
      :raResizingSize     = "ext_props.raResizingSize"
      :raResizingViewbox  = "ext_props.raResizingViewbox"   
      :writeable_ctrl_on_other = "true"      
      v-model:ctrl_on_other = "ctrl_on_other"
    >
    </EdithtmlFrame>

  </node-view-wrapper>
</template>


<script setup lang="ts">
// 参考 https://stackoverflow.com/questions/72512237/how-to-import-nodeviewprops-object-from-tiptap-in-vue-3-script-setup

import {
  effectScope, getCurrentScope, onScopeDispose, markRaw, toRaw, reactive, shallowReactive, shallowReadonly, isReactive, computed, shallowRef, triggerRef, customRef, ref, unref, toRef, toRefs, isRef,
  inject, onBeforeUpdate, watch,
  onBeforeMount,
  onMounted, onBeforeUnmount, onUnmounted,
  nextTick,
} from "vue";

import {
  NodeViewWrapper,
  NodeViewContent,
  // nodeViewProps
} from '@tiptap/vue-3'


// import EdithtmlFrame from '../components/EditHtmlFrame.vue'       // TODO 本物
import EdithtmlFrame from '../components/EditHtmlFrame.vue'   // 暫　rewriting 版, TODO ↑に反映

import { v4 as uuidv4 } from 'uuid';

const vueExtProps: any = inject('vueExtProps');

const fmini_content_ref: any = inject('fmini_content_ref');
const fmini_stat_ref: any = inject('fmini_stat_ref');

const floatMinieditorRef: any = inject('floatMinieditorRef');
const startupFloatMinieditor: any = inject('startupFloatMinieditor');
const testFloatMinieditor: any = inject('testFloatMinieditor');
const showFloatMinieditor: any = inject('showFloatMinieditor');
const hideFloatMinieditor: any = inject('hideFloatMinieditor');
const cancelFloatMinieditor: any = inject('cancelFloatMinieditor');
const finishFloatMinieditor: any = inject('finishFloatMinieditor');

const htmsvg_outer_ref: any = inject('edit_tiptap_ref');     // 2024.01.04b 単純に、直接的 SvgEditor.vue から inject する

const isDevModeRef = inject('isDevModeRef');
const isPreviewModeRef = inject('isPreviewModeRef');


const props = defineProps({
  //= 参考: 非 vue3 script setup (composition api)
  //  https://tiptap.dev/guide/node-views/vue
  //=
  // the editor instance
  editor: {
    type: Object,
  },

  // the current node
  node: {
    type: Object,
  },

  // an array of decorations
  decorations: {
    type: Array,
  },

  // `true` when there is a `NodeSelection` at the current node view
  selected: {
    type: Boolean,
  },

  // access to the node extension, for example to get options
  extension: {
    type: Object,
  },

  // get the document position of the current node
  getPos: {
    type: Function,
  },

  // update attributes of the current node
  updateAttributes: {
    type: Function,
  },

  // delete the current node
  deleteNode: {
    type: Function,
  },
})


console.log("$$$$$ options.editor_uid: " + props.extension?.options["editor_uid"]);   // $$$$$ options.editor_uid: af352ea4-1fc0-4cda-8a6e-6fac6f94a65e

const ext_props = vueExtProps['tipeditor_' + props.extension?.options["editor_uid"]];
console.log("$$$$$ ext_props: " + JSON.stringify(ext_props, null, 2));


const increase = () => {
  props.updateAttributes({
    count: props.node.attrs.count + 1
  })
}

const childEditHtmlRef = ref(null);
const other_uuid = uuidv4();               // EditSvgEmbed と互換性を保つため
const ctrl_on_other = ref(true);              // Ctrl On OTHOR | SELF

</script>


<style lang="scss" scoped>
// 全ての要素にborder-boxを適用させておく設定
*,
*:before,
*:after {
  box-sizing: border-box;
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


.zhtmlframe-node-com {
  position: relative;
  display: block;
  background-color: v-bind("htmsvg_outer_ref.background_color") !important; // 2023.12.16a Editorの背景色
  color: v-bind("htmsvg_outer_ref.color") !important; // 2023.12.16a Editorの前景色

  border: 1px solid gray !important;
  border-radius: 0.5rem;
}

.zhtmlframe-node-com-preview {
  position: relative;
  display: block;
  background-color: v-bind("htmsvg_outer_ref.background_color") !important; // 2023.12.16a Editorの背景色
  color: v-bind("htmsvg_outer_ref.color") !important; // 2023.12.16a Editorの前景色

  // border: 1px solid gray !important;
  // border-radius: 0.5rem;
}

.vue3-view-label {
  margin-left: 1rem;
  font-size: 0.6rem;
  letter-spacing: 1px;
  font-weight: bold;
  text-transform: uppercase;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 0.5rem 0.5rem;
  background-color: #031b26;
  color: #ff9604;
}

.my-tiptap-content-preview {
  background-color: v-bind("htmsvg_outer_ref.background_color") !important; // 2023.12.16a Editorの背景色
  color: v-bind("htmsvg_outer_ref.color") !important;
}


.my-tiptap-content {
  border: 1px dashed rgba(80, 7, 250, 0.75);
  border-radius: 0.5rem;
  background-color: v-bind("htmsvg_outer_ref.background_color") !important; // 2023.12.16a Editorの背景色
  color: v-bind("htmsvg_outer_ref.color") !important; // 2023.12.16a Editorの前景色
}
</style>
