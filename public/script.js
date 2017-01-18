(function() {
  function makeid(n) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < n; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  } 

  function Question(question) {
    if (!(!!question.text && !!question.weight && !!question.options)) {
      throw new Error("question " + question + " doesn't contain all the options");
    }

    this.id = makeid(10);
    this.text = question.text;
    this.weight = question.weight;
    this.options = question.options.map(function(option) {
      return new Option(option);
    });
  }

  function Option(option) {
    if (!option.text === undefined) {
      console.log(option);
      throw new Error("option doesnt contain text field");
    }
    if (option.point_a === undefined) {
      console.log(option);
      throw new Error("option doesnt contain point a field");
    }
    if (!option.point_b === undefined) {
      console.log(option);
      throw new Error("option doesnt contain point b field");
    }

    this.id = makeid(10);
    this.text = option.text;
    this.pointA = option.point_a;
    this.pointB = option.point_b;
    if (option.questions) {
      this.questions = option.questions.map(function(question) {
        return new Question(question);
      });
    }
  }

  function Game(data, renderer) {
    this.gameState = data.game;
    this.gameState.pointA = 0;
    this.gameState.pointB = 0;
    this.gameState.daysGoneBy = 0;

    this.renderer = renderer;

    this.questionTrees = data.questions.map(function(question) {
      new Question(question);
    });
  }

  // Given an array of questions, it will choose the next one based on the weights
  Game.prototype.selectNextQuestion = function(questions) {
    var totalWeight = _.reduce(questions, function(s, question){
      return s + question.weight;
    }, 0);
    var nextQuestion;
    var chosenIndex = Math.floor(Math.random() * totalWeight) + 1;

    var questionTree = _.find(this.questionTrees, function(questionTree) {
      if (chosenIndex >= questionTree.length) return true;
      if (chosenIndex - questionTree.weight <= 0) return true
      return false;
    });
    
    return questionTree;
  }

  Game.prototype.updateQuestionTrees = function(question,  selectedOptionId) {
    var option = _.find(question.options, function(option) {
      return option.id === selectedOptionId;
    });
    if (option.questions) {
      var nextQuestion = this.selectNextQuestion(questions);
      // Replace the current question with this next question, we've advanced
      // the tree state for one question
      this.replaceQuestionWithQuestion(question, nextQuestion);
    } else {
      this.removeQuestionFromTree(question.id);
      return;
    }
  }

  Game.prototype.replaceQuestionWithQuestion = function(question, nextQuestion) {
    this.questionTrees.map(function(q) {
      if (q.id == question.id) {
        return nextQuestion;
      }
      return q;
    });
  }

  Game.prototype.removeQuestionFromTree = function(id) {
    // Filter out a question with this id
    return this.questionTrees.filter(function(question) {
      return question.id !== id;
    });
  }
  
  Game.prototype.isNotOver = function() {
    return this.dateValid() && this.pointAValid() && this.pointBValid();
  }

  Game.prototype.dateValid = function() { this.gameState.daysGoneBy < 365; }
  Game.prototype.pointAValid = function() { this.gameState.pointA > 0; }
  Game.prototype.pointBValid = function() { this.gameState.pointB > 0; }

  var data = YAML.load('config.yml');
  // Build this into a set of decision trees

  function preload() {
    
  }

  function create() {
    
  }

  function update() {
    
  }

  function render() {
  }

  var game = new Game(data);
  new Phaser.Game(800, 600, Phaser.CANVAS, 'choice-game', { preload: preload, create: create, update: update, render: render });

})();
