// define a user behaviour
var Stars = qc.defineBehaviour('qc.engine.Stars', qc.Behaviour, function() {
    //this.runInEditor = true;
    this._timeout = 0;
}, {
    starPref: qc.Serializer.PREFAB
});

Stars.prototype.awake = function() {
    var self = this;
    self._center = {x:self.game.width/2, y:self.game.height/2};
    self.scaleStep = 1000;
};

Stars.prototype.spawn = function() {
    var self = this;

    var star = false;

    for (var idx=0, imax=self.gameObject.children.length; idx<imax; ++idx) {
        var s = self.gameObject.children[idx];
        if (s.visible === false) {
            s.visible = true;
            star = s;
        }
    }

    if ( !star ) {
        star = self.game.add.clone(self.starPref, self.gameObject);
    }


    var ang = Math.random() * 360;
    star.rotation = ang;
    star._dir_x = Math.cos(ang);
    star._dir_y = Math.sin(ang);
    star._speed = 1;
    star.scaleX = star.scaleY = 0.1;
    star.x = self._center.x;
    star.y = self._center.y;

    star.visible = true;

    return star;

};

Stars.prototype.update = function() {
    var self = this;

    self._timeout -= this.game.time.deltaTime;

    if (self._timeout < 0)
    {
        self._timeout = 100;
        self.spawn();
    }

    for (var idx=0, imax=self.gameObject.children.length; idx<imax; ++idx) {
        if (self.gameObject.children[idx].visible === true) {
            var go = self.gameObject.children[idx];

            var deltaMs = self.game.time.deltaTime / 1000;
            go._speed += go._speed*deltaMs;

            go.x += go._dir_x * go._speed * deltaMs;
            go.y += go._dir_y * go._speed * deltaMs;

            go.scaleX = go.scaleY += go._speed/20000;
            go.rotation += 0.01;



            // aster move out of screen then do mirror reposition him
            if (go.x < 0 || go.x > self.game.width ||
                go.y < 0 || go.y > self.game.height)
            {
                go.visible = false;
            }
        }
    }

};
