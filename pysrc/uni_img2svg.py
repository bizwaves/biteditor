# -*- coding: utf-8 -*-

import pprint, json, pathlib
import sys, io, base64
import subprocess
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
    try:
        with open(str(json_path), 'w') as f:    # TODO encoding='utf-8'
            json.dump(in_data, f, ensure_ascii = False, indent = 4, separators=(',', ': '))
    except Exception as e:
        pass

def send_node_response(response):
    #= STDOUT で結果を node.js 返す
    data_json = json.dumps(response, ensure_ascii = False, indent = None, separators=(',', ':'))
    print(data_json)


def do_cmd(cmd):
    try:
        result = subprocess.run(cmd, shell=True, check=True,
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                universal_newlines=True)
        for line in result.stdout.splitlines():
            yield line
    except subprocess.CalledProcessError:
        print('Command [' + cmd + '] was failed.', file=sys.stderr)
        sys.exit(1)


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
    

    fileName = in_data['fileName']
    path = pathlib.Path(fileName)
    
    content  = in_data['content' ]  # base64 encoded string
    tmp_payload = base64.b64decode(content).decode()
    payload = json.loads(tmp_payload)
    
    # {'cmd': 'vtracer',
    # 'options': {'bin_file': 'vtracer.exe',
    #             'out_stem': 'k1_drawing_vtracer',
    #             'sys_path': 'C:\\home\\local\\bin'}}

    response = { 'path' : str(path) }
    
    if path.is_file():
        stem = payload['options']['out_stem'] if ('options' in payload) and isinstance(payload['options'].get('out_stem'), str) else path.stem
        dst_path = path.parent / (f"{stem}.svg")
        response['dst_path'] = str(dst_path)
        
        # PS C:\home\local\bin> .\vtracer.exe -m spline --colormode bw --input C:\DOCs\SvgEditor\k1_drawing.jpg -o  C:\DOCs\SvgEditor\k1_drawing_vtracer.svg
        assert(isinstance(payload['options'].get('sys_path'), str))
        assert(isinstance(payload['options'].get('bin_file'), str))
        exe_name = pathlib.Path(payload['options']['sys_path']) / payload['options']['bin_file']
        
        cmd = f"{exe_name} -m spline --colormode bw --input {path} -o {dst_path}"
        result = do_cmd(cmd)
        response['error'] = list(result)
        response['exit_code'] = 0 if (len(response['error']) == 1) and ('successful' in response['error'][0]) else 1 
    else:
        response['exit_code'] = 1
        response['error'] = 'not is_file'
        
    send_node_response(response)
