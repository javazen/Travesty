const TRACE = true;
const DEBUG = true;
const TESTING = true;

const CHARS = "abcdefghijklmnopqrstuvwxyz '";
const R = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
let rIndex = 0;

if (TRACE) console.log('travesty.js loaded');

// export function log(str) {
//   if (DEBUG) console.log(str);
// }

export function transform(str, order) {
  // clean the string of chars not in CHARS
  // str = str.toLowerCase();
  // str = str.replace(/[^a-zA-Z ']+/g,'');
  str = cleanStr(str);
  
  let newstr = '';
  const arr = CHARS.slice(0);
  // const arr = process(str);
  if (order === 0) {
    newstr = level0(arr, str);
    return newstr;
  } else if (order === 1) {
    newstr = level1(arr, str);
    return newstr;
  } else if (order === 2) {
    newstr = level2(arr, str);
    return newstr;
  } else if (order === 3) {
    newstr = level3(arr, str);
    return newstr;
  }
  
  return str;
}

function cleanStr(str) {
  let newstr = str.toLowerCase();
  newstr = newstr.replace(/[^a-zA-Z ']+/g,'');
  return newstr;
}

// str should already have been cleaned, all chars should be in charsArr
function initDistArr1(charsArr, str) {
  const distArr = Array(charsArr.length).fill(0);
  
  for (let i=0; i<str.length; i++) {
    const ch = str[i];
    const pos = charsArr.indexOf(ch);
    if (pos === -1) {
      if (DEBUG) console.log('bad ch= ' + ch);
    } else {
      distArr[pos] = distArr[pos] + 1;
    }
  }
  
  // more convenient to have a cumulative distribution
  let cumCount = 0;
  for (let i=0; i<distArr.length; i++) { // element in row
    const currentCount = distArr[i];
    cumCount += currentCount;
    distArr[i] = cumCount;
  }
  
  return distArr;
}

function initDistArr2(charsArr, str) {
  const distArr1 = Array(charsArr.length).fill(0);
  const distArr2 = [];
  for (let i=0; i<charsArr.length; i++) {
    distArr2.push(distArr1.slice(0));
  }
  
  for (let i=1; i<str.length; i++) {
    const prevch = str[i-1];
    const prevpos = charsArr.indexOf(prevch);
    if (prevpos === -1) {
      if (DEBUG) console.log('bad ch= ' + prevch);
    } else {
      const ch = str[i];
      const pos = charsArr.indexOf(ch);
      if (pos === -1) {
        if (DEBUG) console.log('bad ch= ' + ch);
      } else {
        distArr2[prevpos][pos] = distArr2[prevpos][pos] + 1;
      }
    }
  }
  
  // more convenient to have a cumulative distribution
  for (let i=0; i<charsArr.length; i++) { // row
    let cumCount = 0;
    for (let j=0; j<distArr2.length; j++) { // element in row
      const currentCount = distArr2[i][j];
      cumCount += currentCount;
      distArr2[i][j] = cumCount;
    }
  }
  
  return distArr2;
}

function initDistArr3(charsArr, str) {
  const len = str.length;
  const distArr1 = Array(charsArr.length).fill(0);
  const distArr3 = [];
  for (let i=0; i<charsArr.length; i++) {
    let distArr2 = [];
    for (let j=0; j<charsArr.length; j++) {
      distArr2.push(distArr1.slice(0));
    }
    distArr3.push(distArr2);
  }
  
  for (let i=2; i<len; i++) {
    const prevprevch = str[i-2];
    const prevprevpos = charsArr.indexOf(prevprevch);
    if (prevprevpos === -1) {
      if (DEBUG) console.log('bad ch= ' + prevprevch);
    } else {
      // const plane = distArr3[prevprevpos];
      const prevch = str[i-1];
      const prevpos = charsArr.indexOf(prevch);
      if (prevpos === -1) {
        if (DEBUG) console.log('bad ch= ' + prevch);
      } else {
        // const row = plane[prevpos];
        const ch = str[i];
        const pos = charsArr.indexOf(ch);
        if (pos === -1) {
          if (DEBUG) console.log('bad ch= ' + ch);
        } else {
          // row[pos] = row[pos] + 1;
          distArr3[prevprevpos][prevpos][pos] = distArr3[prevprevpos][prevpos][pos] + 1;
        }
      }
    }
  }
  
  // more convenient to have a cumulative distribution
  for (let i=0; i<distArr3.length; i++) {
    const plane = distArr3[i].slice(0);
    for (let j=0; j<plane.length; j++) {
      const row = plane[j].slice(0);
      let cumCount = 0;
      for (let k=0; k<row.length; k++) {
        const currentCount = row[k];
        cumCount += currentCount;
        distArr3[i][j][k] = cumCount;
      }
    }
  }

  return distArr3;
}

// export function process(str) {
//   let arr = [];
// 
//   return arr;
// }

function random(seed) {
  if (TESTING) {
    if (seed) rIndex = seed;
    rIndex++;
    if (rIndex >= R.length) rIndex = 0;
    return R[rIndex];
  }

  return Math.random();
}

export function level0(arr, str) {
  const len = str.length;
  let newstr = 'L0:  ';
  for (let i=0; i<len; i++) {
    const n = Math.floor(arr.length * Math.random());
    const ch = arr[n];
    newstr += ch;
  }
  
  return newstr;
}

function level1(charsArr, str) {
  const len = str.length;

  // first get the distribution
  const cumDistArr1 = initDistArr1(charsArr, str);

  // use it to generate a new string of chars selected at random
  let newstr = 'L1: ';
  for (let i=0; i<len; i++) {
    // const n = Math.ceil((len) * Math.random());
    const n = Math.ceil((len) * random());
    const pos = cumDistArr1.findIndex(element => element >= n);
    const ch = charsArr[pos];
    newstr += ch;
  }
  
  return newstr;
}

function level2(charsArr, str) {
  const len = str.length;
  
  // first get the distribution
  const cumDistArr1 = initDistArr1(charsArr, str);
  const cumDistArr2 = initDistArr2(charsArr, str);

  const rowTotals = []; // distArr1
  for (let i=0; i<charsArr.length; i++) {
    rowTotals.push(cumDistArr2[i][charsArr.length-1]);
  }
  
  const fn = element => element >= n;
  let n, pos, ch, newstr = 'L2:  ';
  // use order==1 approach to get char 0
  // n = Math.ceil((len) * Math.random());
  n = Math.ceil((len) * random());
  pos = cumDistArr1.findIndex(fn);
  ch = charsArr[pos];
  newstr += ch;
  // all the rest depend on the char that came before them
  for (let i=1; i<len; i++) {
    let prevpos = pos;
    let rowtot = rowTotals[prevpos];
    // n = Math.ceil((rowtot) * Math.random());
    n = Math.ceil((rowtot) * random());
    pos = cumDistArr2[prevpos].findIndex(fn);
    ch = charsArr[pos];
    newstr += ch;
  }
  
  return newstr;
}

function level3(charsArr, str) {
  const len = str.length;
  
  // first get the distribution
  const cumDistArr1 = initDistArr1(charsArr, str);
  const cumDistArr2 = initDistArr2(charsArr, str);
  const cumDistArr3 = initDistArr3(charsArr, str);
  
  // get (cumulative) row totals
  const rowTotals2 = []; // distArr1
  for (let i=0; i<charsArr.length; i++) {
    rowTotals2.push(cumDistArr2[i][charsArr.length-1]);
  }
  const rowTotals3 = []; // distArr2
  for (let i=0; i<charsArr.length; i++) {
    let tempRowTotals = [];
    for (let j=0; j<charsArr.length; j++) {
      tempRowTotals.push(cumDistArr3[i][j][charsArr.length-1]);
    }
    rowTotals3.push(tempRowTotals);
  }
  
  const fn = element => element >= n;
  let n, ch, prevch, prevprevch, pos, prevpos, prevprevpos, newstr = 'L3:  ';
  
  // use order==1 approach to get char 0
  // n = Math.ceil((len) * Math.random());
  n = Math.ceil((len) * random());
  prevprevpos = cumDistArr1.findIndex(fn);
  prevprevch = charsArr[prevprevpos];
  newstr += prevprevch;
  
  // use order==2 approach to get char 1
  let rowtot = rowTotals2[prevprevpos];
  // n = Math.ceil((rowtot) * Math.random());
  n = Math.ceil((rowtot) * random());
  prevpos = cumDistArr2[prevprevpos].findIndex(fn);
  prevch = charsArr[prevpos];
  newstr += prevch;
  
  // all the rest depend on the 2 chars that came before them
  for (let i=2; i<len; i++) {
    let rowtot = rowTotals3[prevprevpos][prevpos];
    // n = Math.ceil((rowtot) * Math.random());
    n = Math.ceil((rowtot) * random());
    pos = cumDistArr3[prevprevpos][prevpos].findIndex(fn);
    ch = charsArr[pos];
    newstr += ch;
    prevprevpos = prevpos;
    prevpos = pos;
  }
  
  return newstr;
}
