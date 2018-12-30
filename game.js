//
function Piece(type, rotation = 0, size = 4) {

  const getRow = (index, maxX) => Math.floor(index / size);
  const getCol = (index, maxX) => (index % size);
  const getIndex = (x, y, maxX) => (x * maxX) + y;
  const isSameRow = (a, aMaxX, b, bMaxX) => {
    return getRow(a, aMaxX) === getRow(b, bMaxX);
  };
  const isNotSameRow = (a, aMaxX, b, bMaxX) => ! isSameRow(a, aMaxX, b, bMaxX);

  function isValidOffset(offset, size) {
    const o = offset;
    const s = size;
    return (o[0] >= 0 && o[1] >= 0 && o[0] < s[0]);
  }

  function calculateOffset (piece, offset) {
    let result =  [ piece.offset[0] + offset[0], piece.offset[1] + offset[1]];
    if (isValidOffset(result, piece.size))
      return result;
    return piece.offset;
  };

  function resizeIndex(index, oldXmax, newXmax) {
      return ((Math.floor(index / oldXmax)) * newXmax) + (index % oldXmax);
  };

  function getNewIndex(templateIndex, templateMaxX, offset, maxX) {
    const index = resizeIndex(templateIndex, templateMaxX, maxX);
    return  (index + offset[0]) + (maxX * offset[1]);
  };

  function calculateBlocks(piece) {
    const templateBlocks = template.allBlocks;
    const templateMaxX = template.size[0];
    const blocks = piece.allBlocks;
    const offset = piece.offset;
    const maxX = piece.size[0];
    let newBlocks = [];

    for (let i=0; i < templateBlocks.length; i++) {
      newBlocks[i] = [];
      for (let j=0; j< templateBlocks[i].length; j++) {
        const a = templateBlocks[i][j];
        const b = getNewIndex(templateBlocks[i][j], templateMaxX, offset, maxX);
        if  ( b < 0 && isNotSameRow(a,templateMaxX,b,maxX) ) {
          return false;
        }
        newBlocks[i][j] = b;
      };
    };
    return newBlocks;
  }

  this.resize = function (newMaxX = 4) {
    if (newMaxX > 3) {
      this.size[0] = newMaxX;
      this.update();
      return true;
    }
    return false;
  };

  this.rotate = () => {
    if (this.rotation >= this.allBlocks.length - 1)
      this.rotation = 0;
    else
      this.rotation++;
    return true;
  };

  this.left = function () {this.update(this, [-1,0]); return this.allBlocks;};
  this.right = function () {this.update(this, [1,0]); return this.allBlocks;};
  this.up = function () {this.update(this, [0,-1]); return this.allBlocks;};
  this.down = function () {this.update(this, [0,1]); return this.allBlocks;};
  function currentPiece (p) { return p.allBlocks[p.rotation]; };
  this.get = function () { return currentPiece(this); };
  this.update = function (piece = this, offset = [0,0]) {
    const oldOffset = piece.offset.slice();
    piece.offset = calculateOffset(piece, offset);
    const newBlocks = calculateBlocks(piece);
    const maxX = piece.size[0];
    const aBlocks = piece.allBlocks;

    if (newBlocks != false )  {
      piece.allBlocks = newBlocks;
      return true;
    }
    piece.offset = oldOffset;
    return false;
  };

  // generate piece and resize
  this.type = type;
  const pieces = new Pieces();
  const template = {
    'size':  pieces.data[type].size.slice(),
    'allBlocks': pieces.data[type].allBlocks.slice(),
    'color': pieces.data[type].color
  };
  this.size = pieces.data[type].size;
  this.color = pieces.data[type].color;
  this.rotation = rotation;
  this.offset = [0,0];
  this.allBlocks = calculateBlocks(this);
  this.resize(size);

  /*
  function areValidBlocks(aBlocks, aMaxX, bBlocks, bMaxX) {
    for (let i=0; i < bBlocks.length; i++) {
      for (let j=0; j< bBlocks[i].length; j++) {
        const a = aBlocks[i][j];
        const b = bBlocks[i][j];
        if  ( b < 0 && isNotSameRow(a,aMaxX,b,bMaxX) ) {
          return false;
        }
      };
    };
    return true;
  };
  */
}


function Board(xMax = 10, yMax = 20) {
  this.size = [xMax, yMax];
  this.grid = reset(this.size);
  function reset ([x,y]) { return Array(x*y).fill(0); }

  this.fits = (g) => {
    if (g === undefined) // if passed undefined, return undefined
      return undefined;
    for (let i = 0; i < g.length; i++) {
      if (this.grid[g[i]] != 0) {
        return false;  // if calculated OOB, return false
      }
    };
    return true;  // if in bounds, return true
  };
};

function Pieces () {
   this.data = {
    "i": {
      "allBlocks": [
        [1,5,9,13],
        [4,5,6,7],
        [2,6,10,14],
        [8,9,10,11]
      ],
      "size": [4,4],
      "color": 2
    },
    "j": {
      "allBlocks": [
        [1,5,8,9],
        [0,4,5,6],
        [1,2,5,9],
        [0,1,2,6]
      ],
      "size": [4,4],
      "color": 3
    },
    "l": {
      "allBlocks": [
        [1,5,9,10],
        [4,5,6,8],
        [0,1,5,9],
        [2,4,5,6]
      ],
      "size": [4,4],
      "color": 4
    },
    "o": {
      "allBlocks": [
        [0,1,4,5],
        [0,1,4,5],
        [0,1,4,5],
        [0,1,4,5]
      ],
      "size": [4,4],
      "color": 5
    },
    "s": {
      "allBlocks": [
        [5,6,8,9],
        [0,4,5,9],
        [1,2,4,5],
        [1,5,6,10]
      ],
      "size": [4,4],
      "color": 6
    },
    "t": {
      "allBlocks": [
        [4,5,6,9],
        [1,4,5,9],
        [1,4,5,6],
        [1,5,6,9]
      ],
      "size": [4,4],
      "color": 7
    },
    "z": {
      "allBlocks": [
        [4,5,9,10],
        [1,4,5,8],
        [0,1,5,6],
        [2,5,6,9]
      ],
      "size": [4,4],
      "color": 8
    }
  };

  this.ordered = generateList(this.data);
  this.list = shuffle(this.ordered);
  this.shuffle = function() { this.shuffled = shuffle(this.ordered); };
  this.shuffle();

  function generateList (p) {
    let result = [];
    const typeList = Object.keys(p);
    typeList.forEach(x => {
      const permutations = p[x].allBlocks.length;
      for (let i=0 ; i < permutations; i++) {
        result.push({type: x, rotation: i});
      };
    });
    return result;
  }

  /*
    Implementing Fisher and Yates shuffle based on wikipedia:
    https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
  */
  function shuffle(array) {
    let arr = array.slice();
    const swapInArr = (a,x,y) => [a[x], a[y]] = [a[y], a[x]];
    const len = arr.length;
    const randomInt = (x) => Math.floor(Math.random() * x);
    let result = [];
    for (let i=arr.length - 1; i > 0; i--) {
      swapInArr(arr,randomInt(i - 1), i);
    }
    //arr.map(function (currentValue, index) => {})
    return arr;
  }
}

module.exports = { Board, Piece,  Pieces };
