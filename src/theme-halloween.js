/* ===== OsvaldoLand · Tema de Halloween (só visual; regras, banco e sorteio não mudam) =====
   Liga/desliga: chave "Modo Halloween" no cadastro, salva em localStorage ('osvaldoland-tema').
   Sem escolha salva, liga sozinho de 25/10 a 02/11. Sons do tema: chave própria, desligada por padrão.
   Para outra data comemorativa: copie este arquivo e o theme-halloween.css, troque as artes e a janela de datas. */
window.HW = (() => {
  const K = 'osvaldoland-tema', K_SOM = 'osvaldoland-tema-som';
  const lerK = k => { try { return localStorage.getItem(k); } catch(e){ return null; } };
  const gravarK = (k, v) => { try { localStorage.setItem(k, v); } catch(e){} };
  const naData = (d = new Date()) => { const m = d.getMonth() + 1, dia = d.getDate(); return (m === 10 && dia >= 25) || (m === 11 && dia <= 2); };
  const salvo = lerK(K);
  const H = {on: salvo ? salvo === 'halloween' : naData(), somOn: lerK(K_SOM) === 'ligado'};
  function fonte(){
    if(!H.on || document.getElementById('hw-fonte')) return;
    const l = document.createElement('link'); l.id = 'hw-fonte'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Creepster&display=swap'; document.head.appendChild(l);
  }
  fonte();
  H.alternar = () => { H.on = !H.on; gravarK(K, H.on ? 'halloween' : 'normal'); fonte(); };
  H.alternarSom = () => { H.somOn = !H.somOn; gravarK(K_SOM, H.somOn ? 'ligado' : 'desligado'); };

  /* ---------- Personagens (um por cor de jogador). A cor do jogador continua dominante. ---------- */
  const NOMES = {laranja:'Cabeça de Abóbora', roxo:'Bruxa', verde:'Zumbi', vermelho:'Vampiro', azul:'Fantasma', rosa:'Múmia',
    amarelo:'Esqueleto', cinza:'Lobisomem', marrom:'Frankenstein', ciano:'Caveira de Açúcar', preto:'Morcego', lima:'Gosma'};
  H.NOMES = NOMES;
  H.nome = cor => NOMES[cor] || '';
  /* Peças de miniatura: contorno claro fino + traço escuro, volume por degradê na cor do jogador, olhos que brilham. */
  const BASE_S = '<path d="M12 111 Q12 101 50 101 Q88 101 88 111 V115 Q88 125 50 125 Q12 125 12 115Z"/><path d="M38 106 Q41 88 43 73 L57 73 Q59 88 62 106Z"/>';
  const base = (c, d, G) => '<path d="M12 111 Q12 101 50 101 Q88 101 88 111 V115 Q88 125 50 125 Q12 125 12 115Z" fill="' + d + '"/><ellipse cx="50" cy="109" rx="38" ry="7.5" fill="' + G + '"/><path d="M38 106 Q41 88 43 73 L57 73 Q59 88 62 106Z" fill="' + G + '"/><path d="M44 78 Q42.5 92 41.5 104" stroke="#fff" stroke-opacity=".28" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="73.5" rx="11" ry="3.4" fill="' + d + '"/>';
  const brilho = (x, y, r, cor) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + cor + '" opacity=".22"/><circle cx="' + x + '" cy="' + y + '" r="' + (r*.55).toFixed(1) + '" fill="' + cor + '" opacity=".35"/>';
  const SKULL = 'M26 36 Q26 10 50 10 Q74 10 74 36 Q74 48 68 52 L66 60 Q60 67 50 67 Q40 67 34 60 L32 52 Q26 48 26 36Z';
  const ORB_E = 'M33 36 Q34 29 42 30 Q48 32 46 40 Q44 46 38 45 Q32 43 33 36Z', ORB_D = 'M67 36 Q66 29 58 30 Q52 32 54 40 Q56 46 62 45 Q68 43 67 36Z';
  const ARTE = {
    laranja: (c, d, G) => ({s:'<path d="M50 20 C20 18 15 34 17 46 C19 62 34 71 50 71 C66 71 81 62 83 46 C85 34 80 18 50 20Z"/><path d="M46 22 L48 10 Q50 4 58 3 L59 8 Q53 9 53 13 L54 22Z"/>',
      a:'<path d="M46 22 L48 10 Q50 4 58 3 L59 8 Q53 9 53 13 L54 22Z" fill="#3B2A14"/><path d="M50 20 C20 18 15 34 17 46 C19 62 34 71 50 71 C66 71 81 62 83 46 C85 34 80 18 50 20Z" fill="' + G + '"/><g fill="none" stroke="' + d + '" stroke-width="2.2" opacity=".6"><path d="M50 20 C42 30 42 60 50 71"/><path d="M50 20 C58 30 58 60 50 71"/><path d="M34 22 C25 34 26 58 37 68"/><path d="M66 22 C75 34 74 58 63 68"/></g>' + brilho(37,43,11,'#FDBA74') + brilho(63,43,11,'#FDBA74') + '<g fill="#FDE68A" stroke="#431407" stroke-width="1.6" stroke-linejoin="round"><path d="M28 37 L45 43 L33 50Z"/><path d="M72 37 L55 43 L67 50Z"/><path d="M46.5 51 L50 46 L53.5 51Z"/><path d="M26 53 Q50 68 74 53 L68 56 L65 61 L60 57 L55 63 L50 58 L45 63 L40 57 L35 61 L32 56Z"/></g><path d="M30 39 L41 43 L33 48Z M70 39 L59 43 L67 48Z" fill="#FFFBEB" opacity=".7"/><ellipse cx="31" cy="29" rx="7" ry="3" transform="rotate(-32 31 29)" fill="#fff" opacity=".28"/>'}),
    roxo: (c, d, G) => ({s:'<path d="M78 50 L81.5 49 L93.5 110 L90 111Z"/><path d="M84 104 L97 100 L102 122 L86 124Z"/><path d="M30 36 C27 52 31 66 38 74 L62 74 C69 66 73 52 70 36Z"/><ellipse cx="50" cy="34" rx="38" ry="7"/><path d="M30 33 C34 20 40 10 52 3 C57 0 65 2 71 8 C65 7 61 9 59 14 C63 22 66 28 70 33Z"/>',
      a:'<path d="M78 50 L81.5 49 L93.5 110 L90 111Z" fill="#57391F"/><path d="M84 104 L97 100 L102 122 L86 124Z" fill="#A16207"/><path d="M88 106 L92 123 M93 104 L97 122" stroke="#713F12" stroke-width="1.5"/><path d="M30 36 C27 52 31 66 38 74 L62 74 C69 66 73 52 70 36Z" fill="#160A26"/><path d="M36 36 C36 53 42 63 50 63 C58 63 64 53 64 36Z" fill="#A7B98C"/><path d="M36 36 H64 V43 Q50 48 36 43Z" fill="#000" opacity=".4"/>' + brilho(42,45,6,'#BEF264') + brilho(58,45,6,'#BEF264') + '<path d="M38 45 Q42 42.5 46 45 Q42 46.8 38 45Z M54 45 Q58 42.5 62 45 Q58 46.8 54 45Z" fill="#D9F99D"/><path d="M50 46 L55 55 L49 54Z" fill="#6B7F55"/><path d="M43 58 Q50 60 57 56" stroke="#160A26" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="34" rx="38" ry="7" fill="' + d + '"/><path d="M30 33 C34 20 40 10 52 3 C57 0 65 2 71 8 C65 7 61 9 59 14 C63 22 66 28 70 33Z" fill="' + G + '"/><path d="M32.5 27 C44 29.5 56 29.5 67.5 27 L69 32.5 C56 35 44 35 31.5 32.5Z" fill="#160A26"/><rect x="46" y="27.4" width="8" height="6.4" rx="1" fill="none" stroke="#FACC15" stroke-width="1.8"/><path d="M41 19 C45 12 49 8 54 5" stroke="#fff" stroke-width="2.2" opacity=".3" fill="none" stroke-linecap="round"/>'}),
    verde: (c, d, G) => ({s:'<path d="M40 70 L12 59 Q5 57 5 64 Q5 69 12 70 L38 79Z"/><path d="M60 70 L88 59 Q95 57 95 64 Q95 69 88 70 L62 79Z"/><path d="M30 18 Q50 7 70 15 L73 50 Q71 64 58 69 L42 69 Q29 64 28 50Z"/>',
      a:'<path d="M40 70 L12 59 Q5 57 5 64 Q5 69 12 70 L38 79Z M60 70 L88 59 Q95 57 95 64 Q95 69 88 70 L62 79Z" fill="' + d + '"/><path d="M40 70 L27 65 L29 71 L24 73 L38 79Z M60 70 L73 65 L71 71 L76 73 L62 79Z" fill="#292524"/><path d="M30 18 Q50 7 70 15 L73 50 Q71 64 58 69 L42 69 Q29 64 28 50Z" fill="' + G + '"/><path d="M30 20 Q50 7 70 15 L70 24 L64 19 L60 26 L54 18 L48 25 L42 18 L36 25 L30 23Z" fill="#1C1917"/><ellipse cx="40" cy="39" rx="7.5" ry="6.5" fill="#052E16"/><ellipse cx="61" cy="41" rx="6" ry="5" fill="#052E16"/><circle cx="41" cy="40" r="2" fill="#D6D3D1"/><circle cx="61" cy="42" r="1.5" fill="#D6D3D1"/><path d="M55 25 L66 31" stroke="#14532D" stroke-width="2"/><path d="M57 24 L56 28 M61 26.5 L60 30.5 M65 29 L64 33" stroke="#14532D" stroke-width="1.6"/><path d="M40 54 Q50 51 61 55 L59 61 Q50 63 42 60Z" fill="#1C0A0A"/><path d="M45 53 L46 56.5 L47.5 53 M53 53 L54 56.5 L55.5 53.5" fill="#D6D3D1"/><path d="M66 46 Q71 50 70 56" stroke="#000" stroke-width="5" opacity=".18" fill="none"/>'}),
    vermelho: (c, d, G) => ({s:'<path d="M14 74 L20 18 L36 44 L64 44 L80 18 L86 74Z"/><path d="M32 38 Q30 13 50 11 Q70 13 68 38 Q68 56 50 65 Q32 56 32 38Z"/>',
      a:'<path d="M14 74 L20 18 L36 44 L64 44 L80 18 L86 74Z" fill="' + G + '"/><path d="M22 70 L25 32 L37 48 L63 48 L75 32 L78 70Z" fill="#2A0A10"/><path d="M32 38 Q30 13 50 11 Q70 13 68 38 Q68 56 50 65 Q32 56 32 38Z" fill="#E7E5E4"/><path d="M60 16 Q68 22 68 38 Q68 56 50 65 Q62 50 60 16Z" fill="#78716C" opacity=".35"/><path d="M32 35 Q30 11 50 10 Q70 11 68 35 Q64 24 56 23 L50 33 L44 23 Q36 24 32 35Z" fill="#0C0A09"/><path d="M40 16 Q46 13 52 13" stroke="#fff" stroke-width="1.6" opacity=".3" fill="none"/><path d="M37 37 L46 40 M63 37 L54 40" stroke="#0C0A09" stroke-width="2.6" stroke-linecap="round"/>' + brilho(42,43,5,'#F87171') + brilho(58,43,5,'#F87171') + '<path d="M38 42.5 Q42 40.5 46 43 Q42 44.5 38 42.5Z M62 42.5 Q58 40.5 54 43 Q58 44.5 62 42.5Z" fill="#EF4444"/><path d="M50 44 L48.5 50 L51 50.5" stroke="#78716C" stroke-width="1.4" fill="none"/><path d="M36 48 Q38 54 42 56 M64 48 Q62 54 58 56" stroke="#A8A29E" stroke-width="1.6" fill="none"/><path d="M43 54 Q50 56 57 54" stroke="#0C0A09" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M45 54.4 L46.4 59 L47.8 54.9Z M52.2 54.9 L53.6 59 L55 54.4Z" fill="#fff"/>'}),
    azul: (c, d, G) => ({semBase:true, n:92, s:'<path d="M50 8 C30 8 22 24 22 44 L20 94 C18 104 14 110 9 117 C17 116 22 112 26 110 L30 121 L37 108 L44 123 L50 107 L57 121 L64 108 L71 119 L75 108 C79 112 85 115 92 115 C85 107 80 96 78 84 L78 44 C78 24 70 8 50 8Z"/>',
      a:'<path d="M50 8 C30 8 22 24 22 44 L20 94 C18 104 14 110 9 117 C17 116 22 112 26 110 L30 121 L37 108 L44 123 L50 107 L57 121 L64 108 L71 119 L75 108 C79 112 85 115 92 115 C85 107 80 96 78 84 L78 44 C78 24 70 8 50 8Z" fill="' + G + '"/><g stroke="#fff" fill="none" stroke-linecap="round" opacity=".22" stroke-width="2.4"><path d="M37 52 Q33 80 35 106"/><path d="M62 56 Q66 84 64 104"/></g><path d="M30 30 Q33 17 45 13" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".4"/><path d="M35 33 Q40 26 45 33 L44 47 Q40 52 36 47Z M65 33 Q60 26 55 33 L56 47 Q60 52 64 47Z" fill="#0B1026"/><ellipse cx="50" cy="61" rx="4.5" ry="8" fill="#0B1026"/>'}),
    rosa: (c, d, G) => ({s:'<path d="M70 30 L91 40 L87 47 L68 39Z"/><path d="M28 40 Q26 13 50 11 Q74 13 72 40 Q72 62 57 71 L43 71 Q28 62 28 40Z"/>',
      a:'<path d="M70 30 L91 40 L87 47 L68 39Z" fill="' + c + '" stroke="' + d + '" stroke-width="1.4"/><path d="M28 40 Q26 13 50 11 Q74 13 72 40 Q72 62 57 71 L43 71 Q28 62 28 40Z" fill="' + G + '"/><g fill="none" stroke="' + d + '" stroke-width="2" opacity=".7" stroke-linecap="round"><path d="M33 19 Q52 13 67 20"/><path d="M28 28 Q50 18 72 27"/><path d="M27 34 Q48 30 73 33"/><path d="M28 54 Q50 49 72 56"/><path d="M31 62 Q48 57 69 64"/><path d="M38 68 Q50 64 62 69"/></g><path d="M29 39 Q50 35 71 39 L71 47 Q50 44 29 48Z" fill="#1A0510"/>' + brilho(41,43,6,'#FDE047') + '<ellipse cx="41" cy="43" rx="3.6" ry="2.3" fill="#FDE047"/><path d="M52 40 Q62 41 71 47" stroke="' + c + '" stroke-width="5" fill="none"/>'}),
    amarelo: (c, d, G) => ({s:'<path d="' + SKULL + '"/>',
      a:'<path d="' + SKULL + '" fill="' + G + '"/><path d="M60 13 Q74 20 74 36 Q74 48 68 52 L66 60 L59 63 Q70 40 60 13Z" fill="' + d + '" opacity=".35"/><path d="' + ORB_E + '" fill="#1C1203"/><path d="' + ORB_D + '" fill="#1C1203"/><circle cx="40" cy="38" r="1.8" fill="#FB923C"/><circle cx="60" cy="38" r="1.8" fill="#FB923C"/><path d="M50 45 L46 53 Q50 55 54 53Z" fill="#1C1203"/><path d="M36 50 Q38 54 37 58 M64 50 Q62 54 63 58" stroke="' + d + '" stroke-width="1.6" fill="none"/><rect x="38" y="55.5" width="24" height="7" rx="1.5" fill="#FEF3C7" stroke="#1C1203" stroke-width="1.6"/><path d="M42 55.5 V62.5 M46 55.5 V62.5 M50 55.5 V62.5 M54 55.5 V62.5 M58 55.5 V62.5" stroke="#1C1203" stroke-width="1.2"/><path d="M57 12 L54 20 L58 24 L56 28" stroke="#1C1203" stroke-width="1.4" fill="none"/>'}),
    cinza: (c, d, G) => ({s:'<path d="M26 34 L23 3 L43 20Z M74 34 L77 3 L57 20Z"/><path d="M24 40 Q24 18 50 16 Q76 18 76 40 L83 50 L73 54 L67 66 Q59 73 50 73 Q41 73 33 66 L27 54 L17 50Z"/>',
      a:'<path d="M26 34 L23 3 L43 20Z M74 34 L77 3 L57 20Z" fill="' + c + '"/><path d="M29 27 L27.5 11 L38 21Z M71 27 L72.5 11 L62 21Z" fill="#1E293B"/><path d="M24 40 Q24 18 50 16 Q76 18 76 40 L83 50 L73 54 L67 66 Q59 73 50 73 Q41 73 33 66 L27 54 L17 50Z" fill="' + G + '"/><path d="M31 34 L46 39 L45 41 L31 38Z M69 34 L54 39 L55 41 L69 38Z" fill="#1E293B"/>' + brilho(40,42,6,'#FDE047') + brilho(60,42,6,'#FDE047') + '<path d="M34 40 L46 42.5 L37 45.5Z M66 40 L54 42.5 L63 45.5Z" fill="#FACC15"/><path d="M40.5 41 V44.6 M59.5 41 V44.6" stroke="#0F172A" stroke-width="1.6"/><path d="M40 48 Q50 44 60 48 L58 62 Q50 68 42 62Z" fill="#CBD5E1"/><ellipse cx="50" cy="50" rx="5" ry="3.4" fill="#0F172A"/><path d="M42 60 Q50 64 58 60" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M44 60.5 L45.4 65 L47 61.6Z M53 61.6 L54.6 65 L56 60.5Z" fill="#fff"/><path d="M25 44 L31 47 M75 44 L69 47 M28 52 L33 53 M72 52 L67 53" stroke="#1E293B" stroke-width="1.6"/>'}),
    marrom: (c, d, G) => ({s:'<rect x="17" y="50" width="12" height="9" rx="2"/><rect x="71" y="50" width="12" height="9" rx="2"/><path d="M28 14 H72 V56 Q72 68 60 70 H40 Q28 68 28 56Z"/>',
      a:'<rect x="17" y="50" width="12" height="9" rx="2" fill="#71717A"/><rect x="17" y="50" width="12" height="3.5" rx="1.5" fill="#D4D4D8"/><rect x="71" y="50" width="12" height="9" rx="2" fill="#71717A"/><rect x="71" y="50" width="12" height="3.5" rx="1.5" fill="#D4D4D8"/><path d="M28 14 H72 V56 Q72 68 60 70 H40 Q28 68 28 56Z" fill="' + G + '"/><path d="M28 14 H72 V27 L66 22 L60 28 L54 22 L48 28 L42 22 L36 28 L28 25Z" fill="#0C0A09"/><path d="M34 32 H58" stroke="#1C1917" stroke-width="1.8"/><path d="M37 30 V34 M42 30 V34 M47 30 V34 M52 30 V34 M57 30 V34" stroke="#1C1917" stroke-width="1.4"/><rect x="31" y="37" width="38" height="5" rx="1.5" fill="#1C1917" opacity=".85"/><path d="M31 42 H69 V46 Q50 49 31 46Z" fill="#000" opacity=".3"/><ellipse cx="41" cy="46" rx="3.6" ry="2.4" fill="#E7E5E4"/><ellipse cx="59" cy="46" rx="3.6" ry="2.4" fill="#E7E5E4"/><circle cx="41.5" cy="46.3" r="1.3" fill="#0C0A09"/><circle cx="59.5" cy="46.3" r="1.3" fill="#0C0A09"/><path d="M50 48 V54 H47" stroke="#1C1917" stroke-width="1.4" fill="none" opacity=".6"/><path d="M40 60 H60" stroke="#1C1917" stroke-width="2.6" stroke-linecap="round"/><path d="M43 57.5 V62.5 M48 57.5 V62.5 M53 57.5 V62.5 M58 57.5 V62.5" stroke="#1C1917" stroke-width="1.2"/>'}),
    ciano: (c, d, G) => ({s:'<path d="' + SKULL + '"/>',
      a:'<path d="' + SKULL + '" fill="' + G + '"/><path d="M60 13 Q74 20 74 36 Q74 48 68 52 L66 60 L59 63 Q70 40 60 13Z" fill="' + d + '" opacity=".3"/><g stroke="#fff" stroke-width="1.4" stroke-linecap="round">' + [0,1,2,3,4,5,6,7].map(k => { const a = k*Math.PI/4; return [40,60].map(x => 'M' + (x + Math.cos(a)*10).toFixed(1) + ' ' + (38 + Math.sin(a)*10).toFixed(1) + 'L' + (x + Math.cos(a)*13).toFixed(1) + ' ' + (38 + Math.sin(a)*13).toFixed(1)).map(p => '<path d="' + p + '"/>').join(''); }).join('') + '</g><path d="' + ORB_E + '" fill="#082F49" stroke="#F472B6" stroke-width="2"/><path d="' + ORB_D + '" fill="#082F49" stroke="#F472B6" stroke-width="2"/><path d="M50 15 L55 21 L50 27 L45 21Z" fill="#F472B6" stroke="#fff" stroke-width="1.2"/><circle cx="41" cy="21" r="1.6" fill="#fff"/><circle cx="59" cy="21" r="1.6" fill="#fff"/><path d="M50 45 L46 52 Q50 54 54 52Z" fill="#082F49"/><path d="M30 46 Q33 52 38 50 M70 46 Q67 52 62 50" stroke="#FDE047" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M38 58 H62" stroke="#082F49" stroke-width="2"/><path d="M41 55 V61 M45 55 V61 M50 55 V61 M55 55 V61 M59 55 V61" stroke="#082F49" stroke-width="1.4"/>'}),
    preto: (c, d, G) => ({s:'<path d="M50 44 L4 20 Q10 34 2 46 Q14 44 16 56 Q24 50 30 60 Q36 52 42 64 L50 58 L58 64 Q64 52 70 60 Q76 50 84 56 Q86 44 98 46 Q90 34 96 20Z"/><path d="M37 32 L33 11 L46 26Z M63 32 L67 11 L54 26Z"/><circle cx="50" cy="40" r="16"/>',
      a:'<path d="M50 44 L4 20 Q10 34 2 46 Q14 44 16 56 Q24 50 30 60 Q36 52 42 64 L50 58 L58 64 Q64 52 70 60 Q76 50 84 56 Q86 44 98 46 Q90 34 96 20Z" fill="' + c + '"/><g stroke="#71717A" stroke-width="1.5" fill="none"><path d="M48 44 L6 22 M48 46 L16 55 M48 48 L30 59 M52 44 L94 22 M52 46 L84 55 M52 48 L70 59"/></g><path d="M37 32 L33 11 L46 26Z M63 32 L67 11 L54 26Z" fill="' + G + '"/><path d="M38 27 L36 16 L43 24Z M62 27 L64 16 L57 24Z" fill="#7F1D1D" opacity=".6"/><circle cx="50" cy="40" r="16" fill="' + G + '"/>' + brilho(44,39,5,'#F87171') + brilho(56,39,5,'#F87171') + '<path d="M40 37 L47 39.5 L41.5 42Z M60 37 L53 39.5 L58.5 42Z" fill="#EF4444"/><path d="M47 45 L50 47.5 L53 45" stroke="#A1A1AA" stroke-width="1.4" fill="none"/><path d="M45.5 49 L47 54 L48.5 49.6Z M51.5 49.6 L53 54 L54.5 49Z" fill="#fff"/>'}),
    lima: (c, d, G) => ({s:'<path d="M22 46 Q18 16 50 14 Q82 16 78 46 Q80 60 74 66 Q73 82 68 70 Q64 76 60 68 Q56 88 50 70 Q44 80 40 68 Q34 78 32 66 Q22 62 22 46Z"/>',
      a:'<path d="M22 46 Q18 16 50 14 Q82 16 78 46 Q80 60 74 66 Q73 82 68 70 Q64 76 60 68 Q56 88 50 70 Q44 80 40 68 Q34 78 32 66 Q22 62 22 46Z" fill="' + G + '"/><ellipse cx="46" cy="40" rx="18" ry="16" fill="#fff" opacity=".12"/><g fill="none" stroke="#fff" stroke-width="1.4" opacity=".45"><circle cx="66" cy="30" r="3"/><circle cx="31" cy="54" r="2.2"/><circle cx="62" cy="58" r="1.8"/></g><path d="M30 30 Q33 21 42 18" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".45"/>' + brilho(40,39,7,'#ECFCCB') + '<ellipse cx="40" cy="39" rx="6" ry="4.2" fill="#1A2E05"/><ellipse cx="59" cy="35" rx="4" ry="3" fill="#1A2E05"/><circle cx="41.5" cy="38.5" r="1.6" fill="#ECFCCB"/><path d="M34 51 Q50 60 66 48 Q58 54 50 54 Q42 54 34 51Z" fill="#1A2E05"/><path d="M47 54 Q47 60 49 62" stroke="' + d + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>'})
  };
  /* Mesma assinatura e mesmo invólucro do peao() original: layout, animações de pulo/pouso, escudo e gelo continuam iguais. */
  H.peao = (cor, num, h, o = {}) => {
    const [c, d] = PC[cor] || PC.vermelho, w = Math.round(h*100/130), gid = 'hwg-' + (PC[cor] ? cor : 'vermelho'), G = 'url(#' + gid + ')', f = (ARTE[cor] || ARTE.vermelho)(c, d, G);
    const filt = o.esm ? 'grayscale(.75)' : o.brilho ? 'drop-shadow(0 0 ' + Math.round(h*.14) + 'px ' + c + ')' : 'none';
    const ny = f.n || 114, txt = String(num ?? ''), bw = txt.length > 1 ? 36 : 26;
    const selo = txt ? '<rect x="' + (50 - bw/2) + '" y="' + (ny - 11.5) + '" width="' + bw + '" height="23" rx="6" fill="#0B0614" fill-opacity=".82" stroke="' + c + '" stroke-width="1.6"/><text x="50" y="' + (ny + 7) + '" text-anchor="middle" fill="#fff" style="font-family:var(--baloo);font-weight:800;font-size:20px">' + txt + '</text>' : '';
    return '<span class="peao hw-p ' + (o.cls||'') + '" style="width:' + w + 'px;height:' + h + 'px;opacity:' + (o.esm ? .45 : 1) + ';filter:' + filt + ';--c:' + c + ';' + (o.st||'') + '"><svg viewBox="0 0 100 130" aria-hidden="true" style="overflow:visible;animation-delay:' + (-(+num || 0)*.41).toFixed(2) + 's">'
      + '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c + '"/><stop offset=".5" stop-color="' + c + '"/><stop offset="1" stop-color="' + d + '"/></linearGradient></defs>'
      + '<ellipse cx="50" cy="126" rx="' + (f.semBase ? 30 : 40) + '" ry="5" fill="rgba(5,3,15,.45)"/>'
      + '<g fill="#EDE9FE" stroke="#EDE9FE" stroke-width="7" stroke-linejoin="round" opacity=".9">' + (f.semBase ? '' : BASE_S) + f.s + '</g>'
      + '<g fill="#0B0614" stroke="#0B0614" stroke-width="3.2" stroke-linejoin="round">' + (f.semBase ? '' : BASE_S) + f.s + '</g>'
      + (f.semBase ? '' : base(c, d, G)) + f.a + selo + '</svg></span>';
  };

  /* ---------- Enfeite temático das casas especiais (fica ao lado do ícone, sem trocar a função) ---------- */
  const ACC = {
    livre:'<path d="M4 12 L12 17 L12 23 L4 28Z M36 12 L28 17 L28 23 L36 28Z" fill="#EC4899" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="20" cy="20" rx="10" ry="8" fill="#F472B6" stroke="#fff" stroke-width="2.5"/><path d="M15 14 L22 26 M20 12.5 L26.5 24" stroke="#fff" stroke-width="2.2"/>',
    atalho:'<path d="M31 3 L16 25" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M31 3 L16 25" stroke="#92400E" stroke-width="4" stroke-linecap="round"/><path d="M14 22 L22 28 L12 38 L3 33Z" fill="#FACC15" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><path d="M8 33 L16 27 M11 36 L19 29" stroke="#A16207" stroke-width="1.6"/>',
    escorregao:'<path d="M8 18 A12 12 0 0 1 32 18 Q32 25 27 27 L27 33 L13 33 L13 27 Q8 25 8 18Z" fill="#F5F5F4" stroke="#1C1917" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="15" cy="19" rx="3.6" ry="4" fill="#1C1917"/><ellipse cx="25" cy="19" rx="3.6" ry="4" fill="#1C1917"/><path d="M20 23 L18 26.5 H22Z" fill="#1C1917"/><path d="M16.5 29 V33 M20 29 V33 M23.5 29 V33" stroke="#1C1917" stroke-width="1.6"/>',
    escudo:'<path d="M16 4 H24 V13 Q34 17 34 27 A14 12 0 0 1 6 27 Q6 17 16 13Z" fill="#F5F3FF" stroke="#3B0764" stroke-width="2.5" stroke-linejoin="round"/><path d="M7.5 26 Q20 22 32.5 26 Q32 37 20 37.5 Q8 37 7.5 26Z" fill="#A855F7"/><rect x="14.5" y="1" width="11" height="5" rx="1.5" fill="#92400E" stroke="#3B0764" stroke-width="2"/><circle cx="16" cy="29" r="2" fill="#E9D5FF"/><circle cx="23" cy="32" r="1.4" fill="#E9D5FF"/>',
    todos:'<path d="M8 18 A12 12 0 0 1 32 18 V36 L28 33 L24 36 L20 33 L16 36 L12 33 L8 36Z" fill="#fff" stroke="#1E1B4B" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="16" cy="18" rx="2.4" ry="3.4" fill="#1E1B4B"/><ellipse cx="24" cy="18" rx="2.4" ry="3.4" fill="#1E1B4B"/><ellipse cx="20" cy="26" rx="2.6" ry="3" fill="#1E1B4B"/>',
    congelado:(() => { const a = [0,1,2,3,4,5,6,7].map(k => k*Math.PI/4); let d = ''; a.forEach(t => d += `M20 20L${(20 + Math.cos(t)*18).toFixed(1)} ${(20 + Math.sin(t)*18).toFixed(1)}`); [6,11,16].forEach(r => { d += 'M' + a.map(t => `${(20 + Math.cos(t)*r).toFixed(1)} ${(20 + Math.sin(t)*r).toFixed(1)}`).join('L') + 'Z'; });
      return `<path d="${d}" fill="none" stroke="#fff" stroke-width="3.6" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#1E1B4B" stroke-width="1.6" stroke-linejoin="round"/><circle cx="29" cy="30" r="3.4" fill="#1E1B4B" stroke="#fff" stroke-width="1.4"/>`; })(),
    troca:'<path d="M6 16 H34 L32 20 Q34 34 20 36 Q6 34 8 20Z" fill="#1C1917" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="20" cy="16" rx="14" ry="3.5" fill="#84CC16" stroke="#fff" stroke-width="2"/><circle cx="14" cy="11" r="3" fill="#A3E635" stroke="#fff" stroke-width="1.5"/><circle cx="23" cy="7.5" r="2.2" fill="#A3E635" stroke="#fff" stroke-width="1.5"/><path d="M11 35 L9 39 M29 35 L31 39" stroke="#1C1917" stroke-width="3" stroke-linecap="round"/>',
    checkpoint:'<path d="M9 37 V16 A11 11 0 0 1 31 16 V37Z" fill="#A8A29E" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><path d="M20 14 V28 M15 19 H25" stroke="#44403C" stroke-width="3" stroke-linecap="round"/><rect x="5" y="34" width="30" height="5" rx="2.5" fill="#4D7C0F" stroke="#fff" stroke-width="1.5"/>'
  };
  H.extra = (tipo, s) => {
    const svg = ACC[tipo]; if(!svg) return '';
    const a = Math.round(s*.46);
    return `<span class="hw-acc" aria-hidden="true" style="width:${a}px;height:${a}px;right:${-Math.round(a*.28)}px;bottom:${-Math.round(a*.22)}px"><svg viewBox="0 0 40 40">${svg}</svg></span>`;
  };

  /* ---------- Teia (usada no fundo e no tabuleiro) ---------- */
  function teia(S, cor = 'rgba(255,255,255,.42)'){
    const ang = [0,18,36,54,72,90].map(a => a*Math.PI/180), P = (a, r) => [(Math.cos(a)*r).toFixed(1), (Math.sin(a)*r).toFixed(1)];
    let d = ''; ang.forEach(a => { const [x, y] = P(a, S); d += `M0 0L${x} ${y}`; });
    [.28,.5,.72,.94].forEach(k => { const r = k*S; for(let i = 0; i < ang.length - 1; i++){ const [x1, y1] = P(ang[i], r), [x2, y2] = P(ang[i+1], r), [cx, cy] = P((ang[i] + ang[i+1])/2, r*.86); d += `M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`; } });
    return `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" style="display:block" aria-hidden="true"><path d="${d}" fill="none" stroke="${cor}" stroke-width="1.6"/></svg>`;
  }

  /* ---------- Fundo noturno (todas as telas) ---------- */
  const CACHE = new Map();
  H.fundo = (modo = 'discreto', semente = 7) => {
    const ck = modo + '|' + semente; if(CACHE.has(ck)) return CACHE.get(ck);
    const r = mulberry32(semente*101 + 3), festa = modo === 'festa';
    const pontos = (n, a) => Array.from({length:n}, () => `${Math.round(r()*1920)}px ${Math.round(r()*760)}px 0 0 rgba(255,255,255,${(a + r()*.4).toFixed(2)})`).join(',');
    const nuvens = [[180,90,380,58],[820,170,300,44],[1340,250,420,60]].map(([x, y, w, d]) => `<div class="hw-nuvem" style="left:${x}px;top:${y}px;width:${w}px;animation-duration:${d}s"></div>`).join('');
    const morcegos = [[120,22,0,64],[260,30,9,48],[420,26,4,56],[190,34,15,40],[560,28,20,52],[340,24,12,44]].map(([y, d, del, w], i) => `<div class="hw-voo${i % 2 ? ' hw-voo--volta' : ''}" style="top:${y}px;animation-duration:${d}s;animation-delay:-${del}s"><div class="hw-bat" style="width:${w}px;height:${Math.round(w/2)}px;animation-delay:-${(i*.07).toFixed(2)}s"></div></div>`).join('');
    let cai = '';
    if(festa){ const tipos = ['hw-img-abob','hw-img-bat','hw-img-fant']; for(let i = 0; i < 36; i++){ const t = tipos[i % 3], w = t === 'hw-img-bat' ? 54 : 44;
      cai += `<i class="cai hw-cai-i ${t}" style="left:${Math.round(r()*1880)}px;top:-60px;width:${w}px;height:${t === 'hw-img-bat' ? 28 : 44}px;animation-duration:${(6 + r()*5).toFixed(1)}s;animation-delay:-${(r()*10).toFixed(1)}s"></i>`; } }
    const h = `<div class="abs hw-ceu" style="inset:0;overflow:hidden">
      <div class="abs" style="left:0;top:0;width:2px;height:2px;border-radius:50%;box-shadow:${pontos(80, .25)}"></div>
      <div class="abs hw-pisca" style="left:0;top:0;width:3px;height:3px;border-radius:50%;box-shadow:${pontos(26, .5)}"></div>
      <div class="abs hw-lua" style="right:300px;top:34px;width:210px;height:210px"></div>
      ${nuvens}
      <div class="abs" style="left:0;top:0">${teia(250)}</div>
      <div class="abs" style="right:0;bottom:0;transform:scale(-1,-1)">${teia(270)}</div>
      <div class="abs hw-nevoa" style="left:-200px;bottom:-70px;width:1500px;height:300px"></div>
      <div class="abs hw-nevoa hw-nevoa--b" style="right:-260px;bottom:-50px;width:1400px;height:260px"></div>
      <div class="abs hw-fant" style="left:18px;top:640px;width:46px;height:56px"></div>
      <div class="abs hw-fant" style="right:26px;top:300px;width:40px;height:48px;animation-delay:-1.4s"></div>
      ${morcegos}${cai}</div>`;
    CACHE.set(ck, h); return h;
  };

  /* ---------- Cenário do tabuleiro (fica por baixo das casas: nunca cobre casa nem peão) ---------- */
  const TRILHA = 'M163 620 H997 A87 87 0 0 0 997 446 H163 A87 87 0 0 1 163 272 H997 A87 87 0 0 0 997 98 H163';
  /* Peças de cenário em silhueta: pedra gasta, ferro, luz quente. Sem contorno branco. */
  const abob = (cx, cy, w) => { const h = Math.round(w*.82); return '<div class="abs hw-abob" style="left:' + Math.round(cx - w/2) + 'px;top:' + Math.round(cy - h/2) + 'px;width:' + w + 'px;height:' + h + 'px"><svg viewBox="0 0 60 50" width="' + w + '" height="' + h + '" style="position:relative;display:block"><defs><radialGradient id="hw-ab-g" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#C2410C"/><stop offset=".65" stop-color="#9A3412"/><stop offset="1" stop-color="#431407"/></radialGradient></defs><ellipse cx="30" cy="47" rx="24" ry="3" fill="#000" opacity=".5"/><path d="M29 9 Q28 3 33 1 L34 3 Q31 5 32 9Z" fill="#2B1D10"/><ellipse cx="17" cy="29" rx="13" ry="17" fill="url(#hw-ab-g)"/><ellipse cx="43" cy="29" rx="13" ry="17" fill="url(#hw-ab-g)"/><ellipse cx="30" cy="28" rx="15" ry="19" fill="url(#hw-ab-g)"/><path d="M30 10 Q25 28 30 47 M30 10 Q35 28 30 47" stroke="#000" stroke-opacity=".3" stroke-width="1.2" fill="none"/><g fill="#FBBF24"><path d="M17 25 L24 21 L23 28Z"/><path d="M43 25 L36 21 L37 28Z"/><path d="M15 34 Q30 43 45 34 L41 34 L39 37 L36 34.5 L33 38 L30 35 L27 38 L24 34.5 L21 37 L19 34Z"/></g><g fill="#FEF3C7" opacity=".8"><path d="M19 25 L23 23 L22.5 26.5Z"/><path d="M41 25 L37 23 L37.5 26.5Z"/></g></svg></div>'; };
  const lapide = (cx, cy, w, rot = 0) => { const h = Math.round(w*1.27); return '<svg class="abs" viewBox="0 0 44 56" width="' + w + '" height="' + h + '" style="left:' + Math.round(cx - w/2) + 'px;top:' + Math.round(cy - h/2) + 'px;transform:rotate(' + rot + 'deg)"><defs><linearGradient id="hw-lp-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5A5363"/><stop offset="1" stop-color="#2A2632"/></linearGradient></defs><ellipse cx="22" cy="54" rx="21" ry="2.6" fill="#000" opacity=".55"/><path d="M6 54 V21 A16 16 0 0 1 38 21 V54Z" fill="url(#hw-lp-g)"/><path d="M8 52 V21.5 A14 14 0 0 1 17 8.5" stroke="#8A8294" stroke-width="1.2" fill="none" opacity=".6"/><path d="M22 18 V40 M15 25 H29" stroke="#1C1922" stroke-width="3.2" stroke-linecap="square"/><path d="M31 13 L28 22 L32 27 L30 33" stroke="#1C1922" stroke-width="1" fill="none"/><path d="M3 55 Q9 47 14 52 Q18 46 22 51 Q27 46 31 52 Q36 47 41 55Z" fill="#1F2A1B"/></svg>'; };
  const velas = (x, y) => [[0,22],[22,30],[44,18]].map(([dx, hh], i) => { const cx = x + dx, by = y + 30;
    return '<div class="abs" style="left:' + (cx - 14) + 'px;top:' + (by - hh - 30) + 'px;width:38px;height:38px;border-radius:50%;background:radial-gradient(circle, rgba(251,191,36,.32), transparent 70%)"></div><div class="abs" style="left:' + cx + 'px;top:' + (by - hh) + 'px;width:10px;height:' + hh + 'px;border-radius:2px;background:linear-gradient(90deg,#D6CDB8,#B8AD94 60%,#7D7260);box-shadow:0 3px 4px rgba(0,0,0,.6)"></div><div class="abs hw-chama" style="left:' + (cx + 1) + 'px;top:' + (by - hh - 13) + 'px;width:8px;height:13px;animation-delay:-' + (i*.3).toFixed(1) + 's"></div>'; }).join('');
  const arvore = (cx, cy) => { const d = 'M28 64 Q27 46 29 32 M28.5 42 Q20 34 13 27 M29 35 Q37 26 43 17 M13 27 Q10 20 7 13 M13 27 Q17 19 19 11 M43 17 Q46 11 49 7 M43 17 Q48 19 52 20 M29 32 Q27 21 25 9';
    return '<svg class="abs" viewBox="0 0 56 66" width="64" height="76" style="left:' + (cx - 32) + 'px;top:' + (cy - 40) + 'px"><path d="' + d + '" stroke="#06040A" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M28 64 Q27 46 29 32" stroke="#06040A" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M26.5 62 Q25.5 46 27.5 33" stroke="#6E6480" stroke-width="1" fill="none" opacity=".45"/></svg>'; };
  const MANSAO = '<svg class="abs" viewBox="0 0 92 200" width="92" height="200" style="left:6px;top:8px" aria-hidden="true"><g fill="#0B0811" stroke="#5E5470" stroke-width="1" stroke-opacity=".5"><path d="M8 196 V96 H36 V120 H56 V80 H84 V196Z"/><path d="M2 98 L22 52 L42 98Z M50 82 L70 26 L90 82Z M30 122 L46 104 L62 122Z"/></g><path d="M70 26 V12 M22 52 V42" stroke="#0B0811" stroke-width="2"/><rect x="63" y="92" width="14" height="18" fill="#F59E0B" opacity=".85"/><rect x="15" y="140" width="13" height="16" fill="#F59E0B" opacity=".55"/><rect x="15" y="106" width="13" height="16" fill="#1A1424"/><rect x="63" y="124" width="14" height="18" fill="#1A1424"/><rect x="63" y="156" width="14" height="18" fill="#1A1424"/><path d="M63 101 H77 M70 92 V110 M15 148 H28 M21.5 140 V156" stroke="#0B0811" stroke-width="1.6"/><circle cx="70" cy="64" r="5" fill="#1A1424" stroke="#5E5470" stroke-opacity=".5"/><path d="M38 196 V172 A8 8 0 0 1 54 172 V196Z" fill="#000"/><rect x="58" y="88" width="24" height="26" fill="#F59E0B" opacity=".12"/></svg>';
  const PORTAO = '<svg class="abs" viewBox="0 0 92 150" width="92" height="150" style="left:6px;top:546px" aria-hidden="true"><path d="M20 62 Q46 30 72 62" fill="none" stroke="#0B0811" stroke-width="4"/>' + [28,37,46,55,64].map(x => { const t = x === 46 ? 40 : x === 37 || x === 55 ? 46 : 54; return '<path d="M' + x + ' 150 V' + t + '" stroke="#0B0811" stroke-width="3"/><path d="M' + (x - 3) + ' ' + (t + 4) + ' L' + x + ' ' + (t - 4) + ' L' + (x + 3) + ' ' + (t + 4) + 'Z" fill="#0B0811"/>'; }).join('') + '<path d="M20 104 H72 M20 112 H72" stroke="#0B0811" stroke-width="3"/><rect x="2" y="34" width="18" height="116" fill="#3A3442"/><rect x="72" y="34" width="18" height="116" fill="#3A3442"/><path d="M4 36 V148 M74 36 V148" stroke="#6E6480" stroke-width="1" opacity=".5"/><rect x="0" y="28" width="22" height="7" fill="#4A4354"/><rect x="70" y="28" width="22" height="7" fill="#4A4354"/><circle cx="11" cy="20" r="11" fill="#FBBF24" opacity=".18"/><circle cx="81" cy="20" r="11" fill="#FBBF24" opacity=".18"/><path d="M6 27 H16 L14 14 H8Z M76 27 H86 L84 14 H78Z" fill="#0B0811"/><rect x="9" y="17" width="4" height="7" fill="#FBBF24"/><rect x="79" y="17" width="4" height="7" fill="#FBBF24"/><path d="M8 14 L11 10 L14 14 M78 14 L81 10 L84 14" fill="#0B0811"/></svg>';
  let DECOR = null;
  H.decor = () => {
    if(DECOR) return DECOR;
    const spots = [[290,518,64,34],[770,514,80,38],[400,342,70,34],[860,342,60,32],[560,166,76,36]];
    DECOR = '<div class="abs" style="inset:0;background-image:radial-gradient(rgba(255,255,255,.03) 1px, transparent 1.6px),radial-gradient(rgba(0,0,0,.28) 2px, transparent 3px);background-size:23px 19px,37px 31px"></div>'
    + '<div class="abs hw-nevoa" style="left:-120px;top:380px;width:900px;height:220px;opacity:.6"></div><div class="abs hw-nevoa hw-nevoa--b" style="right:-140px;top:80px;width:800px;height:200px;opacity:.5"></div>'
    + '<svg width="1160" height="716" class="abs" style="left:0;top:0"><path d="' + TRILHA + '" fill="none" stroke="#18201A" stroke-width="112" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/><path d="' + TRILHA + '" fill="none" stroke="#08060B" stroke-width="100" stroke-linecap="round" stroke-linejoin="round"/><path d="' + TRILHA + '" fill="none" stroke="#24202B" stroke-width="90" stroke-linecap="round" stroke-linejoin="round"/><path d="' + TRILHA + '" fill="none" stroke="#35303D" stroke-width="72" stroke-dasharray="24 7" stroke-linejoin="round"/><path d="' + TRILHA + '" fill="none" stroke="#423C4B" stroke-width="34" stroke-dasharray="13 18" stroke-dashoffset="6" stroke-linejoin="round" opacity=".7"/></svg>'
    + spots.map(([l, t, w, hh], i) => i % 2 ? lapide(l + w/2, t + hh/2, 38, i === 1 ? -5 : 4) : abob(l + w/2, t + hh/2, 54)).join('')
    + velas(560, 520) + velas(660, 350) + velas(330, 178)
    + [[974,506],[140,334],[974,160]].map(([l, t]) => arvore(l + 23, t + 23)).join('')
    + MANSAO + PORTAO
    + '<div class="abs" style="right:0;bottom:0;transform:scale(-1,-1);opacity:.45">' + teia(96, 'rgba(220,210,235,.5)') + '</div><div class="abs" style="left:0;top:0;opacity:.35">' + teia(80, 'rgba(220,210,235,.5)') + '</div>';
    return DECOR;
  };

  /* ---------- Títulos, chaves e prévia do personagem ---------- */
  H.selo = onde => onde === 'abertura'
    ? '<div class="abs hw-selo" style="left:1240px;top:396px">Edição Halloween</div>'
    : '<div class="abs hw-titulo-txt" style="left:44px;top:26px;font-size:46px">OsvaldoLand — Edição Halloween</div>';
  const sw = on => `<span class="chave" style="width:84px;height:46px;padding:5px;background:${on ? '#F97316' : 'rgba(255,255,255,.28)'}"><span class="bola" style="width:36px;height:36px;transform:translateX(${on ? 38 : 0}px)"></span></span>`;
  H.chaves = (topo) => `${H.on && !topo ? '<div class="abs hw-titulo-txt" style="left:80px;top:8px;font-size:38px">OsvaldoLand — Edição Halloween</div>' : ''}
    <div class="abs" style="right:${topo ? 60 : 80}px;${topo ? 'top:40px' : 'bottom:44px'};z-index:20;display:flex;flex-direction:column;align-items:flex-end;gap:10px">
      ${H.on ? `<button class="hw-chave" data-a="hwSom" role="switch" aria-checked="${H.somOn}">Sons do tema${sw(H.somOn)}</button>` : ''}
      <button class="hw-chave${H.on ? ' on' : ''}" data-a="halloween" role="switch" aria-checked="${H.on}">🎃 Modo Halloween${sw(H.on)}</button></div>`;
  H.pill = cor => `<span class="hw-pill" style="background:${PC[cor][0]};color:${PC[cor][2]}">${NOMES[cor] || ''}</span>`;
  let tPrevia = null;
  H.previa = (cor, num) => {
    const p = document.getElementById('palco'); if(!p || !NOMES[cor]) return;
    const old = document.getElementById('hw-previa'); if(old) old.remove();
    const el = document.createElement('div'); el.id = 'hw-previa'; el.className = 'hw-previa'; el.style.borderColor = PC[cor][0];
    el.innerHTML = `${H.peao(cor, num, 150)}<div style="display:flex;flex-direction:column;gap:6px;min-width:0"><div class="rotulo" style="font-size:22px;color:#7C2D12">SEU PERSONAGEM</div><div class="bal" style="font-size:40px;line-height:1.05;color:#1E1B4B">${NOME_COR[cor]} — ${NOMES[cor]}</div></div>`;
    p.appendChild(el); clearTimeout(tPrevia); tPrevia = setTimeout(() => el.remove(), 2600);
  };

  /* ---------- Sons do tema (sintetizados, sem arquivos). Respeitam o mudo geral (tecla M). ---------- */
  function ruido(c, t, dur, {de = 400, ate = 900, vol = .12} = {}){
    const n = Math.floor(c.sampleRate*dur), b = c.createBuffer(1, n, c.sampleRate), dd = b.getChannelData(0);
    for(let i = 0; i < n; i++) dd[i] = Math.random()*2 - 1;
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = b; f.type = 'bandpass'; f.Q.value = .9;
    f.frequency.setValueAtTime(de, t); f.frequency.linearRampToValueAtTime(ate, t + dur*.5); f.frequency.linearRampToValueAtTime(de*.7, t + dur);
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol, t + dur*.35); g.gain.linearRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(c.destination); s.start(t); s.stop(t + dur + .05);
  }
  const EXTRA = {
    risada: (c, t) => [0,1,2,3,4].forEach(i => nota(c, t + i*.14, 330 - i*22, .12, {tipo:'sawtooth', vol:.06, ate:250 - i*18})),
    vento: (c, t) => ruido(c, t, 1.8, {de:300, ate:800, vol:.1}),
    passo: (c, t) => { nota(c, t, 110, .07, {tipo:'triangle', vol:.12, ate:60}); ruido(c, t, .06, {de:1800, ate:1200, vol:.05}); }
  };
  H.somExtra = nome => {
    if(!H.somOn) return; const c = audio(); if(!c) return; const t = c.currentTime + .02;
    try { if(nome === 'vez') (Math.random() < .5 ? EXTRA.risada : EXTRA.vento)(c, t + .7); else if(nome === 'tempo') EXTRA.vento(c, t); else if(nome === 'vitoria') EXTRA.risada(c, t + 1.4); } catch(e){}
  };
  H.passo = () => { if(!H.somOn) return; const c = audio(); if(c) try { EXTRA.passo(c, c.currentTime + .01); } catch(e){} };
  return H;
})();
