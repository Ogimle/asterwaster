// define a user behaviour
var Debug = qc.defineBehaviour('qc.engine.Debug', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
    // fields need to be serialized
});


// Called every frame, if the behaviour is enabled.
Debug.prototype.show = function(data) {
	var self = this, txt = '';
    
    for(var key in data)
    {
        txt += key + ': ' + data[key] + '\n';
    }
    
    self.gameObject.text = txt;
};


