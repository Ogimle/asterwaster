// define a user behaviour
var Btn_ShopBuy = qc.defineBehaviour('qc.engine.Btn_ShopBuy', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
}, {
	observer: qc.Serializer.NODE,
    shop: qc.Serializer.NODE,
    ship: qc.Serializer.NODE,
    tech: qc.Serializer.NODE,
    score: qc.Serializer.NODE,
    sounds: qc.Serializer.AUDIOS,
});

Btn_ShopBuy.prototype.awake = function ()
{
    var self = this;
    
	self.sndFail = self.game.add.sound();
    self.sndFail.destroyWhenStop = false;
    self.sndFail.audio = self.sounds[0];
    self.sndFail.loop = false;

	self.sndOK = self.game.add.sound();
    self.sndOK.destroyWhenStop = false;
    self.sndOK.audio = self.sounds[1];
    self.sndOK.loop = false;
}

Btn_ShopBuy.prototype.onUp = function() {
	var self = this, bought = false, skill;
	var skills = self.ship.ShipCtr.skills;
	
	if (self.shop.current_item == '') 
	{
		return;
	}
	
	switch (self.shop.current_item)
	{
		case 'itm_ship':
			skill = skills.life;
			bought = skill.up(self.observer.HUD._money);
			if (bought)
			{
				self.observer.HUD.addLives(1);
				self.observer.HUD.addMoney(-skill.cost);
				
				self.tech.text = qc.lc_format('shop_item_ship_tech', {
						ships: skill.value,
						cost: skill.cost
					});					
			}
		break;
		
		case 'itm_teleport':
			skill = skills.teleport;
			bought = skill.up(self.observer.HUD._money);
			if (bought)
			{
				self.tech.text = qc.lc_format('shop_item_teleport_tech', {
					level:	skill.level,
					sec:	skill.lget(),
					nsec:	skill.nget(),
					cost:	skill.cost
				});
				
				self.observer.HUD.addMoney(-skill.cost);
				if (skill.level === 1 ) self.ship.addScript('qc.engine.Buf_Teleport');
			}
		break;
		
		case 'itm_firerate':
			skill = skills.firerate;
			bought = skill.up(self.observer.HUD._money);
			if (bought)
			{
				self.tech.text = qc.lc_format('shop_item_firerate_tech', {
					level:	skill.level,
					rate:	skill.lget(),
					nrate:	skill.nget(),
					cost:	skill.cost
				});
				
				self.observer.HUD.addMoney(-skill.cost);
				if (skill.level === 1 )
					self.ship.addScript('qc.engine.Buf_Firerate');
                else
					self.ship.Buf_Firerate.advance(-100); // reset skill
			}
		break;	
		
		case 'itm_cloaker':
			skill = skills.cloaker;
			bought = skill.up(self.observer.HUD._money);
			if (bought)
			{
				self.tech.text = qc.lc_format('shop_item_cloaker_tech', {
					level:	skill.level,
					chance:	skill.lget(),
					nchance: skill.nget(),
					cost:	skill.cost
				});
				
				self.observer.HUD.addMoney(-skill.cost);
			}
		break;

		case 'itm_resonator':
			skill = skills.resonator;
			bought = skill.up(self.observer.HUD._money);
			if (bought)
			{
				self.tech.text = qc.lc_format('shop_item_resonator_tech', {
					level:	skill.level,
					wavecount:	skill.lget(),
					nwavecount: skill.nget(),
					cost:	skill.cost
				});

				self.observer.HUD.addMoney(-skill.cost);
				if (skill.level === 1 )
					self.ship.addScript('qc.engine.Buf_Resonator');
			}
		break;

	}
	
	if (bought)
	{
		if (skill.cost > self.observer.HUD._money)
		{
			self.score.color = new qc.Color('#FF0000');
		}
		if (!self.game.storage.get('mutesound')) self.sndOK.play()
	}
	else
	{
		if (!self.game.storage.get('mutesound')) self.sndFail.play()
	}
	
};
