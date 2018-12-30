  /*
  function shiftPieceX (piece, n) {
    let tmp = 0;
    // this does the calcuation
    const newB = piece.blocks.map(x => x.map(y =>  y + (piece.size[0] * n)));
    // this is just a check
    newB.forEach(x => x.forEach(y => y >= 0 ? tmp += 0 : tmp += 1));
    // if OK, return new, else return old
    if (tmp === 0)
      piece.blocks = newB;
    return piece.blocks;
  };
  */


  /*
  this.shiftY = function(n) {
    let newBlocks = [];
    const size = this.size[0];
    for (let i=0; i < this.blocks.length; i++) {
      newBlocks[i] = [];
      for (let j=0; j < this.blocks[i].length; j++) {
        newBlocks[i][j] = this.blocks[i][j] + n ;
        const oldX = Math.floor(this.blocks[i][j] / size) ;
        const newX = Math.floor(newBlocks[i][j] / size) ;
        if ( newX != oldX )
          return undefined;
      }
    }
    return newBlocks;
  };

  function shiftPieceY (piece, n) {
    let newBlocks = [];
    const size = piece.size[0];
    for (let i=0; i < piece.blocks.length; i++) {
      newBlocks[i] = [];
      for (let j=0; j < piece.blocks[i].length; j++) {
        newBlocks[i][j] = piece.blocks[i][j] + n ;
        const oldX = Math.floor(piece.blocks[i][j] / size) ;
        const newX = Math.floor(newBlocks[i][j] / size) ;
        if ( newX != oldX )
          return piece.blocks;
      }
    }
    piece.blocks = newBlocks;
    return piece.blocks;
  };
  */
  //this.left = function () { return shiftPieceY(this, -1); };
  //this.right = function () { return shiftPieceY(this, 1); };
  //this.up = function () { return shiftPieceX(this, -1); };
  //this.down = function () { return shiftPieceX(this, 1); };
  /*
  this.shiftX = function (n) {
    return this.blocks.map(x => x.map(y =>  y + (this.size[0] * n)));
  };
  */
  /*
    the value of mixing the validation concerns with the resize is:
    optimization: only 1 time through array (although both are still O(n))
    optimization: if check fails, you don't bother finishing
  */

  /*
    a wrapper method could emulate old functionality
    returning blocks, too, but we should get rid of this
  */
  /*
    shiftPieceX does too much by itself
        the goal is to update all 4 positions to the new offset
        returns piece state
    here's what should happen:
        rotation and offset are properties of object
        grid stays same
        1 function manipulates offset (takes array of movement in x,y)
        helper this.up/down/left/right methods just put in arrays of correct x,y
           Calls a function that
              calls a function that adds x,y to existing array
                  (checks that all are >= 0)
              calls a function that calculates grid
              CHECKS grid to see if it is valid
              if new grid is OK
                updates offset
                returns newGrid
              returns oldGrid

    // ORIGINAL WORKING CODE
  function shiftPieceX (piece, n) {
    let tmp = 0;
    const newB = piece.blocks.map(x => x.map(y =>  y + (piece.size[0] * n)));
    newB.forEach(x => x.forEach(y => y >= 0 ? tmp += 0 : tmp += 1));
    if (tmp === 0)
      piece.blocks = newB;
    return piece.blocks;
  };
    */
  /*
  const isNewValidOffset = (piece, newOffset) => {
    const ax = piece.offset[0];
    const ay = piece.offset[0];
    const bx = newOffset[0];
    const by = newOffset[1];
    const maxY = piece.size[1] - 1;
    return (ax === bx && ay === by && bx >= 0 && by >= 0 && by <= maxY);
  };
  */

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
    //console.log('calculateOffset: invalid offset result!', result);
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
    const templateBlocks = template.blocks;
    const templateMaxX = template.size[0];
    const blocks = piece.blocks;
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
  this.resize = function (newMaxX = 4) {
    if (newMaxX > 3) {
      this.size[0] = newMaxX;
      this.update();
      return true;
    }
    return false;
  };

  this.rotate = () => {
    if (this.rotation >= this.blocks.length - 1)
      this.rotation = 0;
    else
      this.rotation++;
    return true;
  };

  this.left = function () {this.update(this, [-1,0]); return this.blocks;};
  this.right = function () {this.update(this, [1,0]); return this.blocks;};
  this.up = function () {this.update(this, [0,-1]); return this.blocks;};
  this.down = function () {this.update(this, [0,1]); return this.blocks;};
  function currentPiece (p) { return p.blocks[p.rotation]; };
  this.get = function () { return currentPiece(this); };
  this.update = function (piece = this, offset = [0,0]) {
    const oldOffset = piece.offset.slice();
    piece.offset = calculateOffset(piece, offset);
    const newBlocks = calculateBlocks(piece);
    const maxX = piece.size[0];
    const aBlocks = piece.blocks;

    if (newBlocks != false )  {
      piece.blocks = newBlocks;
      //console.log('updated offset!', piece.offset, piece.blocks[0]);
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
    'blocks': pieces.data[type].blocks.slice(),
    'color': pieces.data[type].color
  };
  this.size = pieces.data[type].size;
  this.color = pieces.data[type].color;
  this.rotation = rotation;
  this.offset = [0,0];
  this.blocks = calculateBlocks(this);
  this.resize(size);

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
      "blocks": [
        [1,5,9,13],
        [4,5,6,7],
        [2,6,10,14],
        [8,9,10,11]
      ],
      "size": [4,4],
      "color": 2
    },
    "j": {
      "blocks": [
        [1,5,8,9],
        [0,4,5,6],
        [1,2,5,9],
        [0,1,2,6]
      ],
      "size": [4,4],
      "color": 3
    },
    "l": {
      "blocks": [
        [1,5,9,10],
        [4,5,6,8],
        [0,1,5,9],
        [2,4,5,6]
      ],
      "size": [4,4],
      "color": 4
    },
    "o": {
      "blocks": [
        [0,1,4,5],
        [0,1,4,5],
        [0,1,4,5],
        [0,1,4,5]
      ],
      "size": [4,4],
      "color": 5
    },
    "s": {
      "blocks": [
        [5,6,8,9],
        [0,4,5,9],
        [1,2,4,5],
        [1,5,6,10]
      ],
      "size": [4,4],
      "color": 6
    },
    "t": {
      "blocks": [
        [4,5,6,9],
        [1,4,5,9],
        [1,4,5,6],
        [1,5,6,9]
      ],
      "size": [4,4],
      "color": 7
    },
    "z": {
      "blocks": [
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
      const permutations = p[x].blocks.length;
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
