// define a user behaviour
var Bns_1000 = qc.defineBehaviour('qc.engine.Bns_1000', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
    // fields need to be serialized
});

// Called when the script instance is being loaded.
Bns_1000.prototype.awake = function() {
    this.game.world._findByName('observer').HUD.addScore(1000);
    this.gameObject.removeScript(this);
};
