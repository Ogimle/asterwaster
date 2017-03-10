// define a user behaviour
var Btn_ReturnToMenu = qc.defineBehaviour('qc.engine.Btn_ReturnToMenu', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
    // fields need to be serialized
});

// Called when the script instance is being loaded.
//Btn_ReturnToMenu.prototype.awake = function() {
//
//};

// Called every frame, if the behaviour is enabled.
//Btn_ReturnToMenu.prototype.update = function() {
//
//};

Btn_ReturnToMenu.prototype.onClick = function() 
{
    var self = this;
	self.game.scene.load('mmenu');
};