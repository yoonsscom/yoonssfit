const CODE_ALPHABET = "23456789CFGHJMPQRVWX";

function decodeOLC(code) {
  code = code.replace("+", "").toUpperCase();
  let lat = -90, lng = -180;
  let latRes = 20, lngRes = 20;
  for (let i = 0; i < 10; i += 2) {
    const latDigit = CODE_ALPHABET.indexOf(code[i]);
    const lngDigit = CODE_ALPHABET.indexOf(code[i+1]);
    lat += latDigit * latRes;
    lng += lngDigit * lngRes;
    latRes /= 20;
    lngRes /= 20;
  }
  if (code.length > 10) {
    const d = CODE_ALPHABET.indexOf(code[10]);
    const row = Math.floor(d / 4);
    const col = d % 4;
    lat += row * (latRes / 5);
    lng += col * (lngRes / 4);
    lat += (latRes / 10);
    lng += (lngRes / 8);
  } else {
    lat += latRes * 10;
    lng += lngRes * 10;
  }
  return { lat, lng };
}

console.log("8Q7F44W8+WW2:", JSON.stringify(decodeOLC("8Q7F44W8+WW2")));
console.log("8Q7F44W8+R3R:", JSON.stringify(decodeOLC("8Q7F44W8+R3R")));
console.log("8Q7F44W7+VR:", JSON.stringify(decodeOLC("8Q7F44W7+VR")));
console.log("8Q7F44VG+PRP:", JSON.stringify(decodeOLC("8Q7F44VG+PRP")));
console.log("8Q7F543F+495:", JSON.stringify(decodeOLC("8Q7F543F+495")));
