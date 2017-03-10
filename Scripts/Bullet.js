// define a user behaviour
var Bullet = qc.defineBehaviour('qc.engine.Bullet', qc.Behaviour, function() {
    this._liveTime = 2000;
}, {
    speed: qc.Serializer.NUMBER
});

// Called when the script instance is being loaded.
//Bullet.prototype.awake = function() {
//	var self = this;
//};

Bullet.prototype.init = function(opt) {
    var self = this;
	self.observer = self.game.world.find('observer');
    
    self.gameObject.opt = opt;
    
    self.gameObject.x = opt.from.x;
    self.gameObject.y = opt.from.y;
    self.gameObject.rotation = opt.rot;
     
    self._live = self.game.time.now + self._liveTime;
    if (!self.game.storage.get('mutesound')) opt.snd.play();
};

// Called every frame, if the behaviour is enabled.
/*Bullet.prototype.update = function() {
    var self = this;
    
	//if (self.game.time.now - self._live > 0) {
    //    self.gameObject.visible = false;
    //    return;
    //}
    if (self.observer.HUD.isPause) return;
    
    var deltaMs = self.game.time.deltaTime / 1000;
    var go = self.gameObject;
    go.x += go.opt.dir.x * go.opt.speed * deltaMs;
    go.y += go.opt.dir.y * go.opt.speed * deltaMs;
    
    if (go.x < 0 || go.x > self.game.width ||
        go.y < 0 || go.y > self.game.height)
    {
		go.visible = false;
    }
};*/
