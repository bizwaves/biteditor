<template>
  <!-- 
    親 Container (layoutor_container) Required:
      - position: relative ※想定
      - display: grid | TODO
    TODO: 
      v-slot="{x, y, top, right, bottom, left, width, height }"
      v-element-size = "onLayCEllResize" ※ 不要なはずで、外した 2023/10/01
  -->
  <ElementBounding v-if = "showMi" 
        ref = "mi_ref" 
        class = "lay-item-bound html_events" 
        title = "Layouted Html Item"
  >

    <!-- ↓ Item: 実コンテンツ
      TODO: 
        id      = "layouted_item_content_frame" 
        
    -->
    <div
        ref     = "layouted_frame_ref" 
        class   = "layouted-item-frame html_events" 
        :title  = "mouseInMi ? 'layouted_item_frame!' : 'layouted_item_frame' "
        @click  = "onLayoutedFrameClick"
    >
    
      <div v-show = "showDbgInfo && (!isPreviewModeRef) && htmsvg_outer_ref.lauout_mode" 
        title = "layouted_item_debug_info"
        class = "item-text-info"
      >
<pre>
【Item】
Key / Cell-Design へ切り替え
Key D コンテンツ切り替え
idx:  {{ props.idx       }}
area: {{ props.area      }}
uuid: {{ props.uuid       }}
</pre>        
      </div>


      <!-- ↓ 本コンテンツ表示 
      -->
      <div v-show = "(!showDbgInfo) || isPreviewModeRef" 
          title="layouted_item"
          class="layouted-item-hon-container"
      >
         <!-- 
            2024.01.06c 版 参考 SvgEditor.vue 但し、↓ は pos-size 関係であり不要
              v-model:able_target_ref = "resizing_container_ref"
              v-model:able_actmd_ref  = "able_actmd_ref"
              v-model:able_macro_ref  = "able_macro_ref"    
            2024.01.06c EditHtmlFrame.vue style galaxy に移動した
              style = "background-color: rgba(0, 0, 0, 0.0) !important"   
        -->
        <EditHtmlFrame v-if = "true"
            
            ref                 = "childEditHtmlRef"
            editor_kind         = "nonable"
            :is_root            = "false"
            :uuid               = "other_uuid"
            :parent_uuid        = "props.uuid"

            :editing_uuid       = "props.editing_uuid"
            :editing_id         = "props.editing_id"
            :being_edit_id      = "props.being_edit_id"

            v-model:ctrl_on_other = "ctrl_on_other"

            @props_updated      = "childPropsUpdated"
            @deleted            = "childBeDeleted"
            @uuid_changed       = "childUuidChanged"
        >
        </EditHtmlFrame>
      </div>

    </div> <!-- layouted_item_content_frame -->

  </ElementBounding>
</template>


<script setup lang="ts">

import {
  effectScope, getCurrentScope, onScopeDispose, markRaw, toRaw, reactive, shallowReactive, shallowReadonly, isReactive, computed, shallowRef, triggerRef, customRef, ref, unref, toRef, toRefs, isRef,
  // defineExpose, defineProps, defineEmits,
  inject, onBeforeUpdate, watch, onMounted, onUnmounted, onBeforeUnmount, nextTick
} from "vue";

import { v4 as uuidv4 } from "uuid"; // このuuid の代り、独自のルールで共通的作成する

import { onKeyStroke, useActiveElement, useMouse, useMousePressed, useMouseInElement, useElementSize, useElementBounding, useResizeObserver } from '@vueuse/core'
import { vElementSize } from "@vueuse/components"; // v-element-size
import { UseElementBounding as ElementBounding } from "@vueuse/components"

import { mainMachine } from "./mainFsmMachine";
import EditHtmlFrame from '../components/EditHtmlFrame.vue'


const isDevModeRef = inject("isDevModeRef");
const isPreviewModeRef = inject('isPreviewModeRef');

const isEditFocusRef = ref(false);  // 自分がアクティブかどうか

// 2022.11.01 版： 子コンポーネントの add-edit-svg 呼び出すの代り、cmd をセットし、actived obj が自ら
// その cmd を実行するようにする。

const editCmdRef = inject("editCmdRef");

const editCmdParasRef = inject("editCmdParasRef");          // object
const initialEditCmdParas = inject("initialEditCmdParas");  // function

const editingObjRef = inject("editingObjRef");              //  isEditFocus 系から移行させる
const updateEditingObj = inject("updateEditingObj");        // function

const mi_ref = ref(null);
const layouted_frame_ref = ref(null);
const edit_html_ref = ref(null);


//= BEGIN 2023/09/15 お試し ------------------------------------------------------------>
const childEditHtmlRef = ref(null);           // 
const other_uuid = uuidv4();                  // EditSvgEmbed と互換性を保つため
const ctrl_on_other = ref(true);              // Ctrl On OTHOR | (Able)SELF

//= END 2023/09/15 お試し ------------------------------------------------------------<



//= 自分がアクティブかどうか
const isEditFocus = computed(() => {
  return editingObjRef.value.uuid == props.uuid;
});

const childRefs = ref([]); // 子コンポーネントの ref, childRefs.value[i] でアクセスし子コンポーネントを制御します。

const setChildRef = (el) => {
  if (el) {
    // console.log('setChildRef push: ' + el.myUuid());
    childRefs.value.push(el);
  }
};

onBeforeUpdate(() => {
  childRefs.value = []; // 画面に更新処理が走る度に、テンプレート参照を格納した配列に参照がpushされてしまいます。そのため、更新前に配列を初期化する必要があります。
});


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  // I/F: 親⇒子のデータの受け渡し
  uuid: {
    // uuid は、このコンポーネントの一意の識別子です
    type: String,
    default: null,
  },

  com_type: {
    // edit_svg | edit_html | ..
    type: String,
    default: "LayoutedHtmlItem",
  }, 

  is_root: {
    type: Boolean,
    default: false,
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

  idx : {           // 参考用
    type: Number,
    required: true,
    default: 0,
  },
  area: {
    type: String,
    required: true,
    default: ".",
  },

  layoutor : {
    type: Object,
    required: true,
    default: null,
  },

});


const htmsvg_outer_ref = defineModel<any>("htmsvg_outer_ref", { local: true, default: null });  // 2024.01.06a 親の colors を参照するため


const emit = defineEmits([
  "props_updated",  // props が更新された
  "deleted",        // 子コンポーネントが削除されたときに親コンポーネントに通知するためのイベントです
]);


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const myTestClass = ref("html_button_tag"); // 「v-bind:class="myTestClass" 」で使用する⇒OKと確認できた

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onExamBtnClick() {
  alert("Hello " + props.uuid);
}

function childBeDeleted(uuid) {
  // 子コンポーネントが削除されたときに呼ばれる関数です
  console.log(props.com_type + " " + props.uuid + " childBeDeleted " + uuid);
  const index = items.value.findIndex((item) => item.uuid == uuid);
  if (index >= 0) {
    items.value.splice(index, 1); // 削除
    updateEditingObj({ uuid: "", com_type: "" }); // 自分をアクティブにする
  }
}

function childPropsUpdated(uuid, dc) {
  // 子コンポーネントのプロパティが更新されたときに呼び出されます。
  console.log(
    props.com_type + " " + props.uuid + " received childPropsUpdated " + uuid + " dc: ",
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


function childUuidChanged(newValue, oldValue) { // 初期 Empty EditHtmlFrame ⇒ Listup ⇒ Selected
  console.log(props.com_type + ' ' + props.uuid + ' childUuidChanged ' + newValue + ' <= ' + oldValue);
  other_uuid.value = newValue;
}


//= keys TODO state にも基づき使えるキーを動的に変える
//  EditHtmlTag.vue 内 onKeyDown と衝突しないように！
//=
const showMi = ref(true);           // LacoutCell.vue と衝突 Debug 用
onKeyStroke(['M'], (e) => {
  console.log('onKeyStroke M');
  e.preventDefault();
  showMi.value = !showMi.value;
})



const showDbgInfo = ref(true);     // !! false := 本番 | true := Debug 時, 参考 Global isDevModeRef
onKeyStroke(['D'], (e) => {
  console.log('onKeyStroke D');
  e.preventDefault();
  showDbgInfo.value = !showDbgInfo.value;
})


// watch(activeElement, (el) => {
//   console.log('focus changed to', el)
// })

const mouseInMi = reactive(useMouseInElement(layouted_frame_ref));
watch(mouseInMi,  (el) => {
  if ( !mouseInMi.isOutside ) {
    // console.log('mouseInMi changed to', el)
  }
})


const onLayoutedFrameClick = (e) => {
  console.log("EditHtmlTag " + props.uuid + " onLayoutedFrameClick");
  e.preventDefault();
  e.stopPropagation();

  //= 自分をアクティブにする
  updateEditingObj({ uuid: props.uuid, com_type: props.com_type });   

  //= EditCmd を受付るようにする
  if (isEditFocusRef.value) {          // 自分がアクティブなら、
    initialEditCmdParas(props.com_type, props.uuid, props.x, props.y, e);
  }
}


watch (editingObjRef, (val, oldVal) => {
    console.log('EditHtmlTag ' + props.uuid + ' received editingObjRef ' + val);
    if (val == props.uuid) {
        isEditFocusRef.value = true;
    } else {
        isEditFocusRef.value = false;
    }
});



const makeRawContentJson = (rootContainerRequired) => {
  console.log("makeRawContentJson");

  const htmlFrame = childEditHtmlRef.value.makeRawContentJson(rootContainerRequired);
  return htmlFrame;
}


const makeDownloadAssets = () => {
  console.log("makeDownloadAssets");

  const assets = childEditHtmlRef.value.makeDownloadAssets();
  return assets;
}


const whoami = () => {
  return { idx: props.idx, uuid: props.uuid };
}

defineExpose({
  whoami,               // !!
  makeRawContentJson,
  makeDownloadAssets,
})



onMounted(async () => { // after DOM nodes be inserted
  await nextTick();
  console.log(props.com_type + " " + props.uuid + " is mounted!");
  //= TODO Layout '/' の障害となるため、一時的コメントアウトした：追加された直後、自分をアクティブにする
  // if (!isEditFocus.value) {
  //   // 自分がアクティブでないなら、
  //   updateEditingObj({ uuid: props.uuid, com_type: props.com_type }); // 自分をアクティブにする
  //   // mainMachine.send({ type : 'SW_TO_EDITING_HTML' });
  // }

  // document.addEventListener("keydown", onKeyDown);

  // //= 疑似的にクリックイベントを発生させる
  // initialEditCmdParas(
  //   props.com_type,
  //   props.uuid,
  //   "onMounted",
  //   props.x, // parent_x
  //   props.y, // parent_y
  //   0, // x
  //   0
  // ); // y

});


onBeforeUnmount(() => {
  // Vue 2.x beforeDestroy
  // console.log(props.com_type + " " + props.uuid + " is beforeUnmount!");
  // document.removeEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  // Vue 3.x unmounted
  console.log(props.com_type + " " + props.uuid + " is unmounted!");
});

</script>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "LayoutItem",
});

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

.lay-item-bound { // galaxy
    // root 要素は background-color 等は !important がなければ設定出来ず、親側で設定する必要であることに注意
    pointer-events: auto;
    position: relative;
    display: block;
    background-color: rgba(0, 0, 0, 0) !important;

    // outline: 1px solid rgba(0, 0, 255, 0.5);
    // margin: 1x;
}


.layouted-item-frame {
    pointer-events: auto;
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: left;

    background-color: v-bind("htmsvg_outer_ref.cell_background") !important;
    color: v-bind("htmsvg_outer_ref.color") !important;

    // border: 7px solid rgba(255, 128, 128, 0.25);  /* !! Debug */
}


.layouted-item-empty-frame {  // area "." の "item" の為に保留
  pointer-events: none;
  display: block;
  width: 100%;
  height: 100%;
  background-color: v-bind("htmsvg_outer_ref.cell_background") !important;
  color: v-bind("htmsvg_outer_ref.color") !important;  
}

.layouted-item-debug-info {
    position: relative;
    display: block;
}

// ↓　EditHtmlFrame.vue 「watch(z,」振動対策版（変更する時ご注意）
.layouted-item-hon-container {
    pointer-events: auto !important;
    position: absolute !important;
    display: block !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
}

.item-text-info {
  pointer-events: None;
  position: absolute;
  overflow: clip;
  left: 8px;
  right: 8px;
  top: 1em;
  bottom: 1em;
  border: 1px gray solid;
  border-radius: 5%;
}
</style>
