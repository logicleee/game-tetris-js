function Piece (type, rotation = 0, gridSize = [10,20], indexOffset = 3) {

  function resizeIndex(index, oldXmax, newXmax) {
    return ((Math.floor(index / oldXmax)) * newXmax) + (index % oldXmax);
  };

  function getCurrentPiece (p) {
    return p.allBlocksIR[p.indexOffset][p.rotation].blocks; };
  function getCurrentIsValid (p) {
    return p.allBlocksIR[p.indexOffset][p.rotation].isValid; };
  function getCurrentOffsetXY (p) {
    return p.allBlocksIR[p.indexOffset][p.rotation].offsetXY; };
  function toggleNormalMode (p) {
    while (! p.normalMode && p.isValid === false && p.indexOffset > 0) {
      p.left();
    }
    p.normalMode = ! p.normalMode;
    return p.normalMode;
  }

  function incrementIndexBy (p, x) {
    const i = p.indexOffset;
    const newI = i + x;
    const r = p.rotation;

    if (! p.allBlocksIR[newI] || ! p.allBlocksIR[newI][r])
      return i;

    const px = p.allBlocksIR[i][r].offsetXY[0];
    const newPX = p.allBlocksIR[newI][r].offsetXY[0];
    const newPIsValid = p.allBlocksIR[newI][r].isValid;
    const newPIsInBounds = p.allBlocksIR[newI][r].isInBounds;

    if (p.normalMode) {
      if ((px != newPX) || (! newPIsValid))
        return i;
    }

    if (! newPIsInBounds)
      return i;
    return newI;
  };

  function incrementIndexByRows (p,x) {
    const i = p.indexOffset;
    const newI = i + (x * p.gridSize[0]);
    const r = p.rotation;
    if (! p.allBlocksIR[newI] || ! p.allBlocksIR[newI][r])
      return i;
    const py = p.allBlocksIR[i][r].offsetXY[1];
    const newPY = p.allBlocksIR[newI][r].offsetXY[1];
    const newPIsValid = p.allBlocksIR[newI][r].isValid;
    const newPIsInBounds = p.allBlocksIR[newI][r].isInBounds;
    if (p.normalMode) {
      if ((py != newPY) || (! newPIsValid))
        return i;
    }
    if (! newPIsInBounds)
      return i;
    return newI;
  };

  function generateBlockData (origBlocks, blockSize, gridSize, boardGrid) {
    //console.time('generateBlockData');
    function reset ([x,y]) { return Array(x*y).fill({'color': 0}); }
    function blockNotEmpty (grid, index) {return grid[index].color > 0; }
    const blockMaxX = blockSize[0];
    const gridMaxX = gridSize[0];
    const gridMaxY = gridSize[1];
    const maxIndex = (gridMaxX * gridMaxY) - 1;
    const permutations = origBlocks.length;

    if (boardGrid.length === 0)
      boardGrid = reset(gridSize);

    let result = {};

    for (let i=0; i <= maxIndex; i++) {
      result[i] = [];
      for (let r=0; r < permutations; r++) {
        const oldMinRow = Math.floor(origBlocks[r][0] / blockMaxX);
        result[i][r] = {};
        result[i][r]['blocks'] = [];
        result[i][r]['isValid'] = true;
        result[i][r]['isEmpty'] = true;
        result[i][r]['isInBounds'] = true;

        for (let bI=0; bI < origBlocks[r].length; bI++) {
          const oldBi = resizeIndex(origBlocks[r][bI], blockMaxX, gridMaxX);
          const newBi = oldBi + i;
          result[i][r]['blocks'].push(newBi);
          const newMinRow = Math.floor(result[i][r]['blocks'][0]/ gridMaxX);
          const oldDelta =
                Math.floor(origBlocks[r][bI]/blockMaxX) - oldMinRow;
          const newDelta = Math.floor(newBi/gridMaxX) - newMinRow;

          if (bI === 0)
            result[i][r]['offsetXY'] =
            [Math.floor(newBi/gridMaxX), (newBi % gridMaxX)];

          if (newBi > maxIndex || oldDelta != newDelta)
            result[i][r]['isValid'] = false;
          if (newBi <= maxIndex && blockNotEmpty(boardGrid, newBi))
            result[i][r]['isEmpty'] = false;
          if (newBi > maxIndex || newBi < 0)
            result[i][r]['isInBounds'] = false;

        }

      }

    }

    //console.timeEnd('generateBlockData');
    return result;

  };

  // ================================================================== //
  this.type = type;
  const templates = new Pieces();

  let template = {
    'size':  templates.data[type].size.slice(),
    'allBlocks': templates.data[type].allBlocks.slice(),
    'color': templates.data[type].color
  };

  this.normalMode = true; // allows left right commands to split blocks
  this.gridSize = gridSize;
  this.indexOffset = indexOffset;
  this.color = template.color;
  this.rotation = rotation;
  this.boardGrid = [];
  this.minIndex = 0;
  this.maxIndex = gridSize[0] * gridSize[1];

  //this.blocks = () => getCurrentPiece(this);
  this.isValid = () => getCurrentIsValid(this);
  this.getTemplateSize = () => template.size;

  this.toggleNormalMode = () => toggleNormalMode(this);

  this.resetPieceSpecs = ([type, rotation, gridSize, indexOffset]) => {
    this.type = type;
    this.rotation = rotation;
    this.gridSize = gridSize;
    //this.size = gridSize;
    this.minIndex = 0;
    this.maxIndex = gridSize[0] * gridSize[1];
    this.indexOffset = indexOffset;
    template = {
      'size':  templates.data[type].size.slice(),
      'allBlocks': templates.data[type].allBlocks.slice(),
      'color': templates.data[type].color
    };
    this.color = template.color;
  };

  this.getPieceSpecs = () => {
    return [this.type ,
            this.rotation,
            this.gridSize,
            this.indexOffset];
  };

  this.rotate = () => {
    const i = this.indexOffset;
    let r;
    this.rotation < 3 ? r = this.rotation + 1 : r = 0;
    if (this.allBlocksIR[i][r].isValid || ! this.normalMode)
      return this.update(this, i, r);
    return false;
  };

  this.left = (x = 1) => {
    return this.update(this, incrementIndexBy(this,-1 * x));};

  this.right = (x = 1) => {
    return this.update(this, incrementIndexBy(this,x));};

  this.up = (x = 1) => {
    return this.update(this, incrementIndexByRows(this,-1 * x));};

  this.down = (x = 1) => {
    return this.update(this, incrementIndexByRows(this,x));};

  this.update = function (piece = this,
                          i = this.indexOffset,
                          r = this.rotation) {
    if (! piece.allBlocksIR[i][r].blocks)
      return false;

    piece.indexOffset = i;
    piece.rotation = r;
    piece.blocks = piece.allBlocksIR[i][r].blocks;
    piece.offsetXY = piece.allBlocksIR[i][r].offsetXY;
    piece.isValid = piece.allBlocksIR[i][r].isValid;
    piece.isInBounds = piece.allBlocksIR[i][r].isInBounds;
    return true;
  };

  this.generateBlockData = function (w = template.allBlocks,
                                     x = template.size,
                                     y = this.gridSize,
                                     z = this.boardGrid) {
    this.allBlocksIR =  generateBlockData(w,x,y,z);
    const i = this.indexOffset;
    const r = this.rotation;
    this.blocks = this.allBlocksIR[i][r].blocks;
    this.offsetXY = this.allBlocksIR[i][r].offsetXY;
    this.isValid = this.allBlocksIR[i][r].isValid;
    this.isInBounds = this.allBlocksIR[i][r].isInBounds;
  };

}

function Pieces (gridSize = [10,20], indexOffset = 3) {
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
  this.nextPiece = function() {
    if (this.shuffled.length < 1) {
      this.shuffle();
    }
    const p = this.shuffled.pop();
    let newPiece = new Piece(p.type, p.rotation, p.gridSize, p.indexOffset);
    return newPiece;
  };

  function generateList (p) {
    let result = [];
    const typeList = Object.keys(p);
    typeList.forEach(x => {
      const permutations = p[x].allBlocks.length;
      for (let i=0 ; i < permutations; i++) {
        result.push({type: x, rotation: i, 'gridSize': gridSize,
                     'indexOffset': indexOffset});
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
    const randomInt = (min, max) =>
          Math.floor(min + (Math.random()*(max - min + 1)));
    let result = [];
    for (let i=arr.length - 1; i > 0; i--) {
      swapInArr(arr,randomInt(0, i - 1), i);
    }
    return arr;
  }
}

function Board(size = [10,20]) {
  const block = {'color': 0};
  const [xMax,yMax] = size;
  function reset ([x,y]) { return Array(x*y).fill(block); }

  function blockNotEmpty (grid, index) {return grid[index].color > 0; }
  function clearRows (grid, newGrid, size, fn) {
    let oldGrid = grid.slice();
    let maxX = size[0];
    let blocksFull = maxX;
    let currRow = 0;
    let currOffset = 0;
    let newIndex = 0;
    let oldIndex, lastRow;

    while (oldGrid.length > 0) {
      oldIndex = oldGrid.length - 1;
      newIndex = oldIndex + (currOffset * maxX);
      newGrid[newIndex] = oldGrid.pop();
      currRow = Math.floor(oldIndex / maxX);

      if (lastRow != currRow) {
        lastRow = currRow;
        blocksFull = maxX;
      }

      if (fn(grid,oldIndex)) {
        blocksFull -= 1;
      }

      if (blocksFull === 0) {
        //console.log(' => clearRows clearing row', currRow);
        currOffset += 1;
        blocksFull = maxX;
      }

    }

    return {'grid': newGrid,
            'rowsCleared': currOffset
           };

  };

  this.size = [xMax, yMax];
  //const blankGrid = () => reset([xMax, yMax]); //new
  this.grid = reset(this.size);

  this.fits = (g) => {
    if (g === undefined) // if passed undefined, return undefined
      return undefined;
    for (let i = 0; i < g.length; i++) {
      if ( (! this.grid[g[i]]) || this.grid[g[i]].color != 0) {
        return false;  // if calculated OOB, return false
      }
    };
    return true;  // if in bounds, return true
  };

  this.overlay = function (piece) {
    let result = this.grid.slice();
    piece.blocks.forEach(b =>{
      result[b] = {'color': piece.color};
    });

    return result;
  };

  this.update = function (piece) {
    let hardDrop=false;
    const overlay = this.overlay(piece);
    const newRowsObject =
          clearRows(overlay,reset(this.size),this.size, blockNotEmpty);
    this.grid = newRowsObject.grid;

    return {
      'boardUpdated': true,
      'rowsCleared': newRowsObject.rowsCleared,
      'hardDrop': hardDrop,
      'grid': this.grid.slice(),
    };
  };

  this.clearRows = (grid, newGrid, size, fn) =>
    clearRows(grid, newGrid, size, fn);


};

function Controller () {
  const boardSize = [10,20];
  let board = new Board(boardSize);
  let pieces = new Pieces(boardSize);
  let ui = new UI(boardSize);
  let piece = pieces.nextPiece();
  piece.generateBlockData();
  let pieceData = [];
  let scoreData = {};
  let playingGame = false;
  let boardChanged = true;
  let scoreChanged = true;
  let eventQueue = [];
  let timeDelta = 0;
  let step = 1;

  const timeStamp = () => new Date().getTime();
  const randomInt = (min, max) =>
        Math.floor(min + (Math.random()*(max - min + 1)));
  const sleep = (ms) =>
          new Promise(resolve => setTimeout(resolve, ms));

  let textGrid = ''; // TODO get rid of this!
  // for testing START
  this.board = () => board;
  this.piece = () => piece;
  this.pieceData = () => pieceData;
  this.pieces = () => pieces;
  this.eventQueue = () => eventQueue;
  // for testing END


  function handle(event) {
    switch (event) {
    case 'moveLeft': move('left'); break;
    case 'moveRight': move('right'); break;
    case 'moveUp': move('up'); break;
    case 'moveDown': move('down'); break;
    case 'moveRotate': move('rotate'); break;
    case 'togglePause': playingGame = ! playingGame; break;
    case 'toggleNormalMode': piece.toggleNormalMode(); break;
    };
  }

  /*
  function Event() {
    return;
  }
  */

  function move (event) {
    let currentGrid = [];
    let boardEvent;
    switch (event) {
    case 'left':
      piece.left();
      if (board.fits(piece.blocks)) {
        pieceData.push(piece.getPieceSpecs());
        currentGrid = board.overlay(piece);
        textGrid = currentGrid;
        console.log(pieceData[pieceData.length -1]);
        boardChanged = true;
      } else {
        piece.resetPieceSpecs(pieceData[pieceData.length - 1]);
      }
      break;
    case 'right':
      piece.right();
      if (board.fits(piece.blocks)) {
        pieceData.push(piece.getPieceSpecs());
        currentGrid = board.overlay(piece);
        textGrid = currentGrid;
        console.log(pieceData[pieceData.length -1]);
        boardChanged = true;
      } else {
        piece.resetPieceSpecs(pieceData[pieceData.length - 1]);
      }
      break;
    case 'up':
      piece.up();
      if (board.fits(piece.blocks)) {
        pieceData.push(piece.getPieceSpecs());
        currentGrid = board.overlay(piece);
        textGrid = currentGrid;
        console.log(pieceData[pieceData.length -1]);
        boardChanged = true;
      } else {
        piece.resetPieceSpecs(pieceData[pieceData.length - 1]);
      }
      break;
    case 'down':
      const oldOffset = piece.indexOffset;
      piece.down();
      const newOffset = piece.indexOffset;
      if (oldOffset != newOffset && board.fits(piece.blocks)) {
        pieceData.push(piece.getPieceSpecs());
        currentGrid = board.overlay(piece);
        textGrid = currentGrid;
        console.log(pieceData[pieceData.length -1]);
        boardChanged = true;
      } else if (oldOffset <= piece.gridSize[1]){
        endGame();
      } else {
        piece.resetPieceSpecs(pieceData[pieceData.length - 1]);
        piece.generateBlockData();
        boardEvent = board.update(piece);
        boardChanged = boardEvent.boardChanged;
        scoreChanged = boardEvent.scoreChanged;
        scoreData = boardEvent.scoreData;
        piece = pieces.nextPiece();
        piece.generateBlockData();
        eventQueue = [];
      }
      break;
    case 'rotate':
      /*
        event: piece rotate
        calls piece.rotate()
        if board.fits(piece.blocks)
        pushes stats to pieceData array
        currentGrid = board.overlay(piece)
        boardChanged = true
        if ! board.fits(piece.blocks)
        set piece to last pieceData
        call piece.update()
      */
      piece.rotate();
      pieceData.push(piece.getPieceSpecs());
      currentGrid = board.overlay(piece);
      textGrid = currentGrid;
      console.log(pieceData[pieceData.length -1]);
      boardChanged = true;
      break;
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
  function keydown (kbEvent) {
      let handled = false;
    console.log('pressed', kbEvent.code);
    if (playingGame) {
      switch (kbEvent.code) {
      case 'KeyK': eventQueue.push('moveUp'); handled = true; break;
      case 'KeyJ':
      case 'ArrowDown': eventQueue.push('moveDown'); handled = true; break;
      case 'KeyH':
      case 'ArrowLeft': eventQueue.push('moveLeft'); handled = true; break;
      case 'KeyL':
      case 'ArrowRight': eventQueue.push('moveRight'); handled = true; break;
      case 'KeyR':
      case 'ArrowUp': eventQueue.push('moveRotate'); handled = true; break;
      case 'KeyN': eventQueue.push('toggleNormalMode'); handled = true; break;
      }
    }
    if (kbEvent.code === 'Space'){
      handled = true;
      playGame();
    }
    if (handled)
        kbEvent.preventDefault();
  }

  function playGame () {
    if (playingGame) {
      ui.setState('paused');
      playingGame = false;
      eventQueue.push('startGame');
    } else {
      ui.setState('playing');
      playingGame = true;
    }
  }

  function endGame () {
    playingGame = false;
    reset();
  }

  function run () {
    let canvas = '';
    let now=last=0;


    function frame () {
      now = timeStamp();
      update(Math.min(1, (now - last) / 1000.0));
      ui.draw(boardChanged, textGrid, board.size);
      boardChanged = ui.getBoardUIisUpdated();
      last = now;
      sleep(50).then(() => {
        if (playingGame)
          ui.updateScore(timeStamp());
        requestAnimationFrame(frame, canvas);
      });
    }

    addEvents();
    now = timeStamp();
    last = now;

    resize();
    reset();
    frame();
  }

  function addEvents() {
    document.addEventListener('keydown', keydown, false);
    window.addEventListener('resize', resize, false);
  }

  function update (idt) {
    if (playingGame) {
      timeDelta = timeDelta + idt;
    }
    handle(eventQueue.shift());
    if (timeDelta > step) {
      timeDelta = timeDelta - step;
      eventQueue.push('moveDown');
    }
  }

  function resize () {

  }

  function reset () {
    ui = new UI(boardSize);

    ui.initUI();
    ui.setState('paused');
    board = new Board(boardSize);
    pieces = new Pieces(boardSize);
    piece = pieces.nextPiece();
    piece.generateBlockData();
    pieceData = [];
    scoreData = {};
    playingGame = false;

  }




  // BEGIN FUNCTION
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(callback, element) {
        window.setTimeout(callback, 1000 / 60);
      };
  }
  run();

  /*
    run > frame
            update > handle > move
            draw
            recurse (frame)
  */

}

function UI (gridSize) {
  const getElementById = (id) => document.getElementById(id);
  const hideElementById = (id) => getElementById(id).style.visibility='hidden';
  const showElementById = (id) => getElementById(id).style.visibility=null;
  const setElementInnerText = (id, text) => getElementById(id).innerText = text;
  let boardNeedsUIrefresh = false;
  const [textUI, canvasUI] = ['text', 'canvas'];
  let uiMode = textUI;

  function domElement (tag, parent = false,
                       id = false, innerText = false) {
    let result = document.createElement(tag);
    if (id)
        result.id = id;
    if (innerText)
      result.innerText = innerText;
    if (parent)
      parent.appendChild(result);
    return result;
  }


  //let a = new TableElement (parent, id, colWidths, fixed, width)
  function TableElement (parent = false, id = false, colWidths = [],
                         fixed = true, width = '100%') {

    let result = document.createElement('table');
    result.style.width = width;

    if (fixed)
        result.style.layout = 'fixed';

    if (id)
      result.id = id;

    if (colWidths.length) {
      colWidths.forEach((cv, index) => {
        let colId = false;
        if (id)
          colId = id + '-col-' + index;
        let newCol = new domElement('col', result, colId);
        newCol.style.width = cv;
      });

    }

    if (parent)
      parent.appendChild(result);

    return result;

  }

  function initUI () {
    let viewPort = getElementById('tetris');
    let tetrisGame = new domElement('div', viewPort, 'tetris-content');
    let statsDiv = new domElement('div', tetrisGame, 'statsDiv');
    let start = new domElement('p', statsDiv, 'start', 'Press space to play.');
    let nextPieceWrapper = new domElement('p', statsDiv, 'nextPieceWrapper');
    let statsWrapper = new domElement('div', statsDiv);

    //let a = new TableElement (parent, id, colWidths, fixed, width)
    let statsTable = new TableElement(statsWrapper, 'statsTable',
                                      ['50%', '50%'], true, '100%');
    let row0 = new domElement('tr',statsTable);
    let row1 = new domElement('tr',statsTable);
    let scoreLabel = new domElement('td', row0, false, 'Score:');
    let score = new domElement('td', row0, 'score', '0000');
    let rowsClearedLabel = new domElement('td', row1, false, 'Rows:');
    let rowsCleared = new domElement('td', row1, 'rowsCleared', '1010');
    let gameBoardDiv = new domElement('div', tetrisGame, 'gameBoardDiv');
    let gameBoard = new domElement('canvas', gameBoardDiv, 'gameBoard');

    if (uiMode == textUI) {
      // specific to text-mode
      gameBoardDiv.style.fontFamily = 'monospace';
      gameBoardDiv.style.whiteSpace = 'pre-wrap';
      let nextPiece = new domElement('div', nextPieceWrapper, 'nextPiece');
    }

    if (uiMode == canvasUI) {
      console.log('canvasUI selected');
      let nextPiece = new domElement('canvas', nextPieceWrapper, 'nextPiece');
    }

  }

  function renderGridAsText (grid = [], size = gridSize) {
    const maxX = size[0];
    let j = 0;
    //let result = '';
    let result = '  ' + ('_').repeat(maxX) +' \n';
    for (let i=0; i < grid.length; i++) {
      const currBlock = grid[i].color;
      if ( j === 0)
        result += ' |';
      if (currBlock === 0) {
        if (j % 2)
          result += ' ';
        else
          result += '.';
      } else {
        result += currBlock;
      }
      j++;
      if (j >= maxX) {
        result += '| \n';
        j = 0;
      }
    }
    result += ' ^' + ('^').repeat(maxX) +'^';
    return result;
  };

  function setUIstate (state) {
    switch (state) {
    case 'paused':
      showElementById('start');
      break;
    case 'playing':
      hideElementById('start');
      break;
    case 'text':
      uiMode = 'text';
      break;
    case 'canvas':
      uiMode = 'canvas';
      break;
    }
  }

  function draw (boardChanged, grid) {
    if (boardChanged) {
      //setElementInnerText('canvasDiv', renderGridAsText(grid));
      if (uiMode = textUI)
        setElementInnerText('gameBoardDiv', renderGridAsText(grid));
      //if (uiMode = canvasUI)
      boardNeedsUIrefresh = false;
    }
  };

  this.getGridSize = () => gridSize;
  this.draw = (boardChanged, grid, size) => draw(boardChanged, grid, size);
  this.renderGridAsText = (grid) => renderGridAsText(grid);
  this.initUI = () => initUI();
  this.setState = (state) => setUIstate(state);
  //this.getElementById = (id) => getElementById(id);
  this.hideElementById = (id) => hideElementById(id);
  this.showElementById = (id) => showElementById(id);
  this.setElementInnerText = (id, text) => setElementInnerText(id,text);
  this.getBoardUIisUpdated = () => boardNeedsUIrefresh;
  this.updateScore = (score) => setElementInnerText('score', score);

};

module.exports = {Piece, Pieces, Board, Controller, UI};
