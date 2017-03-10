// define a user behaviour
var Buf_Untochable = qc.defineBehaviour('qc.engine.Buf_Untochable', qc.Behaviour, function() {
	this._timeout_max = 3000;
    this._timeout = 0;
    this._blink_speed = 0;
    this._blink_speed_step = (1/this._timeout_max)*5;
}, {
    // fields need to be serialized
});

// Called when the script instance is being loaded.
Buf_Untochable.prototype.awake = function() {
	var self = this;
    self._timeout = self.game.time.now + self._timeout_max;
	self.gameObject._untouchable = true;   
};

// Called every frame, if the behaviour is enabled.
Buf_Untochable.prototype.update = function() {
	var self = this;
    
    if (self.game.time.now < self._timeout)
    {
        var new_speed = Math.abs(self._blink_speed)+self._blink_speed_step;
        self._blink_speed = self._blink_speed < 0 ? -new_speed : new_speed;
        
		self.gameObject.alpha += self._blink_speed;
        
        if (self.gameObject.alpha<0)
        {
            self.gameObject.alpha = 0;
            self._blink_speed = -self._blink_speed;
        } 
        else if (self.gameObject.alpha>1) 
        {
            self.gameObject.alpha = 1;
            self._blink_speed = -self._blink_speed;
        }
            
    }
    else
    {
        self.gameObject.alpha = 1;
        self.gameObject.removeScript(self);
		self.gameObject._untouchable = false;
    }
};
