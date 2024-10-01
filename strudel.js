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
  
  "60".struct(
    cat(
      "[x ~ ~ ~] [~ ~ x ~] [x ~ ~ ~] [~ ~ ~ ~]",
      "[x ~ x ~] [~ ~ x ~] [~ ~ ~ ~] [~ ~ ~ ~]",
    ).slow(4)
  ).e2(9),
  "60".struct(
    cat(
      "[~ ~ ~ ~] [x ~ ~ ~]",
    ).slow(2)
  ).e2(10),
  "60".struct(
    cat(
      "[~ ~ ~ ~] [x ~ ~ ~] [~ ~ ~ ~] [x ~ x ~]",
      "[~ ~ x ~] [~ ~ x ~] [x x ~ ~] [x ~ ~ ~]",
      "[~ ~ ~ ~] [x ~ ~ ~] [~ ~ ~ ~] [x ~ x ~]",
      "[~ ~ x ~] [~ ~ x ~] [X ~ ~ ~] [~ ~ ~ ~]",
    ).slow(4)
  ).e2(13),
  "60".struct(
    cat(
      "[x ~ ~ ~] [~ ~ x ~] [~ ~ ~ ~] [~ ~ ~ ~]",
      "[x ~ ~ ~] [x ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]",
      "[x ~ ~ ~] [~ ~ x ~] [~ ~ ~ ~] [~ ~ ~ ~]",
      "[~ ~ ~ ~] [x ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]",
    ).slow(4)
  ).e2(14),
  "60".struct(
    cat(
      "[~ ~ x ~] [~ ~ x ~] [~ ~ ~ ~] [~ ~ ~ ~]",
      "[~ ~ x ~] [~ ~ x ~] [~ x x ~] [~ ~ ~ ~]",
      "[~ ~ x ~] [~ ~ x ~] [~ ~ ~ ~] [~ ~ ~ ~]",
      "[~ ~ x x] [~ ~ x ~] [~ ~ x ~] [~ ~ ~ ~]",
    ).slow(4)
  ).e2(15),
  cat(
    "[~ ~ 0 ~] [~ 0 ~ ~] [0 ~ ~ 0] [~ ~ 0 ~]",
    "[0 ~ 0 ~] [~ ~ 0 ~] [0 ~ ~ 0] [~ ~ 0 ~]",
    "[~ ~ 0 0] [0 ~ ~ ~] [0 ~ 0 ~] [~ ~ 0 ~]",
    "[~ 0 ~ 0] [~ ~ 1 ~] [~ 1 ~ ~] [1 ~ 1 ~]",
  ).slow(4).withValue(
    v => ['c4', 'c#4'][v]
  ).e2(3),
  cat(
    "c4, c#4, g4",
    "g4, c5, c#5",
  ).slow(16).e2(4),
  
  // "9 10".slow(32).sp('A'),
  
).cpm(134)
