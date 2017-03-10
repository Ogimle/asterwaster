// define a user behaviour
var Cursor = qc.defineBehaviour('qc.engine.Cursor', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
    // fields need to be serialized
});

// Called when the script instance is being loaded.
//Cursor.prototype.awake = function() {
//	var self = this;
//	console.log('mouse', self.game.input.mouse.cursorPosition);
//};

// Called every frame, if the behaviour is enabled.
Cursor.prototype.update = function() {
	var self = this;
    self.gameObject.x = self.game.input.mouse.input.cursorPosition.x;
    self.gameObject.y = self.game.input.mouse.input.cursorPosition.y;
};
