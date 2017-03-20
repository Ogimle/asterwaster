// define a user behaviour
var HUD = qc.defineBehaviour('qc.engine.HUD', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
    this._wave = 0;
    this._score = 0;
    this._money = 0;
    this._lives = 0;
    this._optMuteSound = false;
}, {
    ufoRoot: qc.Serializer.NODE,
    asteroidRoot: qc.Serializer.NODE,
	ship: qc.Serializer.NODE,
	crash: qc.Serializer.NODE,
	fldScore: qc.Serializer.NODE,
    fldLives: qc.Serializer.NODE,
    fldWave: qc.Serializer.NODE,
    fldMoney: qc.Serializer.NODE,

    dlgGameOver: qc.Serializer.NODE,
    dlgShop: qc.Serializer.NODE,
    dlgPause: qc.Serializer.NODE
});

// Called when the script instance is being loaded.
HUD.prototype.awake = function() {
    var self = this;
    self._optMuteSound = window.localStorage.getItem('muteSound') || false;
    self.restart();
};

HUD.prototype.addScore = function(num) 
{
    var self = this;
    self._score += num;
    self.fldScore.text = qc.lc_get('hud_score')+self._score;
};

HUD.prototype.addMoney = function(num)
{
    var self = this;
    self._money += num;
    self.fldMoney.text = qc.lc_get('hud_money')+self._money;
};


HUD.prototype.setWave = function(num) 
{
    var self = this;
    self.fldWave.text = qc.lc_get('hud_wave')+num;

    self.ufoRoot.UfoPool.recalcTimeout(num);
};


HUD.prototype.addLives = function(num) 
{
    var self = this;
    self._lives += num;
       
    if (num < 0)
    {
        //explose
        self.crash.reset();
        self.crash.x = self.ship.x;
        self.crash.y = self.ship.y;
        self.crash.start();
        
        if (self._lives < 0)
        {
            //game over
            self.ship.ShipCtr.die();
            self.dlgGameOver.visible = true;
            self.dlgGameOver.x = self.game.width/2 - self.dlgGameOver.width/2;
            self.dlgGameOver.y = self.game.height/2 - self.dlgGameOver.height/2;
        }
        else
        {
            //then move to center
            self.ship.x = self.game.width/2;
            self.ship.y = self.game.height/2;
            var rb = self.ship.getScript('qc.arcade.RigidBody');
            rb.velocity.x = rb.velocity.y = 0;

            //add unvulrability for 3sec
            self.ship.addScript('qc.engine.Buf_Untochable');
        }        
    }    

    self.fldLives.text = qc.lc_get('hud_lives')+self._lives;
};

HUD.prototype.restart = function() {
    var self = this;
    
    self.dlgGameOver.visible = false;
    self.dlgShop.visible = false;
    self.dlgPause.visible = false;

    self._lives = 1;
    self.fldLives.text = qc.lc_get('hud_lives')+self._lives;
    
    self.fldWave.text = qc.lc_get('hud_wave')+self._wave;
    
	self._score = 0;
    self.fldScore.text = qc.lc_get('hud_score')+self._score;

	self._money = 0;
    self.fldMoney.text = qc.lc_get('hud_money')+self._money;

    self.ship.visible = true;
    
    self.ufoRoot.UfoPool._ufoTime = self.game.time.now + self.ufoRoot.UfoPool._ufoTimeout;

    //then move to center
    self.ship.x = self.game.width/2;
    self.ship.y = self.game.height/2;
    var rb = self.ship.getScript('qc.arcade.RigidBody');
    rb.velocity.x = rb.velocity.y = 0;

    //add unvulrability for 3sec
    self.ship.addScript('qc.engine.Buf_Untochable');
    self.ship.ShipCtr.removeSkills();
    
    //clear field
    self.asteroidRoot.AsteroidPool.removeAll();
    self.asteroidRoot.AsteroidPool._wave = self._wave;
    
    //clear ufo
    self.ufoRoot.UfoPool.recalcTimeout(1);
    self.ufoRoot.UfoPool.removeAll();
};
    
// Called every frame, if the behaviour is enabled.
HUD.prototype.update = function() {
    var self = this, pause, isShop;
    
    if (!self.isKeyPause && self.game.input.isKeyDown(qc.Keyboard.P)) {
        pause = self.isPause || false;
        self.isPause = !pause;
        self.dlgPause.visible = self.isPause;
        
		//self.ship.ShipCtr.pause(pause);
        
        self.isKeyPause = true;
        setTimeout( function() {
            self.isKeyPause = false;
        }, 500);
    }
    
    if (self._lives > -1 && !self.isKeyShop && self.game.input.isKeyDown(qc.Keyboard.ESC)) {
        isShop = !self.dlgShop.visible;
        self.isPause = isShop;
        self.dlgShop.visible = isShop;
        
        //self.ship.ShipCtr.pause(self.isPause);
        
        if (isShop)
        {
			self.dlgShop.x = self.game.width/2 - self.dlgShop.width/2;
			self.dlgShop.y = self.game.height/2 - self.dlgShop.height/2;
        
			self.dlgShop._findByName('itm_ship').Btn_ShopItem.resetButtons()
		}
        
        self.isKeyShop = true;
        setTimeout( function() {
            self.isKeyShop = false;
        }, 500);
    }    

};
