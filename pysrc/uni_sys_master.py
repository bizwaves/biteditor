# -*- coding: utf-8 -*-

import pprint
import json
import pathlib
import sys
import io
import base64
import copy
from sys import stdin


from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util import Padding
from hashlib import pbkdf2_hmac

from uni_sys_base import UniSqlBase

auth = {
    'encoding': 'utf-8',
    'keyLen': 256,
    'iterations': 500000,
    'iv': 'a89ab21c226f280f71113a7431d5fae9',
    'salt': 'ae8f85a3dd1958802ea12a7dc4656574'
}


class TxtCrypter:
    def __init__(self, encoding='utf-8', keyLen=128, iterations=50000):   # Default: 128bit、5万回
        self.encoding = encoding
        self.keyLen = keyLen
        self.iterations = iterations
        assert (self.encoding == 'utf-8')

    # 暗号

    def encrypt(self,
                text,        # '9ff1dcce-f592-492f-ada1-d9e83e225919'
                passPhrase,  # 'gY6!(XxFB}'
                salt=None,   # b'\xae\x8f\x85\xa3\xdd\x19X\x80.\xa1*}\xc4eet'
                iv=None      # b'\xa8\x9a\xb2\x1c"o(\x0fq\x11:t1\xd5\xfa\xe9'
                ):
        # if (argc == 2) and (argvs[1] == '--debug'):
        #     pdb.set_trace()

        if salt is None:
            salt = get_random_bytes(16)

        if iv is None:
            iv = get_random_bytes(16)

        try:
            # AESキーの生成
            #   b'\xf0\x1a\xf8\x10\xc1\x8f\x03\xd6\x06<lrb\xbf\x026\x13\x02\xe9\xe3\xa2\x8c\xfa\xa1\x82\x9eI\xe5\xa3\xc3\xb9\xc6'
            key = pbkdf2_hmac('sha256', bytes(
                passPhrase, encoding=self.encoding), salt, self.iterations, int(self.keyLen / 8))

            # 暗号
            aes = AES.new(key, AES.MODE_CBC, iv)

            # = data ※ pkcs7 padding
            #   b'9ff1dcce-f592-492f-ada1-d9e83e225919\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c'
            data = Padding.pad(text.encode(self.encoding),
                               AES.block_size, 'pkcs7')

            # = encrypted
            #   '\x117\xea\xb0\xc7\xadC\xcdFdW\x95\xa5\xa04\x029tF\xdc\x04\xa1\x8c\x1fQ\xc4\xacl\x1b)/\xd0P\xf4Cmwn\xdd\xdd\xd7\xa9\x02\xd6%\xe4\x82&'
            encrypted = aes.encrypt(data)

            encryptedData = {
                'salt': salt.hex(),
                'iv': iv.hex(),
                'key': key.hex(),
                'encrypted': encrypted.hex()
            }
        except Exception as e:
            encryptedData = {
                'salt': None,
                'iv': None,
                'key': None,
                'encrypted': str(e),     # !!
            }

        return encryptedData

    # 復号

    def decrypt(self,
                data,           # { encrypted str, iv str, salt str }
                passPhrase      # 'gY6!(XxFB}'
                ):
        # if (argc == 2) and (argvs[1] == '--debug'):
        #     pdb.set_trace()

        encryptedData = {
            # = b'\xae\x8f\x85\xa3\xdd\x19X\x80.\xa1*}\xc4eet'
            'salt': bytes.fromhex(data['salt']),
            # = b'\xa8\x9a\xb2\x1c"o(\x0fq\x11:t1\xd5\xfa\xe9'
            'iv': bytes.fromhex(data['iv']),
            # = b'\x117\xea\xb0\xc7\xadC\xcdFdW\x95\xa5\xa04\x029tF\xdc\x04\xa1\x8c\x1fQ\xc4\xacl\x1b)/\xd0P\xf4Cmwn\xdd\xdd\xd7\xa9\x02\xd6%\xe4\x82&'
            'encrypted': bytes.fromhex(data['encrypted'])
        }

        try:
            # = AESキーの生成
            #   b'\xf0\x1a\xf8\x10\xc1\x8f\x03\xd6\x06<lrb\xbf\x026\x13\x02\xe9\xe3\xa2\x8c\xfa\xa1\x82\x9eI\xe5\xa3\xc3\xb9\xc6'
            key = pbkdf2_hmac('sha256', bytes(passPhrase, encoding=self.encoding),
                              encryptedData['salt'], self.iterations, int(self.keyLen / 8))

            # 復号
            aes = AES.new(key, AES.MODE_CBC, encryptedData['iv'])

            # = paded
            #   b'9ff1dcce-f592-492f-ada1-d9e83e225919\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c'
            paded = aes.decrypt(encryptedData['encrypted'])

            # = no_paded
            #   b'9ff1dcce-f592-492f-ada1-d9e83e225919'
            no_paded = Padding.unpad(paded, AES.block_size, 'pkcs7')

            # = decrypted
            #   '9ff1dcce-f592-492f-ada1-d9e83e225919'
            decrypted = no_paded.decode(encoding=self.encoding)
        except Exception as e:
            decrypted = str(e)

        return decrypted


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


def auth_encrypt_dict(data, no_owner=False):
    # = 暗号化
    #   data := { serial_no, licence_id, licence_pwd, deleted }
    # =
    # if (argc == 2) and (argvs[1] == '--debug'):
    #     pdb.set_trace()

    salt = bytes.fromhex(auth['salt'])
    iv = bytes.fromhex(auth['iv'])
    passPhrase = data['licence_pwd']

    sn = crypter.encrypt(data['serial_no'], passPhrase, salt, iv)
    # decrypted_sn = crypter.decrypt(sn, passPhrase)  # !! debug

    id = crypter.encrypt(data['licence_id'], passPhrase, salt, iv)
    # decrypted_id = crypter.decrypt(id, passPhrase)  # !! debug

    recoed_auth = copy.deepcopy(data)   # 認証用
    del recoed_auth['licence_pwd']      # 認証用には、パスワードは不要
    recoed_auth['serial_no'] = sn['encrypted']
    recoed_auth['licence_id'] = id['encrypted']

    if no_owner:
        record_owner = None
    else:
        record_owner = copy.deepcopy(data)  # 所有者用
        record_owner['encrypted_serial_no'] = sn['encrypted']
        record_owner['encrypted_licence_id'] = id['encrypted']

        record_owner['encoding'] = auth['encoding']
        record_owner['iterations'] = auth['iterations']
        record_owner['keyLen'] = auth['keyLen']
        record_owner['iv'] = auth['iv']
        record_owner['salt'] = auth['salt']
        record_owner['key'] = sn['key']
    # fi

    return recoed_auth, record_owner


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

    crypter = TxtCrypter(auth["encoding"], auth["keyLen"], auth["iterations"])

    if 'dbConnStr' in in_data:
        dbConnStr = in_data['dbConnStr']        # 2023.12.02
    else:
        dbConnStr = None
    # fi

    response = {}

    try:
        sql_req = in_data['sql_req']
        # =
        # {'kind': 'content', 'op': 'upsert'}
        # {'kind': 'content', 'op': 'findall'}
        # =

        if sql_req['kind'] == 'admin_db' and sql_req['op'] == 'reset_master_db':
            pass
        else:
            uni_sql = UniSqlBase(dbConnStr)  # Default DB
            db = uni_sql.db
            # response['db_con_str'] = uni_sql.db_con_str
        # fi

        content = in_data['content']    # base64 encoded string
        tmp_payload = base64.b64decode(content).decode()
        payload = json.loads(tmp_payload)

        assert (sql_req['kind'] in UniSqlBase.SQL_KIND_LIST)
        assert (sql_req['op'] in UniSqlBase.SQL_OP_LIST)

        if (argc == 2) and (argvs[1] == '--debug'):
            pdb.set_trace()

        if sql_req['kind'] == 'content':
            table_spec = UniSqlBase.TABLE_LIST[payload['com_type']]
            # =
            # {{'keys': ['serial_no'], 'table': 'sys_mst'}
            # =

            assert (table_spec is not None)
            table = db[table_spec['table']]

            if sql_req['op'] in ['upsert', 'find']:
                data = UniSqlBase.make_record(table_spec['table'], payload)
                assert (data is not None)
            else:
                data = None
            # fi
        # fi

        if sql_req['op'] == 'echo':
            response['hello'] = "welcome python api world!"

        elif sql_req['op'] == 'find':  # 認証 := 暗号化の上で、find
            response['authorized'] = False
            if (argc == 2) and (argvs[1] == '--debug'):
                pdb.set_trace()

            licence_pwd = payload['content']['licence_pwd']
            recoed_auth, record_owner = auth_encrypt_dict(data)  # 暗号化

            serial_no = recoed_auth['serial_no']

            # = 1) 暗号化S/Nを探す
            rc = table.find(serial_no=serial_no, deleted=0)
            rc = list(rc)

            if len(rc) > 0:
                # = 2) 暗号化S/Nは直接DBから盗み出したものかもしれない、それを排除するために、一旦復号して、S/Nが一致であれば、認証OKとする
                rec = rc[0]

                data = {
                    'salt': auth['salt'],
                    'iv': auth['iv'],
                    'encrypted': rec['serial_no'],
                }
                decrypted_sn = crypter.decrypt(data, licence_pwd)

                data = {
                    'salt': auth['salt'],
                    'iv': auth['iv'],
                    'encrypted': rec['licence_id'],
                }
                decrypted_id = crypter.decrypt(data, licence_pwd)

                if (decrypted_sn == payload['content']['serial_no']):
                    # = 認証OKということ及び裏で再び認証に使われる情報をDBに保存する
                    table_spec = UniSqlBase.TABLE_LIST['sys_auth']
                    auth_table = db[table_spec['table']]

                    if (argc == 2) and (argvs[1] == '--debug'):
                        pdb.set_trace()

                    encryptedData = crypter.encrypt(
                        licence_pwd, "I1cV^a@_%R", bytes.fromhex(auth['salt']),  bytes.fromhex(auth['iv']))  # 2024.01.16b TODO pasuPhrase は、暗号化されたデータから取得する

                    encrypted_pwd = encryptedData['encrypted']

                    auth_table.upsert({
                        'serial_no': serial_no,
                        'licence_id': recoed_auth['licence_id'],
                        'licence_name': encrypted_pwd,  # !! 伏せ字
                        'authorized': 1,
                    }, ['serial_no'])

                    response['authorized'] = True
                # fi
            # fi

        elif sql_req['op'] == 'test':  # 認証済かどうか
            if (argc == 2) and (argvs[1] == '--debug'):
                pdb.set_trace()

            response['authorized'] = False
            table_spec = UniSqlBase.TABLE_LIST['sys_auth']
            auth_table = db[table_spec['table']]
            rc = table.find(authorized=1)
            rc = list(rc)
            if len(rc) > 0:
                response['authorized'] = True
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
