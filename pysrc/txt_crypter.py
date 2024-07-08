# -*- coding: utf-8 -*-

# import pdb

from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util import Padding
from hashlib import pbkdf2_hmac


class TxtCrypter:
    def __init__(self, encoding='utf-8', keyLen=128, iterations=50000):   # Default: 128bit、5万回
        self.encoding = encoding
        self.keyLen = keyLen
        self.iterations = iterations
        assert (self.encoding == 'utf-8')

    # 暗号

    def encrypt(self, text, passPhrase):
        try:
            salt = get_random_bytes(16)
            iv = get_random_bytes(16)

            # AESキーの生成
            key = pbkdf2_hmac('sha256', bytes(
                passPhrase, encoding=self.encoding), salt, self.iterations, int(self.keyLen / 8))

            # 暗号
            aes = AES.new(key, AES.MODE_CBC, iv)
            data = Padding.pad(text.encode(self.encoding),
                               AES.block_size, 'pkcs7')
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
                'key': None,            # !!
                'encrypted': str(e),     # !!
            }

        return encryptedData

    # 復号

    def decrypt(self, data, passPhrase):
        encryptedData = {
            'salt': bytes.fromhex(data['salt']),
            'iv': bytes.fromhex(data['iv']),
            'encrypted': bytes.fromhex(data['encrypted'])
        }

        try:
            # AESキーの生成
            key = pbkdf2_hmac('sha256', bytes(passPhrase, encoding=self.encoding),
                              encryptedData['salt'], self.iterations, int(self.keyLen / 8))

            # 復号
            aes = AES.new(key, AES.MODE_CBC, encryptedData['iv'])

            paded = aes.decrypt(encryptedData['encrypted'])

            no_paded = Padding.unpad(paded, AES.block_size, 'pkcs7')

            decrypted = no_paded.decode(encoding=self.encoding)
        except Exception as e:
            decrypted = str(e)

        return decrypted


if __name__ == '__main__':
    import pprint
    targetText = "9ff1dcce-f592-492f-ada1-d9e83e225919"
    # targetText = "暗号化したいテキスト"   # a) S/N
    passPhrase = "password123"          # b) PWD

    print(targetText)

    crypter = TxtCrypter('utf-8', 256, 500000)

    # 暗号化
    encryptedData = crypter.encrypt(targetText, passPhrase)

    pprint.pprint(encryptedData)
    # =
    # {'encrypted': '3ac38a6e658efb2dfec386fb4901efbaf8c5f8e7024c3e4fba52521d198ed847', # 1)
    #  'key': '986a64153b96bace3a5bf1e66f89d16ad03d82ba5a579e76682ec94a6aaec31e',       # 2)
    #  'iv': 'd9c24d5ac194df789d1d0f75bacedeef',                                        # 3)
    #  'salt': '37b435b47fed754ac10abd205aa9c52d'}                                      # 4)
    # =

    # 復号
    decrypted = crypter.decrypt(encryptedData, passPhrase)  # a-2) S/N

    print("BEGIN decrypted: ------------------")
    print(decrypted)  # 暗号化したいテキスト
    print("END decrypted: ------------------")
