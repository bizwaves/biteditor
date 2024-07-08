# -*- coding: utf-8 -*-

import pdb

from urllib import response
import dataset
import pprint
import json
import pathlib


class UniSqlBase:
    def __init__(self, db_con_str=None):
        # =
        #  db_con_str: str, database connection string. e.g.
        #    1) sqlite:///pysrc\\bitwaves.sys               ※ 【システム】認証 DB, リリース対象
        #    2) sqlite:///pysrc\\bitwaves_owner_sqlite.db   ※ 【システム】リリース管理者用, リリース除外（Master 版発信用認証情報）
        #    3) 上記以外（sqlite 絶対パス書き方に従う）        ※ 【アプリケーション】ユーザ DB
        # =
        self.db_con_str = db_con_str if db_con_str else 'sqlite:///pysrc\\bitwaves.sys'

        # + 対策: DB File not exists when installed biteditor
        if ('sqlite:///pysrc' in self.db_con_str) and ('bitwaves.sys' in self.db_con_str or 'bitwaves_owner_sqlite.db' in self.db_con_str):
            abs_path = pathlib.Path(__file__).resolve()
            abs_dir = abs_path.parent
            abs_db_path = abs_dir.joinpath(
                'bitwaves.sys' if 'bitwaves.sys' in self.db_con_str else 'bitwaves_owner_sqlite.db')
            self.db_con_str = 'sqlite:///' + \
                str(abs_db_path)   # sqlite 絶対パス書き方に従う
        # fi

        self.db = dataset.connect(self.db_con_str)

    # = class-vars

    MASTER_DB = {
        "sys": "sqlite:///pysrc\\bitwaves.sys",
        "owner": "sqlite:///pysrc\\bitwaves_owner_sqlite.db"
    }

    TABLE_LIST = {  # key := com_type
        # = 認証用, リリース対象
        # in bitwaves.sys
        "sys_mst": {'table': 'sys_mst',  'keys': ['serial_no']},
        # in bitwaves.sys
        "sys_auth": {'table': 'sys_auth', 'keys': ['serial_no']},

        # = リリース管理者用, リリース対象外
        # in bitwaves_owner_sqlite.db
        "sys_owner": {'table': 'sys_owner', 'keys': ['serial_no']},
    }

    SQL_KIND_LIST = ['admin_db', 'content']

    SQL_OP_LIST = ['reset_master_db', 'echo',
                   'upsert', 'find', 'batchupsert', 'test', 'find_by_conds', 'findall',
                   'delete_by_key', 'delete_by_conds', 'delete_all',
                   'reset_table', "backup_db", "restore_db"]

    @classmethod
    def make_record(cls, table_name, payload):
        if table_name == 'sys_mst':
            dc = cls.make_record_sys_mst(payload)
        else:
            return None
        # fi

        if not 'deleted' in dc:
            dc['deleted'] = 0

        return dc

    @classmethod
    def make_record_sys_mst(cls, payload):
        dc = {
            'serial_no': payload['content']['serial_no'],
            'licence_id': payload['content']['licence_id'],
            'licence_pwd': payload['content']['licence_pwd'],
        }

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def pre_split_conds(cls, conds):
        # =
        # Field が groups か keywords である時、半角スペース区切りで複数の値を入れることができる
        # この関数は、それらの値を分割して、conds に追加します
        # =
        splited_condlist = []  # 戻り値, item は dict（conds の各エントリと同じ形式）

        for field, cond in conds.items():
            if field in ['groups', 'keywords']:
                splited_val = cond['value'].split()
                for val in splited_val:
                    splited_cond = cond.copy()
                    splited_cond['value'] = val
                    splited_condlist.append({field: splited_cond})
                # rof
            else:
                splited_condlist.append({field: cond})
            # fi
        # rof

        # pdb.set_trace()  # !!
        return splited_condlist

    @classmethod
    def make_conds(cls, table_name, conds):
        # = 基本的なSELECT文を作成します
        # この関数は、condsの各エントリがinclude, relating, reverseのフィールドを持つことを想定しています。includeは文字列の検索方法を、
        # relatingは条件間の結合方法を、reverseは条件の反転を制御します。
        # =
        query = f"SELECT id, uuid, parent_uuid, com_type, is_root, pos_size, title, subtitle, author, version, variation, keywords, groups, deleted FROM {table_name}"

        # groups, keywords の値を分割します、戻り値は dict のリスト
        # pdb.set_trace()  # !!
        splited_condlist = cls.pre_split_conds(conds)
        # pdb.set_trace()  # !!

        # 各条件をクエリに追加します
        conditions = {"and": [], "or": []}

        for obj in splited_condlist:   # obj is { field : cond }
            field = list(obj.keys())[0]
            cond = obj[field]

            # includeが'equql'の場合は等しい条件を、'included'の場合はLIKE条件を使用します
            if cond['include'] == 'equql':
                condition = f"{field} = '{cond['value']}'"
            elif cond['include'] == 'included':
                condition = f"{field} LIKE '%{cond['value']}%'"

            # reverseがTrueの場合は、条件を反転します
            if cond['reverse']:
                condition = f"NOT ({condition})"

            # relatingに基づいて条件を追加します
            if cond['relating'] in conditions:
                conditions[cond['relating']].append(condition)

        # pdb.set_trace()  # !!

        # ANDとORで結合します
        if conditions["and"]:
            and_conditions = " AND ".join(conditions["and"])
        else:
            and_conditions = None

        if conditions["or"]:
            or_conditions = " OR ".join(conditions["or"])
        else:
            or_conditions = None

        if and_conditions or or_conditions:
            query += " WHERE deleted = 0 AND "
        else:
            query += " WHERE deleted = 0 "

        # pdb.set_trace()  # !!
        if and_conditions:
            query += "( " + and_conditions + " )"

        # pdb.set_trace()  # !!
        if or_conditions:
            query += " OR " + or_conditions

        # pdb.set_trace()  # !!
        return query


if __name__ == '__main__':
    db = UniSqlBase()
