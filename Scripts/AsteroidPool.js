// define a user behaviour
var AsteroidPool = qc.defineBehaviour('qc.engine.AsteroidPool', qc.Behaviour, function() {
    this._wave = 0;
    this._waveReady = true;
    this._alive = 0;
}, {
    sounds: qc.Serializer.AUDIOS,
    
    asteroid1Prefab: qc.Serializer.PREFAB,
    asteroid2Prefab: qc.Serializer.PREFAB,
    asteroid3Prefab: qc.Serializer.PREFAB,
    asteroid4Prefab: qc.Serializer.PREFAB,
    gemsPrefab: qc.Serializer.PREFAB,
    bonusPrefab: qc.Serializer.PREFAB,

    ship: qc.Serializer.NODE,
    observer: qc.Serializer.NODE
});

// Called when the script instance is being loaded.
AsteroidPool.prototype.awake = function() {
    var self = this;
    self.isAwake = true;
    if (!self.observer.HUD && self.observer.Observer_menu) self.observer.HUD = self.observer.Observer_menu;
};

AsteroidPool.prototype.addBoom = function ()
{
    var self = this;
    if (!self.game.storage.get('mutesound'))
    {
        var snd = self.game.add.sound();
        snd.destroyWhenStop = true;
        snd.audio = self.sounds[0];
        snd.loop = false;
        snd.volume = 1;
        snd.play();
    }
};

AsteroidPool.prototype.addPick = function (type) {
    var self = this, idx = 2;
    if (!self.game.storage.get('mutesound'))
    {
        var snd = self.game.add.sound();
        snd.destroyWhenStop = true;
        if (type == 'gem') idx = '2';
        else if (type == 'bonus') idx = '1';
        snd.audio = self.sounds[idx];
        snd.loop = false;
        snd.volume = 1;
        snd.play();
    }
};

AsteroidPool.prototype.addBy = function (obj, size) {
	var self = this;

    size = obj.Asteroid ? obj.Asteroid.size - 1 : 4;
    
    if (size>0 && size<5)
    {
        var cnt=0, cntmax, prefObj, i;
        
        // определяем вид и количество недостающих
        switch(size)
        {
            case 4: 
                cntmax = 1; 
                prefObj = self.asteroid4Prefab;
                break;
            case 3: 
                cntmax = 3; 
                prefObj = self.asteroid3Prefab;
                break;
            case 2: 
                cntmax = 3; 
                prefObj = self.asteroid2Prefab;
                break;
            case 1: 
                cntmax = 4; 
                prefObj = self.asteroid1Prefab;
                break;
        }
        
        // считаем позиции субастероидов
        var pos = [];
        if (cntmax > 1)
        {
            var r = obj.Asteroid.radius/2; ang = 360/cntmax;
            
            for(i=0; i<cntmax; i++)
            {
                pos.push({
                    x: obj.x + r * Math.cos(ang*i),
                    y: obj.y + r * Math.sin(ang*i)
                });    
            }
        }
        else // самый большой размещаем в центр
        {
            pos.push({x:obj.x,y:obj.y});
        }
        //console.log(pos);

        var a;
        
        // выбираем сколько есть из пула
        for (i in self.gameObject.children) {
            a = self.gameObject.children[i];
            if (a.visible === false && a.type === 'ast' && a.Asteroid.size==size) {
                //console.log('rev', cnt, pos[cnt]);

                a.Asteroid.init(pos[cnt]);
                cnt++;
                if (cnt === cntmax) return;
            }
        }

        // добавляем в пул недостающее
        for (i=cnt; i<cntmax; i++)
        {
            //console.log('add', i, pos[i]);
			a = self.game.add.clone(prefObj, self.gameObject);
			a.Asteroid.init(pos[i]);
        }
	}
};

AsteroidPool.prototype.remove = function (go)
{
    var self = this, i, a;
    
    go.visible = false;
    if (go.Asteroid.type === 'ast')
    {
        self.addBy(go);
        // calc chance gem drop
        if (Math.random() < 0.20)
        {
            // find existed at pool
            // if exist then get it
            var isAddGem = true;
            for (i in self.gameObject.children) {
                a = self.gameObject.children[i];
                if (a.visible === false && a.type === 'gem') {
                    isAddGem = false;
                    break;
                }
            }

            // if dont exit then add to pool
            if (isAddGem) a = self.game.add.clone(self.gemsPrefab, self.gameObject);
            var idx = Math.floor(Math.random()*3);
            var frm = ['gem_blue.png', 'gem_red.png', 'gem_green.png'];
            a.frame = frm[idx];

            //add to aster pos
            a.Asteroid.init({x: go.x, y: go.y});
        }


        // chance to drom bonus 10%
        var chance = Math.random(); // bonus avail
        if (chance < 0.10)
        {
            // find existed at pool
            // if exist then get it
            var isAddBonus = true;
            for (i in self.gameObject.children) {
                a = self.gameObject.children[i];
                if (a.visible === false && a.type === 'bns') {
                    isAddBonus = false;
                    break;
                }
            }

            // if dont exit then add to pool
            if (isAddBonus) a = self.game.add.clone(self.bonusPrefab, self.gameObject);
            var frm = ['shop_itm_ship.png', 'shop_itm_firerate.png', '1000.png'];
            var skl = ['qc.engine.Bns_Ship', 'qc.engine.Bns_Firerate', 'qc.engine.Bns_1000'];

            // get all exluded live
            var idx = 1+Math.floor(Math.random()*2);

            // if chance to get live then get live
            if (chance <=0.01) idx = 0;

            a.frame = frm[idx];

            //add to aster pos
            a.Asteroid.init({x: go.x, y: go.y});
            a.Bonus.init();
            a.Asteroid.bonus = skl[idx];

        }
    }

};

AsteroidPool.prototype.removeAll = function ()
{
    var self = this;
    self._gems = 0;
    
    for (var idx in self.gameObject.children) 
	{
		self.gameObject.children[idx].visible = false; 
    }
};

AsteroidPool.prototype.nextWave = function () {
    var self = this;

    self._waitForWave = true;
    this.game.timer.add(3000, function() {
        // не знаю как вытащить ширину объекта из префаба
        // в общем 100 это радиус самого большого астероида
        var wdh = Math.floor(self.game.width/100);
        var hgt = Math.floor(self.game.height/100);
        
        var shp_x = Math.floor(self.ship.x/100);
        var shp_y = Math.floor(self.ship.y/100);
        
        // расчитываем квадратно-гнездовым способом точки
        // появления астеров
        // удаляем из точек спавна позицию корабля и
        // и один круг прилежащих к ней позиций
        var spawns = [];
        for(var my=0; my<hgt; my++)
        {
            for(var mx=0; mx<wdh; mx++)
            {
                if (mx != shp_x && my != shp_y)
                {
                    spawns.push({
                        x: mx*100+50,
                        y: my*100+50
                    });
                }
            }
        }
        
       
        for(var i=0;i<self._wave;i++)
        {
            var pos = spawns[ Math.floor(Math.random() * spawns.length) ];
			self.addBy(pos);
        }
        
        self._waitForWave = false;
    });    
};

AsteroidPool.prototype.getNear = function (go, size)
{
    var self = this, dist = 999999, tmp, tmp_dist, ast = false;
    
    for (var idx in self.gameObject.children) 
    {
        tmp = self.gameObject.children[idx];
        if (tmp.visible === true && tmp.Asteroid.type === 'ast' && tmp.Asteroid.size === size)
        {
            tmp_dist = self.game.math.distance(go.x, go.y, tmp.x, tmp.y);
			if (tmp_dist < dist)
            {
				dist = tmp_dist;
                ast = tmp;
            }
        }
    }
    
    return ast;
};

// Called every frame, if the behaviour is enabled.
AsteroidPool.prototype.update = function() 
{
    var self = this;
    
    if (self.isAwake !== true || self.observer.HUD.isPause) return;
    
    //if (self._waveReady || self._gems > 0)
    {
        // iterate by asteroids & gems
        // move it if alive
        // run new wave if all die
        self._alive = 0;
        self._gems = 0;
        for (var idx=0, imax=self.gameObject.children.length; idx<imax; ++idx)
        {
            if (self.gameObject.children[idx].visible === true) 
            {
                var go = self.gameObject.children[idx];

                if (go.Asteroid.type === 'ast') self._alive++;
                else self._gems++;

                // move aster
                var deltaMs = self.game.time.deltaTime / 1000;
                go.x += go.Asteroid._dir.x * go.Asteroid.moveSpeed * deltaMs;
                go.y += go.Asteroid._dir.y * go.Asteroid.moveSpeed * deltaMs;    

                go.rotation += go.Asteroid.angleSpeed * deltaMs;

                // check collision with player
                if (self.ship.visible === true)
                {
                    var dist = self.game.math.distance(go.x, go.y, self.ship.x, self.ship.y);
                    if (dist < self.ship.ShipCtr.radius+go.Asteroid.radius)
                    {
                        if (go.Asteroid.type === 'ast' && self.ship._untouchable === false)
                        {
                            self.observer.HUD.addLives(-1);
                            self.addBoom();
                        }
                        else if (go.Asteroid.type === 'gem')
                        {
                            self.observer.HUD.addMoney(go.Asteroid.score);
                            self.remove(go);
                            self.addPick('gem');
                        }
                        else if (go.Asteroid.type === 'bns')
                        {
                            self.ship.addScript(go.Asteroid.bonus);
                            self.remove(go);
                            self.addPick('bonus');
                        }
                    }
                }

                // aster move out of screen then do mirror reposition him
                if (go.x < go.Asteroid.hideLeft || go.x > go.Asteroid.hideRight || 
                    go.y < go.Asteroid.hideTop || go.y > go.Asteroid.hideBottom)
                {
                    go.x = self.game.width - go.x + (go.x<0?-10:10);
                    go.y = self.game.height - go.y + (go.y<0?-10:10);        
                }          
            }
        }  

        if (self._alive == 0 && !self._waitForWave)
        {
            self._wave++;
            self.observer.HUD.setWave(self._wave);
            self.nextWave();
        }
    }
};
