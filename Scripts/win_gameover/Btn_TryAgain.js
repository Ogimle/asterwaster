// define a user behaviour
var Btn_TryAgain = qc.defineBehaviour('qc.engine.Btn_TryAgain', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
    observer: qc.Serializer.NODE
});

// Called when the script instance is being loaded.
//Btn_TryAgain.prototype.awake = function() {
//
//};

// Called every frame, if the behaviour is enabled.
//Btn_TryAgain.prototype.update = function() {
//
//};

Btn_TryAgain.prototype.onClick = function() {
    var self = this;
    self.observer.HUD.restart();
};
