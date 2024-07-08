<!-- 
	vue-macros (vue3.3) 実験
		https://github.com/vue-macros/vue2-vue-cli/blob/main/src/App.vue
-->

<script lang=ts setup>
import { ref, watchEffect, h, reactive, toRef } from 'vue'


//= 【実験 1】defineModel [vue3.3 版] ⇒ OK
//	Alternatives: defineModels
//	[Core Team RFC] New SFC macro: defineModel #503
//		https://github.com/vuejs/rfcs/discussions/503
// 		This proposal introduces a new SFC macro called defineModel that enhances the developer experience 
// 			when declaring two - way binding props to be consumed by v - model.
// 		With defineModel, v - model props can be declared and mutated like a ref.
//=
const modelValue = defineModel<number>({ local: true, default: 0 });								// default name modelValue 使用, parent: const count = ref(0); v-model="count"

const show = defineModel<string>("show", { local: true, default: "Named Model" });		// name show 使用, parent: v-model:show="show"

console.log("show before: " + show.value);   // OK
show.value = 'Hi, Named Model';
console.log("show after: " + show.value);    // OK


//= 【実験 2】defineProps 解构和默认值 [vue3.3 版] ⇒ OK
//	[Core Team RFC] Reactive Props Destructure #502
// 		https://github.com/vuejs/rfcs/discussions/502
// 	↓ won't lose reactivity with destructuring
//=
const { names = "默认值", foo, bar, myShow = true } = defineProps<{
	names?: T
	foo?: string 						// 書き方の例
	bar?: string[] 					// 書き方の例
	myShow?: Boolean					// 実験 9 用
}>();
const barRef = $$(bar)		// ?


//= 【実験 3】defineOptions [vue3.3 版] ⇒ OK
defineOptions({
	name: 'MyVue33MacrosComp',
	inheritAttrs: false,
})


//= 【実験 4】defineSlots [vue3.3 版] ⇒ OK
// 	新增类型检查
defineSlots<{
	// slot name
	title: {
		// scoped slot
		foo: 'bar' | boolean
	}
	default?: (props: { msg: string }) => any
	item?: (props: { id: number }) => any
}>()


//= 【実験 5】defineRender [vue3.3 版] ⇒ OK
// 		動作確認済み, 2023.06.30, 当 debug コード を動作させると、本来のコンテンツが表示されないため、コメントアウト
// defineRender(() => {
//   return h('div', 'Hello World')    
// })

//= 【実験 6】$ref [vue3.3 版] ⇒ OK
let fu = $ref('hello')
fu = 'world'
console.log("$$(fu) : " + $$(fu))		// $$(fu) : [object Object]

//= 【実験 7】更加便捷的defineEmits类型声明 [vue3.3 版] ⇒ OK
const emit = defineEmits<{
	em_foo: [id: number]
	em_bar: [name: string, ...rest: any[]]
}>()

//= 【実験 8】toRef と toValue [vue3.3 版] ⇒ OK
// 	vue3之前提供了一个toRefs的方法，用于将reactive对象转为可以解构的普通对象，并且保证数据的响应式。
// 	但是toRefs转的是整个对象，而新增toRef方法可以处理单个指定属性。

const test = reactive({
	name: "test",
	age: 18,
	data: {
		a: 1
	}
});

const age = toRef(test, "age");
const a = toRef(test.data, "a");


//= 【実験 9】toRef with Readonly [vue3.3 版] ⇒ OK
//	toRef还支持只读写法，也就是getter函数
const readonlyShow = toRef(() => props.myShow);

console.log(readonlyShow);  // GetterRefImpl {__v_isRef: true, __v_isReadonly: true, _getter: ƒ}

</script>


<template>
<div>

	<!-- 【実験 1】defineModel  -->
	<v-btn color="info" size="small" @click = "modelValue++"> + </v-btn> {{ modelValue }} <br>
	{{ show }} <br><br>

	<!-- 【実験 2】defineProps 解构和默认值 -->
  {{ names }}  <br><br>

<!-- 	【実験 8】toRef と toValue -->
	<div>
	  <div>{{ age }}</div>
	  <v-btn color="info" size="small" @click="age++">+1</v-btn>
	  <div>{{ a }}</div>
	  <v-btn color="info" size="small" @click="a++">+1</v-btn>
	</div>


</div>
</template>