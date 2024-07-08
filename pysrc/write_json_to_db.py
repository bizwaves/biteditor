# -*- coding: utf-8 -*-

import dataset, pprint, json, pathlib
import sys, io
from sys import stdin
from acc_db_api import AccDbApi


def receive_json():
    #= STDIN から node.js からの JSON を読み込む
    in_data = json.load(stdin)
    return in_data

def make_tmp_json_pathname():
    #= tmp json file path-name を決める
    pysrc_tmp_path = pathlib.Path(__file__).parent.absolute() / 'tmp'
    if not pysrc_tmp_path.is_dir():pysrc_tmp_path.mkdir()
    json_path = pysrc_tmp_path / 'write_json_to_db_in.json'
    return json_path

def read_tmp_json_file(json_path):
    #= DEBUG用、ファイルから JSON を読み込む
    with open(str(json_path), 'r') as f:    # TODO encoding='utf-8'
        in_data = json.load(f)
    return in_data

def write_tmp_json_file(in_data, json_path):    
    #= DEBUGのために、読み込んだ JSON をファイルに書き出す
    try:
        with open(str(json_path), 'w') as f:    # TODO encoding='utf-8'
            json.dump(in_data, f, ensure_ascii = False, indent = 4, separators=(',', ': '))
    except Exception as e:
        pass

def write_json_to_db(in_data):
    #= 結果を返すための JSON を作成する
    dbapi = AccDbApi()
    response = dbapi.do_db_api(in_data)
    # response = { 'exit_code': 0, "in_data" : in_data }    # !! TODO
    return response

def send_node_response(response):
    #= STDOUT で結果を node.js 返す
    data_json = json.dumps(response, ensure_ascii = False, indent = None, separators=(',', ':'))
    print(data_json)

if __name__ == '__main__':
    argvs = sys.argv  # コマンドライン引数を格納したリストの取得
    argc = len(argvs) # 引数の個数

    json_path = make_tmp_json_pathname()

    if (argc == 2) and (argvs[1] == '--debug'): 
        import pdb
        pdb.set_trace()
        in_data = read_tmp_json_file(json_path)
    else:
        in_data = receive_json()
        write_tmp_json_file(in_data, json_path)
    #fi

    response = write_json_to_db(in_data)
    send_node_response(response)
