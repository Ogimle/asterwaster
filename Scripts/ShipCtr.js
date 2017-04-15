var ShipCtr = qc.defineBehaviour('qc.demo.ShipCtr', qc.Behaviour, function() {
    this.bullets = null;
    this._fireTime = 0;
    this._fireTimeoutBase = 500;
    this._fireTimeout = 500;
    this._accelDec = {x:5, y:5, lim:10};
    this._bulletSpeed = 800;
    this._bulletDamage = 1;

    this.isSeamlessWorld = false;

    this._isFly = false;
    
    this.gameObject._untouchable = false;

    // bonuses

    this.bonus = {
      firerate: 0
    };

    //skills
    
    this.skills = {
		life: {
			cost: 0,
			value: 0,
			up: function (score) {
				if (this.cost <= score)
				{
					this.value++;
					return true;
				}
				return false;
			}
		},
        teleport: {
			level: 0, 
			max_level: 5, 
			base: 30, 
			value:0, 
			step: -5,
			cost: 0,
			up: function(score) {
				if (this.cost <= score && this.level<this.max_level)
				{
					this.level++; 
					this.value = this.base + this.level*this.step; 
					return true;
				}
				return false;
			},
			lget: function() {
				if (this.level===0) return '---'; 
				return this.base + this.level*this.step; 
			},
			nget: function() {
				if (this.level+1>this.max_level) return '---';
				return this.base + (this.level+1)*this.step; 
			},
			reset: function() {
				this.level = 0;
				this.value = 0;
			}
			
		},
        firerate: {
			level: 0,
            points: 0, //in battle level
			max_level: 5, 
			base: 0,
			value:0,
			step: 50,
			cost: 0,
            timeout: 0,
            base_timeout: 5000,
			up: function(score) {
				if (this.cost <= score && this.level<this.max_level)
				{
					this.level++; 
					this.value = this.level*this.step;
					return true;
				}
				return false;
			},
			lget: function() {
				if (this.level===0) return '---'; 
				return this.level*20;
			},
			nget: function() {
				if (this.level+1>this.max_level) return '---';
				return (this.level+1)*20;
			},
			reset: function() {
				this.level = 0;
				this.value = 0;
                this.points = 0;
			},
            current: function() {
                return this.points*this.step;
            }
		},
        cloaker: {
			level: 0,
			max_level: 5,
			base: 0,
			value:0,
			step: 5,
			cost: 0,
			up: function(score) {
				if (this.cost <= score && this.level<this.max_level)
				{
					this.level++;
					this.value = this.level*this.step;
					return true;
				}
				return false;
			},
			lget: function() {
				if (this.level===0) return '50';
				return 50 - this.level*this.step;
			},
			nget: function() {
				if (this.level+1>this.max_level) return '---';
				return 50 - (this.level+1)*this.step;
			},
			reset: function() {
				this.level = 0;
				this.value = 0;
			}

		},
        resonator: {
			level: 0,
			max_level: 4,
			base: 0,
			value:0,
			step: 1,
			cost: 0,
			up: function(score) {
				if (this.cost <= score && this.level<this.max_level)
				{
					this.level++;
					this.value += this.step;
					return true;
				}
				return false;
			},
			lget: function() {
				if (this.level===0) return '---';
				return this.level;
			},
			nget: function() {
				if (this.level+1>this.max_level) return '---';
				return this.level+1;
			},
			reset: function() {
				this.level = 0;
				this.value = 0;
			}

		},
        radar: {
			level: 0,
			max_level: 3,
			base: 0,
			value:0,
			step: 1,
			cost: 0,
			up: function(score) {
				if (this.cost <= score && this.level<this.max_level)
				{
					this.level++;
					this.value += this.step;
					return true;
				}
				return false;
			},
			lget: function() {
				if (this.level===0) return '---';
				return this.level;
			},
			nget: function() {
				if (this.level+1>this.max_level) return '---';
				return this.level+1;
			},
			reset: function() {
				this.level = 0;
				this.value = 0;
			}

		}
    };
    
}, {
    observer: qc.Serializer.NODE,
    sounds: qc.Serializer.AUDIOS,
    bullets: qc.Serializer.NODE,
    bg: qc.Serializer.NODE,
    asters: qc.Serializer.NODE,
    ico_teleport: qc.Serializer.NODE,
    ico_frate: qc.Serializer.NODE,
    ico_resonator: qc.Serializer.NODE,
    ico_radar: qc.Serializer.NODE
});

ShipCtr.prototype.awake = function ()
{
    var self = this, input = self.game.input;

    this.rbody = this.getScript('qc.arcade.RigidBody');
    this.rbody.angularAcceleration = 0;

    self._isFly = false;

    //self.control_type = window.localStorage.getItem('control_type') || 'mouse';
    self.control_type = self.game.storage.get('control_type');

    self.radius = self.gameObject.width/2;
    
    self.bg_reserve_x = self.bg.width - self.game.width;
    self.bg_reserve_y = self.bg.height - self.game.height;
   
    // Add event listeners
    this.addListener(input.onPointerUp, self.onPointerUp, self);    
    
	self._sndEngine = self.game.add.sound();
    self._sndEngine.destroyWhenStop = false;
    self._sndEngine.audio = self.sounds[0];
    self._sndEngine.loop = true;
    self._sndEngine.volume = 0.3;    
    
	self._sndShoot = self.game.add.sound();
    self._sndShoot.destroyWhenStop = false;
    self._sndShoot.audio = self.sounds[1];
    self._sndShoot.loop = false;
    self._sndShoot.volume = 0.6;    
    
    // skills
    
	self._sndTeleport = self.game.add.sound();
    self._sndTeleport.destroyWhenStop = false;
    self._sndTeleport.audio = self.sounds[2];
    self._sndTeleport.false = true;
    self._sndTeleport.volume = 0.3;

    if (self.game.storage.get('disabledrag'))
    {
        this.getScript('qc.arcade.RigidBody').drag.set(0, 0);
    }

    if (self.game.storage.get('seamless'))
    {
        this.isSeamlessWorld = true;
        this.hideRight = this.game.width+16;
        this.hideBottom = this.game.height+16;
        this.getScript('qc.arcade.RigidBody').collideWorldBounds = false;
    }

};

ShipCtr.prototype.update = function() 
{
    var self = this, go = this.gameObject,
        deltaMs = self.game.time.deltaTime / 1000,
        isKb = false, isMouse = false, angle=null, isMiddleMouse = false;

    self.rbody.moves = !self.observer.HUD.isPause;
    if (self.observer.HUD.isPause) return;
    
    // render the root container
    
    if (self.control_type == 'mouse')
    {
        if (self.game.input.mouse.isMouseDown(qc.Mouse.BUTTON_RIGHT)) isMouse = true;
        if (self.game.input.mouse.isMouseDown(qc.Mouse.BUTTON_MIDDLE)) isMiddleMouse = true;
        isMouse = isMiddleMouse ? isMiddleMouse : isMouse;
    }
    else
    {
        if (self.game.input.isKeyDown(qc.Keyboard.A)) {
            isKb = true;
            angle = 3;
        }
        else if (self.game.input.isKeyDown(qc.Keyboard.D)) {
            isKb = true;
            angle = 0;
        }

        if (self.game.input.isKeyDown(qc.Keyboard.W)) {
            isKb = true;
            if (angle == null) angle = -1.5;
            else if (angle == 0) angle = -0.75;
            else angle = -2.25;
        }
        else if (self.game.input.isKeyDown(qc.Keyboard.S)) {
            isKb = true;
            if (angle == null) angle = 1.5;
            else if (angle == 0) angle = 0.75;
            else angle = 2.25;
        }
    }

	go.rotation = self.rbody.angleBetween(self.game.input.cursorPosition);
	
    if (isMouse)
    {
        var v = isMiddleMouse ? -250 : 250;
		self.rbody.velocityFromRotation(go.rotation, v, self.rbody.acceleration);
        if (!self._isFly)
        {
            self._isFly = true;
            go.playAnimation('fly');
            if (!self.game.storage.get('mutesound')) self._sndEngine.play();
        }		
	}
    else if (isKb)
    {
		self.rbody.velocityFromRotation(angle, 250, self.rbody.acceleration);
		if (!self._isFly)
		{
            self._isFly = true;
            go.playAnimation('fly');
            if (!self.game.storage.get('mutesound')) self._sndEngine.play();
        }
	}
    
    if (!isMouse && !isKb && (self.rbody.acceleration.x !== 0 || self.rbody.acceleration.y !== 0))
    {
        if (self._isFly)
        {
            self._isFly = false;
            self._sndEngine.stop();
            go.stop();
            go.frame = 'ship.png';
        }
        self.rbody.acceleration.set(0, 0);
    }
           
    if (self.rbody.velocity.x !== 0 || self.rbody.velocity.y !== 0)
    {
        if (self.isSeamlessWorld)
        {
            if (go.x < -16)
            {
                go.x = self.game.width +16;
            }
            else if (go.x > self.hideRight)
            {
                go.x = -16;
            }

            if ( go.y < -16)
            {
                go.y = self.game.height + 16;
            }
            else if (go.y > self.hideBottom)
            {
                go.y = -16;
            }
        }

        self.bg.x += -self.rbody.velocity.x*deltaMs/10;
        self.bg.y += -self.rbody.velocity.y*deltaMs/10;
     
        if (self.bg.x>0) self.bg.x=0;
        else if (self.bg.x<-self.bg_reserve_x) self.bg.x=-self.bg_reserve_x;
        
        if (self.bg.y>0) self.bg.y=0;
        else if (self.bg.y<-self.bg_reserve_y) self.bg.y=-self.bg_reserve_y;
    }
   
    if (self.game.input.mouse.isMouseDown(qc.Mouse.BUTTON_LEFT)) {
        self.fire();
    }
    
    if (!self.isKeyTeleport && self.game.input.isKeyDown(qc.Keyboard.SPACEBAR) && self.skills.teleport.level>0) {
		if (go.Buf_Teleport.apply(self.bg))
        {
            self._sndTeleport.play();
            if (self.skills.resonator.level > 0) go.Buf_Resonator.activate();
        }
        else if (self.skills.resonator.level > 0)
        {
            go.Buf_Resonator.apply();
        }

		self.isKeyTeleport = true;
        setTimeout( function() {self.isKeyTeleport = false;}, 500);		
    }

};

ShipCtr.prototype.onPointerUp = function(id, x, y)
{
	var self = this,
        input = self.game.input;
    
    var pointer = input.getPointer(id);
    if (pointer.isMouse) {
        if (pointer.id === qc.Mouse.BUTTON_LEFT) {

            var rbody = this.getScript('qc.arcade.RigidBody');
                       
            //если отпустили газ, то останавливаем ускорение на текущей скорости
            rbody.acceleration.x = rbody.velocity.x;
            rbody.acceleration.y = rbody.velocity.y;
            
            //считаем пропорцию убавления ускороения
            if ( Math.abs(rbody.velocity.x) > Math.abs(rbody.velocity.y) )
            {
                self._accelDec.x = self._accelDec.lim;
                self._accelDec.y = self._accelDec.lim * Math.abs(rbody.velocity.y/rbody.velocity.x);
            }
            else 
            {
                self._accelDec.y = self._accelDec.lim;
                self._accelDec.x = self._accelDec.lim * Math.abs(rbody.velocity.x/rbody.velocity.y);
            }
        }
    }
       
	/*self._isNeedSaveDir = true;
	console.log('mouseUp', e);*/
};

ShipCtr.prototype.fire = function() 
{
    var self = this, bonus = self.bonus.firerate, frate = self.skills.firerate;
        
    if (self.game.time.now - self._fireTime < self._fireTimeout) return;

    //self._fireTimeout = self._fireTimeoutBase - self._fireTimeoutBase * ((self.skills.firerate.value * self.asters.AsteroidPool._alive)/200);
    if (frate.timeout>0)
        self._fireTimeout = self._fireTimeoutBase - frate.current() - bonus;
    else
        self._fireTimeout = self._fireTimeoutBase;

    //console.log('ship', self);
    self._fireTime = self.game.time.now;
    self.bullets.BulletPool.add({
        isPlayer: true,
        from: self.gameObject,
        snd: self._sndShoot,
        targ: ['aster', 'ufo'],
        dmg: self._bulletDamage,
        rot: self.gameObject.rotation,
        dir: {
			x:Math.cos(self.gameObject.rotation),
            y:Math.sin(self.gameObject.rotation)
        },
        speed: self._bulletSpeed
    });
};

ShipCtr.prototype.die = function() 
{
    var self = this;
    self.gameObject.visible = false;
    if (self._isFly)
    {
        self._sndEngine.stop();
        self.gameObject.stop();
        self.gameObject.frame = 'ship.png';
    }
};

ShipCtr.prototype.saveDirection = function() 
{
	var self = this, go = self.gameObject;
	
	var length = Math.sqrt(go.x * go.x + go.y * go.y);
	self._dir.x = go.x/length;
	self._dir.y = go.y/length;
	
	self._isNeedSaveDir = false;
};

ShipCtr.prototype.removeSkills = function()
{
	var self = this, go = self.gameObject;

	if (go.Buf_Teleport) go.removeScript(go.Buf_Teleport);
    self.skills.teleport.reset();
    self.ico_teleport.visible = false;

    if (go.Buf_Firerate) go.Buf_Firerate.remove();
    self.ico_frate.visible = false;

    if (go.Buf_Resonator) go.Buf_Resonator.remove();
    self.ico_resonator.visible = false;

    if (go.Buf_Radar) go.Buf_Radar.remove();
    self.ico_radar.visible = false;

	self.skills.cloaker.reset();
};

ShipCtr.prototype.pause = function(isPause)
{
	var rb = self.ship.getScript('qc.arcade.RigidBody');
	rb.moves = !isPause;
};

ShipCtr.prototype.activateFireRate = function()
{
    var self = this, skill = self.skills.firerate;
    if (skill.level > 0) {
        this.gameObject.Buf_Firerate.advance(1);
        skill.timeout = skill.base_timeout;
    }
};
