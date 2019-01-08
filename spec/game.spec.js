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

  test('nextPiece returns unique pieces', () => {
    //console.log(pieceList.nextPiece());
    let p1 = pieceList.nextPiece();
    let p2 = pieceList.nextPiece();
    expect(Array.isArray(p1.gridSize)).toBe(true);
    expect(p1.gridSize).toEqual([10,20]);
    expect((p1.type != p2.type) || (p1.rotation != p2.rotation)).toBe(true);
    for (let i=0; i < 28; i++) {pieceList.nextPiece();}
    let p3 = pieceList.nextPiece();
    expect(Array.isArray(p3.gridSize)).toBe(true);
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
