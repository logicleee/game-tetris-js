function Piece(type, rotation = 0) {
  this.type = type;
  const pieces = new Pieces();
  this.blocks = pieces.data[type].blocks;
  this.size = pieces.data[type].size;
  this.color = pieces.data[type].color;
  this.rotation = rotation;

  this.resize = function (newXmax) {
    if (newXmax < 4)
      return false;
    const xMax = this.size[0];
    for (let i=0; i < this.blocks.length; i++) {
      for (let j=0; j < this.blocks[i].length; j++) {
        let k = this.blocks[i][j];
        this.blocks[i][j] = ((Math.floor(k / xMax)) * newXmax) + (k % xMax);
      }
    }
    this.size[0] = newXmax;
    return true;
  };

  this.shiftX = function (n) {
    return this.blocks.map(x => x.map(y =>  y + (this.size[0] * n)));
  };

  function shiftPieceX (piece, n) {
    let tmp = 0;
    const newB = piece.blocks.map(x => x.map(y =>  y + (piece.size[0] * n)));
    newB.forEach(x => x.forEach(y => y >= 0 ? tmp += 0 : tmp += 1));
    if (tmp === 0)
      piece.blocks = newB;
    return piece.blocks;
  };

  this.up = function () { return shiftPieceX(this, -1); };
  this.down = function () { return shiftPieceX(this, 1); };

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

  this.rotate = () => {
    if (this.rotation >= this.blocks.length - 1)
      this.rotation = 0;
    else
      this.rotation++;
  };

  this.left = function () { return shiftPieceY(this, -1); };
  this.right = function () { return shiftPieceY(this, 1); };

  this.get = function () { return currentPiece(this); };
  function currentPiece (p) { return p.blocks[p.rotation]; };
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
