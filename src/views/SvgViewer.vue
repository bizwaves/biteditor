
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

    <div v-show = "test_print_mode > 0"
      class = "test_page"
    >
      {{ "pt.w: " + pt.w + " pt.h: " + pt.h }}<br>
      {{ viewBox }}
    </div>

    <!-- BEGIN コンテンツ実体 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <div
        ref   = "svg_outer_ref" 
        class = "svg_outer"
    >
      <!-- TODO   -->
      <svg v-show = "test_print_mode != 1"
          ref = "moon_ref" 
          xmlns = "http://www.w3.org/2000/svg"
          xmlns:xlink = "http://www.w3.org/1999/xlink"
          version = "1.1"
          :width = "pt.w"
          :height = "pt.h"
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

    <div
      ref   = "earth_ref"
      class = "earth"
    >  
      <div v-show="util_working_mode"
          title = "Press ESC key to Show This Operation Panel"
          class= "util_frame"
      >

        <v-card class="group_card text-body-2" color="black" >
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
              @click="printHtmSvgToPdfFile()"
            > Print File To PDF </v-btn>

            <v-btn color="blue-grey" size="tiny" class="top_tool"
              @click="inkscapePdf2Svg()"
            > Convert PDF To SVG </v-btn>

            <!-- TODO -->
            <v-btn v-if="false" color="blue-grey" size="tiny" class="top_tool"
            > Listup </v-btn>

            <v-text-field
                label="Doc. Path"
                placeholder="C:\\DOCs\\SvgEditor"
                clearable dense
                v-model="selDocPathRef"
            ></v-text-field>

            <v-text-field
                label="Doc. File Name"
                placeholder="exam2023.svg"
                prepend-icon="mdi-file-document"
                clearable dense
                v-model="selDocFileRef"
            ></v-text-field>

            <div class="msg_received"> {{ msgReceivedRef }} </div>
        </v-card>
        

        <v-card class="group_card text-body-2" color="black">
          <v-card-title>Contents Viewer</v-card-title>

          <v-row>
            <v-col>
              <v-container>
                <v-combobox
                  v-model="selPaperRef.name"
                  :items="Object.keys(DefPaperSize)"
                  label="Paper Size"
                ></v-combobox>

                <v-combobox
                  v-model="selPaperRef.name"
                  :items="Object.keys(DefPaperSize)"
                  label="Paper Size"
                ></v-combobox>

                <v-radio-group v-model="selPaperRef.landscape">
                  <v-radio label="tlandscape" :value="true"></v-radio>
                  <v-radio label="portrait" :value="false"></v-radio>
                </v-radio-group>

                <div>Test Print</div>
                <v-radio-group v-model="test_print_mode">
                  <v-radio label="Contents Only" :value="0"></v-radio>
                  <v-radio label="Test Data only" :value="1"></v-radio>
                  <v-radio label="Test Data and Contents" :value="2"></v-radio>
                </v-radio-group>
              </v-container>
            </v-col>

            <v-col>
              <v-container>
                <div>
                  <v-slider
                    v-model="utilityPanelOpacity"
                    :min="0.0"
                    :max="1.0"
                    :step="0.01"
                    thumb-label
                    color="white"
                    label="Opacity"
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        v-model="utilityPanelOpacity"
                          type="number"
                          style="width: 100px"
                          density="compact"
                          hide-details
                          variant="outlined"
                      ></v-text-field>
                    </template>
                  </v-slider>
                </div>        

                <div>
                  <v-slider
                    v-model="selScaleRef"
                    :min="1.0"
                    :max="2.5"
                    :step="0.25"
                    thumb-label
                    color="orange"
                    label="Display Scale"
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        v-model="selScaleRef"
                          type="number"
                          style="width: 100px"
                          density="compact"
                          hide-details
                          variant="outlined"
                      ></v-text-field>
                    </template>
                  </v-slider>
                </div>

                <div>
                  <v-slider
                    v-model="svgViewboxScaleRef"
                    :min="0.25"
                    :max="10"
                    :step="0.25"
                    thumb-label
                    color="red"
                    label="Viewbox Scale" 
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        v-model="svgViewboxScaleRef"
                          type="number"
                          style="width: 100px"
                          density="compact"
                          hide-details
                          variant="outlined"
                      ></v-text-field>
                    </template>
                  </v-slider>
                </div>

                <div>
                  <v-slider
                    v-model="svgMargingRef.left"
                    :min="-128"
                    :max="128"
                    :step="16"
                    thumb-label
                    color="blue"
                    label="Marging Left" 
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        v-model="svgMargingRef.left"
                          type="number"
                          style="width: 100px"
                          density="compact"
                          hide-details
                          variant="outlined"
                      ></v-text-field>
                    </template>
                  </v-slider>
                </div>

                <div>
                  <v-slider
                    v-model="svgMargingRef.top"
                    :min="-128"
                    :max="128"
                    :step="16"
                    thumb-label
                    color="blue"
                    label="Marging Top" 
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        v-model="svgMargingRef.top"
                          type="number"
                          style="width: 100px"
                          density="compact"
                          hide-details
                          variant="outlined"
                      ></v-text-field>
                    </template>
                  </v-slider>
                </div>
                
              </v-container>
            </v-col>
          </v-row>       
        </v-card>


        <v-card class="group_card text-body-2" color="black">
          <v-card-title>Print To PDF</v-card-title>

          <v-row>
            <v-col>
              <v-container>
                <v-combobox
                  v-model="pdfOpts.pageSize"
                  :items="Object.keys(DefPaperSize)"
                  label="Paper Size"
                ></v-combobox>

                <div>
                  <v-slider
                    v-model="pdfOpts.scale"
                    :min="0.1"
                    :max="2.0"
                    :step="0.1"
                    thumb-label
                    color="orange"
                    label="Scale"
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        v-model="pdfOpts.scale"
                          type="number"
                          style="width: 100px"
                          density="compact"
                          hide-details
                          variant="outlined"
                      ></v-text-field>
                    </template>
                  </v-slider>
                </div>

                <v-container>
                  <div>Orientation</div>
                  <v-radio-group v-model="pdfOpts.landscape">
                    <v-radio label="tlandscape" :value="true"></v-radio>
                    <v-radio label="portrait"   :value="false"></v-radio>
                  </v-radio-group>
                </v-container>

                <v-container>
                  <v-row>
                    <v-col><v-checkbox
                      v-model="pdfOpts.printBackground"
                      label="Print Background"
                      color="red"
                      hide-details
                    ></v-checkbox></v-col>

                    <v-col><v-checkbox
                      v-model="pdfOpts.displayHeaderFooter"
                      label="Display Header Footer"
                      color="red"
                      hide-details
                    ></v-checkbox></v-col>
                  </v-row>

                  <v-row>
                    <v-col><v-checkbox
                      v-model="pdfOpts.preferCSSPageSize"
                      label="Prefer CSS Page Size"
                      color="red"
                      hide-details
                    ></v-checkbox></v-col>

                    <v-col><v-checkbox
                      v-model="pdfOpts.generateTaggedPDF"
                      label="Generate Tagged PDF"
                      color="red"
                      hide-details
                    ></v-checkbox></v-col>
                  </v-row>
                </v-container>
              </v-container>
            </v-col>
            
            <v-col>
              <v-container>
                <v-card color="black">
                  <v-card-title>Margin</v-card-title>
                  <v-container>
                    <v-row>
                      <v-col> <v-text-field label="left"   v-model="pdfOpts.margins.left"    type="number" placeholder="単位：インチ" clearable hide-details="auto" dense ></v-text-field> </v-col>
                      <v-col> <v-text-field label="right"  v-model="pdfOpts.margins.right"   type="number" placeholder="単位：インチ" clearable hide-details="auto" dense ></v-text-field> </v-col>
                    </v-row>
                    <v-row>
                      <v-col> <v-text-field label="top"    v-model="pdfOpts.margins.top"     type="number" placeholder="単位：インチ" clearable hide-details="auto" dense ></v-text-field> </v-col>
                      <v-col> <v-text-field label="bottom" v-model="pdfOpts.margins.bottom"  type="number" placeholder="単位：インチ" clearable hide-details="auto" dense ></v-text-field> </v-col>
                    </v-row>
                  </v-container>    
                </v-card>
                
                <v-card color="black">
                  <v-card-title>Other</v-card-title>
                  <v-container>
                    <v-row><v-col> <v-text-field label="Page Ranges" v-model="pdfOpts.pageRanges" placeholder='印刷するページ範囲。例："1-5, 8, 11-13"。"" は全ページ' clearable hide-details="auto" dense ></v-text-field> </v-col></v-row> 
                    <v-row><v-col> <v-text-field label="Header Template" v-model="pdfOpts.headerTemplate" placeholder='ヘッダーの HTML テンプレート' clearable hide-details="auto" dense ></v-text-field> </v-col></v-row> 
                    <v-row><v-col> <v-text-field label="Footer Template" v-model="pdfOpts.footerTemplate" placeholder='フッターの HTML テンプレート' clearable hide-details="auto" dense ></v-text-field> </v-col></v-row> 
                  </v-container>
                </v-card>
              </v-container>
            </v-col>
          </v-row>

        </v-card>

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

import { dbCfgStore } from '@/store/db_cfg' // .ts は省略可
import { storeToRefs } from 'pinia'

import SvgDefs from "../components/SvgDefs.vue"
import { h } from "vue";


const appSpecRef: any = inject("appSpecRef");
const userCfgRef: any = inject("userCfgRef");
const appCfgRef: any = inject("appCfgRef");
const dbCfgRef: any = inject("dbCfgRef");
const dbConRef: any = inject("dbConRef");

const DelayMSecWakeUp: any = inject("DelayMSecWakeUp");

const showRouterBar: any = inject("showRouterBar");


const util_working_mode = ref(true);  // true: 作業モード, false: 印刷モード（余計なもの非表示）
const test_print_mode = ref(0);       // 0: SVG のみ, 1: テスト情報のみ印刷 2: 混合（SVG ＋ テスト情報）

const galaxy_ref    = ref(null);    //
const earth_ref     = ref(null);    //
const moon_ref      = ref(null);    //
const svg_outer_ref = ref(null);    //


const show_toolbar_ref = ref(false);  // show | hide 2023.12.25b

const familyZIndexRef = defineModel<any>("familyZIndexRef", { local: true, default: null });  // 2023.12.18a Family EdiyHtmlElem の z-index on EditHtmlFrame
console.log("######## familyZIndexRef value: " + familyZIndexRef.value);


//= svg | html 系統一的な変数
const mii_htmsvg_ref       = ref(null);  // 自分自身の ref
const htmsvg_dom_ref       = ref(null);  // defineModel svg_ref of SvgDefs.vue
const htmsvg_container_ref = ref(null);  // defineModel htmsvg_container_ref of SvgDefs.vue

const htmsvg_inner_ref = ref('<circle cx="200" cy="200" r="200" stroke="rgba(0,0,0,0.2)" fill="#fff" stroke-width="1" />');    // defineModel svg_content of SvgDefs.vue

const selDocPathRef = ref(appCfgRef.value.doc_dir);       // 2023.11.30
watch(selDocPathRef, (v) => {                             // 2023.11.30
  appCfgRef.value.doc_dir = selDocPathRef.value;
})

const selDocFileRef = ref("exam2023.svg")

const msgReceivedRef = ref('');  // 2023.12.23a


const svg_uuid = ref('');    // svg template （↓ id[]）を特定するための id
// const svg_xml_declaration = ref('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n');    // .svg 一行目


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

const value = ref('foo');
const items = ['foo', 'bar', 'fizz', 'buzz'];

const DefPaperSize = {  // 用紙サイズ定義, 単位: mm
  A6: {
    w: 105,
    h: 148,
  },
  A5: {
    w: 148,
    h: 210,
  },
  A4: {
    w: 210,
    h: 297,
  },
  A3: {
    w: 297,
    h: 420,
  },
  A2: {
    w: 420,
    h: 594,
  },
  A1: {
    w: 594,
    h: 841,
  },
  A0: {
    w: 841,
    h: 1189,
  },
  B6: {
    w: 128,
    h: 182,
  },
  B5: {
    w: 182,
    h: 257,
  },
  B4: {
    w: 250,
    h: 353,
  },
  B3: {
    w: 353,
    h: 500,
  },
  B2: {
    w: 500,
    h: 707,
  },
  B1: {
    w: 707,
    h: 1000,
  },
  B0: {
    w: 1000,
    h: 1414,
  },
  C4: {
    w: 229,
    h: 324,
  },
  C3: {
    w: 324,
    h: 458,
  },
  C2: {
    w: 458,
    h: 648,
  },
  C1: {
    w: 648,
    h: 917,
  },
  C0: {
    w: 917,
    h: 1297,
  },
  Letter: {
    w: 216,
    h: 279,
  },
  Legal: {
    w: 216,
    h: 356,
  },
  Tabloid: {
    w: 279,
    h: 432,
  },
  Ledger: {
    w: 432,
    h: 279,
  },
  Executive: {
    w: 191,
    h: 254,
  },
  Postcard: {
    w: 100,
    h: 148,
  },
  Envelope: {
    w: 162,
    h: 229,
  },
  EnvelopeMonarch: {
    w: 98,
    h: 191,
  },
  EnvelopeC5: {
    w: 162,
    h: 229,
  },
  EnvelopeDL: {
    w: 110,
    h: 220,
  },
  EnvelopeC3: {
    w: 324,
    h: 458
  },
};


const selPaperRef = ref({ // 選択された用紙サイズ
  name: 'A4',
  landscape: false,   // false: portrait 縦, true: landscape 横
});

const selPaperSize = computed(() => {            // { w: 210, h: 297 } when A4 portrait
  let paper = DefPaperSize[selPaperRef.value.name];
  if (selPaperRef.value.landscape) {
    return {
      w: paper.h,
      h: paper.w,
    }
  } else {
    return {
      w: paper.w,
      h: paper.h,
    }
  }
});

const displayDpi =96;           // Windows 10 のディスプレイの dpi は 96 で固定
const selScaleRef = ref(1.5);   // windows display 設定 scale, 1.5: 150% ⇒ 96 * 1.5 = 144 dpi

const pt = computed(() => {     // 用紙サイズ（mm）を pixel に変換
  let pt = {
    w: Math.round(selPaperSize.value.w * selScaleRef.value * displayDpi / 25.4),  // 例: 210 * 1.5 * 96 / 25.4 = 1191
    h: Math.round(selPaperSize.value.h * selScaleRef.value * displayDpi / 25.4),  // 例: 297 * 1.5 * 96 / 25.4 = 1684
  }
  console.log("pt: " + JSON.stringify(pt));

  return pt;
});


const svgViewboxScaleRef = ref(1.0);  // svg width(height) に対する viewbox w(h) の倍率

const st = computed(() => {
  let st = {
    w: Math.round(pt.value.w * svgViewboxScaleRef.value),
    h: Math.round(pt.value.h * svgViewboxScaleRef.value),
  }
  console.log("st: " + JSON.stringify(st));

  return st;
});

const pxW = computed(() => {
  return `${pt.value.w}px`;
});
const pxH = computed(() => {
  return `${pt.value.h}px`;
});

const viewBox = computed(() => {
  let viewBox = `0 0 ${st.value.w} ${st.value.h}`;
  return viewBox;
});


const utilityPanelOpacity = ref(0.9);  // 0.0 - 1.0


const svgMargingRef = ref({left : 0, top : 0});  // px


//= PDF 出力時のサイズなどを設定
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
  util_working_mode.value = false;
}

const printSvgToPdfFile = async () => {
  showRouterBar.value = false;
  util_working_mode.value = false;

  //= copy pdfOpts.value to options
  const options = JSON.parse(JSON.stringify(pdfOpts.value));

  await new Promise(resolve => setTimeout(resolve, 1000));  // 必須ではないが、念のため
  
  nextTick(() => {
    create_content_pdf(options);
  });

  await new Promise(resolve => setTimeout(resolve, 60000));  // !! 必須ではないが、念のため
  showRouterBar.value = true;
  util_working_mode.value = true;    
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
  util_working_mode.value = true;
})


async function create_content_pdf(options) {
  console.log('$$$$ ~~~~~~~~ create_content_pdf');
  const fileName = docFileName();
  const pdfname = fileName.replace('.svg', '.pdf');
  console.log("pdfname " + pdfname);

  const ForceUsePrintWinToPdf = false;  // 【注意】リリース時または問題があったら、false に変えて下さい。 2023.12.23a お試し Debug printFileOrTextToPdf() のため、当フラグを追加した
  console.log("ForceUsePrintWinToPdf: " + ForceUsePrintWinToPdf + " test_print_mode: " + test_print_mode.value + " pdfname: " + pdfname);  
  console.assert(!ForceUsePrintWinToPdf, "ForceUsePrintWinToPdf true は一時的 printFileOrTextToPdf をテストための機能です、false にして下さい。 ");

  if (test_print_mode.value == 0) { // 0: SVG のみ  ※ 両方共に印刷可能
    if (!ForceUsePrintWinToPdf) {
      console.log("do printWinContentsToPdf");
      await window.sysapi.printWinContentsToPdf(pdfname, options);
    } else {
      console.log("do printFileOrTextToPdf");
      await window.sysapi.printFileOrTextToPdf(   // ※ 「Print File To PDF」と同じ機能です、リリース時には、そちらを使用して下さい
        fileName,     // string of .html | .svg path-name
        null,         // string, 出力元のテキストコンテンツ
        pdfname,      // null = html/svg と同じ場所 | "" = Desktop | path-name
        null,         // winSpecs, null | object of window
        options       // null | object of printToPDF options
      );
    }
  } else if (test_print_mode.value >= 1) { // 1: テスト情報のみ印刷 2: 混合（SVG ＋ テスト情報） ※ File モードでは印刷不可
    console.log("do printWinContentsToPdf");
    await window.sysapi.printWinContentsToPdf(pdfname, options);
  }

  console.log("await window.sysapi.receive");
  await window.sysapi.receive('wrote-pdf', (...args) => {
    console.log("$$$$ received: ");
    console.log('  args: ' + JSON.stringify(args));   //   args: [{"pdfPath":"C:\\DOCs\\SvgEditor\\exam2023.pdf","exit_code":0,"result":"OK"}]
    msgReceivedRef.value = JSON.stringify(args);
  });
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


async function printHtmSvgToPdfFile() {
  //=
  //  2023.12.23a options を使うように変更した
  //=
  console.log('$$$$ ~~~~~~~~ printHtmlToPdfFile');
  const fileName = docFileName();

  //= copy pdfOpts.value to options
  const options = JSON.parse(JSON.stringify(pdfOpts.value));

  console.log("await window.sysapi.printFileOrTextToPdf");
  await window.sysapi.printFileOrTextToPdf(
    fileName,     // string of .html | .svg path-name
    null,         // string, 出力元のテキストコンテンツ
    null,         // null = html/svg と同じ場所 | "" = Desktop | path-name
    null,         // winSpecs, null | object of window
    options       // null | object of printToPDF options
  );  

  console.log("await window.sysapi.receive");
  await window.sysapi.receive('wrote-pdf', (...args) => {
    console.log("$$$$ received: ");
    console.log('  args: ' + JSON.stringify(args));   //   args: [{"pdfPath":"C:\\DOCs\\SvgEditor\\exam2023.pdf","exit_code":0,"result":"OK"}]
    msgReceivedRef.value = JSON.stringify(args);
  }); 
}


onMounted(async () => { // after DOM nodes be inserted
  await nextTick();
  showRouterBar.value = false;
})


onBeforeUnmount(() => {
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
  border: v-bind("util_working_mode ? '8px solid silver' : 'none'");
}

.earth {
  position: absolute;
  display: block;
  z-index: 1000;
  left: 0%;
  top: 0%;
  width: 90%;
  opacity: v-bind("utilityPanelOpacity");
  color:whitesmoke;
  background-color:rgb(103, 61, 26);
  // border: v-bind("util_working_mode ? '8px solid rgba(244, 192, 5, 0.25)' : 'none'");
}

.util_frame {
  position: relative;
  display: block;
  padding: 8px;
  border: 1px solid goldenrod;
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
  z-index: 100;
  width: v-bind("pxW");
  height: v-bind("pxH");
  border: v-bind("util_working_mode ? '1px dashed rgba(255, 0, 0, 1.0)' : 'none'");
  margin-top: v-bind("svgMargingRef.top + 'px'");
  margin-left: v-bind("svgMargingRef.left + 'px'");
}

.test_page {
  position: absolute;
  display: block;
  z-index: 10;
  left: 0%;
  top: 0%;
  width: v-bind("pxW");
  height: v-bind("pxH");

  background-color:rgba(126, 180, 255, 0.25);
  border: 8px solid rgba(14, 60, 225, 0.25);
}


.group_card {
  margin-top: 4px;
  margin-bottom: 4px;
}

.msg_received {
  margin-top: 4px;
  margin-bottom: 4px;
  margin-left: 4px;
  margin-right: 4px;
  min-height: 1.5em;
  color: gold
}

</style>