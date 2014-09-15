var _ = require('lodash'),
  Q = require('q');

var muleRules = require('mule-rules'),
  GameBoard = require('mule-models').GameBoard.Model,
  GameState = require('mule-models').GameState.Model,
  PieceState = require('mule-models').PieceState.Model;

var Actions = {
  BasicCreate: require('./tempActions/basicCreate'),
  BasicMove: require('./tempActions/basicMove')
};

exports.initActions = function (ruleBundle) {
  console.log('init bundle Actions');
  _.each(muleRules.getActions(ruleBundle.name), function (value) {
    value.init({GameState: GameState, PieceState: PieceState});
  });
};

var getAction = function (actionType, ruleBundle) {
  return Actions[actionType] || muleRules.getActions(ruleBundle.name)[actionType];
};


exports.validateActionsQ = function (gameBoardId, playerRel, actions, ruleBundle) {
  exports.initActions(ruleBundle);

  var promiseArray = [],
    _gameStateId;
  _.each(actions, function (action, key) {
    var Action = getAction(action.type, ruleBundle);
    if (!Action) {
      //TODO correct error handling
      console.log('wow that action doesnt exist')
    }

    var promise = GameBoard.findByIdQ(gameBoardId)
      .then(function (foundGameBoard) {
        _gameStateId = foundGameBoard.gameState;
        return Action.validateQ(foundGameBoard, _gameStateId, playerRel, action.params, ruleBundle);
      })
        .then(function (gameState) {
        console.log('valid move action ' + key + ': ');
        console.log(action.params);
      })
      .fail(function (err) {
        console.log('invalid action: ' + key);
        throw 'action ' + key + ': ' + err;
      });

    promiseArray.push(promise);
  });

  return Q.all(promiseArray)
    .then(function () {
      var bundleCode = muleRules.getBundleCode(ruleBundle.name),
        validateActionsQ;
      if (bundleCode && (validateActionsQ = bundleCode.validateActions)) {
        return GameState.findByIdWithPopulatedStatesQ(_gameStateId)
          .then(function (gameState) {
            return validateActionsQ({
              gameState: gameState,
              ruleBundle: ruleBundle,
              playerRel: playerRel,
              actions: actions
            });
          });
      } else {
        return Q(actions);
      }
    });
};

exports.doActionsQ = function (objs, actions, playerRel, ruleBundle) {
  var promiseArray = [];

  exports.initActions(ruleBundle);

  _.each(actions, function (action, actionKey) {
    var Action = getAction(action.type, ruleBundle);
    var promise = Action.doQ(objs.gameState, action.params, playerRel)
      .then(function (resultActionMetaData) {
        console.log('R' + objs.history.currentRound + ' - ' + playerRel + ': success action #' + actionKey);

        if (resultActionMetaData)
          return objs.history.saveMetaDataToActionQ(playerRel, actionKey, resultActionMetaData);
      })
      .fail(function (err) {
        console.log('R' + objs.history.currentRound + ' - ' + playerRel + ': error action #' + actionKey);
        console.log(err);
      });
    promiseArray.push(promise);
  });

  return Q.all(promiseArray);
};
