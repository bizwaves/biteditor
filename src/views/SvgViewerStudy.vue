
<!-- 
  TODO 2023-11-30 when load _generated.svg 
    Error: UnicodeEncodeError: 'cp932' codec can't encode character '\u2003' in position 93198: illegal…}er 
-->

<template>
  <div
    class = "galaxy"
    ref = "galaxy_ref" 
    title = "galaxy"
  >  

    <div display="none">
      <svg display="none">
        <desc>SVG DEFS-SYMBOL Library</desc>
      </svg>
    </div>


    <!-- BEGIN コンテンツ実体 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->

    <div
        ref   = "svg_outer_ref" 
        class = "svg_outer"
    >
      <!-- TODO   -->
      <svg ref = "moon_ref"
          xmlns = "http://www.w3.org/2000/svg"
          xmlns:xlink = "http://www.w3.org/1999/xlink"
          version = "1.1"
          :width = "cv.w"
          :height = "cv.h"
          :viewBox = "viewBox"
      >
        <!-- 
        方法 3) 「.innerHTML = 」in SvgDefs.vue, See SvgDefs.vue
                watch(svg_content_ref
                onMounted(
        方法 2) v-html: OK SvgDefs Top svg Tag を上書きしたくないので、不使用）
          v-html = "htmsvg_inner_ref"
      -->
        <SvgDefs 
              ref   = "mii_htmsvg_ref"
              class = "mii_svg" 
              v-model:svg_ref = "htmsvg_dom_ref"
              v-model:htmsvg_container_ref = "htmsvg_container_ref"
              v-model:svg_content_ref = "htmsvg_inner_ref"  
        >
        </SvgDefs>
      </svg> 

    </div>
    <!-- END コンテンツ実体 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->


    <div v-show="show_tool_bar"
        ref   = "resizing_container_ref"
        class = "able_outer"
    >
  		<Moveable
          ref                 = "moveable_ref"
          :target             = "resizing_container_ref"
          :draggable          = 'able_specs["Dra_Res"]["draggable"]'
          :throttleDrag       = 'able_specs["Dra_Res"]["throttleDrag"]'
  			  :edgeDraggable      = 'able_specs["Dra_Res"]["edgeDraggable"]'
          :startDragRotate    = 'able_specs["Dra_Res"]["startDragRotate"]' 
          :throttleDragRotate = 'able_specs["Dra_Res"]["throttleDragRotate"]'
  			  :resizable          = 'able_specs["Dra_Res"]["resizable"]' 
          :keepRatio          = 'able_specs["Dra_Res"]["keepRatio"]' 
          :throttleResize     = 'able_specs["Dra_Res"]["throttleResize"]'
  			  :renderDirections   = 'able_specs["Dra_Res"]["renderDirections"]' 
          :rotatable          = 'able_specs["Dra_Res"]["rotatable"]' 
          :throttleRotate     = 'able_specs["Dra_Res"]["throttleRotate"]'
  			  :rotationPosition   = 'able_specs["Dra_Res"]["rotationPosition"]' 
          @drag               = "onDrag_DraResRot" 
          @resize             = "onResize_DraResRot" 
          @rotate             = "onRotate_DraResRot" 
          />

    </div>


    <div v-if = "true"
      ref   = "earth_ref"
      class = "earth"
    >  
      <div v-show="show_tool_bar"
          title = "Press ESC key to Show This Operation Panel"
          class= "tool_bar"
      >

          <v-btn color="blue-grey" size="tiny" class="top_tool"
            @click="loadSvgFile()"
          > Load </v-btn>

          <v-btn color="blue-grey" size="tiny" class="top_tool"
            @click="hideToolBar"
          > Hide </v-btn>

          <v-btn color="blue-grey" size="tiny" class="top_tool"
            @click="printSvgToPdfFile()"
          > Print To PDF </v-btn>

          <v-btn color="blue-grey" size="tiny" class="top_tool"
            @click="inkscapePdf2Svg()"
          > Convert PDF To SVG </v-btn>

          <!-- TODO -->
          <v-btn v-if="false" color="blue-grey" size="tiny" class="top_tool"
          > Listup </v-btn>

          <v-text-field
              label="Doc. Path"
              placeholder="C:\\DOCs\\SvgEditor"
              solo
              v-model="selDocPathRef"
          ></v-text-field>

          <v-text-field
              label="Doc. File Name"
              placeholder="noname.html"
              prepend-icon="mdi-file-document"
              v-model="selDocFileRef"
          ></v-text-field>
      </div>

    </div>  <!-- END earth_ref -->

  </div>
</template>


<script setup lang="ts">
import {
  ref, reactive, computed,
  // defineExpose, defineProps, defineEmits,
  inject, onBeforeUpdate, watch, onMounted, onBeforeUnmount, nextTick
} from "vue";

import Moveable from "vue3-moveable";

import {
  useDraggable,
  useElementBounding,
  useEventListener,
  useMouse, useMousePressed, onKeyStroke, useMagicKeys, useMouseInElement, useParentElement, useElementSize, useActiveElement,
  whenever
} from '@vueuse/core'

// import { v4 as uuidv4 } from "uuid";
import { Buffer } from 'buffer';
import { Base64 } from "js-base64";

import SvgDefs from "../components/SvgDefs.vue"


const appSpecRef: any = inject("appSpecRef");
const userCfgRef: any = inject("userCfgRef");
const appCfgRef: any = inject("appCfgRef");
const dbConRef: any = inject("dbConRef");

const DelayMSecWakeUp: any = inject("DelayMSecWakeUp");

const showRouterBar: any = inject("showRouterBar");


const galaxy_ref    = ref(null);
const earth_ref     = ref(null);
const moon_ref      = ref(null);
const svg_outer_ref = ref(null);
const resizing_container_ref = ref(null);
const moveable_ref  = ref(null);


const familyZIndexRef = defineModel<any>("familyZIndexRef", { local: true, default: null });  // 2023.12.18a Family EdiyHtmlElem の z-index on EditHtmlFrame
console.log("######## familyZIndexRef value: " + familyZIndexRef.value);


//= svg | html 系統一的な変数
const mii_htmsvg_ref       = ref(null);  // 自分自身の ref
const htmsvg_dom_ref       = ref(null);  // defineModel svg_ref of SvgDefs.vue
const htmsvg_container_ref = ref(null);  // defineModel htmsvg_container_ref of SvgDefs.vue

const htmsvg_inner_ref = ref('<circle cx="200" cy="200" r="200" stroke="red" fill="#fff" stroke-width="2" />');    // defineModel svg_content of SvgDefs.vue

const selDocPathRef = ref(appCfgRef.value.doc_dir);       // 2023.11.30
watch(selDocPathRef, (v) => {                             // 2023.11.30
  appCfgRef.value.doc_dir = selDocPathRef.value;
})

const selDocFileRef = ref("noname.svg")

const show_tool_bar = ref(true);

const svg_uuid          = ref('');    // svg template （↓ id[]）を特定するための id
// const svg_xml_declaration = ref('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n');    // .svg 一行目


const able_specs = {};
able_specs["Dra_Res"] = {
  maxWidth: "auto",
  maxHeight: "auto",
  minWidth: "auto",
  minHeight: "auto",
  draggable: true,
  throttleDrag: 1,
  edgeDraggable: false,
  startDragRotate: 0,
  throttleDragRotate: 0,
  resizable: true,
  keepRatio: false,
  throttleResize: 1,
  renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
  rotatable: false,        // !!
  throttleRotate: 0,
  rotationPosition: "top",
}


const ct = computed(() => {
  let dom = galaxy_ref.value;
  let ct;
  if (dom) {
    ct = {
      x: dom.clientLeft,
      y: dom.clientTop,
      w: dom.clientWidth,
      h: dom.clientHeight,
    }
  } else {
    ct = {
      x: 0,
      y: 0,
      w: 320,
      h: 240,
    }
  }
  console.log("ct: " + JSON.stringify(ct));

  return ct;
});


const viewBoxStr = computed(() => {
  let dom = galaxy_ref.value;
  let ct;
  if (dom) {
    ct = {
      x: dom.clientLeft,
      y: dom.clientTop,
      w: dom.clientWidth,
      h: dom.clientHeight,
    }
  } else {
    ct = {
      x: 0,
      y: 0,
      w: 320,
      h: 240,
    }
  }
  console.log("ct: " + JSON.stringify(ct));

  let viewBox = `0 0 ${ct.w} ${ct.h}`;
  return viewBox;
});


const cv = ref({
  x: 0,
  y: 0,
  w: 320,
  h: 240,
});


const viewBox = computed(() => {
  let viewBox = `0 0 ${cv.value.w} ${cv.value.h}`;
  return viewBox;
});


// 親コンポーネントから子コンポーネントに文字列、数値、配列やオブジェクトを渡す
const props = defineProps({   // I/F: 親⇒子のデータの受け渡し
  com_type: {                 // edit_svg | edit_html_tag | ..
    type: String,
    required: false,
    default: "svg_viewer",
  },
  uuid: {                     // uuid は、このコンポーネントの一意の識別子です ↓debug 値
    type: String,             //    "47ecdd97-218c-4f5a-bb51-dec3ff87e6ad"
    required: false,
    default: 'svg_viewer',
  },
})


console.log("@@@@@@@@ SvgViewer props: " + JSON.stringify(props, null, 2));


const emit = defineEmits([
])


const { current: currentKeySet } = useMagicKeys();


const docFileName = () => {
  let fileName = selDocPathRef.value.endsWith('\\')
    ? selDocPathRef.value + selDocFileRef.value
    : selDocPathRef.value + '\\' + selDocFileRef.value;

  return fileName;
}

const hideToolBar = () => {
  showRouterBar.value = false;
  show_tool_bar.value = false;
}

const printSvgToPdfFile = async () => {
  showRouterBar.value = false;
  show_tool_bar.value = false;

  await new Promise(resolve => setTimeout(resolve, 1000));  // 必須ではないが、念のため

  nextTick(() => {
    create_content_pdf();
  });

  await new Promise(resolve => setTimeout(resolve, 60000));  // !! 必須ではないが、念のため
  showRouterBar.value = true;
  show_tool_bar.value = true;    
}



async function inkscapePdf2Svg() {
  //=
  //  PS C:\Users\nakan> inkscape -o C:\DOCs\SvgEditor\exam02_inkscape.svg  C:\DOCs\SvgEditor\exam02.pdf
  //  【前提】環境変数path 設定 C:\Program Files\Inkscape\bin
  //  参照: https://wiki.inkscape.org/wiki/Using_the_Command_Line
  //=
  let pdfname = docFileName();
  // pdfname = pdfname.replace('.svg', '.pdf');
  console.log("inkscapePdf2Svg " + pdfname);
  const stem = pdfname.replace('.pdf', '');

  const payload = JSON.stringify(
    {
      cmd: 'inkscape',
      options: {
        'sys_path': appCfgRef.value.inkscape_bin_dir, // 実行エラー ⇒ 環境変数 path の設定した前提で実行すること
        'bin_file': appCfgRef.value.inkscape_bin_file,
        'out_stem': `${stem}_converted`
      }
    }
  )

  const content = Buffer.from(payload).toString('base64');

  const sendData = {
    fileName: pdfname,
    content: content
  };
  const result = await window.unipyapi.pdf2Svg(sendData);
  console.log("inkscapePdf2Svg result: " + JSON.stringify(result));
}



const { escape } = useMagicKeys();

watch(escape, (v) => {
  showRouterBar.value = true;
  show_tool_bar.value = true;
})


async function create_content_pdf() {
  console.log('$$$$ ~~~~~~~~ printToPdfFile');
  const fileName = docFileName();
  const pdfname = fileName.replace('.svg', '.pdf');

  await window.sysapi.printWinContentsToPdf(pdfname);
}



async function loadSvgFile() {
  const fileName = docFileName();

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
    htmsvg_inner_ref.value = svgHtml;
    // console.log("htmsvg_inner_ref.value: ");
    // console.log(htmsvg_inner_ref.value);

    //= 方法 1) innerHTML: OK
    // htmsvg_container_ref.value.innerHTML = htmsvg_inner_ref.value;
  } else {
    console.log(" Bad readSvgFile result: " + JSON.stringify(result));
  }
}


const onDrag_DraResRot = e => {
  console.log(`onDrag left: ${e.left}px top: ${e.top}px`);
  cv.value.x = e.left;
  cv.value.y = e.top;
  e.target.style.transform = e.transform;
};
const onResize_DraResRot = e => {
  console.log(`onResize width: ${e.width}px height: ${e.height}px`);
  cv.value.w = e.width;
  cv.value.h = e.height;
  e.target.style.width = `${e.width}px`;
  e.target.style.height = `${e.height}px`;
  e.target.style.transform = e.drag.transform;
};
const onRotate_DraResRot = e => {
  e.target.style.transform = e.drag.transform;
};


onMounted(async () => { // after DOM nodes be inserted
  await nextTick();
  showRouterBar.value = false;
})


onBeforeUnmount(() => {
})

</script>



<style lang="scss" scoped>

.galaxy {
  position: relative;
  display: block;
  // width: 100%;
  // height: 100%;
  width: v-bind("cv.w + 'px'");
  height: v-bind("cv.h + 'px'");
  border: 8px solid silver;  /* Debug */
}

.earth {
  position:absolute;
  display: block;
  left: 0px;
  top: 0px;
  margin-left: 5%;
  margin-top: 64px;
  width: 90%;
  color:whitesmoke;
  // border: 8px solid green;  /* Debug */
}

.tool_bar {
  position: relative;
  display: block;
  border: 1px solid goldenrod;  /* Debug */
  background-color: gray;
}

.top_tool {
  margin-top: 2px;
  margin-bottom: 2px;
  margin-left: 4px;
  margin-right: 4px;
}

.mii_svg {
  pointer-events:none;
}

.svg_outer {
  position: relative;
  display: block;
  // border: 8px solid blue; /* Debug */
}

.able_outer {
  position:absolute;
  display: block;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  color:black;
  // border: 8px solid red;  /* Debug */
}



</style>