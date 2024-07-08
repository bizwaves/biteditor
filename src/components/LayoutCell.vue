<template>
  <!-- 
    親 Container (layoutor_container) Required:
      - position: relative ※想定
      - display: grid | _
    TODO:
  -->
  <ElementBounding 
        ref = "mi_ref" 
        class = "lay-cell-bound html_events" 
        v-slot = "{x, y, top, right, bottom, left, width, height }"
        v-element-size = "onLayCEllResize" 
  >

    <!-- ↓ Cell: Design Tool: unit 単位切り替え, _
      TODO: 

    -->
    <div
        ref     = "layouted_frame_ref content" 
        class   = "layout-cell-frame html_events" 
        :title  = "mouseInMi ? 'layout_cell_frame!' : 'layout_cell_frame'"
        @click  = "onLayoutedFrameClick"
    >

      <div v-show = "showDbgInfo" 
        title = "layout cell debug info"
        class = "layout-cell-debug-info"
      >
        <v-text-field clearable
          ref = "area_in_ref"
          v-model = "area"
          hide-details="auto"
          label = "area"
          placeholder = "."
        ></v-text-field>
        <br>
        【Laylut Cell】Keys: . / <br>
        idx:      {{ props.idx       }} - enable: {{ props.enable     }} <br>
        area:     {{ props.layoutor.layCell[props.idx]["area"] }} <br>
        uuid:     {{ props.uuid      }} <br>
        content:  {{ props.content   }} <br>
        i:        {{ props.i         }} - j:        {{ props.j          }} <br>
        row:      {{ layTmpl('row')  }} - col:      {{ layTmpl('col')   }} <br>
        w:        {{ parseInt(width) }} x h:        {{ parseInt(height) }} <br>
        x:        {{ parseInt(x)     }} - y:        {{ parseInt(y)      }} <br>
        left:     {{ parseInt(left)  }} - top:      {{ parseInt(top)    }} <br>
        right:    {{ parseInt(right) }} - bottom:   {{ parseInt(bottom) }} <br>
      </div>

      <div v-show = "!showDbgInfo" 
          title = "layout cell"
          class = "layout-cell-hon-container"
      >

        <v-text-field clearable
          ref = "area_in_ref"
          v-model = "area"
          hide-details="auto"
          label="area"
          placeholder="."
        ></v-text-field>


        <div class="cell-op-bar html_events">
          <v-btn color = "primary"
            title="１列を挿入します"
            @click="makeRequest('+C')"
          >
            +C
          </v-btn>

          <v-btn color = "warning"
            title="１列を削除します"
            @click="makeRequest('-C')"
          >
            -C
          </v-btn>

          <v-btn color = "warning"
            title="１行を削除します"
            @click="makeRequest('-R')"
          >
            -R
          </v-btn>

          <v-btn color = "secondary"
            title="１行を挿入します"
            @click="makeRequest('+R')"
          >
            +R
          </v-btn>
        </div>


        <div class="cell-text-info">
<pre>
【Cell】
Key /  Items表示へ切り替え
uuid:  {{ props.uuid }} 
i:     {{ props.i + 1}}        
j:     {{ props.j + 1}} 
w:     {{ parseInt(width) }}  
h:     {{ parseInt(height) }} 
left:  {{ parseInt(left) }}  
top:   {{ parseInt(top) }}
right: {{ parseInt(right)  }} 
bottom:{{ parseInt(bottom) }} 
</pre> 
        </div>

      </div>

    </div>

    <!-- ↓ H-リサイズ用のドラッグハンドル -->
    <div v-show = "props.dragH" ref="dragH_ref"
      p = "x-4 y-2"
      shadow = "~ hover:lg"
      class = "lay_cell_h_drag"
      title = "H-Draggable"
      @mousedown = "onLayCellHDrMouseDown($event, 'x')"
    >
    </div>

    <!-- ↓ V-リサイズ用のドラッグハンドル -->
    <div v-show = "props.dragV" ref="dragV_ref"
      p = "x-4 y-2"
      shadow = "~ hover:lg"
      class = "lay_cell_v_drag"
      title = "V-Draggable"
      @mousedown = "onLayCellHDrMouseDown($event, 'y')"
    >
    </div>
    
  </ElementBounding>
</template>



<script setup lang="ts">

import {
  effectScope, getCurrentScope, onScopeDispose, markRaw, toRaw, reactive, shallowReactive, shallowReadonly, isReactive, computed, shallowRef, triggerRef, customRef, ref, unref, toRef, toRefs, isRef,
  // defineExpose, defineProps, defineEmits,
  inject, onBeforeUpdate, watch, onMounted, onUnmounted, onBeforeUnmount, nextTick
} from "vue";

import {
  onKeyStroke, useMouse, useMousePressed, useMouseInElement, useElementSize, useElementBounding, useResizeObserver
} from '@vueuse/core'
import { vElementSize } from "@vueuse/components"; // v-element-size
import { UseElementBounding as ElementBounding } from "@vueuse/components"
import { UseDraggable as Draggable } from '@vueuse/components'

import { v4 as uuidv4 } from "uuid"; // このuuid の代り、独自のルールで共通的作成する

const isDevModeRef = inject("isDevModeRef");
const isPreviewModeRef = inject('isPreviewModeRef');

const genInDataB = inject('genInDataB');
const updateGenInDataB = inject('updateGenInDataB');



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  // I/F: 親⇒子のデータの受け渡し
  uuid: {
    // uuid は、このコンポーネントの一意の識別子です
    type: String,
    default: null,
  },
  dragH: {
    type: Boolean,
    required: true,
    default: true,
  },
  dragV: {
    type: Boolean,
    required: true,
    default: true,
  },
  idx: {
    type: Number,
    required: true,
    default: 0,
  },
  i: {
    type: Number,
    required: true,
    default: 0,
  },
  j: {
    type: Number,
    required: true,
    default: 0,
  },
  layoutor: {
    type: Object,
    required: true,
    default: null,
  },
  content: {
    type: String,
    required: true,
    default: "undefined",
  },

});


const htmsvg_outer_ref = defineModel<any>("htmsvg_outer_ref", { local: true, default: null });  // 2024.01.06a 親の colors を参照するため


const mi_ref = ref(null);
const layouted_frame_ref = ref(null);
const area_in_ref = ref(null);

const dragH_ref = ref(null);
const dragV_ref = ref(null);

const mouseDragH = reactive(useMouseInElement(dragH_ref));
const mouseDragV = reactive(useMouseInElement(dragV_ref));


const dragOver = -2;
const dragReserve = 4;
const dragBand = 8;


//= TODO model へ移行
//  追加項目の表示は違うため
const showDbgInfo = ref(false);     // !! false := 本番 | true := Debug 時, 参考 Global isDevModeRef
// onKeyStroke(['D'], (e) => {
//   console.log('onKeyStroke D');
//   e.preventDefault();
//   showDbgInfo.value = !showDbgInfo.value;
// })

// watch(activeElement, (el) => {
//   console.log('focus changed to', el)
// })


const mouseInMi = reactive(useMouseInElement(layouted_frame_ref));
watch(mouseInMi, (el) => {
  if (!mouseInMi.isOutside) {
    // console.log('mouseInMi changed to', el)
  }
})


onKeyStroke('Enter', (e) => {
  console.log('#### onKeyStroke Enter, pressed on area_in_ref');
  e.preventDefault();
  area_in_ref.value.blur();
  emit("areaTextChanged", props.i, props.j, props.idx, props.uuid, area.value);
}, { target: area_in_ref })


onBeforeUpdate(() => {
  // childRefs.value = []; 画面に更新処理が走る度に、テンプレート参照を格納した配列に参照がpushされてしまいます。そのため、更新前に配列を初期化する必要があります。
});


const emit = defineEmits([
  "cellResize",
  "cellSizeChanged",
  "areaTextChanged",
  "request"
]);


const layCellSize = ref( {
    w: 0,
    h: 0,
} );

const emitCellSizeChanged = () => {   // レンダリングされたサイズを親に通知
  const changed = {
    idx: props.idx,
    i: props.i,
    j: props.j,
    w: layCellSize.value.w,
    h: layCellSize.value.h,
  };

  emit("cellSizeChanged", changed);
}


const makeRequest = (req) => {
  const rc = {
    req: req,
    idx: props.idx,
    i: props.i,
    j: props.j,
    uuid: props.uuid,
  };

  emit("request", rc);
}


const area = ref(props.layoutor.layCell[props.idx]["area"]);
watch(area, (val, oldVal) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.layoutor.layCell[props.idx]["area"] = val;
});


const layCellResizeReq = ref( {
    resizing: false,
    serialNo: 0,      // 0 := start 1 := 初回 mouse x/y 通知, 2 ..
    direction: "x",   // 'x' or 'y'
    initial: {
      mosX: 0,        // マウス初期位置
      mosY: 0,        // マウス初期位置
    },
    dx: 0,            // マウス移動量, === x - initial.mosX
    dy: 0,            // マウス移動量, === y - initial.mosY
} );


 

const emitResize = (state) => {   // Drag リサイズ Req. を親に通知
  const rc = {
    state: state,
    serialNo: layCellResizeReq.value.serialNo,
    idx: props.idx,
    i: props.i,
    j: props.j,
    direction: layCellResizeReq.value.direction,
    dx: layCellResizeReq.value.dx,
    dy: layCellResizeReq.value.dy,
  };

  emit("cellResize", rc);
}

function onLayCEllResize( { width, height} ) {
  layCellSize.value.w = width;
  layCellSize.value.h = height;
  console.log("; onLayCEllResize", width, height);
  emitCellSizeChanged();
}

const onLayCellHDrMouseDown = (e, direction) => {
    // console.log("; ---- onLayCellCtrlMouseDown " + e.type + " direction: " + direction + " x: " + e.x  + " y: " + e.y + " clientX: " + e.clientX  + " clientY: " + e.clientY);
    let lc = layCellResizeReq.value;
    lc.resizing = true;
    lc.direction = direction; // 'x' or 'y'

    //= 対策: y-pos 突変 when start ⇒ doing 
    //  start 時の mouse x/y は不使用に変更した
    //=
    // lc.initial.mosX = e.x;
    // lc.initial.mosY = e.y;
    lc.initial.mosX = null;
    lc.initial.mosY = null;

    lc.dx = 0;
    lc.dy = 0;
    lc.serialNo = 0;
    emitResize('start');
}


//= onLayCellHDrMouseUp は、Mouse Point が外れた時に動作しないので、useMousePressed にて実装する
const { pressed } = useMousePressed();
watch(pressed, (pressed) => {
    if (!pressed) {
        let lc = layCellResizeReq.value;
        if (lc.resizing) {
            lc.resizing = false;    // !!
            lc.serialNo += 1;
            emitResize('end');      // dx, dy を更新しないことに注意
        }
    }
});

const { x, y, sourceType } = useMouse();

watch([x, y, sourceType], ([x, y, sourceType]) => {
    let lc = layCellResizeReq.value;
    if (!lc.resizing) {
        return;
    }

    // console.log(";;⇒ MouseMove: x = " + x + " y = " + y + " " + sourceType);
    if (lc.initial.mosX == null || lc.initial.mosY == null) {
      lc.initial.mosX = x;
      lc.initial.mosY = y;
      lc.serialNo = 1;
    } else {
      lc.serialNo += 1;
    }

    lc.dx = x - lc.initial.mosX;
    lc.dy = y - lc.initial.mosY;
    // console.log(";;;;⇒ dx : " + lc.dx + " dy : " + lc.dy + " mosX : " + lc.initial.mosX + " mosY : " + lc.initial.mosY);

    emitResize('doing');
});


const layTmpl = (direction) => {
  // console.log("layTmpl: " + direction);
  let tmpl = "--";
  const layoutor = props.layoutor;
  const layter = direction === 'row' ? layoutor.layRow : layoutor.layCol;
  const index = direction === 'row' ? props.i: props.j;
  const track = layter[index];
  const unit = track.unit;
  tmpl = track.dc[unit] === undefined? unit : track.dc[unit] + unit;
  return tmpl;
}
 

const onLayoutedFrameClick = (e) => {
  console.log("onLayoutedFrameClick: " + e.type);
  e.stopPropagation();
  let strData = JSON.stringify({name: "LayCell", data: {i: props.i, j: props.j}});
  updateGenInDataB(strData)
}


const whoami = () => {
  return { idx: props.idx, i : props.i, j : props.j, uuid: props.uuid };
}

defineExpose({
  whoami,         // !!
})

onMounted(async () => { // after DOM nodes be inserted
  await nextTick();
  console.log(props.com_type + " " + props.uuid + " is mounted!");
});

onBeforeUnmount(() => {
  // Vue 2.x beforeDestroy
  // console.log(props.com_type + " " + props.uuid + " is beforeUnmount!");
  // document.removeEventListener("keydown", onKeyDown);
});

</script>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "LayoutCell",
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

.lay-cell-bound { // galaxy
    // root 要素は background-color 等は !important がなければ設定出来ず、親側で設定する必要であることに注意
    pointer-events: auto;
    position: relative;
    display: block;
    background-color: rgba(0, 0, 0, 0) !important;

    // outline: 1px solid rgba(255, 0, 0, 0.25);
    // margin: 1px;
}

.layout-cell-frame {
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

    // color: rgba(250, 235, 215, 0.9);
    // background-color: rgb(22, 69, 75);
    // border: 7px solid rgba(255, 128, 128, 0.25);  /* !! Debug */
}

.layout-cell-debug-info {
    position: relative;
    display: block;
}

.lay_cell_h_drag {
    pointer-events: v-bind("htmsvg_outer_ref.lauout_mode? 'auto' : 'none'");
    position: absolute;
    right: v-bind("`${dragOver}px`");
    top: v-bind("`${dragReserve}px`");
    bottom: v-bind("`${dragReserve}px`");
    width: v-bind("`${dragBand}px`");
    background-color: v-bind("mouseDragH.isOutside  ? 'rgba(33, 33, 33, 0.5)' : 'rgba(255, 217, 0, 1.0)'");
    outline: 1px solid rgba(255, 255, 255, 0.4);
    cursor: v-bind("mouseDragH.isOutside ? 'move' : 'col-resize'");
}

.lay_cell_v_drag {
    pointer-events: v-bind("htmsvg_outer_ref.lauout_mode ? 'auto' : 'none'");
    position: absolute;
    bottom: v-bind("`${dragOver}px`");
    left: v-bind("`${dragReserve}px`");
    right: v-bind("`${dragReserve}px`");
    height: v-bind("`${dragBand}px`");
    background-color: v-bind("mouseDragV.isOutside  ? 'rgba(33, 33, 33, 0.5)' : 'rgba(255, 217, 0, 1.0)'");
    outline: 1px solid rgba(255, 255, 255, 0.4);
    cursor: v-bind("mouseDragV.isOutside ? 'move' : 'row-resize'");
}

.cell-op-bar {
  margin-top: 4px;
  margin-bottom: 4px;
  padding-left: 4px;
  padding-right: 4px;
  display: grid;
  width: 100%;
  grid-template-columns: auto auto auto auto;
  justify-content: space-between;

}

.cell-text-info {
  pointer-events: None;
  position: absolute;
  overflow: clip;
  left: 8px;
  right: 12px;
  top: 7em;
  bottom: 1em;
  border: 1px gray solid;
  border-radius: 5%;
}

</style>
