<template>
  <div
      class="sec-text-meta"
  >

   <v-container>
    <v-row>
      <v-col>
        <v-checkbox
          v-model="requiredOnlyRef"
          label="Required Only"
          color="primary"
          hide-details
        ></v-checkbox>  
      </v-col>
     </v-row>
   </v-container>  

    <v-container id="add_svg_panel" class="add_panel">
      <template v-for="(plus, key) in plusAttrsRef" v-bind:key="key">
        <v-row v-if="requiredOnlyRef && plus['required'] || !requiredOnlyRef">
          <v-col>
            <v-text-field
              clearable
              ref = "meta_title_ref"
              v-model="plus.val"
              hide-details="auto"
              :label="`${key}`"
              :placeholder="plus.placeholder"
            >
            </v-text-field>
          </v-col>

          <v-col v-if="`${key}`==='id'">
            <v-btn
              @click="makePlusId(key)"
            >
              作成
            </v-btn>
          </v-col>

        </v-row> 
      </template>
    </v-container>
  
  </div>
</template>



<script setup lang="ts">
import {
  effectScope, getCurrentScope, onScopeDispose, markRaw, toRaw, reactive, shallowReactive, shallowReadonly, isReactive, computed, shallowRef, triggerRef, customRef, ref, unref, toRef, toRefs, isRef, 
  // defineExpose, defineProps, defineEmits,
  inject, onBeforeUpdate, watch, watchEffect, onMounted, onBeforeUnmount, nextTick
} from "vue";

import { Buffer } from 'buffer';
import { Base64 } from "js-base64";

const isDevModeRef = inject('isDevModeRef');
const isPreviewModeRef = inject('isPreviewModeRef');

const appSpecRef: any = inject("appSpecRef");
const userCfgRef: any = inject("userCfgRef");
const appCfgRef: any = inject("appCfgRef");
const dbConRef: any = inject("dbConRef");
const selDocFileRef: any = inject("selDocFileRef");

const DelayMSecWakeUp: any = inject("DelayMSecWakeUp");

const requiredOnlyRef = ref(true);

const props = defineProps({
  kind: { type: String, default: 'normal' },            // "normal" | "sectext" | _
  owner_com_type: { type: String,  required: true },
  // owner_uuid: { type: String, required: true },      // 2023.12.08 props.owner_uuid から md_owner_uuid へ移行
});


const plusAttrsRef = defineModel<any>("plusAttrsRef", { local: true, default: null });
console.log("plusAttrsRef: ", JSON.stringify(plusAttrsRef, null, 2));

const md_owner_uuid = defineModel<any>("md_owner_uuid", { local: true, default: null });
console.log("isRef md_owner_uuid: ", isRef(md_owner_uuid)); // temp. debug
console.log("unref md_owner_uuid: ", unref(md_owner_uuid)); // temp. debug
console.log("toRef md_owner_uuid value: ", toRef(md_owner_uuid).value); // temp. debug


const makePlusId = (key: string) => {
  const timestame = new Date().getTime();
  plusAttrsRef.value[key]['val'] = `i${timestame}d`; // temp. debug
}


const emit = defineEmits([
])


defineExpose({

})

</script>



<style scoped lang="scss">
</style>