// define a user behaviour
var Bns_Ship = qc.defineBehaviour('qc.engine.Bns_Ship', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
    // fields need to be serialized
});

Bns_Ship.prototype.awake = function() {
    this.game.world._findByName('observer').HUD.addLives(1);
    this.gameObject.removeScript(this);
};

