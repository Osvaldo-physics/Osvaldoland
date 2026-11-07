"""Gera o index.html do OsvaldoLand.

Uso:  python3 src/build.py
Lê src/template.html, perguntas.json e src/icones.woff2 e escreve index.html na raiz.
Depois de editar perguntas.json, rode este script de novo.
"""
import base64, json, pathlib, re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SRC = RAIZ / 'src'

modelo = (SRC / 'template.html').read_text(encoding='utf-8')
dados = json.loads((RAIZ / 'perguntas.json').read_text(encoding='utf-8'))
lista = dados['perguntas'] if isinstance(dados, dict) else dados
banco = [[q['id'], 'S' if q['categoria'] in ('★', 'POP') else q['categoria'], int(q['dificuldade']), q['enunciado'], q['resposta']] for q in lista]
banco_js = json.dumps(banco, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
icones = base64.b64encode((SRC / 'icones.woff2').read_bytes()).decode()

corpo = modelo.replace('__BANCO__', banco_js).replace('__ICONES__', icones)
corpo = corpo.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
titulo = re.search(r'<title>.*?</title>\n?', corpo).group(0)
corpo = corpo.replace(titulo, '', 1)
cabeca, resto = corpo.split('</style>', 1)

html = ('<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<meta name="description" content="OsvaldoLand: trivia de tabuleiro para 2 a 12 jogadores no mesmo computador.">\n'
        + titulo + cabeca + '</style>\n</head>\n<body>\n' + resto.strip() + '\n</body>\n</html>\n')
(RAIZ / 'index.html').write_text(html, encoding='utf-8')
print(f'index.html gerado: {len(banco)} perguntas, {len(html) // 1024} KB')
