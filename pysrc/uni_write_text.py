# -*- coding: utf-8 -*-

import pprint, json, pathlib
import sys, io, base64
from sys import stdin


def receive_json():
    #= STDIN から node.js からの JSON を読み込む
    in_data = json.load(stdin)
    return in_data

def make_tmp_json_pathname(filename = 'uni_dump_in.json'):
    #= tmp json file path-name を決める
    pysrc_tmp_path = pathlib.Path(__file__).parent.absolute() / 'tmp'
    if not pysrc_tmp_path.is_dir():pysrc_tmp_path.mkdir()
    json_path = pysrc_tmp_path / filename
    return json_path

def read_tmp_json_file(json_path):
    #= DEBUG用、ファイルから JSON を読み込む
    with open(str(json_path), 'r') as f:    # TODO encoding='utf-8'
        in_data = json.load(f)
    return in_data

def write_tmp_json_file(in_data, json_path):    
    #= DEBUGのために、読み込んだ JSON をファイルに書き出す
    fileName = in_data['fileName']  # "C:\\DOCs\\SvgEditor\\exam01-embed.svg"
    content  = in_data['content' ]  # base64 encoded string
    
    #= DEBUG
    # 	↓main 内でやっているので、ここで余計な処理は不要
    #=
    # payload = base64.b64decode(content).decode()	# 
    # in_data['content'] = payload

    try:
        with open(str(json_path), 'w') as f:    # TODO encoding='utf-8'
            json.dump(in_data, f, ensure_ascii = False, indent = 4, separators=(',', ': '))
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
        write_tmp_json_file(in_data, json_path)   # in_data := {"fileName" : , "content" : base54 }
    #fi

    fileName = in_data['fileName']
    path = pathlib.Path(fileName)
    response = { 'path' : str(path) }
    
    content  = in_data['content' ]  # base64 encoded string
    tmp_payload = base64.b64decode(content).decode()
    payload = json.loads(tmp_payload)
    
    sec_uuid = payload['sec_uuid']
    sec_text = payload['sec_text']
    
    f = open(path, mode='w', encoding='utf-8') 
    f.write(sec_text)
    f.close()
        
    if path.is_file():
        response['exit_code'] = 0
    else:
        response['exit_code'] = 1
        response['error'] = 'not is_file'
        
    send_node_response(response)