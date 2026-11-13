/* ===== OsvaldoLand · Trilha sonora (src/musica.js) =====
   Música de fundo 100% sintetizada pelo navegador (Web Audio): nenhum arquivo de áudio.
   128 BPM, 16 compassos em loop (parte A + parte B), sem voz.
   Camadas: bumbo/palmas/chimbal, "tic-tac" de relógio, baixo saltitante, pizzicato,
   sintetizador principal, glockenspiel e metais. Modo "tensão" (perguntas/duelo) reforça o relógio.
   API: MUSICA.tocar(ctx) · MUSICA.parar() · MUSICA.tensao(bool) · MUSICA.volume(0–1) · MUSICA.tocando */
(function(){
  const BPM = 128, PASSO = 60 / BPM / 4, ADIANTE = .14, INTERVALO = 25;
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  // Acordes por compasso: [fundamental do baixo, tríade do pizzicato]
  const AC = { C:[48,[60,64,67]], Am:[45,[57,60,64]], F:[41,[57,60,65]], G:[43,[55,59,62]], Em:[40,[55,59,64]] };
  const PROG = ['C','Am','F','G','C','Am','F','G', 'F','G','Em','Am','F','G','C','G'];
  // Melodia: por compasso, [passo (0–15), nota MIDI, duração em passos]
  const MEL = [
    [[0,72,2],[2,76,2],[4,79,3],[8,76,1],[10,79,2],[12,84,4]],
    [[0,81,2],[2,79,2],[4,76,2],[6,72,2],[8,74,3],[12,76,4]],
    [[0,77,2],[2,81,2],[4,84,3],[8,81,1],[10,79,2],[12,77,2],[14,76,2]],
    [[0,74,3],[4,79,2],[6,77,2],[8,76,2],[10,74,2],[12,71,4]],
    [[0,72,2],[2,76,2],[4,79,3],[8,76,1],[10,79,2],[12,84,2],[14,86,2]],
    [[0,88,3],[4,84,2],[6,81,2],[8,83,2],[10,84,2],[12,81,4]],
    [[0,77,2],[2,81,2],[4,84,2],[6,86,2],[8,84,2],[10,81,2],[12,77,2],[14,79,2]],
    [[0,83,4],[4,79,2],[6,74,2],[8,79,6]],
    [[0,69,2],[3,72,2],[6,77,2],[8,76,2],[10,77,2],[12,81,4]],
    [[0,79,2],[3,74,2],[6,71,2],[8,74,2],[10,79,2],[12,83,4]],
    [[0,76,2],[3,79,2],[6,83,2],[8,84,2],[10,83,2],[12,79,4]],
    [[0,81,6],[8,84,2],[10,83,2],[12,81,2],[14,79,2]],
    [[0,77,2],[2,79,2],[4,81,2],[6,84,2],[8,89,4],[12,86,2],[14,84,2]],
    [[0,86,3],[4,83,2],[6,79,2],[8,83,2],[10,86,2],[12,91,4]],
    [[0,88,2],[2,84,2],[4,79,2],[6,84,2],[8,88,4],[12,86,2],[14,84,2]],
    [[0,83,2],[2,79,2],[4,74,2],[6,79,2],[8,71,2],[10,74,2],[12,79,2],[14,83,2]]
  ];
  const BAIXO = [[0,0],[2,12],[3,0],[5,0],[6,7],[8,0],[10,12],[11,0],[13,7],[14,12],[15,10]];
  const ARP = [0,1,2,1,2,1,0,2];

  const M = { tocando:false, ctx:null, _vol:.55, _tensao:0 };
  let mestre, comp, ruido, timer = null, passo = 0, proxT = 0;

  function montar(ctx){
    if(M.ctx === ctx && mestre) return;
    M.ctx = ctx;
    comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = .004; comp.release.value = .2;
    mestre = ctx.createGain(); mestre.gain.value = 0;
    mestre.connect(comp); comp.connect(ctx.destination);
    const n = ctx.sampleRate; ruido = ctx.createBuffer(1, n, n); const d = ruido.getChannelData(0); for(let i = 0; i < n; i++) d[i] = Math.random()*2 - 1;
  }
  const env = (g, t, a, pico, dur, fim = .0001) => { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(pico, t + a); g.gain.exponentialRampToValueAtTime(fim, t + dur); };
  function osc(t, f, dur, {tipo='square', vol=.1, a=.005, filtro=0, q=1, vib=0, destino=mestre, glide=0} = {}){
    const c = M.ctx, o = c.createOscillator(), g = c.createGain(); o.type = tipo; o.frequency.setValueAtTime(f, t);
    if(glide) o.frequency.exponentialRampToValueAtTime(f*glide, t + dur);
    let ult = o;
    if(filtro){ const bq = c.createBiquadFilter(); bq.type = 'lowpass'; bq.frequency.setValueAtTime(filtro, t); bq.frequency.exponentialRampToValueAtTime(Math.max(200, filtro*.35), t + dur); bq.Q.value = q; o.connect(bq); ult = bq; }
    if(vib){ const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = 5.5; lg.gain.value = vib; l.connect(lg); lg.connect(o.frequency); l.start(t + .08); l.stop(t + dur + .05); }
    ult.connect(g); g.connect(destino); env(g, t, a, vol, dur); o.start(t); o.stop(t + dur + .05);
  }
  function barulho(t, dur, {vol=.1, tipo='highpass', f=7000, q=.7} = {}){
    const c = M.ctx, s = c.createBufferSource(), bq = c.createBiquadFilter(), g = c.createGain();
    s.buffer = ruido; bq.type = tipo; bq.frequency.value = f; bq.Q.value = q; s.connect(bq); bq.connect(g); g.connect(mestre);
    env(g, t, .002, vol, dur); s.start(t, Math.random()*.5); s.stop(t + dur + .02);
  }
  const bumbo = t => { osc(t, 150, .32, {tipo:'sine', vol:.55, a:.002, glide:.28}); osc(t, 60, .2, {tipo:'triangle', vol:.25, a:.002}); };
  const palma = t => { [0, .011, .022].forEach(d => barulho(t + d, .09, {vol:.16, tipo:'bandpass', f:1500, q:1.1})); barulho(t, .16, {vol:.06, tipo:'bandpass', f:2200}); };
  const chimbal = (t, aberto) => barulho(t, aberto ? .16 : .035, {vol:aberto ? .05 : .045, f:8000});
  const tic = (t, alto, vol) => { osc(t, alto ? 2600 : 1900, .03, {tipo:'sine', vol, a:.001}); osc(t, alto ? 5200 : 3800, .015, {tipo:'sine', vol:vol*.4, a:.001}); };

  function agendar(p, t){
    const comp_ = Math.floor(p / 16) % 16, s = p % 16, parteB = comp_ >= 8, ac = AC[PROG[comp_]], virada = (comp_ === 7 || comp_ === 15) && s >= 12;
    // Bateria
    if(s % 4 === 0 && !(virada && s > 12)) bumbo(t);
    if(s === 7 && parteB) bumbo(t);
    if(s === 4 || s === 12) palma(t);
    if(virada) barulho(t, .06, {vol:.08 + (s - 12)*.02, tipo:'bandpass', f:1800, q:.9});
    if(s % 2 === 0) chimbal(t, s % 4 === 2 && s === 14);
    else if(parteB) chimbal(t, false);
    // Relógio: tic-tac em cada tempo; na tensão vira semicolcheia e sobe o volume
    const tv = .035 + M._tensao*.07;
    if(s % 4 === 0) tic(t, true, tv); else if(s % 4 === 2) tic(t, false, tv*.8); else if(M._tensao) tic(t, false, tv*.35);
    // Baixo saltitante
    BAIXO.forEach(([ps, iv]) => { if(ps === s) osc(t, hz(ac[0] - 12 + iv), PASSO*1.6, {tipo:'sawtooth', vol:.16, filtro:1400, q:6}); });
    if(s % 4 === 0) osc(t, hz(ac[0] - 24), PASSO*3, {tipo:'sine', vol:.16});
    // Pizzicato (orquestra) em colcheias
    if(s % 2 === 0){ const tri = ac[1], n = tri[ARP[(s/2) % 8]] + (s >= 8 && parteB ? 12 : 0); osc(t, hz(n), .14, {tipo:'triangle', vol:.08, a:.002, filtro:3200, q:2}); }
    // Melodia principal (sintetizador) + glockenspiel dobrando na segunda metade de cada parte
    MEL[comp_].forEach(([ps, n, d]) => { if(ps !== s) return;
      const dur = d*PASSO*.92;
      osc(t, hz(n), dur, {tipo:'square', vol:.065, a:.006, filtro:4200, q:1.5, vib:d >= 3 ? 4 : 0});
      osc(t, hz(n)*1.005, dur, {tipo:'sawtooth', vol:.03, a:.01, filtro:2600});
      if(comp_ % 8 >= 4) osc(t, hz(n + 12), .5, {tipo:'sine', vol:.05, a:.001});
    });
    // Metais: ataques sincopados na parte B; "fagote" comendo o contratempo na parte A
    if(parteB && (s === 0 || s === 6 || s === 10)) ac[1].forEach(n => osc(t, hz(n), PASSO*(s === 0 ? 3 : 1.5), {tipo:'sawtooth', vol:.045, a:.012, filtro:2400, q:3}));
    if(!parteB && (s === 3 || s === 11) && comp_ % 2) osc(t, hz(ac[1][2] - 12), PASSO*1.2, {tipo:'sawtooth', vol:.05, filtro:900, q:4});
    // Prato no começo do loop e da parte B
    if(s === 0 && (comp_ === 0 || comp_ === 8)) barulho(t, 1.1, {vol:.07, f:5500});
  }
  function laco(){
    const c = M.ctx; if(!c) return;
    while(proxT < c.currentTime + ADIANTE){ agendar(passo, proxT); passo = (passo + 1) % 256; proxT += PASSO; }
  }
  M.tocar = ctx => {
    if(!ctx) return; montar(ctx);
    if(ctx.state === 'suspended') ctx.resume();
    if(M.tocando) return;
    M.tocando = true; passo = 0; proxT = ctx.currentTime + .08;
    mestre.gain.cancelScheduledValues(ctx.currentTime); mestre.gain.setValueAtTime(mestre.gain.value, ctx.currentTime); mestre.gain.linearRampToValueAtTime(M._vol*.6, ctx.currentTime + 1.2);
    laco(); timer = setInterval(laco, INTERVALO);
  };
  M.parar = () => {
    if(!M.tocando) return; M.tocando = false;
    const c = M.ctx, t = c.currentTime; mestre.gain.cancelScheduledValues(t); mestre.gain.setValueAtTime(mestre.gain.value, t); mestre.gain.linearRampToValueAtTime(0, t + .5);
    setTimeout(() => { if(!M.tocando){ clearInterval(timer); timer = null; } }, 520);
  };
  M.tensao = on => { M._tensao = on ? 1 : 0; };
  M.volume = v => { M._vol = Math.max(0, Math.min(1, v)); if(M.tocando && mestre) mestre.gain.setTargetAtTime(M._vol*.6, M.ctx.currentTime, .1); };
  window.MUSICA = M;
})();
