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
        #   db_con_str: str, database connection string. e.g.
        #       = 'postgresql://[user]:[password]@[host]:[port]/[database]'
        #       = 'sqlite:///bitwaves.db'
        #       = 'sqlite:///:memory:'
        #       = 'sqlite:///C:\\local\\bitwaves\\db\\bitwaves.db'
        # =
        self.db_con_str = db_con_str if db_con_str else 'sqlite:///mylitedb'

        self.db = dataset.connect(db_con_str)

    # = class-vars

    TABLE_LIST = {  # key := com_type
        "edit_sec_text": {'table': 'sec_text', 'keys': ['uuid']},
        "edit_html_frame": {'table': 'html_frame', 'keys': ['uuid']},
        "edit_svg_embed": {'table': 'svg_embed', 'keys': ['uuid']},
        "edit_tiptap": {'table': 'tiptap', 'keys': ['uuid']},
        "edit_layout": {'table': 'layout', 'keys': ['uuid']},
        "edit_svg_src": {'table': 'svg_src_code', 'keys': ['uuid']},
        "edit_svg_rect": {'table': 'svg_rect', 'keys': ['uuid']},
        "edit_svg_circle": {'table': 'svg_circle', 'keys': ['uuid']},
        "edit_svg_ellipse": {'table': 'svg_ellipse', 'keys': ['uuid']},
        "edit_svg_polyline": {'table': 'svg_polyline', 'keys': ['uuid']},
        "edit_svg_polygon": {'table': 'svg_polygon', 'keys': ['uuid']},
        "edit_svg_path": {'table': 'svg_path', 'keys': ['uuid']},
        "edit_svg_line": {'table': 'svg_line', 'keys': ['uuid']},
        "edit_svg_text": {'table': 'svg_text', 'keys': ['uuid']},
        "edit_svg_fitcurve": {'table': 'svg_fitcurve', 'keys': ['uuid']},

        "app_cfg": {'table': 'app_cfg', 'keys': ['uuid']},
        "user_cfg": {'table': 'user_cfg', 'keys': ['uuid']},
    }

    SQL_KIND_LIST = ['admin_db', 'content']

    SQL_OP_LIST = ['upsert', 'find', 'find_by_conds',  'findall',
                   'delete_by_key', 'delete_by_conds', 'delete_all',
                   'reset_table', "backup_db", "restore_db"]

    @classmethod
    def make_record(cls, table_name, payload):
        if table_name == 'sec_text':
            dc = cls.make_record_sec_text(payload)
        elif table_name == 'html_frame':
            dc = cls.make_record_html_frame(payload)
        elif table_name == 'svg_embed':
            dc = cls.make_record_svg_embed(payload)
        elif table_name == 'tiptap':
            dc = cls.make_record_tiptap(payload)
        elif table_name == 'layout':
            dc = cls.make_record_layout(payload)
        elif table_name == 'svg_src_code':
            dc = cls.make_record_svg_src(payload)
        elif table_name == 'svg_text':
            dc = cls.make_record_svg_text(payload)
        elif table_name == 'svg_rect':
            dc = cls.make_record_svg_rect(payload)
        elif table_name == 'svg_circle':
            dc = cls.make_record_svg_circle(payload)
        elif table_name == 'svg_ellipse':
            dc = cls.make_record_svg_ellipse(payload)
        elif table_name == 'svg_polyline':
            dc = cls.make_record_svg_polyline(payload)
        elif table_name == 'svg_polygon':
            dc = cls.make_record_svg_polygon(payload)
        elif table_name == 'svg_path':
            dc = cls.make_record_svg_path(payload)
        elif table_name == 'svg_line':
            dc = cls.make_record_svg_line(payload)
        elif table_name == 'svg_fitcurve':
            dc = cls.make_record_svg_fitcurve(payload)
        elif table_name == 'app_cfg':
            dc = cls.make_record_app_cfg(payload)
        elif table_name == 'user_cfg':
            dc = cls.make_record_user_cfg(payload)
        else:
            return None
        # fi

        if not 'deleted' in dc:
            dc['deleted'] = 0

        return dc

    @classmethod
    def make_record_sec_text(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['jdata'] = payload['content']['jdata']

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        dc['is_root'] = payload['is_root']

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_html_frame(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }
        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        dc['children'] = json.dumps(payload['children'])
        dc['jdata'] = payload['content']['jdata']           # TODO

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_svg_embed(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['svg'] = payload['content']['svg']

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        # dc['children'] = json.dumps(payload['children'])

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_svg_rect(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['svg'] = payload['content']['svg']

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        # dc['children'] = json.dumps(payload['children'])

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_svg_text(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['svg'] = payload['content']['svg']

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        # dc['children'] = json.dumps(payload['children'])

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_svg_circle(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['svg'] = payload['content']['svg']

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        # dc['children'] = json.dumps(payload['children'])

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_svg_ellipse(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['svg'] = payload['content']['svg']

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        # dc['children'] = json.dumps(payload['children'])

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_svg_polyline(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['svg'] = payload['content']['svg']

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        # dc['children'] = json.dumps(payload['children'])

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_svg_polygon(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['svg'] = payload['content']['svg']

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        # dc['children'] = json.dumps(payload['children'])

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_svg_src(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['svg'] = payload['content']['svg']

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        # dc['children'] = json.dumps(payload['children'])

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_svg_path(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['svg'] = payload['content']['svg']

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        # dc['children'] = json.dumps(payload['children'])

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_svg_line(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['svg'] = payload['content']['svg']

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        # dc['children'] = json.dumps(payload['children'])

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_svg_fitcurve(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['svg'] = payload['content']['svg']

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        # dc['children'] = json.dumps(payload['children'])

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_tiptap(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['jdata'] = payload['content']['jdata']

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        # dc['children'] = json.dumps(payload['children'])

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_layout(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['jdata'] = payload['content']['jdata']   # TODO

        dc['parent_uuid'] = payload['parent_uuid']
        dc['com_type'] = payload['com_type']
        dc['is_root'] = payload['is_root']
        dc['pos_size'] = json.dumps(payload['pos_size'])
        # dc['children'] = json.dumps(payload['children'])

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_app_cfg(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['jdata'] = payload['content']
        dc['com_type'] = payload['com_type']

        for k, v in payload['meta'].items():
            dc[k] = v
        # rof

        return dc

    @classmethod
    def make_record_user_cfg(cls, payload):
        dc = {
            'uuid': payload['uuid'],
        }

        dc['jdata'] = payload['content']
        dc['com_type'] = payload['com_type']

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
