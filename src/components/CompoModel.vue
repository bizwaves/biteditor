/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

<!--
    V-Model in Vue3
    https://vanoneang.github.io/article/v-model-in-vue3.html#turn-it-into-a-composable
-->
<template>
    <label>
        <input type="text" v-model="message">
        <label>MyLabel</label>
        <input type="checkbox" v-model="isDraft"> Draft
   </label>
</template>

<script lang="ts">

//= TODO 下記設定は、コンパイルエラーを解消したが、vs-code 表示は消せない
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { useModelWrapper } from '../utils/modelWrapper.ts'

export default {
    props: {
        modelValue: String,
        draft: Boolean
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props: any, { emit }: any) {
        return {
            message: useModelWrapper(props, emit, 'modelValue'),
            isDraft: useModelWrapper(props, emit, 'draft')
        }
    }
}

</script>