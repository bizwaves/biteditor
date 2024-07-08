<template>
<svg ref = "htmsvg_container_ref" 
    class = "svg_container"
>
</svg>
</template>


<script setup lang="ts">
import {
  ref,
  // reactive,
  // computed,
  // inject, 
  watch,
  onBeforeUpdate,
  onMounted,
  // onBeforeUnmount,
  nextTick
} from "vue";

// import {
//   useDraggable,
//   useElementBounding,
//   useEventListener,
//   useMouse, useMousePressed, onKeyStroke, useMagicKeys, useMouseInElement, useParentElement, useElementSize, useActiveElement,
//   whenever
// } from '@vueuse/core'

// import { v4 as uuidv4 } from "uuid";

//= 「const svg_ref = ref(null);」の代り、親 component からアクセス出来る defineModel を定義する 
const svg_ref = defineModel<any>("svg_ref", { local: true, default: null });		                  // name svg_ref 使用, parent: v-model:svg_ref="svg_dom"
const htmsvg_container_ref = defineModel<any>("htmsvg_container_ref", { local: true, default: null });  // name htmsvg_container_ref 使用, parent: v-model:htmsvg_container_ref="svg_container_dom"
const svg_content_ref = defineModel<any>("svg_content_ref", { local: true, default: "" });		    // name svg_content_ref 使用, parent: v-model:svg_content_ref="null"


watch(svg_content_ref, (val, oldVal) => {
  console.log("svg_content_ref changed: ", val, oldVal);
  
  htmsvg_container_ref.value.innerHTML = val;
});


//= vue 3.4.4 htmsvg_container_ref.value is null 対策 2024.01.03a
//  【現象】yarn upgrade vue
//           ⇒vue 3.4.4 htmsvg_container_ref.value is null
//  問題の原因を特定するための別のアプローチとして、onMountedフックが実行されるタイミングを調整することが考えられます。
//  具体的には、nextTick関数を使用して、DOMが更新された後にonMountedフック内のコードが実行されるようにする。
//=
onMounted(async () => { // after DOM nodes be inserted
  await nextTick();

  console.log("onMounted set innerHTML ← svg_content_ref.value");
  // console.log("htmsvg_container_ref.value: ", htmsvg_container_ref.value)

  htmsvg_container_ref.value.innerHTML = svg_content_ref.value;

  // console.log((htmsvg_container_ref.value as any).innerHTML);
});

</script>



<style scoped>

.svg_defs {
  /* display: none; */
}

.svg_events {
    pointer-events: all;
}

.client_decided {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
}

.svg_container {
}


</style>
