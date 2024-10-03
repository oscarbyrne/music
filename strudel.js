const MIDI_DEVICE = 'UM-ONE MIDI 1';

const e2 = {
  oscillator: {
    pitch: 80,
    glide: 81,
    edit: 82,
    level: 7,
    pan: 10,
  },
  filter: {
    cutoff: 74,
    resonance: 71,
    eg: 83,
  },
  modulation: {
    depth: 85,
    speed: 86,
  },
  amp: {
    attack: 73,
    decay: 72,
  },
  insert: {
    edit: 87,
  },
  touchpad: {
    x: 102,
    y: 103,
  },
  inscribe: function(part, pattern) {
    return pattern.note().midichan(part).midi(MIDI_DEVICE);
  },
};

const sp = {
  inscribe: function(bank, pattern) {
    return pattern.withValue(
      v => {
        const n_bank = 'ABCDEFGHIJ'.indexOf(bank.toUpperCase());
        const midichan = 1 + Math.floor(n_bank / 5);
        const note = 46 + v + (12 * (n_bank % 5));
        return {
          note: note,
          midichan: midichan,
        };
      }
    ).midi(MIDI_DEVICE);
  },
};

function cc(n, v, pattern) {
  return pattern.ccn(n).ccv(v / 127);
};

function init() {
  register('e2', e2.inscribe);
  register('sp', sp.inscribe);
  register('cc', cc);
};

init();

stack(
  //"".e2(1), // reserved for SP
  //"".e2(2), // reserved for SP

  // "60".struct(
  //   cat(
  //     "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]",
  //     "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]",
  //     "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]",
  //     "[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]",
  //   ).slow(4)
  // ).e2(3),

  
  "[3 [~ 3] 4 [3 ~]] [~ 3 4 ~]".slow(4).sp('A'),
  "7".slow(4).sp('A'),
  "~!7 <~!3 [8 ~ ~ ~]>".slow(4).sp('A'),
  "9 10".slow(8).sp('A'),
  // "[11 ~!6 [11 11]] [12 ~!6 [12 12]]".slow(8).sp('A'),
  "<~ [[~!7 [1 1]] [[1 ~] [2 2] [2 ~] [4 3] [3 ~] ~!3]]>".slow(8).sp('B'),
).cpm(89).hush()

stack(
  "1 2 2 2".slow(4).sp('F'),
  "5".late(0.5).sp('F'),
  "9".late(0.5).slow(2).sp('F'),
  "< ~ 10>".late(0.5002).slow(2).sp('F'),
  "6".slow(8).sp('F'),
  "5 5 5 6 6 ~".slow(4).late(1/3).sp('G'),
  "<~ ~ [9@3 ~@1] ~>".slow(8).sp('G'),
  "10@15 ~".slow(4).sp('G'),
  "11 11 [11 11] [~ 11] [~ 11] [11 11] 11 11".slow(4).sp('G'),
  cat(
    "12 [12 12] 12 12",
    "[12 12] [~ 12] [~ 12] [12 12]",
    "[12 12] 12 12 [12 12]",
    "[12 12] [~ 12] ~ ~",
    "12 [~ 12] [12 12] [~!3 12]",
    "[~ 12] [~ 12] [12 12] ~",
    "12 [~ 12] [12 12] [~!3 12]",
    "[~ 12] [~ 12] [12 12] ~"
  ).slow(4).sp('G'),
).cpm(137)
