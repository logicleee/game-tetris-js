/*
// REMOVE LATER
function test (x) {
  return x;
}


function coords(cell, xMax) {
  const x = (c, xm) => (c % xm);
  const y = (c, xm) => Math.floor(c / xm);
  if (xMax > 0 && cell >= 0) {
    return [x(cell, xMax), y(cell, xMax)];
  }
  return undefined;
}
*/
function Piece(type) {
   this.types = {
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

  this.type = type;
  this.blocks = this.types[type].blocks;
  this.size = this.types[type].size;
  this.color = this.types[type].color;
  this.rotation = 0;

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

function PieceList () {
  /*
    implementing Fisher and Yates shuffle based on wikipedia:
    https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
      - Write down the numbers from 1 through N.
      - Pick a random number k between one and the number of unstruck numbers remaining (inclusive).
      - Counting from the low end, strike out the kth number not yet struck out, and write it down at the end of a separate list.
      - Repeat from step 2 until all the numbers have been struck out.
      - The sequence of numbers written down in step 3 is now a random permutation of the original numbers.
*/

  //const piece = new Piece('t');
  //this.types = generateList(piece);
  this.types = generateList(new Piece('t'));
  this.list = shuffle(this.types);

  function generateList (p) {
    let result = [];
    const typeList = Object.keys(p.types);
    typeList.forEach(x => {
      const permutations = p.types[x].blocks.length;
      for (let i=0 ; i < permutations; i++) {
        result.push({type: x, rotation: i});
      };
    });
    return result;
  }

  function shuffle(array) {
    let arr = array.slice();
    const swapInArr = (a,x,y) => [a[x], a[y]] = [a[y], a[x]];
    const len = arr.length;
    const randomInt = (x) => Math.floor(Math.random() * x);
    let result = [];
    for (let i=arr.length - 1; i > 0; i--) {
      swapInArr(arr,randomInt(i - 1), i);
    }
    //arr.map(fn, currentValue, index)
    return arr;

  }

    /*
  this.pieceTypes = () => {
    let result = [];
    typeList.forEach(x => {
      result.push({name: x, rotations: piece.types[x].blocks.length});
    });
    return result;
    // return typeList.map(x => return { name: x, rotations: piece.types[x].blocks.length});

    return typeList.map(x => {
      return { name: x, rotations: piece.types[x].blocks.length}
    });
  };
    */


}

module.exports = { Board, Piece, PieceList };
