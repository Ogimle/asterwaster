// define a user behaviour
var SoundPool = qc.defineBehaviour('qc.engine.SoundPool', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
    list: qc.Serializer.AUDIOS
});

// Called when the script instance is being loaded.
//SoundPool.prototype.awake = function() {
//
//};

// Called every frame, if the behaviour is enabled.
//SoundPool.prototype.update = function() {
//
//};
