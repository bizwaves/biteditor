<template>
  <div
    class="client_decided html_events editor_canvas"
  >

    <div class = "cols_container client_decided">
      <div class = "rows_container client_decided">

        <v-combobox 
          class = "kind client_decided"
          label = "Example"
          chips
          density = "compact"
          :items = "Object.keys(kind)"
          v-model = "model"
        ></v-combobox>

        <textarea class = "client_decided source_editor"
          v-model = "diagram_src"
        ></textarea>

        <div class = "btn_bar">
          <v-btn color="info"    @click.stop = "cancleBtnClicked"  > Cancle </v-btn>
          <v-btn color="primary" @click.stop = "ApplyBtnClicked"   > Apply </v-btn>
        </div>

      </div>

      <div class = "render_frame client_decided">
        <VueMermaidRender   
          v-model:diagram_src = "diagram_src"
          v-model:diagram_svg = "diagram_svg"
        ></VueMermaidRender>
      </div>

    </div>

  </div>
</template>


<script setup lang="ts">

import { ref, watch, inject, nextTick } from 'vue'

import VueMermaidRender from './VueMermaidRender.vue'

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

const diagram_src = defineModel<string>("diagram_src", { local: true, default: "" });		// name diagram_src 使用, parent: v-model:diagram_src="diagram_src"
const diagram_svg = defineModel<string>("diagram_svg", { local: true, default: "" });		// name diagram_svg 使用, parent: v-model:diagram_svg="diagram_svg"

const model = ref('sequenceDiagram')

const kind = {
  sequenceDiagram: "sequenceDiagram",
  flowchart: "flowchart",
  classDiagram: "classDiagram",
  stateDiagram: "stateDiagram",
  erDiagram: "erDiagram",
  gantt: "gantt",
  journey: "journey",
  gitGraph: "gitGraph",
  pie: "pie",
  mindmap: "mindmap",
  quadrantChart: "quadrantChart",
  other: "other"
}

const kindBasic = {};

kindBasic["sequenceDiagram"] = `
sequenceDiagram
    Alice->>+John: Hello John, how are you?
    Alice->>+John: John, can you hear me?
    John-->>-Alice: Hi Alice, I can hear you!
    John-->>-Alice: I feel great!
`;

kindBasic["flowchart"] = `
flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
`;

kindBasic["classDiagram"] = `
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
    class Fish{
      -int sizeInFeet
      -canEat()
    }
    class Zebra{
      +bool is_wild
      +run()
    }
`;

kindBasic["stateDiagram"] = `
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
`;

kindBasic["erDiagram"] = `
erDiagram
    CUSTOMER }|..|{ DELIVERY-ADDRESS : has
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER ||--o{ INVOICE : "liable for"
    DELIVERY-ADDRESS ||--o{ ORDER : receives
    INVOICE ||--|{ ORDER : covers
    ORDER ||--|{ ORDER-ITEM : includes
    PRODUCT-CATEGORY ||--|{ PRODUCT : contains
    PRODUCT ||--o{ ORDER-ITEM : "ordered in"
`;

kindBasic["gantt"] = `
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
`;

kindBasic["journey"] = `
journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 3: Me
`;

kindBasic["gitGraph"] = `
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    commit
`;

kindBasic["pie"] = `
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
`;

kindBasic["mindmap"] = `
mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectivness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
`;

kindBasic["quadrantChart"] = `
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign C: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
`;

diagram_src.value = kindBasic['sequenceDiagram'];   // 初期値

watch(model, val => {
  console.log("$$$$$ model is:" + model.value);
  console.log("$$$$$ val is:" + val);
  diagram_src.value = kindBasic[val];
})

//= デモ
// setTimeout(() => {
//   diagram_src.value = kindBasic['quadrantChart'];
// }, 2000)

const cancleBtnClicked = (e) => {
  cancelFloatMinieditor();                            // set '' to fmini_stat_ref
}

const ApplyBtnClicked = (e) => {
  console.log('ApplyBtnClicked');
  floatMinieditorRef.value.src = diagram_src.value;   // 
  fmini_content_ref.value      = diagram_svg.value;   // 
  finishFloatMinieditor();                            // set 'finish' to fmini_stat_ref
}

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


.cols_container {
  position: relative;
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr;
}

.rows_container {
  position: relative;
  display: grid;
  grid-gap: 8px;
  grid-template-rows: auto 1fr 64px 32px;
}

.kind {
  background-color: rgb(2, 6, 40);
  color: gold;
}


.source_editor {
    margin: 1px;
    outline: solid 1px rgba(133, 157, 255, 0.25);
    font-family: "Source Code Pro", Menlo, "Bitstream Vera Sans Mono", Monaco, Courier, "Andale Mono", monospace;
    color: rgb(8, 255, 8);
    background: rgba(0, 0, 0, 1.0);
}

.btn_bar {
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  grid-gap: 8px;
}


.render_frame {
  position: relative;
  display: block;

  color: black !important;              // 2024.01.04a 見やすいようにするとよい
  background-color: white !important;   // 2024.01.04a 見やすいようにするとよい
}


</style>


