
import { ref } from 'vue'
import { createMachine } from 'xstate';
import { v4 as uuidv4  } from 'uuid';


//= 【補助】マウスの状態を追跡する
//  使途：makePathConfig にガードをかける等
const mouseConfig = {
  initial: 'mos_null',
  states: {
    mos_null: {
      on: { 
        mousedown : { target : 'mos_down',  actions: [ 'set_mouse_downing' ] },
        mouseup :   { target : 'mos_up',    actions: [ 'set_mouse_uping'   ] },
        MOUSELOST:  { target : 'mos_null',  actions: [ 'set_mouse_nulling' ] },
      },
    },
    mos_up: {
      on: { 
        mousedown: { target : 'mos_down',  actions: [ 'set_mouse_downing' ] },
        MOUSELOST: { target : 'mos_null',  actions: [ 'set_mouse_nulling' ] },
      }
    },
    mos_down: {
      on: { 
        mouseup:   { target : 'mos_up',    actions: [ 'set_mouse_uping'   ] },
        MOUSELOST: { target : 'mos_null',  actions: [ 'set_mouse_nulling' ] },
      }
    },
  },
};


//= 【2023.12.05 版】Path 描画機能
//  EditSvgPath.vue const displayMakePathState = (state) => { に併せて修正すること　
// TODO 
//  1. キーイベントの拡張
//  2. 履歴（遡る）機能
//=
const makePathConfig = {
  initial: 'pa_null',
  states: { 
    pa_null: {
      on: { 
        INIT: {                                       // !! All 初期化, 最初だけではなく、途中で初期化コマンドも来ることを忘れずに
          target : 'pa_empty',
          actions: [ 'pa_resetforgot_controls', 'pa_resetPathMaker' ],             // !! do All 初期化
        }, 
      },
    },
    pa_empty: {                                       // !! WAITING for mousedown  
      entry: [ 'pa_empty_entry', ],                    //  Do Nothing
      exit:  [ 'pa_empty_exit',  ],                     //  Do Nothing
      on: { 
        mousedown: { 
          target : 'start_anchor',
          actions: ['pa_makeStartAnchor'],             // !! New a Frame, 連続描画
        },
        mouseup: {
          // 無視
        },
        mousemove: {
          // 無視
        },
      },
    },
    start_anchor: {  // mousedown -ing
      on: {
        mousemove: {
          target : 'start_controling',
          actions: ['pa_makeingStartControl'],         // !! transition actions
          cond: 'being_mos_down',                         // !! guard
        },
        mouseup: { 
          target : 'pa_empty',
          actions: [],                                // do nothing
        },
      },
    },
    start_controling: {  // mousedown -ing
      on: {
        mousemove: {
          target : 'start_controling',
          actions: ['pa_makeingStartControl'],         // !! transition actions
          cond: 'being_mos_down',                         // !! guard
        },
        mouseup: {
          target : 'start_control',
          actions: ['pa_makeingStartControl'],         // !! transition actions
        },
      },
    },
    start_control: {  // mouseup -ing
      on: {
        mousemove: {
          target : 'end_controling',
          actions: ['pa_makeingEndControl'],           // !! transition actions
          cond: 'being_mos_up',                           // !! guard
        },
        mousedown: {
          // TODO
        },
        KEY_CODE_G : {                              // a := （新しい文明の）アンカー
          target : 'start_anchor_ready',            // !!!! TODO must be 'mos_up'
          actions: [
            'pa_closeFrame',                            // !! 作成中のフレームを閉じる
            'pa_forgot_control',                             // !! 作成中のフレームを忘れる
            'pa_makeStartAnchor'                        // ! x, y 不使用
          ],

        },
      },
    },
    end_controling: {  // mouseup -ing
      on: {
        mousemove: {
          target : 'end_controling',
          actions: ['pa_makeingEndControl'],           // !! transition actions
          cond: 'being_mos_up',                           // !! guard
        },
        mousedown: {
          target : 'end_control',
          actions: ['pa_makeingEndControl'],           // !! transition actions
        },
      },
    },
    end_control: {  // mousedown -ing
      on: {
        mousemove: {
          target : 'end_anchoring',
          actions: ['pa_makeingEndAnchor'],           // !! transition actions
          cond: 'being_mos_down',                         // !! guard
        },
        mouseup: {
          // TODO
        },
      },  
    },
    end_anchoring: {  // mousedown -ing
      on: {
        mousemove: {
          target : 'end_anchoring',
          actions: ['pa_makeingEndAnchor'],           // !! transition actions
          cond: 'being_mos_down',                         // !! guard
        },
        mouseup: {
          target : 'end_anchor',
          actions: ['pa_makeingEndAnchor'],           // !! transition actions
        },
      } 
    },
    end_anchor: {  // mouseup -ing
      on: {
        mousedown: {                                  // !!
          target : 'next_bezframe_ready',             // [ not forgot_anchor, not forgot_control ] 連続描画
          actions: [                                  // 
            'pa_closeFrame',                          // !! 作成中のフレームを閉じる
            'pa_openNextFrame',                       // !! 連続描画, 次のフレームを開く
          ],
        },

        //= TODO 2023.12.06
        // ntime-dom.esm-bundler.js:179 Error: <polyline> attribute points: Expected number, "329,330 NaN,NaN".
        //=
        // KEY_CODE_L: {                                  // !! 旧 mousemove は 別イベントの障害になっているので、KEY_CODE_Lにした
        //   target : 'line_toing',                      // ! 参考：next_bezframe_ready
        //   actions: [                                  // !!
        //     'pa_closeFrame',                          // !! 作成中のフレームを閉じる
        //     'pa_initLineToing',                       // !! 連続的な線を引くための初期化
        //   ],
        //   cond: 'being_mos_up',                         // !! guard
        // },

        KEY_CODE_G : {                                  // a := [ not forgot_anchor, forgot_control ]
          target : 'start_anchor_ready',                // !!!! TODO must be 'mos_up'
          actions: [
            'pa_closeFrame',                            // !! 作成中のフレームを閉じる
            'pa_forgot_control',                             // !! 作成中のフレームを忘れる
            'pa_makeStartAnchor'                        // ! x, y 不使用
          ],
        },
      },
    },
    line_toing : {  // mouseup -ing
      on: {
        mousemove: {
          target : 'line_toing',                        // [ not forgot_anchor, not forgot_control ]
          actions: ['pa_makeingLineTo'],                // !!!! TODO x not available エラー
          cond: 'being_mos_up',                            // !! guard
        },
        mousedown: {
          target : 'line_to',
        },
      }
    },
    line_to : { // mousedown -ing
      on: {
        mousemove: {
          target : 'line_toing',
          actions: ['pa_makeingLineTo'],                // !!!! TODO x not available エラー
          cond: 'being_mos_down',                          // !! guard
        },  
        mouseup: {
          target : 'pa_empty',
          actions: [
          ],
        },
      }
    },
    next_bezframe_ready: {  // mousedown -ing
      on: {
        mouseup: {
          target : 'start_control',
          actions: [ ],                             // ! x, y 不使用, x, y 断層あり
        },
        mousemove: {
          // 無視
        },
      }
    },
    start_anchor_ready: {  // mouseup -ing
      on: {
        mousedown: {
          target : 'start_anchor',
          actions: [ ],                             // ! x, y 不使用, x, y 断層あり
        },
        mousemove: {
          // 無視 
        },

      }
    },
    stop: {  // *
      type: 'final',          // TODO
    },

    example: {                // State methods and properties
      // state.value
      // state.children 
      // state.matches('red.stop')
      // const isMatch = [{ customer: 'deposit' }, { customer: 'withdrawal' }].some(
      //   state.matches
      // );
      // state.can({ type: 'TOGGLE' })
    },
    exam_single_tag: {
      tags: 'go'              // state.hasTag('go')
    },
    exam_multi_tag: {
      tags: ['go', 'stop']    // multi tag
    },
    exam_meta: {
      // meta: {
      //   message: 'The request succeeded!'     // meta data should contain JSON-serializable values only
      // },
    },
    exam_history: {
      type: 'history',        // 'history' state type
      history: 'shallow'      // 'deep' or 'shallow'
    },
  }, // end of states

  //= 任意の状態
  //  特定のイベントを任意の状態で受け付けるためには、そのイベントをステートマシンのルートレベルで定義します
  // ただし、特定の状態でこのイベントを無視したい場合は、その状態で同じイベント名を再定義することで可能です
  //=
  on: {
    DRAG_POINT_EVENT: {  // ここに任意のイベント名を記述します
      actions: ['pa_applyPointDraged'],  // ここに実行したいアクションを記述します
    },
    CORE_DATA_LOADED: {  // A DB Record Loaded
      actions: ['pa_applyCoreDataLoaded'],
    },
  },

}; 


//= 【2023.12.05 版】FSM-Machine Entry
//  EditSvgPath.vue const displayMakePathState = (state) => { に併せて修正すること　
//=
const svgPathConfig = {   // root config of states
  id:   'svgpath',
  type: 'parallel',               // Parallel State Nodes; https://xstate.js.org/docs/guides/parallel.html
  predictableActionArguments: true,

  context: {
    mouse    : null,              // mouse state := downing | uping ※初期化対象外

    //= 基本的には false
    //  特別な Frame だけ、Open～Close の間 true になる（Close 時 reset すること）
    forgot_anchor : false,             // isHeadFrame, forgot_anchor bezier frame フラグ(最初のFrame or Anchers 打ち切り)
    forgot_control: false,             // 制御的連続か, forgot_control bezier frame(最後のFrame or ControlPoints 打ち切り)

    rect    : null,               // SVG bound client rect ※初期化対象外
    drawingStatRef : ref({        // 【coreDataEv】
      frameCursor : null,         //    ↓ ベジエ曲線フレーム[]のカーソル
    }),
    b : ref(null),                // 【coreDataEv】BezierFrame[], UI 入力 bezier データ
    drawRef : ref({               // 【coreDataEv】描画用データ
      point    : [],              //    点, 例: { "x": 25,  "y": 25, id : "b1", anchor : false, "auto" : false },
      polyline : [],              //    制御線, 例: [ { points : [ { "x": 25,  "y": 25 }, { "x": 25,  "y": 25 } ], id : "ab" }
      path     : "",              //    パス, 例: "M 25 25 C 25 25 25 25 25 25"
    }),
  },
  states: {
    mouse: mouseConfig,           // Mouse [ UP, DOWN ] state を追跡する
    makepath: makePathConfig,     // パスを作る
  },
  on: {
    UPDATE_RECT: {
      actions: ['updateRect']
    },
    KEY_CODE_Z : {
      target : 'makepath.pa_empty',
      actions: [
        // 'pa_closepath',          // TODO パスを閉じる
        'pa_closeFrame',
        'pa_forgot_anchor',
        'pa_forgot_control',
      ],
      cond: 'isNotEmptyPath',
    },
  },
};


//= 
// 
const svgPathOptions = {
  actions: {  // the mapping of action names to their implementation

    set_mouse_downing: (context, event) => {
      // console.log('* being_mos_down');
      context.mouse = 'downing';
    },

    set_mouse_uping: (context, event) => {
      // console.log('* being_mos_up');
      context.mouse = 'uping';
    },

    set_mouse_nulling: (context, event) => {
      // console.log('* mos_nulling');
      context.mouse = null;
    },

    updateRect: (context, event) => {
      const rect = event.value.rect;
      // console.log('* updateRect : ', JSON.stringify(rect));
      context.rect = rect;
      dbgPrintContext(context);
    },

    pa_resetforgot_controls: (context, event) => {  // forgot_anchor, forgot_control 初期化
      // console.log('* pa_resetforgot_controls');
      resetForgottens(context);
    },

    pa_forgot_control: (context, event) => {     // forgot_control を true に設定
      context.forgot_control = true;
    },

    pa_forgot_anchor: (context, event) => {      // forgot_anchor を true に設定
      context.forgot_anchor = true;
    },

    pa_resetPathMaker: (context, event) => {  // All 初期化
      // console.log('* pa_resetPathMaker');
      resetPathMaker(context);
    },    

    pa_empty_entry: (context, event) => { // New a Frame
      // console.log('* pa_empty_entry: do nothing.');
    },
    
    pa_empty_exit: (context, event) => {
      // console.log('* pa_empty_exit: do nothing.');
    },

    pa_makeStartAnchor: (context, event) => {         //
      // console.log('* pa_makeStartAnchor');
      const [x, y] = coordinate(context, event);
      const [anX, anY] = openBezierFrameV2(context, x, y);  // Create a New Frame with 史前文明 prehistoricBez
      // startAnchor(context, anX, anY);                       // 現在の文明 Bezier を作成する
      BezierFrame.makeDraw(context);
    },

    pa_closeFrame: (context, event) => {
      // console.log('* pa_closeFrame');
      closeFrame(context);
      BezierFrame.makeDraw(context);
    },

    pa_openNextFrame: (context, event) => {       // 連続描画
      // console.log('* pa_openNextFrame');
      // openNextFrame(context);
      const [x, y] = coordinate(context, event);
      const [anX, anY] = openBezierFrameV2(context, x, y);  // Create a New Frame with 史前文明 prehistoricBez
      BezierFrame.makeDraw(context);
    },

    pa_initLineToing: (context, event) => {
      //=  LineTo に使われないが、Default で 下記のようになっている
      // context.forgot_anchor = false;
      // context.forgot_control = false;
      const [x, y] = coordinate(context, event);
      // console.log('* pa_initLineToing');
      openLineToFrame(context, x, y);
      BezierFrame.makeDraw(context);
    },

    pa_makeingLineTo: (context, event) => {
      const [x, y] = coordinate(context, event);
      // console.log('* pa_makeingLineTo x, y : ', x, y);
      lineToing(context, x, y);
      BezierFrame.makeDraw(context);
    },

    // pa_makeMoveTo: (context, event) => {
    //   const [x, y] = coordinate(context, event);
    //   console.log('* pa_makeMoveTo x, y : ', x, y);
    //   moveTo(context, x, y);
    //   BezierFrame.makeDraw(context);
    // },

    pa_makeingStartControl: (context, event) => {
      // console.log('* pa_makeingStartControl');
      const [x, y] = coordinate(context, event);
      startControling(context, x, y);
      BezierFrame.makeDraw(context);
    },

    pa_makeingEndControl: (context, event) => {
      // console.log('* pa_makeingEndControl');
      const [x, y] = coordinate(context, event);
      endControling(context, x, y);
      BezierFrame.makeDraw(context);
    },

    pa_makeingEndAnchor: (context, event) => {
      // console.log('* pa_makeingEndAnchor');
      const [x, y] = coordinate(context, event);
      endAnchoring(context, x, y);
      BezierFrame.makeDraw(context);
    },

    pa_applyPointDraged: (context, ev) => {
      // console.log('* pa_applyPointDraged');
      // console.log('  ev : ', JSON.stringify(ev, null, 2));
      dragPoint(context, ev["x"], ev["y"] , ev["item_id"]);
      BezierFrame.makeDraw(context);
    },

    pa_applyCoreDataLoaded: (context, ev) => {
      // console.log('* pa_applyCoreDataLoaded');
      // console.log('  ev : ', JSON.stringify(ev, null, 2));
      applyCoreDataLoaded(context, ev);
      BezierFrame.makeDraw(context);
    },
  },

  delays: {       // the mapping of delay names to their implementation
    /* ... */
  },

  guards: {       // the mapping of transition guard (cond) names to their implementation
    being_mos_down: (context, event) => {
      return !context.mouse.downing;
    },
    being_mos_up: (context, event) => {
      return !context.mouse.uping;
    },
    isNotEmptyPath: (context, event) => {
      return true;  // TODO : 未実装
    },
  },

  services: {     //  the mapping of invoked service (src) names to their implementation
    /* ... */
  },
  // activities: {   // (deprecated) the mapping of activity names to their implementation
  // },
};


export const svgPathMachine = createMachine(svgPathConfig, svgPathOptions);


// ↓↓↓↓ Class 定義 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class BezPoint {   // ベジエ曲線の点
  constructor({x, y, anchor = false, auto = false, id = uuidv4()}) {  // 2023.12.13a anchor = false に に変更 ※ instance 生成コード現状に合わせ
    this._dom = null;
    this._id = id;
    this._x  = x;
    this._y  = y;
    this._anchor = anchor;    // 点の種類, true ならアンカー false ならコントロール
    this._auto   = auto;      // 自動生成された点であるか否か

    //= ES6: class 直下で書けないので、constructor 内で定義
    // 例: this.foo = null;
  } 

  // _id = null;
  get id() {
    return this._id;
  }
  set id(id) {
    this._id = id;
  }

  // _dom = null;
  get dom() {
    return this._dom;
  }
  set dom(id) {
    this._dom = id;
  }


  // _x = null;
  get x() {
    return this._x;
  }
  set x(x) {
    this._x = x;
  }

  // _y = null;
  get y() {
    return this._y;
  }
  set y(y) {
    this._y = y;
  }
  
  // _anchor = false;
  get anchor() {
    return this._anchor;
  }
  set anchor(anchor) {
    this._anchor = anchor;
  }
  
  // _auto = false;
  get auto() {
    return this._auto;
  }
  set auto(auto) {
    this._auto = auto;
  }

}


class Bezier3 {       // ベジエ曲線 枠組 (template) 
  constructor(
    forgot_anchor,    // 2023.12.12 remove「 = false」 備考：未使用なため、何でもよい
    model = 'bezier'
  ) {
    this.model           = model;
  
    //= ベジエ曲線の種類, 参照: d = "path data"
    //  model       kind    コマンド   説明
    //  ~~~~~~~~~~  ~~~~~~  ~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  moveto              M,m     初期位置,位置のスキップ．
    //  lineto      L       L,l     直線を引く
    //  lineto      H       H,h     水平線を引く
    //  lineto      V       V,v     垂直線を引く
    //  bezier      2       C,c,S,s 2次ベジエ曲線を引く．端点と制御点とで曲線を指定する．
    //  bezier      3       Q,q,T,t 3次ベジエ曲線を引く．端点と制御点とで曲線を指定する．
    //  arcto               A,a     円弧を引く
    //  closepath           Z,z     直近の M 位置まで直線を引いて線を閉じる.なお，座標を重ねただけでは線が閉じられた事にはならない．
    // ~~~~~~~~~~  ~~~~~~  ~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    this._kind            = null;     // 大文字/小文字の区別はない
    this._absolute        = true;     // true: 大文字のコマンド, false: 小文字のコマンド

    //= 以下は bezier に沿って命名したが、kind が lineto などの時は、意味が異なる
    //  ２次ベジエ moveto lineto arcto closepath alais I/F を使うことが望ましい
    //  備考: ３次ベジエを予想しA B C D 順で生成していくため、例え、２次ベジエとなって、end_controlを飛ばし飛ばしてend_anchorに格納することができない
    //          ⇒ biz2_end_anchor === end_control
    this._start_anchor    = null;     // 始点    A,   旧 x0    A, B, C, D は、共通の要素を持つ: BezPoint
    this._start_control   = null;     // 制御点 ^B,   旧 x1    { x ; _, y ; _, anchor : true (default true), "auto" : true (default false), id : uuidv4() }
    this._end_control     = null;     // 制御点 ^C,   旧 x2    連続描画の時: C0 === B1 ※ mirror updated by 制御点 B1 center D0
    this._end_anchor      = null;     // 末端点  D,   旧 x     連続描画の時: D0 === A1 ※ updated by A1
  }

  //= ３次ベジエ曲線及び共通 I/F                            ３次ベジ  ２次ベジエ  moveto  lineto  arcto  closepath
  get start_anchor() { return this._start_anchor; }     //  A         A          A       A       A      A
  set start_anchor(v) { this._start_anchor = v; }       //  A         A          A       A       A      A
  get start_control() { return this._start_control; }   //  B         B          -       B       -      -
  set start_control(v) { this._start_control = v; }     //  B         B          -       B       -      -
  get end_control() { return this._end_control; }       //  C         C          -       -       -      -
  set end_control(v) { this._end_control = v; }         //  C         C          -       -       -      -
  get end_anchor() { return this._end_anchor; }         //  D         -          -       -       -      -
  set end_anchor(v) { this._end_anchor = v; }           //  D         -          -       -       -      -

  //= ２次ベジエ moveto lineto arcto closepath alais I/F
  get biz2_control() { return this._start_control; }    //            B          -               -      -
  set biz2_control(v) { this._start_control = v; }      //            B          -               -      -
  get biz2_end_anchor() { return this._end_control; }   //  -         C          -       -       -      -
  set biz2_end_anchor(v) { this._end_control = v; }     //  -         C          -       -       -      -
  get line_end_anchor() { return this._start_control; } //  -         -          -       B       -      -
  set line_end_anchor(v) { this._start_control = v; }   //  -         -          -       B       -      -

  get model() { return this._model; }
  set model(v) { this._model = v; }
  get kind() { return this._kind; }
  set kind(v) { this._kind = v; }
  get absolute() { return this._absolute; }
  set absolute(v) { this._absolute = v; }


  evaluateBezier() {
    //=
    //  this の内容を解釈して、ベジエ曲線の種類 curve := 0 ～ 3 を返す
    //= 
    let ev = null;
    if (this.end_anchor && this.end_control && this.start_control && this.start_anchor) {   // A, ^B, ^C, C: 3次ベジエ曲線
        ev = { md : 'bezier',  curve : 3, lastAnchor : this.end_anchor, lastControl : this.end_control };
    } else if (this.end_control && this.start_control && this.start_anchor) {               // A, ^B, C: 2次ベジエ曲線
        ev = { md : 'bezier',  curve : 2, lastAnchor : this.biz2_end_anchor, lastControl : this.biz2_control };
    } else if (this.start_control && this.start_anchor) {                                   // A, B: lineto
        ev = { md : 'lineto',  curve : 1, lastAnchor : this.line_end_anchor };
    } else if (this.start_anchor) {                                                         // A: moveto
        ev = { md : 'moveto',  curve : 0, lastAnchor : this.start_anchor };
    } else {                                                                                // 史前はあり得る
        ev = { md : null, curve : null, lastAnchor : null };
        // throw new Error('evaluateBezier: invalid bezier');
    }

    return ev;
  }


  mkPoints(pk, pt) {
    //=
    //  this の内容を解釈して、ベジエ曲線の端点の配列 を返す
    //= 
    const ev = this.evaluateBezier();

    let points = [];
    if (this.start_anchor) {points.push(this.start_anchor);}
    if (this.start_control) {points.push(this.start_control);}
    if (this.end_control) {points.push(this.end_control);}
    if (this.end_anchor) {points.push(this.end_anchor);}

    let cnt = 0;
    for (const p of points) {
      if (!pk.includes(p.id)) {
        pk.push(p.id);
        pt.push(p);
        cnt++;
      }
    }

    return cnt;
  }


  mkPolyline(polyline) {
    //= 
    //  2023.12.13a MoveAble-Point 動作時、auto point の自動的 re-mirror 処理は未実装なので、↓ auto 条件は投入出来ない
    //=
    let cnt = 0;
    if (this.start_anchor != null && this.start_control != null) {
    // if (this.start_anchor != null && this.start_control != null && !this.start_control["auto"]) {
      polyline.push({ points : [ this.start_anchor, this.start_control ], id : uuidv4() });
      cnt++;
    }

    if (this.end_control != null && this.end_anchor != null) {
    // if (this.end_control != null && this.end_anchor != null && !this.end_control["auto"]) {
      polyline.push({ points : [ this.end_control, this.end_anchor ], id : uuidv4() });
      cnt++;
    }
  
    return cnt;
  }


  mkPathText() {
    //=
    //  this の内容を解釈して、SVG の path を返す
    //=   MoveTo point A
    //    LineTo point AB 
    //     | Quadratic Bézier Curve point AbC   ２次ベジエ曲線
    //     | Cubic Bézier Curve point AbcD      ３次ベジエ曲線
    //=

    let ev = this.evaluateBezier();

    if (!this.start_anchor == null)  { return ""; }  // ev.curve is 0, ありえない

    let path = "M" + this.start_anchor["x"] + "," + this.start_anchor["y"] + " ";  // MoveTo point A

    if (ev.curve == 1) { 
      // console.log("@@@@@ mkPathText: LineTo point AB");
    }

    switch (ev.curve) {
      case 0: break;    // MoveTo point A
      case 1: path += "L" + this.line_end_anchor["x"] + "," + this.line_end_anchor["y"] + " "; break;  // LineTo point B
      case 2: path += "Q" + this.start_control  ["x"] + "," + this.start_control  ["y"] + " " + this.biz2_end_anchor["x"] + "," + this.biz2_end_anchor["y"] + " "; break;  // Quadratic Bézier Curve point C
      case 3: path += "C" + this.start_control  ["x"] + "," + this.start_control  ["y"] + " " + this.end_control    ["x"] + "," + this.end_control    ["y"] + " " + this.end_anchor["x"] + "," + this.end_anchor["y"] + " "; break;  // Cubic Bézier Curve point D
      default: break;
    }

    if (ev.curve == 1) { 
      // console.log("  ---> mkPathText: path = " + path);
    }

    return path;
  }


}  // end class Bezier3


class BezierFrame {
  constructor(forgot_anchor = false, forgot_control = false) {

    //= isHeadFrame: 直前のフレームを忘れ、一から始めるフラグ ⇒ true の時、要 Prefix MoveTo
    //    true : Anchor も Control Point も打ち切り（連続的生成しない）
    //    false: Anchor は打ち切らず（連続的描画）、Control Point は、↓の _forgot_control に従う
    this.forgot_anchor        = false;    //

    //= false: 制御的連続、 則ち、start_control は、直前 Frame Last _control の Mirror にする
    //    false: 制御的連続、 則ち、start_control は、直前 Frame Last _control の Mirror にする
    //    true: 制御的非連続、則ち、start_control は、直前 Frame Last _control の影響を受けず、新たに作成する
    this.forgot_control       = false;    

    // this._truncating       = false;    // 制御的連続ベジエ曲線を打ち切るフラグ（本線上）

    this._closed              = false;    // 閉じているかどうか, Debug 用
    this._cur                 = null;     // ↓ 作成中ベジエ曲線のカーソル TODO #cur: get issue
    this._beziers             = [];       // Bezier3[], ベジエ曲線の配列

  }


  get forgot_anchor() { return this._forgot_anchor; }
  set forgot_anchor(v) { this._forgot_anchor = v; }
  // get truncating() { return this._truncating; }
  // set truncating(v) { this._truncating = v; }
  get forgot_control() { return this._forgot_control; }
  set forgot_control(v) { this._forgot_control = v; }

  get closed() { return this._closed; }
  set closed(v) { this._closed = v; }

  get cur() {
    return this._cur;
  }
  set cur(v) {
    this._cur = v;
  }

  get beziers() {
    return this._beziers;
  }
  set beziers(v) {
    this._beziers = v;
  }

  prehistoricBez() {
    //= 史前文明を返す
    return this.beziers.length > 0 ? this.beziers[0] : null;
  }
  
  currentBez() {
    //= 現在文明を返す
    return this.beziers.length > 1 ? this.beziers[1] : null;
  }
  
  futureBez() {
    //= 次期文明を返す
    return this.beziers.length > 2 ? this.beziers[2] : null;
  }
  
  updateBez(bezier, name) {
    //= BezierFrame に Bezier を設定する
    const index = ["prehistoric", "current", "future"].indexOf(name);
    if (index < 0) {
      throw new RangeError("Bezier Name is invalid");
    }
    
    this.beziers[index] = bezier;
  }

  cursorBezier() {
    //= 作成中のベジエ曲線を返す
    const bezier = this.beziers[this.cur];
    const name = ["prehistoric", "current", "future"][this.cur];
    return { bezier, name };
  }  

  goAhead() {
    //= 作成中のベジエ曲線を次に進める
    if (this.cur == null) {
      this.cur = 0;
    } else if (this.cur < 2) {
      this.cur++;
    } else {
      throw new RangeError("BezierFrame is full");
    }

    if (this.beziers.length <= this.cur) {
      throw new RangeError("BezierFrame is empty");
    }
  }

  updateCursorBezier(bezier) {
    //= BezierFrame に Bezier を設定する
    this.beziers[this.cur] = bezier;
  }


  pushBezier(bezier, checkName = null) {
    //= BezierFrame に Bezier を追加する
    //  Parameters:
    //    name: （チェック用）追加する Bezier の名前
    //          "prehistoric", "current", "future"

     if (bezier == null) {
      console.log("#### Waring: pushBezier : bezier is null, do nothing");
      return;
    } 

    if (this.beziers.length > 2) {
      throw new RangeError("BezierFrame is full");
    }
  
    this.beziers.push(bezier);
    this._cur = this.beziers.length - 1;                     // 作成中 Bezier のカーソル
    
    //= チェック
    if (checkName != null) {
      const myBezier = this.cursorBezier();
      if (myBezier.name != checkName) {
        throw new RangeError("BezierFrame name is not matched");
      }
    } else {
      console.log("#### Waring: pushBezier : checkName is null, unchecked");
    }
  }
  
  static makeAndPushBezFrame(context, prehistory, model = 'bezier') {
    //= Bezier-Frame を初期化する
    //  Frame := 
    //           [ 史前文明,        現在文明,       次期文明 ]    ※ length は 3 を超えることがない
    //             prehistoric     current         future 
    //  Parameters:
    //    prehistory: prehistoric civilization（史前文明）Bezier
  
    const { rect, drawingStatRef, b, drawRef } = parseContext(context);
  

    const frame = new BezierFrame(context.forgot_anchor, context.forgot_control);              // !! Bezier-Frame を作成する
  
    if (prehistory === null) {
      prehistory = new Bezier3(false, model);
    }

    frame.pushBezier(prehistory, 'prehistoric');
  
    frame.pushBezier(new Bezier3(false, model), 'current');    // !! 予め入れるように変更した
    frame.pushBezier(new Bezier3(false, model), 'future');     // !! 予め入れるように変更した
  
    b.value.push(frame); 
    drawingStatRef.value.frameCursor = b.value.length - 1;      // 現在のBezier-Frameに指すカーソル
  }


  static curFrame(context) {
    //= 工作中の BezierFrame を返す
    const { rect, drawingStatRef, b, drawRef } = parseContext(context);
  
    return b.value[drawingStatRef.value.frameCursor];
  }



  static makeDraw(context) {
    //= 描画用データを作成する
    // 
    // console.log("::::: BEGIN makeDraw()::::::::::::");
    // dbgPrintContext(context);                                       // デバッグ用  
  
    const { rect, drawingStatRef, b, drawRef } = parseContext(context);
  
    const pk        = [];   // point key, 重複を避けるために使う
    const point     = [];
    const polyline  = [];
    let path        = "";

    for (const [idxFrame, frame] of Object.entries(b.value)) {
      for (const [index, bez] of Object.entries(frame.beziers)) {
        // console.log("idxFrame = " + idxFrame + "index = " + index + ", bez = " + JSON.stringify(bez));
  
        //= points
        bez.mkPoints(pk, point);
       
        //= polyline
        bez.mkPolyline(polyline);
  
        //= path
        //  歴前及び未来の文明は描画しない
        if (index == 1) {
          const pa = bez.mkPathText(path);
          if (pa != "") {
            path += pa;
          }

        }
      }
        
      // console.log("  path = " + path);
    }
  
    drawRef.value = {
        path        : path,
        point       : point,
        polyline    : polyline,
    };
  
    // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    // console.log("drawRef: " + JSON.stringify(drawRef.value.path));
    // console.log(";;;;; END makeDraw();;;;;;;;;;");
  } // end static makeDraw()

} // end class BezierFrame

// ↑↑↑↑ Class 定義 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// ↓↓↓↓ 実処理 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  別ファイルに移動する方が良いかも

function coordinate(context, event) {
  //= Mouse Event から座標を取得する
  //  TODO event type check
  // console.log("$$$$$ coordinate");
  // console.log("  context.rect: " + JSON.stringify(context.rect));   // left: 0, top: 0
  // console.log("  event: " + event);                                 // offsetX Y, clientX Y, ScreenX Y, pageX, Y, x y
  const x = event.offsetX - context.rect.left;
  const y = event.offsetY - context.rect.top;
  return [ x, y ];
}


function parseContext(context) {
  //= context を分解する
  const  { rect, drawingStatRef, b, drawRef } = context;
  return { rect, drawingStatRef, b, drawRef };
}


function resetForgottens(context) {
  //= forgot_anchor, forgot_control 初期化
  console.log('# resetForgottens: initing forgot_control ...')
  context.forgot_anchor = false;
  context.forgot_control = false;
}


function resetPathMaker(context) {  // All 初期化
  //= drawingStatRef を初期化する
  console.log('# resetPathMaker: initing drawingStatRef, b, drawRef ...')
  const { rect, drawingStatRef, b, drawRef } = context;

  drawingStatRef.value = { frameCursor : null, };
  b.value = [];
  drawRef.value = { point : [], polyline : [], path : "" };
  context.forgot_anchor  = true;  // 最初のFrame or Anchers 打ち切り
  context.forgot_control = true;  // 最後のFrame or ControlPoints 打ち切り
}


function dbgPrintContext(context) {
  //= context の内容を表示する
  // const { rect, drawingStatRef, b, drawRef } = parseContext(context);

  // console.log('** rect : ', JSON.stringify(rect));
  // console.log('  drawingStatRef : ', JSON.stringify(drawingStatRef.value));
  // console.log('  b : ', JSON.stringify(b.value));
  // console.log('  drawRef : ', JSON.stringify(drawRef.value));
}


function openBezierFrameV2(context,anX, anY) {  // 参考: openNextFrame
  //= Open a New Frame
  //  1st Frame or 打ち切り、連続描画共に対応版
  console.log('# initBezierFrame: initing drawingStatRef, b, drawRef ...')

  const { rect, drawingStatRef, b, drawRef } = parseContext(context);
  let [f2, v2, ev, ep, ec] = [null, null, null, null, null];

  let prehistory = null;
  let startAnckerOK = false;

  let [x, y] = [anX, anY];  // default

  if (!((context.forgot_anchor) && (context.forgot_control))) {
    //= 1st Frame or 打ち切り以外
    //  forgot_anchor is false, forgot_control is false | true
    //  直前 Frame の End-Control, End-Anchor を取得する
    if (context.forgot_anchor) { throw new Error('openBezierFrameV2: forgot_anchor must be false when forgot_control is false'); }
    
    const f = BezierFrame.curFrame(context);
    const v = f.currentBez();
    const n = f.futureBez();

    ev = v.evaluateBezier();                       // 現在の文明を評価する
    ep = ev.lastAnchor;                            // !! 現在の文明の末端点 !! 
    ec = ev.lastControl;                           // !! 現在の文明の末端点の制御点 !!
    [x, y] = ev.lastAnchor ? [ep.x, ep.y] : [anX, anY];  // !!

    if (!n) { throw new Error('openBezierFrameV2: futureBez must be exist when forgot_control is false'); }

    if (!context.forgot_control) {
      if ((n.start_anchor) && (n.start_control) && ec) {  // !! Mirror 可能な未来の文明 
        //= 直前 Frame に有効な未来の文明がある場合
        // console.log('Mirror: ' + JSON.stringify(n));
        prehistory = n;                             // そのまま史前の文明とする（連続的描画の担保）
        BezierFrame.makeAndPushBezFrame(context, prehistory);

        f2 = BezierFrame.curFrame(context);
        v2 = f2.currentBez();

        //= 1].v.start_anchor === 0].n.end_anchor にすることで、連続性を保つ
        //  TODO Bezier2 対応, LineTo 対応
        v2.start_anchor = ep; // v.end_anchor;
        startAnckerOK = true;

        const x0 = ep["x"];
        const y0 = ep["y"];
      
        const mx = x0 + (x0 - ec["x"]);                          // !! Mirror update 制御点 C2
        const my = y0 + (y0 - ec["y"]);                          // !! TODO Bezier2 対応 動作確認
        v2.start_control = new BezPoint({ x: mx, y: my, anchor : false, "auto" : true, id : uuidv4() });  // 2023.12.13a, add anchor: false 
      } 
    }
  }

  if (!startAnckerOK) {
    if (ep) {
      console.log('No Mirror, ep Bezier3 インスタンスを作成します');
      prehistory = new Bezier3(true);             // 史前の文明
      prehistory.end_anchor = new BezPoint({ x: x, y: y, anchor : true, "auto" : true, id : uuidv4() });  // 2023.12.13a, 両方ともに true の例
      BezierFrame.makeAndPushBezFrame(context, prehistory);
      f2 = BezierFrame.curFrame(context);
      v2 = f2.currentBez();
      v2.start_anchor = ep;
      v2.anchor = true;
      startAnckerOK = true;
    } 
  }

  if (!startAnckerOK) {
    console.log('No Mirror, simple Bezier3 インスタンスを作成します');
    prehistory = new Bezier3(true);             // 史前の文明
    prehistory.end_anchor = new BezPoint({ x: x, y: y, anchor : true, "auto" : true, id : uuidv4() });  // 2023.12.13a, 両方ともに true の例
    BezierFrame.makeAndPushBezFrame(context, prehistory);
    startAnchor(context, x, y);                 // Start Anchor
  }
  
  return([x, y]);
}


function startAnchor(context, x, y) {
  //= 現在の文明 Bezier を作成する
  const { rect, drawingStatRef, b, drawRef } = parseContext(context);
  const f = BezierFrame.curFrame(context);
  const v = f.currentBez()
  v.start_anchor = new BezPoint({ x: x, y: y, anchor : true, id : uuidv4() });
}


function startControling(context, x, y) {                         // ベジェ曲線の start control を設定する
  //= 現在の文明 Bezier の start control を設定する
  const { rect, drawingStatRef, b, drawRef } = parseContext(context);

  const f = BezierFrame.curFrame(context);
  const d = f.prehistoricBez();                                    // !! + 0 史前
  const v = f.currentBez();                                        // !! + 1 現在の文明
  v.start_control = new BezPoint({ x: x, y: y, anchor: false, "auto": false, id : uuidv4() });  // 2023.12.13a, add anchor: false, "auto": false

  const mx = d.end_anchor["x"] + (d.end_anchor["x"] - x);         // Mirror update 制御点 C0
  const my = d.end_anchor["y"] + (d.end_anchor["y"] - y);
  d.end_control = new BezPoint({ x: mx, y: my, anchor: false, "auto": true, id : uuidv4() });   // 2023.12.13a, add anchor: false
}


function endControling(context, x, y) {                           // ベジェ曲線の end control を設定する
  //= 現在の文明 Bezier の end control を設定する
  const { rect, drawingStatRef, b, drawRef } = parseContext(context);

  const f = BezierFrame.curFrame(context);
  const d = f.prehistoricBez();                                    // !! + 0 史前
  const v = f.currentBez();                                        // !! + 1 現在の文明
  v.end_control = new BezPoint({ x: x, y: y, anchor: false, "auto": false, id : uuidv4() });
}


function endAnchoring(context, x, y) {                            // ベジェ曲線の end anchor を設定する
  //= 現在の文明 Bezier の end anchor を設定する
  const { rect, drawingStatRef, b, drawRef } = parseContext(context);

  const f = BezierFrame.curFrame(context);
  const d = f.prehistoricBez();                                    // !! + 0 史前
  const v = f.currentBez();                                        // !! + 1 現在の文明
  v.end_anchor = new BezPoint({ x: x, y: y, anchor : true, id : uuidv4() });
  
  const n = f.futureBez();                                         // 2 未来
  n.start_anchor = new BezPoint({ x: x, y: y, anchor : true, id : uuidv4() });
  const mx = x + (x - v.end_control["x"]);                        // Mirror update 制御点 C1
  const my = y + (y - v.end_control["y"]);                        //
  n.start_control = new BezPoint({ x: mx, y: my, anchor : false, "auto": true, id : uuidv4() });  // 2023.12.13a, add anchor: false
}


function closeFrame(context) {                                     // フレームを閉じる
  console.log('# closeFrame: do nothing');
  const { rect, drawingStatRef, b, drawRef } = parseContext(context);

  resetForgottens(context);

  const f = BezierFrame.curFrame(context);
  const d = f.prehistoricBez();                                    // !! + 0 史前
  const v = f.currentBez();                                        // !! + 1 現在の文明
  const n = f.futureBez();                                         // !! + 2 未来

  // const curBez = f.cursorBezier(); 
  // if (curBez.name === 'prehistoric') {                            // cursor が史前の末端点にある場合
  //     console.log("coreForget : cursor is prehistoric");
  //     d.forgot_control = true;                                         // 史前のベジエ曲線を打ち切るフラグ
  //     return;
  // } else if (curBez.name === 'current') {                         // cursor が現在の文明の末端点にある場合
  //     v.truncating = true;                                        // ベジエ曲線を打ち切るフラグ
  //     console.log("coreForget : cursor is current");                 
  // } else if (curBez.name === 'future') {                          // cursor が未来の先端点にある場合                                                          
  //     n.forgot_control = true;                                         //    ベジエ曲線を打ち切るフラグ
  //     console.log("coreForget : cursor is future");
  // }

  f.closed = true;                                                // フレームを閉じる
}


function openLineToFrame(context, x, y) {
  //= 次の LineTo フレームを開く
  //  前提条件: 工作中のフレームは末端点があること
  console.log("# openLineToFrame: x = " + x + " y = " + y);

  const { rect, drawingStatRef, b, drawRef } = parseContext(context);
  const f = BezierFrame.curFrame(context);
  const v = f.currentBez();

  if (context.forgot_anchor || context.forgot_control) {
    throw new Error("openLineToFrame: Unsupported true of forgot_anchor or forgot_control");  // ↓ 未実装
  }

  const ev = v.evaluateBezier();                  // 現在の文明を評価する
  const ep = ev.lastAnchor;                        // 現在の文明の末端点
  const prehistory = new Bezier3(true, 'lineto');           //   から新しい史前の文明を生成する
  prehistory.end_anchor = new BezPoint({ x: ep.x, y: ep.y, anchor : true, "auto" : true, id : uuidv4() });  // 2023.12.13a, 両方ともに true の例

  BezierFrame.makeAndPushBezFrame(context, prehistory, 'lineto');  // LineTo を生成する: 史前文明 prehistory は不要ですが、コードの整合性を保つために生成する
   const f2 = BezierFrame.curFrame(context);    
   const v2 = f2.currentBez();
   v2.start_anchor = prehistory.end_anchor;       // !! 1].v.start_anchor === 0].n.ep にすることで、連続性を保つ
   v2.line_end_anchor = new BezPoint({ x: x, y: y, anchor : true, id : uuidv4() });
 }


function lineToing(context, x, y) {                           // LineTo を描画する
  //= 現在の文明 に LineTo を作成する
  console.log("## lineToing: x = " + x + " y = " + y);
  const { rect, drawingStatRef, b, drawRef } = parseContext(context);

  const f = BezierFrame.curFrame(context);
  const v = f.currentBez();                                 // 現在の文明 Bezier

  //= v.line_end_anchor = new BezPoint({ x: x, y: y, anchor : true, id : uuidv4() });
  v.line_end_anchor.x = x;
  v.line_end_anchor.y = y;
}


function moveTo(context, x, y) {                              // MoveTo を描画する
  //= TODO 現在の文明 に MoveTo を作成する
  //  検討: 既存の文明を忘れるかどうか
  console.log("## moveTo: x = " + x + " y = " + y);
  const { rect, drawingStatRef, b, drawRef } = parseContext(context);
}


function moveCurToNextBezier(context, x, y) {                    // 次の文明へ遷移する
  const { rect, drawingStatRef, b, drawRef } = parseContext(context);

  const f = BezierFrame.curFrame(context);
  f.goAhead();
}



//= 参考: context b サンプルデータ
// b.value = [
//   {                                      ※ frame 
//     "_forgot_anchor": false,
//     "_forgot_control": false,
//     "_closed": true,
//     "_cur": 2,
//     "_beziers": [                        ※ beziers := Bezier3[]
//       {                                  ※ bez := Bezier3
//         "_model": "bezier",
//         "_kind": null,
//         "_absolute": true,
//         "_start_anchor": null,
//         "_start_control": null,
//         "_end_control": {
//           "_dom": null,
//           "_id": "0d7c7a91-419b-4081-96e4-2d592593e04d",
//           "_x": 45,
//           "_y": 444,
//           "_anchor": true,
//           "_auto": true
//         },
//         "_end_anchor": {
//           "_dom": null,
//           "_id": "6a725d00-7192-4776-8497-125e5126e57b",
//           "_x": 107,
//           "_y": 299,
//           "_anchor": true,
//           "_auto": true
//         }
//       },
//       {
//         "_model": "bezier",
//         "_kind": null,
//         "_absolute": true,
//         "_start_anchor": {
//           "_dom": null,
//           "_id": "865185ca-9a62-40d6-a41e-e9fb559c2157",
//           "_x": 107,
//           "_y": 299,
//           "_anchor": true,
//           "_auto": false
//         },
//         "_start_control": {
//           "_dom": null,
//           "_id": "cf77283a-a956-48e1-89e2-7d14025f3436",
//           "_x": 169,
//           "_y": 154,
//           "_anchor": true,
//           "_auto": false
//         },
//         "_end_control": {
//           "_dom": null,
//           "_id": "e10efdd0-020a-4b6e-923d-f768c4830f5b",
//           "_x": 216,
//           "_y": 400,
//           "_anchor": true,
//           "_auto": false
//         },
//         "_end_anchor": {
//           "_dom": null,
//           "_id": "c5604557-4bd3-49fc-ae22-b61eec379e48",
//           "_x": 276,
//           "_y": 268,
//           "_anchor": true,
//           "_auto": false
//         }
//       },
//       {
//         "_model": "bezier",
//         "_kind": null,
//         "_absolute": true,
//         "_start_anchor": {
//           "_dom": null,
//           "_id": "fe5b6713-5250-48c5-8117-b98e3179f2d9",
//           "_x": 276,
//           "_y": 268,
//           "_anchor": true,
//           "_auto": false
//         },
//         "_start_control": {
//           "_dom": null,
//           "_id": "e8b38d32-46fc-4adc-a6c6-723ba9fb01da",
//           "_x": 336,
//           "_y": 136,
//           "_anchor": true,
//           "_auto": true
//         },
//         "_end_control": null,
//         "_end_anchor": null
//       }
//     ]
//   },
//   {
//=


//= 参考: context drawRef サンプルデータ
// drawRef.value = {
//   "path": "M107,299 C169,154 216,400 276,268 M276,268 L276,268 ",
//   "point": [
//     {
//       "_dom": null,
//       "_id": "0d7c7a91-419b-4081-96e4-2d592593e04d",
//       "_x": 45,
//       "_y": 444,
//       "_anchor": true,
//       "_auto": true
//     },
//     {
//       "_dom": null,
//       "_id": "6a725d00-7192-4776-8497-125e5126e57b",
//       "_x": 107,
//       "_y": 299,
//       "_anchor": true,
//       "_auto": true
//     },
//     {
//       "_dom": null,
//       "_id": "e879d860-2189-443c-9107-54898094d93d",
//       "_x": 276,
//       "_y": 268,
//       "_anchor": true,
//       "_auto": false
//     }
//   ],
//   "polyline": [
//     {
//       "points": [
//         {
//           "_dom": null,
//           "_id": "0d7c7a91-419b-4081-96e4-2d592593e04d",
//           "_x": 45,
//           "_y": 444,
//           "_anchor": true,
//           "_auto": true
//         },
//         {
//           "_dom": null,
//           "_id": "6a725d00-7192-4776-8497-125e5126e57b",
//           "_x": 107,
//           "_y": 299,
//           "_anchor": true,
//           "_auto": true
//         }
//       ],
//       "id": "32300006-23d0-4064-9904-e8de5c748446"
//     },
//=



function findPoint(
  drawRef,  // ↑ サンプルデータ参考
  item_id   // ↑ サンプルデータ point._id に該当する
) {
  //= drawRef.value.point[]  の中から、指定された座標の点を探す

  console.log("## findPoint: item_id = " + item_id);

  let point = null;

  for (const [idx, p] of Object.entries(drawRef.value.point)) {
    if (p.id == item_id) {
      point = p;
      break;
    }
  }

  return point;
} 


function updatePointXYfromB(
  b,      // ↑ サンプルデータ参考
  x, y,   // 新しい座標
  item_id // ↑ サンプルデータ point._id に該当する
) {
  //= UI 入力 bezier データ ref b の value を修正する（座標の移動を元データ ref b の value に反映させる）
  //  ※ 更新される対象は、（context b サンプルデータ参考）point ある _start_anchor, _end_anchor, _start_control, _end_control の全ての内、
  //     _id が item_id と一致するもの
  //=
  
  console.log("## updatePointXYfromB: x = " + x + " y = " + y + " item_id = " + item_id);

  let beziers;
  let foundCount = 0;

  // b.value frames : [] loop
  for (const [idxFrame, frame] of Object.entries(b.value)) {
    beziers = frame.beziers;

    // frame.beziers : [] loop
    for (const [index, bez] of Object.entries(beziers)) {

      // bez : {} key loop
      for (const [key, p] of Object.entries(bez)) {

        // 念のため、key in ["_start_anchor", "_end_anchor", "_start_control", "_end_control"] だけに絞る
        if (!["_start_anchor", "_end_anchor", "_start_control", "_end_control"].includes(key)) {
          continue;
        }

        if(p == null) {   // null もある
          continue;
        }

        if (p._id == item_id) {
          p.x = x;  // Class の instance であるため、setter が使える（サンプルデータの _ は不要）　
          p.y = y;
          foundCount ++;
          
          // biz を跨ることがある（連続描画の時）、なので、ここでは break しない
        }
      } // end bez : {} key loop

      // 一つの point は、一つの beziers : [] に属する。
      // なので、一致した時点で、ここで break して良さそう。
      // が、将来的に、機能の追加に伴い、一つの point が複数の beziers : [] に属することがあるかもしれない。
      // ⇒ ここでは break しないようにする
      // break;

    } // end frame.beziers : [] loop
  } // end b.value frames : [] loop

  return foundCount;
}


function dragPoint(     // drag by Moveable された点を移動する
  context,
  x, y,                 // 移動先の座標
  item_id               // drawRef.value.point[] の要素, item.id で識別されている、item.x y は移動前の座標である
)
{
  //=
  //  ※ point の種類によって、適用の処理も異なるかもしれない
  //=
  console.log("## dragPoint: x = " + x + " y = " + y + " item_id = " + item_id);

  const { rect, drawingStatRef, b, drawRef } = parseContext(context);

  console.log("  before drawRef.value = " + JSON.stringify(drawRef.value, null, 2));

  //= 1) drawRef.value.point[] の要素を探す
  const point = findPoint(drawRef, item_id);
  console.log("  found point = " + JSON.stringify(point, null, 2));

  console.assert(point != null, "dragPoint: point is null");

  //= 2) UI 入力 bezier データ ref b の value を修正する（座標の移動を元データ ref b の value に反映させる）
  console.log("  before b.value = " + JSON.stringify(b.value, null, 2));
  const foundCount = updatePointXYfromB(b, x, y, item_id);

  // do some check
  console.assert(foundCount > 0, "updatePointXYfromB: point not found");
  
  if (foundCount == 0) {
    console.log("#### Waring: dragPoint: point not found in b.value");
  } else if (foundCount > 1) {
    console.log("#### Waring: dragPoint: point found more than 1 in b.value");
    console.log("  after  b.value = " + JSON.stringify(b.value, null, 2));
  }

  //= makeDraw() を呼び出して、drawRef の value を作り直す 
  //  呼出し元 pa_applyPointDraged に行われているため、不要
  //=

  // BezierFrame.makeDraw(context);
  return foundCount;  // 0 なら、何もしなくて良い
}


function applyCoreDataLoaded(
  context,
  coreDataEv   // {type: 'CORE_DATA_LOADED', core_data: _}
)
{
  //= [in] core_data
  //  1) .b            : ⇒ b               := BezierFrame[], UI 入力 bezier データ
  //  2) .drawing_stat : ⇒ drawingStatRef  := { frameCursor : null, }
  //  3) .draw         : ⇒ drawRef         := 描画用データ { パス path: "", 点 point: [], 制御線 polyline: [] }
  //=
  const core_data = coreDataEv.core_data;
  console.log("## applyCoreDataLoaded: core_data = " + JSON.stringify(core_data, null, 2));

  //= 1) .b : ⇒ b := BezierFrame[], UI 入力 bezier データ 
  let inBfList, inBezList, inPt;
  let bezier3, bezierframe;
  let pt;               // BezPoint
  const bf = [];      // BezierFrame[]

  inBfList = core_data.b;
  for (const [i, in_fr] of Object.entries(inBfList)) {
    const bezList = [];   // Bezier3[]

    inBezList = in_fr._beziers;   // !!
    for (const [j, in_bz] of Object.entries(inBezList)) {
      //= bezier3 = new Bezier3(beziers._model, beziers._kind, beziers._absolute, beziers._start_anchor, beziers._start_control, beziers._end_control, beziers._end_anchor);
      bezier3 = new Bezier3(false, in_bz._model);
      bezier3.absolute = in_bz._absolute;
      bezier3._kind = in_bz._kind;

      for (const key of ["start_anchor", "start_control", "end_control", "end_anchor"]) {
        if (in_bz[`_${key}`] != null) {
          inPt = in_bz[`_${key}`];
          pt = new BezPoint({ x: inPt._x, y: inPt._y, anchor: inPt._anchor, auto: inPt._auto, id: inPt._id })
          pt.dom = inPt._dom;
          bezier3[key] = pt;
        } else {
          bezier3[key] = null;
        }
      }

      bezList.push(bezier3);
    }

    bezierframe = new BezierFrame(false, false);
    bezierframe.closed = in_fr._closed;
    bezierframe.cur = in_fr._cur;
    bezierframe.beziers = bezList;

    bf.push(bezierframe);
  }

  console.log("  bf = " + JSON.stringify(bf, null, 2));
  context.b.value = bf;

  //= 2) .drawing_stat : ⇒ drawingStatRef  := { frameCursor : null, }
  context.drawingStatRef.value = core_data.drawing_stat;

  //= 3) .draw : ⇒ drawRef := 描画用データ { パス path: "", 点 point: [], 制御線 polyline: [] }
  //  makeDraw() を呼び出して、drawRef の value を作り直す 
  //  呼出し元 pa_applyPointDraged に行われているため、不要
}
  

// ↑↑↑↑ 実処理 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

