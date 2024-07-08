
import { ref } from 'vue'
import { createMachine } from 'xstate';
import { v4 as uuidv4  } from 'uuid';

const fc = require('fit-curve');  // npm install fit-curve

//= マウスの状態を追跡する
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


//= Path 描画機能
// TODO 
//  1. キーイベントの拡張
//  2. 履歴（遡る）機能
//=
const makePathConfig = {
  initial: 'pa_null',
  states: {
    pa_null: {
      on: { 
        INIT: {                                       // !! All 初期化, 最初だけではなく、途中で初期化コマンドが来るかも
          target : 'pa_empty',                        // 
          actions: [ 'pa_resetPathMaker' ],           // !! All 初期化処理
        }, 
      },
    },
    pa_empty: {                                       // !! WAITING for mousedown  
      entry: [ ],                                     //  Do Nothing
      exit:  [ ],                                     //  Do Nothing
      on: { 
        mousedown: { 
          target : 'make_curve',
          actions: ['pa_initCurve'],                  // !! b を初期化し, 最初の point を push する
        },
        mouseup: {
          // 無視
        },
        mousemove: {
          // 無視
        },
      },
    },
    make_curve: {                                     // mousedown -ing
      on: {
        mousemove: {
          target : 'make_curve',
          actions: ['pa_makeingCurve'],               // !! point を push する
          cond: 'being_mos_down',                     // !! guard
        },
        mouseup: { 
          target : 'pa_empty',
          actions: ['pa_fitCurve'],                   // 
        },
      },
    },

    // stop: {  // *
    //   type: 'final',          // TODO
    // },

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


//= FSM-Machine Entry
//
const svgPathConfig = {   // root config of states
  id:   'svgpath',
  type: 'parallel',               // Parallel State Nodes; https://xstate.js.org/docs/guides/parallel.html
  predictableActionArguments: true,

  context: {
    mouse: null,                  // mouse state := downing | uping ※初期化対象外

    rect: null,                   // SVG bound client rect ※初期化対象外
    
    fsmDrawRef: ref({             // 
      //= a) free-draw input, fit-curve buffer 
      cur   : null,               //    ↓ the current instance of class CurveFrame
      curves: [],                 //    【coreDataEv】CurveFrame []

      //= b) svgPathMachine.js と共通の部: 描画用 ベジエ曲線 データ: pk[], point[], polyline[], path[]
      //  ↑ a) から生成されるものであり、描画専用で Readonly にすべきなので、ここでは定義しない、EditSvgFitCurve.vue で定義する
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
      console.log('* being_mos_down');
      context.mouse = 'downing';
    },
    set_mouse_uping: (context, event) => {
      console.log('* being_mos_up');
      context.mouse = 'uping';
    },
    set_mouse_nulling: (context, event) => {
      console.log('* mos_nulling');
      context.mouse = null;
    },
    updateRect: (context, event) => {
      const rect = event.value.rect;
      console.log('* updateRect : ', JSON.stringify(rect));
      context.rect = rect;
      // dbgPrintContext(context);
    },


    pa_resetPathMaker: (context, event) => {    // All 初期化処理
      console.log('* pa_resetPathMaker');
      resetPathMaker(context);
    },

    pa_initCurve: (context, event) => {         // b を初期化し, 最初の point を push する
      console.log('* pa_initCurve');
      CurveFrame.newCurve(context, event);
      CurveFrame.appendPoint(context, event);
      // dbgPrintContext(context);
    },

    pa_makeingCurve: (context, event) => {       // point を push する
      // console.log('* pa_makeingCurve');
      CurveFrame.appendPoint(context, event);
      // dbgPrintContext(context);
    },
  
    pa_fitCurve: (context, event) => {            // point を push する
      console.log('* pa_fitCurve');
      CurveFrame.fitCurve(context, event);
      // dbgPrintContext(context);
    },
  
    pa_applyPointDraged: (context, ev) => {
      console.log('* pa_applyPointDraged');
      console.log('  ev : ', JSON.stringify(ev, null, 2));
      dragPoint(context, ev["x"], ev["y"], ev["item_id"]);
      // dbgPrintContext(context);
    },
    
    pa_applyCoreDataLoaded: (context, ev) => {
      console.log('* pa_applyCoreDataLoaded');
      console.log('  ev : ', JSON.stringify(ev, null, 2));
      applyCoreDataLoaded(context, ev);
      // dbgPrintContext(context);
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


export const svgFitCurveMachine = createMachine(svgPathConfig, svgPathOptions);


// ↓↓↓↓ Class 定義 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class BezPoint {   // ベジエ曲線の点
  constructor({x, y, anchor = true, auto = false, id = uuidv4()}) {
    this._id = id;
    this._x  = x;
    this._y  = y;
    this._anchor = anchor;    // 点の種類, true ならアンカー false ならコントロール
    this._auto   = auto;      // 自動生成された点かどうか

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


class Bezier3 {     // ベジエ曲線 枠組 (template) 
  constructor(forgot_anchor = false, model = 'bezier') {
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
    let cnt = 0;
    if (this.start_anchor != null && this.start_control != null) {
      polyline.push({ points : [ this.start_anchor, this.start_control ], id : uuidv4() });
      cnt++;
    }

    if (this.end_control != null && this.end_anchor != null) {
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

    if (!this.start_anchor == null) {  // ev.curve is 0, ありえない
      return "";
    }

    // console.log("mkPathText Bezier3: " + JSON.stringify(this, null, 2));

    let path = "M" + this.start_anchor["x"] + "," + this.start_anchor["y"] + " ";  // MoveTo point A

    if (ev.curve == 1) { 
      console.log("@@@@@ mkPathText: LineTo point AB");
    }

    switch (ev.curve) {
      case 0: break;    // MoveTo point A
      case 1: path += "L" + this.line_end_anchor["x"] + "," + this.line_end_anchor["y"] + " "; break;  // LineTo point B
      case 2: path += "Q" + this.start_control  ["x"] + "," + this.start_control  ["y"] + " " + this.biz2_end_anchor["x"] + "," + this.biz2_end_anchor["y"] + " "; break;  // Quadratic Bézier Curve point C
      case 3: path += "C" + this.start_control  ["x"] + "," + this.start_control  ["y"] + " " + this.end_control    ["x"] + "," + this.end_control    ["y"] + " " + this.end_anchor["x"] + "," + this.end_anchor["y"] + " "; break;  // Cubic Bézier Curve point D
      default: break;
    }

    if (ev.curve == 1) { 
      console.log("  ---> mkPathText: path = " + path);
    }

    return path;
  }

}  // end class Bezier3


class CurveFrame {
  constructor() {
    // this._closed = false;    // 閉じているかどうか, Debug 用
    this._curve = {
      uuid : uuidv4() ,         // 
      state: 'makeing',         // 'makeing' | 'fited'
                                // 1) Input of Free-Hand-Draw 
      point : [],               //    連続的 points
      
                                // 2) Bezier3 Fit 整形
      beziers : [],             //    Bezier3[]
      
                                // 3) 出力
      path         : '',        //    入力・Fit 整形時の出力: パス, 例: "M 25 25 C 25 25 25 25 25 25"
      pk           : [],        //    整形時の出力: ↓point の key, 重複を避けるために使う
      bez_point    : [],        //    整形時の出力: 点, 例: { "x": 25,  "y": 25, id : "b1", anchor : false, "auto" : false },
      bez_polyline : [],        //    整形時の出力: 制御線, 例: [ { points : [ { "x": 25,  "y": 25 }, { "x": 25,  "y": 25 } ], id : "ab" }
    }
  }

  // get closed() { return this._closed; }
  // set closed(v) { this._closed = v; }

  get curve() {
    return this._curve;
  }

  set curve(v) {
    this._curve = v;
  }


  static newCurve(context, event) {
    const b = new CurveFrame();
    const fsmDrawRef = context.fsmDrawRef;
    fsmDrawRef.value.curves.push(b);
    fsmDrawRef.value.cur = b;
  }


  static appendPoint(context, event) {
    const [x, y] = coordinate(context, event);
    const fsmDrawRef = context.fsmDrawRef;
    const b = fsmDrawRef.value.cur;
    b.curve.point.push( [ x, y ] );

    if (b.curve.point.length === 1) {
      b.curve.path = `M${x},${y}`;
    } else {
      const path = b.curve.path;
      b.curve.path = `${path} L${x},${y}`
    }
    // console.log('** appendPoint path = ' + b.curve.path);
  }


  static fitCurve(context, event) {
    console.log('** fitCurve');

    const fsmDrawRef = context.fsmDrawRef;
    const b = fsmDrawRef.value.cur;     // the current instance of class CurveFrame
    const points = b.curve.point;       // その Input of Free-Hand-Draw 連続的 points

    let error = 50;                     // The smaller the number - the much closer spline should be

    // bezierCurves[0] === [[0, 0], [20.27317402, 20.27317402], [-1.24665147, 0], [20, 0]]
    // where each element is [x, y] and elements are [first-point, control-point-1, control-point-2, second-point]  
    let bezierCurves = fc(points, error);
    // console.log('   bezierCurves = ' + JSON.stringify(bezierCurves, null, 2));

    const curve = b.curve;

    //= CurveFrame.curve.beziers - Bezier3[] を作る
    curve.beziers = [];
    for (const [index, bez] of Object.entries(bezierCurves)) {
      const bezier = new Bezier3();
      bezier.model = 'bezier';
      bezier.kind  = '3';
      bezier.start_anchor   = new BezPoint({ x : bez[0][0], y : bez[0][1] });
      bezier.start_control  = new BezPoint({ x : bez[1][0], y : bez[1][1] });
      bezier.end_control    = new BezPoint({ x : bez[2][0], y : bez[2][1] });
      bezier.end_anchor     = new BezPoint({ x : bez[3][0], y : bez[3][1] });
      curve.beziers.push(bezier);
    }

    curve.path          = '';   // 初期化
    curve.pk            = [];
    curve.bez_point     = [];
    curve.bez_polyline  = [];
    
    curve.state = 'fited';
    
    // for each bezier in beziers make curve.path, curve.bez_point and curve.bez_polyline
    for (const [index, bez] of Object.entries(curve.beziers)) {
      const path = bez.mkPathText();
      if (path != "") {
        curve.path += " ";
        curve.path += path;
      }
      curve.bez_point.push   ( bez.mkPoints  (curve.pk, curve.bez_point) );
      curve.bez_polyline.push( bez.mkPolyline(curve.bez_polyline)        );
    }

    // console.log("  path: " + curve.path);
    // console.log("  bez_point: " + JSON.stringify(curve.bez_point));
    // console.log("  bez_polyline: " + JSON.stringify(curve.bez_polyline));

    // //= fsmDrawRef.pk point polyline path を作成する
    // //  現状、未使用なので、コメントアウトした 参考: EditSvgFitCurve.vue svgFitCurveService.onTransition((state) => {
    // fsmDrawRef.value.path.push({ path: curve.path, id: curve.uuid });
    // fsmDrawRef.value.pk.concat(curve.pk);
    // fsmDrawRef.value.point.concat(curve.bez_point);
    // fsmDrawRef.value.polyline.concat(curve.bez_polyline);

  }

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
  const  { rect, drawingStatRef, b, fsmDrawRef } = context;
  return { rect, drawingStatRef, b, fsmDrawRef };
}


function resetForgottens(context) {
  //= forgot_anchor, forgot_control 初期化
  console.log('# resetForgottens: initing forgot_control ...')
  context.forgot_anchor = false;
  context.forgot_control = false;
}


function resetPathMaker(context) {  // All 初期化
  //= drawingStatRef を初期化する
  console.log('# resetPathMaker: initing fsmDrawRef ...')
  const fsmDrawRef = context.fsmDrawRef;
  fsmDrawRef.value.cur = null;
  fsmDrawRef.value.curves = [ ];
}

function dbgPrintContext(context) {
  //= context の内容を表示する
  const { rect, fsmDrawRef } = parseContext(context);

  console.log('** rect : ', JSON.stringify(rect));
  console.log('  fsmDrawRef : ', JSON.stringify(fsmDrawRef.value));
}


//= 参考: context fsmDrawRef サンプルデータ  ※ EditSvgFitCurve.vue :: fsmDrawRef と全く異なるもの
//  ※ fsmDrawRef.value.curves[] は、BezierFrame[]
//
// svgFitCurveMachine.js:700   before fsmDrawRef.value = {
//   "cur": {
//     "_curve": {
//       "uuid": "84b2b6b8-65e1-4fb3-8278-8976b8967db2",
//       "state": "fited",
//       "point": [
//         [
//           180,
//           226
//         ]
//       ],
//       "beziers": [],
//       "path": "",
//       "pk": [],
//       "bez_point": [],
//       "bez_polyline": []
//     }
//   },
//
//   "curves": [      ※ CurveFrame[]
//     {              ※ CurveFrame
//       "_curve": {
//         "uuid": "00ca4cc5-a214-4ec0-9526-342428c61239",
//         "state": "fited",
//         "point": [
//           [
//             104,
//             368
//           ]
//         ],
//         "beziers": [],
//         "path": "",
//         "pk": [],
//         "bez_point": [],
//         "bez_polyline": []
//       }
//     },
//
//     {
//       "_curve": {
//         "uuid": "c76f3221-2499-4fd6-9668-3eb9db92cdd5",
//         "state": "fited",
//         "point": [
//           [
//             88,
//             333
//           ],
//           ...
//           [
//             380,
//             343
//           ]
//         ],
//         "beziers": [
//           {
//             "_model": "bezier",
//             "_kind": "3",
//             "_absolute": true,
//             "_start_anchor": {
//               "_id": "3019f5f8-a964-4e93-b3bc-bb06fcb84414",
//               "_x": 88,
//               "_y": 333,
//               "_anchor": true,
//               "_auto": false
//             },
//             "_start_control": {
//               "_id": "bfb25cbe-82c1-42a5-b907-8e754e739bf8",
//               "_x": 88,
//               "_y": 312.13423395192643,
//               "_anchor": true,
//               "_auto": false
//             },
//             "_end_control": {
//               "_id": "b1bc7801-7e1d-47a5-a9f0-3beec74c5d02",
//               "_x": 145.943560600247,
//               "_y": 195.943560600247,
//               "_anchor": true,
//               "_auto": false
//             },
//             "_end_anchor": {
//               "_id": "975142f8-537d-4882-8677-2cef93f5071f",
//               "_x": 181,
//               "_y": 231,
//               "_anchor": true,
//               "_auto": false
//             }
//           },
//           ...
//         ],
//         "path": " M88,333 C88,312.13423395192643 145.943560600247,195.943560600247 181,231  M181,231 C227.59193196728577,277.59193196728575 202.89267496306604,393.89267496306604 248,439  M248,439 C283.05855692349616,474.05855692349616 380,362.6380455078274 380,343 ",
//         "pk": [
//           "3019f5f8-a964-4e93-b3bc-bb06fcb84414",
//         ],
//         "bez_point": [
//           {
//             "_id": "3019f5f8-a964-4e93-b3bc-bb06fcb84414",
//             "_x": 88,
//             "_y": 333,
//             "_anchor": true,
//             "_auto": false
//           },
//           ...
//           {
//             "_id": "94c9af5a-ca9d-4b5f-afde-ae80e26f5cba",
//             "_x": 380,
//             "_y": 343,
//             "_anchor": true,
//             "_auto": false
//           },
//           4
//         ],
//         "bez_polyline": [
//           {
//             "points": [
//               {
//                 "_id": "2892a12f-50d1-4cb0-8c9d-9bbde3a49713",
//                 "_x": 380,
//                 "_y": 362.6380455078274,
//                 "_anchor": true,
//                 "_auto": false
//               },
//               {
//                 "_id": "94c9af5a-ca9d-4b5f-afde-ae80e26f5cba",
//                 "_x": 380,
//                 "_y": 343,
//                 "_anchor": true,
//                 "_auto": false
//               }
//             ],
//             "id": "8f1f63f1-5b14-4170-9b75-6ce3d738c588"
//           },
//           2
//         ]
//       }
//     },
//     ...
//   ]
// }

//= 



function dragPoint(     // drag by Moveable された点を移動する
  context,
  x, y,                 // 移動先の座標
  item_id               // fsmDrawRef.value.point[] の要素, item.id で識別されている、item.x y は移動前の座標である
)
{
  //= お試し 2023.12.05 ※ 使うものになっていないため、リリース禁止
  //  ※ point の種類によって、適用の処理も異なるかもしれない
  //=
  console.warn("## dragPoint: お試す 2023.12.05 ※ 使うものになっていないため、リリース禁止");

  console.log("## dragPoint: x = " + x + " y = " + y + " item_id = " + item_id);

  const { rect, fsmDrawRef } = parseContext(context);

  console.log("  before fsmDrawRef.value = " + JSON.stringify(fsmDrawRef.value, null, 2));  // !! DEBUG

  let innerCurve;    // { 1) point[], 2) beziers[], 3) path[], pk[], bez_point[], bez_polyline[] }


  const curves = fsmDrawRef.value.curves;                     // curves := CurveFrame[]
  for (const [index, curve] of Object.entries(curves)) {      // curve := CurveFrame
    innerCurve = curve.curve;

    //= 検討
    // 1) point[x, y]（fit-Curve 前の入力連続点）に id がなく、update  出来ない
    //      ⇒ そこまで対応したいのであれば、UI 側で、point を Moveable drag の対象にする必要がある
    //=

    //= 2) beziers[] を update する
    const beziers = innerCurve.beziers;                       // beziers := Bezier3[]
    for (const [index, bezier] of Object.entries(beziers)) {  // bezier := Bezier3
      // console.log("  bezier = " + JSON.stringify(bezier, null, 2));  // !! DEBUG
      const points = [ bezier.start_anchor, bezier.start_control, bezier.end_control, bezier.end_anchor ];
      for (const [index, point] of Object.entries(points)) {
        if (point.id == item_id) {
          point.x = x;
          point.y = y;
        }
      }
      
      //= 【仮】2-1) bezier.path を update する
      // innerCurve.path = bezier.mkPathText();

    } // rof Bezier3[]

  } // rof CurveFrame[]
}





function applyCoreDataLoaded(
  context,
  coreDataEv   // {type: 'CORE_DATA_LOADED', core_data: _}
) {
  //= [in] core_data
  //  1) .cur             : ⇒ context.fsmDrawRef.cur          := ↓ the current instance of class CurveFrame
  //  2) .beziers         : ⇒ context.fsmDrawRef.curves[]     := 【coreDataEv】CurveFrame []
  //=
  const core_data = coreDataEv.core_data;
  console.log("## applyCoreDataLoaded: core_data = " + JSON.stringify(core_data, null, 2));

  let inFr, curveFr, b;

  const fsmDrawRef = context.fsmDrawRef;

  //= 1) .cur : ⇒ fsmDrawRef.value.cur := the current instance of class CurveFrame
  //  不要
  //=

  //= 2) .beziers : ⇒ fsmDrawRef.value.curves[] := CurveFrame []
  //  fitCurve() 関数をそのまま使っています
  //=
  const in_curves = core_data["curves"];

  fsmDrawRef.value.curves = [];                               // .curves[] を初期化する                    

  for (const [i, in_curveFr] of Object.entries(in_curves)) {
    fsmDrawRef.value.cur = make_curve_frame(in_curveFr);      // .cur 工作領域を作る
    
    CurveFrame.fitCurve(context, event);                      // .cur 工作領域を整形する

    b = fsmDrawRef.value.cur; 
    console.log("  $$$$ push to context.fsmDrawRef.value.curves:\n " + JSON.stringify(curveFr, null, 2));  // !! DEBUG
    fsmDrawRef.value.curves.push(b);
  }
}


const make_curve_frame = (in_curveFr) => {
  //= CurveFrame 作成
  // [in ] in_curveFr := raw data
  // [out] curveFr    := class CurveFrame
  //=
  let curveFr;

  const in_curve = in_curveFr["_curve"];
  curveFr = new CurveFrame();

  const curve = {};

  curve.uuid  = in_curve["uuid"];
  curve.state = in_curve["state"];

  //= 1) Input of Free-Hand-Draw
  curve.point = in_curve["point"];    // 連続的 points

  curveFr.curve = in_curve;

  // console.log("  curveFr = " + JSON.stringify(curveFr, null, 2));  // !! DEBUG
  return curveFr;
}

// ↑↑↑↑ 実処理 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

