// define a user behaviour
var UfoPool = qc.defineBehaviour('qc.engine.UfoPool', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
    this.score = 200;
    
    this._ufoTimeout = 40000;
    this._ufoTime = this.game.time.now + this._ufoTimeout;
    this._speed = 150;
    this._bulletSpeed = 300;
    this._bulletDamage = 4;
    this.spawnDist = 500;
    this.wayLen = this.spawnDist*2+this.game.width;
    this.sndEngineStart = 0.001;
    this.sndEngineStep = (0.2-this.sndEngineStart)/this.wayLen/2;
    this._firstShootMin = 1;
    this._firstShootMax = 3;
    this._cooldown = 2000;
    this._chanceShootToPlayer = 50;
}, {
    // fields need to be serialized
    observer: qc.Serializer.NODE,
    asters: qc.Serializer.NODE,
    bullets: qc.Serializer.NODE,
    ship: qc.Serializer.NODE,
    ufoPrefab: qc.Serializer.PREFAB,
    sounds: qc.Serializer.AUDIOS
});

UfoPool.prototype.awake = function() {
    var self = this;
    self.isAwake = true;
    if (!self.observer.HUD && self.observer.Observer_menu) self.observer.HUD = self.observer.Observer_menu;
};

UfoPool.prototype.recalcTimeout = function(wave) 
{
    var self = this;
    if (wave == 1) self._ufoTimeout = 40000;
    else if (wave == 2) self._ufoTimeout = 35000;
    else if (wave == 3) self._ufoTimeout = 35000;

	self._ufoTime = self.game.time.now + self._ufoTimeout;    
};

UfoPool.prototype.spawn = function() 
{
    var self = this;
    var i,ufo, sign_x,sign_y, coord, cntmax=1, cnt=0, data=[];

    // рассчитываем позиции для нло
    for (i=0; i<cntmax; i++)
    {
        coord = {};
        
        // куда летим, слева направо, сверху вних etc..
        sign_x = Math.random() < 0.5 ? -1 : 1;
        sign_y = Math.random() < 0.5 ? -1 : 1;
        
        // опеределяем главное движение, мы по х или по у
        var sht = self.spawnDist;
        if (Math.random() < 0.5) // x
        {
            coord.x = sign_x == 1 ? -sht : self.game.width + sht;
            coord.ex = sign_x == 1 ? self.game.width + sht : - sht;
            
            coord.y = Math.floor(Math.random() * self.game.height/4);
            coord.ey = self.game.height - coord.y;
        }
        else // y
        {
            coord.y = sign_y == 1 ? -sht : self.game.height + sht;
            coord.ey = sign_y == 1 ? self.game.height + sht : - sht;
            
            coord.x = Math.floor(Math.random() * self.game.width/4);
            coord.ex = self.game.width - coord.x;
        }
        
        coord.rot = self.game.math.angleBetween(coord.x, coord.y, coord.ex, coord.ey);
            
        // разворот и направление
        coord.dir = {
            x: Math.cos(coord.rot),
            y: Math.sin(coord.rot)
        };
        
        data.push(coord);
    }    

    // выбираем сколько есть из пула
    for (i in self.gameObject.children) {
        ufo = self.gameObject.children[i];
        if (ufo.visible === false) {
            self.init(ufo, data[cnt]);
            cnt++;
            if (cnt === cntmax) return;
        }
    }

    // добавляем в пул недостающее
    for (i=cnt; i<cntmax; i++)
    {
        ufo = self.game.add.clone(self.ufoPrefab, self.gameObject);
        self.add(ufo, data[i]);
    }    
};

UfoPool.prototype.add = function(ufo, data) {
    var self = this;
       
    ufo.visible = true;
    ufo.x = data.x;
    ufo.y = data.y;
    ufo.rotation = data.rot;
    ufo._dir = data.dir;
    
	ufo._sndEngine = self.game.add.sound();
    ufo._sndEngine.destroyWhenStop = false;
    ufo._sndEngine.audio = self.sounds[0];
    ufo._sndEngine.loop = true;
    ufo._sndEngine.volume = self.sndEngineStart;
    if (!self.game.storage.get('mutesound')) ufo._sndEngine.play();
    
	ufo._sndShoot = self.game.add.sound();
    ufo._sndShoot.destroyWhenStop = false;
    ufo._sndShoot.audio = self.sounds[1];
    ufo._sndShoot.loop = false;
    ufo._sndShoot.volume = 1;    
    
	ufo.cooldownTimeout = self._cooldown;    
    ufo.mileage = 0;   
};

UfoPool.prototype.init = function(ufo, data) {
    var self = this;
	
    ufo.cooldownTimeout = self._cooldown;
    ufo.mileage = 0;
	ufo._sndEngine.volume = self.sndEngineStart;     
    
    ufo.visible = true;
    ufo.x = data.x;
    ufo.y = data.y;
    ufo.rotation = data.rot;
    ufo._dir = data.dir;

    if (!self.game.storage.get('mutesound')) ufo._sndEngine.play();
};

UfoPool.prototype.remove = function(ufo) {
    ufo.visible = false;
    ufo._sndEngine.stop();
};

UfoPool.prototype.removeAll = function() {
    var self=this, i, ufo;
    for (i in self.gameObject.children) {
        ufo = self.gameObject.children[i];
        if (ufo.visible === true) {
			ufo.visible = false;
			ufo._sndEngine.stop();
        }
    }	
};

UfoPool.prototype.shoot = function(go)
{
	var self = this;
    
    var opt = {
        from: go,
        snd: go._sndShoot,
        speed: self._bulletSpeed,
        dmg: self._bulletDamage
    };
    
    go.cooldownTimeout = self._cooldown;

    
    if (self.ship.visible && Math.random()*100 < self._chanceShootToPlayer - self.ship.ShipCtr.skills.cloaker.value)
    {
        opt.targ = ['player'];

        opt.rot = self.game.math.angleBetween(go.x, go.y, self.ship.x, self.ship.y);
        opt.dir = {
            x:Math.cos(opt.rot),
            y:Math.sin(opt.rot)
        };
	}
    else
    {
		opt.targ = ['aster'];
        var ast = self.asters.AsteroidPool.getNear(go, 4);
		ast = ast || self.asters.AsteroidPool.getNear(go, 3);
		ast = ast || self.asters.AsteroidPool.getNear(go, 2);
		ast = ast || self.asters.AsteroidPool.getNear(go, 1);
		ast = ast || {x:self.ship.x, y:self.ship.y};
        
        opt.rot = self.game.math.angleBetween(go.x, go.y, ast.x, ast.y);
        opt.dir = {
            x:Math.cos(opt.rot),
            y:Math.sin(opt.rot)
        };
    }
    
	self.bullets.BulletPool.add(opt); 
};

// Called every frame, if the behaviour is enabled.
UfoPool.prototype.update = function() 
{
    var self = this, go, deltaMs;

    if (self.isAwake !== true || self.observer.HUD.isPause) return;

	if (self.game.time.now > self._ufoTime) 
    {
		self._ufoTime = self.game.time.now + self._ufoTimeout;
        self.spawn();
    }
    
    //self.game.world.find('debug').Debug.show({
    //    tm:Math.floor((self._ufoTime-self.game.time.now)/1000)
    //});

    
    for (var idx in self.gameObject.children) 
    {
        if (self.gameObject.children[idx].visible === true) 
        {
            go = self.gameObject.children[idx];

            // двигаем ufo
            deltaMs = self.game.time.deltaTime / 1000;
            go.x += go._dir.x * self._speed * deltaMs;
            go.y += go._dir.y * self._speed * deltaMs; 
            
            // звук двигателе нарастает/убывает 
            go.mileage += self._speed * deltaMs;
			if (go.mileage < self.wayLen/2)
                go._sndEngine.volume += self.sndEngineStep;
            else
                go._sndEngine.volume -= self.sndEngineStep;

            // убираем его если достигло конца своего пути
            if (go.mileage > self.wayLen) 
            {
                self.remove(go);
                continue;
            }
            
            // если в поле зрения и вышел кулдаун, то стреляем в игрока или астер
            if (go.x > 0 && go.y > 0 && go.x < self.game.width && go.y < self.game.height)
            {
                go.cooldownTimeout -= self.game.time.deltaTime;
				if (go.cooldownTimeout < 0) self.shoot(go);
            }
            
            // проверяем столкновение с игроком
            if (self.ship.visible === true && self.ship._untouchable === false)
            {
                var dist = self.game.math.distance(go.x, go.y, self.ship.x, self.ship.y);
                if (dist < self.ship.ShipCtr.radius+go.width/2)
                {
                    self.observer.HUD.addLives(-1);
                    self.asters.AsteroidPool.addBoom();
                }
            }            
        }
    }
};
