<!-- 
  https://github.com/arnog/mathlive/tree/master/examples/vue
  https://github.com/justforuse/vue-mathjax-next
-->
<template>
  <div
    class="client_decided html_events editor_canvas"
  >
    <!-- 
      ↓ The MathLive Vue wrapper provides a Vue component that implements a <mathlive-mathfield> HTML tag.
      The component can be used to 
        1) edit formulas using the MathLive library. 
            The editor provides a rich, accessible, editing UI, 
        2) including virtual keyboards for mobile.
        3) output as LaTeX, MathML or spoken text.
            【例】LaTeX       : x=-b\pm \frac {\sqrt{b^2-4ac}}{2a}
            　　　Spoken text : 'F' of 'X' equals
        4) The component supports the v-model attribute.
        5) The textual content of the element is used as the initial value of the editor.
    -->
    <mathlive-mathfield
      id            = "mf"
      ref           = "mathfield"
      v-model       = "formula"
      :options      = "{ smartFence: false, virtualKeyboardMode: 'onfocus' }"
      @focus        = "ping"
      @input        = "changed"
      :on-keystroke = "displayKeystroke"
      class         = "math_input"
      
    >
        {{ laTeX }}
    </mathlive-mathfield>


    <!-- TODO 出力が確認出来ていない -->
<!-- 
    <div> 
      <label>
        Keys Stroked:
      </label>
      <span>
        {{ keystroke }}
      </span> 
    </div>
    <br>
 -->

    <!-- 対照的テスト： vue-mathjax-next
      https://github.com/justforuse/vue-mathjax-next
      https://blog.csdn.net/HGGshiwo/article/details/124100109
      TODO 動作しない、何故？
    -->
<!-- 
    <vue-mathjax 
      :formula = "vueMathjaxExam" 
    />
 -->

    <v-textarea 
      class = "raw_output"
      placeholder = 'laTeX String'
      label = "laTeX"
      :model-value = "laTeX"
    >
    </v-textarea>


    <!-- 参考：Spoken text -->
<!-- 
    <div 
      class = "output"
      style = "margin-left: 8px; margin-right: 28px; margin-top: 8px; margin-bottom: 16px;"
    >
      Spoken text: {{ asSpokenText() }} 
    </div>
 -->

    <button 
      style="outline: solid; margin-left: 8px; margin-right: 8px; margin-top: 8px; margin-bottom: 16px;"
      v-on:click = "sayIt"
    >
      Say It
    </button>

    <button 
      style="outline: solid; margin-left: 8px; margin-right: 8px; margin-top: 8px; margin-bottom: 16px;"
      v-on:click = "setExample"
    >
      Example
    </button>

<!-- 
    <button 
      v-on:click = "outIt"
    >
      Show LaTex
    </button>
 -->

    <div class = "btn_bar" style = "margin-left: 8px; margin-right: 8px; margin-top: 8px; margin-bottom: 16px;">

<!-- 
      <v-btn v-if="isDevModeRef" color="secondary" > TODO renderMathInElement </v-btn>
 -->

      <v-btn color="info"    @click.stop = "cancleBtnClicked"  > Cancle </v-btn>
      <v-btn color="primary" @click.stop = "ApplyBtnClicked"   > Apply </v-btn>
    </div>


    <!-- デモ: renderMathInElement -->
<!-- 
    <div v-if="isDevModeRef" ref = "static_math">
      \[x^2 = x*x\]
    </div>
 -->

  </div>
</template>


<script setup lang="ts">
import {
  ref, computed, getCurrentInstance,
  // defineProps, defineEmits, defineExpose,
  provide, h, inject, hasInjectionContext, mergeProps, cloneVNode, isVNode, resolveComponent, resolveDirective, withDirectives, withModifiers, watch, reactive, onMounted, onUnmounted, nextTick
} from 'vue';


//= TODO update 最新版 mathlive
// 下記の通り、古い mathlive を使って、エラーを回避しています 
//    PS C:\workspace\bitvue> yarn add mathlive@^0.86.0
// Module not found: Error: Package path ./dist/mathlive-fonts.css is not exported from package C:\workspace\bitvue\node_modules\mathlive (see exports field in C:\workspace\bitvue\node_modules\mathlive\package.json)
// Module not found: Error: Package path ./dist/mathlive-static.css is not exported from package C:\workspace\bitvue\node_modules\mathlive (see exports field in C:\workspace\bitvue\node_modules\mathlive\package.json)
import 'mathlive/dist/mathlive-fonts.css'
import 'mathlive/dist/mathlive-static.css'

import VueMathjax from 'vue-mathjax-next';


const isDevModeRef = inject('isDevModeRef');
const isPreviewModeRef = inject('isPreviewModeRef');

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

//= Vue3 で setup から this にアクセスする最終手段
//  Composition APIからOption APIにアクセスできればいいのだが、その手段は標準では用意されていない。
//=
const currentComponent = getCurrentInstance();
console.log("$$$$$ currentComponent is:" + currentComponent);

//= Example データ
// TODO assets 表示不正
// const latexExam01 = "f(x)=\\int_0^{\\infty}\\cos(x^2)+2\\pi\\sqrt{y}";

//= TODO preview 表示不正
const latexExam01 = `
\\[
  \\frac{\\pi}{2} =
  \\sum_{k=0}^{\\infty} \\frac{(2k)!}{2^{2k}(k!)^2} \\frac{1}{2k+1} =
  \\prod_{k=1}^{\\infty} \\frac{4k^2}{4k^2 - 1}
\\]
`;

const vueMathjaxExam = ref('$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$');

const MathLive = inject('MathLive')                                   // $$$$$ MathLive is:[object Module]
console.log("$$$$$ MathLive is:" + MathLive);
console.log("MathLive.makeMathField is: " + MathLive.makeMathField);  // TODO undefined

const MathfieldComponent = inject('MathfieldComponent')               // $$$$$ MathfieldComponent is:[object Object]
console.log("$$$$$ MathfieldComponent is:" + MathfieldComponent);

const laTeX = defineModel<string>("laTeX", {  // named model laTeX of mathlive-mathfield tag, parent 側の書き方: v-model:laTeX="laTeX"
  local: true,
  default: "f(x)="                            // mathlive-mathfield tag の初期値
});

//= mathlive-mathfield tag の初期値 を設定する
laTeX.value = floatMinieditorRef.value.src;   // .src := [inout] miniEditorLangSrc

const mathfield     = ref(null);      // ref     of mathlive-mathfield tag: <mathlive-mathfield ref     = "mathfield"
const formula       = ref("laTeX");   // v-model of mathlive-mathfield tag: <mathlive-mathfield v-model = "formula"
const keystroke     = ref("");        // TODO 動作確認できていない 2023.11.22
const static_math   = ref(null);      // デモ: renderMathInElement


const sayIt = (event) => {
  //= currentComponent.proxy.$refs.mathfield.executeCommand(["speak", "all"]);
  mathfield.value.executeCommand(["speak", "all"]);
}


const outIt = (e) => {          // !! For Debug perpose
  console.log("outIt");
  //= laTeX.value = currentComponent.proxy.$refs.mathfield.getValue("latex");
  laTeX.value = mathfield.value.getValue("latex");
  // console.log(laTeX.value);
}


const setExample = (e) => {          // @input of mathlive-mathfield tag
  laTeX.value = latexExam01;
  // TODO mathfield に反映
  // console.log(`laTeX: ${laTeX.value}`);
}


const changed = (e) => {          // @input of mathlive-mathfield tag
  console.log("~~~~~~~~ changed");
  //= laTeX.value = currentComponent.proxy.$refs.mathfield.getValue("latex");
  laTeX.value = mathfield.value.getValue("latex");
  // console.log(`laTeX: ${laTeX.value}`);
}


const ping = () => {
  console.log("ping");
}

const displayKeystroke = (keystroke, _ev) => {
  console.log("displayKeystroke");
  keystroke.value = keystroke;
  return true;
}

const asSpokenText = function () {
  return currentComponent.proxy.$refs.mathfield
    ? currentComponent.proxy.$refs.mathfield.getValue("spoken")
    : "";
}


const cancleBtnClicked = (e) => {
  cancelFloatMinieditor();                            // set '' to fmini_stat_ref
}

const ApplyBtnClicked = (e) => {
  //=
  //
  //=
  floatMinieditorRef.value.src = laTeX.value;   // お試し 2023.11.22 .src := [inout] miniEditorLangSrc
  fmini_content_ref.value      = laTeX.value;   // お試し 2023.11.22
  finishFloatMinieditor();                      // set 'finish' to fmini_stat_ref
}


onMounted(async () => { // after DOM nodes be inserted
  await nextTick();
  console.log("$$$$$ begin mounted");
  // console.log(currentComponent.proxy.$mathlive);

  //= デモ: renderMathInElement
  currentComponent.proxy.$mathlive.renderMathInElement(currentComponent.proxy.$refs["static_math"]);

  console.log("$$$$$ end mounted");
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


.editor_canvas { /* earth */
  position: relative;
  display: block;

  background-color: v-bind("htmsvg_outer_ref.background_color") !important;   // 2023.12.16a Editorの背景色
  color: v-bind("htmsvg_outer_ref.color") !important;                         // 2023.12.16a Editorの前景色

  pointer-events: auto !important; /* galaxy で OFF したイベントを再開する */
}


.math_input {
    font-size: 1.5rem;
    font-family: "Source Code Pro", Menlo, "Bitstream Vera Sans Mono", Monaco, Courier, "Andale Mono", monospace;
    color: #f7ebd3;
    background: rgba(22, 22, 22, 1.0);
    margin: 8px;
    outline: solid 1px rgba(133, 157, 255, 0.25);
}

.raw_output {
    margin: 8px;
    outline: solid 1px rgba(133, 157, 255, 0.25);
    font-family: "Source Code Pro", Menlo, "Bitstream Vera Sans Mono", Monaco, Courier, "Andale Mono", monospace;
    color: rgb(8, 255, 8);
    background: rgba(0, 0, 0, 1.0);
}


button {
    background: none;
    border:	1px solid rgba(0, 0, 0, .12);
    border-radius: 4px;
    color: #0066ce;
    fill: #0066ce;
    position: relative;
    height: 36px;
    line-height: 36px;
    margin: 0 18px 0 0;
    min-width: 64px;
    padding: 0 16px;
    display: inline-block;
    overflow: hidden;
    will-change: box-shadow;
    transition: box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);
    outline: none;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    font-size: 16px;
    letter-spacing: 0.08929em;
    text-transform: uppercase;
    box-shadow:  0px 1px 5px 0px rgba(0, 0, 0, 0.2),
        0px 2px 2px 0px rgba(0, 0, 0, 0.14),
        0px 3px 1px -2px rgba(0, 0, 0, 0.12); 
    }

button:first-child {
    margin-left: 0;
}

button:hover {
    background-color: rgba(0,0,0,0.08);
}

button:active{
    background-color: white;
}    

.btn_bar {
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  grid-gap: 8px;
}


</style>