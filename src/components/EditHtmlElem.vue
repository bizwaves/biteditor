<template>
<!-- 
    TODO 2023-09-13 お試し　↓原因不明なのでを削除してみた
    style="pointer-events: none !important;"  
-->
<div  
      ref = "galaxy_ref" 
      class = "galaxy client_decided"
      title = "EditHtmlElem galaxy div, Position, Size の基準"
>

    <div v-if = "isDevModeRef" class = "who_am_i who_am_i_element" style="pointer-events: none !important;"> 
        {{ props.com_type }} : {{ props.uuid }}, ap is {{ able_pointed }} : props tag_name is {{ props.tag_name }} tag_type is {{ props.tag_type }} 
    </div>
    
    <!-- メモ 
        「style="pointer-events: none !important;" 」の時、Moveable の resize が動作しない
        「style="pointer-events: auto !important;" 」の時、同士の Moveable resize 動作を邪魔する
    -->
    <div
        class = "viewport_div client_decided" v-bind:style="able_pointed ? 'pointer-events: auto !important;' : 'pointer-events: none !important;'"
        ref = "viewport_ref"
        title = "EditHtmlElem viewport div"
    > 


        <!-- ↓↓↓↓ より小さい領域を作成する ↓↓↓↓ -->
        <!-- 
           【! EDITING】
             not is-editing の時、Moveable が裏側に配置することで、邪魔の元にならないようにすることで、
             手前にあるコンテンツ子孫の Resize を可能にする
             !is_editing
             【注意】no @contextmenu.prevent.stop = "onMoveableRClick"
               裏側にある moveable_div_ref または moveable_frame_ref は click, contextmenu event を受付しない
            [2023/07/10] 試し rm 「 v-bind:class = "moveablePosSize"  」
            【ABLE-DIRRECT-WARP】 2023/10/17
        -->
<!-- 
        <div v-if = "! is_editing" v-show = "props.able" 
            ref = "moveable_div_ref"
            class = "moveable_target moveable_div" 
            title = "EditHtmlElem moveable target div a" 
        >
            <div v-show = "false" 
                class = "moveable_frame" 
                ref   = "moveable_frame_ref" 
                title = "EditHtmlElem moveable_frame a" 
            >
                <div v-show="false" class="empty_frame_desc">
                    Here is the empty moveable_frame in EditHtmlElem a!
                </div>
            </div>

        </div>
 -->
        <!-- ↑↑↑↑ より小さい領域を作成する ↑↑↑↑ -->


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

              TODO when Roundable
                style="left: 10px;top: 10px;border-radius: 25px;"
                style="left: 140px;top: 10px;border-radius: 25px 23px;"
                style="target target3" style="left: 10px;top: 140px;border-radius: 25px 23px / 20px;"
                style="left: 140px;top: 140px;border-radius: 25px 25.5px 24.5px 24.9115px / 25.5px 25.5px 24.5px 24.5px;"
        -->
        <div
            class = "direct-wrap-target html_events"
            ref = "resizing_container_ref"
            @contextmenu.prevent.stop = "onResizingRClick"
            @click.prevent.stop = "onResizingClicked"
            title = "EditHtmlElem resizeing_container"
        >
<!-- 
            <div v-if = "false" class = "direct-wrap-debuger">
                ABLE-DIRRECT-WARP TARGET DEBUGER
            </div>
 -->
            <!-- 
                【ABLE-DIRRECT-WARP】 2023/10/17 
            -->
            <div 
                class = "resizing_frame html_events" 
                ref   = "resizing_frame_ref" 
                title = "EditHtmlElem resizeing_frame" 
            >
<!-- 
                <div v-if = "false" class = "direct-wrap-debuger">
                    ABLE-DIRRECT-WARP FRAME DEBUGER
                </div>
 -->
                <svg class = "svg_root svg_events" :viewBox = "viewBoxStr" ref = "resizing_svg_ref" >
                    <title>moon: root svg of EditHtmlElem</title> 

                    <g >
                        <title> EditHtmlElem 実要素 + Ctrl Group </title>

                        <g >
                            <title>EditHtmlElem【実要素】Group </title>

                            <!-- 
                                実要素(実要素は、常に上にある) 
                            -->

                            <!-- 【ABLE-DIRRECT-WARP】2023/10/17 TODO  -->
                            <foreignObject :x = "rootMinX" :y = "rootMinY" :width = "rootWidth" :height = "rootHeight" class = "svg_events" ref = "resizing_foreign_ref" >
                                <div class = "html_xmlns client_decided html_events" xmlns = "http://www.w3.org/1999/xhtml" ref = "resizing_xmlns_ref" title = "EditHtmlFrame XMLNS-DIV in SVG/foreignObject">

 
                                    <!-- ↓ some test:「Slot CCCC used to EditHtmlElem!」 表示 されている -->
<!-- 
                                    <template v-if = "!!props.is_root" >
                                        EditHtmlElem-SLOT_<slot name = "pairedElemCnts"></slot>_EditHtmlElem-SLOT 表示 By root
                                    </template>
 -->

                                    <!-- ↓ some test: TODO「Slot CCCC used to EditHtmlElem!」 表示 されていない -->
<!-- 
                                    <template v-if = "!props.is_root" >
                                        EditHtmlElem-SLOT_<slot name = "pairedElemCnts"></slot>_EditHtmlElem-SLOT 表示 By non-root
                                    </template>
 -->


                                    <!-- 廃止（Tiptop へ移行した為）
                                        a) HTML Singleton Tags With No Closing Tag: 
                                            <br> <hr> <img> <input> <link> <meta> <area> <base> <col> <command> <embed> <keygen> <param> <source> <track> <wbr>
                                            v-if = "props.tag_type == 'html_singleton' "
                                    -->


                                    <!-- 
                                        1) TipTap node-view
                                            【廃止】:uuid = "familyIdRef" （2023.11.18 nodel familyIdRef へ移行）
                                     -->
                                    <template v-if = "[ 'code_mirror', 'mermaid', 'mathlive' ].includes(props.tag_type)" >
                                        <EditHtml
                                            ref                 = "edithtml_ref"
                                            class               = "html_events client_decided"
                                            v-model:familyIdRef  = "familyIdRef"
                                            v-model:familyZIndexRef = "familyZIndexRef"
                                            :is_root            = "props.is_root"
                                            :able               = "props.able"
                                            :editing_uuid       = "props.uuid"
                                            :editing_id         = "props.editing_id"
                                            :being_edit_id      = "props.being_edit_id"
                                            
                                            :tag_name           = "props.tag_name"
                                            :tag_type           = "props.tag_type"
                                            :content            = "props.content"

                                            v-model:able_target_ref  = "resizing_container_ref"
                                            v-model:able_actmd_ref   = "able_actmd_ref"
                                            v-model:able_macro_ref   = "able_macro_ref"

                                            v-model:able_pointed ="able_pointed"
                                            v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                            v-model:deletedRef  = "deletedRef"
                                        >
                                            <template v-slot:pairedLayoutCnts>
                                                <slot name = "pairedElemCnts"></slot>
                                            </template>
                                        </EditHtml>
                                    </template>



                                    <!-- 
                                        2) Paired Html Text: 
                                            Debug:
                                                OK WHEN is_root = true
                                                NG WHEN is_root = false
                                     -->
                                     <!-- ↓ 「Slot CCCC used to EditHtmlElem!」 表示 されている -->


                                    <template v-if = "props.tag_type == 'html_paired' " >
                                        <EditHtml
                                            ref                 = "edithtml_ref"
                                            class               = "html_events client_decided"
                                            v-model:familyIdRef  = "familyIdRef"
                                            v-model:familyZIndexRef = "familyZIndexRef"
                                            :is_root            = "props.is_root"
                                            :able               = "props.able"
                                            :editing_uuid       = "props.uuid"
                                            :editing_id         = "props.editing_id"
                                            :being_edit_id      = "props.being_edit_id"
                                            :tag_name           = "props.tag_name"
                                            :tag_type           = "props.tag_type"

                                            v-model:able_target_ref  = "resizing_container_ref"
                                            v-model:able_actmd_ref   = "able_actmd_ref"
                                            v-model:able_macro_ref   = "able_macro_ref"

                                            v-model:able_pointed ="able_pointed"
                                            v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                            v-model:deletedRef  = "deletedRef"
                                        >
                                            <template v-slot:pairedLayoutCnts>
                                                <slot name = "pairedElemCnts"></slot>
                                            </template>
                                        </EditHtml>
                                    </template>



                                    
                                    <!-- 
                                        3) Raw Html Text: 
                                    -->
                                    <template v-if = "props.tag_type == 'raw_html'">
                                        <EditHtml
                                            ref             = "edithtml_ref"
                                            class           = "html_events client_decided"
                                            v-model:familyIdRef  = "familyIdRef"
                                            v-model:familyZIndexRef = "familyZIndexRef"
                                            :is_root        = "props.is_root"
                                            :able           = "props.able"
                                            :editing_uuid   = "props.uuid"
                                            :editing_id     = "props.editing_id"
                                            :being_edit_id  = "props.being_edit_id"
                                            :tag_name       = "props.tag_name"
                                            :tag_type       = "props.tag_type"
                                            :content        = "props.content"

                                            v-model:able_target_ref  = "resizing_container_ref"
                                            v-model:able_actmd_ref   = "able_actmd_ref"
                                            v-model:able_macro_ref   = "able_macro_ref"

                                            v-model:able_pointed ="able_pointed"
                                            v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                            v-model:deletedRef  = "deletedRef"
                                        >
                                            <template v-slot:rawLayoutCnts>
                                                <slot name = "rawElemCnts"></slot>
                                            </template>
                                        </EditHtml>
                                    </template>



                                    <!-- 
                                        4) Raw Svg 要素:
                                            【廃止】:uuid = "familyIdRef" （2023.11.18 nodel familyIdRef へ移行）
                                        v-bind="attrs"
                                    -->
                                    <template v-if = "props.tag_type == 'svg'">
                                        <EditHtml v-bind="attrs"
                                            ref             = "edithtml_ref"
                                            class           = "html_events client_decided"
                                            v-model:familyIdRef  = "familyIdRef"
                                            v-model:familyZIndexRef = "familyZIndexRef"
                                            :is_root        = "props.is_root"
                                            :able           = "props.able"
                                            :editing_uuid   = "props.uuid"
                                            :editing_id     = "props.editing_id"
                                            :being_edit_id  = "props.being_edit_id"
                                            :tag_name       = "props.tag_name"
                                            :tag_type       = "props.tag_type"
                                            :content        = "props.content"

                                            v-model:able_target_ref  = "resizing_container_ref"
                                            v-model:able_actmd_ref   = "able_actmd_ref"
                                            v-model:able_macro_ref   = "able_macro_ref"

                                            v-model:able_pointed ="able_pointed"
                                            v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                            v-model:deletedRef  = "deletedRef"

                                            v-model:editPlusReqRef   = "editPlusReqRef"
                                        >
                                            <template v-slot:rawLayoutCnts>
                                                <slot name = "rawElemCnts"></slot>
                                            </template>
                                        </EditHtml>
                                    </template>


                                    <!-- 
                                        5) Text 要素: tag_type = u_text, tag_name = u-text
                                    -->
                                    <template v-if = "props.tag_type == 'u_text' " >
                                        <EditHtml
                                            ref                 = "edithtml_ref"
                                            class               = "html_events client_decided"
                                            v-model:familyIdRef  = "familyIdRef"
                                            v-model:familyZIndexRef = "familyZIndexRef"
                                            :is_root            = "props.is_root"
                                            :able               = "props.able"
                                            :editing_uuid       = "props.uuid"
                                            :editing_id         = "props.editing_id"
                                            :being_edit_id      = "props.being_edit_id"
                                            :tag_name           = "props.tag_name"
                                            :tag_type           = "props.tag_type"

                                            v-model:able_target_ref  = "resizing_container_ref"
                                            v-model:able_actmd_ref   = "able_actmd_ref"
                                            v-model:able_macro_ref   = "able_macro_ref"

                                            v-model:able_pointed ="able_pointed"
                                            v-model:emitedPosSizeRef ="emitedPosSizeRef"
                                            v-model:deletedRef  = "deletedRef"
                                        >
                                            <template v-slot:pairedLayoutCnts>
                                                <slot name = "pairedElemCnts"></slot>
                                            </template>
                                        </EditHtml>
                                    </template>

                                </div>
                            </foreignObject>

                            <!-- EditHtmlElem.vue Flag -->
<!-- 
                            <rect v-if = "isDevModeRef" class = "mini_ctrl_svg" :x = "0" :y = "0" :width = "c.w >= 12 ? c.w - 12 : 0" :height = "c.h >= 12 ? c.h - 12 : 0" style = "fill:rgba(128,64,0,0);stroke-width:1;stroke:rgba(0,255,0,0.25)" >
                                <title> EditHtml svg debuger: moon_ref の位置、サイズが正しく設定されなければ、これが表示されない </title>
                            </rect>
 -->
                        </g>

                    </g>
                </svg>

                <!-- 【廃止】2023/11/02 -->
<!-- 
                <div v-show = "being_edit" 
                    ref = "mini_ctrl_ref" 
                    class = "mini_ctrl"
                >

                  <svg 
                    class="mini_ctrl_svg" 
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
                        style = "fill:rgba(121,121,121,0.0)"
                        :stroke = ctrl_stroke_ref
                        :stroke-width = "(raResizingSize.w >= 32) && (raResizingSize.w >= 32) ? 16 : 1"
                        v-on:mouseover  = "mouseOverMiniCtrl" 
                        v-on:mouseleave = "mouseLeaveMiniCtrl"
                    > 
                      <title> EditHtmlElem Resizing debuger: 子 に重ねる表示があるため、ここは薄ら表示で良い  </title>
                    </rect>
                  </svg>

                </div>
 -->
            </div> <!-- moveable_frame -->
        </div>  <!-- resizing_container -->
        <!-- ↑↑↑↑ TODO コンテンツの Resize 避難先 -->


        <!-- ↓↓↓↓ より小さい領域を作成する ↓↓↓↓ -->
        <!--
           【EDITING】
             is-editing の時、Moveable が手前に来るようにすることで、Resize 操作を可能にする
             is_editing
             【注意】no @contextmenu.prevent.stop = "onMoveableRClick"
             @click.stop @contextmenu は共に動作可能（Moveable 独自の Mouse 操作に遮断されていない）、
               が、すっきりしたいので、ここでそれらのイベントを設定しない。
            [2023/07/10] 試し rm 「 v-bind:class = "moveablePosSize"  」
            【ABLE-DIRRECT-WARP】 2023/10/17
                以下は廃止 TODO onMoveableClicked 移動
        -->
<!-- 
          <div v-if = "is_editing" v-show = "props.able"
            ref = "moveable_div_ref"    
            class = "moveable_target moveable_div"                          
            title = "EditHtmlElem moveable target div b" 
            @click.stop = "onMoveableClicked"
        >
        
            <div v-show="false" 
                class = "moveable_frame"
                ref   = "moveable_frame_ref" 
                title = "EditHtmlElem moveable_frame" 
            >
                <div v-show="false" class="empty_frame_desc">
                    Here is the empty moveable_frame in EditHtmlElem!
                </div>
            </div>

        </div>
 -->
        <!-- ↑↑↑↑ より小さい領域を作成する ↑↑↑↑ -->

        
        <!--
          How to use custom CSS
            https://github.com/daybrush/moveable/blob/master/handbook/handbook.md#toc-defaultcss
          TODO 使い方: className = "moveable2"
          備考： zoom := Control-Line の表示・非表示
          【ABLE-DIRRECT-WARP】 2023/10/17 change
            :target = "moveable_div_ref" to
            :target = "resizing_container_ref" 
          【ABLE-DIRRECT-WARP】 2023/10/17
            TODO @drag-start ...
        -->

        <Moveable v-if = 'is_editing && (able_actmd_ref == "DEFAULT")'
            title = "EditHtmlElem Moveable := DEFAULT"
            ref = "moveable_ref"
            className = "moveable2"
            :target           = "resizing_container_ref"
            :zoom             = "1"
            :draggable        = "is_editing  && (!includeDraggable)"
            :resizable        = "is_editing"
            :keepRatio        = "false"
            :throttleResize   = "0"
            :renderDirections = '["nw", "n", "ne", "w", "e", "sw", "s", "se"]'
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
            :draggable          = 'able_specs["All_In_One"]["draggable"] && (!includeDraggable)'
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
            :draggable          = 'able_specs["Dra_Res_Rot"]["draggable"] && (!includeDraggable)'
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
            :draggable          = 'able_specs["Dra_Res"]["draggable"] && (!includeDraggable)'
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
            :draggable          = 'able_specs["Resizable"]["draggable"] && (!includeDraggable)'
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
            :draggable          = 'able_specs["Dra_Sca_Rot"]["draggable"] && (!includeDraggable)'
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

    	<Moveable v-if = 'is_editing && (able_actmd_ref == "Dra_Sca")'
            :target             = "resizing_container_ref" 
            :draggable          = 'able_specs["Dra_Sca"]["draggable"] && (!includeDraggable)'
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
            :draggable          = 'able_specs["Scalable"]["draggable"] && (!includeDraggable)'
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
            :draggable              = 'able_specs["Clippable"]["draggable"] && (!includeDraggable)'
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

    	<Moveable  v-if = 'is_editing && (able_actmd_ref == "Roundable")'
            :target                         = "resizing_container_ref" 
            :draggable                      = "true && (!includeDraggable)" 
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

    </div> 
    <!-- ↑ viewport_div -->
</div> 
<!-- ↑ galaxy -->
</template>


<script setup lang="ts">
import {
    effectScope, getCurrentScope, onScopeDispose, markRaw, toRaw, reactive, shallowReactive, shallowReadonly, isReactive, computed, shallowRef, triggerRef, customRef, ref, unref, toRef, toRefs, isRef,
    // defineProps, defineEmits, defineExpose, defineSlots,
    h, inject, hasInjectionContext, mergeProps, cloneVNode, isVNode, resolveComponent, resolveDirective, withDirectives, withModifiers, watch, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
    onBeforeUnmount, onUnmounted, onErrorCaptured, onRenderTracked, onRenderTriggered, nextTick, useSlots, useAttrs
} from 'vue'
import Moveable from "vue3-moveable";

import {
    useDraggable, useActiveElement, useElementBounding, useEventListener,
    useMouse, useMousePressed, onKeyStroke, useMouseInElement, useParentElement, useElementSize,
    whenever, useMagicKeys
} from '@vueuse/core'

import EditHtml from "./EditHtml.vue";

import { v4 as uuidv4 } from 'uuid';

const developMode = inject('developMode') as any; // readonly process.env.NODE_ENV == "development"
const isDevModeRef = inject('isDevModeRef');

// 2022.11.01 版： 子コンポーネントの add-edit-svg 呼び出すの代り、cmd をセットし、actived obj が自ら
// その cmd を実行するようにする。
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editCmdRef = inject('editCmdRef');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateEditCmd = inject('updateEditCmd');  // function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editCmdParasRef = inject('editCmdParasRef'); // object
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialEditCmdParas = inject('initialEditCmdParas'); // function

const editingObjRef = inject('editingObjRef');          // isEditFocus 系から移行させる
const updateEditingObj = inject('updateEditingObj');    // function

const actingEditRef = inject('actingEditRef');        // 2023.11.10

const disabledAbleActsRef = inject('disabledAbleActsRef');

const outline_assets_ref: any = inject("outline_assets_ref");

const appCfgRef: any = inject("appCfgRef");


const myDisabledAbleActsRef = ref([]);  // "draggable" | "resizable" | ...

const galaxy_ref = ref(null);
const viewport_ref = ref(null);
const moveable_div_ref = ref(null);
const moveable_frame_ref = ref(null);

// https://github.com/daybrush/moveable
const moveable_ref = ref(null);             // REF of Moveable



defineSlots<{
    rawElemCnts?: () => Node[]
    pairedElemCnts?: () => Node[]
}>()


// Slot - 親コンポーネントから子コンポーネントにHTMLのタグを渡す, html-elem にはない？


defineOptions({
    inheritAttrs: true, // 2023.12.26a
})


// 親コンポーネントから子コンポーネントに文字列、数値、配列やオブジェクトを渡す
const props = defineProps({ // I/F: 親⇒子のデータの受け渡し
    com_type: { // edit_svg | edit_html_tag | ..
        type: String,
        default: "edit_html_elem",
    },
    parent_uuid: {              // reverse link
        type: String,
        required: true,         // 2023-10-09
    },
    uuid: {                     // Save, Load Etc
        type: String,
        required: true,         // 2023-10-09
    },
    z_index: {                  // 2023.12.18a
        type: Number,
        required: true,         // 2023.12.18a
    },
    editing_id: {               // is_editing := [ uuid, editing_id    ] MATCHING, Moaveable 動作中
        type: String,
        default: "elem_moveable",
    },
    being_edit_id: {            // being_edit := [ uuid, being_edit_id ] MATCHING, コンテンツ操作中
        type: String,
        default: "elem_contents",
    },
    is_root: {
        type: Boolean,
        default: false,
    },
    able: { // true | false
        type: Boolean,
        default: true,
    },
    tag_name: { // <br> | <div> | Raw Html Text
        type: String,
        default: "",
    },
    tag_type: { // html_singleton | html_paired | raw_html | null
        type: String,
        default: null,
    },
    content: { // tag の中身
        type: String,
        default: "",
    },
    init_x: { // 初期 Local 座標
        type: Number,
        default: 0, // px
    },
    init_y: { // 初期 Local 座標
        type: Number,
        default: 0, // px
    },
    init_width: { // 初期幅
        type: Number,
        default: 320, // px
    },
    init_height: { // 初期高さ
        type: Number,
        default: 240, // px
    },

})

console.log("$$$$$ EditHtmlElem props: ", JSON.stringify(props, null, 2));

const attrs = useAttrs(); // 2023.12.25c
console.log("@@@@@@@@ attrs: " + JSON.stringify(attrs, null, 2));

const editPlusReqRef = defineModel<any>("editPlusReqRef", { local: true, default: null });  // 2023.12.25c

const familyZIndexRef = ref(props.z_index);  // 2023.12.18a Family EdiyHtmlElem の z-index on EditHtmlFrame
watch(familyZIndexRef, (val, oldVal) => {
    console.log(`familyZIndexRef changed: ${val} <= ${oldVal}`);
    emit("z_index_changed", props.uuid, Number(val), Number(oldVal));  // 2023.12.18a
});

const md_uuid = ref(props.uuid);                // 2023.12.08 children との連携のため、props.uuid とは別に、md_uuid を用意する, toRef も同じ
const md_parent_uuid = ref(props.parent_uuid);  // 2023.12.08 children との連携のため、props.uuid とは別に、md_uuid を用意する, toRef も同じ

//= 2023-10-09 修正
//  2023-10-09 書けない障害を修正するため、computed から変更した
//  【お試し】Format を `${props.com_type}.${props.uuid}` から `${props.uuid}` に変更した
//    ※ 下位 EditSvgRect 等で行われた uuid の変更に、制限を設けないため
//=
// const familyIdRef = ref(`${props.com_type}.${props.uuid}`)   // 2023.12.10 廃止（Child uuid 修正の時、com_type 部が重ねる障害が判明したため）; 旧仕様
const familyIdRef = ref(`${props.uuid}`);                       // 2023.12.10 お試し　※ ↓コードは、両方の仕様に対応している

watch(familyIdRef, (v) => {
    if (v) {
        console.log(`familyIdRef changed to ${v}`);

        //= 【制限】: 旧仕様の時、下記の Format が壊れないこと
        //  例: familyIdRef changed to edit_html_elem.ea016c64-efd4-4fc4-a3de-5a9b64f22920c
        //=
        const uuid = v.includes(`${props.uuid}.`) ? v.pop() : v;
        md_uuid.value = uuid;
    }
})

watch(md_uuid, (val, oldVal) => {   // 2023.12.08 取りあえず、これで凌ぐ
    console.log("md_uuid changed val: " + val + " oldVal: " + oldVal);
    if (val != oldVal) {
        emit("uuid_changed", props.uuid, val, oldVal);  // FIXED 2023.12.09
    }
});

watch(toRef(props, 'uuid'), (val, oldVal) => {
    console.log("props.uuid changed val: " + val + " oldVal: " + oldVal);
});




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
    "DEFAULT",
    //= 単体動作
    "Draggable",                            //      ※ 未実装
    "Resizable",                            // 実装済 := Draggable_Resizable_Rotatable
    "Scalable",                             // 実装済 := AbleCoDragScalaRotat.vue
    "Rotatable",                            //      ※ 未実装
    "Warpable",                             // 実装済 AbleBasicWarpable.vue
    "Pinchable",                            //      ※ 未実装
    "Groupable",                            //      ※ 未実装
    "Snappable",                            //      ※ 未実装
    "Clippable",                            // 実装済 AbleBasicClippable.vue
    "Roundable",                            // 実装済 AbleBasicRoundable.vue
    "OriginDraggable",                      //      ※ 未実装
    "Selecto",                              //      ※ 未実装

    //= Able Combination
    "Dra_Res",                              // 実装済 Dra_Res := Draggable_Resizable_Rotatable
    "Dra_Res_Rot",                          // 実装済 Dra_Res_Rot AbleCoDragResizaRotat.vue
    "Dra_Sca",                              // 実装済 Dra_Sca := AbleCoDragScalaRotat.vue
    "Dra_Sca_Rot",                          // 実装済 Dra_Sca_Rot := AbleCoDragScalaRotat.vue
    "Dra_OriDra_Rot",                       //      ※ 未実装 Draggable_OriginDraggable_Rotatable
    "All_In_One",                           // 実装済 AbleGroupAllInOne.vue
];

const able_macro_ref = {                    // 【named-model】in_ | out_ | io_, データ I/F
    out_pos_size_ref : ref({ }),            // !! 仮、左記のように項目を追加すること
};


const resizing_container_ref = ref(null);   // The Moveable Target.【旧】コンテンツの Resize 避難先

const able_specs = {}

//= BEGIN All_In_One Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
able_specs["All_In_One"] = {
    draggable: true,
    throttleDrag: 1,
    edgeDraggable: false,
    startDragRotate: 0,
    throttleDragRotate: 0,
    keepRatio: false,
    throttleScale : 0,
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
    draggable : true,
    throttleDrag : 1,
    edgeDraggable : false,
    startDragRotate : 0,
    throttleDragRotate : 0,
    scalable : true,
    keepRatio : false,
    throttleScale : 0,
    renderDirections : ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
    rotatable : true,
    throttleRotate : 0,
    rotationPosition : "top",
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
    warpable : true,
    renderDirections : ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
}
const onWarp_Warpable = e => {
    e.target.style.transform = e.transform;
};
//= END   Warpable Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//= BEGIN Clippable Script ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
able_specs["Clippable"] = {
    draggable : true,
    startDragRotate : 0,
    throttleDragRotate : 0,
    zoom : 1,	// default is 1, TODO = zoom;
    clippable : true,
    clipRelative : false,
    clipArea : false,
    dragArea : false,	// default is false, TODO = dragArea;
    dragWithClip : 0,
    defaultClipPath : "inset",
    clipTargetBounds : false,
    keepRatio : false,
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



watch(able_actmd_ref, (val, oldVal) => {
    console.log(`$$$$ able_actmd_ref changed: ${val} <= ${oldVal}`);
});


const resizing_frame_ref = ref(null);           // relatived
const resizing_svg_ref = ref(null);
const resizing_foreign_ref = ref(null);
const resizing_xmlns_ref = ref(null);
   
const mini_ctrl_ref = ref(null);
const ctrl_stroke_ref = ref("rgba(88, 0, 88, 0.05)");



const deletedRef = defineModel<any>("deletedRef", { local: true, default: null })

//= 子 EditHtml REF
const edithtml_ref = ref(null);     // ↓ は廃止した 2023/10/21
// const html_u_text = ref(null);
// const raw_html_ref = ref(null);
// const html_singleton_ref = ref(null);
// const html_paired_ref = ref(null);

const elem_able_on = ref(true);

//=
//  2023/07/31 Default false へ変更
//      理由: true であれば、最後に追加された同士が退避しない限り、友達は操作不能
//          ⇒ TODO ctrl click state より自動的切り替えは出来ないか
//  2023/10/10
//  【お試し】2023/10/10 Default false へ変更
//  【お試し】2023/10/10 is_editing と同値 へ変更
//              TODO being_edit 時も？
//=
// const able_pointed = ref(false); // viewport_div, Moveable 系 pointer-events 制御（一時的退避）
const able_pointed = computed(() => {
    return (editingObjRef.value.uuid === props.uuid && editingObjRef.value.editing_id === props.editing_id);
})

const is_editing = computed(() => {
  return (editingObjRef.value.uuid === props.uuid && editingObjRef.value.editing_id === props.editing_id);
})

const being_edit = computed(() => {
  return (editingObjRef.value.uuid === props.uuid && editingObjRef.value.editing_id === props.being_edit_id);
})

const EXP_ABLE_C_SIZE = 0;     // 例 36 (px), resizing_container := moveable_div + this

const keys = useMagicKeys();

// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values

whenever(keys.shift_backspace, () => {
    console.log("keys.shift_backspace");
    if (props.able) {
        if (! is_editing.value) {
          updateEditingObj({ editing_id: props.editing_id, uuid: props.uuid, com_type: props.com_type, url: 'moveable_div', state: "DragAbleIng", caused_by: "keys.shift_backspace" });
        }
    } else {
        console.log("onResizingClick: props.able is false, do nothing!");
    }
})


const { x: galaxy_x, y: galaxy_y, top: galaxy_top, right: galaxy_right, bottom: galaxy_bottom, left: galaxy_left, width: galaxy_width, height: galaxy_height } = useElementBounding(galaxy_ref)
const g = reactive({
  x: 0,
  y: 0,
  w: galaxy_width,
  h: galaxy_height
});


const { x: resiz_x, y: resiz_y, top: resiz_top, right: resiz_right, bottom: resiz_bottom, left: resiz_left, width: resiz_width, height: resiz_height } = useElementBounding(resizing_frame_ref)
const resiz = reactive({
  x: 0,
  y: 0,
  w: resiz_width,
  h: resiz_height
});

const c = props.able ? resiz : g;

const viewBoxStr = computed(() => {
    return c.x + ' ' + c.y + ' ' + c.w + ' ' + c.h;
});  // view-Box

const rootMinX          = computed(() => { return c.x + 'px'; });           // foreignObject
const rootMinY          = computed(() => { return c.y + 'px'; });           // foreignObject
const rootWidth         = computed(() => { return (c.w + 'px'); });         // foreignObject, View-Port
const rootHeight        = computed(() => { return (c.h + 'px'); });         // foreignObject, View-Port

// const editor_canvas_pos = ref({ x: 32, y: 24 });                            // TODO editor_canvas 移動操作 by mouse | key | tool
// const editor_canvas_style = computed(() => { return ("position: absolute; left: " + editor_canvas_pos.value.x + "px; top: " + editor_canvas_pos.value.y + "px;") });

// const zoomScale = ref(1.0); // SLIDER
// const transformText = computed(() => { return "scale(" + zoomScale.value + " " + zoomScale.value + ")"; });

//= 【DEPRECATED】自分がアクティブかどうか
//    TODO is_editing へ移行
const isEditFocus = computed(() => { return editingObjRef.value.uuid == props.uuid; }); 

const item = ref({      // .EditHtml データ
    uuid : familyIdRef,    // 2023-10-09
    // uuid : props.uuid === "editor_html_elem" ? "editor_html_layout" : uuidv4(), // .elem の一意の識別子です
});


function itemStyle(item) {
    console.log('EditHtmlElem ' + props.uuid + ' style ' + item.uuid);
    if (item.type == 'edit_svg') {
        return {
        };
    } else if (item.type == 'edit_html') {
        return {
        };
    } else if (item.type == 'raw_html') {       // !!
        return {
        };
    } else if (item.type == 'html_singleton') { // !!
        return {
        };
    } else if (item.type == 'html_paired') {    // !!
        return item.style;
    } else {
        return {
        };
    }
}


/* viewport は、見立に過ぎず、そのサイズは、moveable を拘束できず、影響せず。なので、サイズはなんでも良い。当関数は Debug のためです */
const viewportSize = computed(() => { return props.able ? "viewport_size" : "viewport_disabled"; }); // View-Port のクラス

const moveablePosSize = computed(() => { return props.able ? "moveable_posize" : "moveable_posize_disabled"; }); // Moveable のクラス

const emit = defineEmits([
    'props_updated',        // 親コンポーネントに、props の更新を通知
    'deleted',              // 親コンポーネントに、削除を通知
    'uuid_changed',         // 2023/10/09, uuid, val, oldVal
    'z_index_changed'       // 2023.12.18a
])


const editingUuid = computed(() => { return editingObjRef == null ? '' : editingObjRef.value.uuid; });
const editingObj = computed(() => { return editingObjRef == null ? '(No Editing Obj)' : editingObjRef.value.com_type + " : " + editingObjRef.value.uuid; });


watch(editCmdRef, (newVal, oldVal) => {
    // alert("Hello, watch of EditSvg.vue");
    if (isEditFocus.value) {
        console.log(props.com_type + ' ' + props.uuid + ' received editCmdRef ' + newVal.cmd);
        if (newVal.cmd == 'applyColor') {             // !! EditRectangle の参考コード: 色を変える
            console.log("color: " + newVal.color);
            // if (editCmdParasRef.value.src_seltor.name == "stroke") {
            //     b.value.stroke =newVal.color;
            // } else if (editCmdParasRef.value.src_seltor.name == "fill") {
            //     b.value.fill = newVal.color;
            // }
        } 
    }
});


// //=== BEGIN バブリング (Bubbling) Mouse Event chain 調査
// const Layers = [];
// //= ここから branch master
// Layers.push({ 'name': 'galaxy',     'ref': galaxy_ref, 'pressed': null });
// Layers.push({ 'name': 'viewport',   'ref': viewport_ref, 'pressed': null });

// //= ここから branch contents
// Layers.push({ 'name': 'resizing_container',     'ref': resizing_container_ref,  'pressed': null });
// Layers.push({ 'name': 'resizing_frame',         'ref': resizing_frame_ref,      'pressed': null });
// Layers.push({ 'name': 'resizing_svg',           'ref': resizing_svg_ref,        'pressed': null });
// Layers.push({ 'name': 'resizing_foreign',       'ref': resizing_foreign_ref,    'pressed': null });
// Layers.push({ 'name': 'resizing_xmlns_ref',     'ref': resizing_xmlns_ref,      'pressed': null });

// Layers.push({ 'name': 'html_singleton',         'ref': edithtml_ref,            'pressed': null });
// Layers.push({ 'name': 'html_paired',            'ref': edithtml_ref,            'pressed': null });
// Layers.push({ 'name': 'raw_html',               'ref': edithtml_ref,            'pressed': null });

// //= ここから branch moveable-target
// Layers.push({ 'name': 'moveable_div',           'ref': moveable_div_ref,        'pressed': null });
// Layers.push({ 'name': 'moveable_frame',         'ref': moveable_frame_ref,      'pressed': null });

// for (let i = 0; i < Layers.length; i++) {
//     const { pressed } = useMousePressed({ target: Layers[i].ref });
//     Layers[i].pressed = pressed;
//     whenever(Layers[i].pressed, () => {
//         console.log(";;;; ↑ " + Layers[i].name + " pressed: ", props.com_type + " " + props.uuid);
//     });
// }
// //=== END バブリング (Bubbling) Mouse Event chain 調査

const onMoveableClicked = (e) => {
  if (developMode)  console.log(`^^ onMoveableClicked at uuid: ${props.uuid}`);
  if (props.able) {
    if (being_edit.value) {
      console.log("  being_edit is Yes, do nothing!");
    } else {
      console.log("  aactive resizing_container!");
      updateEditingObj({ editing_id: props.being_edit_id, uuid: props.uuid, com_type: props.com_type, url: 'moveable_div', state: "being_edit", caused_by: "onMoveableClicked" });
    }
  } else {
    console.log("  able is false, do nothing!");
  }
}

const onResizingRClick = (e) => {
    if (developMode)  console.log(`^^ onResizingRClick at uuid: ${props.uuid}`);
    if (props.able) {
        if (is_editing.value) {
            console.log("  is_editing is Yes, do nothing!");
        } else {
            console.log("  editor_able_on is true, active Moveable!");
            updateEditingObj({ editing_id: props.editing_id, uuid: props.uuid, com_type: props.com_type, url: 'resizing_frame', state: "is_editing", caused_by: "onResizingRClick" });
        }
    } else {
        console.log("  props.able is false, do nothing!");
    }
}

const onResizingClicked = (e) => {
    if (developMode) console.log(`^^ onResizingClicked at uuid: ${props.uuid}`);
    if (props.able) {
        if (being_edit.value) {
            console.log("  being_edit is Yes, do nothing!");
        } else {
            console.log("  active resizing_container!");
            updateEditingObj({ editing_id: props.being_edit_id, uuid: props.uuid, com_type: props.com_type, url: 'resizing_frame', state: "being_edit", caused_by: "onResizingClick" });
        }
    } else {
        console.log("  props.able is false, do nothing!");
    }
}



const onMoveableRotateStart = e => {
    e.setFixedDirection([-0.5, -0.5]);
};

const onMoveableRotate = e => {
    e.target.style.transform = e.drag.transform;
};

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
  console.log("EditHtmlElem uuid " + props.uuid + " onMoveableDragEnd " + e.transform);
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
  // myPosSizeRef.value.width  = `${target.offsetWidth  + EXP_ABLE_C_SIZE}px`;
  // myPosSizeRef.value.height = `${target.offsetHeight + EXP_ABLE_C_SIZE}px`;
  // myPosSizeRef.value.left   = `${x + target.offsetLeft}px`;
  // myPosSizeRef.value.top    = `${y + target.offsetTop}px`;

  // //= 裏側 | 手前切り替え時に、moveable_div の位置・サイズがずれないように、初期値を記憶する
  // initAblePosSizeRef.value.width  = `${target.offsetWidth}px`;
  // initAblePosSizeRef.value.height = `${target.offsetHeight}px`;
  // moveableChangedRef.value.size = true;

  // //= trans は検証出来ていないので、代って、offsetLeft, offsetTop を記憶する
  // // TODO initAblePosSizeRef.value.trans = trans;
  // initAblePosSizeRef.value.left = `${x + target.offsetLeft}px`;
  // initAblePosSizeRef.value.top  = `${y + target.offsetTop}px`;
  // moveableChangedRef.value.pos = true;

  // console.log("  myPosSize: " + JSON.stringify(myPosSizeRef.value));
  // console.log("  initAblePosSize: " + JSON.stringify(initAblePosSizeRef.value));
  //= END 【廃止】 2023/11/02
}


const onMoveableScale = e => {
  console.log("onMoveableScale" + e.transform);
  e.target.style.transform = e.drag.transform;
};


// https://daybrush.com/moveable/storybook/index.html?path=/story/basic--basic-resizable
const onMoveableResize = e => {
  // width: 642 height: 480 transform:  translate(-2px, 0px)
  // console.log("onMoveableResize width: " + e.width + " height: " + e.height + " transform: " + e.drag.transform);

  e.target.style.width = `${e.width}px`;
  e.target.style.height = `${e.height}px`;
  e.target.style.transform = e.drag.transform;
}

const onMoveableResizeStart = e => {
    console.log("onMoveableResizeStart " + e.target.style);
}


const onMoveableResizeEnd = e => {
  console.log("EditHtmlElem uuid " + props.uuid + " onMoveableResizeEnd " + e.transform);

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
  // myPosSizeRef.value.width  = `${target.offsetWidth + EXP_ABLE_C_SIZE}px`;
  // myPosSizeRef.value.height = `${target.offsetHeight + EXP_ABLE_C_SIZE}px`;
  // myPosSizeRef.value.left   = `${x + target.offsetLeft}px`;
  // myPosSizeRef.value.top    = `${y + target.offsetTop}px`;

  // //= 裏側 | 手前切り替え時に、moveable_div の位置・サイズがずれないように、初期値を記憶する
  // initAblePosSizeRef.value.width  = `${target.offsetWidth}px`;
  // initAblePosSizeRef.value.height = `${target.offsetHeight}px`;
  // moveableChangedRef.value.size = true;

  // //= trans は検証出来ていないので、代って、offsetLeft, offsetTop を記憶する
  // // TODO initAblePosSizeRef.value.trans = trans;
  // initAblePosSizeRef.value.left = `${x + target.offsetLeft}px`;
  // initAblePosSizeRef.value.top  = `${y + target.offsetTop}px`;
  // moveableChangedRef.value.pos = true;

  // console.log("  myPosSize: " + JSON.stringify(myPosSizeRef.value));
  // console.log("  initAblePosSize: " + JSON.stringify(initAblePosSizeRef.value));
  //= END 【廃止】 2023/11/02
}

//= BEGIN 【廃止】 2023/11/02
// const myPosSizeRef = ref({        // resizing_container 用 注意: この時点で、g.w は 0 なので、Math.round(g.w / 2) は 使えない
//     left:   props.init_x + 'px',
//     top:    props.init_y + 'px',
//     width:  props.init_width  + 'px',   // 参考 SvgEditor:  (640 + EXP_ABLE_C_SIZE) + 'px'
//     height: props.init_height + 'px',   // 参考 SvgEditor:  (480 + EXP_ABLE_C_SIZE) + 'px'
// })

// const raResizingSize = computed(() => {
//     return {
//         x: Math.round(parseFloat(myPosSizeRef.value.left)),
//         y: Math.round(parseFloat(myPosSizeRef.value.top)),
//         w: Math.round(parseFloat(myPosSizeRef.value.width) - EXP_ABLE_C_SIZE),
//         h: Math.round(parseFloat(myPosSizeRef.value.height) - EXP_ABLE_C_SIZE)
//     }
// })

// const raResizingViewbox = computed(() => {
//     return `0 0 ${raResizingSize.value.w} ${raResizingSize.value.h}`;
// })

// const initAblePosSizeRef = ref({  // moveable_div 追跡用、即時に反映出来ないことに注意
//     left:   props.init_x + 'px',
//     top:    props.init_y + 'px',
//     width:  props.init_width  + 'px',
//     height: props.init_height + 'px',
//     trans: 'translate(0px, 0px)',
// })

// const renewAblePosSizeRef = ref({  // moveable_div 用
//     left:   props.init_x + 'px',
//     top:    props.init_y + 'px',
//     width:  props.init_width  + 'px',
//     height: props.init_height + 'px',
//     trans: 'translate(0px, 0px)',
// })
//= END 【廃止】 2023/11/02

const moveableChangedRef = ref({ pos: false, size: false }); // moveable_div のサイズが変更されたかどうか

watch(is_editing,
  (newVal, oldVal) =>
  {
    console.log("~~~~~~~~ watch is_editing: " + newVal + " oldVal: " + oldVal);
    if (newVal) {
      // 手前へ来る時
      //  1. moveable_div の位置・サイズを設定する
      moveableChangedRef.value.pos  = false;   // RESET
      moveableChangedRef.value.size = false;   // RESET
      
      //= BEGIN 【廃止】 2023/11/02
      //   renewAblePosSizeRef.value.left   = initAblePosSizeRef.value.left;
      //   renewAblePosSizeRef.value.top    = initAblePosSizeRef.value.top;
      //   renewAblePosSizeRef.value.width  = initAblePosSizeRef.value.width;
      //   renewAblePosSizeRef.value.height = initAblePosSizeRef.value.height;
      //   renewAblePosSizeRef.value.trans  = initAblePosSizeRef.value.trans;
      //   console.log("  renewAblePosSizeRef: " + JSON.stringify(renewAblePosSizeRef.value));
      //= END 【廃止】 2023/11/02
    } else if (oldVal) {
      // 裏へ行く時
      //  1. moveable_div の位置・サイズを設定する
      //= BEGIN 【廃止】 2023/11/02
      //   renewAblePosSizeRef.value.left   = initAblePosSizeRef.value.left;
      //   renewAblePosSizeRef.value.top    = initAblePosSizeRef.value.top;
      //   renewAblePosSizeRef.value.width  = initAblePosSizeRef.value.width;
      //   renewAblePosSizeRef.value.height = initAblePosSizeRef.value.height;
      //   renewAblePosSizeRef.value.trans  = initAblePosSizeRef.value.trans;
      //   console.log("  renewAblePosSizeRef: " + JSON.stringify(renewAblePosSizeRef.value));
      //= END 【廃止】 2023/11/02
    }
  },
  { 
    deep: true,
    // immediate: true
  }
);


watch(
  being_edit,
  (newVal, oldVal) => {
    console.log("~~~~~~~~ watch being_edit: " + newVal + " oldVal: " + oldVal);
    // console.log("    being_edit is " + being_edit.value);
    // console.log("  editingObjRef.value.uuid: " + editingObjRef.value.uuid);
    // console.log("  props.uuid: " + props.uuid);
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


const emitedPosSizeRef = ref(null); // emit された posSize を受け取る

watch (c, (val, oldVal) => {
    console.log("!!!!EditHtmlElem watch resizing_frame c val: " + val.w + " - " + + val.h + " oldVal: " + oldVal.w + " - " + + oldVal.h);
});

//= BEGIN 【廃止】 2023/11/02
// watch(g, (val, oldVal) => { // SvgEditor resizing_frame サイズが反映されたと確認出来た 2023/06/14
//     console.log("$$$$EditHtmlElem watch galaxy g val: " + val.w + " - " + + val.h + " oldVal: " + oldVal.w + " - " + + oldVal.h);
//     if (!props.able) {  // 親 size と同一する動作モード
//         myPosSizeRef.value.width = val.w + 'px';
//         myPosSizeRef.value.height = val.h + 'px';
//     }
// });
//= END 【廃止】 2023/11/02

// const onPosSizeDecided = (ps) => {
//     console.log("$$$$$ onPosSizeDecided " + JSON.stringify(ps));

//     //= Frame に通知
//     ps['edit_html_elem'] = { uuid: props.uuid, tag_type: props.tag_type, tag_name: props.tag_name };
//     nextTick(() => {
//         emit('pos_size_decided', ps);
//     });

//     //= Frame は何もしてくれないので、自ら moveable_div, resizing_container に反映すべきだが、ここで行うと、「ResizeObserver loop limit exceeded」 になるので、
//     // 記憶しておいて、後で行う
//     emitedPosSizeRef.value = ps;
// }


whenever(keys.shift_CapsLock, () => {
    console.log("keys.shift_CapsLock, apply emitedPosSizeRef.value: " + JSON.stringify(emitedPosSizeRef.value));
    const ps = emitedPosSizeRef.value;
    if (ps == null) {
        return;
    }

    //= BEGIN 【廃止】 2023/11/02
    // //  initAblePosSizeRef は、props.able が変えない限り、変わらない
    // initAblePosSizeRef.value.left   = Math.round(ps.x) + 'px';
    // initAblePosSizeRef.value.top    = Math.round(ps.y) + 'px';
    // initAblePosSizeRef.value.width  = Math.round(ps.w) + 'px';
    // initAblePosSizeRef.value.height = Math.round(ps.h) + 'px';

    // //  myPosSizeRef は、props.able が変えると、変わる
    // myPosSizeRef.value.left         = Math.round(ps.x) + 'px';
    // myPosSizeRef.value.top          = Math.round(ps.y) + 'px';
    // myPosSizeRef.value.width        = Math.round(ps.w) + 'px';
    // myPosSizeRef.value.height       = Math.round(ps.h) + 'px';
    //= END 【廃止】 2023/11/02
})


const mouseOverMiniCtrl = (e) => {
    console.log(props.com_type + " : " + props.uuid + " mouseOverMiniCtrl");
    ctrl_stroke_ref.value = "rgba(88, 0, 88, 0.25)";
    e.stopPropagation();
}

const mouseLeaveMiniCtrl = (e) => {
    console.log(props.com_type + " : " + props.uuid + " mouseLeaveMiniCtrl");
    ctrl_stroke_ref.value = "rgba(88, 0, 88, 0.05)";
    e.stopPropagation();
}


const applyDomPosSize = (dom, pos_size) => {
    let style;
    //= 参考 2023/11/07
    // dom.request("draggable", { deltaX: pos_size["x"], deltaY: pos_size["y"] }, true);  ※ TODO 動作しない
    // 取りあえず、下記のように実装
    //=
    style = `display: block; position: absolute; left: ${pos_size["x"]}px; top: ${pos_size["y"]}px; width: ${pos_size["w"]}px; height: ${pos_size["h"]}px;`;
    dom.setAttribute("style", style);

    if ((pos_size["transform"] != "") && ("style" in dom)) {
        dom.style.transform = pos_size["transform"];
    }
}


const domPosSize = (dom) => {     // dom := ref.value of dom, e.g target of MoveAble
    let pos_size = {
        x: dom.offsetLeft,      // 36
        y: dom.offsetTop,       // 104
        w: dom.offsetWidth,     // 
        h: dom.offsetHeight,    // 
    };

    //= transform
    if (("style" in dom) && ("transform" in dom.style)) {   // object.style.transform := MoveAble, e.g `transform: scale(2, 0.5);`
        pos_size['transform'] = dom.style.transform;
    } else {
        pos_size['transform'] = "";  // !!
    }

    return pos_size;
}



const build_meta = (
    dom_name, dom_ref, develop, product, title,
    containerRequired = true,
    outline = `outline: solid 1px rgba(0, 0, 0, 1.0);`,     // !! 旧 border
    background = `rgba(255, 255, 255, 0.0)`,
) => {
    //=  meta, Raw Content := meta + raw[]

    console.log(`$$$$ ~~~~~~~~~~~~ build_meta ${dom_name}`);
    let meta = {};

    meta['com_type'] = props.com_type;        // component-type
    meta['uuid'] = props.uuid;                // component-id
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
            outline: outline,             // !! 旧 border
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

    let outlineAlpha = outline_assets_ref.value ? 0.5 : 0.0;
      
    //= EditHtmlElem galaxy_ref を child として作る
    let galaxy = build_meta(
        'galaxy',
        galaxy_ref,
        true,
        true,
        'EditHtmlElem galaxy, Position Size の基準, div',
        true,
        `outline: dashed 2px rgba(0, 0, 255, ${outlineAlpha});`
    );

    let galaxy_raw = [];
    galaxy['raw'] = galaxy_raw;

    //= EditHtmlElem viewport := viewport_ref を child として作る
    outlineAlpha = outline_assets_ref.value ? 1.0 : 0.0;
    let viewport = build_meta(
        'viewport',
        viewport_ref,
        true,
        true,
        'EditHtmlElem viewport, div',
        true,
        `outline: dotted 3px rgba(0, 255, 0, ${outlineAlpha});`
    );
    let viewport_raw = [];
    viewport['raw'] = viewport_raw;
    galaxy_raw.push(viewport);

    //= EditHtmlElem MoveAble Target := resizing_container_ref を child として作る
    let abletgt = build_meta(
        'resizing_container',
        resizing_container_ref,
        true,
        true,
        'EditHtmlElem MoveAble Target; resizing_container, div',
        true,
        `outline: solid 1px rgba(0, 0, 255, ${outlineAlpha});`
    );
    let abletgt_raw = [];
    abletgt['raw'] = abletgt_raw;
    viewport_raw.push(abletgt);

    //= 子 EditHtml のコンテンツを収集する
    const html = await edithtml_ref.value.makeRawContentJson(rootContainerRequired);
    abletgt_raw.push(html);

    return galaxy;
}


const configPosSize = (pos_size) => {
    applyDomPosSize(resizing_container_ref.value, pos_size);
}


const saveDbContent = (mod_uuid, self_only = false) => {
    edithtml_ref.value.saveDbContent(mod_uuid, self_only);
}


const loadDbContent = (self_only = false, recordUuid = "", useRecordUuid = false) => {   // 2024.01.01c on btnLoad DB
    //=
    //  useRecordUuid: ※ 2024.01.01c 現時点で、true で呼び出す必要な時がない（↓コメント参考）
    //    1) true  ⇒ recordUuid は uuidRef.value にする　※ recordUuid が "" の時は、uuidRef.valueで DB Load するので、実際に uuidRef.value は変更しない
    //    2) false ⇒ 別 recordUuid のデータだけ取得し、uuidRef.value は変更しない ※ Memory 機能で使用している、この時、読み込んだデータの uuid を廃棄する必要がある
    //=

    edithtml_ref.value.loadDbContent(self_only, recordUuid, useRecordUuid);
}

//= watch disabledAbleActsRef
watch (disabledAbleActsRef, (newVal, oldVal) => {
    // console.log("EditHtmlElem watch disabledAbleActsRef newVal: " + JSON.stringify(newVal) + " oldVal: " + JSON.stringify(oldVal));
    // console.log("actingEditRef uuid: " + actingEditRef.value.uuid); // edit_svg_embed.edit_html_elem.6a6465dd-5706-49c4-99e1-ff3fbb9d5bb0
    // console.log("uuid: " + props.uuid); // 6a6465dd-5706-49c4-99e1-ff3fbb9d5bb0")
    const uuid = actingEditRef.value.uuid.split('.edit_html_elem.').pop();
    if (uuid == props.uuid) {
        myDisabledAbleActsRef.value = newVal;
        console.log("actingEditRef.value.uuid == props.uuid, update myDisabledAbleActsRef.value: " + JSON.stringify(myDisabledAbleActsRef.value));
        console.log("  ⇒included draggable: " + myDisabledAbleActsRef.value.includes("draggable"));
    } else {
        console.log("actingEditRef.value.uuid != props.uuid, do nothing!");
    }

}, { deep: true });

// computed include draggable
const includeDraggable = computed(() => {
    let included = myDisabledAbleActsRef.value.includes("draggable");
    console.log("$$$$ include-Draggable: " + included);
    return included;
});


defineExpose({
    md_uuid,        // 2023.12.08
    md_parent_uuid, // 2023.12.08
    is_editing,

    //= BEGIN 【廃止】 2023/11/02
    // myPosSizeRef,
    // raResizingSize,             // computed
    //= END 【廃止】 2023/11/02

    configPosSize,
    resizing_container_ref,         // target of MoveAble, 2023/11/07
    makeRawContentJson,
    saveDbContent,
    loadDbContent,
})



onBeforeMount(() => {   // after template be compiled
    console.log(props.com_type + "::" + props.uuid + " BeforeMount!");
})

onMounted(async () => { // after DOM nodes be inserted
  await nextTick();
  console.log(props.com_type + "::" + props.uuid + " mounted!");

  // loadDbContent();
    
  // 追加された直後、自分をアクティブにする
  if (props.able) {
      console.log("  able is true, active Me!");
      updateEditingObj({ editing_id: props.editing_id, uuid: props.uuid, com_type: props.com_type, url: 'resizing_frame', state: "DragAbleIng", caused_by: "onMounted" });
  } else {
    console.log("  able is false, do nothing!");
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

onUnmounted(() => {   // after unmounted
  console.log(props.com_type + "::" + props.uuid + " Unmounted!");
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



const show = ref("hello, v-model");
const myShow = ref("hello, v-model myShow");
watch(show, (val, oldVal) => {
    console.log("show watch val: " + val + " oldVal: " + oldVal);
});

</script>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    // inheritAttrs: true, // !! 2023.12.26a defineOptions へ移動した

    //= 副作用のある操作を一度だけ実行したいとき( <script setup> はコンポーネントが作成されるたびに実行されます)  
});
</script>



<style lang="scss" scoped>

.galaxy {
    position: relative;
    display: block;
    background-color: rgba(0, 0, 0, 0.0) !important;
    color: rgba(255, 255, 255, 0) !important;
    pointer-events: None !important;
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
    background-color: rgba(0, 0, 0, 0.0);
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
    background-color: rgba(0, 0, 0, 0) !important;
    font-size: 0.75em;
}

.who_am_i_element {
    padding-top: 1.0em;
}


.html_xmlns {
  display: block;
  position: relative;
  background-color: rgba(0, 0, 0, 0);
}

.viewport_div {             /* 見立て */
  position: relative !important;
  background-color: rgba(0, 0, 0, 0) !important;
}


// ABLE-DIRRECT-WARP TARGET
.direct-wrap-target {
  position: absolute !important;
  width: v-bind("props.init_width + 'px'");
  height: v-bind("props.init_height + 'px'");

//= 表示異常対策: init_x y を外した 2023/11/03
//  TODO MoveAble の初期値として init_x y 設定する
//= 
//   top: v-bind("props.init_y + 'px'");
//   left: v-bind("props.init_x + 'px'");
  top: 0px;
  left: 0px;

  background-color: rgba(0, 0, 0, 0) !important;

  //= target (All_In_One)
//   border: 1px solid #333;
//   box-sizing: border-box;
}


.resizing_frame {
  display: block;
  position: relative;

  margin:   0px !important;                 /* SvgEditor と違い、ここは余裕の分がないことに注意 */
  padding:  0px;
  width:    calc(100% - 0px) !important;    /* SvgEditor と違い、ここは余裕の分がないことに注意 */
  height:   calc(100% - 0px) !important;    /* SvgEditor と違い、ここは余裕の分がないことに注意 */

  background-color: rgba(0, 0, 0, 0) !important;
}


.svg_root { /* moon, svg */
    width: v-bind(rootWidth);
    height: v-bind(rootHeight);
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