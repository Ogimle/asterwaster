// define a user behaviour
var BulletPool = qc.defineBehaviour('qc.engine.BulletPool', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
    this.ship = null;
    this.asteroidRoot = null;
    this.bulletPrefab = null;
    this.boomPrefab = null;
    
    this._clearTime = 0;
}, {
    sounds: qc.Serializer.AUDIOS,
    observer: qc.Serializer.NODE,
    ship: qc.Serializer.NODE,
    asteroidRoot: qc.Serializer.NODE,
    ufoRoot: qc.Serializer.NODE,
    bulletPrefab: qc.Serializer.PREFAB,
    ufo_explodePrefab: qc.Serializer.PREFAB,
    boomPrefab: qc.Serializer.PREFAB    
});

BulletPool.prototype.addBoom = function (size)
{
    var self = this;
    if (!self.game.storage.get('mutesound'))
    {
        var vol = [0.2, 0.5, 0.75, 1];

        var snd = self.game.add.sound();
        snd.destroyWhenStop = true;
        snd.audio = self.sounds[0];
        snd.loop = false;
        snd.volume = vol[size - 1];
        snd.play();
    }
};

BulletPool.prototype.addHit = function (size)
{
    var self = this;
    if (!self.game.storage.get('mutesound'))
    {
        var vol = [0.1, 0.2, 0.2, 0.2];

        var snd = self.game.add.sound();
        snd.destroyWhenStop = true;
        snd.audio = self.sounds[1];
        snd.loop = false;
        snd.volume = vol[size - 1];
        snd.play();
    }
    
};

BulletPool.prototype.add = function (opt) {
	var self = this;
       
    for (var idx in self.gameObject.children) {
        var b = self.gameObject.children[idx];
        if (b.visible === false) {
            b.visible = true;
            b.Bullet.init(opt);
            return;
        }
    }
    
    var bullet = self.game.add.clone(self.bulletPrefab, self.gameObject);
    //bullet.scrBullet = bullet.getScript('qc.engine.Bullet');
    bullet.Bullet.init(opt);
};

// Called every frame, if the behaviour is enabled.
BulletPool.prototype.update = function() {
    var self = this, go, dist, boom;
    
    if (self.observer.HUD.isPause) return;
    
    //перебираем активные снаряды
    for (var idx in self.gameObject.children)
    {
        var b = self.gameObject.children[idx];
        if (b.visible === true)
        {
            
            if (b.opt.targ.indexOf('aster') !== -1)
            {
                // iterate asteroids
                for (var a_idx=0, imax=self.asteroidRoot.children.length; a_idx<imax; ++a_idx)
                {
                    go = self.asteroidRoot.children[a_idx];

                    if ( go.Asteroid.type === 'ast' && go.visible )
                    {
                        dist = self.game.math.distance(go.x, go.y, b.x, b.y);
                        //столкновение снаряда с астером произошло
                        if (dist < go.Asteroid.radius) {
                            b.visible = false;//убираем снаряд

                            //добавляем взрыв
                            self.addHit(go.Asteroid.size);
                            boom = self.game.add.clone(self.boomPrefab);
                            boom.x = b.x;
                            boom.y = b.y;

                            // ударяем астер
                            go.Asteroid.hp -= b.opt.dmg;
                            if (go.Asteroid.hp < 1) //убираем астер
                            {
                                if (b.opt.isPlayer)
                                {
                                    self.observer.HUD.addScore(go.Asteroid.score);
                                    self.ship.ShipCtr.activateFireRate(); // запускаем ускорение огня
                                }
                                self.asteroidRoot.AsteroidPool.remove(go);
                                self.addBoom(go.Asteroid.size);
                            }

                            return;
                        }
                    }
                }
            }
            
            if (b.opt.targ.indexOf('ufo') !== -1)
            {
                //перебираем активные ufo
                for (var u_idx in self.ufoRoot.children)
                {
                    go = self.ufoRoot.children[u_idx];
                    if (go.visible)
                    {
                        dist = self.game.math.distance(go.x, go.y, b.x, b.y);
                        //столкновение снаряда с астером произошло
                        if (dist < go.width/2)
                        {
                            b.visible = false; //убираем снаряд

                            self.ship.ShipCtr.activateFireRate(); // запускаем ускорение огня


                            self.observer.HUD.addScore(self.ufoRoot.UfoPool.score);
                            self.ufoRoot.UfoPool.remove(go);// remove ufo
                            self.addBoom(3);
                            
                            //добавляем взрыв
                            self.addHit(3);
                            boom = self.game.add.clone(self.ufo_explodePrefab);
                            boom.x = go.x;
                            boom.y = go.y;

                            return;
                        }
                    }
                }
            }
                       
            if (b.opt.targ.indexOf('player') !== -1 && self.ship.visible && self.ship._untouchable === false)
            {
				dist = self.game.math.distance(self.ship.x, self.ship.y, b.x, b.y);
                if (dist < self.ship.width/2)
                {
                    b.visible = false; //убираем снаряд

                    self.observer.HUD.addLives(-1);
                    self.addBoom(3);

                    return;
                }
            }

            //двигаем снаряд
            var deltaMs = self.game.time.deltaTime / 1000;

            b.x += b.opt.dir.x * b.opt.speed * deltaMs;
            b.y += b.opt.dir.y * b.opt.speed * deltaMs;

            if (b.x < 0 || b.x > self.game.width || b.y < 0 || b.y > self.game.height)
            {
                b.visible = false;
            }
            
        }
    }

};
