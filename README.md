# OsvaldoLand

Trivia de tabuleiro para **2 a 12 jogadores no mesmo computador**, feito para jogar na TV ou no projetor.
Cada turno é um duelo: quem está na vez escolhe um oponente, os dois respondem em voz alta e quem acertar anda no tabuleiro.
Vence quem chegar primeiro ao fim da trilha.

**Jogar:** abra o `index.html` no navegador (ou o link do GitHub Pages, se estiver ativado).

## Como funciona um turno

1. O jogador da vez escolhe quem desafiar. Só pode repetir um oponente depois de desafiar todos os outros.
2. A casa onde ele está define a categoria. Na Largada, nas casas Livres e nos Checkpoints, ele escolhe.
3. Ele escolhe a dificuldade: Fácil +1, Média +2 ou Difícil +3 casas. Quem acertar leva as casas.
4. A pergunta aparece com 90 segundos. Quem falar primeiro responde; o juiz clica no nome dele.
5. A resposta certa é revelada e o juiz confirma se está correta.
6. Sem resposta no tempo, a vez passa direto. Se ninguém souber, **Ninguém sabe** (tecla P) encerra a pergunta na hora.
7. Rebote (opcional): se quem respondeu errar, o outro responde a **mesma pergunta** com o tempo que sobrou. Na conferência, os jogadores não olham para a tela.

## Casas especiais

Atalho (+2), Escorregão (−2), Escudo, Todos contra todos, Congelado e Troca.
Cada casa especial vale **uma vez por jogador**: cair de novo na mesma casa não faz nada.
Se o Escudo anulou o efeito, a próxima queda ali vale como a primeira.
O Escudo anula o próximo efeito negativo: Escorregão, Congelado, a punição por erro ou ser trocado para trás por alguém que caiu na Troca.

## 8 categorias

| Sigla | Categoria |
|---|---|
| N | Ciência & Natureza |
| H | História |
| G | Geografia |
| A | Artes & Cultura |
| E | Esportes & Lazer |
| C | Curiosidades |
| P | Mundo Geek & Gamer |
| ★ | Pop & Entretenimento |

## Atalhos de teclado

| Tecla | Ação |
|---|---|
| Números (0 = 10º) | escolhem oponente, categoria, dificuldade e quem respondeu |
| Espaço | avança |
| Enter / Backspace | Sim / Não na validação |
| Esc | pausa |
| Ctrl+Z | desfaz a última validação |

## Perguntas

O banco oficial tem 880 perguntas (110 por categoria: 37 fáceis, 37 médias e 36 difíceis) e está em `perguntas.json`.
Dá para trocar o banco pela tela **Banco de perguntas**, importando outro arquivo no mesmo formato.

Para mudar o banco que já vem no jogo, edite `perguntas.json` e gere o `index.html` de novo:

```
python3 src/build.py
```

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | o jogo completo, num arquivo só |
| `perguntas.json` | banco oficial de perguntas |
| `src/template.html` | código-fonte do jogo |
| `src/icones.woff2` | fonte com os 44 ícones usados |
| `src/build.py` | junta tudo e gera o `index.html` |

A partida salva, os jogadores cadastrados e o banco importado ficam guardados no navegador de quem joga.

---

Projeto desenvolvido por Osvaldo Bezerra — © 2026, todos os direitos reservados.
Ícones: Material Symbols (Google, Apache 2.0). Fontes: Baloo 2 e Nunito (Google Fonts, OFL).
