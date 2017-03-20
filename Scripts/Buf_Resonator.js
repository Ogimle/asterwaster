// define a user behaviour
var But_Resonator = qc.defineBehaviour('qc.engine.Buf_Resonator', qc.Behaviour, function() {
	this._timeout_max = 3000;
    this._timeout = 0;
    this._blink_speed = 0;
    this._blink_speed_step = (1/this._timeout_max)*5;

    this.activated = false;
    this.skill = this.gameObject.ShipCtr.skills.resonator;

    this.asters = this.game.world._findByName('root')._findByName('asteroidRoot');
    this.bullets = this.game.world._findByName('root')._findByName('bulletRoot');

    this.icon = this.game.world._findByName('root')._findByName('icon_resonator');
    this.fx_1 = this.game.world._findByName('root')._findByName('fx_airblast_1');
    this.fx_2 = this.game.world._findByName('root')._findByName('fx_airblast_2');
    this.fx_3 = this.game.world._findByName('root')._findByName('fx_airblast_3');
    this.fx_4 = this.game.world._findByName('root')._findByName('fx_airblast_4');
}, {
    // fields need to be serialized
});

But_Resonator.prototype.activate = function()
{
    var self = this;
    self.activated = true;
    self.runned = 0;
    self.inwork = 0;
    self.icon.alpha = 1;
    self.icon.visible = true;
    self._timeout = self.game.time.now + self._timeout_max;
    self.gameObject.addScript('qc.engine.Buf_Untochable');
};

But_Resonator.prototype.apply = function()
{
    var self = this, idx, snd;

    if (self.activated && self.runned < self.skill.level)
    {
        snd = self.game.add.sound();
        snd.audio = self.gameObject.ShipCtr.sounds[3];
        snd.loop = false;
        snd.volume = 0.6;
        snd.play();


        self.runned++;
        self.inwork++;
        idx = 'fx_'+self.runned;
        self[idx].visible = true;
        var action = self[idx].Animator.getAction(0);
        action.onFinished.removeAll();
        action.onFinished.add(function(action) {
            action.targetObject.visible = false;
            self.inwork--;
        });
        self[idx].Animator.play();
        self[idx].x = self.gameObject.x;
        self[idx].y = self.gameObject.y;
        self[idx].hitted = [];
    }
};

But_Resonator.prototype.remove = function()
{
    this.icon.visible = false;
    this.skill.reset();
    this.gameObject.removeScript(this);
};

// Called every frame, if the behaviour is enabled.
But_Resonator.prototype.update = function()
{
	var self = this, go, dist, wave, isHitted;

    if (!self.activated) return;
    
    if (self.game.time.now < self._timeout)
    {
        var new_speed = Math.abs(self._blink_speed)+self._blink_speed_step;
        self._blink_speed = self._blink_speed < 0 ? -new_speed : new_speed;
        
		self.icon.alpha += self._blink_speed;
        
        if (self.icon.alpha<0)
        {
            self.icon.alpha = 0;
            self._blink_speed = -self._blink_speed;
        } 
        else if (self.icon.alpha>1)
        {
            self.icon.alpha = 1;
            self._blink_speed = -self._blink_speed;
        }
            
    }
    else if (self.inwork<1)
    {
        self.icon.visible = false;
        self.activated = false;
    }

    //iterate waves
    for (var w_idx = 1, wmax=self.runned+1; w_idx<wmax; ++w_idx)
    {
        wave = self['fx_'+w_idx];

        //iterate asters
        if (wave.visible)
        for (var a_idx = 0, imax = self.asters.children.length; a_idx < imax; ++a_idx)
        {
            go = self.asters.children[a_idx];

            isHitted = false;
            for(var h_idx = 0, hmax=wave.hitted.length; h_idx<hmax; ++h_idx)
            {
                if (go == wave.hitted[h_idx]) {isHitted=true; break;}
            }

            if (!isHitted && go.Asteroid.type === 'ast' && go.visible)
            {
                dist = self.game.math.distance(go.x, go.y, wave.x, wave.y);

                // wave is collide with aster
                if (dist < wave.width/2 + go.Asteroid.radius)
                {
                    var
                        L = wave.width / 2 / go.Asteroid.radius,
                        cx = (wave.x + L * go.x) / (1 + L),
                        cy = (wave.y + L * go.y) / (1 + L);

                    //add explode
                    self.bullets.BulletPool.addHit(go.Asteroid.size);
                    var boom = self.game.add.clone(self.bullets.BulletPool.boomPrefab);
                    boom.x = cx;
                    boom.y = cy;

                    // if hp of aster is out then remove it
                    go.Asteroid.hp -= 1;
                    if (go.Asteroid.hp < 1)
                    {
                        self.asters.AsteroidPool.remove(go);
                        self.bullets.BulletPool.addBoom(go.Asteroid.size);
                    }

                    if (go.Asteroid.size > 1) wave.hitted.push(go);
                }
            }
        }
    }

};
