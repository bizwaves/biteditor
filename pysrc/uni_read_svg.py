# -*- coding: utf-8 -*-

import pprint
import json
import pathlib
import sys
import io
from sys import stdin


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
    try:
        with open(str(json_path), 'w') as f:    # TODO encoding='utf-8'
            json.dump(in_data, f, ensure_ascii=False,
                      indent=4, separators=(',', ': '))
    except Exception as e:
        pass


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
        write_tmp_json_file(in_data, json_path)
    # fi

    fileName = in_data['fileName']
    path = pathlib.Path(fileName)

    response = {'path': str(path)}

    if path.is_file():
        # utf-8 | utf-8-sig to against 「UnicodeDecodeError: 'cp932' codec can't decode」エラー
        with open(path, mode="r", encoding="utf-8") as f:
            # '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n'
            data = f.readline()
            assert ("<?xml" in data)             #
            response["xml_declaration"] = data
            response["svg_data"] = f.read()     # 残ったデータ
            response['exit_code'] = 0
    else:
        response['exit_code'] = 1
        response['error'] = 'not is_file'

    send_node_response(response)
