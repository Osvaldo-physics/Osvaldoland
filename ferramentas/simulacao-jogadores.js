// Simulação de partidas com jogadores sintéticos (personas por faixa etária). Roda dentro da página,
// usando o gerarTabuleiro real do jogo. Regras: as do template (duelo, rebote, punição, casas especiais).
window.SIM = function(opts){
  const R = mulberry32(opts.semente || 1), rnd = () => R();
  const FAIXAS = [
    {id:'8–12',  peso:.14, acc:[.66,.36,.16], ousadia:.35, prefMin:20, tolRev:2, tolCong:.9, troca:.6, compet:.6},
    {id:'13–17', peso:.16, acc:[.76,.50,.28], ousadia:.6,  prefMin:30, tolRev:3, tolCong:.5, troca:.4, compet:1.0},
    {id:'18–29', peso:.20, acc:[.86,.60,.38], ousadia:.55, prefMin:40, tolRev:3, tolCong:.4, troca:.3, compet:1.1},
    {id:'30–49', peso:.24, acc:[.86,.63,.42], ousadia:.45, prefMin:40, tolRev:3, tolCong:.4, troca:.4, compet:1.0},
    {id:'50–64', peso:.16, acc:[.83,.60,.42], ousadia:.35, prefMin:35, tolRev:2, tolCong:.5, troca:.7, compet:.8},
    {id:'65+',   peso:.10, acc:[.78,.55,.38], ousadia:.25, prefMin:30, tolRev:2, tolCong:.6, troca:1.0, compet:.6},
  ];
  const sorteiaFaixa = () => { let x = rnd(), a = 0; for(const f of FAIXAS){ a += f.peso; if(x < a) return f; } return FAIXAS[3]; };
  const MESAS = [[2,.12],[3,.12],[4,.2],[5,.14],[6,.14],[7,.08],[8,.08],[10,.06],[12,.06]];
  const sorteiaMesa = () => { let x = rnd(), a = 0; for(const [n,p] of MESAS){ a += p; if(x < a) return n; } return 4; };
  const pessoas = [], jogos = [];
  let nPessoas = 0;
  while(nPessoas < opts.total){
    const n = Math.min(sorteiaMesa(), opts.total - nPessoas < 2 ? 2 : 12);
    const js = Array.from({length:n}, (_, i) => { const f = sorteiaFaixa(), v = (rnd() - .5)*.16;
      return {i, f, acc:f.acc.map(a => Math.min(.97, Math.max(.05, a + v))), pos:0, cp:0, escudo:false, cong:false, marcas:new Set(),
        ev:{revs:0, casasPerdidas:0, cong:0, trocaVit:0, trocaUsou:0, boas:0, ultimoTurnos:0, rodadasSemAndar:0, maxAtras:0}}; });
    nPessoas += n;
    const grande = n >= 6, N = opts.trilha ? opts.trilha(n) : (grande ? 24 : 32);
    const cfg = {N, punicao:'volta1', rebote:true, vento:grande, retaFinal:grande, ...(opts.cfg || {})};
    const tab = gerarTabuleiro(N, Math.floor(rnd()*1e9)), casas = tab.casas, cps = tab.checkpoints;
    const atualizaCp = j => cps.forEach(c => { if(j.pos >= c) j.cp = Math.max(j.cp, c); });
    const mover = (j, d) => { const piso = d < 0 ? j.cp : 0, de = j.pos; j.pos = Math.max(piso, Math.min(N, j.pos + d)); atualizaCp(j); return j.pos - de; };
    const usaEscudo = j => { if(j.escudo){ j.escudo = false; return true; } return false; };
    const sabe = (j, d) => rnd() < j.acc[d-1];
    let turnos = 0, especiais = 0, lider = null, trocasLider = 0, vencedor = null, cartas = 0;
    const liderHist = [];
    const efeito = j => {
      const c = casas[j.pos]; if(!c || !c.efeito) return; const e = c.efeito;
      if(j.marcas.has(j.pos)) return; especiais++; cartas++;
      const mk = () => j.marcas.add(j.pos);
      if(e === 'atalho'){ mk(); mover(j, 2); j.ev.boas++; }
      else if(e === 'escorregao'){ if(usaEscudo(j)) return; mk(); const a = mover(j, -2); if(a < 0){ j.ev.revs++; j.ev.casasPerdidas -= a; } }
      else if(e === 'escudo'){ if(!j.escudo){ mk(); j.escudo = true; j.ev.boas++; } }
      else if(e === 'congelado'){ if(usaEscudo(j)) return; mk(); j.cong = true; j.ev.cong++; }
      else if(e === 'troca'){ const alvo = js.filter(o => o !== j && o.pos > j.pos && o.pos - j.pos <= 5).sort((a,b) => a.pos - b.pos)[0];
        if(!alvo || j.pos < alvo.cp) return; if(usaEscudo(alvo)) return; mk(); const p = j.pos; j.pos = alvo.pos; alvo.pos = p; atualizaCp(j); j.ev.trocaUsou++; alvo.ev.trocaVit++; alvo.ev.casasPerdidas += j.pos - p; }
      else if(e === 'todos'){ mk(); const quem = js.filter(o => sabe(o, 2)); if(quem.length){ const w = quem[Math.floor(rnd()*quem.length)]; mover(w, 1); if(w === j) j.ev.boas++; } }
    };
    let vez = 0;
    while(!vencedor && turnos < 600){
      const j = js[vez % n]; vez++; turnos++;
      if(j.cong){ j.cong = false; continue; }
      const outros = js.filter(o => o !== j), op = outros[Math.floor(rnd()*outros.length)];
      // escolha de dificuldade: ousadia + valor esperado com punição de 1 casa
      const ev = [1,2,3].map(d => d*j.acc[d-1] - (1 - j.acc[d-1])*(cfg.punicao === 'nenhuma' ? 0 : 1) + (rnd() - .5)*j.f.ousadia*2);
      let dif = ev.indexOf(Math.max(...ev)) + 1;
      if(cfg.retaFinal && j.pos >= N - 4 && dif === 1) dif = 2;
      const sJ = sabe(j, dif), sO = sabe(op, dif);
      let respondeu = null, certo = false;
      if(sJ && sO) respondeu = rnd() < .5 ? j : op, certo = true;
      else if(sJ){ respondeu = j; certo = true; } else if(sO){ respondeu = op; certo = true; }
      else if(rnd() < .55) respondeu = rnd() < .5 ? j : op;   // chuta e erra
      const ultimo = r => r.pos === Math.min(...js.map(x => x.pos)) && js.some(x => x.pos > r.pos);
      const acerta = r => { let c = dif; if(cfg.retaFinal && r.pos >= N - 4 && dif === 1) c = 0; if(c && cfg.vento && ultimo(r)) c++; const de = r.pos; mover(r, c); if(r.pos >= N){ vencedor = r; return; } if(r.pos !== de) efeito(r); if(r.pos >= N) vencedor = r; };
      if(respondeu && certo){
        // quem respondeu primeiro acertou (o adversário não tem rebote)
        acerta(respondeu);
      } else if(respondeu){
        // errou: punição (fim da rodada) e rebote do outro com a mesma pergunta
        const outro = respondeu === j ? op : j;
        if(cfg.punicao !== 'nenhuma' && !usaEscudo(respondeu)){ const a = mover(respondeu, -1); if(a < 0){ respondeu.ev.revs++; respondeu.ev.casasPerdidas -= a; } }
        if(cfg.rebote && sabe(outro, dif)) acerta(outro);
      }
      // métricas por turno
      const posMax = Math.max(...js.map(x => x.pos)), l = js.filter(x => x.pos === posMax);
      if(l.length === 1 && l[0] !== lider){ if(lider) trocasLider++; lider = l[0]; }
      liderHist.push(lider ? lider.i : -1);
      const posMin = Math.min(...js.map(x => x.pos));
      js.forEach(x => { if(x.pos === posMin && posMax > posMin) x.ev.ultimoTurnos++; x.ev.maxAtras = Math.max(x.ev.maxAtras, posMax - x.pos); });
    }
    const rodadas = Math.ceil(turnos / n), minutos = (turnos*68 + cartas*7)/60;
    const ordem = js.slice().sort((a,b) => b.pos - a.pos);
    const t3 = Math.floor(liderHist.length/3), liderTerco = liderHist[t3], decididoCedo = vencedor && liderHist.slice(t3).filter(x => x === vencedor.i).length/(liderHist.length - t3) > .8;
    const gapFinal = N - ordem[n-1].pos;
    jogos.push({n, N, minutos, rodadas, trocasLider, especiais, decididoCedo, liderTercoVenceu: vencedor && liderTerco === vencedor.i, gapUltimo: gapFinal/N, turnos});
    // satisfação de cada pessoa (0–10)
    js.forEach(p => {
      const f = p.f, e = p.ev, rank = ordem.indexOf(p);
      let s = 7.2;
      const over = Math.max(0, minutos/Math.max(1, n/4) - f.prefMin);   // tempo de espera percebido cresce com a mesa
      s -= over*.06;
      s -= Math.max(0, e.revs - f.tolRev)*.45*(f.id === '8–12' || f.id === '65+' ? 1.3 : 1);
      s -= e.cong*f.tolCong;
      s -= e.trocaVit*f.troca; s += e.trocaUsou*.35;
      s += Math.min(1.2, e.boas*.3);
      s += (trocasLider >= 3 ? .7 : trocasLider >= 1 ? .3 : -.4)*f.compet;
      if(decididoCedo) s -= .9*f.compet;
      if(rank === 0) s += 1.2; else if(rank === n - 1 && (N - p.pos)/N > .4) s -= 1.1;
      if(e.ultimoTurnos/turnos > .6) s -= .8;
      pessoas.push({faixa:f.id, n, s:Math.max(0, Math.min(10, s)), ev:e, rank, venceu:rank === 0, minutos, decididoCedo, trocasLider});
    });
  }
  // agregados
  const media = a => a.reduce((x,y) => x + y, 0)/Math.max(1, a.length);
  const porFaixa = {};
  FAIXAS.forEach(f => { const ps = pessoas.filter(p => p.faixa === f.id);
    porFaixa[f.id] = {pessoas:ps.length, nota:+media(ps.map(p => p.s)).toFixed(2), recuos:+media(ps.map(p => p.ev.revs)).toFixed(2), congel:+media(ps.map(p => p.ev.cong)).toFixed(2), trocaVit:+media(ps.map(p => p.ev.trocaVit)).toFixed(2), vitorias:+(100*media(ps.map(p => p.venceu ? 1 : 0))).toFixed(1)}; });
  const reclam = {
    longa:+(100*media(pessoas.map(p => p.minutos/Math.max(1, p.n/4) > FAIXAS.find(f => f.id === p.faixa).prefMin ? 1 : 0))).toFixed(1),
    muitoRecuo:+(100*media(pessoas.map(p => p.ev.revs > FAIXAS.find(f => f.id === p.faixa).tolRev ? 1 : 0))).toFixed(1),
    trocaInjusta:+(100*media(pessoas.map(p => p.ev.trocaVit > 0 ? 1 : 0))).toFixed(1),
    decididoCedo:+(100*media(jogos.map(g => g.decididoCedo ? 1 : 0))).toFixed(1),
    semReviravolta:+(100*media(jogos.map(g => g.trocasLider === 0 ? 1 : 0))).toFixed(1),
    poucasBoas:+(100*media(pessoas.map(p => p.ev.boas === 0 ? 1 : 0))).toFixed(1),
    congelado:+(100*media(pessoas.map(p => p.ev.cong > 0 ? 1 : 0))).toFixed(1),
  };
  const porTrilha = {}; [24,32,48].forEach(N => { const g = jogos.filter(x => x.N === N); if(g.length) porTrilha[N] = {jogos:g.length, min:+media(g.map(x => x.minutos)).toFixed(1), trocasLider:+media(g.map(x => x.trocasLider)).toFixed(2), especiaisPorJogo:+media(g.map(x => x.especiais)).toFixed(1), decididoCedo:+(100*media(g.map(x => x.decididoCedo ? 1 : 0))).toFixed(0), liderTercoVence:+(100*media(g.map(x => x.liderTercoVenceu ? 1 : 0))).toFixed(0)}; });
  return {pessoas:pessoas.length, jogos:jogos.length, nota:+media(pessoas.map(p => p.s)).toFixed(2), porFaixa, reclam, porTrilha};
};
