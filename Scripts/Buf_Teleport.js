// define a user behaviour
var Buf_Teleport = qc.defineBehaviour('qc.engine.Buf_Teleport', qc.Behaviour, function() {
	this._timeout = 0;
	
	this.icon = this.game.world._findByName('root')._findByName('icon_teleport');
	this.counter = this.icon._findByName('counter');
	this.fx = this.game.world._findByName('root')._findByName('fx_teleport');

}, {
    // fields need to be serialized
});

// Called when the script instance is being loaded.
Buf_Teleport.prototype.awake = function() {
	this.skill = this.gameObject.ShipCtr.skills.teleport;
	this.icon.visible = true;
	this.counter.visible = false;
};

Buf_Teleport.prototype.apply = function() {
	var self = this, now = self.game.time.now;
	
	if (now > self._timeout)
	{
		self.fx.Animator.play();
		self.fx.x = self.gameObject.x;
		self.fx.y = self.gameObject.y;
		
		self._timeout = now + self.skill.value * 1000;
		self.counter.text = ""+self.skill.value;
		self.counter.visible = true;
		self.icon.colorTint = new qc.Color('#5E5E5E');
		
		self.gameObject.x = self.game.input.cursorPosition.x;
		self.gameObject.y = self.game.input.cursorPosition.y;
		
		return true;
	}	
	
	return false;
}


// Called every frame, if the behaviour is enabled.
Buf_Teleport.prototype.update = function() {
	var self = this, now = self.game.time.now;
	
	if (now < self._timeout)
	{
		self.counter.text = "" + Math.floor( (self._timeout-now)/1000 );
	}
	else if (self.counter.visible)
	{
		self.counter.visible = false;
		self.icon.colorTint = new qc.Color('#FFFFFF');
	}

};
