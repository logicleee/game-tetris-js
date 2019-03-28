const game = require('../game');

describe('Board Object', () => {
  test('Returns 1d array of board', () => {
    let arr6x4 = Array(6*4).fill({'color': 0});
    let smallBoard = new game.Board([6,4]);
    expect(smallBoard.grid).toEqual(arr6x4);

    let defaultBoard = new game.Board();
    let largeBoard = new game.Board([16,64]);
    let arr10x20 = Array(10*20).fill({'color': 0});
    let arr16x64 = Array(16*64).fill({'color': 0});
    expect(defaultBoard.grid).toEqual(arr10x20);
    expect(largeBoard.grid).toEqual(arr16x64);

  });


  test('board.fits returns boolean depending on board state', () => {
    let board = new game.Board();
    expect(board.fits([0,1,2,11])).toBe(true);

    board.grid[0].color = 1; //simulate 1 block filled
    expect(board.fits([0,1,2,11])).toBe(false);
    board.grid[0].color = 0;

    board.grid[11].color = 1; //simulate 1 block filled
    expect(board.fits([0,1,2,11])).toBe(false);
    expect(board.fits([201])).toBe(false); // out of bounds
  });

  test('clearRows clears rows and shifts blocks down', ( ) => {
    let board = new game.Board();
    function new0Grid ([x,y]) { return Array(x*y).fill(0); }
    const block = 0;
    function blockNotEmpty  (grid, index) {return grid[index] > 0;};
    let grid = new0Grid([5,5]);
    for (let i=10; i < 15; i++) { grid[i] = 1;};
    for (let i=20; i < 25; i++) { grid[i] = 1;};
    grid[8] = 1;
    grid[16] = 1;
    let expectedGrid = new0Grid([5,5]);
    expectedGrid[18] = 1;
    expectedGrid[21] = 1;
    let result = board.clearRows(grid, new0Grid([5,5]),[5,5], blockNotEmpty);
    expect(result.grid).toEqual(expectedGrid);
    expect(result.rowsCleared).toBe(2);

    grid = new0Grid([5,5]);
    for (let i=5; i < 10; i++) { grid[i] = 1;};
    for (let i=20; i < 25; i++) { grid[i] = 1;};
    expectedGrid = new0Grid([5,5]);
    result = board.clearRows(grid, new0Grid([5,5]),[5,5], blockNotEmpty);
    expect(result.grid).toEqual(expectedGrid);
    expect(result.rowsCleared).toBe(2);

    // TODO Consider this case?
    /* unlikely condition that breaks test
    grid = new0Grid([5,5]);
    for (let i=0; i < 5; i++) { grid[i] = 1;};
    for (let i=20; i < 25; i++) { grid[i] = 1;};
    expectedGrid = new0Grid([5,5]);
    result = board.clearRows(grid, new0Grid([5,5]),[5,5], blockNotEmpty);
    expect(result.grid).toEqual(expectedGrid);
    expect(result.rowsCleared).toBe(2);
    */

  });

});

describe('Piece Object', () => {
  let blockDataTest = {
    0: [ { blocks: [ 10, 11, 12, 21 ], isValid: true, isEmpty: true },
         { blocks: [ 1, 10, 11, 21 ], isValid: true, isEmpty: true },
         { blocks: [ 1, 10, 11, 12 ], isValid: true, isEmpty: true },
         { blocks: [ 1, 11, 12, 21 ], isValid: true, isEmpty: true } ],
    2: [ { blocks: [ 12, 13, 14, 23 ], isValid: true, isEmpty: true },
         { blocks: [ 3, 12, 13, 23 ], isValid: true, isEmpty: true },
         { blocks: [ 3, 12, 13, 14 ], isValid: true, isEmpty: true },
         { blocks: [ 3, 13, 14, 23 ], isValid: true, isEmpty: true } ],
    7: [ { blocks: [ 17, 18, 19, 28 ], isValid: true, isEmpty: true },
         { blocks: [ 8, 17, 18, 28 ], isValid: true, isEmpty: true },
         { blocks: [ 8, 17, 18, 19 ], isValid: true, isEmpty: true },
         { blocks: [ 8, 18, 19, 28 ], isValid: true, isEmpty: true } ],
    9: [ { blocks: [ 19, 20, 21, 30 ], isValid: false, isEmpty: true },
         { blocks: [ 10, 19, 20, 30 ], isValid: false, isEmpty: true },
         { blocks: [ 10, 19, 20, 21 ], isValid: false, isEmpty: true },
         { blocks: [ 10, 20, 21, 30 ], isValid: true, isEmpty: true } ],
    10:[ { blocks: [ 20, 21, 22, 31 ], isValid: true, isEmpty: true },
         { blocks: [ 11, 20, 21, 31 ], isValid: true, isEmpty: true },
         { blocks: [ 11, 20, 21, 22 ], isValid: true, isEmpty: true },
         { blocks: [ 11, 21, 22, 31 ], isValid: true, isEmpty: true } ],
    15:[ { blocks: [ 25, 26, 27, 36 ], isValid: true, isEmpty: true },
         { blocks: [ 16, 25, 26, 36 ], isValid: true, isEmpty: true },
         { blocks: [ 16, 25, 26, 27 ], isValid: true, isEmpty: true },
         { blocks: [ 16, 26, 27, 36 ], isValid: true, isEmpty: true } ],
    151: [ { blocks: [ 161, 162, 163, 172 ], isValid: true, isEmpty: true },
           { blocks: [ 152, 161, 162, 172 ], isValid: true, isEmpty: true },
           { blocks: [ 152, 161, 162, 163 ], isValid: true, isEmpty: true },
           { blocks: [ 152, 162, 163, 172 ], isValid: true, isEmpty: true } ],
    159: [ { blocks: [ 169, 170, 171, 180 ], isValid: false, isEmpty: true },
           { blocks: [ 160, 169, 170, 180 ], isValid: false, isEmpty: true },
           { blocks: [ 160, 169, 170, 171 ], isValid: false, isEmpty: true },
           { blocks: [ 160, 170, 171, 180 ], isValid: true, isEmpty: true } ],
    180: [ { blocks: [ 190, 191, 192, 201 ], isValid: false, isEmpty: true },
           { blocks: [ 181, 190, 191, 201 ], isValid: false, isEmpty: true },
           { blocks: [ 181, 190, 191, 192 ], isValid: true, isEmpty: true },
           { blocks: [ 181, 191, 192, 201 ], isValid: false, isEmpty: true } ],
    190: [ { blocks: [ 200, 201, 202, 211 ], isValid: false, isEmpty: true },
           { blocks: [ 191, 200, 201, 211 ], isValid: false, isEmpty: true },
           { blocks: [ 191, 200, 201, 202 ], isValid: false, isEmpty: true },
           { blocks: [ 191, 201, 202, 211 ], isValid: false, isEmpty: true } ]
  };

  test('It generates valid block data for an empty grid', () => {
    let piece = new game.Piece('t', 0);
    piece.generateBlockData();
    const blockData = piece.allBlocksIR;

    expect(blockData[8][0].isInBounds).toBe(true);
    expect(blockData[8][0].isValid).toBe(false);
    expect(blockData[171][0].isInBounds).toBe(true);
    expect(blockData[171][0].isValid).toBe(true);
    expect(blockData[181][0].isInBounds).toBe(false);
    expect(blockData[181][0].isValid).toBe(false);

    Object.keys(blockDataTest).forEach(x => {
      for (let y=0; y < blockDataTest[x].length; y++) {
        expect(blockDataTest[x][y]['blocks']).toEqual(blockData[x][y].blocks);
        expect(blockDataTest[x][y].isValid).toBe(blockData[x][y].isValid);
        expect(blockDataTest[x][y].isEmpty).toBe(blockData[x][y].isEmpty);
      }

    });

  });

  test('It marks spaces with occupied blocks as isEmpty = false', () => {
    let piece = new game.Piece('t',0);

    function reset ([x,y]) { return Array(x*y).fill({'color': 0}); }
    let grid = (reset([10,20]));
    ([161,169,181]).forEach(x => grid[x] = {color: 1});

    piece.generateBlockData(piece.allBlocks,
                            piece.getTemplateSize(), [10,20], grid);
    let blockData = piece.allBlocksIR;

    const spacesFilled = [
                          [159,0], //169
                          [159,1], //169
                          [159,2], //169
                          [151,0],  //161
                          [151,1],  //161
                          [151,2],  //161
                          [180,1],  //181
                          [180,2],  //181
                          [180,3]  //181
                         ];
    spacesFilled.forEach(w => {
      const [x,y] = [w[0],w[1]];
      blockDataTest[x][y].isEmpty = false;
    });
    Object.keys(blockDataTest).forEach(x => {
      for (let y=0; y < blockDataTest[x].length; y++) {
        expect(blockDataTest[x][y]['blocks']).toEqual(blockData[x][y].blocks);
        expect(blockDataTest[x][y].isValid).toBe(blockData[x][y].isValid);
        expect(blockDataTest[x][y].isEmpty).toBe(blockData[x][y].isEmpty);
      }

    });

  });


  test('It updates properties from passed arguments', () => {
    let piece = new game.Piece('i', 3, [11,21], 12);
    //piece.generateBlockData();
    expect(piece.type).toBe('i');
    expect(piece.indexOffset).toBe(12);
    expect(piece.gridSize).toEqual([11,21]);
    expect(piece.rotation).toBe(3);
  });

  test('It can return and reset all specs', () => {
    let piece = new game.Piece('s', 0);
    //piece.generateBlockData();
    expect(piece.getPieceSpecs()).toEqual(['s',0,[10,20],3]);
    piece.resetPieceSpecs(['t', 1, [16,40], 18]);
    expect(piece.type).toBe('t');
    expect(piece.rotation).toBe(1);
    expect(piece.gridSize).toEqual([16,40]);
    expect(piece.indexOffset).toBe(18);
    expect(piece.getPieceSpecs()).toEqual(['t',1,[16,40],18]);
  });

  test('It rotates', () => {
    let piece = new game.Piece('s', 0);
    piece.generateBlockData();

    for(let j,i=0; i < 8; i++) {
      (i < 4) ? j = i : j = i - 4;
      expect(piece.type).toBe('s');
      expect(piece.rotation).toBe(j);
      expect(piece.indexOffset).toBe(3);
      expect(piece.blocks).toEqual(piece.allBlocksIR[3][j].blocks);
      piece.rotate();
    }

  });

  test('It can shift piece up/down/right/left with valid values', () => {
    let piece = new game.Piece('s', 0);
    piece.generateBlockData();

    expect(piece.gridSize[0]).toBe(10);
    expect(piece.blocks).toEqual([ 14, 15, 23, 24 ]);
    expect(piece.offsetXY).toEqual([ 1, 4 ]);

    piece.right();
    expect(piece.blocks).toEqual([ 15, 16, 24, 25 ]);
    expect(piece.offsetXY).toEqual([ 1, 5 ]);

    piece.down();
    expect(piece.blocks).toEqual([ 25, 26, 34, 35 ]);
    expect(piece.offsetXY).toEqual([ 2, 5 ]);

    piece.left();
    expect(piece.blocks).toEqual([ 24, 25, 33, 34 ]);
    expect(piece.offsetXY).toEqual([ 2, 4 ]);

    piece.up();
    expect(piece.blocks).toEqual([ 14, 15, 23, 24 ]);
    expect(piece.offsetXY).toEqual([ 1, 4 ]);

    piece.up(); // no change because index is out of bounds
    expect(piece.blocks).toEqual([14,15,23,24]);
    expect(piece.offsetXY).toEqual([1,4]);

    piece.left(3);   // should be offset [0,0]
    expect(piece.blocks).toEqual([11,12,20,21]);
    expect(piece.offsetXY).toEqual([1,1]);

    piece.left();   // no change because index is out of bounds
    expect(piece.blocks).toEqual([11,12,20,21]);
    expect(piece.offsetXY).toEqual([1,1]);

    piece.right(7);   // should be offset [0,7]
    expect(piece.blocks).toEqual([18,19,27,28]);
    expect(piece.offsetXY).toEqual([1,8]);


    piece.right();   // no change because index is out of bounds
    expect(piece.blocks).toEqual([18,19,27,28]);
    expect(piece.offsetXY).toEqual([1,8]);

    piece.right();   // no change because index is out of bounds
    expect(piece.blocks).toEqual([18,19,27,28]);
    expect(piece.offsetXY).toEqual([1,8]);

    piece.down(16);
    expect(piece.blocks).toEqual([178,179,187,188]);
    expect(piece.offsetXY).toEqual([17,8]);

    piece.down();   // should be offset [0,7]
    expect(piece.blocks).toEqual([188,189,197,198]);
    expect(piece.offsetXY).toEqual([18,8]);

    piece.down();   // should be offset [0,7]
    expect(piece.blocks).toEqual([188,189,197,198]);
    expect(piece.offsetXY).toEqual([18,8]);

    piece.right();
    expect(piece.blocks).toEqual([188,189,197,198]);
    expect(piece.offsetXY).toEqual([18,8]);
  });

  test('It shifts to any valid index with normalMode = false', () => {
    let piece = new game.Piece('s', 0);
    piece.generateBlockData();

    expect(piece.gridSize[0]).toBe(10);
    expect(piece.blocks).toEqual([ 14, 15, 23, 24 ]);

    piece.toggleNormalMode();

    expect(piece.normalMode).toBe(false);

    piece.right();
    expect(piece.blocks).toEqual([ 15, 16, 24, 25 ]);

    piece.down();
    expect(piece.blocks).toEqual([ 25, 26, 34, 35 ]);

    piece.left();
    expect(piece.blocks).toEqual([ 24, 25, 33, 34 ]);

    piece.up();
    expect(piece.blocks).toEqual([ 14, 15, 23, 24 ]);

    piece.up();
    expect(piece.blocks).toEqual([14,15,23,24]);

    piece.left(3);
    expect(piece.blocks).toEqual([11,12,20,21]);

    piece.left();
    expect(piece.blocks).toEqual([11,12,20,21]);

    piece.right(7);
    expect(piece.blocks).toEqual([18,19,27,28]);
    expect(piece.isValid).toBe(true);

    piece.right();
    expect(piece.blocks).toEqual([19,20,28,29]);
    expect(piece.isValid).toBe(false);

    piece.right();
    expect(piece.blocks).toEqual([20,21,29,30]);
    expect(piece.isValid).toBe(false);

    piece.toggleNormalMode();
    expect(piece.normalMode).toBe(true);

    piece.right();
    expect(piece.blocks).toEqual([18,19,27,28]);
    expect(piece.offsetXY).toEqual([1,8]);
    expect(piece.isValid).toBe(true);

    piece.toggleNormalMode();
    expect(piece.normalMode).toBe(false);

    piece.right(4);
    expect(piece.blocks).toEqual([22,23,31,32]);
    expect(piece.isValid).toBe(true);

    piece.down(15);
    expect(piece.blocks).toEqual([172,173,181,182]);
    expect(piece.isValid).toBe(true);

    piece.down();
    expect(piece.blocks).toEqual([182,183,191,192]);
    expect(piece.isValid).toBe(true);

    piece.down();
    expect(piece.blocks).toEqual([182,183,191,192]);
    expect(piece.isValid).toBe(true);
  });

  // test('loggging', () => {
  //   let piece = new game.Piece('t', 0);
  //   piece.generateBlockData();

  //   //console.log(piece.allBlocksIR[7][0]);
  //   //console.log(' -> expect(piece.blocks).toEqual([' + piece.blocks + '])');
  //   //console.log(' -> expect(piece.offsetXY).toEqual([' + piece.offsetXY + '])');
  //   //console.log(' -> expect(piece.isValid).toBe(' + piece.isValid + ')');

  // });

});

describe('Pieces Object', () => {

  const fullPieces = [
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 0, "type": "i"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 1, "type": "i"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 2, "type": "i"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 3, "type": "i"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 0, "type": "j"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 1, "type": "j"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 2, "type": "j"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 3, "type": "j"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 0, "type": "l"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 1, "type": "l"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 2, "type": "l"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 3, "type": "l"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 0, "type": "o"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 1, "type": "o"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 2, "type": "o"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 3, "type": "o"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 0, "type": "s"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 1, "type": "s"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 2, "type": "s"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 3, "type": "s"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 0, "type": "t"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 1, "type": "t"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 2, "type": "t"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 3, "type": "t"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 0, "type": "z"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 1, "type": "z"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 2, "type": "z"},
    {"gridSize": [10, 20], "indexOffset": 3, "rotation": 3, "type": "z"}
  ];

  const pieceList = new game.Pieces([10,20]);

  test('Has property: list of all permutations of pieces', () =>{
    expect(pieceList.ordered).toEqual(fullPieces);
  });

  test('Shuffled property does not equal full list', () =>{
    expect(pieceList.shuffled).not.toEqual(pieceList.ordered);
  });

  test('Shuffled property is same length ', () =>{
    expect(pieceList.shuffled.length).toBe(pieceList.ordered.length);
  });

  test('Shuffle method generates new shuffled property', () =>{
    expect(pieceList.shuffled).not.toEqual(() => {
      pieceList.shuffle();
      return pieceList.shuffled;
    });
  });

  test('Shuffled property is still same length ', () =>{
    expect(pieceList.shuffled.length).toBe(pieceList.ordered.length);
  });

  test('It returns unique pieces when Pieces.refreshList() is called', () => {
    pieceList.refreshList();
    let p1 = pieceList.getCurrentPiece();
    pieceList.refreshList();
    let p2 = pieceList.getCurrentPiece();
    expect(Array.isArray(p1.gridSize)).toBe(true);
    expect(p1.gridSize).toEqual([10,20]);
    expect((p1.type != p2.type) || (p1.rotation != p2.rotation)).toBe(true);
    for (let i=0; i < 28; i++) {
      pieceList.refreshList();
    }
    pieceList.refreshList();
    // REMOVE
    let p3 = pieceList.getCurrentPiece();
    expect(Array.isArray(p3.gridSize)).toBe(true);
  });

  test('It returns correct value for Pieces.getNextPiece()', () => {
    pieceList.refreshList();
    let p1 = pieceList.getCurrentPiece();
    let np2 = pieceList.getNextPiece();
    expect(np2.gridSize).toEqual([10,20]);

    const len = pieceList.shuffled.length

    pieceList.refreshList();
    let p2 = pieceList.getCurrentPiece();
    let np3 = pieceList.getNextPiece();

    expect(Array.isArray(p1.gridSize)).toBe(true);
    expect(np2.type === p2.type).toBe(true);
    expect(np2.rotation === p2.rotation).toBe(true);

    pieceList.refreshList();
    let p3 = pieceList.getCurrentPiece();
    expect(np3.type === p3.type).toBe(true);
    expect(np3.rotation === p3.rotation).toBe(true);
    //console.log(Object.keys(pieceList))

    for (let i=0; i < 60; i++) {
      const np = pieceList.getNextPiece();
      pieceList.refreshList();
      const p = pieceList.getCurrentPiece();
      expect(np.type).toEqual(p.type);
      expect(np.rotation).toEqual(p.rotation);
    }
  });
});

describe('Piece and Board integration', () => {

  test('Piece will not exceed Y bound', () => {
    let board = new game.Board();
    let piece = new game.Piece('t', 0, [10,20]);
    piece.generateBlockData();

    expect(piece.gridSize).toEqual([10,20]);

    for (let i=0; i<=3; i++) {piece.right();}
    expect(board.fits(piece.blocks)).toBe(true);
    for (let i=0; i<=4; i++) {piece.right();}
    expect(board.fits(piece.blocks)).toBe(true);
    for (let i=0; i<=6; i++) {piece.right();}
    expect(board.fits(piece.blocks)).toBe(true);

  });
  test('Piece overlays on board but does not affect board.grid', () => {
    let board = new game.Board();
    let piece = new game.Piece('t', 0);
    piece.generateBlockData();
    function reset ([x,y]) { return Array(x*y).fill({'color': 0}); }

    const defaultResult = reset([10,20]);
    const result1 = reset([10,20]);
    ([10,11,12,21]).forEach(x => result1[x] = {color: 7});
    const result2 = reset([10,20]);
    ([13, 14, 15, 24]).forEach(x => result2[x] = {color: 7});
    const result3 = reset([10,20]);
    ([14, 15, 16, 25]).forEach(x => result3[x] = {color: 7});

    expect(board.grid).toEqual(defaultResult);
    piece.left(3);
    expect(board.overlay(piece)).toEqual(result1);
    expect(board.grid).toEqual(defaultResult);
    piece.right();
    piece.right();
    piece.right();
    expect(board.overlay(piece)).toEqual(result2);
    piece.right();
    expect(board.overlay(piece)).toEqual(result3);
    expect(board.grid).toEqual(defaultResult);

  });

  test('Piece can be permanently added to grid with board.update', () => {
    let board = new game.Board();
    let piece = new game.Piece('t', 0);
    piece.generateBlockData();
    function reset ([x,y]) { return Array(x*y).fill({'color': 0}); }

    const defaultResult = reset([10,20]);
    const result2 = reset([10,20]);
    ([13, 14, 15, 24]).forEach(x => result2[x] = {color: 7});

    expect(board.grid).toEqual(defaultResult);
    piece.left(3);
    piece.right();
    piece.right();
    piece.right();
    expect(board.update(piece).boardUpdated).toBe(true);
    expect(board.update(piece).grid).toEqual(result2);
    expect(board.grid).toEqual(result2);

  });
});

describe('Game controller', () => {

});

describe('grid functions', () => {
  const gridExamples = [
    {gridSize: [10,10], blockSize:[1,1], index:0, fillRect:[0,0,1,1]},
    {gridSize: [10,10], blockSize:[1,1], index:9, fillRect:[9,0,1,1]},
    {gridSize: [10,10], blockSize:[1,1], index:10, fillRect:[0,1,1,1]},
    {gridSize: [10,10], blockSize:[1,1], index:19, fillRect:[9,1,1,1]},
    {gridSize: [10,10], blockSize:[2,2], index:0, fillRect:[0,0,2,2]},
    {gridSize: [10,10], blockSize:[2,2], index:4, fillRect:[8,0,2,2]},
    {gridSize: [10,10], blockSize:[2,2], index:10, fillRect:[0,4,2,2]},
    {gridSize: [10,10], blockSize:[2,2], index:14, fillRect:[8,4,2,2]},

    {gridSize: [10,10], blockSize:[1,2], index:0, fillRect:[0,0,1,2]},
    {gridSize: [10,10], blockSize:[1,2], index:4, fillRect:[4,0,1,2]},
    {gridSize: [10,10], blockSize:[1,2], index:10, fillRect:[0,2,1,2]},
    {gridSize: [10,10], blockSize:[1,2], index:14, fillRect:[4,2,1,2]},

    {gridSize: [10,10], blockSize:[2,1], index:0, fillRect:[0,0,2,1]},
    {gridSize: [10,10], blockSize:[2,1], index:4, fillRect:[8,0,2,1]},
    {gridSize: [10,10], blockSize:[2,1], index:10, fillRect:[0,2,2,1]},
    {gridSize: [10,10], blockSize:[2,1], index:14, fillRect:[8,2,2,1]},
  ];

  //test('', () => {});
  test('function renders coordinates based on index', () => {
    let grid = new game.Grid();
    gridExamples.forEach((x, index) => {
      expect(grid.renderCoords(x)).toEqual(x.fillRect);
      //console.log(index, x.index);
    });
  });
});

describe('Score Object', () => {
  let score = new game.Score(0);
  test('Original score is 0', () => {
    expect(score.current).toBe(0);
  });
  test('Drop increments score by 1', () => {
    score.awardDrop();
    expect(score.current).toBe(1);
    score.awardDrop();
    expect(score.current).toBe(2);
    score.awardDrop();
    expect(score.current).toBe(3);
    expect(score.level).toBe(0);
  });
  test('awardPoints increments score, lines, and level', () => {
    score.awardPoints(4,0);
    expect(score.current).toBe(1203);
    expect(score.clearedLines).toBe(4);
    expect(score.level).toBe(0);
    score.awardPoints(4,2);
    expect(score.current).toBe(4803);
    expect(score.clearedLines).toBe(8);
    expect(score.level).toBe(0);
    score.awardPoints(3,0);
    expect(score.current).toBe(5103);
    expect(score.clearedLines).toBe(11);
    expect(score.level).toBe(1);
    score.awardPoints(2,0);
    expect(score.current).toBe(5203);
  });
});






describe('UI Object', () => {
  const calcBoardsCase0 = {
    "INPUT": {
      "gridSize":  [10, 20],
      "canvasSize": [43, 87],
      "grid": ""
    },
    "OUTPUT": {
      "result": {"text": "  __________ \n ^^^^^^^^^^^^", "canvas": []}
    }
  };

  const calcBoardsCase1 = {"INPUT": {
    "gridSize": [10, 20],
    "canvasSize": [250, 500],
    "grid":
    [{"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 3}, {"color": 3}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 3}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 3}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}, {"color": 0}]},
                           "OUTPUT": {
                             "result":
                             {
                               "text": "  __________ \n |. . . . . | \n |. . . . . | \n |. . . . . | \n |. . . . . | \n |. . . . . | \n |. . . . . | \n |. . . . . | \n |. . . . . | \n |. . . . . | \n |. . . . . | \n |. . . . . | \n |. . . . . | \n |. . . . . | \n |. . . . . | \n |. . 33. . | \n |. . 3 . . | \n |. . 3 . . | \n |. . . . . | \n |. . . . . | \n |. . . . . | \n ^^^^^^^^^^^^",
                               "canvas":
    [ { color: '#34495e', index: 0, blockData: [ 0, 0, 25, 25 ] },
      { color: '#3B5269', index: 1, blockData: [ 25, 0, 25, 25 ] },
      { color: '#34495e', index: 2, blockData: [ 50, 0, 25, 25 ] },
      { color: '#3B5269', index: 3, blockData: [ 75, 0, 25, 25 ] },
      { color: '#34495e', index: 4, blockData: [ 100, 0, 25, 25 ] },
      { color: '#3B5269', index: 5, blockData: [ 125, 0, 25, 25 ] },
      { color: '#34495e', index: 6, blockData: [ 150, 0, 25, 25 ] },
      { color: '#3B5269', index: 7, blockData: [ 175, 0, 25, 25 ] },
      { color: '#34495e', index: 8, blockData: [ 200, 0, 25, 25 ] },
      { color: '#3B5269', index: 9, blockData: [ 225, 0, 25, 25 ] },
      { color: '#34495e', index: 10, blockData: [ 0, 25, 25, 25 ] },
      { color: '#3B5269', index: 11, blockData: [ 25, 25, 25, 25 ] },
      { color: '#34495e', index: 12, blockData: [ 50, 25, 25, 25 ] },
      { color: '#3B5269', index: 13, blockData: [ 75, 25, 25, 25 ] },
      { color: '#34495e', index: 14, blockData: [ 100, 25, 25, 25 ] },
      { color: '#3B5269', index: 15, blockData: [ 125, 25, 25, 25 ] },
      { color: '#34495e', index: 16, blockData: [ 150, 25, 25, 25 ] },
      { color: '#3B5269', index: 17, blockData: [ 175, 25, 25, 25 ] },
      { color: '#34495e', index: 18, blockData: [ 200, 25, 25, 25 ] },
      { color: '#3B5269', index: 19, blockData: [ 225, 25, 25, 25 ] },
      { color: '#34495e', index: 20, blockData: [ 0, 50, 25, 25 ] },
      { color: '#3B5269', index: 21, blockData: [ 25, 50, 25, 25 ] },
      { color: '#34495e', index: 22, blockData: [ 50, 50, 25, 25 ] },
      { color: '#3B5269', index: 23, blockData: [ 75, 50, 25, 25 ] },
      { color: '#34495e', index: 24, blockData: [ 100, 50, 25, 25 ] },
      { color: '#3B5269', index: 25, blockData: [ 125, 50, 25, 25 ] },
      { color: '#34495e', index: 26, blockData: [ 150, 50, 25, 25 ] },
      { color: '#3B5269', index: 27, blockData: [ 175, 50, 25, 25 ] },
      { color: '#34495e', index: 28, blockData: [ 200, 50, 25, 25 ] },
      { color: '#3B5269', index: 29, blockData: [ 225, 50, 25, 25 ] },
      { color: '#34495e', index: 30, blockData: [ 0, 75, 25, 25 ] },
      { color: '#3B5269', index: 31, blockData: [ 25, 75, 25, 25 ] },
      { color: '#34495e', index: 32, blockData: [ 50, 75, 25, 25 ] },
      { color: '#3B5269', index: 33, blockData: [ 75, 75, 25, 25 ] },
      { color: '#34495e', index: 34, blockData: [ 100, 75, 25, 25 ] },
      { color: '#3B5269', index: 35, blockData: [ 125, 75, 25, 25 ] },
      { color: '#34495e', index: 36, blockData: [ 150, 75, 25, 25 ] },
      { color: '#3B5269', index: 37, blockData: [ 175, 75, 25, 25 ] },
      { color: '#34495e', index: 38, blockData: [ 200, 75, 25, 25 ] },
      { color: '#3B5269', index: 39, blockData: [ 225, 75, 25, 25 ] },
      { color: '#34495e', index: 40, blockData: [ 0, 100, 25, 25 ] },
      { color: '#3B5269', index: 41, blockData: [ 25, 100, 25, 25 ] },
      { color: '#34495e', index: 42, blockData: [ 50, 100, 25, 25 ] },
      { color: '#3B5269', index: 43, blockData: [ 75, 100, 25, 25 ] },
      { color: '#34495e', index: 44, blockData: [ 100, 100, 25, 25 ] },
      { color: '#3B5269', index: 45, blockData: [ 125, 100, 25, 25 ] },
      { color: '#34495e', index: 46, blockData: [ 150, 100, 25, 25 ] },
      { color: '#3B5269', index: 47, blockData: [ 175, 100, 25, 25 ] },
      { color: '#34495e', index: 48, blockData: [ 200, 100, 25, 25 ] },
      { color: '#3B5269', index: 49, blockData: [ 225, 100, 25, 25 ] },
      { color: '#34495e', index: 50, blockData: [ 0, 125, 25, 25 ] },
      { color: '#3B5269', index: 51, blockData: [ 25, 125, 25, 25 ] },
      { color: '#34495e', index: 52, blockData: [ 50, 125, 25, 25 ] },
      { color: '#3B5269', index: 53, blockData: [ 75, 125, 25, 25 ] },
      { color: '#34495e', index: 54, blockData: [ 100, 125, 25, 25 ] },
      { color: '#3B5269', index: 55, blockData: [ 125, 125, 25, 25 ] },
      { color: '#34495e', index: 56, blockData: [ 150, 125, 25, 25 ] },
      { color: '#3B5269', index: 57, blockData: [ 175, 125, 25, 25 ] },
      { color: '#34495e', index: 58, blockData: [ 200, 125, 25, 25 ] },
      { color: '#3B5269', index: 59, blockData: [ 225, 125, 25, 25 ] },
      { color: '#34495e', index: 60, blockData: [ 0, 150, 25, 25 ] },
      { color: '#3B5269', index: 61, blockData: [ 25, 150, 25, 25 ] },
      { color: '#34495e', index: 62, blockData: [ 50, 150, 25, 25 ] },
      { color: '#3B5269', index: 63, blockData: [ 75, 150, 25, 25 ] },
      { color: '#34495e', index: 64, blockData: [ 100, 150, 25, 25 ] },
      { color: '#3B5269', index: 65, blockData: [ 125, 150, 25, 25 ] },
      { color: '#34495e', index: 66, blockData: [ 150, 150, 25, 25 ] },
      { color: '#3B5269', index: 67, blockData: [ 175, 150, 25, 25 ] },
      { color: '#34495e', index: 68, blockData: [ 200, 150, 25, 25 ] },
      { color: '#3B5269', index: 69, blockData: [ 225, 150, 25, 25 ] },
      { color: '#34495e', index: 70, blockData: [ 0, 175, 25, 25 ] },
      { color: '#3B5269', index: 71, blockData: [ 25, 175, 25, 25 ] },
      { color: '#34495e', index: 72, blockData: [ 50, 175, 25, 25 ] },
      { color: '#3B5269', index: 73, blockData: [ 75, 175, 25, 25 ] },
      { color: '#34495e', index: 74, blockData: [ 100, 175, 25, 25 ] },
      { color: '#3B5269', index: 75, blockData: [ 125, 175, 25, 25 ] },
      { color: '#34495e', index: 76, blockData: [ 150, 175, 25, 25 ] },
      { color: '#3B5269', index: 77, blockData: [ 175, 175, 25, 25 ] },
      { color: '#34495e', index: 78, blockData: [ 200, 175, 25, 25 ] },
      { color: '#3B5269', index: 79, blockData: [ 225, 175, 25, 25 ] },
      { color: '#34495e', index: 80, blockData: [ 0, 200, 25, 25 ] },
      { color: '#3B5269', index: 81, blockData: [ 25, 200, 25, 25 ] },
      { color: '#34495e', index: 82, blockData: [ 50, 200, 25, 25 ] },
      { color: '#3B5269', index: 83, blockData: [ 75, 200, 25, 25 ] },
      { color: '#34495e', index: 84, blockData: [ 100, 200, 25, 25 ] },
      { color: '#3B5269', index: 85, blockData: [ 125, 200, 25, 25 ] },
      { color: '#34495e', index: 86, blockData: [ 150, 200, 25, 25 ] },
      { color: '#3B5269', index: 87, blockData: [ 175, 200, 25, 25 ] },
      { color: '#34495e', index: 88, blockData: [ 200, 200, 25, 25 ] },
      { color: '#3B5269', index: 89, blockData: [ 225, 200, 25, 25 ] },
      { color: '#34495e', index: 90, blockData: [ 0, 225, 25, 25 ] },
      { color: '#3B5269', index: 91, blockData: [ 25, 225, 25, 25 ] },
      { color: '#34495e', index: 92, blockData: [ 50, 225, 25, 25 ] },
      { color: '#3B5269', index: 93, blockData: [ 75, 225, 25, 25 ] },
      { color: '#34495e', index: 94, blockData: [ 100, 225, 25, 25 ] },
      { color: '#3B5269', index: 95, blockData: [ 125, 225, 25, 25 ] },
      { color: '#34495e', index: 96, blockData: [ 150, 225, 25, 25 ] },
      { color: '#3B5269', index: 97, blockData: [ 175, 225, 25, 25 ] },
      { color: '#34495e', index: 98, blockData: [ 200, 225, 25, 25 ] },
      { color: '#3B5269', index: 99, blockData: [ 225, 225, 25, 25 ] },
      { color: '#34495e', index: 100, blockData: [ 0, 250, 25, 25 ] },
      { color: '#3B5269', index: 101, blockData: [ 25, 250, 25, 25 ] },
      { color: '#34495e', index: 102, blockData: [ 50, 250, 25, 25 ] },
      { color: '#3B5269', index: 103, blockData: [ 75, 250, 25, 25 ] },
      { color: '#34495e', index: 104, blockData: [ 100, 250, 25, 25 ] },
      { color: '#3B5269', index: 105, blockData: [ 125, 250, 25, 25 ] },
      { color: '#34495e', index: 106, blockData: [ 150, 250, 25, 25 ] },
      { color: '#3B5269', index: 107, blockData: [ 175, 250, 25, 25 ] },
      { color: '#34495e', index: 108, blockData: [ 200, 250, 25, 25 ] },
      { color: '#3B5269', index: 109, blockData: [ 225, 250, 25, 25 ] },
      { color: '#34495e', index: 110, blockData: [ 0, 275, 25, 25 ] },
      { color: '#3B5269', index: 111, blockData: [ 25, 275, 25, 25 ] },
      { color: '#34495e', index: 112, blockData: [ 50, 275, 25, 25 ] },
      { color: '#3B5269', index: 113, blockData: [ 75, 275, 25, 25 ] },
      { color: '#34495e', index: 114, blockData: [ 100, 275, 25, 25 ] },
      { color: '#3B5269', index: 115, blockData: [ 125, 275, 25, 25 ] },
      { color: '#34495e', index: 116, blockData: [ 150, 275, 25, 25 ] },
      { color: '#3B5269', index: 117, blockData: [ 175, 275, 25, 25 ] },
      { color: '#34495e', index: 118, blockData: [ 200, 275, 25, 25 ] },
      { color: '#3B5269', index: 119, blockData: [ 225, 275, 25, 25 ] },
      { color: '#34495e', index: 120, blockData: [ 0, 300, 25, 25 ] },
      { color: '#3B5269', index: 121, blockData: [ 25, 300, 25, 25 ] },
      { color: '#34495e', index: 122, blockData: [ 50, 300, 25, 25 ] },
      { color: '#3B5269', index: 123, blockData: [ 75, 300, 25, 25 ] },
      { color: '#34495e', index: 124, blockData: [ 100, 300, 25, 25 ] },
      { color: '#3B5269', index: 125, blockData: [ 125, 300, 25, 25 ] },
      { color: '#34495e', index: 126, blockData: [ 150, 300, 25, 25 ] },
      { color: '#3B5269', index: 127, blockData: [ 175, 300, 25, 25 ] },
      { color: '#34495e', index: 128, blockData: [ 200, 300, 25, 25 ] },
      { color: '#3B5269', index: 129, blockData: [ 225, 300, 25, 25 ] },
      { color: '#34495e', index: 130, blockData: [ 0, 325, 25, 25 ] },
      { color: '#3B5269', index: 131, blockData: [ 25, 325, 25, 25 ] },
      { color: '#34495e', index: 132, blockData: [ 50, 325, 25, 25 ] },
      { color: '#3B5269', index: 133, blockData: [ 75, 325, 25, 25 ] },
      { color: '#34495e', index: 134, blockData: [ 100, 325, 25, 25 ] },
      { color: '#3B5269', index: 135, blockData: [ 125, 325, 25, 25 ] },
      { color: '#34495e', index: 136, blockData: [ 150, 325, 25, 25 ] },
      { color: '#3B5269', index: 137, blockData: [ 175, 325, 25, 25 ] },
      { color: '#34495e', index: 138, blockData: [ 200, 325, 25, 25 ] },
      { color: '#3B5269', index: 139, blockData: [ 225, 325, 25, 25 ] },
      { color: '#34495e', index: 140, blockData: [ 0, 350, 25, 25 ] },
      { color: '#3B5269', index: 141, blockData: [ 25, 350, 25, 25 ] },
      { color: '#34495e', index: 142, blockData: [ 50, 350, 25, 25 ] },
      { color: '#3B5269', index: 143, blockData: [ 75, 350, 25, 25 ] },
      { color: '#f1c40f', index: 144, blockData: [ 100, 350, 25, 25 ] },
      { color: '#f1c40f', index: 145, blockData: [ 125, 350, 25, 25 ] },
      { color: '#34495e', index: 146, blockData: [ 150, 350, 25, 25 ] },
      { color: '#3B5269', index: 147, blockData: [ 175, 350, 25, 25 ] },
      { color: '#34495e', index: 148, blockData: [ 200, 350, 25, 25 ] },
      { color: '#3B5269', index: 149, blockData: [ 225, 350, 25, 25 ] },
      { color: '#34495e', index: 150, blockData: [ 0, 375, 25, 25 ] },
      { color: '#3B5269', index: 151, blockData: [ 25, 375, 25, 25 ] },
      { color: '#34495e', index: 152, blockData: [ 50, 375, 25, 25 ] },
      { color: '#3B5269', index: 153, blockData: [ 75, 375, 25, 25 ] },
      { color: '#f1c40f', index: 154, blockData: [ 100, 375, 25, 25 ] },
      { color: '#3B5269', index: 155, blockData: [ 125, 375, 25, 25 ] },
      { color: '#34495e', index: 156, blockData: [ 150, 375, 25, 25 ] },
      { color: '#3B5269', index: 157, blockData: [ 175, 375, 25, 25 ] },
      { color: '#34495e', index: 158, blockData: [ 200, 375, 25, 25 ] },
      { color: '#3B5269', index: 159, blockData: [ 225, 375, 25, 25 ] },
      { color: '#34495e', index: 160, blockData: [ 0, 400, 25, 25 ] },
      { color: '#3B5269', index: 161, blockData: [ 25, 400, 25, 25 ] },
      { color: '#34495e', index: 162, blockData: [ 50, 400, 25, 25 ] },
      { color: '#3B5269', index: 163, blockData: [ 75, 400, 25, 25 ] },
      { color: '#f1c40f', index: 164, blockData: [ 100, 400, 25, 25 ] },
      { color: '#3B5269', index: 165, blockData: [ 125, 400, 25, 25 ] },
      { color: '#34495e', index: 166, blockData: [ 150, 400, 25, 25 ] },
      { color: '#3B5269', index: 167, blockData: [ 175, 400, 25, 25 ] },
      { color: '#34495e', index: 168, blockData: [ 200, 400, 25, 25 ] },
      { color: '#3B5269', index: 169, blockData: [ 225, 400, 25, 25 ] },
      { color: '#34495e', index: 170, blockData: [ 0, 425, 25, 25 ] },
      { color: '#3B5269', index: 171, blockData: [ 25, 425, 25, 25 ] },
      { color: '#34495e', index: 172, blockData: [ 50, 425, 25, 25 ] },
      { color: '#3B5269', index: 173, blockData: [ 75, 425, 25, 25 ] },
      { color: '#34495e', index: 174, blockData: [ 100, 425, 25, 25 ] },
      { color: '#3B5269', index: 175, blockData: [ 125, 425, 25, 25 ] },
      { color: '#34495e', index: 176, blockData: [ 150, 425, 25, 25 ] },
      { color: '#3B5269', index: 177, blockData: [ 175, 425, 25, 25 ] },
      { color: '#34495e', index: 178, blockData: [ 200, 425, 25, 25 ] },
      { color: '#3B5269', index: 179, blockData: [ 225, 425, 25, 25 ] },
      { color: '#34495e', index: 180, blockData: [ 0, 450, 25, 25 ] },
      { color: '#3B5269', index: 181, blockData: [ 25, 450, 25, 25 ] },
      { color: '#34495e', index: 182, blockData: [ 50, 450, 25, 25 ] },
      { color: '#3B5269', index: 183, blockData: [ 75, 450, 25, 25 ] },
      { color: '#34495e', index: 184, blockData: [ 100, 450, 25, 25 ] },
      { color: '#3B5269', index: 185, blockData: [ 125, 450, 25, 25 ] },
      { color: '#34495e', index: 186, blockData: [ 150, 450, 25, 25 ] },
      { color: '#3B5269', index: 187, blockData: [ 175, 450, 25, 25 ] },
      { color: '#34495e', index: 188, blockData: [ 200, 450, 25, 25 ] },
      { color: '#3B5269', index: 189, blockData: [ 225, 450, 25, 25 ] },
      { color: '#34495e', index: 190, blockData: [ 0, 475, 25, 25 ] },
      { color: '#3B5269', index: 191, blockData: [ 25, 475, 25, 25 ] },
      { color: '#34495e', index: 192, blockData: [ 50, 475, 25, 25 ] },
      { color: '#3B5269', index: 193, blockData: [ 75, 475, 25, 25 ] },
      { color: '#34495e', index: 194, blockData: [ 100, 475, 25, 25 ] },
      { color: '#3B5269', index: 195, blockData: [ 125, 475, 25, 25 ] },
      { color: '#34495e', index: 196, blockData: [ 150, 475, 25, 25 ] },
      { color: '#3B5269', index: 197, blockData: [ 175, 475, 25, 25 ] },
      { color: '#34495e', index: 198, blockData: [ 200, 475, 25, 25 ] },
      { color: '#3B5269', index: 199, blockData: [ 225, 475, 25, 25 ] } ],}}
                          };

  describe('Temporary tests if calcBoards and calcBoards2 do the same thing',
           () => {
             const boardSize = [10,20];
             let canvasSize = [225, 450];
             let ui = new game.UI(boardSize, canvasSize);
             const ci1 = calcBoardsCase1;

             test('cb and cb2 are equal when grid is empty',
                  () => {
                    const i = calcBoardsCase0.INPUT;
                    const a = ui.calcBoards2(i.grid, i.gridSize, i.canvasSize);
                    const b = ui.calcBoards(i.grid, i.gridSize, i.canvasSize);
                    expect(a.text).toEqual(b.text);
                  });

             test('cb and cb2 are equal when grid is not empty',
                  () => {
                    const i = calcBoardsCase1.INPUT;
                    const a = ui.calcBoards2(i.grid, i.gridSize, i.canvasSize);
                    const b = ui.calcBoards(i.grid, i.gridSize, i.canvasSize);
                    expect(a.text).toEqual(b.text);
                  });
           });

  describe('KEEP: test if calcBoards(2) returns expected values for text canvas',
           () => {
             const boardSize = [10,20];
             let canvasSize = [225, 450];
             let ui = new game.UI(boardSize, canvasSize);

             test('given empty grid, output is as expected', () => {
               const i = calcBoardsCase0.INPUT;
               const a = ui.calcBoards2(i.grid, i.gridSize, i.canvasSize);
               const b = calcBoardsCase0.OUTPUT.result;
               expect(a.text).toEqual(b.text);
             });

             test('given grid data, output is as expected', () => {
               const i = calcBoardsCase1.INPUT;
               const a = ui.calcBoards2(i.grid, i.gridSize, i.canvasSize);
               const b = calcBoardsCase1.OUTPUT.result;
               expect(a.text).toEqual(b.text);
             });
           });

  describe('KEEP: test if calcBoards(2) returns expected values for text canvas',
           () => {
             const boardSize = [10,20];
             let canvasSize = [225, 450];
             let ui = new game.UI(boardSize, canvasSize);

             test('given empty grid, output is as expected', () => {
               const i = calcBoardsCase0.INPUT;
               const a = ui.calcBoards2(i.grid, i.gridSize, i.canvasSize);
               const b = calcBoardsCase0.OUTPUT.result;
               expect(a.canvas).toEqual(b.canvas);
             });

             test('given grid data, output is as expected', () => {
               const i = calcBoardsCase1.INPUT;
               const a = ui.calcBoards2(i.grid, i.gridSize, i.canvasSize);
               const b = calcBoardsCase1.OUTPUT.result;
               expect(a.canvas).toEqual(b.canvas);
               //console.log(a.canvas.filter((x,i) => i >= 100));
             });
           });
});
