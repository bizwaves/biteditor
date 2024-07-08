
import { createMachine } from 'xstate';

//= 
// 旧 isDevModeRef, 開発中かどうかの状態を保持する
//  
// 
//=
const developConfig = {   // develop | release
  initial: 'develop',
  states: {
    develop: {
      on: {
        DISABLE_DEVELOP: { target: 'release' },
      },
    },
    release: {
      on: {
        ENABLE_DEVELOP: { target: 'develop' },
      }
    },
  }
};

//= 
// 旧 isPreviewModeRef プレビュー中か編集中か状態を保持する
// 
// 
//=
const operatingConfig = {  // edit | preview
  initial: 'edit',
  states: {
    edit: {
      on: {
        SW_TO_PREVIEW: { target: 'preview' },
      },
    },
    preview: {
      on: {
        SW_TO_EDITMODE: { target: 'edit' },
      }
    },
  }
};

//= 
// 何をしているかの状態を保持する
//  参照: editingObjRef
//  当面、こっちは種類を保持するだけで、editingObjRef は編集中のオブジェクトを保持する
//  次期バージョンでは、こっちも編集中のオブジェクトを保持するようにする方が良いかも
//=
const editingConfig = {
  initial: 'editing_html',
  states: {
    editing_null: {
      on: {
        SW_TO_EDITING_SVG: {
          target: 'editing_svg',
          actions: ['setEditingSvg'],
        },
        SW_TO_EDITING_HTML: {
          target: 'editing_html',
          actions: ['setEditingHtml'],
        },
      }
    },
    editing_html: {
      on: {
        SW_TO_EDITING_SVG: { 
          target: 'editing_svg',
          actions: ['setEditingSvg'], },
      },
    },
    editing_svg: {
      states: {
        editingPath: {
          states: {
            creatingPath: {
            },
            modingPathPoint: {
            },
          },
        },
        editingText: {
        },
        editingImage: {
        },
        editingRect: {
        },
        editingCircle: {
        },
        editingEllipse: {
        },
        editingLine: {
        },
        editingPolyline: {
        },
        editingPolygon: {
        },
        editingGroup: {
        },
      },
      on: {
        SW_TO_EDITING_HTML: { 
          target: 'editing_html',
          actions: ['setEditingHtml'], },
      }
    },
  },
};



//= 
// TODO 以下は仮のコード
// 
// 
//=
const appFsmConfig = {
  initial: 'fsm_undefined',
  states: {
    fsm_undefined: {  // SvgEditor が RouterView で表示されていない
      on: {
        EditorMounted: {
          target: 'fsm_ready',
        },
      },
    },
    fsm_ready: {      // SvgEditor が 動作可能な状態
      on: {
        SwToPreferedPage: {
          target: 'fsm_prefered',
          actions: [ 'hideRouterMenu' ],
        },
      },
    },
    fsm_prefered: {   // SvgEditor が RouterView で表示された
      on: {
        SwToEditing: {  // TODO
          target: 'fsm_editing',
        },
      },
    },
    fsm_editing: {
    },
    /* 他のアプリ級 states */
  }
};


//= 
// TODO 
// 
// 
//=
const mainFsmConfig = {   // root config of statesroot config of states
  id: 'mainfsm',
  type: 'parallel',               // Parallel State Nodes; https://xstate.js.org/docs/guides/parallel.html
  predictableActionArguments: true,
  context: {
    isPreferPage: false,
  },
  states: {
    app         : appFsmConfig,     // fsm_undefined ⇒ fsm_ready ⇒ fsm_prefered ⇒ fsm_editing ⇒ ... ⇒ TODO
    developing  : developConfig,    // develop ⇒ release
    operating   : operatingConfig,  // edit ⇒ preview
    editing     : editingConfig,    // editing_html ⇒ editing_svg
  },
  on: {
    /* some events */
  },
};

const mainFsmOptions = {
  actions: {
    hideRouterMenu: (context, event) => {
      context.isPreferPage = true;
      console.log('* hideRouterMenu: context.isPreferPage =', context.isPreferPage + ' writed');
    },
    setEditingSvg: (context, event) => {
      console.log('* setEditingSvg');
    },
    setEditingHtml: (context, event) => {
      console.log('* setEditingHtml');
    },
  },
  delays: {       // the mapping of delay names to their implementation
    /* ... */
  },
  guards: {       // the mapping of transition guard (cond) names to their implementation
    /* ... */
  },
  services: {     //  the mapping of invoked service (src) names to their implementation
    /* ... */
  },
  // activities: {   // (deprecated) the mapping of activity names to their implementation
  // },
};

export const mainMachine = createMachine(mainFsmConfig, mainFsmOptions);

// ↓↓↓↓ 実処理 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



