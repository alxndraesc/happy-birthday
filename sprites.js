/* WONA OS — pixel art. Each sprite is a 12x12 grid; each letter is a color from PALETTE ("." = transparent).
   You normally don't need to edit this file. To add an icon, copy a sprite below and change the letters. */

const PALETTE = { k: "#2a223e", w: "#fff", l: "#e8ddff", p: "#f4c3df", d: "#d976ad", m: "#c9ecd9", y: "#ffe27a", g: "#a99bc4", b: "#8fc6f0" };
const SPRITES = {
  heart: ["............", ".kkk....kkk.", "kpppk..kpppk", "kpwppkkppppk", "kpwpppppppdk", "kpppppppppdk", ".kpppppppdk.", "..kpppppdk..", "...kpppdk...", "....kpdk....", ".....kk.....", "............"],
  folder: ["............", ".kkkkk......", "kpppppkkkkk.", "kkkkkkkkkkkk", "kppppppppppk", "kppppppppppk", "kppppppppppk", "kppppppppppk", "kpppppppppdk", "kkkkkkkkkkkk", "............", "............"],
  envelope: ["............", "............", "kkkkkkkkkkkk", "kwwwwwwwwwwk", "kkwwwwwwwwkk", "kwkkwwwwkkwk", "kwwwkkkkwwwk", "kwwwwwwwwwwk", "kwwwwwwwwwwk", "kkkkkkkkkkkk", "............", "............"],
  computer: [".kkkkkkkkkk.", ".kllllllllk.", ".klbbbbbblk.", ".klbwbbbblk.", ".klbbbbbblk.", ".klbbbbbblk.", ".kllllllllk.", ".kkkkkkkkkk.", "....kllk....", "...kkllkk...", "..kllllllk..", "..kkkkkkkk.."],
  trash: ["....kkkk....", ".kkkkkkkkkk.", "..kgwgwgwk..", "..kgwgwgwk..", "..kgwgwgwk..", "..kgwgwgwk..", "..kgwgwgwk..", "..kgwgwgwk..", "..kgwgwgwk..", "..kkkkkkkk..", "............", "............"],
  camera: ["............", "...kkkkkk...", "kkkkkkkkkkkk", "kpppppppppdk", "kpppkkkkpppk", "kppkwwwwkppk", "kppkwkkwkppk", "kppkwwwwkppk", "kpppkkkkpppk", "kpppppppppdk", "kkkkkkkkkkkk", "............"],
  cd: ["...kkkkkk...", ".kkllllllkk.", ".klwwlllllk.", "kllwlllllllk", "klllllkklllk", "klllllkklllk", "klllllkklllk", "kllllllllppk", ".klllllllpk.", ".kkllllllkk.", "...kkkkkk...", "............"],
  clock: ["...kkkkkk...", ".kkwwwwwwkk.", ".kwwwwkwwwk.", "kwwwwwkwwwwk", "kwwwwwkwwwwk", "kwwwwwkkkwwk", "kwwwwwwwwwwk", "kwwwwwwwwwwk", ".kwwwwwwwwk.", ".kkwwwwwwkk.", "...kkkkkk...", "............"],
  star: [".....kk.....", ".....kk.....", "....kyyk....", "kkkkkyykkkkk", "kyyyyyyyyyyk", ".kyyyyyyyyk.", "..kyyyyyyk..", "..kyyyyyyk..", ".kyyykkyyyk.", ".kyykk.kkyk.", ".kkk....kkk.", "............"],
  globe: ["...kkkkkk...", ".kkbbbbbbkk.", ".kbbggbbbbk.", "kbbgggbbbbbk", "kbbgggggbbbk", "kbbbgggbbbbk", "kbbbbggbggbk", "kbbbbbbbgggk", ".kbbbbbbbbk.", ".kkbbbbbbkk.", "...kkkkkk...", "............"],
  power: [".....kk.....", ".....kk.....", "..kk.kk.kk..", ".kk..kk..kk.", "kk...kk...kk", "kk...kk...kk", "kk........kk", "kk........kk", ".kk......kk.", "..kk....kk..", "...kkkkkk...", "............"],
  chat: ["............", ".kkkkkkkkkk.", "kpppppppppdk", "kpwwpwwpwwpk", "kpppppppppdk", ".kkkkkkkkkk.", "....kppk....", "....kpk.....", "....kk......", "............", "............", "............"]
};

/** Returns an inline SVG for a sprite name, e.g. sprite("heart"). */
function sprite(name) {
  let rects = "";
  SPRITES[name].forEach((row, y) => [...row].forEach((ch, x) => {
    if (PALETTE[ch]) rects += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${PALETTE[ch]}"/>`;
  }));
  return `<span class="sp"><svg viewBox="0 0 12 12" shape-rendering="crispEdges">${rects}</svg></span>`;
}