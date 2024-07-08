<template>
  <node-view-wrapper class="zhtmlframe-node-com">

    <span class="label" contenteditable="false">NodeViewZHtml Vue Component</span>

    <node-view-content v-show="false" class="content" />

    <div class="content">

      <v-btn color="info" >
        This button has been clicked node.attrs.count times.
      </v-btn>
        
      <code>
        This button has been clicked node.attrs.count times.
      </code>

    </div>
    <!-- Paired-Tag は、Sub-Tree を含むことが出来ます
      TODO
        1) ↓ 内 すべて background-color rgba(, , , 0.0) にした: 透過と表示されない（※ galaxy だけ効かないと判明した）
        2) style="background-color: rgba(255, 0, 0, 0.5)" : 効かない
        3) style="background-color: rgba(255, 0, 0, 0.5) !important" : 効く！
            ⇒ 子孫に影響が様子、対策として、「style="background-color: rgba(0, 0, 0, 0.0) !important"」と書くように
        4) style="opacity: 0.5": 効く
        　　⇒ 仕様上、子孫も透過となるので、使う本意ではない

        :parent_uuid        = "ext_props.parent_uuid"     \

         2024.01.06c EditHtmlFrame.vue style galaxy に移動した
           style = "background-color: rgba(0, 0, 0, 0.0) !important"  
     -->
<!-- 
    <EdithtmlFrameSp 
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
    </EdithtmlFrameSp>
 -->
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
// import EdithtmlFrameSp from '../components/EditHtmlFrameSp.vue'   // 暫　rewriting 版, TODO ↑に反映

import { v4 as uuidv4 } from 'uuid';

const vueExtProps: any = inject('vueExtProps');


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


<style lang="scss">
.zhtmlframe-node-com {
  background: #1d1816;
  border: 3px solid #0D0D0D;
  border-radius: 0.5rem;
  margin: 1rem 0;
  position: relative;
}

.label {
  margin-left: 1rem;
  background-color: #0D0D0D;
  font-size: 0.6rem;
  letter-spacing: 1px;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  position: absolute;
  top: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 0.5rem 0.5rem;
}

.content2 {
  margin-top: 1.5rem;
  padding: 1rem;
}

.content {
  margin: 2.5rem 1rem 1rem;
  padding: 0.5rem;
  color: white;
  border: 2px dashed #e11414cf;
  border-radius: 0.5rem;
}
</style>
