const MIDI_DEVICE = 'UM-ONE MIDI 1';

const e2 = {
  note: {
    trigger: 60,
  },
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
    return pattern.midichan(part).midi(MIDI_DEVICE);
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

// Recursive J function models a FiPS configuration space action on beam k
// Source: https://mtosmt.org/issues/mto.19.25.2/mto.19.25.2.plotkin.html
function J(d, m, k) {
  if (d.length < 2 || m.length < 1) {
    return k;
  }
  k = J(d.slice(1), m.slice(1), k);
  return Math.floor((k * d[0] + m[0]) / d[1]);
}

// Transform timing of a pattern to match 'rhythm key' defined by FiPS
function warp(d, m, pattern) {
  const d0 = d[0];
  const dn = d.at(-1);
  
  let layers = [];
  
  // Split pattern into equal segments to be time-stretched
  for (var n = 0; n < dn; n++) {
    // Fig 1
    //         l0   r0
    //         |    |
    //  0------+====+----------d0

    // Fig 2
    //           l1     r1
    //           |      |
    //  0--------+======+------d0
    const l0 = n;
    const r0 = n + 1;
    const l1 = J(d, m, l0);
    const r1 = J(d, m, r0);

    if (r1 > d0) {
      // In case r1 overshoots d0, split off the overshot (section b) and place it
      // at beginning of cycle
      
      // Fig 3
      //             la0    ra0
      //             |      |
      //  0----------+======+####d0
      //                    |    |
      //                    lb0  rb0
      
      // Fig 4
      //               la1       ra1
      //               |         |
      //  0------------+=========d0     +
      //                         |      |
      //                         lb1    rb1

      // Fig 5
      //               la1       ra1
      //               |         |
      //  0######+-----+=========d0
      //  |      |
      //  lb1    rb1

      // Fig 3 shows pre-transformation
      // Fig 4 shows post-transformation, where section b has overshot
      // Fig 5 shows post-transformation, section b moved to beginning of cycle

      // Calculate widths
      const w0 = r0-l0;
      const w1 = r1-l1;
      const wa1 = d0-l1;
      const wa0 = wa1*w0/w1;

      // Pre-transformation
      const la0 = l0;
      const ra0 = la0 + wa0;
      const lb0 = ra0;
      const rb0 = r0;

      // Move section b to beginning of cycle post-transformation
      const la1 = l1;
      const ra1 = d0;
      const lb1 = 0;
      const rb1 = r1-d0;

      layers.push(
        (p) => p.zoom(la0/dn, ra0/dn).compress(la1/d0, ra1/d0),
        (p) => p.zoom(lb0/dn, rb0/dn).compress(lb1/d0, rb1/d0)
      )
    } else {
      layers.push(
        (p) => p.zoom(l0/dn, r0/dn).compress(l1/d0, r1/d0)
      )
    }
  }
  return pattern.layer(...layers);
};

// Transform pitches of a pattern to match scale key defined by FiPS
// Allow for octave offset
function weft(d, m, octave, pattern) {
  return pattern.withValue(
    k => Math.ceil(
      12*(octave + J(d, m, k)/d[0])
    )
  ).note()
}

function cc(n, scalar, pattern) {
  return ccv(pattern.div(scalar)).ccn(n);
}

function init() {
  register('e2', e2.inscribe);
  register('sp', sp.inscribe);
  register('warp', warp);
  register('weft', weft);
  register('cc', cc);
};

init();

stack(
  //"".e2(1), // reserved for SP
  //"".e2(2), // reserved for SP

  sine.segment(16).range(50, 68).slow(4)
  .warp([8,5,3],[0,1])
  .cc(e2.filter.cutoff, 127)
  .e2(3),
  
  "0!4"
  .warp([8,5,3], [0,1])
  .weft([12,1], [0], 5)
  .e2(15),
  
  "[0 0] 0 0"
  .warp([8,5,3], [0,1])
  .weft([12,1], [0], 5)
  .e2(9),
  
  "0!12"
  .warp([8,4,3], [0,2])
  .weft([12,1], [0], 5)
  .e2(13),
  
  "0!4"
  .warp([8,5,3,2], [0,1,0])
  .weft([12,1], [0], 5)
  .e2(12),

  "0!2"
  .warp([8,2],[4])
  .weft([12,1], [0], 5)
  .e2(11),

  "0 1 ~ ~ 2 ~ 1 1"
  .warp([8,5,3], [0,1])
  .weft([8,5,3], [3,1], 4)
  .e2(3)
  
).cpm(132/4)
