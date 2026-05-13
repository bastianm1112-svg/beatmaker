/* ═══════════════════════════════════════════
   SAMPLES — Sample library manifest & loader
════════════════════════════════════════════ */

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/bastianm1112-svg/beatmaker@main/samples/';

// ── Drum Sample Paths ──────────────────────
const DRUM_SAMPLES = {
  kick: {
    trap:       'drums/kick/kick-trap-01.mp3',
    heavy:      'drums/kick/kick-heavy-01.mp3',
    distorted:  'drums/kick/kick-distorted-01.mp3',
    sub:        'drums/kick/kick-sub-01.mp3',
    punchy:     'drums/kick/kick-punchy-01.mp3',
    electronic: 'drums/kick/kick-electronic-01.mp3',
    boomy:      'drums/kick/kick-boomy-01.mp3',
    clicky:     'drums/kick/kick-clicky-01.mp3',
    acoustic:   'drums/kick/kick-acoustic-01.mp3',
    layered:    'drums/kick/kick-layered-01.mp3',
  },
  snare: {
    crisp:   'drums/snare/snare-crisp-01.mp3',
    fat:     'drums/snare/snare-fat-01.mp3',
    wood:    'drums/snare/snare-wood-01.mp3',
    vinyl:   'drums/snare/snare-vinyl-01.mp3',
    pitched: 'drums/snare/snare-pitched-01.mp3',
    rimshot: 'drums/snare/snare-rimshot-01.mp3',
  },
  clap: {
    trap:    'drums/clap/clap-trap-01.mp3',
    wide:    'drums/clap/clap-wide-01.mp3',
    tight:   'drums/clap/clap-tight-01.mp3',
    layered: 'drums/clap/clap-layered-01.mp3',
    dry:     'drums/clap/clap-dry-01.mp3',
    reverb:  'drums/clap/clap-reverb-01.mp3',
  },
  hatClosed: {
    tight:  'drums/hat-closed/hat-closed-tight-01.mp3',
    loose:  'drums/hat-closed/hat-closed-loose-01.mp3',
    sizzle: 'drums/hat-closed/hat-closed-sizzle-01.mp3',
    crisp:  'drums/hat-closed/hat-closed-crisp-01.mp3',
    muted:  'drums/hat-closed/hat-closed-muted-01.mp3',
  },
  hatOpen: {
    short:  'drums/hat-open/hat-open-short-01.mp3',
    long:   'drums/hat-open/hat-open-long-01.mp3',
    airy:   'drums/hat-open/hat-open-airy-01.mp3',
    trashy: 'drums/hat-open/hat-open-trashy-01.mp3',
  },
  hatRoll: {
    stutter: 'drums/hat-roll/hat-roll-stutter-01.mp3',
    triplet: 'drums/hat-roll/hat-roll-triplet-01.mp3',
    fast:    'drums/hat-roll/hat-roll-fast-01.mp3',
    slow:    'drums/hat-roll/hat-roll-slow-01.mp3',
  },
};

const BASS_URLS = {
  'C0': 'drums/808/808-C0-01.mp3',
  'C1': 'drums/808/808-C1-01.mp3',
  'G1': 'drums/808/808-G1-01.mp3',
  'C2': 'drums/808/808-C2-01.mp3',
  'G2': 'drums/808/808-G2-01.mp3',
};

// ── Artist/Album Sample Profiles ───────────
const ARTIST_PROFILES = {
  kanye: {
    'The College Dropout':   { kick:'punchy',     snare:'fat',    clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'triplet', stabStyle:'vintage'     },
    'Late Registration':     { kick:'heavy',      snare:'fat',    clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'triplet', stabStyle:'orchestral'  },
    'Graduation':            { kick:'electronic', snare:'crisp',  clap:'wide',    hatClosed:'tight',  hatOpen:'short',  hatRoll:'stutter', stabStyle:'digital'     },
    '808s & Heartbreak':     { kick:'sub',        snare:'pitched',clap:'wide',    hatClosed:'muted',  hatOpen:'airy',   hatRoll:'slow',    stabStyle:'airy'        },
    'Yeezus':                { kick:'distorted',  snare:'crisp',  clap:'tight',   hatClosed:'sizzle', hatOpen:'short',  hatRoll:'stutter', stabStyle:'distorted'   },
    'The Life of Pablo':     { kick:'punchy',     snare:'fat',    clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'triplet', stabStyle:'vintage'     },
  },
  cudi: {
    'Man on the Moon':             { kick:'sub',        snare:'vinyl',   clap:'wide',    hatClosed:'muted',  hatOpen:'airy',   hatRoll:'slow',    stabStyle:'airy'       },
    'Man on the Moon II':          { kick:'sub',        snare:'vinyl',   clap:'wide',    hatClosed:'muted',  hatOpen:'airy',   hatRoll:'slow',    stabStyle:'dark'       },
    'Indicud':                     { kick:'electronic', snare:'crisp',   clap:'tight',   hatClosed:'tight',  hatOpen:'short',  hatRoll:'stutter', stabStyle:'digital'    },
    'Satellite Flight':            { kick:'sub',        snare:'vinyl',   clap:'wide',    hatClosed:'muted',  hatOpen:'airy',   hatRoll:'slow',    stabStyle:'airy'       },
    "Speedin' Bullet 2 Heaven":    { kick:'distorted',  snare:'wood',    clap:'dry',     hatClosed:'sizzle', hatOpen:'trashy', hatRoll:'fast',    stabStyle:'distorted'  },
    "Passion Pain Demon Slayin'":  { kick:'punchy',     snare:'fat',     clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'triplet', stabStyle:'orchestral' },
    'Man on the Moon III':         { kick:'sub',        snare:'vinyl',   clap:'wide',    hatClosed:'loose',  hatOpen:'airy',   hatRoll:'triplet', stabStyle:'airy'       },
  },
  travis: {
    'Owl Pharaoh':         { kick:'trap',       snare:'crisp',  clap:'wide',    hatClosed:'tight',  hatOpen:'airy',   hatRoll:'stutter', stabStyle:'detuned'    },
    'Days Before Rodeo':   { kick:'trap',       snare:'crisp',  clap:'trap',    hatClosed:'tight',  hatOpen:'airy',   hatRoll:'stutter', stabStyle:'dark'       },
    'Rodeo':               { kick:'punchy',     snare:'fat',    clap:'wide',    hatClosed:'loose',  hatOpen:'airy',   hatRoll:'triplet', stabStyle:'detuned'    },
    'Birds in the Trap':   { kick:'heavy',      snare:'fat',    clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'triplet', stabStyle:'dark'       },
    'Astroworld':          { kick:'punchy',     snare:'crisp',  clap:'wide',    hatClosed:'tight',  hatOpen:'airy',   hatRoll:'stutter', stabStyle:'bright'     },
    'Utopia':              { kick:'electronic', snare:'crisp',  clap:'wide',    hatClosed:'sizzle', hatOpen:'short',  hatRoll:'fast',    stabStyle:'digital'    },
  },
  drake: {
    'Thank Me Later':        { kick:'punchy',   snare:'crisp',  clap:'dry',     hatClosed:'tight',  hatOpen:'short',  hatRoll:'slow',    stabStyle:'clean'      },
    'Take Care':             { kick:'punchy',   snare:'crisp',  clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'slow',    stabStyle:'vintage'    },
    'Nothing Was the Same':  { kick:'punchy',   snare:'crisp',  clap:'wide',    hatClosed:'tight',  hatOpen:'short',  hatRoll:'slow',    stabStyle:'clean'      },
    "If You're Reading This":{ kick:'acoustic', snare:'wood',   clap:'dry',     hatClosed:'loose',  hatOpen:'airy',   hatRoll:'slow',    stabStyle:'vintage'    },
    'Views':                 { kick:'punchy',   snare:'crisp',  clap:'dry',     hatClosed:'tight',  hatOpen:'short',  hatRoll:'slow',    stabStyle:'clean'      },
    'Scorpion':              { kick:'punchy',   snare:'crisp',  clap:'wide',    hatClosed:'tight',  hatOpen:'short',  hatRoll:'slow',    stabStyle:'clean'      },
    'Certified Lover Boy':   { kick:'punchy',   snare:'fat',    clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'slow',    stabStyle:'vintage'    },
  },
  thug: {
    'Barter 6':               { kick:'trap',       snare:'fat',    clap:'wide',    hatClosed:'loose',  hatOpen:'airy',   hatRoll:'triplet', stabStyle:'bright'     },
    'Slime Season':           { kick:'trap',       snare:'crisp',  clap:'trap',    hatClosed:'sizzle', hatOpen:'short',  hatRoll:'stutter', stabStyle:'hard'       },
    'Jeffery':                { kick:'electronic', snare:'pitched',clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'triplet', stabStyle:'detuned'    },
    'Beautiful Thugger Girls':{ kick:'acoustic',   snare:'wood',   clap:'dry',     hatClosed:'loose',  hatOpen:'airy',   hatRoll:'slow',    stabStyle:'vintage'    },
    'So Much Fun':            { kick:'punchy',     snare:'crisp',  clap:'wide',    hatClosed:'tight',  hatOpen:'short',  hatRoll:'stutter', stabStyle:'bright'     },
    'Punk':                   { kick:'distorted',  snare:'wood',   clap:'dry',     hatClosed:'loose',  hatOpen:'trashy', hatRoll:'fast',    stabStyle:'distorted'  },
  },
  ken: {
    'A Great Chaos': { kick:'distorted', snare:'crisp', clap:'trap',    hatClosed:'sizzle', hatOpen:'short',  hatRoll:'fast',    stabStyle:'distorted'  },
    'Project X':     { kick:'distorted', snare:'crisp', clap:'trap',    hatClosed:'sizzle', hatOpen:'short',  hatRoll:'fast',    stabStyle:'distorted'  },
    'I Am Nothing':  { kick:'distorted', snare:'fat',   clap:'wide',    hatClosed:'sizzle', hatOpen:'airy',   hatRoll:'stutter', stabStyle:'hard'       },
    'X':             { kick:'distorted', snare:'crisp', clap:'trap',    hatClosed:'sizzle', hatOpen:'short',  hatRoll:'fast',    stabStyle:'distorted'  },
  },
  carti: {
    'Playboi Carti':   { kick:'sub',       snare:'pitched', clap:'wide',    hatClosed:'loose',  hatOpen:'airy',   hatRoll:'triplet', stabStyle:'airy'      },
    'Die Lit':         { kick:'punchy',    snare:'fat',     clap:'wide',    hatClosed:'loose',  hatOpen:'airy',   hatRoll:'triplet', stabStyle:'bright'    },
    'Whole Lotta Red': { kick:'distorted', snare:'crisp',   clap:'trap',    hatClosed:'sizzle', hatOpen:'short',  hatRoll:'stutter', stabStyle:'distorted' },
    'Music':           { kick:'distorted', snare:'vinyl',   clap:'layered', hatClosed:'sizzle', hatOpen:'trashy', hatRoll:'fast',    stabStyle:'detuned'   },
  },
  future: {
    'Pluto':             { kick:'heavy', snare:'fat',   clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'slow',    stabStyle:'dark'       },
    'DS2':               { kick:'heavy', snare:'fat',   clap:'trap',    hatClosed:'sizzle', hatOpen:'short',  hatRoll:'stutter', stabStyle:'dark'       },
    'EVOL':              { kick:'heavy', snare:'crisp', clap:'trap',    hatClosed:'loose',  hatOpen:'short',  hatRoll:'slow',    stabStyle:'dark'       },
    'HNDRXX':            { kick:'punchy',snare:'fat',   clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'slow',    stabStyle:'vintage'    },
    'The WIZRD':         { kick:'heavy', snare:'fat',   clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'slow',    stabStyle:'dark'       },
    'I Never Liked You': { kick:'heavy', snare:'crisp', clap:'trap',    hatClosed:'sizzle', hatOpen:'short',  hatRoll:'stutter', stabStyle:'dark'       },
  },
  uzi: {
    'Luv Is Rage':   { kick:'trap',       snare:'crisp',  clap:'wide',    hatClosed:'tight',  hatOpen:'airy',   hatRoll:'stutter', stabStyle:'hard'       },
    'Luv Is Rage 2': { kick:'punchy',     snare:'crisp',  clap:'wide',    hatClosed:'tight',  hatOpen:'airy',   hatRoll:'stutter', stabStyle:'bright'     },
    'Eternal Atake': { kick:'electronic', snare:'crisp',  clap:'wide',    hatClosed:'sizzle', hatOpen:'short',  hatRoll:'fast',    stabStyle:'digital'    },
    'The Pink Tape': { kick:'trap',       snare:'pitched',clap:'layered', hatClosed:'loose',  hatOpen:'airy',   hatRoll:'triplet', stabStyle:'detuned'    },
  },
  tyler: {
    'Goblin':                  { kick:'acoustic', snare:'wood',  clap:'dry',     hatClosed:'loose',  hatOpen:'airy',   hatRoll:'slow',    stabStyle:'vintage'    },
    'Wolf':                    { kick:'acoustic', snare:'wood',  clap:'dry',     hatClosed:'loose',  hatOpen:'airy',   hatRoll:'triplet', stabStyle:'vintage'    },
    'Cherry Bomb':             { kick:'distorted',snare:'wood',  clap:'dry',     hatClosed:'loose',  hatOpen:'trashy', hatRoll:'fast',    stabStyle:'distorted'  },
    'Flower Boy':              { kick:'acoustic', snare:'wood',  clap:'dry',     hatClosed:'loose',  hatOpen:'airy',   hatRoll:'triplet', stabStyle:'vintage'    },
    'IGOR':                    { kick:'punchy',   snare:'fat',   clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'triplet', stabStyle:'vintage'    },
    'Call Me If You Get Lost': { kick:'acoustic', snare:'wood',  clap:'dry',     hatClosed:'loose',  hatOpen:'airy',   hatRoll:'triplet', stabStyle:'vintage'    },
    'Chromakopia':             { kick:'punchy',   snare:'fat',   clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'triplet', stabStyle:'orchestral' },
  },
  toliver: {
    'Heaven or Hell':   { kick:'sub',    snare:'fat',   clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'slow',    stabStyle:'airy'       },
    'Life of a DON':    { kick:'punchy', snare:'crisp', clap:'wide',    hatClosed:'tight',  hatOpen:'airy',   hatRoll:'slow',    stabStyle:'clean'      },
    'Love Sick':        { kick:'sub',    snare:'fat',   clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'slow',    stabStyle:'dark'       },
    'Hardstone Psycho': { kick:'heavy',  snare:'fat',   clap:'trap',    hatClosed:'sizzle', hatOpen:'short',  hatRoll:'stutter', stabStyle:'detuned'    },
  },
  savage: {
    'Savage Mode':    { kick:'boomy',  snare:'crisp', clap:'trap',    hatClosed:'tight',  hatOpen:'short',  hatRoll:'slow',    stabStyle:'dark'       },
    'I Am > I Was':   { kick:'punchy', snare:'crisp', clap:'wide',    hatClosed:'tight',  hatOpen:'short',  hatRoll:'slow',    stabStyle:'clean'      },
    'Savage Mode II': { kick:'boomy',  snare:'crisp', clap:'trap',    hatClosed:'tight',  hatOpen:'short',  hatRoll:'slow',    stabStyle:'orchestral' },
    'american dream': { kick:'punchy', snare:'crisp', clap:'wide',    hatClosed:'tight',  hatOpen:'airy',   hatRoll:'slow',    stabStyle:'clean'      },
  },
};

// ── Loop Categories ────────────────────────
// Each entry generates `count` manifest entries with sequential file names
const LOOP_CATEGORIES = [
  // Chord loops (→ 80 total)
  { prefix:'loops/chords/chord-rage-dark',      bpm:155, key:'Cm', mood:['AGGRESSIVE','DARK'],              artists:['carti','ken','uzi'],         tags:['rage','dark','distorted'],    count:5 },
  { prefix:'loops/chords/chord-rage-bright',    bpm:150, key:'Am', mood:['AGGRESSIVE','ENERGETIC'],         artists:['ken','uzi','travis'],        tags:['rage','bright','hard'],       count:4 },
  { prefix:'loops/chords/chord-melodic-dark',   bpm:140, key:'Fm', mood:['DARK','MELANCHOLIC'],             artists:['future','travis','carti'],   tags:['melodic','dark','minor'],     count:5 },
  { prefix:'loops/chords/chord-melodic-bright', bpm:130, key:'Am', mood:['JOYFUL','ENERGETIC'],             artists:['thug','uzi','travis'],       tags:['melodic','bright'],           count:4 },
  { prefix:'loops/chords/chord-chill',          bpm:85,  key:'Dm', mood:['CHILL','MELANCHOLIC'],            artists:['cudi','kanye','tyler'],      tags:['chill','lofi','mellow'],      count:5 },
  { prefix:'loops/chords/chord-gospel',         bpm:90,  key:'Am', mood:['JOYFUL','EPIC'],                  artists:['kanye','tyler'],             tags:['gospel','soul','warm'],       count:4 },
  { prefix:'loops/chords/chord-psychedelic',    bpm:95,  key:'Gm', mood:['PSYCHEDELIC','HAZY'],             artists:['travis','cudi','tyler'],     tags:['psychedelic','washy'],        count:4 },
  { prefix:'loops/chords/chord-jazz',           bpm:90,  key:'Cm', mood:['CHILL','JOYFUL'],                 artists:['tyler','kanye'],             tags:['jazz','swing'],               count:4 },
  { prefix:'loops/chords/chord-dark-trap',      bpm:145, key:'Am', mood:['DARK','AGGRESSIVE'],              artists:['future','savage','travis'],  tags:['dark','trap','minor'],        count:5 },
  { prefix:'loops/chords/chord-ambient',        bpm:80,  key:'Dm', mood:['HAZY','PSYCHEDELIC','CHILL'],     artists:['cudi','toliver'],            tags:['ambient','pad'],              count:4 },
  { prefix:'loops/chords/chord-soul',           bpm:88,  key:'Bb', mood:['JOYFUL','SAD'],                   artists:['kanye','tyler','drake'],     tags:['soul','vintage','warm'],      count:4 },
  { prefix:'loops/chords/chord-rnb',            bpm:95,  key:'Ebm',mood:['JOYFUL','CHILL','SAD'],           artists:['drake','toliver','future'],  tags:['rnb','smooth'],               count:4 },
  { prefix:'loops/chords/chord-drill',          bpm:140, key:'Cm', mood:['DARK','AGGRESSIVE'],              artists:['savage','future','uzi'],     tags:['drill','dark','cold'],        count:4 },
  { prefix:'loops/chords/chord-cinematic',      bpm:85,  key:'Am', mood:['EPIC','SAD'],                     artists:['kanye','tyler','savage'],    tags:['cinematic','orchestral'],     count:4 },
  { prefix:'loops/chords/chord-neo-soul',       bpm:92,  key:'Gm', mood:['JOYFUL','MELANCHOLIC'],           artists:['tyler','toliver','kanye'],   tags:['neosoul','warm'],             count:4 },
  { prefix:'loops/chords/chord-boom-bap',       bpm:90,  key:'Cm', mood:['ENERGETIC','JOYFUL'],             artists:['tyler','kanye'],             tags:['boombap','vinyl'],            count:4 },
  { prefix:'loops/chords/chord-euphoric',       bpm:145, key:'Fm', mood:['ENERGETIC','JOYFUL','EPIC'],      artists:['travis','uzi','drake'],      tags:['euphoric','festival'],        count:4 },
  { prefix:'loops/chords/chord-experimental',   bpm:120, key:'Am', mood:['PSYCHEDELIC','DARK'],             artists:['tyler','cudi','carti'],      tags:['experimental','glitchy'],     count:4 },
  { prefix:'loops/chords/chord-emo',            bpm:140, key:'Fm', mood:['MELANCHOLIC','SAD','DARK'],       artists:['uzi','carti','travis'],      tags:['emo','dark','minor'],         count:4 },
  { prefix:'loops/chords/chord-orchestral',     bpm:80,  key:'Am', mood:['EPIC','MELANCHOLIC'],             artists:['kanye','tyler','savage'],    tags:['orchestral','strings','epic'],count:4 },
  // Melody loops (→ 60 total)
  { prefix:'loops/melody/melody-dark-synth',    bpm:145, key:'Cm', mood:['DARK','AGGRESSIVE'],              artists:['ken','carti','future'],      tags:['dark','synth','lead'],        count:5 },
  { prefix:'loops/melody/melody-bright-synth',  bpm:148, key:'Am', mood:['ENERGETIC','JOYFUL'],             artists:['uzi','thug','travis'],       tags:['bright','synth','catchy'],    count:5 },
  { prefix:'loops/melody/melody-piano-sad',     bpm:80,  key:'Fm', mood:['SAD','MELANCHOLIC'],              artists:['drake','kanye','future'],    tags:['piano','sad','emotional'],    count:4 },
  { prefix:'loops/melody/melody-piano-happy',   bpm:92,  key:'Am', mood:['JOYFUL','CHILL'],                 artists:['kanye','tyler','drake'],     tags:['piano','happy','warm'],       count:4 },
  { prefix:'loops/melody/melody-trap-lead',     bpm:140, key:'Gm', mood:['AGGRESSIVE','DARK'],              artists:['carti','ken','travis'],      tags:['trap','lead','dark'],         count:4 },
  { prefix:'loops/melody/melody-flute',         bpm:90,  key:'Dm', mood:['CHILL','MELANCHOLIC','HAZY'],     artists:['cudi','future','toliver'],   tags:['flute','chill','melodic'],    count:4 },
  { prefix:'loops/melody/melody-strings',       bpm:85,  key:'Am', mood:['SAD','EPIC','MELANCHOLIC'],       artists:['kanye','tyler','savage'],    tags:['strings','cinematic','epic'], count:4 },
  { prefix:'loops/melody/melody-808-lead',      bpm:145, key:'Cm', mood:['AGGRESSIVE','DARK'],              artists:['future','travis','savage'],  tags:['808','bass','melodic'],       count:4 },
  { prefix:'loops/melody/melody-vocal-chop',    bpm:88,  key:'Bb', mood:['JOYFUL','EPIC'],                  artists:['kanye','travis','tyler'],    tags:['vocal','chop','soulful'],     count:4 },
  { prefix:'loops/melody/melody-arp-bright',    bpm:138, key:'Fm', mood:['ENERGETIC','PSYCHEDELIC'],        artists:['travis','uzi','thug'],       tags:['arp','bright','synth'],       count:4 },
  { prefix:'loops/melody/melody-arp-dark',      bpm:142, key:'Am', mood:['DARK','PSYCHEDELIC'],             artists:['cudi','travis','carti'],     tags:['arp','dark','hypnotic'],      count:4 },
  { prefix:'loops/melody/melody-lo-fi',         bpm:85,  key:'Dm', mood:['CHILL','HAZY','MELANCHOLIC'],     artists:['tyler','cudi','kanye'],      tags:['lofi','tape','warm'],         count:4 },
  { prefix:'loops/melody/melody-rage-synth',    bpm:155, key:'Cm', mood:['AGGRESSIVE','ENERGETIC'],         artists:['ken','carti','uzi'],         tags:['rage','synth','hard'],        count:4 },
  { prefix:'loops/melody/melody-psychedelic',   bpm:90,  key:'Gm', mood:['PSYCHEDELIC','HAZY'],             artists:['travis','cudi','tyler'],     tags:['psychedelic','dreamy'],       count:4 },
  { prefix:'loops/melody/melody-gospel',        bpm:88,  key:'Ab', mood:['JOYFUL','EPIC'],                  artists:['kanye','tyler'],             tags:['gospel','uplifting','soul'],  count:5 },
  // Guitar loops (→ 40 total)
  { prefix:'loops/guitar/guitar-trap',          bpm:140, key:'Am', mood:['DARK','AGGRESSIVE','ENERGETIC'],  artists:['travis','thug','uzi'],       tags:['guitar','trap','electric'],   count:5 },
  { prefix:'loops/guitar/guitar-lofi',          bpm:85,  key:'Dm', mood:['CHILL','MELANCHOLIC','HAZY'],     artists:['tyler','cudi'],              tags:['guitar','lofi','warm'],       count:5 },
  { prefix:'loops/guitar/guitar-psychedelic',   bpm:95,  key:'Gm', mood:['PSYCHEDELIC','DARK'],             artists:['travis','tyler','cudi'],     tags:['guitar','psychedelic'],       count:5 },
  { prefix:'loops/guitar/guitar-clean',         bpm:90,  key:'Am', mood:['JOYFUL','CHILL'],                 artists:['tyler','drake','kanye'],     tags:['guitar','clean','bright'],    count:5 },
  { prefix:'loops/guitar/guitar-distorted',     bpm:120, key:'Cm', mood:['AGGRESSIVE','ENERGETIC'],         artists:['tyler','ken','thug'],        tags:['guitar','distorted','heavy'], count:5 },
  { prefix:'loops/guitar/guitar-slide',         bpm:88,  key:'Am', mood:['SAD','MELANCHOLIC','CHILL'],      artists:['tyler','kanye'],             tags:['guitar','slide','bluesy'],    count:5 },
  { prefix:'loops/guitar/guitar-acoustic',      bpm:85,  key:'Dm', mood:['JOYFUL','SAD','CHILL'],           artists:['tyler','drake','kanye'],     tags:['guitar','acoustic'],          count:5 },
  { prefix:'loops/guitar/guitar-funk',          bpm:105, key:'Bb', mood:['JOYFUL','ENERGETIC'],             artists:['tyler','kanye'],             tags:['guitar','funk','groove'],     count:5 },
  // Texture loops (→ 30 total)
  { prefix:'loops/texture/texture-atmospheric', bpm:80,  key:'Am', mood:['HAZY','PSYCHEDELIC','CHILL'],     artists:['cudi','travis','toliver'],   tags:['atmospheric','pad','drone'],  count:6 },
  { prefix:'loops/texture/texture-dark-drone',  bpm:75,  key:'Cm', mood:['DARK','AGGRESSIVE','HAZY'],       artists:['future','savage','ken'],     tags:['dark','drone','ominous'],     count:6 },
  { prefix:'loops/texture/texture-rain',        bpm:80,  key:'Dm', mood:['HAZY','CHILL','SAD'],             artists:['cudi','drake','future'],     tags:['rain','ambient','peaceful'],  count:6 },
  { prefix:'loops/texture/texture-noise',       bpm:140, key:'Am', mood:['AGGRESSIVE','DARK'],              artists:['ken','travis'],              tags:['noise','industrial','harsh'], count:6 },
  { prefix:'loops/texture/texture-ambient',     bpm:80,  key:'Fm', mood:['PSYCHEDELIC','CHILL'],            artists:['cudi','tyler','toliver'],    tags:['ambient','wash','dreamy'],    count:6 },
  // Drum loops (→ 25 total)
  { prefix:'loops/drum-loop/drumloop-trap-hard',  bpm:145, key:'Am', mood:['AGGRESSIVE','ENERGETIC'],       artists:['travis','ken','carti'],      tags:['drums','trap','hard'],        count:5 },
  { prefix:'loops/drum-loop/drumloop-trap-chill', bpm:130, key:'Am', mood:['CHILL','DARK'],                 artists:['future','savage'],           tags:['drums','trap','minimal'],     count:5 },
  { prefix:'loops/drum-loop/drumloop-boom-bap',   bpm:90,  key:'Am', mood:['JOYFUL','ENERGETIC'],           artists:['tyler','kanye'],             tags:['drums','boombap','groove'],   count:5 },
  { prefix:'loops/drum-loop/drumloop-rage',       bpm:158, key:'Am', mood:['AGGRESSIVE'],                   artists:['ken','carti','uzi'],         tags:['drums','rage','fast'],        count:5 },
  { prefix:'loops/drum-loop/drumloop-swing',      bpm:88,  key:'Am', mood:['JOYFUL','CHILL'],               artists:['kanye','tyler','drake'],     tags:['drums','swing','groove'],     count:5 },
  // Bass loops (→ 20 total)
  { prefix:'loops/bass/bass-808-dark',    bpm:140, key:'Am', mood:['DARK','AGGRESSIVE'],                    artists:['future','savage','travis'],  tags:['808','bass','dark'],          count:5 },
  { prefix:'loops/bass/bass-808-melodic', bpm:135, key:'Fm', mood:['DARK','ENERGETIC'],                     artists:['carti','uzi','future'],      tags:['808','bass','melodic'],       count:5 },
  { prefix:'loops/bass/bass-funk',        bpm:100, key:'Bb', mood:['JOYFUL','ENERGETIC'],                   artists:['tyler','kanye'],             tags:['bass','funk','groove'],       count:5 },
  { prefix:'loops/bass/bass-sub',         bpm:140, key:'Cm', mood:['DARK','AGGRESSIVE'],                    artists:['future','travis','ken'],     tags:['sub','bass','heavy'],         count:5 },
];

// ── Loop Manifest ──────────────────────────
function _buildLoopManifest() {
  return LOOP_CATEGORIES.flatMap(cat =>
    Array.from({ length: cat.count }, (_, i) => ({
      file:    `${cat.prefix}-${String(i + 1).padStart(2, '0')}.mp3`,
      bpm:     cat.bpm,
      key:     cat.key,
      mood:    cat.mood,
      artists: cat.artists,
      tags:    cat.tags,
    }))
  );
}

export const LOOP_MANIFEST = _buildLoopManifest();

// ── Loop Selection ─────────────────────────
export function selectLoop(artistId, mood, key) {
  const scored = LOOP_MANIFEST.map(entry => {
    let score = 0;
    if (entry.artists.includes(artistId))            score += 3;
    if (entry.mood.includes(mood))                    score += 2;
    if (entry.key === key || _isRelativeKey(entry.key, key)) score += 1;
    return { entry, score };
  });

  const maxScore = Math.max(...scored.map(s => s.score));
  const top = scored.filter(s => s.score === maxScore);
  _shuffle(top);

  return top.slice(0, 4).map(s => s.entry);
}

function _isRelativeKey(a, b) {
  const relatives = {
    Am:'C', Cm:'Eb', Dm:'F', Em:'G', Fm:'Ab', Gm:'Bb',
    Bbm:'Db', Ebm:'Gb', C:'Am', F:'Dm', G:'Em', Bb:'Gm', Ab:'Fm',
  };
  return relatives[a] === b || relatives[b] === a;
}

function _shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ── Load Samples ───────────────────────────
export async function loadSamples(artistId, albumName, mood, key) {
  const Tone = window.Tone;
  if (!Tone) throw new Error('Tone.js not loaded');

  const profile  = ARTIST_PROFILES[artistId]?.[albumName] || _defaultProfile(artistId);
  const loopList = selectLoop(artistId, mood, key);
  const loopEntry = loopList[0] || LOOP_MANIFEST[0];

  const u = path => CDN_BASE + path;
  const ds = DRUM_SAMPLES;

  // One-shot drum players (not connected — engine.js wires to channels)
  const kick     = new Tone.Player(u(ds.kick[profile.kick]           || ds.kick.trap));
  const snare    = new Tone.Player(u(ds.snare[profile.snare]         || ds.snare.crisp));
  const clap     = new Tone.Player(u(ds.clap[profile.clap]           || ds.clap.trap));
  const hatClosed= new Tone.Player(u(ds.hatClosed[profile.hatClosed] || ds.hatClosed.tight));
  const hatOpen  = new Tone.Player(u(ds.hatOpen[profile.hatOpen]     || ds.hatOpen.short));
  const hatRoll  = new Tone.Player(u(ds.hatRoll[profile.hatRoll]     || ds.hatRoll.stutter));

  // 808 bass sampler (auto-pitches from root notes)
  const bassUrls = {};
  Object.entries(BASS_URLS).forEach(([note, path]) => { bassUrls[note] = u(path); });
  const bass = new Tone.Sampler({ urls: bassUrls, release: 1 });

  // Melody stab sampler
  const stabStyle = profile.stabStyle || 'hard';
  const melody = new Tone.Sampler({
    urls: {
      C3: u(`synths/stabs/stab-${stabStyle}-C3-01.mp3`),
      C4: u(`synths/stabs/stab-${stabStyle}-C4-01.mp3`),
      C5: u(`synths/stabs/stab-${stabStyle}-C5-01.mp3`),
    },
    release: 0.5,
  });

  // Loop player
  const loopPlayer = new Tone.Player(u(loopEntry.file));
  loopPlayer.loop = true;

  // Wait for all buffers (timeout handles missing CDN files gracefully)
  await Promise.race([
    Tone.loaded(),
    new Promise(resolve => setTimeout(resolve, 8000)),
  ]);

  return {
    kick, snare, clap, hatClosed, hatOpen, hatRoll,
    bass, melody,
    loop: {
      player:       loopPlayer,
      meta:         loopEntry,
      alternatives: loopList.slice(1),
    },
  };
}

function _defaultProfile(artistId) {
  const d = {
    carti:   { kick:'distorted',  snare:'crisp',  clap:'trap',    hatClosed:'sizzle', hatOpen:'short',  hatRoll:'stutter', stabStyle:'distorted' },
    kanye:   { kick:'punchy',     snare:'fat',    clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'triplet', stabStyle:'vintage'   },
    cudi:    { kick:'sub',        snare:'vinyl',  clap:'wide',    hatClosed:'muted',  hatOpen:'airy',   hatRoll:'slow',    stabStyle:'airy'      },
    travis:  { kick:'trap',       snare:'crisp',  clap:'wide',    hatClosed:'tight',  hatOpen:'airy',   hatRoll:'stutter', stabStyle:'detuned'   },
    drake:   { kick:'punchy',     snare:'crisp',  clap:'dry',     hatClosed:'tight',  hatOpen:'short',  hatRoll:'slow',    stabStyle:'clean'     },
    thug:    { kick:'trap',       snare:'fat',    clap:'trap',    hatClosed:'loose',  hatOpen:'airy',   hatRoll:'triplet', stabStyle:'bright'    },
    ken:     { kick:'distorted',  snare:'crisp',  clap:'trap',    hatClosed:'sizzle', hatOpen:'short',  hatRoll:'fast',    stabStyle:'distorted' },
    future:  { kick:'heavy',      snare:'fat',    clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'slow',    stabStyle:'dark'      },
    uzi:     { kick:'trap',       snare:'crisp',  clap:'wide',    hatClosed:'tight',  hatOpen:'airy',   hatRoll:'stutter', stabStyle:'bright'    },
    tyler:   { kick:'acoustic',   snare:'wood',   clap:'dry',     hatClosed:'loose',  hatOpen:'airy',   hatRoll:'triplet', stabStyle:'vintage'   },
    toliver: { kick:'sub',        snare:'fat',    clap:'layered', hatClosed:'loose',  hatOpen:'long',   hatRoll:'slow',    stabStyle:'airy'      },
    savage:  { kick:'boomy',      snare:'crisp',  clap:'trap',    hatClosed:'tight',  hatOpen:'short',  hatRoll:'slow',    stabStyle:'dark'      },
  };
  return d[artistId] || d.kanye;
}
