// define a user behaviour
var Gnum = qc.defineBehaviour('qc.engine.Gnum', qc.Behaviour, function() {
    this._target = false;
    this._seekTimeout = 1000;
    this._nextSeek = 0;

    //cached vec2d classes instead creat new every render frame
    this.vTmp = new Vector2d(0,0);
    this.vDir = new Vector2d(0,0);
    this.vDiff = new Vector2d(0,0);
    this.vAvoid = new Vector2d(0,0);

}, {
    observer: qc.Serializer.NODE,
    asters: qc.Serializer.NODE,
    ship: qc.Serializer.NODE,
    teleport_fx: qc.Serializer.NODE
});

// Called when the script instance is being loaded.
Gnum.prototype.awake = function() {
    var self = this;

    this.isActive = true;
    self.radius = self.gameObject.width/2;
    //self.dbg = self.debug.Debug;
};

Gnum.prototype.teleport = function()
{
    var self = this;

    self.teleport_fx.Animator.play();
    self.teleport_fx.x = self.gameObject.x;
    self.teleport_fx.y = self.gameObject.y;

    self.gameObject.x = 2000;
    self.gameObject.y = 2000;
}

// Called every frame, if the behaviour is enabled.
Gnum.prototype.update = function()
{
    var self = this, go = self.gameObject;

    if (self.observer.HUD.isPause) return;

    if ( !self.isActive && self.game.time.now > self._nextSeek )
    {
        self._target = self.asters.AsteroidPool.getNearGem(go);
        if ( self._target ) self.isActive = true;

        //if (!self._target) self._target = {x:0,y:self.game.height/2, Asteroid: {radius:10}}
    }

    if (self.isActive)
    {
        if ( !self._target )
        {
            self.isActive = false;
            self._nextSeek = self.game.time.now + self._seekTimeout;
            self.teleport();
            return;
        }


        var dist = self.game.math.distance(go.x, go.y, self._target.x, self._target.y);
        if (dist < self._target.Asteroid.radius+self.radius)
        {
            //self._target.x = self._target.x == 0 ? self.game.width : 0;

            self._target.visible = false;
            self._target = self.asters.AsteroidPool.getNearGem(go);;
            return;
        }

        var deltaMs = self.game.time.deltaTime / 1000;

        // seek target
        self.vDir.x = self._target.x - go.x;
        self.vDir.y = self._target.y - go.y;
        self.vDir.normalize();

        // ---- calc avoid (steering avoid) ------------
        var desireddistance = self.radius*4;
        self.vAvoid.x = self.vAvoid.y = 0;

        //      find nearest aster on ship way
        var ast, sx, sy, dist1, cnt = 0;

        for (var i=0, imax=self.asters.children.length; i < imax; ++i)
        {
            ast = self.asters.children[i];
            if (ast.Asteroid.type == 'ast' && ast.visible)
            {
                // dist to current aster
                sx = go.x - ast.x;
                sy = go.y - ast.y;
                dist1 = Math.floor(Math.sqrt(sx * sx + sy * sy));

                if (dist1 > 0 && dist1 <= desireddistance)
                {
                    cnt++;

                    self.vDiff.x = sx;
                    self.vDiff.y = sy;
                    self.vDiff.normalize();
                    self.vDiff.x /= dist1;
                    self.vDiff.y /= dist1;

                    self.vAvoid.x += self.vDiff.x;
                    self.vAvoid.y += self.vDiff.y;
                }
            }
        }

        // dist to ship
        sx = go.x - self.ship.x;
        sy = go.y - self.ship.y;
        dist1 = Math.floor(Math.sqrt(sx * sx + sy * sy));

        if (dist1 > 0 && dist1 <= desireddistance)
        {
            cnt++;

            self.vDiff.x = sx;
            self.vDiff.y = sy;
            self.vDiff.normalize();
            self.vDiff.x /= dist1;
            self.vDiff.y /= dist1;

            self.vAvoid.x += self.vDiff.x;
            self.vAvoid.y += self.vDiff.y;
        }

        //      calc avoid
        if ( cnt > 0 )
        {
            self.vAvoid.x /= cnt;
            self.vAvoid.y /= cnt;
            self.vAvoid.normalize();
        }

        // move & rotate
        go.x += (self.vDir.x*150 + self.vAvoid.x*50)*deltaMs;
        go.y += (self.vDir.y*150 + self.vAvoid.y*50)*deltaMs;

        self.vTmp.x = self.vDir.x + self.vAvoid.x;
        self.vTmp.y = self.vDir.y + self.vAvoid.y;
        go.rotation = self.vTmp.angle();

        /*self.g.clear();
        self.g.beginFill(0xFF3300);
        self.g.lineStyle(1, 0xff0000, 1);
        self.g.moveTo(go.x, go.y);
        self.g.lineTo(go.x+self.vDir.x*64, go.y+self.vDir.y*64);
        self.g.endFill();*/

    }
};
