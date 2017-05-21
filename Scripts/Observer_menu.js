// define a user behaviour
var Observer_menu = qc.defineBehaviour('qc.engine.Observer_menu', qc.Behaviour, function() {
    this._wave = 0;
}, {
    wopt: qc.Serializer.NODE,
    ufos: qc.Serializer.NODE,
    gnum: qc.Serializer.NODE,
    asters: qc.Serializer.NODE
});

Observer_menu.prototype.awake = function() {
    var self = this;
    self.restart();
};

Observer_menu.prototype.restart = function() {
    var self = this;

    self.gnum.Gnum._seekTimeout = 10000;

    self.ufos.UfoPool._ufoTimeout = 25000;
    self.ufos.UfoPool._ufoTime = 0;

    //clear field
    self.asters.AsteroidPool.removeAll();
    self.asters.AsteroidPool._wave = self._wave;

    //clear ufo
    self.ufos.UfoPool.removeAll();

    self.wopt.visible = false;
};

Observer_menu.prototype.setWave = function(num)
{
    this._wave = 0;
};