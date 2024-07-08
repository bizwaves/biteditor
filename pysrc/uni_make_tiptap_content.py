# -*- coding: utf-8 -*-

import pprint
import json
import pathlib
import sys
import io
import base64
import html
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

    response = {}
    response['exit_code'] = 0
    response['error'] = ''

    content = in_data['content']  # base64 encoded string
    tmp_payload = base64.b64decode(content).decode()
    payload = json.loads(tmp_payload)   # dict_keys(['tiptap', 'mode'])

    tiptap = payload["tiptap"]
    mode = payload['mode']          # "visible" | （保留）

    # = z-diag を処理する
    #   1) <z-diag ...... minieditorcompiled = " <svg～> ......</svg>" data-type= ... </z-diag>
    #       ||||||||||||||||||||||||||||||||||||||____________________||||||||||||||||||||||||||
    #       「<svg～>......</svg>」 を切り出し　(||| := 削除, ___ := 保留)
    #   2) 切り出した 「<svg～>......</svg>」に対し、HTML デコード　を行う
    #       ※ &quot ⇒ "
    #
    #   [ in] tiptap
    #   [out] nodiag hasLaTex
    # =
    nodiag = ""

    src = tiptap

    while len(src) > 0:
        splited = src.split("<z-diag", 1)
        #  ～1 : そのまま～ | <z-diag | _2 : _

        if len(splited) >= 2:
            nodiag += splited[0]
            svg_splied = splited[1].split("<svg", 1)
            # ～1～ | <svg |  ～２～

            endsvg_splied = svg_splied[1].split("</svg>", 1)
            # ～1～ | </svg> |  ～２～

            svg_text = "<svg" + endsvg_splied[0] + "</svg>"

            # HTML デコード
            unescaped_svg = html.unescape(svg_text)
            nodiag += unescaped_svg

            enddiag_splited = endsvg_splied[1].split("</z-diag>", 1)
            #  ～1 : 不要～ | </z-diag> |  ～２ : 残り～

            src = enddiag_splited[1]
        else:
            nodiag += src
            src = ""
        # fi
    # wend

    # = z-math を処理する
    #   http://www.ic.daito.ac.jp/~mizutani/html/mathexpress.html
    #
    # <z-math
    #   minieditorlangsrc="x=-b\pm \frac {\sqrt{b^2-4ac}}{2a}"   ※ laTeX コード
    #   minieditorcompiled="x=-b\pm \frac {\sqrt{b^2-4ac}}{2a}"  【廃止】空にする予定
    #   data-type="my-z-math-node"
    # >
    #   <div>
    #     x=-b\pm \frac {\sqrt{b^2-4ac}}{2a}
    #   </div>
    # </z-math>
    # =
    nomath = ""
    hasLaTex = 0

    src = nodiag

    while len(src) > 0:
        splited = src.split('<z-math minieditorlangsrc="', 1)
        #  ～1 : そのまま～ | <z-diag | _2 : _

        if len(splited) >= 2:
            hasLaTex += 1
            nomath += splited[0]

            compiled_splited = splited[1].split('" minieditorcompiled=', 1)
            # ～1 : そのまま～ | _ |  ～２～

            nomath += compiled_splited[0]
            endzmath_splied = compiled_splited[1].split("</z-math>", 1)
            # ～1 : 捨ててる～ | _ |  ～２： そのまま～

            src = endzmath_splied[1]
        else:
            nomath += src
            src = ""
        # fi
    # wend

    # = z-code を処理する
    # <z-code minieditorlangsrc="const foo = 0
    # const foo = 0" minieditorcompiled="const foo = 0
    # const foo = 0" data-type="my-z-code-node">
    # <code>const foo = 0
    # const foo = 0</code>
    # </z-code>
    # =
    nocode = ""

    src = nomath

    while len(src) > 0:
        splited = src.split('<z-code minieditorlangsrc="', 1)
        #  ～1 : そのまま～ | <z-diag | _2 : _

        if len(splited) >= 2:
            nocode += '<pre><code>'
            nocode += splited[0]

            compiled_splited = splited[1].split('" minieditorcompiled=', 1)
            # ～1 : そのまま～ | _ |  ～２～

            nocode += compiled_splited[0]
            nocode += '</code></pre>'
            endzcode_splied = compiled_splited[1].split("</z-code>", 1)
            # ～1 : 捨ててる～ | _ |  ～２： そのまま～

            src = endzcode_splied[1]
        else:
            nocode += src
            src = ""
        # fi
    # wend

    dest = nocode

    base64string = base64.b64encode(dest.encode()).decode()
    response['html'] = base64string
    response['hasLaTex'] = hasLaTex

    send_node_response(response)
