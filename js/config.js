/* ═══════════════════════════════════════════
   CONFIG — Artist data, presets, blueprints
════════════════════════════════════════════ */

export const API_KEY = ''; // Leave empty to use fallback library only

// ─── Artists ──────────────────────────────
export const ARTISTS = [
  {
    id: 'kanye', name: 'Kanye West', icon: '🎹',
    vibe: 'soul chops · orchestral',
    accent: '#c8a84b', accentHi: '#f0cc60', accentLo: '#7a6020', accentGlow: 'rgba(200,168,75,0.35)',
    albums: [
      { name: 'The College Dropout', tag: 'soul chops · warm swing' },
      { name: 'Late Registration',   tag: 'orchestral · heavy kick' },
      { name: 'Graduation',          tag: 'electronic · anthemic' },
      { name: '808s & Heartbreak',   tag: 'emotional synths · sparse' },
      { name: 'Yeezus',              tag: 'industrial · distorted' },
      { name: 'The Life of Pablo',   tag: 'gospel chops · chaotic' },
    ]
  },
  {
    id: 'cudi', name: 'Kid Cudi', icon: '🌙',
    vibe: 'ambient · melodic pads',
    accent: '#5e4b9e', accentHi: '#8066cc', accentLo: '#2a1f60', accentGlow: 'rgba(94,75,158,0.35)',
    albums: [
      { name: 'Man on the Moon',          tag: 'dreamy pads · sparse' },
      { name: 'Man on the Moon II',       tag: 'dark psychedelic · sub' },
      { name: 'Indicud',                  tag: 'glitchy electronic · arps' },
      { name: 'Satellite Flight',         tag: 'ultra-minimal · atmospheric' },
      { name: "Speedin' Bullet 2 Heaven", tag: 'distorted · punk energy' },
      { name: 'Passion Pain Demon Slayin\'', tag: 'orchestral · emotional' },
      { name: 'Man on the Moon III',      tag: 'nostalgic · warm melodic' },
    ]
  },
  {
    id: 'travis', name: 'Travis Scott', icon: '🌀',
    vibe: 'psychedelic · reverb trap',
    accent: '#cc5500', accentHi: '#ff7722', accentLo: '#662800', accentGlow: 'rgba(204,85,0,0.35)',
    albums: [
      { name: 'Owl Pharaoh',         tag: 'reverb early trap · sparse' },
      { name: 'Days Before Rodeo',   tag: 'psychedelic · dark texture' },
      { name: 'Rodeo',               tag: 'festival · layered synths' },
      { name: 'Birds in the Trap',   tag: 'dark trap · pitch-down 808' },
      { name: 'Astroworld',          tag: 'euphoric · carnival swells' },
      { name: 'Utopia',              tag: 'futuristic · dense textures' },
    ]
  },
  {
    id: 'drake', name: 'Drake', icon: '💎',
    vibe: 'clean melodic · polished',
    accent: '#1a7a7a', accentHi: '#22aaaa', accentLo: '#0a3a3a', accentGlow: 'rgba(26,122,122,0.35)',
    albums: [
      { name: 'Thank Me Later',       tag: 'polished trap · melodic piano' },
      { name: 'Take Care',            tag: 'R&B trap · emotional' },
      { name: 'Nothing Was the Same', tag: 'atmospheric · crisp' },
      { name: "If You're Reading This", tag: 'raw · minimal' },
      { name: 'Views',                tag: 'dancehall · offbeat hats' },
      { name: 'Scorpion',             tag: 'clean commercial · polished' },
      { name: 'Certified Lover Boy',  tag: 'R&B leaning · warm bass' },
    ]
  },
  {
    id: 'thug', name: 'Young Thug', icon: '🔥',
    vibe: 'experimental · melodic',
    accent: '#3a8a2a', accentHi: '#55cc33', accentLo: '#1a4010', accentGlow: 'rgba(58,138,42,0.35)',
    albums: [
      { name: 'Barter 6',                tag: 'melodic trap · flowing' },
      { name: 'Slime Season',            tag: 'hard trap · slapping 808' },
      { name: 'Jeffery',                 tag: 'experimental · unusual chords' },
      { name: 'Beautiful Thugger Girls', tag: 'country-trap · unusual shapes' },
      { name: 'So Much Fun',             tag: 'mainstream · bouncy' },
      { name: 'Punk',                    tag: 'alternative · unpredictable' },
    ]
  },
  {
    id: 'ken', name: 'Ken Carson', icon: '⚡',
    vibe: 'rage synths · aggressive',
    accent: '#ff1122', accentHi: '#ff4455', accentLo: '#880011', accentGlow: 'rgba(255,17,34,0.4)',
    albums: [
      { name: 'A Great Chaos', tag: 'hyper-aggressive · fast hats' },
      { name: 'Project X',     tag: 'distorted synths · rage' },
      { name: 'I Am Nothing',  tag: 'melodic rage · raw' },
      { name: 'X',             tag: 'pure rage · maximum distortion' },
    ]
  },
  {
    id: 'carti', name: 'Playboi Carti', icon: '💀',
    vibe: 'rage-adjacent · airy 808s',
    accent: '#cc0077', accentHi: '#ff22aa', accentLo: '#660033', accentGlow: 'rgba(204,0,119,0.35)',
    albums: [
      { name: 'Playboi Carti',   tag: 'dreamy melodic · airy' },
      { name: 'Die Lit',         tag: 'high-energy · bouncy 808' },
      { name: 'Whole Lotta Red', tag: 'chaotic rage · dissonant' },
      { name: 'Music',           tag: 'dense psychedelic · experimental' },
    ]
  },
  {
    id: 'future', name: 'Future', icon: '🌫️',
    vibe: 'dark trap · auto-tune heavy',
    accent: '#1a5a8a', accentHi: '#2288cc', accentLo: '#0a2a44', accentGlow: 'rgba(26,90,138,0.35)',
    albums: [
      { name: 'Pluto',            tag: 'dark auto-tune · murky reverb' },
      { name: 'DS2',              tag: 'street trap · slamming 808' },
      { name: 'EVOL',             tag: 'darker minimal · sparse' },
      { name: 'HNDRXX',           tag: 'R&B trap · emotional piano' },
      { name: 'The WIZRD',        tag: 'atmospheric · layered pads' },
      { name: 'I Never Liked You',tag: 'dark modern trap · heavy 808' },
    ]
  },
  {
    id: 'uzi', name: 'Lil Uzi Vert', icon: '🚀',
    vibe: 'emo rap · energetic',
    accent: '#8822dd', accentHi: '#aa44ff', accentLo: '#440088', accentGlow: 'rgba(136,34,221,0.35)',
    albums: [
      { name: 'Luv Is Rage',    tag: 'lo-fi emo trap · raw' },
      { name: 'Luv Is Rage 2',  tag: 'melodic emo · bright synths' },
      { name: 'Eternal Atake',  tag: 'sci-fi · glitchy hi-hats' },
      { name: 'The Pink Tape',  tag: 'experimental · genre-blending' },
    ]
  },
  {
    id: 'tyler', name: 'Tyler, the Creator', icon: '🌸',
    vibe: 'jazz-influenced · experimental',
    accent: '#5a9a1a', accentHi: '#88cc33', accentLo: '#2a4a08', accentGlow: 'rgba(90,154,26,0.35)',
    albums: [
      { name: 'Goblin',                    tag: 'dark lo-fi · confrontational' },
      { name: 'Wolf',                      tag: 'jazz-adjacent · layered chords' },
      { name: 'Cherry Bomb',               tag: 'psychedelic distortion · chaotic' },
      { name: 'Flower Boy',                tag: 'jazzy melodic · introspective' },
      { name: 'IGOR',                      tag: 'neo-soul · emotional layering' },
      { name: 'Call Me If You Get Lost',   tag: 'boom-bap revival · sample-heavy' },
      { name: 'Chromakopia',               tag: 'experimental · orchestral hip-hop' },
    ]
  },
  {
    id: 'toliver', name: 'Don Toliver', icon: '🌡️',
    vibe: 'psychedelic trap · melodic',
    accent: '#aa6600', accentHi: '#dd9922', accentLo: '#553300', accentGlow: 'rgba(170,102,0,0.35)',
    albums: [
      { name: 'Heaven or Hell',     tag: 'psychedelic trap · dreamy' },
      { name: 'Life of a DON',      tag: 'polished melodic · lush pads' },
      { name: 'Love Sick',          tag: 'dark melodic · slow-burn 808' },
      { name: 'Hardstone Psycho',   tag: 'dense trap · psychedelic' },
    ]
  },
  {
    id: 'savage', name: '21 Savage', icon: '🗡️',
    vibe: 'minimal dark trap · cold',
    accent: '#2a3a5a', accentHi: '#4466aa', accentLo: '#111a2a', accentGlow: 'rgba(42,58,90,0.35)',
    albums: [
      { name: 'Savage Mode',        tag: 'minimal dark trap · cold' },
      { name: 'I Am > I Was',       tag: 'mainstream · melodic piano' },
      { name: 'Savage Mode II',     tag: 'dark orchestral · string stabs' },
      { name: 'american dream',     tag: 'polished cinematic · melodic' },
    ]
  },
];

// ─── Album Presets ─────────────────────────
// tempo: [min, max], swing: 0-1, bassDistortion: 0-1, reverb: 0-1, delay: 0-1
export const ALBUM_PRESETS = {
  // Kanye
  'kanye:The College Dropout':   { tempo:[85,95],   swing:0.25, bassDistortion:0.15, reverb:0.4,  delay:0.2, chorus:0.10, phaser:0.00 },
  'kanye:Late Registration':     { tempo:[80,95],   swing:0.2,  bassDistortion:0.2,  reverb:0.5,  delay:0.3, chorus:0.15, phaser:0.00 },
  'kanye:Graduation':            { tempo:[120,135], swing:0.05, bassDistortion:0.25, reverb:0.3,  delay:0.2, chorus:0.00, phaser:0.00 },
  "kanye:808s & Heartbreak":     { tempo:[70,90],   swing:0.1,  bassDistortion:0.2,  reverb:0.8,  delay:0.4, chorus:0, phaser:0  },
  'kanye:Yeezus':                { tempo:[128,150], swing:0.0,  bassDistortion:0.9,  reverb:0.15, delay:0.1, chorus:0.00, phaser:0.20 },
  'kanye:The Life of Pablo':     { tempo:[75,100],  swing:0.3,  bassDistortion:0.3,  reverb:0.6,  delay:0.3, chorus:0.20, phaser:0.00 },
  // Cudi
  'cudi:Man on the Moon':        { tempo:[80,95],   swing:0.15, bassDistortion:0.1,  reverb:0.75, delay:0.35, chorus:0, phaser:0 },
  'cudi:Man on the Moon II':     { tempo:[78,92],   swing:0.1,  bassDistortion:0.15, reverb:0.85, delay:0.4, chorus:0.35, phaser:0.15 },
  'cudi:Indicud':                { tempo:[100,120], swing:0.05, bassDistortion:0.2,  reverb:0.5,  delay:0.3, chorus:0.10, phaser:0.00 },
  'cudi:Satellite Flight':       { tempo:[70,85],   swing:0.2,  bassDistortion:0.05, reverb:0.95, delay:0.5, chorus:0.50, phaser:0.25 },
  "cudi:Speedin' Bullet 2 Heaven": { tempo:[110,140], swing:0.0, bassDistortion:0.7, reverb:0.35, delay:0.2, chorus:0, phaser:0 },
  "cudi:Passion Pain Demon Slayin'": { tempo:[80,100], swing:0.15, bassDistortion:0.1, reverb:0.7, delay:0.35, chorus:0, phaser:0 },
  'cudi:Man on the Moon III':    { tempo:[85,100],  swing:0.2,  bassDistortion:0.12, reverb:0.65, delay:0.3, chorus:0.35, phaser:0.15 },
  // Travis
  'travis:Owl Pharaoh':          { tempo:[130,145], swing:0.08, bassDistortion:0.3,  reverb:0.7,  delay:0.4, chorus:0.15, phaser:0.00 },
  'travis:Days Before Rodeo':    { tempo:[125,145], swing:0.05, bassDistortion:0.35, reverb:0.8,  delay:0.45, chorus:0, phaser:0 },
  'travis:Rodeo':                { tempo:[130,150], swing:0.05, bassDistortion:0.4,  reverb:0.65, delay:0.35, chorus:0, phaser:0 },
  'travis:Birds in the Trap':    { tempo:[128,145], swing:0.07, bassDistortion:0.5,  reverb:0.7,  delay:0.4, chorus:0.10, phaser:0.05 },
  'travis:Astroworld':           { tempo:[135,155], swing:0.05, bassDistortion:0.45, reverb:0.65, delay:0.38, chorus:0, phaser:0 },
  'travis:Utopia':               { tempo:[138,160], swing:0.03, bassDistortion:0.55, reverb:0.6,  delay:0.35, chorus:0, phaser:0 },
  // Drake
  'drake:Thank Me Later':        { tempo:[120,135], swing:0.1,  bassDistortion:0.15, reverb:0.4,  delay:0.25, chorus:0, phaser:0 },
  'drake:Take Care':             { tempo:[115,130], swing:0.12, bassDistortion:0.18, reverb:0.5,  delay:0.3, chorus:0.15, phaser:0.00 },
  'drake:Nothing Was the Same':  { tempo:[118,132], swing:0.08, bassDistortion:0.15, reverb:0.55, delay:0.28, chorus:0, phaser:0 },
  "drake:If You're Reading This":{ tempo:[90,115],  swing:0.15, bassDistortion:0.1,  reverb:0.45, delay:0.2, chorus:0, phaser:0  },
  'drake:Views':                 { tempo:[120,138], swing:0.12, bassDistortion:0.2,  reverb:0.5,  delay:0.3, chorus:0.10, phaser:0.00 },
  'drake:Scorpion':              { tempo:[125,140], swing:0.08, bassDistortion:0.18, reverb:0.45, delay:0.25, chorus:0, phaser:0 },
  'drake:Certified Lover Boy':   { tempo:[120,135], swing:0.1,  bassDistortion:0.15, reverb:0.5,  delay:0.28, chorus:0, phaser:0 },
  // Young Thug
  'thug:Barter 6':               { tempo:[128,142], swing:0.12, bassDistortion:0.25, reverb:0.5,  delay:0.3, chorus:0.05, phaser:0.00 },
  'thug:Slime Season':           { tempo:[135,150], swing:0.05, bassDistortion:0.4,  reverb:0.4,  delay:0.25, chorus:0, phaser:0 },
  'thug:Jeffery':                { tempo:[125,145], swing:0.1,  bassDistortion:0.3,  reverb:0.55, delay:0.3, chorus:0.10, phaser:0.05 },
  'thug:Beautiful Thugger Girls':{ tempo:[100,125], swing:0.18, bassDistortion:0.2,  reverb:0.5,  delay:0.3, chorus:0.25, phaser:0.00 },
  'thug:So Much Fun':            { tempo:[135,155], swing:0.06, bassDistortion:0.3,  reverb:0.45, delay:0.28, chorus:0, phaser:0 },
  'thug:Punk':                   { tempo:[120,145], swing:0.1,  bassDistortion:0.35, reverb:0.55, delay:0.32, chorus:0, phaser:0 },
  // Ken Carson
  'ken:A Great Chaos':           { tempo:[145,170], swing:0.0,  bassDistortion:0.8,  reverb:0.3,  delay:0.2, chorus:0.00, phaser:0.15 },
  'ken:Project X':               { tempo:[140,165], swing:0.0,  bassDistortion:0.85, reverb:0.25, delay:0.15, chorus:0, phaser:0 },
  'ken:I Am Nothing':            { tempo:[138,158], swing:0.02, bassDistortion:0.7,  reverb:0.35, delay:0.22, chorus:0, phaser:0 },
  'ken:X':                       { tempo:[150,175], swing:0.0,  bassDistortion:0.95, reverb:0.2,  delay:0.1, chorus:0.00, phaser:0.20 },
  // Carti
  'carti:Playboi Carti':         { tempo:[130,148], swing:0.1,  bassDistortion:0.3,  reverb:0.6,  delay:0.35, chorus:0, phaser:0 },
  'carti:Die Lit':               { tempo:[140,158], swing:0.04, bassDistortion:0.45, reverb:0.5,  delay:0.3, chorus:0.05, phaser:0.05 },
  'carti:Whole Lotta Red':       { tempo:[145,168], swing:0.0,  bassDistortion:0.7,  reverb:0.35, delay:0.2, chorus:0.00, phaser:0.10 },
  'carti:Music':                 { tempo:[138,162], swing:0.05, bassDistortion:0.6,  reverb:0.5,  delay:0.3, chorus:0.05, phaser:0.10 },
  // Future
  'future:Pluto':                { tempo:[130,145], swing:0.08, bassDistortion:0.4,  reverb:0.65, delay:0.38, chorus:0, phaser:0 },
  'future:DS2':                  { tempo:[135,150], swing:0.04, bassDistortion:0.5,  reverb:0.55, delay:0.3, chorus:0.10, phaser:0.05 },
  'future:EVOL':                 { tempo:[130,148], swing:0.05, bassDistortion:0.45, reverb:0.6,  delay:0.32, chorus:0, phaser:0 },
  'future:HNDRXX':               { tempo:[120,138], swing:0.1,  bassDistortion:0.3,  reverb:0.6,  delay:0.35, chorus:0, phaser:0 },
  'future:The WIZRD':            { tempo:[138,155], swing:0.05, bassDistortion:0.45, reverb:0.65, delay:0.35, chorus:0, phaser:0 },
  'future:I Never Liked You':    { tempo:[140,158], swing:0.03, bassDistortion:0.55, reverb:0.55, delay:0.28, chorus:0, phaser:0 },
  // Uzi
  'uzi:Luv Is Rage':             { tempo:[140,158], swing:0.06, bassDistortion:0.35, reverb:0.55, delay:0.3, chorus:0.05, phaser:0.00 },
  'uzi:Luv Is Rage 2':           { tempo:[148,165], swing:0.04, bassDistortion:0.4,  reverb:0.5,  delay:0.28, chorus:0, phaser:0 },
  'uzi:Eternal Atake':           { tempo:[148,170], swing:0.02, bassDistortion:0.45, reverb:0.45, delay:0.25, chorus:0, phaser:0 },
  'uzi:The Pink Tape':           { tempo:[140,165], swing:0.05, bassDistortion:0.4,  reverb:0.5,  delay:0.3, chorus:0.10, phaser:0.10 },
  // Tyler
  'tyler:Goblin':                { tempo:[85,105],  swing:0.12, bassDistortion:0.3,  reverb:0.45, delay:0.25, chorus:0, phaser:0 },
  'tyler:Wolf':                  { tempo:[88,108],  swing:0.18, bassDistortion:0.15, reverb:0.5,  delay:0.3, chorus:0.20, phaser:0.00 },
  'tyler:Cherry Bomb':           { tempo:[95,118],  swing:0.08, bassDistortion:0.5,  reverb:0.5,  delay:0.3, chorus:0.10, phaser:0.15 },
  'tyler:Flower Boy':            { tempo:[88,105],  swing:0.2,  bassDistortion:0.1,  reverb:0.55, delay:0.32, chorus:0, phaser:0 },
  'tyler:IGOR':                  { tempo:[90,108],  swing:0.15, bassDistortion:0.15, reverb:0.6,  delay:0.35, chorus:0, phaser:0 },
  'tyler:Call Me If You Get Lost':{ tempo:[88,105], swing:0.22, bassDistortion:0.12, reverb:0.4,  delay:0.28, chorus:0, phaser:0 },
  'tyler:Chromakopia':           { tempo:[90,112],  swing:0.18, bassDistortion:0.2,  reverb:0.55, delay:0.32, chorus:0, phaser:0 },
  // Toliver
  'toliver:Heaven or Hell':      { tempo:[130,148], swing:0.08, bassDistortion:0.3,  reverb:0.65, delay:0.38, chorus:0, phaser:0 },
  'toliver:Life of a DON':       { tempo:[128,145], swing:0.1,  bassDistortion:0.28, reverb:0.6,  delay:0.35, chorus:0, phaser:0 },
  'toliver:Love Sick':           { tempo:[125,142], swing:0.1,  bassDistortion:0.32, reverb:0.7,  delay:0.4, chorus:0.25, phaser:0.10 },
  'toliver:Hardstone Psycho':    { tempo:[132,150], swing:0.06, bassDistortion:0.4,  reverb:0.6,  delay:0.35, chorus:0, phaser:0 },
  // 21 Savage
  'savage:Savage Mode':          { tempo:[125,142], swing:0.05, bassDistortion:0.35, reverb:0.5,  delay:0.28, chorus:0, phaser:0 },
  'savage:I Am > I Was':         { tempo:[128,145], swing:0.06, bassDistortion:0.3,  reverb:0.48, delay:0.26, chorus:0, phaser:0 },
  'savage:Savage Mode II':       { tempo:[128,145], swing:0.04, bassDistortion:0.38, reverb:0.55, delay:0.3, chorus:0.00, phaser:0.05 },
  'savage:american dream':       { tempo:[130,148], swing:0.06, bassDistortion:0.28, reverb:0.5,  delay:0.28, chorus:0, phaser:0 },
};

// ─── Mood Modifiers ────────────────────────
export const MOOD_MODIFIERS = {
  AGGRESSIVE:   { tempoDelta:+12, swingMult:0.5,  densityMult:1.4, reverbMult:0.7,  distMult:1.6, chorus:0.00, phaser:0.00 },
  SAD:          { tempoDelta:-15, swingMult:1.2,  densityMult:0.6, reverbMult:1.4,  distMult:0.6, chorus:0.25, phaser:0.00 },
  JOYFUL:       { tempoDelta:+8,  swingMult:1.1,  densityMult:1.1, reverbMult:0.9,  distMult:0.8, chorus:0.20, phaser:0.00 },
  DARK:         { tempoDelta:-5,  swingMult:0.8,  densityMult:0.8, reverbMult:1.3,  distMult:1.2, chorus:0.00, phaser:0.10 },
  CHILL:        { tempoDelta:-12, swingMult:1.3,  densityMult:0.5, reverbMult:1.5,  distMult:0.4, chorus:0.35, phaser:0.00 },
  ENERGETIC:    { tempoDelta:+15, swingMult:0.6,  densityMult:1.5, reverbMult:0.7,  distMult:1.1, chorus:0.00, phaser:0.00 },
  PSYCHEDELIC:  { tempoDelta:-8,  swingMult:1.4,  densityMult:0.7, reverbMult:1.8,  distMult:0.7, chorus:0.45, phaser:0.75 },
  MELANCHOLIC:  { tempoDelta:-10, swingMult:1.2,  densityMult:0.5, reverbMult:1.6,  distMult:0.5, chorus:0.20, phaser:0.10 },
  EPIC:         { tempoDelta:+5,  swingMult:0.7,  densityMult:1.3, reverbMult:1.2,  distMult:1.3, chorus:0.10, phaser:0.00 },
  HAZY:         { tempoDelta:-20, swingMult:1.5,  densityMult:0.6, reverbMult:2.0,  distMult:0.5, chorus:0.40, phaser:0.20 },
};

// ─── Base Blueprints (per artist) ──────────
// notes.length === count of 1s in corresponding pattern
const BASE_BLUEPRINTS = {
  kanye: {
    tempo: 80, key: 'Am',
    structure: ['intro','main','variation','breakdown','outro'],
    drums: {
      kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
      snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      hat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
      openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1],
      hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      swing: 0.15, density: 0.4
    },
    bass: {
      type: '808',
      pattern: [1,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
      notes: ['A1','G1','A1'],
      distortion: 0.2, behavior: 'root_following'
    },
    melody: {
      style: 'pads',
      pattern: [1,0,0,0, 1,0,0,0, 0,0,1,0, 0,0,1,0],
      notes: ['A4','C4','E4','G4'],
      complexity: 0.4
    },
    sample: { mode: 'none', slice_count: 0 },
    effects: { reverb: 0.7, delay: 0.35, chorus: 0, phaser: 0 }
  },

  cudi: {
    tempo: 88, key: 'Dm',
    structure: ['intro','main','variation','breakdown','outro'],
    drums: {
      kick:    [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
      snare:   [0,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
      hat:     [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
      openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      swing: 0.15, density: 0.25
    },
    bass: {
      type: '808',
      pattern: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
      notes: ['D1','D1'],
      distortion: 0.1, behavior: 'root_following'
    },
    melody: {
      style: 'pads',
      pattern: [1,0,1,0, 1,0,0,0, 1,0,1,0, 0,0,1,0],
      notes: ['D4','F4','A4','D4','F4','E4'],
      complexity: 0.5
    },
    sample: { mode: 'none', slice_count: 0 },
    effects: { reverb: 0.8, delay: 0.4, chorus: 0, phaser: 0 }
  },

  travis: {
    tempo: 145, key: 'Gm',
    structure: ['intro','main','variation','breakdown','outro'],
    drums: {
      kick:    [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,0,0],
      snare:   [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,0],
      hat:     [1,1,0,1, 1,0,1,1, 1,1,0,1, 1,0,1,0],
      openHat: [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
      hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      swing: 0.05, density: 0.75
    },
    bass: {
      type: '808',
      pattern: [1,0,0,1, 0,0,1,0, 1,0,0,0, 1,0,1,0],
      notes: ['G1','D1','G1','F1','G1','F1'],
      distortion: 0.4, behavior: 'root_following'
    },
    melody: {
      style: 'synth-lead',
      pattern: [1,0,1,0, 0,1,0,0, 1,0,0,1, 0,1,0,0],
      notes: ['G3','Bb3','D4','G3','F3','Bb3'],
      complexity: 0.7
    },
    sample: { mode: 'none', slice_count: 0 },
    effects: { reverb: 0.65, delay: 0.38, chorus: 0, phaser: 0 }
  },

  drake: {
    tempo: 125, key: 'Ebm',
    structure: ['intro','main','variation','breakdown','outro'],
    drums: {
      kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 1,0,0,0],
      snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      hat:     [1,0,1,0, 1,1,1,0, 1,0,1,0, 1,1,1,0],
      openHat: [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
      hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      swing: 0.1, density: 0.55
    },
    bass: {
      type: '808',
      pattern: [1,0,0,0, 1,0,0,0, 0,0,1,0, 0,0,1,0],
      notes: ['Eb1','Eb1','Bb0','Bb0'],
      distortion: 0.18, behavior: 'root_following'
    },
    melody: {
      style: 'piano',
      pattern: [1,0,0,1, 0,0,1,0, 1,0,0,0, 0,1,0,1],
      notes: ['Eb4','Gb4','Bb4','Eb4','Gb4','Bb3'],
      complexity: 0.55
    },
    sample: { mode: 'none', slice_count: 0 },
    effects: { reverb: 0.5, delay: 0.28, chorus: 0, phaser: 0 }
  },

  thug: {
    tempo: 135, key: 'Bb',
    structure: ['intro','main','variation','breakdown','outro'],
    drums: {
      kick:    [1,0,0,0, 1,0,0,0, 1,0,0,1, 0,0,0,0],
      snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      hat:     [1,1,0,1, 0,1,1,0, 1,1,0,1, 0,1,0,0],
      openHat: [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
      hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      swing: 0.12, density: 0.65
    },
    bass: {
      type: '808',
      pattern: [1,0,1,0, 0,0,1,0, 1,0,0,1, 0,0,0,0],
      notes: ['Bb0','F1','Bb0','Bb0','Eb1'],
      distortion: 0.3, behavior: 'root_following'
    },
    melody: {
      style: 'arp',
      pattern: [1,0,1,0, 1,0,1,0, 0,1,0,1, 0,1,0,0],
      notes: ['Bb3','Db4','F4','Bb3','Ab3','Db4','F3'],
      complexity: 0.65
    },
    sample: { mode: 'none', slice_count: 0 },
    effects: { reverb: 0.5, delay: 0.3, chorus: 0, phaser: 0 }
  },

  ken: {
    tempo: 160, key: 'Cm',
    structure: ['intro','main','variation','breakdown','outro'],
    drums: {
      kick:    [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,1],
      snare:   [0,0,0,0, 1,0,0,0, 0,0,0,1, 1,0,0,0],
      hat:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,0],
      openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      swing: 0.0, density: 0.9
    },
    bass: {
      type: '808-distorted',
      pattern: [1,0,0,1, 0,0,1,0, 1,0,0,0, 0,1,0,1],
      notes: ['C1','C1','G0','C1','C1','G0'],
      distortion: 0.85, behavior: 'root_following'
    },
    melody: {
      style: 'synth-lead',
      pattern: [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0],
      notes: ['C4','G3','Eb4','C4','G3','Eb4'],
      complexity: 0.5
    },
    sample: { mode: 'none', slice_count: 0 },
    effects: { reverb: 0.25, delay: 0.15, chorus: 0, phaser: 0 }
  },

  carti: {
    tempo: 148, key: 'Fm',
    structure: ['intro','main','variation','breakdown','outro'],
    drums: {
      kick:    [1,0,0,0, 1,0,1,0, 0,0,0,0, 1,0,0,1],
      snare:   [0,0,0,0, 1,0,0,0, 0,1,0,0, 1,0,0,0],
      hat:     [1,1,1,0, 1,1,0,1, 1,1,1,0, 1,0,1,1],
      openHat: [0,0,0,1, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      swing: 0.05, density: 0.8
    },
    bass: {
      type: '808',
      pattern: [1,0,1,0, 0,1,0,0, 1,0,0,1, 0,0,1,0],
      notes: ['F1','C1','Eb1','F1','Ab0','F1'],
      distortion: 0.4, behavior: 'root_following'
    },
    melody: {
      style: 'pads',
      pattern: [1,0,0,1, 0,0,0,0, 1,0,1,0, 0,0,0,1],
      notes: ['F3','Ab3','F3','Ab3','C4'],
      complexity: 0.4
    },
    sample: { mode: 'none', slice_count: 0 },
    effects: { reverb: 0.55, delay: 0.3, chorus: 0, phaser: 0 }
  },

  future: {
    tempo: 140, key: 'Bb',
    structure: ['intro','main','variation','breakdown','outro'],
    drums: {
      kick:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,1,0],
      snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      hat:     [1,0,1,1, 1,0,1,0, 1,0,1,1, 1,0,0,0],
      openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,1,0],
      hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      swing: 0.05, density: 0.65
    },
    bass: {
      type: '808',
      pattern: [1,0,0,0, 0,1,0,0, 1,0,0,1, 0,0,0,0],
      notes: ['Bb0','F1','Bb0','Db1'],
      distortion: 0.45, behavior: 'root_following'
    },
    melody: {
      style: 'pads',
      pattern: [1,0,0,0, 1,0,1,0, 0,0,0,0, 1,0,0,1],
      notes: ['Bb3','Db4','Ab3','Bb3','F3'],
      complexity: 0.5
    },
    sample: { mode: 'none', slice_count: 0 },
    effects: { reverb: 0.6, delay: 0.32, chorus: 0, phaser: 0 }
  },

  uzi: {
    tempo: 155, key: 'Fm',
    structure: ['intro','main','variation','breakdown','outro'],
    drums: {
      kick:    [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,0,0],
      snare:   [0,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
      hat:     [1,1,0,1, 1,1,0,1, 1,1,0,1, 1,1,0,0],
      openHat: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
      hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      swing: 0.04, density: 0.72
    },
    bass: {
      type: '808',
      pattern: [1,0,1,0, 0,0,1,0, 1,0,0,0, 1,0,1,0],
      notes: ['F1','C1','Ab1','F1','F1','C1'],
      distortion: 0.38, behavior: 'root_following'
    },
    melody: {
      style: 'synth-lead',
      pattern: [1,0,1,0, 1,0,0,1, 0,1,0,0, 1,0,1,0],
      notes: ['F4','C4','Ab3','C4','F3','C4','F4'],
      complexity: 0.6
    },
    sample: { mode: 'none', slice_count: 0 },
    effects: { reverb: 0.5, delay: 0.28, chorus: 0, phaser: 0 }
  },

  tyler: {
    tempo: 95, key: 'Cm',
    structure: ['intro','main','variation','breakdown','outro'],
    drums: {
      kick:    [1,0,0,0, 0,1,0,0, 1,0,0,0, 0,1,0,0],
      snare:   [0,0,1,0, 1,0,0,1, 0,0,1,0, 1,0,0,0],
      hat:     [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0],
      openHat: [0,1,0,0, 0,1,0,0, 0,1,0,0, 0,0,0,0],
      hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      swing: 0.18, density: 0.55
    },
    bass: {
      type: '808',
      pattern: [1,0,1,0, 1,0,0,0, 1,0,1,0, 0,0,0,0],
      notes: ['C1','Eb1','G1','C1','Bb0'],
      distortion: 0.15, behavior: 'root_following'
    },
    melody: {
      style: 'piano',
      pattern: [1,0,0,1, 0,1,0,0, 1,0,0,1, 0,0,1,0],
      notes: ['C4','G3','Eb4','C4','Bb3','Eb4'],
      complexity: 0.7
    },
    sample: { mode: 'none', slice_count: 0 },
    effects: { reverb: 0.55, delay: 0.32, chorus: 0, phaser: 0 }
  },

  toliver: {
    tempo: 138, key: 'Dbm',
    structure: ['intro','main','variation','breakdown','outro'],
    drums: {
      kick:    [1,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
      snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      hat:     [1,0,1,1, 1,0,1,0, 1,0,1,1, 1,0,0,0],
      openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1],
      hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      swing: 0.1, density: 0.6
    },
    bass: {
      type: '808',
      pattern: [1,0,0,0, 1,0,1,0, 0,0,1,0, 0,0,0,1],
      notes: ['Db1','Db1','Ab0','Ab1','Db1'],
      distortion: 0.3, behavior: 'root_following'
    },
    melody: {
      style: 'pads',
      pattern: [1,0,1,0, 0,0,1,0, 1,0,0,0, 1,0,1,0],
      notes: ['Db4','E4','Ab3','Db4','B3','Ab3'],
      complexity: 0.55
    },
    sample: { mode: 'none', slice_count: 0 },
    effects: { reverb: 0.65, delay: 0.38, chorus: 0, phaser: 0 }
  },

  savage: {
    tempo: 130, key: 'Am',
    structure: ['intro','main','variation','breakdown','outro'],
    drums: {
      kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
      snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      hat:     [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,1,0],
      openHat: [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
      hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      swing: 0.05, density: 0.35
    },
    bass: {
      type: '808',
      pattern: [1,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
      notes: ['A0','E1','A0'],
      distortion: 0.35, behavior: 'root_following'
    },
    melody: {
      style: 'pads',
      pattern: [1,0,0,0, 1,0,0,0, 0,1,0,0, 0,0,1,0],
      notes: ['A3','E4','C4','G3'],
      complexity: 0.35
    },
    sample: { mode: 'none', slice_count: 0 },
    effects: { reverb: 0.5, delay: 0.28, chorus: 0, phaser: 0 }
  },
};

// ─── Per-Album Drum Patterns ────────────────
export const ALBUM_DRUM_PATTERNS = {
  // ── KANYE ──────────────────────────────
  'kanye:The College Dropout': {  // soul chops, warm swing ~88 BPM
    kick:    [1,0,0,0, 0,1,0,0, 1,0,0,0, 0,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'kanye:Late Registration': {  // orchestral, heavy kick
    kick:    [1,0,0,1, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'kanye:Graduation': {  // electronic anthemic, 4-on-floor
    kick:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,1],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'kanye:808s & Heartbreak': {  // emotional synths, sparse
    kick:    [1,0,0,0, 0,0,0,0, 0,0,0,0, 1,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 0,1,0,0],
    hat:     [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'kanye:Yeezus': {  // industrial, distorted, off-beat
    kick:    [1,0,0,1, 1,0,0,0, 1,0,0,1, 0,0,1,0],
    snare:   [0,0,1,0, 0,0,0,0, 1,0,0,0, 0,0,0,1],
    hat:     [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'kanye:The Life of Pablo': {  // gospel chops, chaotic
    kick:    [1,0,1,0, 0,0,0,0, 1,0,0,0, 1,0,1,0],
    snare:   [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,0],
    hat:     [1,1,0,1, 1,0,1,0, 1,1,0,1, 1,0,0,1],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,1,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },

  // ── CUDI ───────────────────────────────
  'cudi:Man on the Moon': {  // dreamy, sparse
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'cudi:Man on the Moon II': {  // dark psychedelic, sub
    kick:    [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
    snare:   [0,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
    hat:     [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'cudi:Indicud': {  // glitchy electronic, arps
    kick:    [1,0,0,1, 0,0,1,0, 1,0,0,0, 0,1,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,0,1,1, 1,0,1,0, 1,0,0,1],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'cudi:Satellite Flight': {  // ultra-minimal atmospheric
    kick:    [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 0,0,0,0],
    hat:     [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,0,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  "cudi:Speedin' Bullet 2 Heaven": {  // distorted punk energy
    kick:    [1,0,1,0, 1,0,1,0, 1,0,1,0, 0,1,0,1],
    snare:   [0,0,0,0, 1,0,0,0, 0,1,0,0, 1,0,0,1],
    hat:     [1,1,0,1, 1,1,0,1, 1,1,0,1, 1,1,0,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  "cudi:Passion Pain Demon Slayin'": {  // orchestral, emotional
    kick:    [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,0,1,0, 1,0,0,1, 1,0,1,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'cudi:Man on the Moon III': {  // nostalgic warm, mid-tempo
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,1,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,1],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },

  // ── TRAVIS ─────────────────────────────
  'travis:Owl Pharaoh': {  // reverb early trap, sparse
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 0,1,0,1, 1,0,1,0, 0,1,0,0],
    openHat: [0,0,0,1, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'travis:Days Before Rodeo': {  // psychedelic dark texture
    kick:    [1,0,0,0, 1,0,0,0, 1,0,1,0, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
    hat:     [1,1,0,1, 1,1,0,1, 1,1,0,1, 1,0,1,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'travis:Rodeo': {  // festival layered synths
    kick:    [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,0,0],
    snare:   [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,0],
    hat:     [1,1,0,1, 1,0,1,1, 1,1,0,1, 1,0,1,1],
    openHat: [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'travis:Birds in the Trap': {  // dark trap, pitch-down 808
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 1,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,1, 1,0,1,0, 1,0,1,1, 1,0,0,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,1,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'travis:Astroworld': {  // euphoric carnival swells
    kick:    [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,1,1,0, 1,1,0,1, 1,1,1,0, 1,0,1,1],
    openHat: [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'travis:Utopia': {  // futuristic dense textures
    kick:    [1,0,1,0, 0,0,0,0, 1,0,1,0, 0,0,0,1],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,1, 1,0,0,0],
    hat:     [1,1,0,1, 1,1,0,1, 1,1,0,1, 1,1,0,0],
    openHat: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },

  // ── DRAKE ──────────────────────────────
  'drake:Thank Me Later': {  // polished trap, melodic piano
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 1,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,1,1,0, 1,0,1,0, 1,0,1,0],
    openHat: [0,0,0,1, 0,0,0,0, 0,0,0,0, 0,0,0,1],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'drake:Take Care': {  // R&B trap, emotional
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [0,0,1,0, 0,1,0,0, 0,0,1,0, 0,1,0,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'drake:Nothing Was the Same': {  // atmospheric, crisp
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 1,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  "drake:If You're Reading This": {  // raw, minimal
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,1],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'drake:Views': {  // dancehall, offbeat hats
    kick:    [1,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
    snare:   [0,0,0,0, 0,1,0,0, 0,0,0,0, 0,1,0,0],
    hat:     [0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,0,1],
    openHat: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'drake:Scorpion': {  // clean commercial, polished
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 1,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,1,1,0, 1,0,1,0, 1,1,0,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,1,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'drake:Certified Lover Boy': {  // R&B warm bass
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 0,1,1,0, 1,0,1,0, 0,1,0,0],
    openHat: [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },

  // ── YOUNG THUG ─────────────────────────
  'thug:Barter 6': {  // melodic trap, flowing
    kick:    [1,0,0,0, 1,0,0,0, 1,0,0,1, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,1,0,1, 0,1,1,0, 1,1,0,1, 0,1,0,0],
    openHat: [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'thug:Slime Season': {  // hard trap, slamming
    kick:    [1,0,1,0, 0,0,0,0, 1,0,1,0, 0,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,1, 1,0,0,0],
    hat:     [1,1,1,0, 1,1,0,1, 1,1,1,0, 1,1,0,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'thug:Jeffery': {  // experimental, unusual chords
    kick:    [1,0,0,1, 0,0,0,0, 0,1,0,0, 1,0,0,0],
    snare:   [0,0,0,0, 1,0,1,0, 0,0,0,0, 1,0,0,1],
    hat:     [1,0,1,0, 1,0,0,1, 0,1,1,0, 1,0,1,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'thug:Beautiful Thugger Girls': {  // country-trap, unusual
    kick:    [1,0,0,0, 0,1,0,0, 1,0,0,0, 0,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,0,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'thug:So Much Fun': {  // mainstream bouncy
    kick:    [1,0,0,0, 1,0,1,0, 1,0,0,0, 0,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,1,0,1, 1,1,0,1, 1,1,0,1, 1,0,1,1],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'thug:Punk': {  // alternative, unpredictable
    kick:    [1,0,0,0, 0,0,0,1, 0,0,1,0, 1,0,0,0],
    snare:   [0,0,1,0, 1,0,0,0, 0,1,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 0,1,0,1, 1,0,0,1, 0,1,1,0],
    openHat: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,0,1],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },

  // ── KEN CARSON ─────────────────────────
  'ken:A Great Chaos': {  // hyper-aggressive, fast hats
    kick:    [1,0,1,0, 1,0,0,1, 1,0,1,0, 1,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,1, 1,0,0,0],
    hat:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,0,1],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,1, 0,0,0,1, 0,0,0,1, 0,0,0,0],
  },
  'ken:Project X': {  // distorted synths, rage
    kick:    [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,0,1],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
    hat:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,1,1, 0,0,0,0, 0,0,0,0],
  },
  'ken:I Am Nothing': {  // melodic rage, raw
    kick:    [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,1,1,0, 1,1,1,0, 1,1,1,0, 1,1,0,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'ken:X': {  // pure rage, maximum distortion
    kick:    [1,0,1,0, 1,0,1,1, 1,0,1,0, 1,0,1,1],
    snare:   [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,1],
    hat:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
  },

  // ── CARTI ──────────────────────────────
  'carti:Playboi Carti': {  // dreamy melodic, airy (spec example)
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
    openHat: [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'carti:Die Lit': {  // high-energy bouncy 808
    kick:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 0,1,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
    hat:     [1,1,0,1, 1,1,0,1, 1,1,0,1, 1,0,1,1],
    openHat: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,1],
  },
  'carti:Whole Lotta Red': {  // chaotic rage, dissonant (from spec)
    kick:    [1,0,1,0, 1,0,0,1, 1,0,1,0, 0,1,0,1],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
    hat:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,0,1,1],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,1,1],
  },
  'carti:Music': {  // dense psychedelic, experimental
    kick:    [1,0,0,1, 0,0,1,0, 1,0,0,0, 1,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,1,0,0, 1,0,0,1],
    hat:     [1,1,0,1, 0,1,1,0, 1,0,1,1, 0,1,0,1],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,1,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },

  // ── FUTURE ─────────────────────────────
  'future:Pluto': {  // dark auto-tune, murky reverb
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 1,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,0,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,1,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'future:DS2': {  // street trap, slamming 808
    kick:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,1, 1,0,1,0, 1,0,1,1, 1,0,0,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,1,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'future:EVOL': {  // darker minimal, sparse
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,0,0,0, 1,0,1,0, 0,0,0,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'future:HNDRXX': {  // R&B trap, emotional piano
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,1,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 0,1,0,0, 1,0,1,0, 0,1,0,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'future:The WIZRD': {  // atmospheric, layered pads
    kick:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,1, 1,0,1,0, 1,0,1,1, 0,0,0,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'future:I Never Liked You': {  // dark modern trap, heavy 808
    kick:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,1, 1,0,0,0],
    hat:     [1,0,1,1, 1,0,1,1, 1,0,1,1, 1,0,0,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,1,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },

  // ── UZI ────────────────────────────────
  'uzi:Luv Is Rage': {  // lo-fi emo trap, raw
    kick:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
    hat:     [1,1,0,1, 1,1,0,1, 1,1,0,1, 1,1,0,0],
    openHat: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'uzi:Luv Is Rage 2': {  // melodic emo, bright synths
    kick:    [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,1,0,1, 1,1,0,1, 1,1,0,1, 1,0,1,1],
    openHat: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'uzi:Eternal Atake': {  // sci-fi, glitchy hi-hats
    kick:    [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
    hat:     [1,1,1,0, 1,0,1,1, 0,1,1,0, 1,0,1,1],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
  },
  'uzi:The Pink Tape': {  // experimental, genre-blending
    kick:    [1,0,0,1, 0,0,0,0, 1,0,0,0, 1,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,1,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,1,0,1, 1,0,0,1, 0,1,1,0],
    openHat: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },

  // ── TYLER ──────────────────────────────
  'tyler:Goblin': {  // dark lo-fi, confrontational
    kick:    [1,0,0,0, 0,1,0,0, 1,0,0,0, 0,1,0,0],
    snare:   [0,0,1,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
    hat:     [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    openHat: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'tyler:Wolf': {  // jazz-adjacent, layered chords
    kick:    [1,0,0,0, 0,1,0,0, 1,0,0,0, 0,1,0,0],
    snare:   [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0],
    openHat: [0,1,0,0, 0,1,0,0, 0,1,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'tyler:Cherry Bomb': {  // psychedelic distortion, chaotic
    kick:    [1,0,0,1, 0,0,0,0, 1,0,1,0, 0,0,0,1],
    snare:   [0,0,1,0, 1,0,0,0, 0,1,0,0, 1,0,0,0],
    hat:     [1,1,0,0, 1,0,0,1, 0,1,1,0, 1,0,0,1],
    openHat: [0,0,0,0, 0,1,0,0, 0,0,0,0, 0,1,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'tyler:Flower Boy': {  // jazzy melodic, introspective
    kick:    [1,0,0,0, 0,1,0,0, 1,0,0,0, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
    hat:     [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0],
    openHat: [0,1,0,0, 0,1,0,0, 0,1,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'tyler:IGOR': {  // neo-soul, emotional layering
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    snare:   [0,0,0,0, 1,0,1,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 0,1,0,0, 1,0,1,0, 0,1,0,0],
    openHat: [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'tyler:Call Me If You Get Lost': {  // boom-bap revival, sample-heavy
    kick:    [1,0,0,0, 0,0,0,0, 0,1,0,0, 1,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,1,0,0, 1,0,1,0, 1,1,0,0, 1,0,1,0],
    openHat: [0,0,0,0, 0,1,0,0, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'tyler:Chromakopia': {  // experimental orchestral hip-hop
    kick:    [1,0,0,0, 0,1,0,0, 1,0,0,1, 0,0,0,0],
    snare:   [0,0,1,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,0,1,0, 0,1,0,1, 0,1,0,1],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },

  // ── TOLIVER ────────────────────────────
  'toliver:Heaven or Hell': {  // psychedelic trap, dreamy
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 0,1,0,0, 1,0,1,0, 0,0,0,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'toliver:Life of a DON': {  // polished melodic, lush pads
    kick:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'toliver:Love Sick': {  // dark melodic, slow-burn 808
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,1,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [0,0,1,0, 0,1,0,0, 0,0,1,0, 0,0,0,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'toliver:Hardstone Psycho': {  // dense trap, psychedelic
    kick:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 0,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,1, 1,0,1,0, 1,0,1,1, 1,0,0,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },

  // ── 21 SAVAGE ──────────────────────────
  'savage:Savage Mode': {  // minimal dark trap, cold
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,1,0],
    openHat: [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'savage:I Am > I Was': {  // mainstream melodic, piano
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,0,0],
    openHat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'savage:Savage Mode II': {  // dark orchestral, string stabs
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,1, 1,0,0,0],
    hat:     [1,0,1,0, 1,0,0,0, 1,0,1,0, 1,0,0,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,1,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
  'savage:american dream': {  // polished cinematic, melodic
    kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    openHat: [0,0,0,0, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    hatRoll: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  },
};

// ─── Helpers ────────────────────────────────
export function getArtist(id) {
  return ARTISTS.find(a => a.id === id) || ARTISTS[0];
}

export function getPreset(artistId, albumName) {
  return ALBUM_PRESETS[`${artistId}:${albumName}`] || {};
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

export function getFallbackBlueprint(artistId, albumName, mood) {
  const base = JSON.parse(JSON.stringify(BASE_BLUEPRINTS[artistId] || BASE_BLUEPRINTS.kanye));
  const preset  = getPreset(artistId, albumName);
  const moodMod = MOOD_MODIFIERS[mood] || {};

  // Apply per-album drum patterns if available
  const albumKey = `${artistId}:${albumName}`;
  const albumDrums = ALBUM_DRUM_PATTERNS[albumKey];
  if (albumDrums) {
    base.drums.kick    = [...albumDrums.kick];
    base.drums.snare   = [...albumDrums.snare];
    base.drums.hat     = [...albumDrums.hat];
    base.drums.openHat = [...albumDrums.openHat];
    base.drums.hatRoll = [...albumDrums.hatRoll];
  }

  // Apply album preset
  if (preset.tempo) {
    base.tempo = preset.tempo[0] + Math.floor(Math.random() * (preset.tempo[1] - preset.tempo[0] + 1));
  }
  if (preset.swing          !== undefined) base.drums.swing         = preset.swing;
  if (preset.bassDistortion !== undefined) base.bass.distortion     = preset.bassDistortion;
  if (preset.reverb         !== undefined) base.effects.reverb      = preset.reverb;
  if (preset.delay          !== undefined) base.effects.delay       = preset.delay;
  if (preset.chorus         !== undefined) base.effects.chorus      = preset.chorus;
  if (preset.phaser         !== undefined) base.effects.phaser      = preset.phaser;

  // Apply mood modifier
  if (moodMod.tempoDelta)   base.tempo = clamp(base.tempo + moodMod.tempoDelta, 55, 200);
  if (moodMod.reverbMult)   base.effects.reverb = clamp(base.effects.reverb * moodMod.reverbMult, 0, 1);
  if (moodMod.distMult)     base.bass.distortion = clamp(base.bass.distortion * moodMod.distMult, 0, 1);
  if (moodMod.swingMult)    base.drums.swing = clamp(base.drums.swing * moodMod.swingMult, 0, 0.5);
  if (moodMod.chorus !== undefined) base.effects.chorus = clamp((base.effects.chorus || 0) + moodMod.chorus, 0, 1);
  if (moodMod.phaser !== undefined) base.effects.phaser = clamp((base.effects.phaser || 0) + moodMod.phaser, 0, 1);

  // Apply densityMult (fix: was calculated but never applied)
  if (moodMod.densityMult) {
    const dm = moodMod.densityMult;
    ['kick','snare','hat','openHat','hatRoll'].forEach(track => {
      base.drums[track] = base.drums[track].map(v => {
        if (dm > 1 && v === 0) return Math.random() < (dm - 1) * 0.3 ? 1 : 0;
        if (dm < 1 && v === 1) return Math.random() < (1 - dm) * 0.4 ? 0 : 1;
        return v;
      });
    });
  }

  return base;
}
