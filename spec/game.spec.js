const game = require('../game');

/*
const pieceTypes = {
  'i': {
    'blocks': [
      [0,2,0,0, 0,2,0,0, 0,2,0,0, 0,2,0,0],
      [0,0,0,0, 2,2,2,2, 0,0,0,0, 0,0,0,0],
      [0,0,2,0, 0,0,2,0, 0,0,2,0, 0,0,2,0],
      [0,0,0,0, 0,0,0,0, 2,2,2,2, 0,0,0,0]
    ]
  },
  'j': {
    'blocks': [
      [0,3,0,0, 0,3,0,0, 3,3,0,0, 0,0,0,0],
      [3,0,0,0, 3,3,3,0, 0,0,0,0, 0,0,0,0],
      [0,3,3,0, 0,3,0,0, 0,3,0,0, 0,0,0,0],
      [3,3,3,0, 0,0,3,0, 0,0,0,0, 0,0,0,0]
    ]
  },
  'l': {
    'blocks': [
      [0,4,0,0, 0,4,0,0, 0,4,4,0, 0,0,0,0],
      [0,0,0,0, 4,4,4,0, 4,0,0,0, 0,0,0,0],
      [4,4,0,0, 0,4,0,0, 0,4,0,0, 0,0,0,0],
      [0,0,4,0, 4,4,4,0, 0,0,0,0, 0,0,0,0]
    ]
  },
  'o':  {
    'blocks': [
      [5,5,0,0, 5,5,0,0, 0,0,0,0, 0,0,0,0],
      [5,5,0,0, 5,5,0,0, 0,0,0,0, 0,0,0,0],
      [5,5,0,0, 5,5,0,0, 0,0,0,0, 0,0,0,0],
      [5,5,0,0, 5,5,0,0, 0,0,0,0, 0,0,0,0],
      [5,5,0,0, 5,5,0,0, 0,0,0,0, 0,0,0,0]
    ]
  },
  's': {
    'blocks': [
      [0,0,0,0, 0,6,6,0, 6,6,0,0, 0,0,0,0],
      [6,0,0,0, 6,6,0,0, 0,6,0,0, 0,0,0,0],
      [0,6,6,0, 6,6,0,0, 0,0,0,0, 0,0,0,0],
      [0,6,0,0, 0,6,6,0, 0,0,6,0, 0,0,0,0]
    ]
  },
  't': {
    'blocks': [
      [0,0,0,0, 7,7,7,0, 0,7,0,0, 0,0,0,0],
      [0,7,0,0, 7,7,0,0, 0,7,0,0, 0,0,0,0],
      [0,7,0,0, 7,7,7,0, 0,0,0,0, 0,0,0,0],
      [0,7,0,0, 0,7,7,0, 0,7,0,0, 0,0,0,0]
    ]
  },
  'z': {
    'blocks': [
      [0,0,0,0, 8,8,0,0, 0,8,8,0, 0,0,0,0],
      [0,8,0,0, 8,8,0,0, 8,0,0,0, 0,0,0,0],
      [8,8,0,0, 0,8,8,0, 0,0,0,0, 0,0,0,0],
      [0,0,8,0, 0,8,8,0, 0,8,0,0, 0,0,0,0]
    ]
  }
}
*/

describe('Board Object', () => {
  test('Returns 1d array of board', () => {
    let arr6x4 = Array(6*4).fill(0);
    let smallBoard = new game.Board(6,4);
    expect(smallBoard.grid).toEqual(arr6x4);

    let defaultBoard = new game.Board();
    let largeBoard = new game.Board(16,64);
    let arr10x20 = Array(10*20).fill(0);
    let arr16x64 = Array(16*64).fill(0);
    expect(defaultBoard.grid).toEqual(arr10x20);
    expect(largeBoard.grid).toEqual(arr16x64);

  });

  test('board.fits returns boolean depending on board state', () => {
    let board = new game.Board();
    expect(board.fits([0,1,2,11])).toBe(true);

    board.grid[0] = 1; //simulate 1 block filled
    expect(board.fits([0,1,2,11])).toBe(false);
    board.grid[0] = 0;

    board.grid[11] = 1; //simulate 1 block filled
    expect(board.fits([0,1,2,11])).toBe(false);
    expect(board.fits([201])).toBe(false); // out of bounds
  });
});

describe('Piece Object', () => {
  test('resize method', () => {
    let piece = new game.Piece('t');
    //piece.resizeGrid(10)
    expect(piece.size[0]).toBe(4);
    expect(piece.blocks[0]).toEqual([4,5,6,9]);

    piece.resize(6);
    expect(piece.size[0]).toBe(6);
    expect(piece.blocks[0]).toEqual([6, 7, 8, 13]);

    piece.resize(10);
    expect(piece.size[0]).toBe(10);
    expect(piece.blocks[0]).toEqual([10, 11, 12, 21]);
    expect(piece.blocks[1]).toEqual([1, 10, 11, 21]);

    expect(piece.resize(4)).toBe(true);
    expect(piece.size[0]).toBe(4);
    expect(piece.blocks[0]).toEqual([4,5,6,9]);

    expect(piece.resize(2)).toBe(false);
    expect(piece.size[0]).toBe(4);
    expect(piece.blocks[0]).toEqual([4,5,6,9]);

  });

  const defaultResult = [[10, 11, 12, 21],
                         [1, 10, 11, 21],
                         [1, 10, 11, 12],
                         [1, 11, 12, 21]
                        ];
  const downResult2 = [[20, 21, 22, 31, ],
                       [11, 20, 21, 31, ],
                       [11, 20, 21, 22, ],
                       [11, 21, 22, 31, ]
                      ];
  const rightResult1 = [[11, 12, 13, 22],
                        [2, 11, 12, 22],
                        [2, 11, 12, 13],
                        [2, 12, 13, 22]
                       ];


  const rightResult2 = [[13, 14, 15, 24],
                        [4, 13, 14, 24],
                        [4, 13, 14, 15],
                        [4, 14, 15, 24]
                       ];

  const rightResult3 = [[14, 15, 16, 25],
                        [5, 14, 15, 25],
                        [5, 14, 15, 16],
                        [5, 15, 16, 25]
                       ];
  test('shift methods', () => {
    let piece = new game.Piece('t');
    expect(piece.resize(10)).toBe(true);
    expect(piece.blocks).toEqual(defaultResult);

    expect(piece.shiftX(0)).toEqual(defaultResult);
    // // OLD
    //expect(piece.shiftX(1)).toEqual(downResult2);
    // // END OLD


    expect(piece.blocks).not.toEqual(downResult2);
    piece.blocks = piece.shiftX(1);
    expect(piece.shiftX(-1)).toEqual(defaultResult);

    piece.blocks = piece.shiftX(-1);
    expect(piece.shiftY(1)).toEqual(rightResult1);

    expect(piece.blocks).toEqual(defaultResult);
    expect(piece.shiftY(11)).toEqual(undefined);
    expect(piece.shiftY(-1)).toEqual(undefined);

    piece.blocks = piece.shiftY(3);
    expect(piece.blocks).toEqual(rightResult2);

    piece.blocks = piece.shiftY(1);
    expect(piece.blocks).toEqual(rightResult3);

    piece.blocks = piece.shiftY(-4);
    expect(piece.blocks).toEqual(defaultResult);

    expect(piece.shiftY(-2)).toEqual(undefined);
  });

  test('Shift methods (new)', () => {
    let piece = new game.Piece('t');
    expect(piece.resize(10)).toBe(true);
    expect(piece.blocks).toEqual(defaultResult);
    expect(piece.up()).toEqual(defaultResult);
    expect(piece.left()).toEqual(defaultResult);
    expect(piece.down()).toEqual(downResult2);
    expect(piece.up()).toEqual(defaultResult);
    expect(piece.right()).toEqual(rightResult1);
    expect(piece.blocks).toEqual(rightResult1);
  });

  test('rotate method', () => {
    let piece = new game.Piece('t');
    expect(piece.resize(10)).toBe(true);
    expect(piece.blocks).toEqual(defaultResult);

    expect(piece.get()).toEqual(defaultResult[0]);
    piece.rotate();
    expect(piece.get()).toEqual(defaultResult[1]);
    piece.rotate();
    expect(piece.get()).toEqual(defaultResult[2]);
    piece.rotate();
    piece.rotate();
    expect(piece.get()).toEqual(defaultResult[0]);
  });
});

describe('Pieces Object', () => {
  const fullPieces = [ { type: 'i', rotation: 0 },
                          { type: 'i', rotation: 1 },
                          { type: 'i', rotation: 2 },
                          { type: 'i', rotation: 3 },
                          { type: 'j', rotation: 0 },
                          { type: 'j', rotation: 1 },
                          { type: 'j', rotation: 2 },
                          { type: 'j', rotation: 3 },
                          { type: 'l', rotation: 0 },
                          { type: 'l', rotation: 1 },
                          { type: 'l', rotation: 2 },
                          { type: 'l', rotation: 3 },
                          { type: 'o', rotation: 0 },
                          { type: 'o', rotation: 1 },
                          { type: 'o', rotation: 2 },
                          { type: 'o', rotation: 3 },
                          { type: 's', rotation: 0 },
                          { type: 's', rotation: 1 },
                          { type: 's', rotation: 2 },
                          { type: 's', rotation: 3 },
                          { type: 't', rotation: 0 },
                          { type: 't', rotation: 1 },
                          { type: 't', rotation: 2 },
                          { type: 't', rotation: 3 },
                          { type: 'z', rotation: 0 },
                          { type: 'z', rotation: 1 },
                          { type: 'z', rotation: 2 },
                          { type: 'z', rotation: 3 }
                        ];

  const pieceList = new game.Pieces();

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
});

describe('Piece and Board integration', () => {
  test('Piece will not go out of bounds', () => {
    let board = new game.Board();
    let piece = new game.Piece('t');
    piece.resize(10);

    expect(board.fits(piece.shiftY(3)[0])).toBe(true);
    expect(board.fits(piece.shiftY(7)[0])).toBe(true);
    expect(board.fits(piece.shiftY(8))).toBe(undefined);

    expect(board.fits(piece.shiftX(3)[0])).toBe(true);
    expect(board.fits(piece.shiftX(17)[0])).toBe(true);
    expect(board.fits(piece.shiftX(18)[0])).toBe(false);

    board.grid[20] = 7;
    expect(board.fits(piece.shiftX(1)[0])).toBe(false);
  });
});
