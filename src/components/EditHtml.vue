<template>
  <div 
    ref = "galaxy_ref" 
    class = "galaxy client_decided able_galaxy"
    title = "EditHtml galaxy: div, Position, Size の基準（当 Html Frame の 辺界線）" 
  >
      <div v-if = "isDevModeRef" class = "who_am_i who_am_i_layout able" title = "who am i">{{ props.com_type }} : {{ uuidRef.value }} </div>
<!-- 
      <v-btn v-if = "false" color = "primary" title = "html-galaxy debuging button" >
          Click EditHtml galaxy!
      </v-btn>
 -->
    <!-- 
    （特に出力ファイルでは）本体をすっきりさせるため、Library 的なものはここに書く
    （子、孫の svg がありますから、それらのために用意しておく）
   -->
    <div display = "none">
      <svg display = "none">
        <desc>SVG DEFS-SYMBOL Library</desc>
      </svg>
    </div>

    <!-- 
    【HTML Frame】※用語の Frame は、Container と同じ意味です（以降も同様）。 
    【試】 BG Color/Color は、CSS で指定している 
  -->
    <div 
      ref = "earth_ref"
      class = "editor_canvas client_decided html_events "
      title = "EditHtml earth: div, canvas, to warp svg-root"
    >
<!-- 
      <v-btn v-if = "false" color = "primary" title = "html-earth debuging button" >
            Cliek EditHtml Earth!
      </v-btn>
 -->
      <svg ref = "moon_ref" class = "svg_events" :viewBox = "viewBoxStr">
        <title>moon: root svg of EditHtml, viewBox は、parent div の client 領域です</title>
        
        <g v-if="true" >
          <title> 【実要素】Group </title>

          <g>
            <title> 【children】EditHtml 要素は勿論、HTML Frame を含むことができます </title>

            <foreignObject v-if = "true" ref = "moon_fobj_ref" class = "svg_events"
              :x = "rootMinX"
              :y = "rootMinY"
              :width  = "rootWidth"
              :height = "rootHeight"
            >

              <body
                class="html_body client_decided"
                xmlns="http://www.w3.org/1999/xhtml"
                title="EditHtml html body"
              >

                <!-- 【HTML コンテナ】-->
                  <div 
                      class = "edit_html_container client_decided html_events" 
                      ref = "html_container_ref"
                      title = "EditHtml html-container"
                  >
                    <!-- 
                      TODO component :is = "props.tag_name" では、v-btn 表示が違う、他の不安要因がある
                            ⇒ 現行 Version は、v-btn 等は、v-if で表示する。
                      【廃止】:uuid = "`EditSvgRect. (2023.11.18 nodel familyIdRef へ移行)
                    -->
                    

                    <template v-if = "props.tag_type == 'svg'">
                      <template v-if = "props.tag_name == 'u-svg'">

                        <!--【廃止】 2023/11/02 
                            2023.11.20 以下: 
                            EditSvgSrc EditSvgRect EditSvgCircle EditSvgEllipse EditSvgPolyline EditSvgPolygon EditSvgLine EditSvgText EditSvgPath
                            EditSvgFitCurve EditSvgEmbed EditSecText EditCodeMirror 
                                :myPosSizeRef       = "props.myPosSizeRef"
                                :raResizingSize     = "props.raResizingSize"
                                :raResizingViewbox  = "props.raResizingViewbox"                          
                        -->
                        <template v-if = "props.content == 'src_code'">
                            <EditSvgSrc
                                v-model:familyIdRef  = "familyIdRef"
                                v-model:familyZIndexRef = "familyZIndexRef"
                                :parent_uuid        = "uuidRef"
                                :is_root            = "false"
                                :editing_uuid       = "props.editing_uuid"
                                :editing_id         = "props.editing_id"
                                :being_edit_id      = "props.being_edit_id"
                              
                                ref                 = "html_tag_ref"
                                v-model:able_pointed ="able_pointed"
                                v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                v-model:deletedRef  = "deletedRef"

                                v-model:able_target_ref  = "able_target_ref"
                                v-model:able_actmd_ref   = "able_actmd_ref"
                                v-model:able_macro_ref   = "able_macro_ref"
                            >
                            </EditSvgSrc>
                        </template>


                        <template v-if = "props.content == 'rect'">
                            <EditSvgRect 
                                v-model:familyIdRef  = "familyIdRef"
                                v-model:familyZIndexRef = "familyZIndexRef"
                                :parent_uuid        = "uuidRef"
                                :is_root            = "false"
                                :editing_uuid       = "props.editing_uuid"
                                :editing_id         = "props.editing_id"
                                :being_edit_id      = "props.being_edit_id"

                                ref                 = "html_tag_ref"
                                v-model:able_pointed ="able_pointed"
                                v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                v-model:deletedRef  = "deletedRef"

                                v-model:able_target_ref  = "able_target_ref"
                                v-model:able_actmd_ref   = "able_actmd_ref"
                                v-model:able_macro_ref   = "able_macro_ref"
                            >
                            </EditSvgRect>
                        </template>


                        <template v-if = "props.content == 'circle'">
                            <EditSvgCircle 
                                v-model:familyIdRef  = "familyIdRef"
                                v-model:familyZIndexRef = "familyZIndexRef"
                                :parent_uuid        = "uuidRef"
                                :is_root            = "false"
                                :editing_uuid       = "props.editing_uuid"
                                :editing_id         = "props.editing_id"
                                :being_edit_id      = "props.being_edit_id"

                                ref                 = "html_tag_ref"
                                v-model:able_pointed ="able_pointed"
                                v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                v-model:deletedRef  = "deletedRef"

                                v-model:able_target_ref  = "able_target_ref"
                                v-model:able_actmd_ref   = "able_actmd_ref"
                                v-model:able_macro_ref   = "able_macro_ref"
                            >
                            </EditSvgCircle>
                        </template>



                        <template v-if = "props.content == 'ellipse'">
                            <EditSvgEllipse 
                                v-model:familyIdRef  = "familyIdRef"
                                v-model:familyZIndexRef = "familyZIndexRef"
                                :parent_uuid        = "uuidRef"
                                :is_root            = "false"
                                :editing_uuid       = "props.editing_uuid"
                                :editing_id         = "props.editing_id"
                                :being_edit_id      = "props.being_edit_id"

                                ref                 = "html_tag_ref"
                                v-model:able_pointed ="able_pointed"
                                v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                v-model:deletedRef  = "deletedRef"

                                v-model:able_target_ref  = "able_target_ref"
                                v-model:able_actmd_ref   = "able_actmd_ref"
                                v-model:able_macro_ref   = "able_macro_ref"
                            >
                            </EditSvgEllipse>
                        </template>


                        <template v-if = "props.content == 'polyline'">
                            <EditSvgPolyline
                                v-model:familyIdRef  = "familyIdRef"
                                v-model:familyZIndexRef = "familyZIndexRef"
                                :parent_uuid        = "uuidRef"
                                :is_root            = "false"
                                :editing_uuid       = "props.editing_uuid"
                                :editing_id         = "props.editing_id"
                                :being_edit_id      = "props.being_edit_id"

                                ref                 = "html_tag_ref"
                                v-model:able_pointed ="able_pointed"
                                v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                v-model:deletedRef  = "deletedRef"

                                v-model:able_target_ref  = "able_target_ref"
                                v-model:able_actmd_ref   = "able_actmd_ref"
                                v-model:able_macro_ref   = "able_macro_ref"
                            >
                            </EditSvgPolyline>
                        </template>


                        <template v-if = "props.content == 'polygon'">
                            <EditSvgPolygon
                                v-model:familyIdRef  = "familyIdRef"
                                v-model:familyZIndexRef = "familyZIndexRef"
                                :parent_uuid        = "uuidRef"
                                :is_root            = "false"
                                :editing_uuid       = "props.editing_uuid"
                                :editing_id         = "props.editing_id"
                                :being_edit_id      = "props.being_edit_id"

                                ref                 = "html_tag_ref"
                                v-model:able_pointed ="able_pointed"
                                v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                v-model:deletedRef  = "deletedRef"

                                v-model:able_target_ref  = "able_target_ref"
                                v-model:able_actmd_ref   = "able_actmd_ref"
                                v-model:able_macro_ref   = "able_macro_ref"
                            >
                            </EditSvgPolygon>
                        </template>


                        <template v-if="props.content == 'line'">
                            <EditSvgLine 
                                v-model:familyIdRef  = "familyIdRef"
                                v-model:familyZIndexRef = "familyZIndexRef"
                                :parent_uuid        = "uuidRef"
                                :is_root            = "false"
                                :editing_uuid       = "props.editing_uuid"
                                :editing_id         = "props.editing_id"
                                :being_edit_id      = "props.being_edit_id"

                                ref                 = "html_tag_ref"
                                v-model:able_pointed ="able_pointed"
                                v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                v-model:deletedRef  = "deletedRef"

                                v-model:able_target_ref  = "able_target_ref"
                                v-model:able_actmd_ref   = "able_actmd_ref"
                                v-model:able_macro_ref   = "able_macro_ref"
                            >
                            </EditSvgLine>
                        </template>


                        <template v-if="props.content == 'text' || props.content == 'text_embed'">
                            <EditSvgText v-bind="attrs"
                                v-model:familyIdRef  = "familyIdRef"
                                v-model:familyZIndexRef = "familyZIndexRef"
                                :parent_uuid        = "uuidRef"
                                :is_root            = "false"
                                :editing_uuid       = "props.editing_uuid"
                                :editing_id         = "props.editing_id"
                                :being_edit_id      = "props.being_edit_id"
                                :content            = "props.content" 

                                ref                 = "html_tag_ref"
                                v-model:able_pointed ="able_pointed"
                                v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                v-model:deletedRef  = "deletedRef"

                                v-model:able_target_ref  = "able_target_ref"
                                v-model:able_actmd_ref   = "able_actmd_ref"
                                v-model:able_macro_ref   = "able_macro_ref"

                                v-model:editPlusReqRef   = "editPlusReqRef"
                            >
                            </EditSvgText>
                        </template>


                        <template v-if="props.content == 'path'">
                            <EditSvgPath 
                                v-model:familyIdRef  = "familyIdRef"
                                v-model:familyZIndexRef = "familyZIndexRef"
                                :parent_uuid        = "uuidRef"
                                :is_root            = "false"
                                :editing_uuid       = "props.editing_uuid"
                                :editing_id         = "props.editing_id"
                                :being_edit_id      = "props.being_edit_id"

                                ref                 = "html_tag_ref"
                                v-model:able_pointed ="able_pointed"
                                v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                v-model:deletedRef  = "deletedRef"

                                v-model:able_target_ref  = "able_target_ref"
                                v-model:able_actmd_ref   = "able_actmd_ref"
                                v-model:able_macro_ref   = "able_macro_ref"
                            >
                            </EditSvgPath>
                        </template>


                        <template v-if="props.content == 'fitcurve'">
                            <EditSvgFitCurve 
                                v-model:familyIdRef  = "familyIdRef"
                                v-model:familyZIndexRef = "familyZIndexRef"
                                :parent_uuid        = "uuidRef"
                                :is_root            = "false"
                                :editing_uuid       = "props.editing_uuid"
                                :editing_id         = "props.editing_id"
                                :being_edit_id      = "props.being_edit_id"

                                ref                 = "html_tag_ref"
                                v-model:able_pointed ="able_pointed"
                                v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                v-model:deletedRef  = "deletedRef"

                                v-model:able_target_ref  = "able_target_ref"
                                v-model:able_actmd_ref   = "able_actmd_ref"
                                v-model:able_macro_ref   = "able_macro_ref"
                            >
                            </EditSvgFitCurve>
                        </template>

                        <!-- EditSvgLoadImg: EditSvgEmbed に統合された -->

                        <!-- @uuid_changed = "childUuidChanged" 禁止 -->
                        <template v-if="props.content == 'embed'">
                            <EditSvgEmbed 
                                ref                 = "html_tag_ref"
                                v-model:familyIdRef  = "familyIdRef"
                                v-model:familyZIndexRef = "familyZIndexRef"
                                :parent_uuid        = "uuidRef"
                                :is_root            = "false"
                                :editing_uuid       = "props.editing_uuid"
                                :editing_id         = "props.editing_id"
                                :being_edit_id      = "props.being_edit_id"

                                v-model:able_pointed ="able_pointed"
                                v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                v-model:deletedRef  = "deletedRef"
                                
                                v-model:able_target_ref  = "able_target_ref"
                                v-model:able_actmd_ref   = "able_actmd_ref"
                                v-model:able_macro_ref   = "able_macro_ref"
                            >
                            </EditSvgEmbed>
                        </template>

                        <!-- EditSvgLoadPdf: EditSvgEmbed に統合された -->

                      </template>
                    </template>



                    <template v-if="props.tag_type == 'u_text'">
                      <template v-if="props.tag_name == 'u-text'">
                        <EditSecText 
                            ref                 = "html_tag_ref"
                            v-model:familyIdRef  = "familyIdRef"
                            v-model:familyZIndexRef = "familyZIndexRef"
                            :parent_uuid        = "uuidRef"
                            :is_root            = "false"
                            :editing_uuid       = "props.editing_uuid"
                            :editing_id         = "props.editing_id"
                            :being_edit_id      = "props.being_edit_id"

                            v-model:able_pointed ="able_pointed"
                            v-model:emitedPosSizeRef ="emitedPosSizeRef"
                            v-model:deletedRef  = "deletedRef"
                            @props_updated      = "childPropsUpdated"
                            @deleted            = "childBeDeleted"
                            @uuid_changed       = "childUuidChanged"

                            v-model:able_target_ref  = "able_target_ref"
                            v-model:able_actmd_ref   = "able_actmd_ref"
                            v-model:able_macro_ref   = "able_macro_ref"
                        >
                        </EditSecText>
                      </template>
                    </template>


                    <!-- TipTap node-view z-code/code_mirror -->
                    <!-- 【追加】2023.11.20 以下: 
                          :parent_uuid        = "uuidRef"
                          v-model:deletedRef  = "deletedRef"  ※使わないはずだが、↑ と同一にするため
                    -->
                    <template v-if="props.tag_type == 'code_mirror'">
                      <EditCodeMirror 
                          v-model:familyIdRef  = "familyIdRef"
                          :parent_uuid        = "uuidRef"
                          :is_root            = "false"
                          :editing_uuid       = "props.editing_uuid"
                          :editing_id         = "props.editing_id"
                          :being_edit_id      = "props.being_edit_id"

                          ref                 = "html_tag_ref"
                          v-model:able_pointed ="able_pointed"
                          v-model:emitedPosSizeRef ="emitedPosSizeRef"
                          v-model:deletedRef  = "deletedRef"
                          
                          v-model:able_target_ref  = "able_target_ref"
                          v-model:able_actmd_ref   = "able_actmd_ref"
                          v-model:able_macro_ref   = "able_macro_ref"
                      >
                      </EditCodeMirror>
                    </template>


                    <!-- TipTap node-view z-diag/mermaid -->
                    <!-- 
    
                    -->
                    <template v-if="props.tag_type == 'mermaid'">
                      <EditMermaid 

                          v-model:familyIdRef  = "familyIdRef"
                          :parent_uuid        = "uuidRef"
                          :is_root            = "false"
                          :editing_uuid       = "props.editing_uuid"
                          :editing_id         = "props.editing_id"
                          :being_edit_id      = "props.being_edit_id"
                          
                          ref                 = "html_tag_ref"
                          v-model:able_pointed ="able_pointed"
                          v-model:emitedPosSizeRef ="emitedPosSizeRef"
                          v-model:deletedRef  = "deletedRef"

                          v-model:able_target_ref  = "able_target_ref"
                          v-model:able_actmd_ref   = "able_actmd_ref"
                          v-model:able_macro_ref   = "able_macro_ref"
                      >
                      </EditMermaid>
                    </template>                    


                    <!-- TipTap node-view z-math/mathlive -->
                    <!-- 
    
                    -->
                    <template v-if="props.tag_type == 'mathlive'">
                      <EditMathlive 

                          v-model:familyIdRef  = "familyIdRef"
                          :parent_uuid        = "uuidRef"
                          :is_root            = "false"
                          :editing_uuid       = "props.editing_uuid"
                          :editing_id         = "props.editing_id"
                          :being_edit_id      = "props.being_edit_id"

                          ref                 = "html_tag_ref"
                          v-model:able_pointed ="able_pointed"
                          v-model:emitedPosSizeRef ="emitedPosSizeRef"
                          v-model:deletedRef  = "deletedRef"
                          
                          v-model:able_target_ref  = "able_target_ref"
                          v-model:able_actmd_ref   = "able_actmd_ref"
                          v-model:able_macro_ref   = "able_macro_ref"
                      >
                      </EditMathlive>
                    </template>                    


                    <template v-if="props.tag_type == 'raw_html'">
                      <template v-if="props.tag_name == 'div'">
                        <div
                          ref = "html_tag_ref"
                          class = "client_decided html_events"
                          color = "primary"
                          :title = "'EditHtml contents 之 実体 html-tag: ' + props.tag_name + ' typs is ' + props.tag_type"
                        >
                          <slot name = "rawLayoutCnts"></slot> 
                        </div>
                      </template>

                      <template v-else-if = "props.tag_name == 'span'">
                        <span
                          ref = "html_tag_ref"
                          class = "client_decided html_events"
                          color = "primary"
                          :title = "'EditHtml contents 之 実体 html-tag: ' + props.tag_name + ' typs is ' + props.tag_type"
                        >
                          <slot name = "rawLayoutCnts"></slot> 
                        </span>
                      </template>

                      <template v-else>
                        <body
                          ref = "html_tag_ref"
                          class = "client_decided html_events"
                          color = "primary"
                          :title = "'EditHtml contents 之 実体 html-tag: ' + props.tag_name + ' typs is ' + props.tag_type"
                        >
                          <slot name = "rawLayoutCnts"></slot>
                        </body>

                      </template>
                    </template>



                    <template v-if="props.tag_type=='html_singleton'">
                      <component :is = "props.tag_name" >
                      </component>
                    </template>



                    <template v-if="props.tag_type == 'html_paired'"> 

                      <!-- 
                        TODO  -   color = "primary" <= v-btn 表示サンプル 
                              +   class = "client_decided html_events"
                      -->
                      <v-btn v-if = "props.tag_name == 'v-btn'"
                        ref = "html_tag_ref"
                        class = "html_events"
                        color = "primary"
                        :title = "'EditHtml contents 之 実体 html-tag: ' + props.tag_name + ' type is ' + props.tag_type"
                      >
                        <slot name = "pairedLayoutCnts"></slot> 
                      </v-btn>

                      <div v-else-if = "props.tag_name == 'div'"
                        ref = "html_tag_ref"
                        class = "client_decided html_events"
                        color = "primary"
                        :title = "'EditHtml contents 之 実体 html-tag: ' + props.tag_name + ' typs is ' + props.tag_type"
                      >
                        <slot name = "pairedLayoutCnts"></slot> 
                      </div>
                    
                      <template v-else-if = "props.tag_name == 'u-paired'">
                        <template v-if="!deletedRef">
                          <EditHtmNodeTree 
                              ref                 = "html_tag_ref"
                              v-model:familyIdRef  = "familyIdRef"
                              v-model:familyZIndexRef = "familyZIndexRef"
                              :parent_uuid        = "uuidRef"
                              :is_root            = "false"
                              :editing_uuid       = "props.editing_uuid"
                              :editing_id         = "props.editing_id"
                              :being_edit_id      = "props.being_edit_id"

                              v-model:able_pointed ="able_pointed"
                              v-model:emitedPosSizeRef ="emitedPosSizeRef"
                              v-model:deletedRef  = "deletedRef"

                              v-model:able_target_ref  = "able_target_ref"
                              v-model:able_actmd_ref   = "able_actmd_ref"
                              v-model:able_macro_ref   = "able_macro_ref"
                          >
                            <slot name = "pairedLayoutCnts"></slot> 
                          </EditHtmNodeTree>
                        </template>
                      </template>

                      <!-- TODO uuid -->
                      <EditHtmlFrame v-else-if = "props.tag_name == 'u-html'"
                        ref                 = "html_tag_ref"
                        :uuid               = "other_uuid"
                        :is_root            = "false"
                        :parent_uuid        = "(uuidRef as string)" 
                        :editing_uuid       = "props.editing_uuid"
                        :editing_id         = "props.editing_id"
                        :being_edit_id      = "props.being_edit_id"

                        v-model:deletedRef  = "deletedRef"

                        v-model:able_target_ref  = "able_target_ref"
                        v-model:able_actmd_ref   = "able_actmd_ref"
                        v-model:able_macro_ref   = "able_macro_ref"
                      >
                      </EditHtmlFrame>

                      <EditLayout v-else-if = "props.tag_name == 'u-layout'"
                        ref                 = "html_tag_ref"
                        v-model:familyIdRef  = "familyIdRef"
                        v-model:familyZIndexRef = "familyZIndexRef"
                        :parent_uuid        = "uuidRef"
                        :is_root            = "false"
                        :editing_uuid       = "props.editing_uuid"
                        :editing_id         = "props.editing_id"
                        :being_edit_id      = "props.being_edit_id"

                        v-model:deletedRef  = "deletedRef"

                        v-model:able_target_ref  = "able_target_ref"
                        v-model:able_actmd_ref   = "able_actmd_ref"
                        v-model:able_macro_ref   = "able_macro_ref"
                      >
                      </EditLayout>

                      <component v-else  v-bind:is = "props.tag_name"
                        ref = "html_tag_ref"
                        class = "client_decided html_events"
                        color = "primary"
                        :title = "'EditHtml contents 之 実体 html-tag: ' + props.tag_name + ' typs is ' + props.tag_type + ' content: ' + props.content "
                      >
                        <slot name = "pairedLayoutCnts"></slot>
                      </component>

                    </template> <!-- END html_paired -->


                </div>
              </body>
              <!-- END html_frame_tag -->
              
            </foreignObject>

            <!-- EditHtml.vue Flag -->
            <rect v-if = "isDevModeRef" class = "mini_ctrl_svg" :x = "0" :y = "0" :width = "c.w >= 12 ? c.w - 12 : 0" :height = "c.h >= 12 ? c.h - 12 : 0" style = "fill:rgba(128,64,0,0);stroke-width:1;stroke:rgba(0,255,0,0.25)" >
                <title> EditHtml svg debuger: moon_ref の位置、サイズが正しく設定されなければ、これが表示されない </title>
            </rect>

          </g>
          <!-- END 実 HTML 要素 -->


         <!-- ↓↓ EditHtml.EditSecText の コンテンツ編集モードに示す赤線 -->
         <g v-show = "being_edit" class="mini_ctrl_svg">
             <rect class="mini_ctrl_border" :x = "0" :y = "0" :width = "c.w" :height = "c.h"
                    style = "fill:rgba(121,121,121,0.0);stroke-width:1;stroke:rgba(255,0,0,1.0)"
             >
             </rect>
         </g>

        </g>
        <!-- translate x,y -->
      </svg>
      <!-- svg_root -->

    </div>
    <!-- editor_canvas -->
    <!-- editor_canvas: transform scale -->
  </div>
</template>



<script setup lang="ts">


import {
  effectScope, getCurrentScope, onScopeDispose, markRaw, toRaw, reactive, shallowReactive, shallowReadonly, isReactive, computed, shallowRef, triggerRef, customRef, ref, unref, toRef, toRefs, isRef,
  // defineProps, defineEmits, defineExpose, defineSlots,
  h, inject, hasInjectionContext, mergeProps, cloneVNode, isVNode, resolveComponent, resolveDirective, withDirectives, withModifiers, watch, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeUnmount, onUnmounted, onErrorCaptured, onRenderTracked, onRenderTriggered, nextTick, useSlots, useAttrs
} from "vue";


import {
  whenever, useMouse, useMousePressed, useElementSize, useElementBounding, useResizeObserver, useMounted, onKeyStroke, useFocus, useFocusWithin
} from '@vueuse/core'



import { vElementSize } from "@vueuse/components"; // v-element-size
import { UseElementBounding as ElementBounding } from "@vueuse/components"
import { UseDraggable as Draggable } from '@vueuse/components'

import { v4 as uuidv4 } from "uuid"; // このuuid の代り、独自のルールで共通的作成する

import _ from 'lodash'

import { mainMachine } from "./mainFsmMachine";
import EditHtmlFrame from "./EditHtmlFrame.vue";
import EditLayout from "./EditLayout.vue";

import EditSvgSrc from "./EditSvgSrc.vue";
import EditSvgRect from "./EditSvgRect.vue";

import EditSvgCircle from "./EditSvgCircle.vue";
import EditSvgEllipse from "./EditSvgEllipse.vue";
import EditSvgPolyline from "./EditSvgPolyline.vue";
import EditSvgPolygon from "./EditSvgPolygon.vue";

import EditSvgLine from "./EditSvgLine.vue";
import EditSvgText from "./EditSvgText.vue";
import EditSvgPath from "./EditSvgPath.vue";
import EditSvgFitCurve from "./EditSvgFitCurve.vue";
import EditSvgEmbed from "./EditSvgEmbed.vue"
import EditSecText from "./EditSecText.vue"
import EditHtmNodeTree from "./EditHtmNodeTree.vue"


import EditCodeMirror from "./EditCodeMirror.vue"
import EditMermaid from "./EditMermaid.vue"
import EditMathlive from "./EditMathlive.vue"


// eslint-disable-next-line @typescript-eslint/no-unused-vars


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isDevModeRef = inject("isDevModeRef");

// 2022.11.01 版： 子コンポーネントの add-edit-svg 呼び出すの代り、cmd をセットし、actived obj が自ら
// その cmd を実行するようにする。
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editCmdRef = inject("editCmdRef");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateEditCmd = inject("updateEditCmd"); // function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editCmdParasRef = inject("editCmdParasRef"); // object
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialEditCmdParas = inject("initialEditCmdParas"); // function

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editingObjRef = inject("editingObjRef"); //  isEditFocus 系から移行させる
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateEditingObj = inject("updateEditingObj"); // function

const outline_assets_ref: any = inject("outline_assets_ref");

const appCfgRef: any = inject("appCfgRef");

const genInId = inject('genInId');
const genInDataA = inject('genInDataA');
const genInHintS = inject('genInHintS');
const genInHintA = inject('genInHintA');

const genInDataB = inject('genInDataB');
const genInDataC = inject('genInDataC');
const inDataC_ref = inject('inDataC_ref');
const updateGenInDataA = inject('updateGenInDataA');
const updateGenInDataB = inject('updateGenInDataB');
const updateGenInDataC = inject('updateGenInDataC');


const galaxy_ref = ref(null);   //
const earth_ref = ref(null);    //
const moon_ref = ref(null);     //




defineOptions({
  inheritAttrs: true, // 2023.12.26a
  customOptions: {
    /* ... */
  }
});

defineSlots<{
  rawLayoutCnts?: () => Node[]
  pairedLayoutCnts?: () => Node[]

  //= example
  // slot name
  title: {
    // scoped slot
    foo: 'bar' | boolean
  }

}>()


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({ // I/F: 親⇒子のデータの受け渡し
  com_type: {
    // edit_svg | edit_html | ..
    type: String,
    default: "edit_html",
  },

  // uuid: {                     // 【廃止】2023.11.18 nodel familyIdRef へ移行; このコンポーネントの uuid, Save, Load Etc
  //   type: String,
  //   default: uuidv4(),
  // },

  editing_uuid: {             // Able を含む上流の editor | elem の uuid
    type: String,
    required: true,
  },
  editing_id: {               // is_editing := [ uuid, editing_id    ] MATCHING, Moaveable 動作中
    type: String,
    required: true,           //    親の editing_id と同一を保つことで、親の is_editing を追跡する
  },
  being_edit_id: {            // being_edit := [ uuid, being_edit_id ] MATCHING, コンテンツ操作中
    type: String,
    required: true,           //    親の being_edit_id と同一を保つことで、親の being_edit を追跡する
  },

  //= BEGIN 【廃止】 2023/11/02 ※ 当 component 以降に使われない想定
  // myPosSizeRef: {             // EditHtmlFrame.vue と互換性を保つため（子 EditHtmlFrame.vue へ渡す必要がある）
  //   type: Object,
  //   required: false,          //  【廃止】 2023/11/02
  // },
  // raResizingSize: {           // EditHtmlFrame.vue と互換性を保つため（子 EditHtmlFrame.vue へ渡す必要がある）
  //   type: Object,
  //   required: false,          //  【廃止】 2023/11/02
  // },
  // raResizingViewbox: {        // EditHtmlFrame.vue と互換性を保つため（子 EditHtmlFrame.vue へ渡す必要がある）
  //   type: String,
  //   required: false,          //  【廃止】 2023/11/02
  // },
  //= END 【廃止】 2023/11/02

  is_root: {
    type: Boolean,
    default: false,
  },

  able: { // true | false
    type: Boolean,
    default: false,
  },

  tag_name: {                 // u-svg
    // div | span | ..
    type: String,
    default: "div", // v-btn | ..
  },

  tag_type: {                // svg
    // html_singleton | html_paired | raw_html | null
    type: String,
    default: "html_paired",
  },

  content: {                // rect | line | path | text
    type: String,
    default: "",
  },

});

console.log("$$$$$$$$ EditHtml props: " + JSON.stringify(props, null, 2));

const attrs = useAttrs(); // 2023.12.25c
console.log("@@@@@@@@ attrs: " + JSON.stringify(attrs, null, 2));

const show_toolbar_ref = ref(false);  // show | hide 2023.12.25b

const editPlusReqRef = defineModel<any>("editPlusReqRef", { local: true, default: null });  // 2023.12.25c

const familyZIndexRef = defineModel<any>("familyZIndexRef", { local: true, default: null });  // 2023.12.18a Family EdiyHtmlElem の z-index on EditHtmlFrame

//=  2023.11.18 familyIdRef
const familyIdRef = defineModel<any>("familyIdRef", { local: true, default: null });
const uuidRef = computed(() => { return `${familyIdRef.value}`; });  // 旧 uuid の代り
// console.log("######## uuidRef value: " + uuidRef.value);      // EditHtml.1c9a6d01-f818～

watch(familyIdRef, (v) => {
  if (v) {
    console.log(`familyIdRef changed to ${familyIdRef.value}`);
    console.log(`    uuidRef.value: ${uuidRef.value}`);
  }
})



const moon_fobj_ref = ref(null); // moon の foreignObject の ref
const html_container_ref = ref(null); // html_container の ref

const html_tag_ref = ref(null); // html_tag の ref

//= OTHER := 子 EditHtmlFrame.vue
const other_uuid    = ref(uuidv4());       // is EditSecText | _ の uuid

const mini_ctrl_ref = ref(null);

const able_pointed = defineModel<boolean>("able_pointed", { local: true, default: true })		// name able_pointed 使用, parent: v-model:able_pointed="able_pointed"


// BEGIN emitedPosSizeRef へ移行中 ..........................................
let myBoundingElRef = null;
let tag_width  = 32;  // onMounted に更新されている WHEN u-html etc.
let tag_height = 24;  // 
if ([ 'u-html' ].includes(props.tag_name)) {
  // Vue Component の場合, useElementBounding は使えない、html_tag_ref.value.galaxy_ref を使う必要がある。
  // が、この時点では、html_tag_ref.value.galaxy_ref は null であり、使えない。
  //   ⇒ 後で、onMounted に 改めて設定する。
  myBoundingElRef = null;             // html_tag_ref.value.galaxy_ref
} else {
  myBoundingElRef = html_tag_ref;     // Default, WHEN is a html tag
  const { width: ta_width, height: ta_height } = useElementBounding(myBoundingElRef);
  tag_width  = ta_width;
  tag_height = ta_height;
}

const ractag = reactive({
  x: 0, y: 0,           // !!
  w: tag_width,         // tag_width, tag_height は、onMounted に更新されている WHEN u-html etc.
  h: tag_height,
});


// nextTick(() => {
//   watch(ractag, (val, oldval) => {
//     console.log('$$$$$EditHtml uuid " + uuidRef.value + " ractag changed: val = ' + JSON.stringify(val) + ' oldval = ' + JSON.stringify(oldval));

//     //= 概ね同値でも親コンポーネントには通知する必要があり、↓ skip はできない
//     // if ( Math.round(oldval.x) == Math.round(val.x) && Math.round(oldval.y) == Math.round(val.y) && Math.round(oldval.w) == Math.round(val.w) && Math.round(oldval.h) == Math.round(val.h)) {
//     //   console.log('  but 概ね同値, so  return');
//     //   return;
//     // }

//     let ps = { x: val.x, y: val.y, w: val.w, h: val.h, edit_html: { uuid: uuidRef.value, tag_type: props.tag_type, tag_name: props.tag_name } };
//     nextTick(() => {
//       console.log('  emit pos_size_decided in nextTick')
//       emit('pos_size_decided', ps);
//     });
//   });
// });

// END emitedPosSizeRef へ移行中 ..........................................


const me_ref = ref(null); // The Layout の ref

const items = ref([]); 
const childRefs = ref([]); // 子コンポーネントの ref, childRefs.value[i] でアクセスし子コンポーネントを制御します。

const setChildRef = (el) => {
  if (el) {
    // console.log('setChildRef push: ' + el.myUuid());
    childRefs.value.push(el);
  }
};


const { x: galaxy_x, y: galaxy_y, top: alaxy_top, right: galaxy_right, bottom: galaxy_bottom, left: galaxy_left, width: galaxy_width, height: galaxy_height } = useElementBounding(galaxy_ref)
const g = reactive({    // 旧 inject('gViewBox')
  x: 0, y: 0,         // parant element の座標系に対する、自分の座標
  w: galaxy_width,
  h: galaxy_height
});

const c = g;  // props.able ? resiz : g;

const viewBoxStr  = computed(() => { return c.x + ' ' + c.y + ' ' + c.w + ' ' + c.h; });  // view-Box
const rootMinX    = computed(() => { return c.x + 'px'; });          // foreignObject
const rootMinY    = computed(() => { return c.y + 'px'; });          // foreignObject
const rootWidth   = computed(() => { return c.w + 'px'; });          // foreignObject, View-Port
const rootHeight  = computed(() => { return c.h + 'px'; });          // foreignObject, View-Port

//= 【廃止】Global 的座標系に移行したため、不要になった; TODO editor_canvas 移動操作 by mouse | key | tool
// const editor_canvas_pos = ref({ x: 32, y: 24 });
// const editor_canvas_style = computed(() => { return ("position: absolute; left: " + editor_canvas_pos.value.x + "px; top: " + editor_canvas_pos.value.y + "px;") });

// const zoomScale = ref(1.0); // SLIDER
// const transformText = computed(() => { return "scale(" + zoomScale.value + " " + zoomScale.value + ")"; });

watch(c, (val, oldVal) => { // SvgEditor resizing_frame サイズが反映されたと確認出来た 2023/06/14
  console.log("$$$$EditHtml uuid " + uuidRef.value + " galaxy c changed: " + val.w + " - " + + val.h + " oldVal: " + oldVal.w + " - " + + oldVal.h);
});

//= macros
// https://vue-macros.sxzz.moe/macros/

const emitedPosSizeRef = defineModel<any>("emitedPosSizeRef", { local: true, default: null });  // 位置とサイズが確定した, 旧 emit pos_size_decided
const deletedRef = defineModel<any>("deletedRef", { local: true, default: null })

const able_target_ref = defineModel<any>("able_target_ref", { local: true, default: null });    // the Moveable Target
const able_actmd_ref = defineModel<any>("able_actmd_ref", { local: true, default: null });      // 動作モード of the Moveable
const able_macro_ref = defineModel<any>("able_macro_ref", { local: true, default: null });      // in_ | out_ | io_, データ I/F of the Moveable

//= 【DEPRECATED】自分がアクティブかどうか
//    is_editing へ移行
// const isEditFocus = computed(() => {
//   return editingObjRef.value.uuid == uuidRef.value;
// });

const is_editing = computed(() => {
  return (editingObjRef.value.uuid === props.editing_uuid && editingObjRef.value.editing_id === props.editing_id);
})

const being_edit = computed(() => {
  return (editingObjRef.value.uuid === props.editing_uuid && editingObjRef.value.editing_id === props.being_edit_id);
})


watch(is_editing,
  (newVal, oldVal) => {
    console.log("@@@@@@@@ watch is_editing: " + newVal + " oldVal: " + oldVal);
  },
  {
    deep: true,
    // immediate: true
  }
);


watch(
  being_edit,
  (newVal, oldVal) => {
    console.log("@@@@@@@@ watch being_edit: " + newVal + " oldVal: " + oldVal);
    // console.log("  being_edit is " + being_edit.value);
    // console.log("  editingObjRef.value.uuid: " + editingObjRef.value.uuid);
    // console.log("  props.editing_uuid: " + props.editing_uuid);
    // console.log("  editingObjRef.value.editing_id: " + editingObjRef.value.editing_id);
    // console.log("  props.being_edit_id: " + props.being_edit_id);

    // if (newVal) {
    // } else if (oldVal) {
    // }
  },
  {
    deep: true,
    // immediate: true
  }
);




const emit = defineEmits([
  "props_updated",    // props が更新された
  "deleted",          // 子コンポーネントが削除されたときに親コンポーネントに通知するためのイベントです
]);


// onKeyStroke('|', (e) => {
//   e.preventDefault();
//   console.log("##### is_editing = " + is_editing.value + ", being_edit = " + being_edit.value);
// })




// //=== BEGIN バブリング (Bubbling) Mouse Event chain 調査
// const Layers = [];
// //= ここから branch master
// Layers.push({ 'name': 'galaxy', 'ref': galaxy_ref, 'pressed': null });
// Layers.push({ 'name': 'earth', 'ref': earth_ref, 'pressed': null });
// Layers.push({ 'name': 'moon svg', 'ref': moon_ref, 'pressed': null });

// //= ここから branch contents
// Layers.push({ 'name': 'moon-foreignObject', 'ref': moon_fobj_ref, 'pressed': null });
// Layers.push({ 'name': 'html_container', 'ref': html_container_ref, 'pressed': null });
// Layers.push({ 'name': 'me-elem-container', 'ref': me_ref, 'pressed': null });   // TODO 発火しない ⇒ EditHtmlElem 解析中
// //    contents EditHtmlFrame[] 確認待ち



// for (let i = 0; i < Layers.length; i++) {
//   const { pressed } = useMousePressed({ target: Layers[i].ref });
//   Layers[i].pressed = pressed;
//   whenever(Layers[i].pressed, () => {
//     console.log(";;;; ↑ " + Layers[i].name + " pressed: ", props.com_type + " " + uuidRef.value);
//   });
// }
// //=== END バブリング (Bubbling) Mouse Event chain 調査


// "translate(x, y)"
const transMeToXY = computed(() => {
  return (
    "translate(" + (props.x - props.parent_x) + " " + (props.y - props.parent_y) + ")"
  );
});


const ctrlBoundUpdated = (dc) => {
  // console.log("boundUpdated: ", props.com_type + " " + uuidRef.value + " ", dc);
  if (dc.name === "dx") {
    emit("props_updated", uuidRef.value, { name: "dx", value: dc.value });
  } else if (dc.name === "dy") {
    emit("props_updated", uuidRef.value, { name: "dy", value: dc.value });
  } else if (dc.name === "dw") {
    htmlMeta.value.w =
      htmlMeta.value.w + dc.value >= 0 ? htmlMeta.value.w + dc.value : 0;
  } else if (dc.name === "dh") {
    htmlMeta.value.h =
      htmlMeta.value.h + dc.value >= 0 ? htmlMeta.value.h + dc.value : 0;
  }
};


function childBeDeleted(uuid) {
  // 子コンポーネントが削除されたときに呼ばれる関数です
  console.log(props.com_type + " " + uuidRef.value + " childBeDeleted " + uuid);
}


function childPropsUpdated(uuid, dc) {
  // 子コンポーネントのプロパティが更新されたときに呼び出されます。
  console.log(
    props.com_type + " " + uuidRef.value + " received childPropsUpdated " + uuid + " dc: ", dc);
}


function childUuidChanged(newValue, oldValue) { // 初期 Empty EditHtmlFrame ⇒ Listup ⇒ Selected
  console.log(props.com_type + ' ' + uuidRef.value + ' childUuidChanged ' + newValue + ' <= ' + oldValue);

  //= 【2023-10-12】EditHtml.vue では、子 EditSvgEmbed 等 uuid は変更出来ない（固定 elem -> html -> 子 dot 仕様なので）、↓動作禁止
  // other_uuid.value = newValue;
}


// const { focused } = useFocus(inDataC_ref)   // TODO 動作しない
// watch(focused, focused => {
//   if (focused) { 
//     console.log('input element has been focused')
//   } else {
//     console.log('input element has lost focus')
//   }
// })


// onKeyStroke(true, (e) => {  // TODO 動作しない時がある
//   console.log('#### onKeyStroke: ', e.key);
//   updateGenInDataC(undefined, "ENTERキーで確定");
// }, { target: inDataC_ref })



function ctrlBeDeleted() {
  console.log(props.com_type + " " + uuidRef.value + " Delete");
  emit("deleted", uuidRef.value);
}


const build_meta = (
  dom_name, dom_ref, develop, product, title,
  containerRequired = true,
  border = `border: solid 1px rgba(0, 0, 0, 1.0); box-sizing: border-box;`,
  background = `rgba(255, 255, 255, 0.0)`,
) => {
  //=  meta, Raw Content := meta + raw[]

  console.log(`$$$$ ~~~~~~~~~~~~ build_meta ${dom_name}`);
  let meta = {};

  meta['com_type'] = props.com_type;        // component-type
  meta['uuid'] = uuidRef.value;                // component-id
  meta['dom_name'] = dom_name;              // !! component.dom
  meta['kind'] = 'myjson';
  meta['version'] = '0.0.1';
  meta['istext'] = false;

  if (containerRequired) {
    let dom = dom_ref;
    meta['container'] = {
      x: dom.value.offsetLeft,      // 36
      y: dom.value.offsetTop,       // 104
      w: dom.value.offsetWidth,     // 
      h: dom.value.offsetHeight,    // 
      should_draw: {                // draw ↓
        develop: develop,
        product: product,
      },
      border: border,
      background: background,       // background-color
      title: title,                 // default ""
    };

    if (("style" in dom.value) && ("transform" in dom.value.style)) {   // object.style.transform := MoveAble, e.g `transform: scale(2, 0.5);`
      meta['container']['transform'] = dom.value.style.transform;
    } else {
      meta['container']['transform'] = "";  // !!
    }
  }

  return meta;
}


const makeRawContentJson = async (rootContainerRequired) => {
  console.log("makeRawContentJson");
  let outlineAlpha = outline_assets_ref.value ? 1.0 : 0.0;

  //= EditHtml earth_ref を child として作る
  let view = build_meta(
    'resizing_container',
    earth_ref,
    true,
    true,
    'EditHtml earth: div, canvas, to warp svg-root',
    true,
    `border: solid 1px rgba(255, 0, 255, ${outlineAlpha}); box-sizing: border-box;`
  );
  let view_raw = [];
  view['raw'] = view_raw;

  //= 子 EditHtml のコンテンツを収集する
  const html = await html_tag_ref.value.makeRawContentJson(rootContainerRequired);
  view_raw.push(html);

  return view;
}


const saveDbContent = (mod_uuid, self_only = false) => {
  if (!html_tag_ref.value.hasOwnProperty('saveDbContent')) {
    //= 2023.11.20 EditMathive.vue, EditMemaid.vue EditCodeMirror.vue は saveDbContent loadDbContent 非対応
    console.log(`saveDbContent: html_tag_ref.value has no Property saveDbContent, do nothing.`);    
    return;
  }

  html_tag_ref.value.saveDbContent(mod_uuid, self_only);
}

const loadDbContent = (self_only = false, recordUuid = "", useRecordUuid = false) => {   // 2024.01.01c on btnLoad DB
  //=
  //  useRecordUuid: ※ 2024.01.01c 現時点で、true で呼び出す必要な時がない（↓コメント参考）
  //    1) true  ⇒ recordUuid は uuidRef.value にする　※ recordUuid が "" の時は、uuidRef.valueで DB Load するので、実際に uuidRef.value は変更しない
  //    2) false ⇒ 別 recordUuid のデータだけ取得し、uuidRef.value は変更しない ※ Memory 機能で使用している、この時、読み込んだデータの uuid を廃棄する必要がある
  //=

  if (!html_tag_ref.value.hasOwnProperty('loadDbContent')) {
    //= 2023.11.20 EditMathive.vue, EditMemaid.vue EditCodeMirror.vue は saveDbContent loadDbContent 非対応
    console.log(`saveDbContent: html_tag_ref.value has no Property loadDbContent, do nothing.`);
    return;
  }

  html_tag_ref.value.loadDbContent(self_only, useRecordUuid, false);
}


defineExpose({
  makeRawContentJson,
  saveDbContent,
  loadDbContent,
})




onBeforeMount(() => {   // after template be compiled
  console.log(props.com_type + "::" + uuidRef.value + " BeforeMount!");
})

onMounted(async () => { // after DOM nodes be inserted
  await nextTick();   
  console.log("}}}} " +  props.com_type + "::" + uuidRef.value + " is_toot = " + props.is_root + ", able = " + props.able + ", tag_name = " + props.tag_name + ", tag_type = " + props.tag_type  + ", is mounted!");

  if (['u-html'].includes(props.tag_name)) {
    myBoundingElRef = html_tag_ref.value.galaxy_ref;
    const { width: ta_width, height: ta_height } = useElementBounding(myBoundingElRef);
    tag_width  = ta_width;
    tag_height = ta_height;
  }

  // document.addEventListener("keydown", onKeyDown);

  //= TODO is_editing 版: 追加された直後、自分をアクティブにする
  // if (!isEditFocus.value) {
  //   // 自分がアクティブでないなら、
  //   updateEditingObj({ uuid: uuidRef.value, com_type: props.com_type }); // 自分をアクティブにする
  //   // mainMachine.send({ type : 'SW_TO_EDITING_HTML' });
  // }

  // 疑似的にクリックイベントを発生させる
  // initialEditCmdParas(
  //   props.com_type,
  //   uuidRef.value,
  //   "onMounted",
  //   props.x, // parent_x
  //   props.y, // parent_y
  //   0,  // x
  //   0   // y
  // )

});


onBeforeUnmount(() => {   // before unmountafter unmounted? Vue 2.x beforeDestroy
  console.log(props.com_type + ' ' + uuidRef.value + ' is unmounted!');
})

onUnmounted(() => {       // after unmounted
  // Vue 3.x unmounted
  console.log(props.com_type + " " + uuidRef.value + " be unmounted!");
});


// onBeforeUpdate(() => {  // 2023.12.13b TODO ↓必要か調査 取りあえず、コメントアウトした
//   //=
//   //  このフックの内部でコンポーネントの状態を変更することも安全です。
//   //=
//   console.log(props.com_type + "::" + uuidRef.value + " BeforeUpdate!");
//   // childRefs.value = []; // 画面に更新処理が走る度に、テンプレート参照を格納した配列に参照がpushされてしまいます。そのため、更新前に配列を初期化する必要があります。
// });


// onUpdated(() => {     // after re-renter and patch
//   //=
//   //  親コンポーネントの更新フックは、子コンポーネントの更新フックの後に呼び出されます。
//   //  WARNING 更新フックでコンポーネントの状態を変更しないでください - 無限更新ループになる可能性があります！
//   //=
//   console.log(props.com_type + "::" + uuidRef.value + " Updated!");
// })



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
    console.log(props.com_type + "::" + uuidRef.value + " onRenderTracked: " + JSON.stringify(info));
  } catch (e) {
    console.log(props.com_type + "::" + uuidRef.value + " onRenderTracked: " + e);
  }
})

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
    console.log(props.com_type + "::" + uuidRef.value + " onRenderTriggered: " + JSON.stringify(info));
  } catch (e) {
    console.log(props.com_type + "::" + uuidRef.value + " onRenderTriggered: " + e);
  }
})

</script>



<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  // inheritAttrs: true, // !! 2023.12.26a defineOptions へ移動した

  //= 副作用のある操作を一度だけ実行したいとき( <script setup> はコンポーネントが作成されるたびに実行されます)  
});
</script>



<style lang="scss" scoped>

// 全ての要素にborder-boxを適用させておく設定
*, *:before, *:after {
  box-sizing: border-box;
}

.galaxy {
    position: relative;
    display: block;
    background-color: rgba(0, 0, 0, 0) !important;
    opacity: 1.0 !important;
}

.svg_events {
    pointer-events: all;
}

.html_events {
    pointer-events: auto;
} 

.able {
    pointer-events: v-band("props.able ? 'auto' : 'auto'"); /* TODO none */
}

.able_galaxy {
    pointer-events: v-band("props.able ? 'auto' : 'auto'"); /* TODO none galaxy が手前に来る対策 */
}

.able_svg {
    pointer-events: v-band("props.able ? 'all' : 'all'"); /* TODO none */
}

.client_decided {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    background-color: rgba(0, 0, 0, 0);
    color: v-bind("appCfgRef.front_color");
}


.who_am_i {
    pointer-events: none;
    position: absolute;
    display: inline-block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    background-color: rgba(0, 0, 0, 0);
    font-size: 0.75em;
}

.who_am_i_layout {
    padding-top: 2em;
}




.editor_canvas { /* earth */
  position: relative;
  display: block;
  background-color: rgba(0, 0, 0, 0);
}


.html_body {
  background-color: rgba(0, 255, 0, 0);
}


.edit_html_container {
  display: block;
  position: relative;
  left: 0px;
  top: 0px;
  background-color: rgba(0, 255, 0, 0);
}


.mini_ctrl_svg {
  pointer-events:none;
}

.mini_ctrl_border {
  pointer-events: stroke;
}

</style>
