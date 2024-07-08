import { ref, computed } from 'vue';
import { defineStore } from 'pinia'


//= Defining a Store
//  Setup Stores
//=
export const dbCfgStore = defineStore(
  'dbCfg',
  () => {
    //= postgresql | sqlite
    const db_type = ref("sqlite");      // ref()s become state properties

    //= PosGreSQL の場合、以下の設定が必要
    const db_host = ref("localhost");
    const db_port = ref("25432");           // PosGreSQL default: 5432
    const db_name = ref("bitwaves");
    const db_user = ref("postgres");
    const db_pass = ref("postgres");
    const admin_db_name = ref("postgres");  // PosGreSQL default: postgres
    const admin_db_user = ref("postgres");  // PosGreSQL default: postgres
    const admin_db_pass = ref("postgres");  // PosGreSQL default: postgres
    
    // const db_path = ref("C:\\local\\bitwaves\\db\\bitwaves.db");     // sqlite3
    const db_path = ref("mylitedb");     // sqlite3, 2024.02.01a shareware 対応: 相対 path 文字列を変更した


    function update_db_cfg(dc: object) {    // methods become actions
      db_type.value = dc["db_type"];

      db_host.value = dc["db_host"];
      db_port.value = dc["db_port"];
      db_name.value = dc["db_name"];
      db_user.value = dc["db_user"];
      db_pass.value = dc["db_pass"];
      admin_db_name.value = dc["admin_db_name"];
      admin_db_user.value = dc["admin_db_user"];
      admin_db_pass.value = dc["admin_db_pass"];

      db_path.value = dc["db_path"];
    }

    const db_cfg_obj = computed(() => {
      let dc = {
        db_type: db_type.value,
        db_host: db_host.value,
        db_port: db_port.value,
        db_name: db_name.value,
        db_user: db_user.value,
        db_pass: db_pass.value,
        admin_db_name: admin_db_name.value,
        admin_db_user: admin_db_user.value,
        admin_db_pass: admin_db_pass.value,
        db_path: db_path.value,
      }
      return dc;
    })

    const db_conn_str = computed(() => {  // computed()s become getters
      let conn_str = "";

      if (db_type.value == "sqlite") {
        conn_str = db_type.value + ":///" + db_path.value; // sqlite3
      } else if (db_type.value == "postgresql") {
        conn_str = db_type.value + "://" + db_user.value + ":" + db_pass.value + "@" + db_host.value + ":" + db_port.value + "/" + db_name.value;
      } else {
       conn_str = db_type.value + "://" + db_user.value + ":" + db_pass.value + "@" + db_host.value + ":" + db_port.value + "/" + db_name.value;
      }

      return conn_str;
    })


    const db_admin_conn_str = computed(() => {  // computed()s become getters
      let conn_str = "";
      if (db_type.value == "sqlite") {
        //= sqlite の場合、管理者 DB は存在しないので、アプリ DB と同じものを返す ※ 一応設定しておくが、sqlite の管理は非サポートであり、実際には使われない
        conn_str = db_type.value + ":///" + db_path.value; // sqlite3
      } else if (db_type.value == "postgresql") {
        conn_str = db_type.value + "://" + admin_db_user.value + ":" + admin_db_pass.value + "@" + db_host.value + ":" + db_port.value + "/" + admin_db_name.value;
      } else {
        conn_str = db_type.value + "://" + admin_db_user.value + ":" + admin_db_pass.value + "@" + db_host.value + ":" + db_port.value + "/" + admin_db_name.value;
      }

      return conn_str;
    })

    return {
      db_type, db_host, db_port, db_name, db_user, db_pass, admin_db_name, admin_db_user, admin_db_pass, db_path,
      update_db_cfg,
      db_cfg_obj, db_conn_str, db_admin_conn_str
    }

  },
  { 
    persist: true,  // リロードしても値が保持される pinia-plugin-persistedstate pre-configured { localStorage, store.$id as default key, JSON.stringify/JSON.parse as serializer/deserializer
  },
)