
<!-- 参考
https://ja.vuejs.org/guide/quick-start.html
https://ja.vuejs.org/api/composition-api-lifecycle
-->

<template>

<div 
    ref="el_root_ref" 
    class="root_container" 
    title="Editor root container"
> 

  <div display="none" title="Editor SVG DEFS-SYMBOL Library">
      <svg display="none">
          <desc> SVG DEFS-SYMBOL Library </desc>
      </svg>
  </div>


  <div v-if="true" class="editor_world" title="Editor world">

    <div class="top_outline">
      <div v-show="showTopContainerRef" class="top_container" title="Editor top_container">
          <v-text-field ref="inID_ref"    id="gS" v-model="genInId"     class="in_gen_id"   label="gS" placeholder="gS" title="汎用記憶 gS" persistent-hint :hint = "genInHintS" variant="underlined" />
          <v-text-field ref="inDataA_ref" id="gA" v-model="genInDataA"  class="in_gen_data" label="gA" placeholder="gA" title="汎用記憶 gA" persistent-hint :hint = "genInHintA" variant="underlined" clearable />
          <v-text-field ref="inDataB_ref" id="gB" v-model="genInDataB"  class="in_gen_data" label="gB" placeholder="gB" title="汎用記憶 gB" persistent-hint :hint = "genInHintB" variant="underlined" clearable />
          <v-text-field ref="inDataC_ref" id="gC" v-model="genInDataC"  class="in_gen_data" label="gC" placeholder="gC" title="汎用記憶 gC" persistent-hint :hint = "genInHintC" variant="underlined" clearable />
      </div> <!-- END top_container -->

      <div class="top_tool_row">
        <div class="top_btns">
          <v-btn color="blue-grey" size="tiny" class="top_tool" @click="onTopToolHide" > ▲ </v-btn>
          <v-btn color="blue-grey" size="tiny" class="top_tool" @click="onTopToolShow"> ▼ </v-btn>

          <v-btn 
            :prepend-icon="isPreviewModeRef ? 'mdi-checkbox-outline' : 'mdi-checkbox-blank-outline'"
            color="blue-grey" size="tiny" class="top_tool" @click="onTogglePreviewMode" :title="isPreviewModeRef"
          > 
            <template v-slot:prepend>
              <v-icon color="#E6EE9C"></v-icon>
            </template>
            Preview Mode 
          </v-btn>

          <v-btn v-show="developMode"
            :prepend-icon="isDevModeRef ? 'mdi-checkbox-outline' : 'mdi-checkbox-blank-outline'"
            color="bluey" size="tiny" class="top_tool" @click="onToggleDevMode" :title="isDevModeRef" 
          > 
              <template v-slot:prepend>
                <v-icon color="red"></v-icon>
              </template> 
            開発 Mode 
          </v-btn>

          <v-btn v-show="isDevModeRef" color="blue-grey" size="tiny" class="top_tool" @click="onToggleAssist" :title="showAssistRef"> Assistant </v-btn>
          <v-btn v-show="isDevModeRef" color="blue-grey" size="tiny" class="top_tool" @click="onToggleEditing" :title="showEditingRef"> Editing </v-btn>
          <v-btn v-show="isDevModeRef" color="blue-grey" size="tiny" class="top_tool" @click="onToggleDebuger" :title="showDebugerRef"> Debuger </v-btn>
        </div>

        <div class="app_msg">{{app_msg_ref}}</div>

        <div class="auth_info">{{ authStatRef ? 'Authorized' : 'Not Authorized' }}</div>          
      </div>


    </div>

    <div class="main_wire_container" title="Editor main_wire_container">

    <div class="left_outline">
      <div v-show="showLeftContainerRef" class="left_container">

        <!-- ↓ current 表示モード -->
        <v-container class="acting-edit ">
          <div class="acting-com-type">{{ actingEditRef.com_type }}</div>

          <div class="acting-com-uuid">{{ actingEditRef.uuid     }}</div>

          <!--
             2023.11.19z familyId ← familyIdRef ※ EditSvgRect uuid 消える障害対策
             v-if = "actingEditRef['familyIdRef'] != null" 
          -->
          <v-text-field 
              label="elem-id"
              v-model="actingEditRef.familyId"
              placeholder="英数字" 
              clearable hide-details="auto" dense
          ></v-text-field>
        </v-container>

        <!-- Cursor X, Y TODO guides 基準 -->
        <!-- 2023.12.13f 下記のコードを削除した        
          Mouse Cursor を動かすたびに、下記のログが出力されています
          editor::root onRenderTriggered: {"type":"set","key":"value","newValue":36.77499771118164,"target":{"__v_isShallow":false,"dep": 

          その原因は、下記のコードがあるからですね、
          はい、その通りです。v-modelディレクティブがmouse.elementXとmouse.elementYにバインドされているため、マウスカーソルを動かすとこれらの値が更新され、
          それがコンポーネントの再描画を引き起こします。そして、その再描画がonRenderTriggeredフックをトリガーします。

          これが発生すると、例の SvgEditor だけでなく、子、孫 component の Updated を引き起こすと見えます
          はい、その通りです。Vue.jsでは、親コンポーネントが更新されると、その子孫コンポーネントも再描画されます。これは、親コンポーネントのデータが子孫コンポーネントに渡され、
          それが変更されると、Vue.jsはそれが影響を及ぼす可能性のあるすべてのコンポーネントを再描画します。

          この場合、SvgEditorコンポーネントのmouse.elementXとmouse.elementYが更新されると、それが子孫コンポーネントの再描画を引き起こします。これにより、
          マウスの動きに応じて大量の再描画が発生し、パフォーマンスに影響を及ぼす可能性があります。

          この問題を解決するためには、再描画の頻度を減らすか、必要なコンポーネントだけが再描画されるようにすることが考えられます。
          例えば、mouse.elementXとmouse.elementYの更新をデバウンスする、またはこれらの値の変更を子孫コンポーネントと分離するなどの方法があります。
          具体的な解決策は、アプリケーションの具体的な要件と構造によります。

          今の問題は、例のコードを削除するだけで解消されるように見えます。

          はい、その通りです。そのコードを削除することで、mouse.elementXとmouse.elementYの値がマウスの動きに連動して更新されることがなくなります。
          その結果、これらの値の変更による再描画が発生しなくなり、パフォーマンスが改善される可能性があります。

          ただし、この変更がアプリケーションの他の部分に影響を及ぼさないか確認することが重要です。
          mouse.elementXとmouse.elementYの値が他のコンポーネントや機能で使用されている場合、それらの動作に影響を及ぼす可能性があります。
          そのため、コードを削除する前に、その影響を十分に理解し、必要な場合は適切な修正を行うことが重要です。 
         -->
<!-- 
        <div class="point_item_info_frame">
            <div class="point_item_info">
                <v-text-field label="X" v-model="mouse.elementX" hide-details="auto" dense></v-text-field>
            </div>
            <div class="point_item_info">
                <v-text-field label="Y" v-model="mouse.elementY" hide-details="auto" dense></v-text-field>
            </div>
        </div>
 -->
        <!-- Show / Hide Meta -->
        <v-container id="add_svg_panel" class="add_panel">
            <v-row> 
                <v-col>
                    <v-btn color="blue-grey" 
                        v-on:click="mkActingEdEv('ui', 'show')" > Show
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn color="blue-grey" 
                        v-on:click="mkActingEdEv('ui', 'hide')" > Hide
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn color="blue-grey" 
                        v-on:click="mkActingEdEv('ui', 'toggleToolBar')" > Toggle Tools
                    </v-btn>
                </v-col>
            </v-row> 
        </v-container>

        <v-container id="add_svg_panel" class="add_panel">
            <v-row> 
                <v-col>
                  <v-btn class="my_btn mb-0 mt-0 toggle_able_act" title="undo Ctrl+Z"
                      v-on:click="mkActingEdEv('ui', 'undo')" > Undo
                  </v-btn>              
                </v-col>
                <v-col>
                  <v-btn class="my_btn mb-0 mt-0 toggle_able_act" title="redo Ctrl+Y"
                      v-on:click="mkActingEdEv('ui', 'redo')" > Redo
                  </v-btn>                
                </v-col>               
                <v-col>
                  <v-btn class="my_btn mb-0 mt-0 toggle_able_act" title="Memory Set Ctrl+S"
                      v-on:click="mkActingEdEv('ui', 'memory')" > MS
                  </v-btn>                
                </v-col>   
                <v-col>
                  <v-btn class="my_btn mb-0 mt-0 toggle_able_act" title="Memory On/OFF Toggle Ctrl+R"
                      :prepend-icon="memoryEditStatRef ? 'mdi-toggle-switch-outline' : 'mdi-toggle-switch-off-outline'"
                      v-on:click="memoryEditStatRef = !memoryEditStatRef" > MR
                  </v-btn>                
                </v-col>    
            </v-row> 

            <v-row> 
                <v-col>
                  <v-checkbox class="shrink mb-n3 mt-n3 my_chkbox toggle_able_act"
                    v-model="disabledAbleActsRef"
                    label="OFF Pos-Size"
                    value="draggable"
                    hide-details
                  ></v-checkbox>                  
                </v-col> 
                <v-col>
                  <v-btn class="my_btn mb-0 mt-0 toggle_able_act" title="Pos Size Decided!"
                      v-on:click="mkActingEdEv('ui', 'decidePosSize')" > Pos Size!
                  </v-btn>
                </v-col>
                <v-col v-if="(actingEditRef.com_type == 'edit_svg_embed') || (actingEditRef.com_type == 'edit_svg_text')">
                  <v-checkbox class="shrink mb-n3 mt-n3 my_chkbox toggle_able_act"
                    v-model="enableAddSvgTextRef"
                    label="Svg Text"
                    color="primary"
                    value="draggable"
                    hide-details
                  ></v-checkbox>                  
                </v-col>               
            </v-row>
        </v-container>

        <!-- Database -->
        <v-container id="add_svg_panel" class="add_panel">
            <v-row> 
                <v-col>
                    <v-btn color="primary" title="Save to DB"
                        v-on:click="mkActingEdEv('inout', 'save_db')" > Save
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn color="primary" title="Load from DB"
                        v-on:click="mkActingEdEv('inout', 'load_db')" > Load
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn color="primary" title="List-up DB Records"
                        :disabled="sel_conds_ref==null"
                        v-on:click="mkActingEdEv('inout', 'listup')" > Listup
                    </v-btn>
                </v-col>
            </v-row> 
        </v-container>


        <v-container class="left-tab-container">

          <!-- タブに色つけるには、v-app-bar, v-sytem-bar, v-toolbar, v-card などのスタイルが指定できるコンポーネントに入れる必要があります -->
          <v-toolbar color="primary">

            <!-- 
              v-tabs の color は、選択されたタブの色として使われます`。
              タブ自体は v-tabs で表示します。切り替える画面は v-window で作ります。
              双方のv-model に同じ変数を割り当てて置くと、v-tabs の切り替えに連動して `v-window 側が切り替わります。
            -->
            <v-tabs
              v-model="left_tool_tab"
              color="secondary"
            >
              <v-tab value="1">Mode</v-tab>
              <v-tab value="2">Data</v-tab>
              <v-tab value="3">Corlor</v-tab>
              <v-tab v-if="actingEditRef.com_type == 'edit_svg_embed'"
                value="4"
              >Layer</v-tab>
            </v-tabs>
          </v-toolbar>

          <v-window v-model="left_tool_tab">
            <v-window-item value="1">
              <!-- MoveAble モード Selector -->
              <v-container id="add_svg_panel" class="add_panel">
                  <!-- TODO for able_actmd_list  -->
                  <v-row> 
                      <v-col>
                          <v-btn color="blue-grey" class = "sel-able-btn"
                              v-on:click="mkActingEdEv('able', 'DEFAULT')" > DEFAULT
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" class = "sel-able-btn"
                              v-on:click="mkActingEdEv('able', 'Resizable')" > Resizable
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" class = "sel-able-btn"
                              v-on:click="mkActingEdEv('able', 'Scalable')" > Scalable
                          </v-btn>
                      </v-col>
                  </v-row> 
                  <v-row> 
                      <v-col>
                          <v-btn color="blue-grey" class = "sel-able-btn"
                              v-on:click="mkActingEdEv('able', 'Warpable')" > Warpable
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" class = "sel-able-btn"
                              v-on:click="mkActingEdEv('able', 'Clippable')" > Clippable
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" class = "sel-able-btn"
                              v-on:click="mkActingEdEv('able', 'Roundable')" > Roundable
                          </v-btn>
                      </v-col>
                  </v-row> 
                  <v-row> 
                      <v-col>
                          <v-btn color="blue-grey" class = "sel-able-btn"
                              v-on:click="mkActingEdEv('able', 'Dra_Res')" > Draggable Resizable
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" class = "sel-able-btn"
                              v-on:click="mkActingEdEv('able', 'Dra_Res_Rot')" > Draggable Resizable Rotatable
                          </v-btn>
                      </v-col>
                  </v-row> 
                  <v-row> 
                      <v-col>
                          <v-btn color="blue-grey" class = "sel-able-btn"
                              v-on:click="mkActingEdEv('able', 'Dra_Sca')" > Draggable Scalable
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" class = "sel-able-btn"
                              v-on:click="mkActingEdEv('able', 'Dra_Sca_Rot')" > Draggable Scalable Rotatable
                          </v-btn>
                      </v-col>
                  </v-row> 
                    <v-row> 
                        <v-col>
                            <v-btn color="blue-grey" class = "sel-able-btn"
                                v-on:click="mkActingEdEv('able', 'All_In_One')" > All In One
                            </v-btn>
                        </v-col>
                    </v-row> 
              </v-container>
            </v-window-item>

            <v-window-item value="2">

              <!-- Add Button When EditHtmlFrame -->
              <v-container 
                  v-if="actingEditRef.com_type == 'edit_html_frame'" 
                  class="add_panel"
              >
                  <v-row> 
                      <v-col>
                          <v-btn rounded color="info" 
                              v-on:click="mkActingEdEv('add', 'u_paired')" > WYSIWYG
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn rounded color="info" 
                              v-on:click="mkActingEdEv('add', 'u_layout')" 
                              @mouseover = "onAddLayoutMouseOver"
                          > Layout
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn rounded color="info" 
                              v-on:click="mkActingEdEv('add', 'u_text')" > Text
                          </v-btn>
                      </v-col>
                        <v-col>
                            <v-btn rounded color="info" 
                                v-on:click="mkActingEdEv('add', 'u_html')" > Frame
                            </v-btn>
                        </v-col>
                      <v-col>
                          <v-btn rounded color="info" 
                              v-on:click="mkActingEdEv('add', 'u_svg_embed')" > SVG
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('add', 'u_svg_src')" > Svg Code
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('add', 'u_svg_path')" > Svg path
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('add', 'u_svg_fitcurve')" > Svg Fitcurve
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('add', 'u_svg_text')" > Svg Text
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('add', 'u_svg_rect')" >svg Rect
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('add', 'u_svg_line')" > Svg Line
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('add', 'u_svg_circle')" > svg Circle
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('add', 'u_svg_ellipse')" > svg Ellipse
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('add', 'u_svg_polyline')" > svg Polyline
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('add', 'u_svg_polygon')" > svg Polygon
                          </v-btn>
                      </v-col>
      <!-- 
                      TODO: 予め用意した 部品(部品id, データベースに格納されたテンプレート)を追加する
                      (検討: EditSvgFrame に実装するか、EditHtmlFrame に実装するか)
      -->

                  </v-row> 
              </v-container>

              <!-- Buttons When EditSvgEmbed -->
              <v-container v-if="actingEditRef.com_type == 'edit_svg_embed'" class="add_panel">
                  <v-row> 
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('svg', 'load_svg_file')" 
                              @mouseover = "onFileSvgMouseOver"
                          > Load SVG File 
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('svg', 'load_db_spec')" 
                          > Load key-set from DB
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('svg', 'make_embed_vars')" > Make Embed Vars
                          </v-btn>
                      </v-col>

                      <!-- TODO 実装 -->
<!-- 
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('svg', 'check_embed_vars')" > Check Embed Vars
                          </v-btn>
                      </v-col>
 -->
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('svg', 'load_json_file')" 
                              @mouseover = "onFileJsonMouseOver"
                          > Load Json File
                          </v-btn>
                      </v-col>
                      <v-col>
                          <v-btn color="blue-grey" 
                              v-on:click="mkActingEdEv('svg', 'apply_embed_vars')" > Apply Embed Vars
                          </v-btn>
                      </v-col>
                  </v-row> 
              </v-container>

              <!-- attributes When EditSvgText -->
              <v-container v-if="actingEditRef.com_type == 'edit_svg_text'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"      v-model="svg_text_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="x"            v-model="svg_text_ref.x" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="y"            v-model="svg_text_ref.y" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="textLength"   v-model="svg_text_ref.textLength" placeholder="number | 空白" clearable hide-details="auto" dense   ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="lengthAdjust" v-model="svg_text_ref.lengthAdjust" placeholder="空白 | spacing | spacingAndGlyphs" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="text-anchor"  v-model="svg_text_ref.text_anchor" placeholder="start |middle | end" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="font-family"  v-model="svg_text_ref.font_family" placeholder="例: Verdana" hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="font-size"    v-model="svg_text_ref.font_size" placeholder="number" clearable hide-details="auto" dense    ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="fill"         v-model="svg_text_ref.fill" placeholder="color" hide-details="auto" dense         ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke"       v-model="svg_text_ref.stroke" placeholder="color" hide-details="auto" dense       ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke-width" v-model="svg_text_ref.stroke_width" placeholder="color" hide-details="auto" dense       ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="text"         v-model="svg_text_ref.text" placeholder="漢字可" clearable hide-details="auto" dense         ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="transform"    v-model="svg_text_ref.transform" placeholder="空白可" clearable hide-details="auto" dense    ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'svg_text', svg_text_ref)" > 適用 </v-btn> </v-col></v-row> 
              </v-container>

              <!-- attributes When EditSvgRect -->
              <v-container v-if="actingEditRef.com_type == 'edit_svg_rect'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"      v-model="svg_rect_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="x"            v-model="svg_rect_ref.x" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="y"            v-model="svg_rect_ref.y" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="w"            v-model="svg_rect_ref.w" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="h"            v-model="svg_rect_ref.h" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="fill"         v-model="svg_rect_ref.fill" placeholder="color" hide-details="auto" dense         ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke"       v-model="svg_rect_ref.stroke" placeholder="color" hide-details="auto" dense       ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke_width" v-model="svg_rect_ref.stroke_width" placeholder="number" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'updated', svg_rect_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>

              <!-- attributes When EditSvgLine -->
              <v-container v-if="actingEditRef.com_type == 'edit_svg_line'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"      v-model="svg_line_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="x1"            v-model="svg_line_ref.x1" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="y1"            v-model="svg_line_ref.y1" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="x2"            v-model="svg_line_ref.x2" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="y2"            v-model="svg_line_ref.y2" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke"       v-model="svg_line_ref.stroke" placeholder="color" hide-details="auto" dense       ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke_width" v-model="svg_line_ref.stroke_width" placeholder="number" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'svg_line', svg_line_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>

              <!-- attributes When EditSvgCircle -->
              <v-container v-if="actingEditRef.com_type == 'edit_svg_circle'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"       v-model="svg_circle_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="cx"            v-model="svg_circle_ref.cx" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="cy"            v-model="svg_circle_ref.cy" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="r"             v-model="svg_circle_ref.r" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="fill"          v-model="svg_circle_ref.fill" placeholder="color" hide-details="auto" dense         ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke"        v-model="svg_circle_ref.stroke" placeholder="color" hide-details="auto" dense       ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke_width"  v-model="svg_circle_ref.stroke_width" placeholder="number" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'svg_circle', svg_circle_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>

              <!-- attributes When EditSvgEllipse -->
              <v-container v-if="actingEditRef.com_type == 'edit_svg_ellipse'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"       v-model="svg_ellipse_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="cx"            v-model="svg_ellipse_ref.cx" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="cy"            v-model="svg_ellipse_ref.cy" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="rx"            v-model="svg_ellipse_ref.rx" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="ry"            v-model="svg_ellipse_ref.ry" placeholder="number" clearable hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="fill"          v-model="svg_ellipse_ref.fill" placeholder="color" hide-details="auto" dense         ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke"        v-model="svg_ellipse_ref.stroke" placeholder="color" hide-details="auto" dense       ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke_width"  v-model="svg_ellipse_ref.stroke_width" placeholder="number" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'svg_ellipse', svg_ellipse_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>


              <!-- attributes When EditSvgPolygon -->
              <v-container v-if="actingEditRef.com_type == 'edit_svg_polygon'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"       v-model="svg_polygon_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="points"        v-model="svg_polygon_ref.points" placeholder="string" clearable hide-details="auto" dense        ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="fill"          v-model="svg_polygon_ref.fill" placeholder="color" hide-details="auto" dense         ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke"        v-model="svg_polygon_ref.stroke" placeholder="color" hide-details="auto" dense       ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke_width"  v-model="svg_polygon_ref.stroke_width" placeholder="number" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'svg_polygon', svg_polygon_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>


              <!-- attributes When EditSvgPlyline -->
              <v-container v-if="actingEditRef.com_type == 'edit_svg_polyline'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"       v-model="svg_polyline_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="points"        v-model="svg_polyline_ref.points" placeholder="string" clearable hide-details="auto" dense        ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="fill"          v-model="svg_polyline_ref.fill" placeholder="color" hide-details="auto" dense         ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke"        v-model="svg_polyline_ref.stroke" placeholder="color" hide-details="auto" dense       ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke_width"  v-model="svg_polyline_ref.stroke_width" placeholder="number" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'svg_polyline', svg_polyline_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>


              <!-- attributes When EditSvgSrc -->
              <v-container v-if="actingEditRef.com_type == 'edit_svg_src'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"          v-model="svg_src_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="background color" v-model="svg_src_ref.background_color" placeholder="color" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="color"            v-model="svg_src_ref.color" placeholder="color" hide-details="auto" dense         ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'svg_src', svg_src_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>


              <!-- attributes When EditSvgEmbed -->
              <v-container v-if="actingEditRef.com_type == 'edit_svg_embed'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"          v-model="svg_embed_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="background color" v-model="svg_embed_ref.background_color" placeholder="color" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="color"            v-model="svg_embed_ref.color" placeholder="color" hide-details="auto" dense         ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'svg_embed', svg_embed_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>


              <!-- attributes When EditSvgPath -->
              <v-container v-if="actingEditRef.com_type == 'edit_svg_path'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"          v-model="svg_path_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-checkbox label="Drawing Bezier"     v-model="svg_path_ref.draw_mode" color="primary" ></v-checkbox> </v-col></v-row>
                <v-row><v-col> <v-text-field label="background color" v-model="svg_path_ref.background_color" placeholder="color" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke"           v-model="svg_path_ref.stroke"           placeholder="stroke" hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke_width"     v-model="svg_path_ref.stroke_width"     placeholder="number" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="fill"             v-model="svg_path_ref.fill"             placeholder="fill" hide-details="auto" dense              ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'svg_path', svg_path_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>


              <!-- attributes When EditSvgFitCurve -->
              <v-container v-if="actingEditRef.com_type == 'edit_svg_fitcurve'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"          v-model="svg_fitcurve_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-checkbox label="Drawing Bezier"     v-model="svg_fitcurve_ref.draw_mode" color="primary" ></v-checkbox> </v-col></v-row>
                <v-row><v-col> <v-text-field label="background color" v-model="svg_fitcurve_ref.background_color" placeholder="color" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke"           v-model="svg_fitcurve_ref.stroke"           placeholder="stroke" hide-details="auto" dense            ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="stroke_width"     v-model="svg_fitcurve_ref.stroke_width"     placeholder="number" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="fill"             v-model="svg_fitcurve_ref.fill"             placeholder="fill" hide-details="auto" dense              ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'svg_fitcurve', svg_fitcurve_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>


              <!-- attributes When SvgNodeTree (alais SvgTipTap) -->
              <v-container v-if="actingEditRef.com_type == 'edit_tiptap'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"          v-model="edit_tiptap_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>

                <v-row><v-col> <v-text-field label="background color" v-model="edit_tiptap_ref.background_color" placeholder="color" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="color"            v-model="edit_tiptap_ref.color" placeholder="color" hide-details="auto" dense         ></v-text-field> </v-col></v-row>              
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'edit_tiptap', edit_tiptap_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>


              <!-- attributes When Layout (alais EditLayout) -->
              <v-container v-if="actingEditRef.com_type == 'edit_layout'" class="acting-edit">
                <v-row><v-col> <v-checkbox label="Lauout Mode"        v-model="edit_layout_ref.lauout_mode" color="primary" ></v-checkbox> </v-col></v-row>
                <v-row><v-col> <v-text-field label="z-index"          v-model="edit_layout_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="background color" v-model="edit_layout_ref.background_color" placeholder="color" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="items background" v-model="edit_layout_ref.item_background"  placeholder="color" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="cells background" v-model="edit_layout_ref.cell_background"  placeholder="color" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="color"            v-model="edit_layout_ref.color" placeholder="color" hide-details="auto" dense         ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'edit_layout', edit_layout_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>


              <!-- attributes When SecText -->
              <v-container v-if="actingEditRef.com_type == 'edit_sec_text'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"          v-model="edit_sec_text_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="background color" v-model="edit_sec_text_ref.background_color" placeholder="color" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="color"            v-model="edit_sec_text_ref.color" placeholder="color" hide-details="auto" dense         ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'edit_sec_text', edit_sec_text_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>


              <!-- attributes When HtmlFrame -->
              <v-container v-if="actingEditRef.com_type == 'edit_html_frame'" class="acting-edit">
                <v-row><v-col> <v-text-field label="z-index"          v-model="edit_sec_text_ref.z_index" type="number" placeholder="number" clearable hide-details="auto" dense ></v-text-field> </v-col></v-row>
                <v-row><v-col> <v-text-field label="background color" v-model="edit_html_frame_ref.background_color" placeholder="color" clearable hide-details="auto" dense  ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-text-field label="color"            v-model="edit_html_frame_ref.color" placeholder="color" hide-details="auto" dense         ></v-text-field> </v-col></v-row> 
                <v-row><v-col> <v-btn color="blue-grey" v-on:click="mkActingEdEv('attr', 'edit_html_frame', edit_html_frame_ref)" > 計算 </v-btn> </v-col></v-row> 
              </v-container>

            </v-window-item>

            <v-window-item value="3">
              <v-container id="color_panel" class="add_panel">

                <!-- 2023.12.16a -->
                <v-row justify="space-around" style="background-color:rgba(97,97,97,1)">
                  <v-radio-group style="margin: 4px 4px 8px 0px;"
                      v-model="radiosColorSelRef" 
                      inline
                  >
                    <v-radio v-for="(color, key) in selColorsRef" :key="key"
                      :label="key" 
                      :color="color" 
                      :value="key"
                    ></v-radio>
                    
                  </v-radio-group>
                </v-row>

                <!-- justify="space-around" -->
                <v-row justify="space-around">

                  <!-- swatch プロパティを使用して表示される色をカスタマイズすることもできます -->
<!-- 
                  mode="hexa"
 -->
                  <v-color-picker
                    v-model="colorRef"
                    mode="rgba"
                    class="ma-2"
                    show-swatches
                    swatches-max-height="300px"
                  ></v-color-picker>
                </v-row>
              </v-container>
            </v-window-item>

            <v-window-item value="4">
              <v-container id="text_panel" class="add_panel" v-if="actingEditRef.com_type=='edit_svg_embed'">
                <!-- 内にある v-checkbox の障害を引き起こすため、書けない 
                  <v-radio-group v-model="svg_em_cur_layer_ref"> 
                -->
                  <template v-for="(n, i) of svg_em_lay_length_ref" :key="i" >
                    <v-row justify="space-around">

                      <v-col>
                        <v-btn :style="{'color': 'white', 'background-color': svg_em_cur_layer_ref==i ? 'green' : 'gray' }"
                          v-on:click="svg_em_cur_layer_ref=i"
                        >{{ i }}</v-btn>
                      </v-col>  

                      <v-col>
                        <v-checkbox
                          v-model="svg_em_lay_show_ref[i]"
                          label="visible"
                          color="red"
                          hide-details
                        ></v-checkbox>
                      </v-col>

                    </v-row>
                  </template>
              </v-container>
            </v-window-item>
            
          </v-window>
        </v-container>
<!-- 
        <v-container id="tree_view_panel" class="add_panel">
            Tree View 
        </v-container>
 -->
      </div> <!-- left_container -->

      <div class="left_tool_col">
          <v-btn color="blue-grey" size="tiny" class="top_tool" @click="onLeftToolHide" > ◀ </v-btn>
          <v-btn color="blue-grey" size="tiny" class="top_tool" @click="onLeftToolShow"> ▶ </v-btn>
          <!-- TODO TAB -->
      </div>
    </div> 



    <div class="guides_container main_container "   
        ref="el_cosmo_ref" 
        title="guides_container - cosmo (main container) div" 
    >
        
      <!-- ↓↓↓↓ 左上角の正方形 -->
      <div class="reset" 
          title="reset"
          v-on:click="onGuidesReset"
          @mouseover="onInfiniteViewerRClick"
      ></div>

      <div v-if="show_guides_hori" class="guides guides_hori" title="horizontal guide" >		<!-- vue3-guides.Guides は、描画の魂であり、実体がなさそうなため、これが必要 -->
        <Guides
            ref="guides_hori"
            type="horizontal" 
            :snapThreshold="5"
            :snaps="[0, 300, 600]"
            :displayDragPos="true"
            :dragPosFormat="v => `${v}px`"
            class="undefined_guides"
            v-on:changeGuides="onGuidesChange"
        >
        </Guides>
      </div>


      <div v-if="show_guides_vert" class="guides guides_vert" title="vertical guide" >		<!-- vue3-guides.Guides は、描画の魂であり、実体がなさそうなため、これが必要 -->
        <Guides
            ref="guides_vert"
            type="vertical" 
            :snapThreshold="5"
            :snaps="[0, 200, 400]"
            :displayDragPos="true"
            :dragPosFormat="v => `${v}px`"
            class="undefined_guides"
            v-on:changeGuides="onGuidesChange"
        >
        </Guides>
      </div>

      <!--
          :rangeX         = "[0, 0]"
          :rangeY         = "[0, 0]"    
      -->
      <VueInfiniteViewer title = "INFINITEVIEWER"
          ref   = "infinite_viewer"
          class = "viewer viewer_info"
          :margin         = "0"
          :threshold      = "0" 
          :usePinch       = "true"
          :pinchThreshold = "50"
          :maxPinchWheel  = "10"
          :useMouseDrag   = "is_infiniting"
          :useWheelScroll = "is_infiniting"
          :zoom           = "0"
          :useAutoZoom    = "is_infiniting"
          :zoomRange      = "[0.1, 10]"
          @dragStart      = "onInfiniteViewerDragStart"
          @drag           = "onInfiniteViewerDrag"
          @dragEnd        = "onInfiniteViewerDragEnd"
          @scroll         = "onInfiniteViewerScroll"
          @pinch          = "onInfiniteViewerPinch"
          @contextmenu.prevent  = "onInfiniteViewerRClick"          
      >
        <!-- ↓ 備考: 
            1) viewport_div がないと、moveable_div の表示が崩れる
            2) viewport_div は見立て？その width, height は、意味がないように見える： moveable_div は外にはみ出るし、拘束されない
                しかし、viewport_div の width, height がないと、moveable_div が表示されない 
                  ⇒適当でよい値を設定し、透明にしておく
                  @click.stop = "onMoveableClicked"
            TODO 
        -->
        <div
            class = "moveable_container viewport_div" 
            ref = "viewport_ref" 
            title = "viewport of infinite viewer; moveable_container, div" 
        >


            <!-- 
              【! EDITING】
                not is-editing の時、Moveable が裏側に配置することで、邪魔の元にならないようにすることで、
                手前にあるコンテンツ子孫の Resize を可能にする
                !is_editing
                【注意】no @contextmenu.prevent.stop = "onMoveableRClick"
                  裏側にある moveable_div_ref または moveable_frame_ref は click, contextmenu event を受付しない
              【ABLE-DIRRECT-WARP】 2023/10/17
            -->
<!-- 
            <div v-if = "!is_editing"
                ref = "moveable_div_ref" 
                class = "moveable_target moveable_div" 
                title = "Editor moveable target div a"
            >

                <div v-show="false" 
                  class = "moveable_frame" 
                  ref   = "moveable_frame_ref" 
                  title = "Editor moveable_frame a"
                >
                  <div v-show="true" class="empty_frame_desc">
                    Here is the empty moveable_frame in SvgEditor a!
                  </div>
                </div>

            </div>
 -->


            <!-- ↓↓↓↓ TODO コンテンツの Resize 避難先 -->
            <!-- 
                【ABLE-DIRRECT-WARP】廃止
                    【不要？】Moveable の resize は、svg に対しては、うまく動作しない ⇒ div と svg が混在していると、崩れる
                        回避策として、Resize に限り、viewport (Container of Moveable) / Moveable は、位置を計算することに留め、
                        コンテンツは、ここに退避させる。
                    【試し】moveable の代り、click event を受け取る
                【ABLE-DIRRECT-WARP】 2023/10/17
                    resizing_container_ref は Moveable の target にした
                    TODO @click 修正　※ 旧 moveable_div_ref @click 取り込み
                    changed class resizing_container to moveable_target
            -->
            <div
                class = "direct-wrap-target"
                ref = "resizing_container_ref"
                @contextmenu.prevent.stop = "onResizingRClick"
                @click = "onResizingClicked"
                title = "Editor resizeing_container"
            >

                <div v-if = "false" class = "direct-wrap-debuger">
                    ABLE-DIRRECT-WARP TARGET DEBUGER
                </div>

                <!-- 
                    【ABLE-DIRRECT-WARP】 2023/10/17 
                      「position: relative」container である
                -->
                <div
                    class = "resizing_frame" 
                    ref   = "resizing_frame_ref" 
                    title = "Editor resizeing_frame"
                >
                    <!-- 
                      【廃止】 2023/11/02
                        :myPosSizeRef       = "myPosSizeRef"
                        :raResizingSize     = "raResizingSize"
                        :raResizingViewbox  = "raResizingViewbox"     
                        
                      2024.01.06c EditHtmlFrame.vue style galaxy に移動した
                        style = "background-color: rgba(0, 0, 0, 0.0) !important"   
                    -->
                    <EditHtmlFrame v-if = "el_selected_content === 'edit_htmlframe'"
                        ref                 = "childHtmlFrameRef"
                        :is_root            = "true"
                        :uuid               = "other_uuid"
                        :parent_uuid        = "props.uuid"
                        :editing_uuid       = "props.uuid"
                        :editing_id         = "props.editing_id"
                        :being_edit_id      = "props.being_edit_id"

                        v-model:ctrl_on_other = "ctrl_on_other"

                        v-model:able_target_ref = "resizing_container_ref"
                        v-model:able_actmd_ref  = "able_actmd_ref"
                        v-model:able_macro_ref  = "able_macro_ref"

                        @props_updated      = "childPropsUpdated"
                        @deleted            = "childBeDeleted"
                        @uuid_changed       = "childUuidChanged"
                    >
                    </EditHtmlFrame>


                    <div v-if = "el_selected_content === 'dbg_tiptap'"
                        class = "mini_edit_frame"
                    >        
                      <div v-if="true"
                          class = "mini_editor_outline" 
                      >
                        <TiptapEditor v-if="true"
                          v-model             = "tiptap_content_ref"
                          ref                 = "other_tag_ref"
                          :is_root            = "true"
                          :uuid               = "other_uuid"
                          :editing_uuid       = "props.uuid"
                          :editing_id         = "props.editing_id"
                          :being_edit_id      = "props.being_edit_id"
                        >
                        </TiptapEditor>
                      </div>
                    </div>


                    <!-- ↓↓↓↓↓↓↓↓ BEGIN POPUP Mini-editors ---------------------------------------------------------- ↓↓↓↓↓↓↓↓ -->
                    <!-- floatMinieditorRef.value.uid != '' -->
                    <div v-if = "fmini_stat_ref != ''" 
                      class = "float_editor_container"
                    >
                      <!-- 
                        style="background-color: rgba(0, 0, 0, 0.0) !important"
                       -->

                      <!-- 
                        動作 OK 
                        TODO 高さが小さい、箇所未特定
                      --> 
<!-- 
                      <EditHtmlFrameSp v-if = "el_float_selected === 'mermaid'"
                        ref                 = "floatEditorRef" 
                        :is_root            = "true"  
                        uuid                = "float_mermaid"
                        editor_kind         = "tiptap"
                        :parent_uuid        = "props.uuid"
                        :editing_uuid       = "props.uuid"
                        :editing_id         = "props.editing_id"
                        :being_edit_id      = "props.being_edit_id"
                        :myPosSizeRef       = "myPosSizeRef"
                        :raResizingSize     = "raResizingSize"
                        :raResizingViewbox  = "raResizingViewbox"
                        :writeable_ctrl_on_other = "true"      
                        v-model:ctrl_on_other = "ctrl_on_other"
                        tag_name            = "z-diag"
                        tag_type            = "mermaid"
                        content             = "Hello, ZDiag mermaid contents"
                      >
                      </EditHtmlFrameSp>
 -->

                      <!-- 
                        EditMermaid.vue
                        動作 OK 
                        TODO resize 可能にする
                      -->

                      <EditHtmlElem v-if = "(fmini_stat_ref != '') && (floatMinieditorRef.node_type === 'zDiag')"
                          :parent_uuid = "props.uuid"
                          :is_root      = "false"
                          :able         = "true"
                          uuid          = "float_mermaid"
                          ref          = "float_editor_ref"
                          tag_name      = "z-diag"
                          tag_type      = "mermaid"
                          :init_x       = "32"
                          :init_y       = "24"
                          :init_width   = "1024"
                          :init_height  = "768"
                          class         = "intent"
                      >

                        <template v-slot:pairedElemCnts>
                            Hello, ZDiag mermaid contents
                        </template>
                      </EditHtmlElem>


                      <!-- 
                        ※ これ以降、item が存在しないことに注意
                        EditCodeMirror.vue
                      -->
                      <EditHtmlElem v-if = "(fmini_stat_ref != '') && (floatMinieditorRef.node_type === 'zCode')"
                          :parent_uuid = "props.uuid"
                          :is_root      = "false"
                          :able         = "true"
                          uuid          = "float_codemirror"
                          ref          = "float_editor_ref"
                          tag_name      = "z-code"
                          tag_type      = "code_mirror"
                          :init_x       = "32"
                          :init_y       = "24"
                          :init_width   = "1024"
                          :init_height  = "768"
                          class         = "intent"
                      >

                        <template v-slot:pairedElemCnts>
                            Hello, ZDiag mermaid contents
                        </template>
                      </EditHtmlElem>


                      <!-- 
                        EditMathlive.vue
                      -->
                      <EditHtmlElem  v-if = "(fmini_stat_ref != '') && (floatMinieditorRef.node_type === 'zMath')"
                          :parent_uuid = "props.uuid"
                          :is_root      = "false"
                          :able         = "true"
                          uuid          = "float_mathlive"
                          ref          = "float_editor_ref"
                          tag_name      = "z-math"
                          tag_type      = "mathlive"
                          :init_x       = "32"
                          :init_y       = "24"
                          :init_width   = "1024"
                          :init_height  = "768"
                          class         = "intent"
                      >

                        <template v-slot:pairedElemCnts>
                            Hello, ZMath mathlive contents
                        </template>
                      </EditHtmlElem>



                      <!-- 動作 OK -->
<!-- 
                      <EditMermaid v-if = "el_float_selected === 'mermaid'"
                          ref                 = "floatEditorRef"
                          :uuid               = "uuidv4()"
                          :is_root            = "false"
                          :editing_uuid       = "props.uuid"
                          :editing_id         = "props.editing_id"
                          :being_edit_id      = "props.being_edit_id"
                          :myPosSizeRef       = "myPosSizeRef"
                          :raResizingSize     = "raResizingSize"
                          :raResizingViewbox  = "raResizingViewbox"
                          :writeable_ctrl_on_other = "true"      
                          v-model:ctrl_on_other = "ctrl_on_other"
                      >
                      </EditMermaid>
 -->

                      <!-- 動作 OK -->
<!-- 
                      <exam-vue-mermaid-render></exam-vue-mermaid-render>
 -->
                    </div>
                    <!-- ↑↑↑↑↑↑↑↑ END POPUP Mini-editors ---------------------------------------------------------- ↑↑↑↑↑↑↑↑ -->

                    <!-- 
                    <EditHtml v-if="el_selected_content === 'edit_html'"
                        com_type="edit_html"
                        id="root_edithtml"
                        uuid="editor_html_layout"
                        ref="childEditHtmlRef" 
                        >
                    </EditHtml>
                    -->

                    <!-- 【廃止】2023/11/02 -->
<!-- 
                    <div v-show = "being_edit" 
                        ref = "mini_ctrl_ref" 
                        class = "mini_ctrl"
                    >
                      <svg 
                          class = "mini_ctrl_svg" 
                          :width = "raResizingSize.w" 
                          :height = "raResizingSize.h" 
                          :viewBox = "raResizingViewbox"
                      >
                        <rect 
                            class = "mini_ctrl_border" 
                            :x = "0" 
                            :y = "0" 
                            :width = "raResizingSize.w" 
                            :height = "raResizingSize.h"  
                            style = "fill:rgba(121,121,121,0.0);"
                            :stroke = ctrl_stroke_ref
                            :stroke-width = "(raResizingSize.w >= 32) && (raResizingSize.w >= 32) ? 16 : 1"
                            v-on:mouseover  = "mouseOverMiniCtrl" 
                            v-on:mouseleave = "mouseLeaveMiniCtrl"
                        > 
                          <title> SvgEditor Resizing debuger: 子 に重ねる表示があるため、ここは薄ら表示で良い  </title>
                        </rect>
                      </svg>
                    </div>
 -->

                </div> <!-- resizing_frame -->
            </div>  <!-- resizing_container -->
 

            <!-- ↑↑↑↑ TODO コンテンツの Resize 避難先 -->


            <!-- 
              【EDITING】
                is-editing の時、Moveable が手前に来るようにすることで、Resize 操作を可能にする
                is_editing
                【注意】no @contextmenu.prevent.stop = "onMoveableRClick"
                @click.stop @contextmenu は共に動作可能（Moveable 独自の Mouse 操作に遮断されていない）、
                  が、すっきりしたいので、ここでそれらのイベントを設定しない。
              【ABLE-DIRRECT-WARP】 2023/10/17
                  以下は廃止 TODO onMoveableClicked 移動
            -->
<!-- 
            <div v-if = "is_editing"
                ref = "moveable_div_ref" 
                class = "moveable_target moveable_div" 
                title = "Editor moveable target div b" 
                @click.stop = "onMoveableClicked"
            >

                <div v-show="false" 
                  class = "moveable_frame" 
                  ref   = "moveable_frame_ref" 
                  title = "Editor moveable_frame"
                >
                  <div v-show="true" class="empty_frame_desc">
                    Here is the empty moveable_frame in SvgEditor!
                  </div>
                </div>

            </div>
 -->
            <!--
              How to use custom CSS
                https://github.com/daybrush/moveable/blob/master/handbook/handbook.md#toc-defaultcss
              TODO 使い方: className = "moveable2"
              備考： zoom := Control-Line の表示・非表示
              ref = "moveable_ref"
            【ABLE-DIRRECT-WARP】 2023/10/17 change
              :target = "moveable_div_ref" to
              :target = "resizing_container_ref" 
            【ABLE-DIRRECT-WARP】 2023/10/17
              TODO @drag-start ...

            -->
            <Moveable v-if = 'is_editing && (able_actmd_ref == "DEFAULT")'
                title = "Editor MOVEABLE"
                className = "moveable2"
                :target           = "resizing_container_ref"
                :zoom             = "is_editing ? 1 : 0"
                :draggable        = "is_editing"
                :resizable        = "is_editing"
                :keepRatio        = "false"
                :throttleResize   = "0"
                :renderDirections = '["nw","n","ne","w","e","sw","s","se"]'
                :rotatable        = "false"
                :snakeable        = "false"
                :scalable         = "false"
                :origin           = "false"
                :displayAroundControls = "is_editing"
                @drag-start     = "onMoveableDragStart"
                @drag           = "onMoveableDrag"
                @drag-end       = "onMoveableDragEnd"
                @resize-start   = "onMoveableResizeStart"
                @resize         = "onMoveableResize"
                @resize-end     = "onMoveableResizeEnd"
                @scale          = "onMoveableScale"
                @render         = "onMoveableRender"
            />

            <Moveable v-if = 'is_editing && (able_actmd_ref == "All_In_One")'
                    :target             = resizing_container_ref
                    :draggable          = 'able_specs["All_In_One"]["draggable"]'
                    :throttleDrag       = 'able_specs["All_In_One"]["throttleDrag"]'
                    :edgeDraggable      = 'able_specs["All_In_One"]["edgeDraggable"]'
              :startDragRotate    = 'able_specs["All_In_One"]["startDragRotate"]'
                    :throttleDragRotate = 'able_specs["All_In_One"]["throttleDragRotate"]'
                    :scalable           = "true"
              :keepRatio          = 'able_specs["All_In_One"]["keepRatio"]'
                    :throttleScale      = 'able_specs["All_In_One"]["throttleScale"]'
                    :renderDirections   = 'able_specs["All_In_One"]["renderDirections"]'
                    :rotatable          = 'able_specs["All_In_One"]["rotatable"]'
              :throttleRotate     = 'able_specs["All_In_One"]["throttleRotate"]'
                    :rotationPosition   = 'able_specs["All_In_One"]["rotationPosition"]'
                    :originDraggable    = 'able_specs["All_In_One"]["originDraggable"]'
              :originRelative     = 'able_specs["All_In_One"]["originRelative"]'
                    @dragOrigin         = "onDragOrigin_AllInOne" 
                    @render             = "onRender_AllInOne" 
            />

            <Moveable v-if = 'is_editing && (able_actmd_ref == "Dra_Res_Rot")'
                    ref                 = "moveable_ref"
                    :target             = "resizing_container_ref"
                    :draggable          = 'able_specs["Dra_Res_Rot"]["draggable"]'
                    :throttleDrag       = 'able_specs["Dra_Res_Rot"]["throttleDrag"]'
              :edgeDraggable      = 'able_specs["Dra_Res_Rot"]["edgeDraggable"]'
                    :startDragRotate    = 'able_specs["Dra_Res_Rot"]["startDragRotate"]' 
                    :throttleDragRotate = 'able_specs["Dra_Res_Rot"]["throttleDragRotate"]'
              :resizable          = 'able_specs["Dra_Res_Rot"]["resizable"]' 
                    :keepRatio          = 'able_specs["Dra_Res_Rot"]["keepRatio"]' 
                    :throttleResize     = 'able_specs["Dra_Res_Rot"]["throttleResize"]'
              :renderDirections   = 'able_specs["Dra_Res_Rot"]["renderDirections"]' 
                    :rotatable          = 'able_specs["Dra_Res_Rot"]["rotatable"]' 
                    :throttleRotate     = 'able_specs["Dra_Res_Rot"]["throttleRotate"]'
              :rotationPosition   = 'able_specs["Dra_Res_Rot"]["rotationPosition"]' 
                    @drag               = "onDrag_DraResRot" 
                    @resize             = "onResize_DraResRot" 
                    @rotate             = "onRotate_DraResRot" 
            />

            <Moveable v-if = 'is_editing && (able_actmd_ref == "Dra_Res")'
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

            <Moveable v-if = 'is_editing && (able_actmd_ref == "Resizable")'
                    ref                 = "moveable_ref"
                    :target             = "resizing_container_ref"
                    :draggable          = 'able_specs["Resizable"]["draggable"]'
                    :throttleDrag       = 'able_specs["Resizable"]["throttleDrag"]'
              :edgeDraggable      = 'able_specs["Resizable"]["edgeDraggable"]'
                    :startDragRotate    = 'able_specs["Resizable"]["startDragRotate"]' 
                    :throttleDragRotate = 'able_specs["Resizable"]["throttleDragRotate"]'
              :resizable          = 'able_specs["Resizable"]["resizable"]' 
                    :keepRatio          = 'able_specs["Resizable"]["keepRatio"]' 
                    :throttleResize     = 'able_specs["Resizable"]["throttleResize"]'
              :renderDirections   = 'able_specs["Resizable"]["renderDirections"]' 
                    :rotatable          = 'able_specs["Resizable"]["rotatable"]' 
                    :throttleRotate     = 'able_specs["Resizable"]["throttleRotate"]'
              :rotationPosition   = 'able_specs["Resizable"]["rotationPosition"]' 
                    @drag               = "onDrag_DraResRot" 
                    @resize             = "onResize_DraResRot" 
                    @rotate             = "onRotate_DraResRot" 
            />


            <Moveable v-if = 'is_editing && (able_actmd_ref == "Dra_Sca_Rot")'
                  :target             = "resizing_container_ref" 
                  :draggable          = 'able_specs["Dra_Sca_Rot"]["draggable"]'
                  :throttleDrag       = 'able_specs["Dra_Sca_Rot"]["throttleDrag"]'
                  :edgeDraggable      = 'able_specs["Dra_Sca_Rot"]["edgeDraggable"]'
              :startDragRotate    = 'able_specs["Dra_Sca_Rot"]["startDragRotate"]'
                  :throttleDragRotate = 'able_specs["Dra_Sca_Rot"]["throttleDragRotate"]'
                  :scalable           = 'able_specs["Dra_Sca_Rot"]["scalable"]'
              :keepRatio          = 'able_specs["Dra_Sca_Rot"]["keepRatio"]'
                  :throttleScale      = 'able_specs["Dra_Sca_Rot"]["throttleScale"]'
                  :renderDirections   = 'able_specs["Dra_Sca_Rot"]["renderDirections"]'
                  :rotatable          = 'able_specs["Dra_Sca_Rot"]["rotatable"]'
              :throttleRotate     = 'able_specs["Dra_Sca_Rot"]["throttleRotate"]'
                  :rotationPosition   = 'able_specs["Dra_Sca_Rot"]["rotationPosition"]'
                  @drag               = "onDrag_DraScaRot" 
                  @scale              = "onScale_DraScaRot"
              @rotate             = "onRotate_DraScaRot" 
            />

            <Moveable v-if = 'able_actmd_ref == "Dra_Sca"'
                  :target             = "resizing_container_ref" 
                  :draggable          = 'able_specs["Dra_Sca"]["draggable"]'
                  :throttleDrag       = 'able_specs["Dra_Sca"]["throttleDrag"]'
                  :edgeDraggable      = 'able_specs["Dra_Sca"]["edgeDraggable"]'
              :startDragRotate    = 'able_specs["Dra_Sca"]["startDragRotate"]'
                  :throttleDragRotate = 'able_specs["Dra_Sca"]["throttleDragRotate"]'
                  :scalable           = 'able_specs["Dra_Sca"]["scalable"]'
              :keepRatio          = 'able_specs["Dra_Sca"]["keepRatio"]'
                  :throttleScale      = 'able_specs["Dra_Sca"]["throttleScale"]'
                  :renderDirections   = 'able_specs["Dra_Sca"]["renderDirections"]'
                  :rotatable          = 'able_specs["Dra_Sca"]["rotatable"]'
              :throttleRotate     = 'able_specs["Dra_Sca"]["throttleRotate"]'
                  :rotationPosition   = 'able_specs["Dra_Sca"]["rotationPosition"]'
                  @drag               = "onDrag_DraScaRot" 
                  @scale              = "onScale_DraScaRot"
              @rotate             = "onRotate_DraScaRot" 
            />

            <Moveable v-if = 'is_editing && (able_actmd_ref == "Scalable")'
                  :target             = "resizing_container_ref" 
                  :draggable          = 'able_specs["Scalable"]["draggable"]'
                  :throttleDrag       = 'able_specs["Scalable"]["throttleDrag"]'
                  :edgeDraggable      = 'able_specs["Scalable"]["edgeDraggable"]'
              :startDragRotate    = 'able_specs["Scalable"]["startDragRotate"]'
                  :throttleDragRotate = 'able_specs["Scalable"]["throttleDragRotate"]'
                  :scalable           = 'able_specs["Scalable"]["scalable"]'
              :keepRatio          = 'able_specs["Scalable"]["keepRatio"]'
                  :throttleScale      = 'able_specs["Scalable"]["throttleScale"]'
                  :renderDirections   = 'able_specs["Scalable"]["renderDirections"]'
                  :rotatable          = 'able_specs["Scalable"]["rotatable"]'
              :throttleRotate     = 'able_specs["Scalable"]["throttleRotate"]'
                  :rotationPosition   = 'able_specs["Scalable"]["rotationPosition"]'
                  @drag               = "onDrag_DraScaRot" 
                  @scale              = "onScale_DraScaRot"
              @rotate             = "onRotate_DraScaRot" 
            />


            <Moveable v-if = 'is_editing && (able_actmd_ref == "Warpable")'
                :target             = "resizing_container_ref" 
                :warpable           = 'able_specs["Warpable"]["warpable"]'
                :renderDirections   = 'able_specs["Warpable"]["renderDirections"]'
                @warp               = "onWarp_Warpable" 
            />

            <Moveable v-if = 'is_editing && (able_actmd_ref == "Clippable")'
                    :target                 ="resizing_container_ref" 
                    :draggable              = 'able_specs["Clippable"]["draggable"]'
                    :startDragRotate        = 'able_specs["Clippable"]["startDragRotate"]'
              :throttleDragRotate     = 'able_specs["Clippable"]["throttleDragRotate"]' 
                    :zoom                   = 'able_specs["Clippable"]["zoom"]'
                    :clippable              = 'able_specs["Clippable"]["clippable"]'
                    :clipRelative           = 'able_specs["Clippable"]["clipRelative"]'
              :clipArea               = 'able_specs["Clippable"]["clipArea"]' 
                    :dragArea               = 'able_specs["Clippable"]["dragArea"]' 
                    :dragWithClip           = 'able_specs["Clippable"]["dragWithClip"]' 
                    :defaultClipPath        = 'able_specs["Clippable"]["defaultClipPath"]'
              :clipTargetBounds       = 'able_specs["Clippable"]["clipTargetBounds"]' 
                    :snapThreshold          = 'able_specs["Clippable"]["5"]' 
                    :keepRatio              = 'able_specs["Clippable"]["keepRatio"]' 
                    @drag                   = "onDrag_Clippable" 
                    @clip                   = "onClip_Clippable" 
            />

            <Moveable v-if = 'is_editing && (able_actmd_ref == "Roundable")'
                  :target                         = "resizing_container_ref" 
                  :draggable                      = "true" 
                  :roundable                      = "true" 
                  :resizable                      = "true"
              :isDisplayShadowRoundControls   = "'horizontal'" 
                  :roundClickable                 = "'control'" 
                  :roundPadding                   = "15" 
                  @round                          = "onRound_Roundable"
              @render                         = "onRender_Roundable" 
                  @renderEnd                      = "onRenderEnd_Roundable" 
            />

          <!-- 参考 -->
  <!-- 
            <Moveable :target="'.target2'" :roundable="true" :roundClickable="true" @round="onRound$0" />
            <Moveable :target="'.target3'" :roundable="true" @round="onRound$1" />
            <Moveable :target="'.target4'" :roundable="true" @round="onRound$2" />
 -->

        </div> <!-- viewport -->
      </VueInfiniteViewer> <!-- svg_editor -->


      <!-- 使い方
        <v-menu :attach="'#rel_cmenu_attached'"
      -->
      <div
          id = "abs_cmenu_attached"
          class="abs_cmenu_outline"
      >
        <div
            id = "rel_cmenu_attached"
            ref = "cmenu_attached_ref"
            class = "cmenu_container"
            title = "cmenu_container :- SvgEditor Global-CMenu-Container"
        >
        </div>
      </div>


    </div> <!-- guides_container, main_container cosmo   -->


    <div class="right_outline">
      <div class="right_tool_col">
          <v-btn color="blue-grey" size="tiny" class="top_tool" @click="onRightToolHide" > ▶ </v-btn>
          <v-btn color="blue-grey" size="tiny" class="top_tool" @click="onRightToolShow"> ◀ </v-btn>
          <!-- TODO TAB -->
      </div>

      <div v-show="showRightContainerRef" class="right_container">
<!-- 
        <v-container
            class="side-panel-block"
        >
            <v-row> 
                <v-col>
                  <v-text-field
                      label="Database"
                      placeholder="bitwaves"
                      prepend-icon="mdi-database"
                      single-line
                      solo
                      v-model="selDatabaseRef"
                  ></v-text-field>
                </v-col>
                <v-col>
                      <v-btn rounded color="Primery"
                      > 
                         Change
                      </v-btn>
                </v-col>
            </v-row>  
        </v-container>
 -->
        <v-container
            class="side-panel-block"
        >
            <v-row> 
                <v-col>
                  <v-text-field
                      label="Doc. Path"
                      placeholder="C:\\DOCs\\SvgEditor"
                      solo
                      v-model="selDocPathRef"
                  ></v-text-field>
                </v-col>
            </v-row> 
            <v-row class="file_sel_row"> 
                <div>
                    <v-text-field
                        label="Doc. File Name"
                        :placeholder="selDocFileRef.placeholder"
                        prepend-icon="mdi-file-document"
                        v-model="selDocFileRef.name"
                    ></v-text-field>
                </div>
                <div>
                  <v-btn class="simple_btn file_sel_btn" @click="open">
                    Sel
                  </v-btn>
                </div>
            </v-row> File Name
        </v-container>

        <v-container 
            class="side-panel-risk-block" 
        >
            <v-row> 
                <v-col>
                    <!-- TODO   -->
                    <v-btn color="warning" title="Delete It"
                        v-on:click="mkActingEdEv('inout', 'remove_it')"
                    > 
                        Delete
                    </v-btn>
                </v-col>
            </v-row> 

<!-- 2024.01.21b 当 button は SelConditions 内に移動した ※ ここは disabled の状態で居座り表示されると不自然なので、コメントアウトした
              <v-row> 
                  <v-col>
                      <v-btn color="error" title="Not Delete It only but Delete the uuid from DB"
                          :disabled="sel_conds_ref==null"
                          v-on:click="mkActingEdEv('database', 'delete_db')"
                      > 
                          Delete From DB
                      </v-btn>
                  </v-col>
              </v-row> 
 -->
        </v-container>

        <v-container 
            v-if="actingEditRef.com_type == 'edit_html_frame'"
            class="side-panel-block"
        >
            <v-row>
                <v-col>
                  <v-checkbox
                    v-model="outline_assets_ref"
                    label="Print Outline"
                    color="primary"
                    hide-details
                  ></v-checkbox>  
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                  <v-checkbox
                    v-model="outline_root_assets_ref"
                    label="Print Root Outline"
                    color="primary"
                    hide-details
                  ></v-checkbox>  
                </v-col>
            </v-row>
            <v-row> 
                <v-col>
                    <!-- TODO   -->
                    <v-btn rounded color="success" title=".html, .css ファイルを作成します"
                        v-on:click="mkActingEdEv('inout', 'download_assets')"
                        @mouseover = "onFileAssetsMouseOver"
                    > 
                        Download Assets
                    </v-btn>
                </v-col>
                <v-col>
                    <!-- TODO   -->
                    <v-btn rounded color="blue-grey" title="html に埋め込む用 svg ファイルを作成します"
                        v-on:click="mkActingEdEv('inout', 'download_svg')"
                        @mouseover = "onFileSvgMouseOver"
                    > 
                         Download Svg File
                    </v-btn>
                </v-col>
<!-- 
                <v-col>
                    <v-btn rounded color="blue-grey" 
                        v-on:click="mkActingEdEv('inout', 'print')"
                    > 
                        Print
                    </v-btn>
                </v-col>
 -->
            </v-row> 
        </v-container>

        <v-container 
            v-if="actingEditRef.com_type == 'edit_sec_text'"
            class="side-panel-block"
        >
            <v-row> 
                <v-col>
                    <!-- TODO   -->
                    <v-btn rounded color="success"
                        v-on:click="mkActingEdEv('inout', 'download_cleartext')"
                    > 
                        Download Text File
                    </v-btn>
                </v-col>
                <v-col>
                    <!-- TODO   -->
                    <v-btn rounded color="blue-grey"
                        v-on:click="mkActingEdEv('inout', 'upload_cleartext')"
                         > Upload Text File
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn rounded color="blue-grey" 
                        v-on:click="mkActingEdEv('inout', 'download_ciphertext')"
                    > 
                        Download Encrypted File
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn rounded color="blue-grey" 
                        v-on:click="mkActingEdEv('inout', 'upload_ciphertext')"
                    > 
                        Upload Encrypted File
                    </v-btn>
                </v-col>
            </v-row> 
        </v-container>


        <!-- Buttons When EditSvgEmbed -->
        <v-container v-if="actingEditRef.com_type == 'edit_svg_embed'" class="add_panel">
            <v-row> 
                <v-col>
                    <v-btn color="blue-grey" 
                        v-on:click="mkActingEdEv('svg', 'save_db_spec')" > Save key-set to DB
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn color="blue-grey" 
                        v-on:click="mkActingEdEv('svg', 'save_json_file')"
                        @mouseover = "onFileJsonMouseOver"
                    > Save Json File
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn color="blue-grey" 
                        v-on:click="mkActingEdEv('svg', 'save_svg_file')"
                        @mouseover = "onFileSvgMouseOver"
                    > Save SVG File
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn color="blue-grey" 
                        v-on:click="mkActingEdEv('svg', 'pdf_2_svg')" 
                        @mouseover = "onFilePdfMouseOver"
                    > Convert PDF to SVG
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn color="blue-grey" 
                        v-on:click="mkActingEdEv('svg', 'potrace_2_svg')" 
                        @mouseover = "onFileBmpMouseOver"
                    > Convert bmp/pnm to SVG
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn color="blue-grey" 
                        v-on:click="mkActingEdEv('svg', 'Vtracer_2_svg')" 
                        @mouseover = "onFilePngMouseOver"
                    > Convert PNG to SVG
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn color="blue-grey" 
                        v-on:click="mkActingEdEv('svg', 'svg_2_pdf')" 
                        @mouseover = "onFileSvgMouseOver"
                    > Convert SVG to PDF
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn color="blue-grey" 
                        v-on:click="mkActingEdEv('svg', 'print')" 
                    > print
                    </v-btn>
                </v-col>
            </v-row> 
        </v-container>        




        <!-- TODO svg | text | other -->
        <v-container
            v-if="actingEditRef.com_type == 'undefined'"
            class="side-panel-block"
        >
            <v-row> 
                <v-col>
                    <!-- TODO My 部品 id, variation 入力・編集  -->
                    <v-btn rounded color="success" 
                         > 部品保存
                    </v-btn>
                </v-col>
                <v-col>
                    <!-- TODO 部品リスト、Load、add 部品  -->
                    <v-btn color="blue-grey" 
                         > 部品検索
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn color="blue-grey" 
                         > 未使用
                    </v-btn>
                </v-col>
            </v-row> 
        </v-container>

        <!-- TODO  -->
        <v-container
            v-if="actingEditRef.com_type == 'undefined'"
            class="side-panel-block"
        >
            <v-row> 
                <v-col>
                    <!-- TODO My 部品 id, variation 入力・編集  -->
                    <v-btn rounded color="success" 
                         > 部品保存
                    </v-btn>
                </v-col>
                <v-col>
                    <!-- TODO 部品リスト、Load、add 部品  -->
                    <v-btn color="blue-grey" 
                         > 部品検索
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn color="blue-grey" 
                         > 未使用
                    </v-btn>
                </v-col>
            </v-row> 
        </v-container>

      </div> <!-- right_container -->
    </div>

    </div> <!-- END main_wire_container -->
  </div> <!-- editor_world -->


  <!-- BEGIN Draggable 実験的 drag_tr .................................................................... -->
  <div v-show="showDebugerRef"
      ref="el_drag_tr_ref"
      class="drag_able select-none placeholder:cursor-move z-24"
      style="touch-action:none;"
      :style="drag_tr_style"
      title="Dragable"
  >
    <v-card v-show="true" width="960" class="drag_able_card text-sm opacity-50" >
        <template v-slot:title>
            <div class="drag_able_card_title">
                MyDebuger
            </div>
        </template>

        <template v-slot:subtitle>
            <div class="drag_able_card_subtitle">
                I am at {{ Math.round(x_drag2) }}, {{ Math.round(y_drag2) }}
            </div>	
        </template>

        <div class="drag_able_card_grid">

            <v-card class="drag_able_content">
                <v-card-title>
                    fsmService.state:
                </v-card-title>
                <v-card-text>
                    {{ fsmService.state.value }}
                </v-card-text>
            </v-card>

            <v-card class="drag_able_content">
                <v-card-title>
                    editingObjRef:
                </v-card-title>
                <v-card-text>
                    {{ editingObjRef }}
                </v-card-text>
            </v-card>

            <v-card class="drag_able_content">
                <v-card-title>
                    editCmdRef:
                </v-card-title>
                <v-card-text>
                    {{ editCmdRef }}
                </v-card-text>
            </v-card>

            <v-card class="drag_able_content">
                <v-card-title>
                    editCmdParasRef:
                </v-card-title>
                <v-card-text>
                    {{ editCmdParasRef }}
                </v-card-text>
            </v-card>

            <v-card class="drag_able_content">
                <v-card-title>
                    Element point is in:
                </v-card-title>

                <v-card-text>
                    {{ parseElem(element) }}
                </v-card-text>
            </v-card>

            <v-card class="drag_able_content">
                <v-card-title>
                    Elem By Point(~ !):
                </v-card-title>

                <v-card-text>
                    X : {{ x }}  -  Y : {{ y }} <br>
                    show-box: {{ show_box_ElemByPt }}   -  show-points: {{ show_points_ElemByPt }} <br>
                </v-card-text>
            </v-card>

            <v-card class="drag_able_content">
                <v-card-title>
                    Active (click, clicking) elem is:
                </v-card-title>
                <!-- 動作が同じであると確認出来た
                <v-card-text>
                    <UseActiveElement v-slot="{ element }">
                    Active element is {{ parseElement(element) }}
                    </UseActiveElement>
                </v-card-text>
                -->
                <v-card-text>
                    {{ parseElem(activeElement) }}
                </v-card-text>
            </v-card>

            <v-card class="drag_able_content drag_able_content_mousein">
                <v-card-title>
                    Mouse is in me?
                </v-card-title>
                <v-card-text>
                    {{ JSON.stringify(mouseInElem) }}
                </v-card-text>
                </v-card>

                <!-- ↓↓↓↓ 使う予定がないので、コメントアウトした -->
                <v-card v-if="false" class="drag_able_content">
                <v-card-title>
                    Parent Element:
                </v-card-title>
                <v-card-text>
                    {{ mouseInElemParent }}
                </v-card-text>
            </v-card>

        </div>      <!-- drag_able_card_grid    -->
    </v-card>       <!-- drag_able_card         -->
  </div>  
  <!-- END Draggable 実験的 drag_tr .................................................................... -->

  <!-- BEGIN Draggable drag-1st: Main 入力支援 .................................................................... -->
  <Draggable v-show="showAssistRef"
      ref="el_drag_1st_ref"
      v-slot="{ x: x, y: y }"
      class="drag_able select-none cursor-move z-24"
      :initial-value="{ x: innerWidth / 3.9, y: 150 }"
      :prevent-default="true"
      storage-key="vueuse-draggable-pos"
      storage-type="session"
      title="Dragable"
  >
    <v-card width="640" class="drag_able_card text-sm opacity-50" >
        <v-card-title class="drag_able_card_title">
          Assistant
        </v-card-title>

        <v-card-subtitle class="drag_able_card_subtitle">
          {{ Math.round(x) }}, {{ Math.round(y) }}
        </v-card-subtitle>

        <v-card-text class="drag_able_content">
          {{ fsmService.state.value }}
        </v-card-text>

    </v-card>
  </Draggable>
  <!-- END Draggable drag-1st: Main 入力支援 .................................................................... -->


  <!-- BEGIN Drag-It : Drag 操作支援 .................................................................... -->
  <div v-show="showEditingRef"
      ref="el_drag_op_ref"
      class="drag_able drag_it select-none placeholder:cursor-move z-24"
      style="touch-action:none;"
      :style="drog_op_ref.style"
      title="Drag-It"
      >
    <v-card width="640" class="drag_able_card text-sm opacity-50" >
        <v-card-title class="drag_able_card_title">
          {{ drog_op_title }}
        </v-card-title>

        <v-card-subtitle class="drag_able_card_subtitle">
          {{ Math.round(drog_op_ref.x) }}, {{ Math.round(drog_op_ref.y) }}
        </v-card-subtitle>

        <v-card-text class="drag_able_content">
          editingObjRef: {{ JSON.stringify(editingObjRef) }} <br>
          boundingEditing_ref: {{ boundingEditing_ref }}
          TODO self.x y w h = boundingEditing_ref
        </v-card-text>

    </v-card>
  </div>
  <!-- END Drag-It : Drag 操作支援 .................................................................... -->

</div>  <!-- END root_container -->
</template>


<script setup lang="ts">

import {
  effectScope, getCurrentScope, onScopeDispose, markRaw, toRaw, reactive, shallowReactive, shallowReadonly, isReactive, computed, shallowRef, triggerRef, customRef, ref, unref, toRef, toRefs, isRef,
  // defineExpose, defineProps, defineEmits,
  h, inject, hasInjectionContext, mergeProps, cloneVNode, isVNode, resolveComponent, resolveDirective, withDirectives, withModifiers, watch, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onErrorCaptured, onRenderTracked, onRenderTriggered, nextTick,
  provide, 
} from "vue";


import Guides from "vue3-guides";
import { VueInfiniteViewer } from "vue3-infinite-viewer";
import Moveable from "vue3-moveable";

import {
  useDraggable, useActiveElement, useElementBounding, useMouseInElement, useParentElement, useElementSize,
  useEventListener, useMouse, useMousePressed,
  onKeyStroke, useKeyModifier, useMagicKeys, 
  whenever, useFileDialog
} from '@vueuse/core'
import { UseDraggable as Draggable, } from '@vueuse/components'
import { isClient } from '@vueuse/shared'

import { v4 as uuidv4 } from 'uuid'; // このuuid の代り、独自のルールで共通的作成する
import { Buffer } from 'buffer';
import { Base64 } from "js-base64";

import { dbCfgStore } from '@/store/db_cfg' // .ts は省略可
import { storeToRefs } from 'pinia'


// import EditSvgFrame from '../components/EditSvgFrame.vue'
import EditHtmlFrame   from '../components/EditHtmlFrame.vue'
// import EditHtmlFrameSp from '../components/EditHtmlFrameSp.vue'
import EditHtmlElem from '../components/EditHtmlElem.vue'
import EditMermaid from '../components/EditMermaid.vue'
import ExamVueMermaidRender from './ExamVueMermaidRender.vue'
import TiptapEditor from "../components/TiptapEditor.vue"


const developMode = inject('developMode') as any; // readonly process.env.NODE_ENV == "development"

// 2022.11.01 版： 子コンポーネントの add-edit-svg 呼び出すの代り、cmd をセットし、actived obj が自ら
// その cmd を実行するようにする。
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editCmdRef = inject('editCmdRef');
const updateEditCmd = inject('updateEditCmd');  // function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editCmdParasRef = inject('editCmdParasRef'); // object
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialEditCmdParas = inject('initialEditCmdParas'); // function

const actingEditRef:any       = inject('actingEditRef');        // 2023.11.10
const actingEditEventRef:any  = inject('actingEditEventRef');   // 2023.11.10
const colorPickerRef:any      = inject('colorPickerRef');       // 2023.11.10

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editingObjRef = inject('editingObjRef');          // isEditFocus 系から移行させる
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateEditingObj = inject('updateEditingObj');    // function

const boundingEditing_ref = inject('boundingEditing_ref');
const updateBoundingEditing = inject('updateBoundingEditing');    // function


const fmini_content_ref: any = inject('fmini_content_ref');
const fmini_stat_ref: any = inject('fmini_stat_ref');
const floatMinieditorRef: any = inject('floatMinieditorRef');
const startupFloatMinieditor: any = inject('startupFloatMinieditor');
const testFloatMinieditor: any = inject('testFloatMinieditor');
const showFloatMinieditor: any = inject('showFloatMinieditor');
const hideFloatMinieditor: any = inject('hideFloatMinieditor');
const cancelFloatMinieditor: any = inject('cancelFloatMinieditor');
const finishFloatMinieditor: any = inject('finishFloatMinieditor');


const mouseOveringRef = inject('mouseOveringRef');

const appSpecRef: any = inject("appSpecRef");
const userCfgRef: any = inject("userCfgRef");
const appCfgRef: any = inject("appCfgRef");
const dbCfgRef: any = inject("dbCfgRef");
const dbConRef: any = inject("dbConRef");

const DelayMSecWakeUp: any = inject("DelayMSecWakeUp");

const authStatRef: any = inject("authStatRef");

const sel_conds_ref = ref(null);   // 2023.12.14f DOM of SelConditions.vue
provide('sel_conds_ref', sel_conds_ref);

const disabledAbleActsRef = ref([]);  // "draggable" | "resizable" | ...
provide('disabledAbleActsRef', disabledAbleActsRef);

const enableAddSvgTextRef = ref(false);  // "draggable" | "resizable" | ...
provide('enableAddSvgTextRef', enableAddSvgTextRef);

// BEGIN Tiptap Debuger
const tiptap_content_ref = ref(`<p><span style="color: #958DF1">Oh, for some reason that’s purple.</span></p>`);
// END Tiptap Debuger


// 唯一 EditSvg 子コンポーネント「root_editsvg」の Ref-Pointer、childEditsvgRef.value でアクセスし子コンポーネント「root_editsvg」を制御します。  
// childEditsvgRef.value は、子コンポーネント「root_editsvg」のインスタンスであり、変更することはできません。
const childEditsvgRef  = ref(null); 
const childHtmlFrameRef = ref(null);

const float_editor_ref   = ref(null);

//= const selDatabaseRef = ref("bitwaves");  // default := appCfgRef と同一
const selDatabaseRef = ref(appCfgRef.value.db_name);      // 2023.11.30
watch(selDatabaseRef, (v) => {                            // 2023.11.30
  appCfgRef.value.db_name = selDatabaseRef.value;
})

const selDocPathRef = ref(appCfgRef.value.doc_dir);       // 2023.11.30
watch(selDocPathRef, (v) => {                             // 2023.11.30
  appCfgRef.value.doc_dir = selDocPathRef.value;
})

const selDocFileRef = ref({
  type: "assets",             // 【DEPRECATED】2024.01.14a,  "assets" | "html" | "svg" | "text" | "selected" | ...
  name: "assets.html",
  placeholder: "assets.html"
});
provide('selDocFileRef', selDocFileRef);

const docFileName = () => {
  let fileName = appCfgRef.value.doc_dir.endsWith('\\')
    ? appCfgRef.value.doc_dir + selDocFileRef.value["name"]
    : appCfgRef.value.doc_dir + '\\' + selDocFileRef.value["name"];
    
    // fileName = fileName.replace(/\\/g, '/');  // for unix like

  return fileName;
}
provide('docFileName', docFileName);


// editor_world | top_container | main_wire_container | left_container | add_svg_panel | add_svg_elem_panel | add_html_panel | main_container | 
//     svg_editor | editor_overflowed | root_editor_canvas | root_svg | right_container | 
//     子コンポーネントを記憶している
const activedObjRef = ref("root_editsvg");  // uuid

const show_box_ElemByPt = inject('show_box_ElemByPt');
const show_points_ElemByPt = inject('show_points_ElemByPt');
const showElemByPoint = computed(() => show_box_ElemByPt.value || show_points_ElemByPt.value);

const x = inject('x');
const y = inject('y');
const element = inject('element');

const isDevModeRef = inject('isDevModeRef') as any;
const isPreviewModeRef = inject('isPreviewModeRef') as any;

const genInId = inject('genInId');        // 入力待ち状態の表示が予想されている    
const genInHintS = inject('genInHintS');
const genInDataA = inject('genInDataA');  // 提示情報の表示が予想されている
const genInHintA = inject('genInHintA');
const genInDataB = inject('genInDataB');
const genInHintB = inject('genInHintB');
const genInDataC = inject('genInDataC');
const genInHintC = inject('genInHintC');
const updateGenInDataA = inject('updateGenInDataA');
const updateGenInDataB = inject('updateGenInDataB');
const updateGenInDataC = inject('updateGenInDataC');


const outline_assets_ref = ref(false);
provide('outline_assets_ref', outline_assets_ref);

const outline_root_assets_ref = ref(true);
provide('outline_root_assets_ref', outline_root_assets_ref);


const inID_ref = ref(null);
const inDataA_ref = ref(null);
const inDataB_ref = ref(null);
const inDataC_ref = ref(null);

provide('inID_ref', inID_ref);
provide('inDataA_ref', inDataA_ref);
provide('inDataB_ref', inDataB_ref);
provide('inDataC_ref', inDataC_ref);

const app_msg_ref = ref("");
provide('app_msg_ref', app_msg_ref);


const left_tool_tab = ref(null);
const swatches = [
  ['#FF0000', '#AA0000', '#550000'],
  ['#FFFF00', '#AAAA00', '#555500'],
  ['#00FF00', '#00AA00', '#005500'],
  ['#00FFFF', '#00AAAA', '#005555'],
  ['#0000FF', '#0000AA', '#000055'],
];

//= BEGIN 2023.12.16a ----------->
const colorRef = ref("rgba(0, 0, 0, 0)");           // a, v-color-picker model, （color 値） ※ 後に、利用側から上書きされる

const radiosColorSelRef = ref("background_color");  // b, ↓ の Key, v-radio-group model, （color key） ※ 後に、利用側から上書きされる

const selColorsRef = ref(                           // v-radio v-for, 利用側より設定       ※ 後に、利用側から上書きされる 
  {                                                 // []
    "background_color": "rgba(0, 0, 0, 0.0)",       // b in, radio button の styleに反映、
    "color"           : "rgba(255, 255, 255, 1.0)", // a in, または、利用側から r/w される
  }
);

const colorsSource = ref("");                       // owner, initSelColorPicker() にて設定されている
provide('selColorsRef', selColorsRef);              // 利用側から直接上書きされることに注意!

const initSelColorPicker = (                        // 2024.01.08b
  selColorKey,  // Which, radio button の value
  color,        // 同期される色 (rgba)
  source = ""   // どこから呼ばれたか
) => {
  console.log(`$$$$ initSelColorPicker source ${source}: ${selColorKey}, ${color}`);
  colorsSource.value = source;

  if (selColorsRef.value[selColorKey] == undefined) {
    console.log(`  selColorKey: ${selColorKey} is not in selColorsRef.value, do nothing!`);
  } else {
    radiosColorSelRef.value = selColorKey;      // b
    selColorsRef.value[selColorKey] = color;    // [b] = a
    colorRef.value = color;                     // a

    console.log("  selColorsRef changed: \n" + JSON.stringify(selColorsRef.value, null, 2));
  }
}
provide('initSelColorPicker', initSelColorPicker);

//= for debug propuse only
watch(radiosColorSelRef, (v) => {
  console.log("$$$$ radiosColorSelRef", v); // radio button 選択時、v-color-picker に反映
  colorRef.value = selColorsRef.value[v];
})

//= END 2023.12.16a <-----------


const showTopContainerRef     = ref(true);
const showLeftContainerRef    = ref(false);
const showRightContainerRef   = ref(false);
const showBottomContainerRef  = ref(false);

const showDebugerRef = ref(false);
const showAssistRef  = ref(false);
const showEditingRef = ref(false);


const editor_able_on = ref(true);     // SvgEditor Moveable が有効かどうか ※ 常に true に変更した 2023/06/21

const el_root_ref = ref(null);        //
const el_cosmo_ref = ref(null);        //

const show_guides_hori = ref(true);
const show_guides_vert = ref(true);

const guides_hori = ref(null);
const guides_vert = ref(null);
const infinite_viewer = ref(null);


const viewport_ref = ref(null);                 // viewport (Container of Moveable)

const moveable_div_ref = ref(null);             // Moveable target
const moveable_ref = ref(null);                 // Moveable インスタンスだが、正体は？？？
const moveable_frame_ref = ref(null);           // relatived

const resizing_frame_ref = ref(null);           // relatived


//= used to saveAssetsFile 系処理
const assets_ref = ref({
  hasLaTex: 0,  // count
});
provide('assets_ref', assets_ref);


var MathJaxCDN = `
<u-jscode type="text/javascript"
  src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</u-jscode>
`;
provide('MathJaxCDN', MathJaxCDN);

var MathJaxCfg = `
<u-jscode  type="text/x-mathjax-config">
  MathJax.Hub.Config({
    TeX: { equationNumbers: { autoNumber: "AMS" }},
    tex2jax: {
      inlineMath: [ ['$','$'], ["\\(","\\)"] ],
      processEscapes: true
    },
    "HTML-CSS": { matchFontHeight: false },
    displayAlign: "left",
    displayIndent: "2em"
  });
</u-jscode>
`;
provide('MathJaxCfg', MathJaxCfg);

 
//= download 用, 2024/10/27 追加
const raw_content_ref = ref({
  //  myjson  := 独自仕様 json
  //  dict    := dict
  //  tipjson := TipTap Json  【key】raw のキーにもなれる
  //  html    := html text    【key】
  //  css     := css text     【key】※ html や tipjson 他 と同時に存在することがある
  //  svg     := svg text     【key】
  kind: "html",
});

const out_assts_ref = ref("");  // html コード
const out_style_ref = ref("");  // style の部: class 定義



//= 2023/10/15 追加
//  【named-model】動作モード, 値は ↓ able_actmd_list
const able_actmd_ref = ref('DEFAULT');  // DEFAULT := 旧実装（廃止予定）
// able_actmd_ref.value = 'Resizable';
// able_actmd_ref.value = 'Scalable';
// able_actmd_ref.value = 'Warpable';
// able_actmd_ref.value = 'Clippable';
// able_actmd_ref.value = 'Roundable';
able_actmd_ref.value = 'Dra_Res';       // !! Default にする予定
// able_actmd_ref.value = 'Dra_Res_Rot';
// able_actmd_ref.value = 'Dra_Sca';
// able_actmd_ref.value = 'Dra_Sca_Rot';
// able_actmd_ref.value = 'All_In_One';


const able_actmd_list = [                   // ↑ 値のリスト
  //= 旧 動作
  { id: "DEFAULT",          name: "DEFAULT" },
  //= 単体動作
  { id: "Dgragable",        name: "Dgragable" },                      //      ※ 未実装
  { id: "Resizable",        name: "Resizable" },                      // 実装済 := Draggable_Resizable_Rotatable
  { id: "Scalable",         name: "Scalable" },                       // 実装済 := AbleCoDragScalaRotat.vue
  { id: "Rotatable",        name: "Rotatable" },                      //      ※ 未実装
  { id: "Warpable",         name: "Warpable" },                       // 実装済 AbleBasicWarpable.vue
  { id: "Pinchable",        name: "Pinchable" },                      //      ※ 未実装
  { id: "Groupable",        name: "Groupable" },                      //      ※ 未実装
  { id: "Snappable",        name: "Snappable" },                      //      ※ 未実装
  { id: "Clippable",        name: "Clippable" },                      // 実装済 AbleBasicClippable.vue
  { id: "Roundable",        name: "Roundable" },                      // 実装済 AbleBasicRoundable.vue
  // { id: "OriginDraggable",  name: "OriginDraggable" },                //      ※ 未実装
  // { id: "Selecto",          name: "Selecto" },                        //      ※ 未実装

  //= Able Combination
  { id: "Dra_Res",          name: "Draggable Resizable" },            // 実装済 Dra_Res := Draggable_Resizable_Rotatable
  { id: "Dra_Res_Rot",      name: "Draggable Resizable Rotatable" },  // 実装済 Dra_Res_Rot AbleCoDragResizaRotat.vue
  { id: "Dra_Sca",          name: "Draggable Scalable" },             // 実装済 Dra_Sca := AbleCoDragScalaRotat.vue
  { id: "Dra_Sca_Rot",      name: "Draggable Scalable Rotatable" },   // 実装済 Dra_Sca_Rot := AbleCoDragScalaRotat.vue
  // { id: "Dra_OriDra_Rot",   name: "" },                               //      ※ 未実装 Draggable_OriginDraggable_Rotatable
  { id: "All_In_One",       name: "All In One" },                     // 実装済 AbleGroupAllInOne.vue
];


const able_macro_ref = {                    // 【named-model】in_ | out_ | io_, データ I/F
  out_pos_size_ref: ref({}),            // !! 仮、左記のように項目を追加すること
};


const resizing_container_ref = ref(null);       // The Moveable Target.【旧】コンテンツの Resize 避難先

const able_specs = {}


//= BEGIN DISABLE Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
able_specs["All_In_One"] = {
  draggable: false,
  resizable: false,
  originDraggable: false,
}
//= END   DISABLE Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//= BEGIN All_In_One Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
able_specs["All_In_One"] = {
  draggable: true,
  throttleDrag: 1,
  edgeDraggable: false,
  startDragRotate: 0,
  throttleDragRotate: 0,
  keepRatio: false,
  throttleScale: 0,
  renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
  rotatable: true,
  throttleRotate: 0,
  rotationPosition: "top",
  originDraggable: true,
  originRelative: true,
}

const onDragOrigin_AllInOne = e => {
  e.target.style.transformOrigin = e.transformOrigin;
};


const onRender_AllInOne = e => {
  e.target.style.transform = e.transform;
};

//= END   All_In_One Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//= BEGIN Draggable_Resizable_Rotatable Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
able_specs["Dra_Res_Rot"] = {
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
  rotatable: true,
  throttleRotate: 0,
  rotationPosition: "top",
}

const onDrag_DraResRot = e => {
  e.target.style.transform = e.transform;
};


const onResize_DraResRot = e => {
  e.target.style.width = `${e.width}px`;
  e.target.style.height = `${e.height}px`;
  e.target.style.transform = e.drag.transform;
};


const onRotate_DraResRot = e => {
  e.target.style.transform = e.drag.transform;
};


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


able_specs["Resizable"] = {
  maxWidth: "auto",
  maxHeight: "auto",
  minWidth: "auto",
  minHeight: "auto",
  draggable: false,       // !!
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
//= END   Draggable_Resizable_Rotatable Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//= BEGIN Draggable_Resizable_Rotatable Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
able_specs["Dra_Sca_Rot"] = {
  draggable: true,
  throttleDrag: 1,
  edgeDraggable: false,
  startDragRotate: 0,
  throttleDragRotate: 0,
  scalable: true,
  keepRatio: false,
  throttleScale: 0,
  renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
  rotatable: true,
  throttleRotate: 0,
  rotationPosition: "top",
}


const onDrag_DraScaRot = e => {
  e.target.style.transform = e.transform;
};


const onScale_DraScaRot = e => {
  e.target.style.transform = e.drag.transform;
};


const onRotate_DraScaRot = e => {
  e.target.style.transform = e.drag.transform;
};


able_specs["Dra_Sca"] = {
  draggable: true,
  throttleDrag: 1,
  edgeDraggable: false,
  startDragRotate: 0,
  throttleDragRotate: 0,
  scalable: true,
  keepRatio: false,
  throttleScale: 0,
  renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
  rotatable: false,        // !!
  throttleRotate: 0,
  rotationPosition: "top",
}


able_specs["Scalable"] = {
  draggable: false,       // !!
  throttleDrag: 1,
  edgeDraggable: false,
  startDragRotate: 0,
  throttleDragRotate: 0,
  scalable: true,
  keepRatio: false,
  throttleScale: 0,
  renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
  rotatable: false,        // !!
  throttleRotate: 0,
  rotationPosition: "top",
}
//= END   Draggable_Resizable_Rotatable Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//= BEGIN Warpable Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
able_specs["Warpable"] = {
  warpable: true,
  renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
}


const onWarp_Warpable = e => {
  e.target.style.transform = e.transform;
};
//= END   Warpable Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//= BEGIN Clippable Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
able_specs["Clippable"] = {
  draggable: true,
  startDragRotate: 0,
  throttleDragRotate: 0,
  zoom: 1,	// default is 1, TODO = zoom;
  clippable: true,
  clipRelative: false,
  clipArea: false,
  dragArea: false,	// default is false, TODO = dragArea;
  dragWithClip: 0,
  defaultClipPath: "inset",
  clipTargetBounds: false,
  keepRatio: false,
};


const onDrag_Clippable = e => {
  e.target.style.transform = e.transform;
};


const onClip_Clippable = e => {
  e.target.style.clipPath = e.clipStyle;
};
//= END   Clippable Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//= BEGIN Roundable Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const onRound_Roundable = e => {
  console.log("ROUND", e.borderRadius);
};


const onRender_Roundable = e => {
  e.target.style.cssText += e.cssText;
};


const onRenderEnd_Roundable = e => {
  e.target.style.cssText += e.cssText;
};


const onRound$0 = e => {
  console.log("ROUND", e.borderRadius);
  e.target.style.borderRadius = e.borderRadius;
};


const onRound$1 = e => {
  console.log("ROUND", e.borderRadius);
  e.target.style.borderRadius = e.borderRadius;
};


const onRound$2 = e => {
  console.log("ROUND", e.borderRadius);
  e.target.style.borderRadius = e.borderRadius;
};
//= END   Roundable Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




const other_uuid      = ref(uuidv4());          // EditSvgEmbed と互換性を保つため
const ctrl_on_other   = ref(true);              // Ctrl On OTHOR | SELF

const mini_ctrl_ref = ref(null);
const ctrl_stroke_ref = ref("rgba(88, 88, 0, 0.95)");

const cmenu_attached_ref = ref(null);
const cmenu_pos_ref = ref({ left : 128, top : 128 });   // 0, 0 は RESET の Left-Top に示す

// const el_selected_content = ref("dbg_tiptap");            // !! Debug Tiptap
const el_selected_content = ref("edit_htmlframe");        // F1: edit_svgframe | F2: edit_htmlframe | F3: edit_html | "exam_a" | "exam_b" | ..
// const el_selected_content = ref("edit_svgframe");

const el_float_selected = ref('__mermaid');

//= is_editing := [ uuid, editing_id    ] MATCHING, Moaveable 動作中
// caused by 
const is_editing = computed(() => {
  return (editingObjRef.value.uuid === props.uuid && editingObjRef.value.editing_id === props.editing_id);
})

//= being_edit := [ uuid, being_edit_id ] MATCHING, コンテンツ操作中
// caused by L-click
const being_edit = computed(() => {
  return (editingObjRef.value.uuid === props.uuid && editingObjRef.value.editing_id === props.being_edit_id);
})


const is_infiniting = computed(() => {
  return (editingObjRef.value.uuid === props.uuid && editingObjRef.value.editing_id === 'editor_infiniteviewer');
})


//= el_root_ref サイズ情報取得
// 2023/07/28　現時点で未使用
const { x: galaxy_x, y: galaxy_y, top: galaxy_top, right: galaxy_right, bottom: galaxy_bottom, left: galaxy_left, width: galaxy_width, height: galaxy_height } = useElementBounding(el_root_ref);

const c = reactive({
  x:        0,               // galaxy_x や galaxy_top ではないことに注意（↓ Debug データ参考）
  y:        0,
  w:        galaxy_width,
  h:        galaxy_height,

  //= DEBUG ...
  //  gx: 321.22918701171875 gy: 224 gtop: 224 gright: 961.2291870117188 gbottom: 704 gleft: 321.22918701171875
  gx:       galaxy_x,
  gy:       galaxy_y,
  gtop:     galaxy_top,
  gright:   galaxy_right,
  gbottom:  galaxy_bottom,
  gleft:    galaxy_left,
});


// watch(c, (val, oldVal) => {
//   console.log("$$$$ SvgEditor watch galaxy c val: " + val.w + " - " + + val.h + " oldVal: " + oldVal.w + " - " + + oldVal.h);
//   console.log("  gx: " + val.gx + " gy: " + val.gy + " gtop: " + val.gtop + " gright: " + val.gright + " gbottom: " + val.gbottom + " gleft: " + val.gleft);
// });

// const mc = computed(() => {
//   return {
//     w: Math.floor(c.w * 0.75),
//     h: Math.floor(c.h * 0.75),
//   }
// })


//= moveable_div, resizing_container 初期サイズ
// 2K / FHD(Full - HD)	1920×1080	16: 9
// 4K / UHD	            3840×2160	16: 9
const INIT_W = 1920;
const INIT_H = 1080;
// const EXP_ABLE_C_SIZE = 72;     // TODO CSS resizing_frame 等 例 0, 36 (px), resizing_container := moveable_div + this

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  uuid          : { type: String, required: false, default: 'root'            },    // Save, Load Etc
  editing_id    : { type: String, required: false, default: 'editor_moveable' },    // is_editing := [ uuid, editing_id    ] MATCHING, Moaveable 動作中
  being_edit_id : { type: String, required: false, default: 'editor_contents' },    // being_edit := [ uuid, being_edit_id ] MATCHING, コンテンツ操作中
  com_type      : { type: String, required: false, default: 'editor'          },    // component type
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits([
])


const fsmService = inject('fsmService');

const el_drag_op_ref  = ref(null);   // Drag 操作支援 
const el_drag_1st_ref = ref(null);  // 入力支援用
const el_drag_tr_ref  = ref(null);   // My Debuger

const innerWidth = isClient ? window.innerWidth : 200;

const { x: x_drag2, y: y_drag2, style: drag_tr_style } = useDraggable(el_drag_tr_ref, {
  initialValue: { x: 1035, y: 450 },
  preventDefault: true,
})

const drog_op_title = ref(null);
const drog_op_ref = ref(null);


const makeOpDragble = (x, y, title) => {
  drog_op_title.value = title;
  drog_op_ref.value = useDraggable(el_drag_op_ref, {
      initialValue: { x: x, y },
      preventDefault: true,
  });
}


makeOpDragble(innerWidth / 2.0, 100, "Drag-It");

// watch (boundingEditing_ref , (newVal, oldVal) => {
//     if (newVal) {
//         console.log('boundingEditing_ref changed to', newVal);
//         makeOpDragble(newVal.x, newVal.y, "Drag-Editing");
//     }
// })  


const activeElement = useActiveElement();   // ref （例：inDataA_ref）value （DOM）を返す 

watch(activeElement, (el) => {              // !! Debug
  console.log('focus changed to', el);
//   if (el.id === 'gS') {                  // !!!! Debug
//     console.log('ref is: ', inID_ref.value);
//   }
})


const mouseInElem = reactive(useMouseInElement(el_drag_tr_ref))     // Mouse in el_drag_tr_ref なので、Mouse Point にあるDOMの特定には使えない
// watch(mouseInElem, (el) => {
//     console.log('mouseInElem changed to', el);  // !! Debug
// })

const mouseInElemParent = useParentElement();



const rootConSize = useElementSize(el_root_ref);

const galaxyBounding = useElementBounding(infinite_viewer);

const updateGFixedEditor = inject('updateGFixedEditor');    // function

watch (rootConSize.height, (val, oldVal) => {
  if (galaxyBounding.y.value) {
    let dh = val - galaxyBounding.y.value - 8;
    // console.log("$$$$$ rootConSize changed: " + oldVal + " -> " + val + "; TODO dh = " + dh);
    // do not call updateGFixedEditor here because nested size-change occurs
  }
});

watch (galaxyBounding.y, (val, oldVal) => {
  if (rootConSize.height.value) {
    let dh = rootConSize.height.value - val - 8;
    // console.log("$$$%% galaxyBounding changed: " + oldVal + " -> " + val + "; TODO dh = " + dh);
    // do not call updateGFixedEditor here because nested size-change occurs
  }
});
  

// actived 子コンポーネント側のメソッドを発火させるメソッド
// EditSvgFrame 部品
function onAddEditSvgClick() {
    // childEditsvgRef.value.addEditSvg(name);
    console.log("onAddEditSvgClick");
    updateEditCmd({cmd: 'addEditSvg', name: 'name'});
}


function onAddSvgElemClick(elemName) {
    updateEditCmd({cmd: 'addSvgElem', elemName: elemName, uuid: uuidv4()});
}


function onAddEditHtmlClick(tagName) {
    console.log("onAddEditHtmlClick " + tagName);
    updateEditCmd({cmd: 'addEditHtml', tagName: tagName, uuid: uuidv4()});
}


//= PureHtml: サポートしているタグ
function onAddPureHtmlClick(tagName) { 
    console.log("onAddPureHtmlClick " + tagName);
    updateEditCmd({cmd: 'addPureHtml', tagName: tagName, uuid: uuidv4()});
}


//= RawHtml: 中身を自由に記述できるタグ（一つの塊として扱う、中身は解析しないでそのまま表示・出力）
function onAddRawHtmlClick(tagName, rawHtml) {
    console.log("onAddRawHtmlClick " + tagName + " " + rawHtml);
    updateEditCmd({
        cmd: 'addRawHtml',
        tagName: tagName,       // null | "div" | "span" | TODO 他にもある？ 
        rawHtml: rawHtml, 
        uuid: uuidv4()});
}


function onSelColorClick(color) {
    console.log("onSelColorClick " + color);
    updateEditCmd({cmd: 'applyColor', color: color});
}


watch (editingObjRef, (val, oldVal) => {
    console.log('SvgEditor received editingObjRef ' + JSON.stringify(val));
    if (val == "root_editsvg") {
        activedObjRef.value = "root_editsvg";   // active root_editsvg
    } else {
        activedObjRef.value = "";               // deactice root_editsvg
    }

    const deleted = val['deleted'];
    const elem_desc = val['elem_desc'];
    if ( (!deleted) && (elem_desc?.elem_ref)) {
      updateBoundingEditing( reactive(useElementBounding(elem_desc.elem_ref)));
    }

});


const editingUuid = computed(() => { return editingObjRef == null ? '' : editingObjRef.value.uuid; });
const editingObj = computed(() => { return editingObjRef == null ? '(No Editing Obj)' : editingObjRef.value.com_type + " : " + editingObjRef.value.uuid; }); 

const mouseoverObj = computed(() => { return mouseOveringRef == null ? '(No Mouseover Obj)' : mouseOveringRef.value.com_type + " : " + mouseOveringRef.value.uuid; });


const parseElem = (el) => {
    const elem = {};    
    // console.log("parsePointedElem: " + el)

    elem.id = el?.id || 'null';                  // !! 全般的、キー として使用する 2023/05/07
    elem.tagName = el?.tagName || 'null';
    elem.nodeName = el?.nodeName || 'null';
    elem.classList = el?.classList || 'null';
    return elem;
}


fsmService.onTransition((state) => {
    // console.log('*** SvgEditor.vue :: fsmService.onTransition( history: ' + (state.history == undefined ? 'undefined' : JSON.stringify(state.history.value)) + ' value: ' + JSON.stringify(state.value)); // DEBUG
})


// //=== BEGIN バブリング (Bubbling) Mouse Event chain 調査
// //= master branch
// //                                                                                                    // 発火するか WHEN moveable_div.pointer-events IS
// //                                                                                                    // auto   none
// const { pressed : root_pressed } = useMousePressed({ target: el_root_ref });                          // Yes    Yes
// whenever(root_pressed, () => {
//   console.log(";;;; ↑ root of SvgEditor pressed");
// });


// const { pressed: cosmo_pressed } = useMousePressed({ target: el_cosmo_ref });                         // Yes    Yes
// whenever(cosmo_pressed, () => {
//   console.log(";;;; ↑ cosmo of SvgEditor pressed");
// });


// const { pressed: infinite_viewer_pressed } = useMousePressed({ target: infinite_viewer });            // Yes    Yes
// whenever(infinite_viewer_pressed, () => {
//   console.log(";;;; ↑ infinite_viewer of SvgEditor pressed");
// });


// const { pressed: viewport_pressed } = useMousePressed({ target: viewport_ref });                      // Yes    Yes
// whenever(viewport_pressed, () => {
//   console.log(";;;; ↑ viewport of SvgEditor pressed");
// });


// //= branch moveable-target
// const { pressed: moveable_div_pressed } = useMousePressed({ target: moveable_div_ref });              // Yes    No
// whenever(moveable_div_pressed, () => {
//   console.log(";;;; ↑ moveable_div of SvgEditor pressed");
// });


// const { pressed: moveable_frame_pressed } = useMousePressed({ target: moveable_frame_ref });          // Yes    No
// whenever(moveable_frame_pressed, () => {
//   console.log(";;;; ↑ moveable_frame of SvgEditor pressed");
// });


// //= branch resizing
// const { pressed: resizing_container_pressed } = useMousePressed({ target: resizing_container_ref });  // No     Yes
// whenever(resizing_container_pressed, () => {
//   console.log(";;;; ↑ resizing_container of SvgEditor pressed");
// });


// const { pressed: resizing_frame_pressed } = useMousePressed({ target: resizing_frame_ref });          // No     Yes
// whenever(resizing_frame_pressed, () => {
//   console.log(";;;; ↑ resizing_frame of SvgEditor pressed");
// });
// //=== END バブリング (Bubbling) Mouse Event chain 調査


const mouse = reactive(useMouseInElement(resizing_container_ref));


const onResizingRClick = (e) => {
  console.log("onResizingRClick");
  if (editor_able_on.value) {
    if (is_editing.value) {
      console.log("  is_editing is Yes, do nothing!");
    } else {
      console.log("  Enter  Moaveable 動作モード (active Moveable) by set is_editing flag!");
      updateEditingObj({ editing_id: props.editing_id, uuid: props.uuid, com_type: props.com_type, url: 'resizing_frame', state: "is_editing", caused_by: "onResizingRClick" });
    }
  } else {
    console.log("  editor_able_on is false, do nothing!");
  }
}


const onResizingClicked = (e) => {
  console.log("$$$$ onResizingClicked");
  if (being_edit.value) {
    console.log("  being_edit is Yes, do nothing!");
  } else {
    e.preventDefault();
    console.log("  Enter コンテンツ操作モード (active resizing_container) by set being_edit flag!");
    updateEditingObj({ editing_id: props.being_edit_id, uuid: props.uuid, com_type: props.com_type, url: 'resizing_frame', state: "being_edit", caused_by: "onResizingClick" });
  }
}


// const onMoveableClicked = (e) => {  // 試し、問題あったら消す
//   console.log("onMoveableClicked");
//   if (being_edit.value) {
//     console.log("  being_edit is Yes, do nothing!");
//   } else {
//     console.log("  active resizing_container!");
//     updateEditingObj({ editing_id: props.being_edit_id, uuid: props.uuid, com_type: props.com_type, url: 'moveable_div', state: "being_edit", caused_by: "onMoveableClick" });
//   }
// }


const onInfiniteViewerRClick = (e) => {
  console.log("onInfiniteViewerRClick");
  if (is_infiniting.value) {
    console.log("  is_infiniting is Yes, do nothing!");
  } else {
    console.log("  active InfiniteViewer!");
    updateEditingObj({ editing_id: 'editor_infiniteviewer', uuid: props.uuid, com_type: props.com_type, url: 'InfiniteViewer', state: "DragAbleIng", caused_by: "onInfiniteViewerRClick" });
  }
}


const { x: vw_x, y: vw_y, top: vw_top, right: vw_right, bottom: vw_bottom, left: vw_left, width: vw_width, height: vw_height } = useElementBounding(viewport_ref);


const onInfiniteViewerDragStart = (e) => {
  console.log('@@@@@ onInfiniteViewerDragStart', e.inputEvent);
  console.log("  vw_x = " + Math.round(vw_x.value) + ", vw_y = " + Math.round(vw_y.value) + ", vw_top = " + Math.round(vw_top.value) + ", vw_left = " + Math.round(vw_left.value) + ", vw_width = " + Math.round(vw_width.value) + ", vw_height = " + Math.round(vw_height.value));
}


const onInfiniteViewerDrag = (e) => {
  if (developMode) console.log('^^^^ onInfiniteViewerDrag', e.inputEvent);
}


const onInfiniteViewerDragEnd = (e) => {
  console.log('@@@@@ onInfiniteViewerDragEnd', e.inputEvent);
  console.log("  vw_x = " + Math.round(vw_x.value) + ", vw_y = " + Math.round(vw_y.value) + ", vw_top = " + Math.round(vw_top.value) + ", vw_left = " + Math.round(vw_left.value) + ", vw_width = " + Math.round(vw_width.value) + ", vw_height = " + Math.round(vw_height.value));  
}


const onInfiniteViewerScroll = (e) => {
  const zoom = infinite_viewer.value.zoom;
  guides_hori.value.scroll(e.scrollLeft, zoom);
  guides_hori.value.scrollGuides(e.scrollTop, zoom);
  guides_vert.value.scroll(e.scrollTop, zoom);
  guides_vert.value.scrollGuides(e.scrollLeft, zoom);
}


const onInfiniteViewerPinch = (e) => {
  const zoom = Math.max(0.1, e.zoom);
  guides_hori.value.zoom = zoom;
  guides_vert.value.zoom = zoom;
}


requestAnimationFrame(() => {	
  infinite_viewer.value.scrollTo(0, 0);		// !! see also onGuidesReset
  // guides blank 表示対策
  show_guides_hori.value = false;
  show_guides_vert.value = false;
  nextTick(() => {
    show_guides_hori.value = true;
    show_guides_vert.value = true;
  })
});


const onGuidesChange = (e) => {
  console.log(e.guides);
}


const onMoveableBtnClicked = (e) => {
  console.log("on Moveable Btn Clicked");
}


const elemColor = (editing_id) => {
  let co = "rgba(24, 24, 24, 1.0)";
  if (editingObjRef.value.uuid === props.uuid && editingObjRef.value.editing_id === editing_id) {
    co = "gold";
  }
  return co;
}


const onGuidesReset = (e) => {
  e.preventDefault();
  console.log("onReset");
  infinite_viewer.value.scrollTo(0, 0);		    // !! see also requestAnimationFrame
  // guides blank 表示対策
  show_guides_hori.value = false;
  show_guides_vert.value = false;
  nextTick(() => {
    show_guides_hori.value = true;
    show_guides_vert.value = true;
  })
}


const onMoveableRender = e => {
  e.target.style.cssText += e.cssText;
};


const onMoveableDragStart = e => {
  console.log("onMoveableDragStart " + e.transform);
};


const onMoveableDrag = e => {
  // console.log("onMoveableDrag " + e.transform);
  e.target.style.transform = e.transform;         //  e.target is moveable_div_ref.value
};


const onMoveableDragEnd = e => {
  console.log("onMoveableDragEnd " + e.transform);
  const target = e.target;
  //= TRANS 量を取得
  // メモ: 前回の結果も含まれているので、前回との差分と勘違いしないように注意
  const trans = target.style.transform;                 // "translate(-185px, 0px)"
  console.log("offsetTop: " + target.offsetLeft);
  console.log("offsetTop: " + target.offsetTop);
  console.log("trans: " + trans);
  if (trans == "") {
    return;
  }
  const css = CSSStyleValue.parse('transform', trans);
  // console.log("css " + css);
  const x = css[0].x.value;                             // -185
  const y = css[0].y.value;                             // 0
  //= BEGIN 【廃止】 2023/11/02
  // //= resizing_container に反映
  // myPosSizeRef.value.width = `${target.offsetWidth + EXP_ABLE_C_SIZE}px`;
  // myPosSizeRef.value.height = `${target.offsetHeight + EXP_ABLE_C_SIZE}px`;
  // myPosSizeRef.value.left = `${x + target.offsetLeft}px`;
  // myPosSizeRef.value.top = `${y + target.offsetTop}px`;
  // //= 裏側 | 手前切り替え時に、moveable_div の位置・サイズがずれないように、初期値を記憶する
  // initAblePosSizeRef.value.width = `${target.offsetWidth}px`;
  // initAblePosSizeRef.value.height = `${target.offsetHeight}px`;
  // //= trans は検証出来ていないので、代って、offsetLeft, offsetTop を記憶する
  // // TODO initAblePosSizeRef.value.trans = trans;
  // initAblePosSizeRef.value.left = `${x + target.offsetLeft}px`;
  // initAblePosSizeRef.value.top = `${y + target.offsetTop}px`;
  // console.log("myPosSize: " + JSON.stringify(myPosSizeRef.value));
  // console.log("initAblePosSize: " + JSON.stringify(initAblePosSizeRef.value));
  //= END 【廃止】 2023/11/02
}


const onMoveableScale = e => {
  // console.log("onMoveableScale" + e.transform);
  e.target.style.transform = e.drag.transform;
};


// https://daybrush.com/moveable/storybook/index.html?path=/story/basic--basic-resizable
const onMoveableResize = e => {
  // width: 642 height: 480 transform:  translate(-2px, 0px)
  // console.log("onMoveableResize " + " offsetLeft: " + e.target.offsetLeft + " offsetTop: " + e.target.offsetTop + " width: " + e.width + " height: " + e.height + " transform: " + e.drag.transform);
  e.target.style.width  = `${e.width}px`;
  e.target.style.height = `${e.height}px`;
  e.target.style.transform = e.drag.transform;
}


const onMoveableResizeStart = e => {
  console.log("onMoveableResizeStart " + e.target.style);
}


const onMoveableResizeEnd = e => {
  console.log("onMoveableResizeEnd " + e);
  const target = e.target;
  //= TRANS 量を取得
  // メモ: 前回の結果も含まれているので、前回との差分と勘違いしないように注意
  const trans = target.style.transform;                 // "translate(-185px, 0px)"
  console.log("offsetLeft: " + target.offsetLeft);
  console.log("offsetTop : " + target.offsetTop);
  console.log("trans: " + trans);

  if (trans == "") {
    return;
  }

  const css = CSSStyleValue.parse('transform', trans);
  // console.log("css " + css);
  const x = css[0].x.value;                             // -185
  const y = css[0].y.value;                             // 0

  //= BEGIN 【廃止】 2023/11/02
  // //= resizing_container に反映
  // myPosSizeRef.value.width  = `${ target.offsetWidth  + EXP_ABLE_C_SIZE }px`;
  // myPosSizeRef.value.height = `${ target.offsetHeight + EXP_ABLE_C_SIZE }px`;
  // myPosSizeRef.value.left   = `${x + target.offsetLeft}px`;
  // myPosSizeRef.value.top    = `${y + target.offsetTop}px`;
  // //= 裏側 | 手前切り替え時に、moveable_div の位置・サイズがずれないように、初期値を記憶する
  // initAblePosSizeRef.value.width  = `${target.offsetWidth }px`;
  // initAblePosSizeRef.value.height = `${target.offsetHeight}px`;
  // //= trans は検証出来ていないので、代って、offsetLeft, offsetTop を記憶する
  // // TODO initAblePosSizeRef.value.trans = trans;
  // initAblePosSizeRef.value.left   = `${x + target.offsetLeft}px`;
  // initAblePosSizeRef.value.top    = `${y + target.offsetTop}px`;
  // console.log("myPosSize: " + JSON.stringify(myPosSizeRef.value));
  // console.log("initAblePosSize: " + JSON.stringify(initAblePosSizeRef.value));
  //= END 【廃止】 2023/11/02
}

//= BEGIN 【廃止】 2023/11/02
// const initAblePosSizeRef = ref({      // moveable_div 追跡、即時に反映出来ないことに注意
//   left:   '0px',
//   top:    '0px',
//   width:  INIT_W + 'px',
//   height: INIT_H + 'px',
//   trans: 'translate(0px, 0px)',
// })

// const renewAblePosSizeRef = ref({   // sryle .moveable_div 用
//   left:   '0px',
//   top:    '0px',
//   width:  INIT_W + 'px',
//   height: INIT_H + 'px',
//   trans: 'translate(0px, 0px)',
// })

// const myPosSizeRef = <any>ref({        // resizing_container 用
//   left:   '0px',
//   top:    '0px',
//   width:  (INIT_W + EXP_ABLE_C_SIZE) + 'px',  // moveable_div, resizing_container 参照
//   height: (INIT_H + EXP_ABLE_C_SIZE) + 'px',  // margin-left top : -36px; margin-right bottom : 36px; 想定で +72px
// })

//= END 【廃止】 2023/11/02

//= BEGIN 【REWRITE】 2023/11/02
//  未使用、未確認のため、コメントアウト 2023/11/02
// const raResizingSize = computed(() => {
//   let ct = {
//     x: 0,
//     y: 0,
//     w: INIT_W,
//     h: INIT_H,
//   };
//   let dom = resizing_container_ref;
//   if (dom.value) {
//     ct.x = dom.value.offsetLeft;
//     ct.y = dom.value.offsetTop;
//     ct.w = dom.value.offsetWidth;
//     ct.h = dom.value.offsetHeight;
//   }
//   return ct;
// })
// const raResizingViewbox = computed(() => {
//   return `0 0 ${raResizingSize.value.w} ${raResizingSize.value.h}`;
// })
//= END 【REWRITE】 2023/11/02

//= BEGIN 【廃止】 2023/11/02
// watch(is_editing, (newVal, oldVal) => {
//   console.log("~~~~~~~~ watch is_editing: " + newVal + " oldVal: " + oldVal);
//   if (newVal) {
//     renewAblePosSizeRef.value.left   = initAblePosSizeRef.value.left;
//     renewAblePosSizeRef.value.top    = initAblePosSizeRef.value.top;
//     renewAblePosSizeRef.value.width  = initAblePosSizeRef.value.width;
//     renewAblePosSizeRef.value.height = initAblePosSizeRef.value.height;
//     renewAblePosSizeRef.value.trans  = initAblePosSizeRef.value.trans;
//     console.log("  renewAblePosSizeRef: " + JSON.stringify(renewAblePosSizeRef.value));
//   } else if (oldVal) {
//     renewAblePosSizeRef.value.left   = initAblePosSizeRef.value.left;
//     renewAblePosSizeRef.value.top    = initAblePosSizeRef.value.top;
//     renewAblePosSizeRef.value.width  = initAblePosSizeRef.value.width;
//     renewAblePosSizeRef.value.height = initAblePosSizeRef.value.height;
//     renewAblePosSizeRef.value.trans  = initAblePosSizeRef.value.trans;
//     console.log("  renewAblePosSizeRef: " + JSON.stringify(renewAblePosSizeRef.value));
//   }
// })
//= END 【廃止】 2023/11/02

// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
// Disable Removeable
const keys = useMagicKeys();
whenever(keys.ctrl_backspace, () => {
  console.log("$$$$$ keys.ctrl_backspace");
  if (!is_editing.value) {
    updateEditingObj({ editing_id: props.editing_id, uuid: props.uuid, com_type: props.com_type, url: 'moveable_div', state: "DragAbleIng", caused_by: "keys.ctrl_backspace" });
  }
})


whenever(keys.ctrl_f1, () => {
  if (!is_infiniting.value) {
    updateEditingObj({ editing_id: 'editor_infiniteviewer', uuid: props.uuid, com_type: props.com_type, url: 'InfiniteViewer', state: "DragAbleIng", caused_by: "ctrl_f1" });
  }
})


whenever(keys.ctrl_f2, () => {
  // TODO v-if => viewport_ref.value.insertbefore(moveable_div_ref.value, resizing_container_ref.value); 書き方不明
  if (!is_editing.value) {
    updateEditingObj({ editing_id: props.editing_id, uuid: props.uuid, com_type: props.com_type, url: 'moveable_div', state: "DragAbleIng", caused_by: "ctrl_f2" });
  }
})


onKeyStroke('Escape', (e) => {
  e.preventDefault();
  updateEditingObj({ editing_id: "", uuid: "", com_type: "", url: "", state: "", caused_by: "Escape" });
})


onKeyStroke('F5', (e) => {
  e.preventDefault();
  el_selected_content.value = 'edit_svgframe';
})


onKeyStroke('F6', (e) => {
  e.preventDefault();
  el_selected_content.value = 'edit_htmlframe';
})


onKeyStroke('F7', (e) => {
  e.preventDefault();
  el_selected_content.value = 'edit_html';
})


onKeyStroke('F8', (e) => {
  e.preventDefault();
  el_selected_content.value = 'exam_a';
})


onKeyStroke('F9', (e) => {
  e.preventDefault();
  el_selected_content.value = 'exam_b';
})


 onKeyStroke('Enter', (e) => {
     //= TODO CMD送信 
     console.log('Enter pressed on InDataA')
 }, { target: inDataA_ref })


 onKeyStroke('Enter', (e) => {
     //= TODO CMD送信
     console.log('Enter pressed on InDataB')
 }, { target: inDataB_ref })


 onKeyStroke('Enter', (e) => {
     //= TODO CMD送信
     console.log('Enter pressed on InDataC')
 }, { target: inDataC_ref })


let scrollX = 0;
let scrollY = 0;


const wheelGuides = (e) => {
  console.log("wheelGuides");
  // guides_hori.value.scroll(e.deltaX);
  // guides_hori.value.scrollGuides(e.deltaY);
  // guides_vert.value.scroll(e.deltaX);
  // guides_vert.value.scrollGuides(e.deltaY);
  //    OR
  scrollX += e.deltaX;
  scrollY += e.deltaY;
  guides_hori.value.scroll(scrollX);
  guides_hori.value.scrollGuides(scrollY);
  guides_vert.value.scroll(scrollX);
  guides_vert.value.scrollGuides(scrollY);
}


const resizeGuides = () => {
  // console.log("resizeGuides");
  guides_hori.value.resize();
  guides_vert.value.resize();
}


const onTopToolHide = () => {
  console.log("onTopToolHide");
  showTopContainerRef.value = false;
}


const onTopToolShow = () => {
  console.log("onTopToolShow");
  showTopContainerRef.value = true;
}


const onLeftToolHide = () => {
  console.log("onLeftToolHide");
  showLeftContainerRef.value = false;
}


const onLeftToolShow = () => {
  console.log("onLeftToolShow");
  showLeftContainerRef.value = true;
}


const onRightToolHide = () => {
  console.log("onRightToolHide");
  showRightContainerRef.value = false;
}


const onRightToolShow = () => {
  console.log("onRightToolShow");
  showRightContainerRef.value = true;
}


const onToggleDebuger = () => {
  console.log("onToggleDebuger");
  showDebugerRef.value = !showDebugerRef.value;
}


const onToggleAssist = () => {
  console.log("onToggleAssist");
  showAssistRef.value = !showAssistRef.value;
}


const onToggleEditing = () => {
  console.log("onToggleEditing");
  showEditingRef.value = !showEditingRef.value;
}


const onToggleDevMode = () => {
  isDevModeRef.value = !isDevModeRef.value;
}


const onTogglePreviewMode = () => {
  isPreviewModeRef.value = !isPreviewModeRef.value;
}


const mouseOverMiniCtrl = (e) => {
  console.log(props.com_type + " : " + props.uuid + " mouseOverMiniCtrl");
  ctrl_stroke_ref.value = "rgba(88, 88, 0, 0.25)";
  e.stopPropagation();
}


const mouseLeaveMiniCtrl = (e) => {
  console.log(props.com_type + " : " + props.uuid + " mouseLeaveMiniCtrl");
  ctrl_stroke_ref.value = "rgba(88, 88, 0, 0.05)";
  e.stopPropagation();
}


function childBeDeleted(uuid) { // 子コンポーネントが削除されたときに呼ばれる関数です
  console.log(props.com_type + ' ' + props.uuid + ' childBeDeleted ' + uuid);
  // 唯一 EditHtmlFrame は削除されることがないため、実装不要
}
function childPropsUpdated(uuid, newProps) { // 子コンポーネントが更新されたときに呼ばれる関数です
  console.log(props.com_type + ' ' + props.uuid + ' childPropsUpdated ' + uuid);
  // TODO
}


function childUuidChanged(newValue, oldValue) { // 初期 Empty EditHtmlFrame ⇒ Listup ⇒ Selected
  console.log(props.com_type + ' ' + props.uuid + ' childUuidChanged ' + newValue + ' <= ' + oldValue);
  other_uuid.value = newValue;
}



const is_object = (myVar) => {
  return typeof myVar === 'object' && !Array.isArray(myVar) && myVar !== null;
}


const is_array = (myVar) => {
  return typeof myVar === 'object' && Array.isArray(myVar) && myVar !== null;
}



//= BEGIN attributes ※ 以下、_ref := dict は、EditSvgText Etc. から与えられたものであり、ここで示した items はごく一部に過ぎない
//= attributes When EditSvgText
const svg_text_ref = ref({            // 
  id: "",                             // !! 未対応
  cls: "",                            // !! 未対応
  x: 0,                               // Local 座標系
  y: 28,                              // !! ベースラインより上の領域で描画され、精確なサイズは↓ getBBox() でしか知り得ない ⇒ 概算 ?1.2 に
  textLength: 128,                    // ↓ required by
  lengthAdjust: "spacing",            // spacing | spacingAndGlyphs
  text_anchor: "start",               // 文字揃え(text-anchor), start := 左端を基準に配置 | middle := 文字列の中心を基準に配置 | end := 右端を基準に配置
  font_family: "sans-serif",          // 
  font_size: 20,                      // !! y と同時に更新することを忘れずに
  fill: "rgba(0, 0, 0, 1.0)",         // 2023.12.16a
  stroke_width: 1,                    // 2023.12.16a プレゼンテーション属性
  stroke: "rgba(0, 0, 0, 1.0)",       // 2023.12.16a プレゼンテーション属性
  text: "123456.78",
  transform: "rotate(0 0, 0)",        // 

  z_index: 0,      // 2023.12.18a Family EdiyHtmlElem の z-index on EditHtmlFrame

  //= background_color color ※ 親 container earth_ref に（も）適用する TODO assets etc. 出力に適用させ
  //  "" | null | undefined の時、appCfgRef.back_color front_color を適用する
  //=
  background_color: "rgba(0, 0, 0, 0.0)", // 2023.12.16a 透明 if not is_root EditHtmlFrame
});
provide('svg_text_ref', svg_text_ref);


//= attributes When EditSvgRect
const svg_rect_ref = ref({
  z_index: 0,
  x: 0,
  y: 0,
  w: 320,
  h: 240,
  fill: "rgba(124, 237, 127, 0.15)",
  stroke: "rgba(33,33,255,1.0)",
  stroke_width: 1,
  // style: "fill:rgba(124, 237, 127, 0.15);stroke-width:1;stroke:rgba(33,33,255,1.0)"  // TODO R-Panel で実装する予定の属性
});
provide('svg_rect_ref', svg_rect_ref);


//= attributes When EditSvgLine
const svg_line_ref = ref({
  z_index: 0,
  id: "",
  cls: "",
  x1: 0,
  y1: 64,
  x2: 128 - 0 * 2,
  y2: 64,
  stroke: "blue",
  stroke_width: 1,
});
provide('svg_line_ref', svg_line_ref);


//= attributes When EditSvgCircle
const svg_circle_ref = ref({
  z_index: 0,
  cx: 50,
  cy: 40,
  r : 40,
  stroke: "blue",
  stroke_width: 1,
  fill: "rgba(255, 255, 0, 0.10)",
  // TODO style 情報
});
provide('svg_circle_ref', svg_circle_ref);


//= attributes When Ellipse
const svg_ellipse_ref = ref({           // 
  z_index: 0,
  cx: "120",
  cy: "140",
  rx: "50",
  ry: "30",
  stroke: "black",
  stroke_width: "1",
  fill: "yellow"
  // TODO style 情報
});
provide('svg_ellipse_ref', svg_ellipse_ref);


//= attributes When Polygon
const svg_polygon_ref = ref({           // 
  z_index: 0,
  points: "50,50 150,50 150,150, 50,150 125,75 150,150",
  stroke: "black",
  stroke_width: "1",
  fill: "lightgreen",
  // TODO style 情報
});
provide('svg_polygon_ref', svg_polygon_ref);


//= attributes When Polyline
const svg_polyline_ref = ref({           // 
  z_index: 0,
  points: "50,50 150,50 150,150, 50,150 125,75 150,150",
  stroke: "black",
  stroke_width: "1",
  fill: "lightgreen",
  // TODO style 情報
});
provide('svg_polyline_ref', svg_polyline_ref);


//= attributes When SvgSrc
const svg_src_ref = ref({
  z_index: 0,
  src: '<circle cx="100" cy="40" r="39" stroke="#f00" fill="#f88" />',

  background_color: "rgba(0, 0, 0, 0.0)",
  color: appCfgRef.value.front_color,

  // TODO style 情報
});
provide('svg_src_ref', svg_src_ref);


//= attributes When SvgEmbed
const MAX_SVG_LAYER_NUM = 10;                 // Layer 数の上限 2023.12.24r
const svg_em_cur_layer_ref = ref(0);      // 1) 2023.12.24r current layer 0..
const svg_em_lay_length_ref = ref(1);     // 2) 2023.12.24r Layer 数
const svg_em_lay_show_ref = ref(          // 3) 2023.12.24r show | hide []
      Array(MAX_SVG_LAYER_NUM).fill(true) );  

const svg_embed_ref = ref({ // 2023.12.24r ↑ Layer 1) 2) 3) もあることを忘れずに
  z_index: 0,

  // src: '<circle cx="20" cy="20" r="15" stroke="red" fill="#fff" stroke-width="2" />',   // defineModel svg_content of EditSvgDefs.vue

  background_color: "rgba(0, 0, 0, 0.0)",
  color: appCfgRef.value.front_color,

  // TODO style 情報
});

provide('MAX_SVG_LAYER_NUM', MAX_SVG_LAYER_NUM);
provide('svg_em_lay_show_ref', svg_em_lay_show_ref);
provide('svg_em_lay_length_ref', svg_em_lay_length_ref);
provide('svg_em_cur_layer_ref', svg_em_cur_layer_ref);
provide('svg_embed_ref', svg_embed_ref);


//= attributes When SvgPath
const svg_path_ref = ref({
  z_index: 0,
  background_color: "rgba(0, 0, 0, 0.0)",
  stroke: appCfgRef.value.front_color,  // svg :: path :: stroke := color
  fill: "none",                         // svg :: path :: fill := color | none
  stroke_width: 1,                      // svg :: path :: stroke-width := int 

  draw_mode: true,                      // true := drawing ベジエ曲線 | false := Ctrl-Points MoveAble 動作中    

  // TODO style 情報
});
provide('svg_path_ref', svg_path_ref);

// watch svg_path_ref draw_mode:
watch(() => svg_path_ref.value.draw_mode, (newMode) => {
  console.log(`svg_path_ref draw_mode changed, newMode is ${newMode}`);
});


//= attributes When SvgFitCurve
const svg_fitcurve_ref = ref({
  z_index: 0,
  background_color: "rgba(0, 0, 0, 0.0)",
  stroke: appCfgRef.value.front_color,  // svg :: path :: stroke := color
  fill: "none",                         // svg :: path :: fill := color | none
  stroke_width: 1,                      // svg :: path :: stroke-width := int 

  draw_mode: true,                      // true := drawing ベジエ曲線 | false := Ctrl-Points MoveAble 動作中
  // TODO style 情報
});
provide('svg_fitcurve_ref', svg_fitcurve_ref);


//= attributes When HtmlNodeTree (alais EditTipTap)
const edit_tiptap_ref = ref({
  z_index: 0,
  background_color: "rgba(0, 0, 0, 0.0)", // 2023.12.16a a) assets 出力用, 透明 if not is_root EditHtmlFrame
  color: appCfgRef.value.front_color,     // 2023.12.16a a) assets 出力用
});
provide('edit_tiptap_ref', edit_tiptap_ref);


//= attributes When Layout (alais EditLayout)
const edit_layout_ref = ref({
  z_index: 0,
  background_color: "rgba(0, 0, 0, 0.0)",
  color: appCfgRef.value.front_color,

  item_background: "rgba(0, 0, 0, 0.0)",  // 2023.12.16a 透明 if not is_root EditHtmlFrame
  cell_background: "rgba(0, 0, 0, 0.0)",  // 2023.12.16a 透明 if not is_root EditHtmlFrame
  lauout_mode: true,                      // 2024.01.06f true := Layout 動作可
  // TODO style 情報
});
provide('edit_layout_ref', edit_layout_ref);


//= attributes When SecText
const edit_sec_text_ref = ref({
  z_index: 0,
  background_color: "rgba(0, 0, 0, 0.0)",
  color: appCfgRef.value.front_color,

  // TODO style 情報
});
provide('edit_sec_text_ref', edit_sec_text_ref);


//= attributes When HtmlFrame
const edit_html_frame_ref = ref({
  z_index: 0,
  background_color: "rgba(0, 0, 0, 0.0)",
  color: appCfgRef.value.front_color,

  // TODO style 情報
});
provide('edit_html_frame_ref', edit_html_frame_ref);

// watch edit_html_frame_ref
watch (edit_html_frame_ref, (newVal, oldVal) => {
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$ watch edit_html_frame_ref: \n" + JSON.stringify(newVal, null, 2) + " \noldVal: " + JSON.stringify(oldVal, null, 2));
  if (newVal.background_color != "") {
    appCfgRef.value.back_color = newVal.background_color;
  }
  if (newVal.color != "") {
    appCfgRef.value.front_color = newVal.color;
  }
}, { deep: true })  // deep: true で、ネストしたオブジェクトの変更も監視する


//= END attributes ※ 以下、_ref := dict は、EditSvgText Etc. から与えられたものであり、ここで示した items はごく一部に過ぎない


const makeDocPlaceholder = (type: String, placeholder: String) => {
  if ((selDocFileRef.value["type"] != type) || (selDocFileRef.value["placeholder"] == "")) {
    nextTick(() => {
      selDocFileRef.value["type"] = type;
      selDocFileRef.value["placeholder"] = placeholder;
    })
  }
}


const onAddLayoutMouseOver = () => {
  console.log('^^^^^^^^^ onAddLayoutMouseOver');

  if (genInId.value != "Layout") {
    nextTick(() => {
      updateGenInDataA("gB: Number of Rows, gc: Number of Columns", "Layout", "Grid Layout を作成します", "");
      genInId.value = "Layout"
      genInDataB.value = "2";
      genInDataC.value = "3";
    })
  }
}


const onFileAssetsMouseOver = () => {
  console.log('^^^^^^^^^ onFileAssetsMouseOver');
  makeDocPlaceholder("assets", "assets.html");
}


const onFileSvgMouseOver = () => {
  console.log('^^^^^^^^^ onFileSvgMouseOver');
  makeDocPlaceholder("svg", "noname.svg");
}


const onFilePdfMouseOver = () => {
  console.log('^^^^^^^^^ onFilePdfMouseOver');
  makeDocPlaceholder("pdf", "noname.pdf");
}


const onFileJsonMouseOver = () => {
  console.log('^^^^^^^^^ onFileJsonMouseOver');
  makeDocPlaceholder("json", "noname.json");
}


const onFileBmpMouseOver = () => {
  console.log('^^^^^^^^^ onFileBmpMouseOver');
  makeDocPlaceholder("bmp", "noname.bmp");
}


const onFilePngMouseOver = () => {
  console.log('^^^^^^^^^ onFilePngMouseOver');
  makeDocPlaceholder("png", "noname.png");
}


const { files, open, reset, onChange } = useFileDialog({
  multiple: false,
  directory: false,
  reset: false,
})

onChange((files) => {
  console.log('Selected files:', files);
  if (files.length > 0) {
    const file = files[0];
    const name = file.name;
    const pathname = file.path;
    const parent = pathname.replace(`\\${name}`, "");   // !! TODO for unix like
    selDocPathRef.value = parent;
    selDocFileRef.value["name"] = name;
    selDocFileRef.value["type"] = file.type;            // "image/svg+xml" 2024.01.14a
    app_msg_ref.value = `Selected file: ${parent}, ${name}`;
  }
})


const mkActingEdEv = (cate, name, val = null) => {
  //= actingEditEventRef を作成する
  //  
  //=  
  console.log(`mkActingEdEv cate: ${cate}, name: ${name}`);
  
  actingEditEventRef.value = {
    com_type  : actingEditRef.value.com_type,
    uuid      : actingEditRef.value.uuid,
    cate      : cate,
    event     : name,
    val       : val,
    time      : Date.now(),   // これがなければ、前回と同一の値を与えると、watch が発火しない
  };
}

//= memoryEditRef 
// a) memoryEditRef に値の記憶は、v-btn MS(Ctrl+S)にて明示的に行う
// b) memoryEditRef の使い方
//  1)（例）EditHtmlFrame に、EditSvgText を追加する時、
//  2) memoryEditStatRef is true 且つ memoryEditRef に有効な値がある時、
//  3) Load-DB(memory) でデータを取得し、新しい uuid を与えることで、EditHtmlFrame の children EditSvgText をのコピーを作成する
//=
const memoryEditStatRef = ref(false);   // 2024.01.01c ↓使うかどうか
const memoryEditRef = ref({             // 2024.01.01c 記憶された EditSvgText Etc. 
  com_type: "",
  uuid: "",
})
provide('memoryEditRef', memoryEditRef);
provide('memoryEditStatRef', memoryEditStatRef);


watch(colorRef, (val, oldVal) => {  // 2023.12.16a v-color-picker ⇒ selColorsRef
  console.log("watch colorRef: " + val + " oldVal: " + oldVal);

  if (!(radiosColorSelRef.value in selColorsRef.value)) {
    return;
  }
  selColorsRef.value[radiosColorSelRef.value] = val;
})

//= 2023.12.16a ※ 利用側で、watch すること（↓ は、Debug 用である）
watch(selColorsRef, (val) => {  // 2023.12.16a
  console.log("selColorsRef changed to ", JSON.stringify(val, null, 2));
}, { deep: true })  // deep: true で、ネストしたオブジェクトの変更も監視する



const resetDb = () => {
  console.log("resetDb");

  const item = {
    uuid: "admin_db",
    com_type: "admin_db",
    meta: {
      'tables': 'all',  // 実データ Table を全て削除する ※ app_cfg etc. 管理用 Table は削除しない
    },
    content: {
    }
  };
  sql_reset_db(item);
}


async function sql_reset_db(item) {
  console.log("sql_save_content");

  const payload = JSON.stringify(item);
  const content = Buffer.from(payload).toString('base64');  // pyshell トラブル回避

  const sendData = {
    dbConnStr: dbConRef.value,   // 管理 DB ではなく、アプリ DB に対して操作する
    sql_req: {
      'kind': 'admin_db',
      'op': 'reset_table',
    },
    content: content
  };

  const result = await window.unipyapi.rwSqlContent(sendData);
  console.log("  result: " + JSON.stringify(result, null, 2));

  const success = result["code"] == 0 && result['readed_data'] != null && result['readed_data']['exit_code'] == 0;
}


defineExpose({
  childEditsvgRef,
  activedObjRef,      // TODO active obj. 表示・動作制御
})


onBeforeMount(() => {   // after template be compiled
  console.log(props.com_type + "::" + props.uuid + " BeforeMount!");
})

onMounted(async () => { // after DOM nodes be inserted
  await nextTick();

  guides_hori.value.resize();
  guides_vert.value.resize();
  window.addEventListener("resize", resizeGuides);
  window.addEventListener("wheel",  wheelGuides);

  // BEGIN START SVG PATH Fsm-SERVICEs ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //= 外では動作しないので、ここへ移動した
  console.log('***** onMounted Start fsmService');
  fsmService.start();
  console.log('**** onMounted send INIT to fsmService');
  fsmService.send('EditorMounted');
  fsmService.send("SwToPreferedPage");
  // END START SVG PATH Fsm-SERVICEs ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


  if ((!authStatRef.value) && (appSpecRef.value["app_license"] == "commercial")) {  // !! 2024.02.01a shareware 対応
    console.log("$$$$ authStatRef.value is false and app_license is commercial, so resetDb");
    resetDb();
  }
})


// onBeforeUpdate(() => {   // after data changed
//   //=
//   //  このフックの内部でコンポーネントの状態を変更することも安全です。
//   //=
//   console.log(props.com_type + "::" + props.uuid + " BeforeUpdate!");
// })

// onUpdated(() => {     // after re-renter and patch
//   //=
//   //  親コンポーネントの更新フックは、子コンポーネントの更新フックの後に呼び出されます。
//   //  WARNING 更新フックでコンポーネントの状態を変更しないでください - 無限更新ループになる可能性があります！
//   //=
//   console.log(props.com_type + "::" + props.uuid + " Updated!");
// })


onBeforeUnmount(() => { // after unmounted? Vue 2.x beforeDestroy
  console.log(props.com_type + ' ' + props.uuid + ' beforeUnmount!');
})

onUnmounted(() => {   // after unmounted
  console.log(props.com_type + "::" + props.uuid + " Unmounted!");
  window.removeEventListener("resize", resizeGuides);
  window.removeEventListener("wheel", wheelGuides);
})

//= Dev のみ
// https://ja.vuejs.org/guide/extras/reactivity-in-depth
//=
onRenderTracked((event) => {
  if (process.env.NODE_ENV !== 'production') { return }
   
  try {
    const info = {
      type: event.type,
      key: event.key,
      oldValue: event.oldValue,
      newValue: event.newValue,
      target: event.target,
    }
    console.log(props.com_type + "::" + props.uuid + " onRenderTracked: " + JSON.stringify(info));
  } catch (e) {
    console.log(props.com_type + "::" + props.uuid + " onRenderTracked: " + e);
  }
})

//=
// editor::root onRenderTriggered: {
// "type": "set", "key": "value", "newValue": 36.77499771118164, 
// "target": { "__v_isShallow": false, "dep": { "w": 0, "n": 0 }, "__v_isRef": true, "_rawValue": 36.77499771118164, "_value": 36.77499771118164 } }
//=
onRenderTriggered((event) => {
  if (process.env.NODE_ENV !== 'production') { return }
  
  try {
    const info = {
      type: event.type,
      key: event.key,
      oldValue: event.oldValue,
      newValue: event.newValue,
      target: event.target,
    }
    console.log(props.com_type + "::" + props.uuid + " onRenderTriggered: " + JSON.stringify(info));
  } catch (e) {
    console.log(props.com_type + "::" + props.uuid + " onRenderTriggered: " + e);
  }
})



</script>


<script lang="ts">
import { defineComponent } from 'vue'
import { bindActionToState } from 'xstate/lib/State';

export default defineComponent({
    name: 'SvgEditor',
});

</script>


<style lang="scss" scoped>

// 全ての要素にborder-boxを適用させておく設定
*, *:before, *:after {
  box-sizing: border-box;
}

::deep(.my_chkbox .v-label) {
 font-size: 11px;
}

.root_container {
    position:relative;
    display: block;
    background-color: rgba(33, 33, 33, 1.0);

    // padding: 5px; 
    /* ↑【暫】外側にある scroll-bar が微妙に動く問題対策 */

    width: 100%;
    height: 100%;
}

.editor_world {
    position:relative;
    display: block;
    width: 100% !important; // 横 scroll させたくない
    height: 500%;           // 【お試し】2023/11/06 十分な領域がほしい 
    display: grid;
    grid-template-rows: auto 1fr;

    // background-color: #faa8a8;
    // margin: 1px;
    // outline: 1px solid rgba(255, 0, 0, 1.0);

}


.drag_able {
    position: absolute;
    pointer-events: auto;
    background-color:rgba(0, 0, 0, 0.75);
    margin: 0px;
    border: 1px solid #0498fa96;
}

.drag_it {
  border: 1px solid #0498faff;
}


.drag_able_card {
    pointer-events: auto;
    background-color:rgba(0, 0, 0, 0.0);
    color: whitesmoke;
    margin: 1px;
    outline: 1px solid #7a6bad00;
    width: 960px;
}

.drag_able_card_title {
    pointer-events: auto;
    color: rgb(155, 155, 243);
}

.drag_able_card_grid {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.drag_able_card_subtitle {
    pointer-events: auto;
    color: rgb(155, 155, 243);
}

.drag_able_content {
    pointer-events: auto;
    background-color:rgba(0, 0, 0, 0.0);
    color: whitesmoke;
    margin: 2px;
    outline: 1px solid rgba(128, 128, 128, 0.75);
    min-height: 180px;
}

.drag_able_content_mousein {
    pointer-events: auto;
    /* min-height: 180px; */
}

.top_outline {
    background-color: rgba(0, 0, 0, 0.0);
    margin: 1px;
    outline: 1px solid rgba(22, 22, 22, 1.0);
}

.top_container {
    display: grid;
    grid-template-columns: 10fr 15fr 15fr 15fr;
}

.top_tool_row {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  background-color: rgba(2, 22, 35, 1.0);  
}

.top_tool_row_cols {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.auth_info {
  width: fit-content;
  background-color: rgba(0, 0, 0, 0.0);
  color: rgba(255, 255, 255, 1.0);
  color: v-bind("authStatRef ? 'white' : 'gray'");
}

.top_tool {           // ▲ ▼
  margin-left: 1px;
  margin-right: 1px;
}


.main_wire_container {
    display: grid;
    grid-template-columns: auto 1fr auto;
    margin: 1px;
    outline: 1px solid rgba(22, 22, 22, 1.0);
    // background-color: rgba(16, 140, 235, 0.827);
    // padding: 4px;
}


.left_tool_col {
  display: grid;
  grid-template-rows: auto auto 1fr;
  background-color: gray;
}

.right_tool_col {
  display: grid;
  grid-template-rows: auto auto 1fr;
  background-color: gray;
}

.left_outline {
    display: grid;
    grid-template-columns: auto auto;

    background-color:grey;
    margin: 1px;
    outline: 1px solid #012b0e;
    padding: 2px;
}

.left_container {
    width : 384px;
    position: relative;
    display: block;
    background-color:rgba(88, 88, 88, 1.0);
    padding: 1px;
}

.acting-com-type {
  border: 1px solid yellow;
  font-size: 18pt;
  color: gold;
  text-align: center;
}

.acting-com-uuid {
  border: 1px solid gray;
  font-size: 10pt;
  color: gray;
  text-align: left;
}

.acting-edit {
    display: inline-block;
    position: relative;
    background-color: black;
    color:rgba(255, 255, 255, 1.0);
    font-size: 1em;
    margin: 1px;
    outline: 1px solid #5009f7;
    padding: 4px;
}

.left-tab-container {
    min-height: 36em;
    border: 1px solid rgb(113, 113, 67);
}

.add_panel {
    display: inline-block;
    position: relative;
    background-color: #c7c5ec;
    margin: 1px;
    outline: 1px solid #5009f7;
    padding: 4px;
}

.sel-able-btn {
  width:fit-content;
  height: 32px;
  font-size: 11px;
  color: blue;
}

.my_btn {
  width:fit-content;
  font-size: 11px;
}

.toggle_able_act {
  color: rgb(245, 7, 7);
}

.right_outline {
    display: grid;
    grid-template-columns: auto auto;

    background-color:grey;
    margin: 1px;
    outline: 1px solid #012b0e;
    padding: 2px;
}

.right_container {
    width : 384px;
    position: relative;
    display: block;
    background-color:rgba(88, 88, 88, 1.0);
    padding: 1px;
}

.side-panel-risk-block {
    border: 1px solid rgb(234, 134, 11);
    padding: 4px;
    margin-top: 2px;
    margin-bottom: 2px;
}

.side-panel-block {
    border: 1px solid rgb(113, 113, 67);
    margin-top: 2px;
    margin-bottom: 2px;
    color:rgba(255, 255, 255, 1.0);
}

.main_container {                                               /* guides 領域の親要素 guides_container main_container */
    display: block;
    position: relative;
    padding: 0px;
    margin: 1px;
    outline: v-bind(" '1px solid ' + elemColor('editor_infiniteviewer') ");
}

.guides_container {                                              /* guides 領域の親要素 guides_container main_container */
    display: block;
    position: relative;
    color: rgba(0, 24, 0, 1.0);
    background-color:rgba(0, 24, 0, 1.0);
    overscroll-behavior: none;									/* !! 指定すると良いでしょう */
    // transform-style: preserve-3d;								/* ?? */
}

.reset {  													    /* 左上角の正方形 */
  position: absolute !important;
  background-color: rgba(0, 24, 0, 1.0);			            /* ↑ background-color と同値と良いでしょう */
  top: 0 !important;
  left: 0 !important;
  width:  30px !important;
  height: 30px !important;
  /* z-index: 1; ↓↓↓↓ それらより裏にある必要があります、必要なら強制的設定しましょう */
  box-sizing: border-box;
  cursor: pointer;
}



.guides { 												        /* guides h/v 共通 */
  position: absolute !important;
  transform: translateZ(1px);
  opacity: 0.75;                              /* 【こっちは効く */
  color: rgba(0, 255, 0, 0.25);             /* 【試し】効かない様子 */
  background-color: rgba(0, 0, 255, 0.25);  /* 【試し】効かない様子 */
  }

.guides_hori {
  position: absolute !important;
  top: 0 !important;
  left: 30px !important;
  width: calc(100% - 30px) !important;
  height: 30px !important;								    /* TODO size-band ではなく、full-size 時 bg-color透明にする方法 */
}


.guides_vert {
  position: absolute !important;
  top: 30px !important;
  left: 0 !important;
  width: 30px !important;
  height: calc(100% - 30px) !important;					    /* TODO size-band ではなく、full-size 時 bg-color透明にする方法 */
}


.viewer_info {                           /* ↓↓↓↓ svg_editor - vue-infinite-viewer */
  // border: v-bind(viewerBorder);
  box-sizing: border-box;
}

.viewer {                               /* ↑↑↑↑ svg_editor - vue-infinite-viewer */
  pointer-events: auto;                 /* TODO none when foucus on moveable */
  position: absolute !important;
  left: 30px !important;                // guides_ 30px 参照
  top:  30px !important;
  width:  calc(100% - 30px) !important;
  height: calc(100% - 30px) !important;
  background-color: rgba(0, 24, 0, 1.0);

  //= ↓ debug, release 時コメントアウトを忘れずに
  // color: rgba(255, 255, 255, 1.0);
  // border: 2px solid rgba(255, 64, 128, 0.75);  // !! debug
}


.viewport_div {             /* 見立て */
  width: 100%;
  height: 100%;
  // background-color: rgba(43, 39, 29, 0.0);              /* 0.15 透明にする */
  // color: rgba(255, 255, 255, 0.0);                      /* 0.15 透明にする, 色の childen への影響に注意してください */

  //= ↓ debug, release 時コメントアウトを忘れずに
  // border: 1px solid rgba(255, 255, 0, 1.0); /* 0.10 透明にする */
}

.moveable_container {
  position: relative !important;
  display: block !important;
}

.direct-wrap-target {                 // 【重要】 resizing_container_ref := the MoveAble target
  position: absolute !important;
  width : v-bind("INIT_W + 'px'");    // これらは、初期位置・サイズに過ぎない
  height: v-bind("INIT_H + 'px'");
  top : 0px;
  left: 0px;

  background-color: rgba(63, 81, 63, 0.0);
  color: rgba(255, 255, 255, 1.0);

  //= ↓ debug, release 時コメントアウトを忘れずに
  // border: 1px solid rgba(255, 0, 255, 0.75);
}

.resizing_frame {
  display: block;
  position: relative;

  //= 2023/10/31 100% に変更
  width: 100%;
  height: 100%;
  // margin:   36px !important;
  // padding:  0px;
  // width:    calc(100% - 72px) !important;
  // height:   calc(100% - 72px) !important;

  background-color: rgba(35, 35, 35, 1.0);
  color: rgba(255, 255, 255, 1.0);

  //= ↓ debug, release 時コメントアウトを忘れずに
  // opacity: 0.55;
  // border: 1px solid rgba(128, 255, 0, 0.75);
}

.direct-wrap-debuger {
    width: 100%;
    height: 100%;
    line-height: 100px;
    text-align: center;
    background-color: #ee8;
    color: #333;
    font-weight: bold;
    border: 1px solid #333;
    box-sizing: border-box;
}


.point_item_info_frame {
    pointer-events: none;
    position : relative;
    display: grid;
    grid-template-rows: 1fr 1fr;
    background-color: darkslategray;
    color:rgba(255, 255, 255, 1.0);
    width: 100%;
    height: auto;
    margin: 1px;
    outline: 1px solid red;
}


.point_item_info {
    pointer-events: none;
    background-color: rgba(16, 19, 19, 0.445);
    color:rgba(255, 255, 255, 1.0);
    width: auto;
    height: auto;
    margin: 1px;
    outline: 1px solid rgba(182, 234, 53, 0.696);
}

.in_gen_id {
  background-color: rgb(14, 16, 22);
  color:rgba(255, 255, 255, 1.0);
  margin: 1px;
}

.in_gen_data {
  background-color: black;
  color:rgba(255, 255, 255, 1.0);
  margin: 1px;
}


.float_editor_container {
  pointer-events: none;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  color: rgba(255, 255, 255, 0.5);
  /* border: 12px solid rgba(32, 32, 32, 0.5); */
  opacity: 1.0;
}



/* BEGIN Tiptap Debuger */
.mini_edit_frame {
  display: block;
  position: relative;

  height: 100% !important;

  // border: 1px solid rgba(0, 255, 0, 0.75) !important; // Debuger
  box-sizing: border-box;
}

.mini_editor_outline {
  display: block;
  position: relative;

  height: 100% !important;

  border: 1px solid rgba(0, 255, 0, 0.75) !important; // Debuger
  box-sizing: border-box;
}


.abs_cmenu_outline {
  display: block;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.0);
  pointer-events: none !important;
}

.cmenu_container {
  display: block;
  position: relative;
  margin-left: v-bind("cmenu_pos_ref.left + 'px'");
  margin-top:  v-bind("cmenu_pos_ref.top  + 'px'");
  background-color: rgba(0, 0, 0, 0.0);
  pointer-events: none !important;
}


.app_msg {
  display:inline-block;
  margin-left: 4px;
  background-color: rgba(0, 0, 0, 1.0);
  color: gold;
}


.file_sel_row {
  display: grid;
  grid-template-columns: 1fr auto
}

.simple_btn {
  width:fit-content;
  height: 32px;
  font-size: 11px;
}

.file_sel_btn {
  margin-left: 4px;
  background-color: darkslategray;
  color: whitesmoke;
}


//= BEGIN All_In_One scss ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

html,
body {
    position: relative;
    height: 100%;
    margin: 0;
    padding: 0;
}

html:has(.no-relative),
body:has(.no-relative) {
    margin: 8px;
    padding: 8px;
    position: static;
    /* border: 8px solid red; */
}

html:has(.no-relative) {
    position: relative;
}

html:has(.margin),
body:has(.margin) {
    /* margin-top: 50px; */
}

.margin .root {
    position: static;
}

.description {
    padding: 10px;
}

.root {
    position: relative;
}

.container {
    position: relative;
    margin-top: 50px;
}

.will-change-container {
    padding-left: 100px;
    padding-top: 100px;
    will-change: transform;
}

.will-change-target {
    position: relative;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: #ee8;
    color: #333;
    font-weight: bold;
    border: 1px solid #333;
    box-sizing: border-box;
}

.target {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 150px;
    left: 100px;
    line-height: 100px;
    text-align: center;
    background: #ee8;
    color: #333;
    font-weight: bold;
    border: 1px solid #333;
    box-sizing: border-box;
}

.target1 {
    left: 120px;
    top: 120px;
}

.target2 {
    left: 300px;
    top: 140px;
}

.target3 {
    left: 180px;
    top: 250px;
}

.nested {
    position: absolute;
    border: 4px solid #ccc;
    width: 100px;
    height: 100px;
    top: 50px;
    left: 70px;
    color: #333;
    /* box-sizing: border-box; */
}

.nested.first {
    top: 150px;
}

.nested.rotate {
    transform-origin: 0 0;
    transform: rotate(-30deg);
}

.nested.scale {
    transform: scale(1.5, 1.5);
}

.nested .target {
    top: 50px;
    left: 50px
}


/* pos guidelines */
.moveable-normal.red {
    background: red !important;
}

/* gap guidelines */
.moveable-gap.red {
    background: red !important;
}

/* When snapped to an element in elementGuidelines */
.moveable-bold.red {
    background: red !important;
}

/* A dashed line between target and element */
.moveable-dashed.red {
    border-top-color: red !important;
    border-left-color: red !important;
}

/* pos guidelines */
.moveable-normal.green {
    background: green !important;
}

/* gap guidelines */
.moveable-gap.green {
    background: green !important;
}

/* When snapped to an element in elementGuidelines */
.moveable-bold.green {
    background: green !important;
}

/* A dashed line between target and element */
.moveable-dashed.green {
    border-top-color: green !important;
    border-left-color: green !important;
}

.scrollArea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh - 100px);
    overflow: auto;
}

.scrollArea:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 300%;
    width: 100%;
    background: linear-gradient(#333,
            #fff);
}

.infinite-viewer {
    height: 500px;
}

.control-padding .moveable-around-control {
    background: #f55 !important;
}


.cube {
    display: inline-block;
    border-radius: 5px;
    width: 40px;
    height: 40px;
    margin: 4px;
    background: #eee;
    --color: #4af;
    color: #333;
    line-height: 40px;
    text-align: center;
}

.cube .cube {
    background: #ddd;
    margin-left: 20px;
}


//= END   All_In_One scss ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


</style>