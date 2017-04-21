// define a user behaviour
var Btn_Credits = qc.defineBehaviour('qc.engine.Btn_Credits', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
    // fields need to be serialized
});

Btn_Credits.prototype.onClick = function()
{
    var self = this;
    self.game.scene.load('credits');
};
