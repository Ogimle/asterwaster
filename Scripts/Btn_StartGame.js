// define a user behaviour
var Btn_StartGame = qc.defineBehaviour('qc.engine.Btn_StartGame', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
    // fields need to be serialized
});

// Called when the script instance is being loaded.
//Btn_StartGame.prototype.awake = function() {
//
//};

// Called every frame, if the behaviour is enabled.
//Btn_StartGame.prototype.update = function() {
//
//};

Btn_StartGame.prototype.onClick = function() 
{
    var self = this;
	self.game.scene.load('game');
};

