// define a user behaviour
var Bns_Firerate = qc.defineBehaviour('qc.engine.Bns_Firerate', qc.Behaviour, function() {
	this._timeout_max = 3000;
    this._timeout = 0;
}, {
});

Bns_Firerate.prototype.awake = function() {
	var self = this;
    self._timeout = self.game.time.now + self._timeout_max;
	self.gameObject.ShipCtr.bonus.firerate = 150;
};

// Called every frame, if the behaviour is enabled.
Bns_Firerate.prototype.update = function() {
	var self = this;
    
    if (self.game.time.now > self._timeout)
    {
        self.gameObject.removeScript(self);
		self.gameObject.ShipCtr.bonus.firerate = 0;
    }
};
