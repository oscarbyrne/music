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
  inscribe: function(pattern, part) {
    return pattern.midichan(part).midi();
  },
  // TODO: register e2.insribe to pattern api
};

function sp(pattern) {
  // TODO: substitute strings identifying bank / pad for midi notes and midi channel
  return pattern.midi();
};

"A12 A11".velocity("0 0.5 1").sp()
"c2 d2".ccn(e2.filter.cutoff).ccv("0 0.5 1").e2(3)
