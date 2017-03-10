// define a user behaviour
var Asteroid = qc.defineBehaviour('qc.engine.Asteroid', qc.Behaviour, function() {
    this.moveSpeed = 5;
    this.angleSpeed = 1;
    this._dir = {x:1, y:1};
    this.score = 0;
    this.hp = 0;
}, {
    type: qc.Serializer.STRING,
    score: qc.Serializer.NUMBER,
    maxHP: qc.Serializer.NUMBER,
    size: qc.Serializer.NUMBER,
    moveSpeed: qc.Serializer.NUMBER,
    angleSpeed: qc.Serializer.NUMBER
});

// Called when the script instance is being loaded.
Asteroid.prototype.awake = function() {
	var self = this;
    
    self.radius = self.gameObject.width/2;
    
    self.hideTop = -self.gameObject.height/2 - 50;
    self.hideRight = self.game.width + self.gameObject.width/2 + 50;
    self.hideBottom = self.game.height + self.gameObject.height/2 + 50;
    self.hideLeft = -self.gameObject.width/2 - 50;  
    
    self.hp = self.maxHP;

    var idx = Math.floor(Math.random()*2)+1;
    self.gameObject.frame = 'asteroid'+self.size+idx+'.png';
};

Asteroid.prototype.init = function(pos) {
    var self = this, go = this.gameObject, ex, ey, dist;
    //console.log('init', pos, self);
    
    self.hp = self.maxHP;
    go.visible = true;
    go.x = pos.x;
    go.y = pos.y;
    
    // астер создан за игровым полем
    if (go.x < 0 || go.x > self.game.width || go.y < 0 || go.y > self.game.height)
    {
        ex = self.game.width/2 + Math.random()*250;
        ey = self.game.height/2 + Math.random()*250;
        dist = self.game.math.distance(go.x,go.y, ex,ey);
        
        self._dir.x = (ex - go.x)/dist;
        self._dir.y = (ey - go.y)/dist;
        //console.log('e',ex,ey, 'g', go.x, go.y, 'd',self._dir.x, self._dir.y);
    }
    else
    {
        var ang = Math.random() * 360;
        self._dir.x = Math.cos(ang);
        self._dir.y = Math.sin(ang);
    }
};
