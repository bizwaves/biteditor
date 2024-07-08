# -*- coding: utf-8 -*-

import pprint
import json
import pathlib
import sys
import io
import base64
from sys import stdin

from uni_sql_base import UniSqlBase


def receive_json():
    # = STDIN から node.js からの JSON を読み込む
    in_data = json.load(stdin)
    return in_data


def make_tmp_json_pathname(filename='uni_dump_in.json'):
    # = tmp json file path-name を決める
    pysrc_tmp_path = pathlib.Path(__file__).parent.absolute() / 'tmp'
    if not pysrc_tmp_path.is_dir():
        pysrc_tmp_path.mkdir()
    json_path = pysrc_tmp_path / filename
    return json_path


def read_tmp_json_file(json_path):
    # = DEBUG用、ファイルから JSON を読み込む
    with open(str(json_path), 'r') as f:    # TODO encoding='utf-8'
        in_data = json.load(f)
    return in_data


def write_tmp_json_file(in_data, json_path):
    # = DEBUGのために、読み込んだ JSON をファイルに書き出す

    # = DEBUG
    # 	↓main 内でやっているので、ここで余計な処理は不要
    # =
    # content = in_data['content']  # base64 encoded string
    # payload = base64.b64decode(content).decode()	#
    # in_data['content'] = payload

    try:
        with open(str(json_path), 'w') as f:    # TODO encoding='utf-8'
            json.dump(in_data, f, ensure_ascii=False,
                      indent=4, separators=(',', ': '))
    except Exception as e:
        pass

# def write_json_to_file(in_data):
#     #= 結果を返すための JSON を作成する
#     exit_code = 0
#     json_path = make_tmp_json_pathname(in_data['fileName'])
#     write_tmp_json_file (in_data['content'], json_path)
#     response = { 'exit_code': exit_code, "json_path" : str(json_path) }
#     return response


def send_node_response(response):
    # = STDOUT で結果を node.js 返す
    data_json = json.dumps(response, ensure_ascii=False,
                           indent=None, separators=(',', ':'))
    print(data_json)


if __name__ == '__main__':
    argvs = sys.argv  # コマンドライン引数を格納したリストの取得
    argc = len(argvs)  # 引数の個数

    json_path = make_tmp_json_pathname()

    if (argc == 2) and (argvs[1] == '--debug'):
        import pdb
        pdb.set_trace()
        in_data = read_tmp_json_file(json_path)
    else:
        in_data = receive_json()
        # in_data := {"fileName" : , "content" : base54 }
        write_tmp_json_file(in_data, json_path)
    # fi

    if 'dbConnStr' in in_data:
        dbConnStr = in_data['dbConnStr']        # 2023.12.02
    else:
        dbConnStr = None
    # fi

    response = {}

    try:
        uni_sql = UniSqlBase(dbConnStr)
        db = uni_sql.db

        sql_req = in_data['sql_req']
        # =
        # {'kind': 'content', 'op': 'upsert'}
        # {'kind': 'content', 'op': 'findall'}
        # =

        content = in_data['content']    # base64 encoded string
        tmp_payload = base64.b64decode(content).decode()
        payload = json.loads(tmp_payload)

        # = payload when upsert
        # {'com_type': 'edit_sec_text',
        #  'content': {'encrypted': {'encrypted': '', 'iv': '', 'salt': ''},
        #              'text': '日本語漢字 カタカナ ひらがな english'},
        #  'meta': {'expiration': '', ...
        #           'title': 'メモ'},
        #  'pos_size': {'h': 0, 'w': 0, 'x': 0, 'y': 0},
        #  'uuid': '196a47ba-7753-48ff-a451-6eef74d8c2a4'}
        # =

        # = payload when findall （SelConditions.vue）対応
        # {'com_type': 'edit_html_frame',
        #  'conds': {'author': {'enable': False,
        #                       'include': 'equql',
        #                       'relating': 'none',
        #                       'value': 'Example Author'}, ...
        #            'version': {'enable': False,
        #                        'include': 'equql',
        #                        'relating': 'none',
        #                        'value': '0.0.1'}}}
        # =

        assert (sql_req['kind'] in UniSqlBase.SQL_KIND_LIST)
        assert (sql_req['op'] in UniSqlBase.SQL_OP_LIST)

        if (argc == 2) and (argvs[1] == '--debug'):
            pdb.set_trace()

        if sql_req['kind'] == 'admin_db':
            if not sql_req['op'] in ['backup_db', 'restore_db']:
                if dbConnStr.split('/')[-1] == 'postgres':
                    raise Exception('dbConnStr can not be Database postgres!')
                # fi
            # fi
        elif sql_req['kind'] == 'content':
            if dbConnStr.split('/')[-1] == 'postgres':
                raise Exception('dbConnStr can not be Database postgres!')
            # fi

            table_spec = UniSqlBase.TABLE_LIST[payload['com_type']]
            # =
            # {'keys': ['uuid'], 'table': 'html_frame'}
            # =

            assert (table_spec is not None)
            table = db[table_spec['table']]

            if sql_req['op'] in ['upsert']:
                data = UniSqlBase.make_record(table_spec['table'], payload)
                assert (data is not None)
            else:
                data = None
            # fi
        # fi

        if sql_req['kind'] == 'admin_db' and sql_req['op'] == 'reset_table':
            for table_spec in UniSqlBase.TABLE_LIST.values():
                if table_spec['table'] in ['app_cfg', 'user_cfg']:  # 管理テーブルは対象外
                    continue
                # fi
                table = db[table_spec['table']]
                table.drop()    # Field 型が変わったときに、Data R/W エラーになるので、drop しておくと良い
            # rof

        elif sql_req['kind'] == 'admin_db' and sql_req['op'] == 'backup_db':
            pass    # TODO
        elif sql_req['kind'] == 'admin_db' and sql_req['op'] == 'restore_db':
            pass

        # = insert or update record
        elif sql_req['op'] == 'upsert':
            table.upsert(data, ['uuid'])

        # = find records by uuid ※one record しか返さないが、I/F を合わせるために配列で返す
        elif sql_req['op'] == 'find':
            tgt_uuid = payload['uuid']
            rc = table.find(uuid=tgt_uuid, deleted=0)
            rc = list(rc)
            sc = json.dumps(rc)
            base64string = base64.b64encode(sc.encode()).decode()
            response['recordset'] = base64string

        # = find records by conds ※SelCondtions.vue 仕様
        elif sql_req['op'] == 'find_by_conds':
            statement = UniSqlBase.make_conds(
                table_spec['table'], payload['conds'])
            # if (argc == 2) and (argvs[1] == '--debug'):
            #     pdb.set_trace()
            rc = db.query(statement)
            rc = list(rc)
            sc = json.dumps(rc)
            base64string = base64.b64encode(sc.encode()).decode()
            response['recordset'] = base64string

        # = soft | hard delete by one key uuid | title | ...
        elif sql_req['op'] == 'delete_by_key':
            key = sql_req['key']
            conds = payload['conds']
            assert (conds is not None)
            assert (key in conds)
            assert (conds[key] is not None)
            assert (conds[key]['value'] is not None)
            tgt_val = conds[key]['value']
            if 'op_md' in sql_req and sql_req['op_md'] == 'hard':
                filters = {key: tgt_val}
                rc = table.delete(**filters)   # True or False
                response['hard deleted'] = rc
            else:
                data = {key: tgt_val, 'deleted': 1}
                rc = table.update(data, [key])  # count
                response['soft deleted count'] = rc
            # fi

        # = soft | hard delete by conds ※SelCondtions.vue 仕様
        elif sql_req['op'] == 'delete_by_conds':
            pass    # TODO

        # = soft | hard delete all records
        elif sql_req['op'] == 'delete_all':
            if 'op_md' in sql_req and sql_req['op_md'] == 'hard':
                filters = {}
                rc = table.delete(**filters)   # True or False
                response['hard deleted'] = rc
            else:
                data = {'deleted': 1}
                rc = table.update(data, [])  # count
                response['soft deleted count'] = rc
            # fi

        else:
            pass
        # fi

        response['exit_code'] = 0
    except Exception as e:
        response['exit_code'] = 1
        response['error'] = str(e)
    # yrt

    send_node_response(response)
