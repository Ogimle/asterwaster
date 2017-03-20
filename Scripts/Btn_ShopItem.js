// define a user behaviour
var Btn_ShopItem = qc.defineBehaviour('qc.engine.Btn_ShopItem', qc.Behaviour, function() {
	/*this.observer = this.game.world._findByName('observer');
	var root = this.game.world._findByName('root');
	this.ship = root._findByName('ship');
	this.shop = root._findByName('win_shop');
	this.score = root._findByName('score');
	this.desc = this.shop._findByName('desc')._findByName('desc_text');
	this.tech = this.shop._findByName('tech')._findByName('tech_text');*/
}, {
	observer: qc.Serializer.NODE,
	ship: qc.Serializer.NODE,
	shop: qc.Serializer.NODE,
	score: qc.Serializer.NODE,
	desc: qc.Serializer.NODE,
	tech: qc.Serializer.NODE
});

// Called when the script instance is being loaded.
Btn_ShopItem.prototype.awake = function() {
	this.gameObject.onUp.removeAll();
	this.gameObject.onDown.removeAll();
};

// Called every frame, if the behaviour is enabled.
//Btn_ShopItem.prototype.update = function() {
//
//};

Btn_ShopItem.prototype.resetButtons = function() {
	var self = this;
	
	for(var i=0, imax=self.shop.children.length; i<imax; i++)
	{
		if (self.shop.children[i].name.indexOf('itm_') === 0)
			self.shop.children[i].state = qc.UIState.NORMAL;
	}
	
	self.desc.text = '>';
	self.tech.text = '>';
	self.shop.current_item = '';	
	self.score.color = new qc.Color('#B8BCE0');
}

Btn_ShopItem.prototype.onUp = function() {
	var self = this, tpl, skill, cost;
	var skills = self.ship.ShipCtr.skills; 

	//reset all
	for(var i=0, imax=self.shop.children.length; i<imax; i++)
	{
		if (self.shop.children[i].name.indexOf('itm_') === 0)
			self.shop.children[i].state = qc.UIState.NORMAL;
	}
	
	if (self.gameObject.state === qc.UIState.PRESSED) {
		self.gameObject.state = qc.UIState.NORMAL;
		self.desc.text = '>';
		self.tech.text = '>';
		self.shop.current_item = '';
		return;
	}
	
	self.gameObject.state = qc.UIState.PRESSED;
	
	self.shop.current_item = self.name;
	
	switch ( self.name )
	{
		case 'itm_ship':
			skill = skills.life;
			cost = skill.cost;
			self.desc.text = qc.lc_get('shop_item_ship_desc');
			self.tech.text = qc.lc_format('shop_item_ship_tech', {
					ships: self.observer.HUD._lives,
					cost: cost
				});
		break;
		
		case 'itm_teleport':
			self.desc.text = qc.lc_get('shop_item_teleport_desc');
			
			skill = skills.teleport;
			cost = skill.cost;
			self.tech.text = qc.lc_format('shop_item_teleport_tech', {
					level:	skill.level,
					sec:	skill.lget(),
					nsec:	skill.nget(),
					cost:	cost
				});
		break;
		
		case 'itm_firerate':
			skill = skills.firerate;

			self.desc.text = qc.lc_format('shop_item_firerate_desc', {
                time:skill.base_timeout/1000,
                step:20
            });
			
			cost = skill.cost;
			self.tech.text = qc.lc_format('shop_item_firerate_tech', {
					level:	skill.level,
					rate:	skill.lget(),
					nrate:	skill.nget(),
					cost:	cost
				});
		break;

		case 'itm_cloaker':
			self.desc.text = qc.lc_get('shop_item_cloaker_desc');

			skill = skills.cloaker;
			cost = skill.cost;
			self.tech.text = qc.lc_format('shop_item_cloaker_tech', {
					level:	skill.level,
					chance:	skill.lget(),
					nchance: skill.nget(),
					cost:	cost
				});
		break;

		case 'itm_resonator':
			self.desc.text = qc.lc_get('shop_item_resonator_desc');

			skill = skills.resonator;
			cost = skill.cost;
			self.tech.text = qc.lc_format('shop_item_resonator_tech', {
				level:	skill.level,
				wavecount:	skill.lget(),
				nwavecount: skill.nget(),
				cost:	cost
			});
			break;

	}
	
};
