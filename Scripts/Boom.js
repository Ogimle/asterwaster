// define a user behaviour
var Boom = qc.defineBehaviour('qc.engine.Boom', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
    // fields need to be serialized
});

// Called when the script instance is being loaded.
Boom.prototype.awake = function() {
    var self = this;
	self.gameObject.playAnimation('boom');
    self.gameObject.onFinished.addOnce(function() {
        self.gameObject.destroy();
    });    
};


// Called every frame, if the behaviour is enabled.
//Boom.prototype.update = function() {
//
//};
