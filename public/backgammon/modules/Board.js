
define(['Loader'], function (Loader) {
  var boardImage = 'assets/board.png';

  var dieImages = {
    die1: 'assets/boardgamePack/dieRed1.png',
    die2: 'assets/boardgamePack/dieRed2.png',
    die3: 'assets/boardgamePack/dieRed3.png',
    die4: 'assets/boardgamePack/dieRed4.png',
    die5: 'assets/boardgamePack/dieRed5.png',
    die6: 'assets/boardgamePack/dieRed6.png'
  };

  var piecesImages = {
    black_piece: 'assets/boardgamePack/pieceBlack_multi10.png',
    red_piece: 'assets/boardgamePack/pieceRed_border11.png'
    }, tokenOffset = {x: 10, y: 10};

  var pieceStartLocations = {
      1: {x: 830, y: 540},
      2: {x: 770, y: 540},
      3: {x: 710, y: 540},
      4: {x: 650, y: 540},
      5: {x: 590, y: 540},
      6: {x: 520, y: 540},

      7: {x: 340, y: 540},
      8: {x: 280, y: 540},
      9: {x: 220, y: 540},
      10: {x: 160, y: 540},
      11: {x: 100, y: 540},
      12: {x: 25, y: 540},

      13: {x: 25, y: 20},
      14: {x: 100, y: 20},
      15: {x: 160, y: 20},
      16: {x: 220, y: 20},
      17: {x: 280, y: 20},
      18: {x: 340, y: 20},

      19: {x: 520, y: 20},
      20: {x: 590, y: 20},
      21: {x: 650, y: 20},
      22: {x: 710, y: 20},
      23: {x: 770, y: 20},
      24: {x: 830, y: 20}
    },
    pieceSeperation = 30;

  var Board = function (params) {
    var that = new createjs.Container();

    var mainClickCallback = params.mainClickCallback;

    function init () {
      var simpleBoard = getSimpleBackgammonBoardFromGameBoard(params.size, params.gameState.spaces, params.gameState.pieces);

      that.drawBackground();

      _.each(simpleBoard, function (tokenInfo, spaceId) {
        that.drawTokens(tokenInfo.player === 'p1' ? 'black' : 'red', spaceId, tokenInfo.amt);
      });

      that.on('click', function (evt) {
        that.clickedSpace(evt.stageX, evt.stageY);
      });
    }

    that.drawBackground = function () {
      var newBitmap = new createjs.Bitmap(boardImage);
      newBitmap.x = 0;
      newBitmap.y = 0;
      that.addChild(newBitmap);
    };

    that.drawTokens = function (color, loc, amt) {
      var l = pieceStartLocations[loc],
        i;

      for (i=0; i<amt; i++) {
        var newBitmap = new createjs.Bitmap(piecesImages[color === 'red' ? 'red_piece' : 'black_piece']);
        newBitmap.x = l.x - tokenOffset.x;
        newBitmap.y = l.y + i * pieceSeperation * (parseInt(loc) > 12 ? 1 : -1) - tokenOffset.y;
        that.addChild(newBitmap);
      }
    };

    that.clickedSpace = function (x, y) {
      console.log('clicked ' + x + ', ' + y);

      // where is what boxes

      mainClickCallback(x,y);
    };


    init();
    return that;
  };

  var getSimpleBackgammonBoardFromGameBoard = function (size, spaces, pieces) {

    var board = {};

    _.each(spaces, function (value) {
      var loc = value.boardSpaceId;
      board[loc] = {}
    });

    _.each(pieces, function (value) {
      board[value.locationId].player = value.ownerId;
      board[value.locationId].amt = board[value.locationId].amt ? board[value.locationId].amt + 1 : 1;
    });

    return board;
  };

  return Board;
});