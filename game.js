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
  const types = {
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
  this.blocks = types[type].blocks;
  this.size = types[type].size;
  this.color = types[type].color;
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
    return this.blocks.map(x => x.map((y) =>  y + (this.size[0] * n)));
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

module.exports = { Board, Piece};
