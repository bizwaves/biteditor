<template>
  <div 
    ref="galaxy_ref" 
    class="galaxy client_decided html_events"
    title="galaxy_ref :- galaxy: div, Position, Size の基準（当 Html Frame の 辺界線）">

    <div v-if="isDevModeRef" class="who_am_i">{{ props.com_type }} : {{ uuidRef.value }}</div>

    <div display="none">
      <svg display="none">
        <desc>SVG DEFS-SYMBOL Library</desc>
      </svg>
    </div>


    <div 
      ref="earth_ref" 
      @click.prevent="onMeClick" 
      class="editor_canvas client_decided html_events "
      title="earth_ref :- earth: div, canvas, to warp svg-root"
    >

      <v-container
        :id = "attached_ref" 
        ref = "menu_container_ref" 
        class = "menu_container"
        title = "menu_container_ref :- Menu Container"
      >

        <v-menu
          :attach=attached_ref ref="menu_ref" v-model="cmenu" :open-delay="100" :close-delay="100"
          :close-on-click="false" :close-on-content-click='false'>
          <v-list>
            <template v-for="item in cmenuItems" :key="item.id">
              <v-list-item v-if="shouldShow(item)"
                  @click.prevent.stop="onCmenuItemClick(item)"
              >
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </v-container>

      <v-container fluid>
        <div>
          <!-- 
            https://github.com/surmon-china/vue-codemirror
              CodeMirror(6) component for Vue(3).
            TODO
               1) no cursor
                  https://discuss.codemirror.net/t/cant-see-cursor-at-all/5267
          -->
          <codemirror
            v-model           = "mii_code_ref"
            :placeholder      = "mii_holder_ref"
            :style            = "{ 'min-height' : '128px', 'margin-right' : '32px', border : '8px solid #0381f6dc', 'box-sizing' : 'border-box' }"
            :autofocus        = "true"
            :disabled         = "false"
            :indent-with-tab  = "true"
            :tab-size         = "2"
            :extensions       = "extensions"
            :autoDestroy      = "true"
            @ready            = "handleReady"
            @update           = "console.log(';;;;;;;; codemirror update', $event)"
            @change           = "console.log(';;;;;;;; codemirror change', $event)"
            @focus            = "console.log(';;;;;;;; codemirror focus',  $event)"
            @blur             = "console.log(';;;;;;;; codemirror blur',   $event)"
          />
        </div>

        <div class = "btn_bar">
          <v-btn color="info"    @click.stop = "cancleBtnClicked"  > Cancle </v-btn>
          <v-btn color="primary" @click.stop = "ApplyBtnClicked"   > Apply </v-btn>
        </div>
      </v-container>

    </div>

  </div>
</template>


<script setup lang="ts">
import {
  ref, shallowRef, reactive, computed,
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

//= 要 package.json 手動追加　dependencies
//    "@codemirror/state": "6.x",
//=
import { EditorState } from '@codemirror/state'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

const fmini_content_ref: any = inject('fmini_content_ref');
const fmini_stat_ref: any = inject('fmini_stat_ref');
const floatMinieditorRef: any = inject('floatMinieditorRef');
const startupFloatMinieditor: any = inject('startupFloatMinieditor');
const testFloatMinieditor: any = inject('testFloatMinieditor');
const showFloatMinieditor: any = inject('showFloatMinieditor');
const hideFloatMinieditor: any = inject('hideFloatMinieditor');
const cancelFloatMinieditor: any = inject('cancelFloatMinieditor');
const finishFloatMinieditor: any = inject('finishFloatMinieditor');


const actingEditRef = inject('actingEditRef');        // 2023.11.10
const actingEditEventRef = inject('actingEditEventRef');   // 2023.11.10
const colorPickerRef = inject('colorPickerRef');       // 2023.11.10

const extensions = [javascript(), oneDark];

// Codemirror EditorView instance ref
const mii_view_ref = shallowRef();



// 親コンポーネントから子コンポーネントに文字列、数値、配列やオブジェクトを渡す
const props = defineProps({ // I/F: 親⇒子のデータの受け渡し
  com_type: { // edit_svg | edit_html_tag | ..
    type: String,
    default: "edit_code_mirror",
  },

  // uuid: { // uuid は、このコンポーネントの一意の識別子です
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

  //= BEGIN 【廃止】 2023/11/02 2023.11.20
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
  //= END 【廃止】 2023/11/02 2023.11.20

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
    default: "z-code",
  },
  tag_type: { // html_singleton | html_paired | raw_html | null
    type: String,
    default: "code_mirror",
  },
  content: { // tag の中身
    type: String,
    default: "",
  },
})

console.log("@@@@@@@@ props: " + JSON.stringify(props, null, 2));

//=  2023.11.18 familyIdRef
const familyIdRef = defineModel<any>("familyIdRef", { local: true, default: null });
// const uuidRef = computed(() => { return `${props.com_type}.${familyIdRef.value}`; });   // 2023.12.10 旧仕様
const uuidRef = computed(() => { return `${familyIdRef.value}`; });   // 2023.12.10 お試し
console.log("######## uuidRef value: " + uuidRef.value);

watch(familyIdRef, (v) => {
  if (v) {
    // console.log(`familyIdRef changed to ${familyIdRef.value}`);
    // console.log(`    uuidRef.value: ${uuidRef.value}`);
    actingEditRef.value.uuid = uuidRef.value;
  }
})



const handleReady = (payload) => {
  console.log(";;;;;;;; handleReady");
  mii_view_ref.value = payload.view;

}


// Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
  console.log(";;;;;;;; getCodemirrorStates");
  const state = mii_view_ref.value.state;
  const ranges = state.selection.ranges
  const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
  const cursor = ranges[0].anchor
  const length = state.doc.length
  const lines = state.doc.lines
  // more state info ...
  // return ...
  // console.log('  state: ' + state);
  // console.log('  mii_view: ' + mii_view_ref.value);

  const editorView = mii_view_ref.value;
  console.log('  contentDOM: ' + editorView.contentDOM);

  //= TODO cursor が見えない
  // editorView.contentDOM.focus();
  editorView.focus();
  console.log('  focus を設定した');
}


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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editingObjRef = inject('editingObjRef');          // is_actived 系から移行させる
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateEditingObj = inject('updateEditingObj');    // function

const htmsvg_outer_ref: any = inject('edit_tiptap_ref');     // 2024.01.04b 単純に、直接的 SvgEditor.vue から inject する


const galaxy_ref = ref(null);     //
const earth_ref  = ref(null);     //
const moon_ref   = ref(null);     //

const mii_code_ref   = ref(floatMinieditorRef.value.src);   // !! 【注意】fmini_content_ref を無視している
const mii_holder_ref = ref('Code goes here...'); 
// console.log("$$$$ mii_holder_ref: " + mii_code_ref.value);

const able_pointed = defineModel<boolean>("able_pointed", { local: true, default: true })		// name able_pointed 使用, parent: v-model:able_pointed="able_pointed"

const menu_container_ref = ref(null);
const menu_area_ref = ref(null);
const menu_ref = ref<any>(null);

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


const b = ref({
  label: `..able is ${props.editing_uuid}, ap is ${able_pointed.value}; Plain Text`,
  placeholder: "Write text",
  icon: "$vuetify",
  text: `日本語漢字 カタカナ ひらがな english`,
});


defineExpose({
  // galaxy_ref,
})


const emitedPosSizeRef = defineModel<any>("emitedPosSizeRef", { local: true, default: null });  // 位置とサイズが確定した, 旧 emit pos_size_decided
const deletedRef = defineModel<any>("deletedRef", { local: true, default: null })

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


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


//= @click の位置、使える領域 :- e.clientXY - earth_ref.clientRect
//  v-menu
const my_just_ref = ref({ x: 0, y: 0, w: 0, h: 0 });
const attached_ref = ref('cmenuid' + getRandomInt(Number.MAX_SAFE_INTEGER));

const { current: currentKeySet } = useMagicKeys();

const onMeClick = (e: any) => {
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
  } else {
    console.log("  control key is not pressed, do nothing");

    //= do something test
    getCodemirrorStates();
  }
}

const cmenu = ref(false);  // ref でないと、後に mouse move しない限り、menu は描画されない

const cmenuItems = ref([              // cmenu 名前になった経緯: context menu(right click) ⇒ click menu TODO menu: nested-menu
  { id: 'who_am_i',           visible: true,   name: props.com_type + ' : '  + uuidRef.value },  //
  { id: 'off_able_pointer',   visible: false,  name: 'Disable Resize' },
  { id: 'on_able_pointer',    visible: false,  name: 'Enable Resize' },

  { id: 'cancel',             visible: true,   name: 'Cancel' },
  { id: 'save',               visible: true,   name: 'Save' },

  // TODO AI 機能
  // TODO 文字コード、改行コード変換
  // TODO diff view
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


const onCmenuItemClick = (cmd: any) => {
  console.log('^^^^^^^^^ id: ' + cmd.id + ' name: ' + cmd.name);

  var item = {}

  switch (cmd.id) {
    case 'who_am_i': break;
    case 'off_able_pointer':
      able_pointed.value = false;
      b.value.label = `..able is ${props.editing_uuid}, ap is ${able_pointed.value}; Plain Text`;   // debug
      break;
    case 'on_able_pointer':
      able_pointed.value = true;
      b.value.label = `..able is ${props.editing_uuid}, ap is ${able_pointed.value}; Plain Text`;   // debug
      break;
    case 'cancel':
      cancelFloatMinieditor();
      break;
    case 'save':
      floatMinieditorRef.value.src  = mii_code_ref.value;   // ソースコードは、
      fmini_content_ref.value       = mii_code_ref.value;   // 両方は同じです
      finishFloatMinieditor();  // set 'finish' to stat
      break;
    default:
      break;
  }

  menu_ref.value.isActive = false;
  cmenu.value = false;
}


const cancleBtnClicked = (e) => {
  cancelFloatMinieditor();                              // set '' to fmini_stat_ref
}

const ApplyBtnClicked = (e) => {
  console.log('ApplyBtnClicked');
  floatMinieditorRef.value.src  = mii_code_ref.value;   // ソースコードは、
  fmini_content_ref.value       = mii_code_ref.value;   // 両方は同じです
  finishFloatMinieditor();                              // set 'finish' to fmini_stat_ref
}


onMounted(async () => {
  await nextTick();
  console.log("$$$$ be mounted");
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


.editor_canvas {  /* earth */
  position: relative;
  display: block;

  background-color: v-bind("htmsvg_outer_ref.background_color") !important;   // 2023.12.16a Editorの背景色
  color: v-bind("htmsvg_outer_ref.color") !important;                         // 2023.12.16a Editorの前景色

  pointer-events: auto !important; /* galaxy で OFF したイベントを再開する */
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



</style>


<style>
/* 
  【暫】vue-codemirror.Codemirror corsor 表示障害:
      「 1  import    」 では [import   ]区間で corsor が表示されない
      原因は分らず、Debuger 解析 により取りあえず無理やり表示させる
 */
.ͼ1 .cm-cursor {
  display:flex !important;
  position: absolute !important;
}

.btn_bar {
  padding: 5px;
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-gap: 8px;
}
</style>