// define a user behaviour
var Gnum = qc.defineBehaviour('qc.engine.Gnum', qc.Behaviour, function() {
    this._target = false;
    this._seekTimeout = 20000;
    this._nextSeek = 0;
    this._speed = 130;
    this._mileage = 0;
    this.spawnDist = 500;

    //cached vec2d classes instead creat new every render frame
    this.vTmp = new Vector2d(0,0);
    this.vDir = new Vector2d(0,0);
    this.vDiff = new Vector2d(0,0);
    this.vAvoid = new Vector2d(0,0);

}, {
    sounds: qc.Serializer.AUDIOS,
    observer: qc.Serializer.NODE,
    asters: qc.Serializer.NODE,
    ship: qc.Serializer.NODE,
    teleport_fx: qc.Serializer.NODE
});

// Called when the script instance is being loaded.
Gnum.prototype.awake = function() {
    var self = this;

    self.isAwake = true;

    self.radius = self.gameObject.width/2;
    //self.dbg = self.debug.Debug;

    self._sndEngine = self.game.add.sound();
    self._sndEngine.destroyWhenStop = false;
    self._sndEngine.audio = self.sounds[0];
    self._sndEngine.loop = true;
    self._sndEngine.volume = 0.5;

    self._sndTeleport = self.game.add.sound();
    self._sndTeleport.destroyWhenStop = false;
    self._sndTeleport.audio = self.sounds[1];
    self._sndTeleport.false = true;
    self._sndTeleport.volume = 0.3;

    this.teleport(false);
};

Gnum.prototype.teleport = function(withFX)
{
    var self = this, x, y;

    withFX = withFX !== false ? true : false;

    if (withFX)
    {
        self._sndTeleport.play();
        self.teleport_fx.Animator.play();
        self.teleport_fx.x = self.gameObject.x;
        self.teleport_fx.y = self.gameObject.y;
    }

    // random spawn position
    var sign_x = Math.random() < 0.5 ? -1 : 1;
    var sign_y = Math.random() < 0.5 ? -1 : 1;

    var sht = self.spawnDist;
    if (Math.random() < 0.5) // x
    {
        x = sign_x == 1 ? -sht : self.game.width + sht;
        y = Math.floor(Math.random() * self.game.height/4);
    }
    else // y
    {
        y = sign_y == 1 ? -sht : self.game.height + sht;
        x = Math.floor(Math.random() * self.game.width/4);
    }

    self.gameObject.x = x;
    self.gameObject.y = y;

    //calc data for sound
    var center = new Vector2d(self.game.width/2, self.game.height/2);
    var spawn = new Vector2d(x, y);
    self._mileage = 0;
    self.wayLen = center.distance(spawn);
    self.sndEngineStep = 1/this.wayLen;

    // next time to appear
    self.isActive = false;
    self._sndEngine.stop();
    self._nextSeek = self.game.time.now + self._seekTimeout;
};

// Called every frame, if the behaviour is enabled.
Gnum.prototype.update = function()
{
    var self = this, go = self.gameObject;

    if (self.isAwake !== true || self.observer.HUD.isPause) return;

    if ( !self.isActive && self.game.time.now > self._nextSeek )
    {
        self._target = self.asters.AsteroidPool.getNearGem(go);
        self._nextSeek = self.game.time.now + self._seekTimeout;

        if ( self._target )
        {
            self.isActive = true;
            self._sndEngine.play();
            self._sndEngine.volume = 0.01;
        }

        //if (!self._target) self._target = {x:0,y:self.game.height/2, Asteroid: {radius:10}}
    }

    if (self.isActive)
    {
        if ( !self._target )
        {
            self.teleport();
            return;
        }


        if (self._target.visible == false)
        {
            //self._target.x = self._target.x == 0 ? self.game.width : 0;
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
        go.x += (self.vDir.x*self._speed + self.vAvoid.x*50)*deltaMs;
        go.y += (self.vDir.y*self._speed + self.vAvoid.y*50)*deltaMs;

        self.vTmp.x = self.vDir.x + self.vAvoid.x;
        self.vTmp.y = self.vDir.y + self.vAvoid.y;
        go.rotation = self.vTmp.angle();

        self._mileage += self._speed * deltaMs;
        if (self._mileage < self.wayLen) {
            self._sndEngine.volume += self.sndEngineStep;
        }

        /*self.g.clear();
        self.g.beginFill(0xFF3300);
        self.g.lineStyle(1, 0xff0000, 1);
        self.g.moveTo(go.x, go.y);
        self.g.lineTo(go.x+self.vDir.x*64, go.y+self.vDir.y*64);
        self.g.endFill();*/

    }
};
