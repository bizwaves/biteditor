
Remove-Item *.pyc

python -m compileall -b `
dbsample.py `
sample.py `
txt_crypter.py `
uni_dump_json.py `
uni_img2svg.py `
uni_make_tiptap_content.py `
uni_pdf2svg.py `
uni_pnmbmp2svg.py `
uni_read_cipher_text.py `
uni_read_json.py `
uni_read_svg.py `
uni_read_text.py `
uni_sql_base.py `
uni_sql_content.py `
uni_sys_base.py `
uni_sys_master.py `
uni_write_assets.py `
uni_write_cipher_text.py `
uni_write_json.py `
uni_write_svg.py `
uni_write_svg_assets.py `
uni_write_text.py `
write_json_to_db.py

Remove-Item *.py_

Rename-Item dbsample.pyc dbsample.py_
Rename-Item sample.pyc sample.py_
Rename-Item txt_crypter.pyc txt_crypter.py_
Rename-Item uni_dump_json.pyc uni_dump_json.py_
Rename-Item uni_img2svg.pyc uni_img2svg.py_
Rename-Item uni_make_tiptap_content.pyc uni_make_tiptap_content.py_
Rename-Item uni_pdf2svg.pyc uni_pdf2svg.py_
Rename-Item uni_pnmbmp2svg.pyc uni_pnmbmp2svg.py_
Rename-Item uni_read_cipher_text.pyc uni_read_cipher_text.py_
Rename-Item uni_read_json.pyc uni_read_json.py_
Rename-Item uni_read_svg.pyc uni_read_svg.py_
Rename-Item uni_read_text.pyc uni_read_text.py_
Rename-Item uni_sql_base.pyc uni_sql_base.py_
Rename-Item uni_sql_content.pyc uni_sql_content.py_
Rename-Item uni_sys_base.pyc uni_sys_base.py_
Rename-Item uni_sys_master.pyc uni_sys_master.py_
Rename-Item uni_write_assets.pyc uni_write_assets.py_
Rename-Item uni_write_cipher_text.pyc uni_write_cipher_text.py_
Rename-Item uni_write_json.pyc uni_write_json.py_
Rename-Item uni_write_svg.pyc uni_write_svg.py_
Rename-Item uni_write_svg_assets.pyc uni_write_svg_assets.py_
Rename-Item uni_write_text.pyc uni_write_text.py_
Rename-Item write_json_to_db.pyc write_json_to_db.py_