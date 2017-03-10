// define a user behaviour
var Btn_Lang_EN = qc.defineBehaviour('qc.engine.Btn_Lang_EN', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
    locales: qc.Serializer.NODE,
    root: qc.Serializer.NODE
});

// Called when the script instance is being loaded.
//Btn_Lang_RU.prototype.awake = function() {
//
//};

// Called every frame, if the behaviour is enabled.
//Btn_Lang_RU.prototype.update = function() {
//
//};

Btn_Lang_EN.prototype.onClick = function() 
{
    var self = this;
    qc.lang = 'en';
	self.root._dispatchLocale();
    self.game.storage.set('lang', qc.lang);
    self.game.storage.save();
};
