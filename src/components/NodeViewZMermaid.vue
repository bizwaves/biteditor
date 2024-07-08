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
    https://github.com/ueberdosis/tiptap/blob/main/demos/src/GuideNodeViews/VueComponent/Vue/Component.vue
-->
<template>
  <node-view-wrapper 
    :class="isPreviewModeRef ? 'client_decided html_events zhtmlframe-node-com-preview' : 'client_decided html_events zhtmlframe-node-com'" 
  >

    <span v-if = "isDevModeRef && (!isPreviewModeRef)" class="vue3-view-label" contenteditable="false"> 
      Vue3 Diag(Mermaid) View Component
    </span>


    <!-- NodeViewContent @tiptap/vue-3
      参考
        https://tiptap.dev/guide/node-views/vue#adding-a-content-editable
        https://github.com/ueberdosis/tiptap/blob/main/demos/src/GuideNodeViews/VueComponentContent/Vue/Component.vue
      TODO 何故か 
        Self-Renderer が表示されない   When ↓ node-view-content v-if   = "false"
        Self-Renderer が表示されている When ↓ node-view-content v-show = "false"
      検討
        node-view-content では、content is rendered by Tiptap
          1) That means you need to tell what kind of content is allowed, for example with content: 'inline*' in your node extension
          2) render a <div> HTML tag (<span> for inline nodes), but you can change that. For example <node-view-content as="p"> should render a paragraph
          3) handleClickOn は動作する
        現時点で、我々には、より強力なレンダリング機能が必要なので、採用は難しいと判断している
         ⇒ v-show = "false" とし、Self-Renderer を実装する　
    -->

    <node-view-content v-show = "false"
      class="my-tiptap-content" 
    >
    </node-view-content>

    <!-- ↓↓↓↓ BEGIN Self-Renderer ↓↓↓↓ 
      1) mini-float-editor の入力（mini-lang source）ではなく、結果（例: z-diag  の時は svg）を表示する
          ⇒ miniEditorCompiled
      2) Edotor.handleClickOn ど同等の機能を提供する
          ⇒ onClickContent
    -->
    <div
      :class="isPreviewModeRef ? 'client_decided html_events my-tiptap-content-preview' : 'client_decided html_events my-tiptap-content'" 
      @click="onClickContent"
    >
      <pre v-if='props.node.attrs["miniEditorCompiled"] != ""'
        ref = "presentElem"
        class = "mermaid" 
        v-html = 'props.node.attrs["miniEditorCompiled"]'
      ></pre>     

      <pre v-else>
        (Empty)
      </pre>

    </div>
    <!-- ↑↑↑↑ END Self-Renderer ↑↑↑↑ -->

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
  nodeInputRule,
  // nodeViewProps  // 動作が確認出来ていないので、↓ defineProps に直接的書いている
} from '@tiptap/vue-3'


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


//= 参考: props.updateAttributes の使い方
// const increase = () => {
//   props.updateAttributes({
//     count: props.node.attrs.count + 1
//   })
// }

const miniEditorUidRef = ref(null);
const presentElem = ref(null);    // 表示させる Html Tag

//= 2) Edotor.handleClickOn ど同等の機能を提供する
const onClickContent = (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log('$$$$ onClickContent');

  // fmini_content_ref.value = props.node.attrs["miniEditorCompiled"];   // 不要？

  miniEditorUidRef.value = startupFloatMinieditor(
    props.node["type"]["name"],               // node_type,    // [in]     node.type, "zCode"
    props.node["attrs"]["data-type"],         // data_type,    // [in]     node.attrs.data-type, "my-z-code-node"
    props.node["attrs"]["miniEditorLangSrc"]  // src,          // [inout]  node.attrs.miniEditorLangSrc, "const foo = 0"
  );
}


watch(fmini_stat_ref, (val, oldVal) => {
  if (!(miniEditorUidRef.value === floatMinieditorRef.value.uid)) {
    return;
  }

  console.log("$$$$ watch fmini_stat_ref ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;");
  console.log("   val : " + val + " ← oldVal : " + oldVal);


  if (val === 'finish') {
    console.log("src:\n" + floatMinieditorRef.value.src);
    console.log("Compiled:\n" + fmini_content_ref.value);

    
    nextTick(() => {
      cancelFloatMinieditor();
      try {
        props.updateAttributes({ miniEditorLangSrc : floatMinieditorRef.value.src }); // [diagram_src] o.p.t. ?
        props.updateAttributes({ miniEditorCompiled: fmini_content_ref.value });      // [diagram_svg] required
      } catch (e) {
        //= 2023.11.26 メモ 
        // 参考：TiptapEditor.vue insertItemClick, watch(modelValue,
        //  【OK】<p></p> <z-math data-type="my-z-math-node"  miniEditorLangSrc=""  miniEditorCompiled="" ></z-math> <p></p>
        //  【NG】        <z-math data-type="my-z-math-node"  miniEditorLangSrc=""  miniEditorCompiled="" ></z-math>
        //   ⇒ TODO 失敗時 TiptapEditor.modelValue の Recovery
        //=
        console.log("$$$$$ updateAttributes error: " + e);
      }
    })
  }
});


onMounted(async () => { // after DOM nodes be inserted
  await nextTick();
  console.log('be mounted!');
  const nodeObj = JSON.parse(JSON.stringify(props.node));
  console.log("$$$$$ nodeObj: " + JSON.stringify(nodeObj, null, 2));
  console.log("$$$$$ options.editor_uid: " + props.extension?.options["editor_uid"]);   // $$$$$ options.editor_uid: af352ea4-1fc0-4cda-8a6e-6fac6f94a65e
})

</script>


<style lang="scss" scoped>
// 全ての要素にborder-boxを適用させておく設定
*, *:before, *:after {
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
  background-color: v-bind("htmsvg_outer_ref.background_color") !important;   // 2023.12.16a Editorの背景色
  color: v-bind("htmsvg_outer_ref.color") !important;                         // 2023.12.16a Editorの前景色

  border: 1px solid gray !important;
  border-radius: 0.5rem;
}

.zhtmlframe-node-com-preview {
  position: relative;
  display: block;
  background-color: v-bind("htmsvg_outer_ref.background_color") !important;   // 2023.12.16a Editorの背景色
  color: v-bind("htmsvg_outer_ref.color") !important;                         // 2023.12.16a Editorの前景色

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
  background-color: v-bind("htmsvg_outer_ref.background_color") !important;   // 2023.12.16a Editorの背景色
  color: v-bind("htmsvg_outer_ref.color") !important;    
}


.my-tiptap-content {
  border: 1px dashed rgba(80, 7, 250, 0.75);
  border-radius: 0.5rem;
  background-color: v-bind("htmsvg_outer_ref.background_color") !important;   // 2023.12.16a Editorの背景色
  color: v-bind("htmsvg_outer_ref.color") !important;                         // 2023.12.16a Editorの前景色
}

</style>

