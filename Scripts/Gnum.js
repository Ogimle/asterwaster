// define a user behaviour
var Gnum = qc.defineBehaviour('qc.engine.Gnum', qc.Behaviour, function() {
    this._target = null;
    this._seekTimeout = 1000;
    this._nextSeek = 0;

    //cached vec2d classes instead creat new every render frame
    this.vDir = new Vector2d(0,0);
    this.v2 = new Vector2d(0,0);
    this.vAhead = new Vector2d(0,0);
    this.vAhead2 = new Vector2d(0,0);
    this.vAvoid = new Vector2d(0,0);

}, {
    asters: qc.Serializer.NODE,
    debug: qc.Serializer.NODE,
    g: qc.Serializer.NODE,
    gemsPrefab: qc.Serializer.PREFAB
});

// Called when the script instance is being loaded.
Gnum.prototype.awake = function() {
    var self = this, a;

    self.radius = self.gameObject.width/2;
    //self.dbg = self.debug.Debug;

    /*for(var i=0; i<3; i++) {
        a = self.game.add.clone(self.gemsPrefab, self.asters);
        a.visible = true;
        var idx = Math.floor(Math.random() * 3);
        var frm = ['gem_blue.png', 'gem_red.png', 'gem_green.png'];
        a.frame = frm[idx];
        a.Asteroid.init({x: self.game.width/2-100, y: self.game.height/2-100});
    }*/
};

// Called every frame, if the behaviour is enabled.
Gnum.prototype.update = function()
{
    var self = this, go = self.gameObject;

    if (self.game.time.now > self._nextSeek)
    {
        self._nextSeek = self.game.time.now + self._seekTimeout;
        //self._target = self.asters.AsteroidPool.getNearGem(go);
        if (!self._target) self._target = {x:0,y:self.game.height/2, Asteroid: {radius:10}}
    }

    if (self._target)
    {
        var dist = self.game.math.distance(go.x, go.y, self._target.x, self._target.y);
        if (dist < self._target.Asteroid.radius+self.radius)
        {
            self._target.x = self._target.x == 0 ? self.game.width : 0;

            //self._target.visible = false;
            //self._target = null;
            return;
        }

        var deltaMs = self.game.time.deltaTime / 1000;

        // dir to target
        self.vDir.x = self._target.x;
        self.vDir.y = self._target.y;

        // calc dir (steering seek)
        self.vDir.x -= go.x;
        self.vDir.y -= go.y;
        self.vDir.normalize();

        // ---- calc avoid (steering avoid) ------------
        self.vAvoid.x = self.vAvoid.y = 0;

        //      calc ahead vectors with 100 length
        self.vAhead.x = go.x + self.vDir.x*self.radius*7;
        self.vAhead.y = go.y + self.vDir.y*self.radius*7;
        self.vAhead2.x = go.x + self.vDir.x*self.radius*2;
        self.vAhead2.y = go.y + self.vDir.y*self.radius*2;

        self.g.clear();
        self.g.beginFill(0xFF3300);
        self.g.lineStyle(1, 0xff0000, 1);
        self.g.moveTo(go.x, go.y);
        self.g.lineTo(self.vAhead.x, self.vAhead.y);
        self.g.endFill();

        //      find nearest aster on ship way
        var nearest = null, ast, collision, sx, sy, dist1, dist2;

        for (var i=0, imax=self.asters.children.length; i < imax; ++i)
        {
            ast = self.asters.children[i];
            if (ast.Asteroid.type == 'ast' && ast.visible)
            {
                collision = Vector2d.lineIntersectsCircle(self.vAhead, self.vAhead2, ast.x, ast.y, ast.Asteroid.radius+self.radius);

                // dist to current aster
                sx = go.x - ast.x;
                sy = go.y - ast.y;
                dist1 = Math.sqrt(sx * sx + sy * sy);

                // update nearest
                if (collision)
                {
                    if ( !nearest )
                    {
                        nearest = ast;
                    }
                    else
                    {
                        // dist to nearest aster
                        sx = go.x - nearest.x;
                        sy = go.y - nearest.y;
                        dist2 = Math.sqrt(sx * sx + sy * sy);

                        if (dist1 < dist2) nearest = ast;
                    }
                }
            }
        }

        //      calc avoid
        if ( nearest )
        {
            self.vAvoid.x = self.vAhead.x - nearest.x;
            self.vAvoid.y = self.vAhead.y - nearest.y;
            self.vAvoid.normalize();

            /*if (self.dbg) self.dbg.show({
                sx: Math.floor(self.vAvoid.x),
                sy: Math.floor(self.vAvoid.y)
            });*/
        }

        // move & rotate
        go.x += (self.vDir.x*50 + self.vAvoid.x*50)*deltaMs;
        go.y += (self.vDir.y*50 + self.vAvoid.y*50)*deltaMs;

        self.vDir.x += self.vAvoid.x;
        self.vDir.y += self.vAvoid.y;
        go.rotation = self.vDir.angle();

    }
};
