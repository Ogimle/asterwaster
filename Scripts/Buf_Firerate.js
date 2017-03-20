// define a user behaviour
var Buf_Firerate = qc.defineBehaviour('qc.engine.Buf_Firerate', qc.Behaviour, function() {
	this._timeout = 0;
	
	this.icon = this.game.world._findByName('root')._findByName('icon_firerate');
	this.counter = this.icon._findByName('counter');

}, {
    // fields need to be serialized
});

// Called when the script instance is being loaded.
Buf_Firerate.prototype.awake = function()
{
	this.skill = this.gameObject.ShipCtr.skills.firerate;
	this.icon.visible = true;
    this.icon.alpha = 0.5;
	this.counter.text = "0";
};

Buf_Firerate.prototype.advance = function(level)
{
    var points = this.skill.points += level;

    if (points>this.skill.level) points = this.skill.level;
    else if (points<0)
    {
        points = 0;
        this.icon.alpha = 0.5;
    }
    else
    {
        this.icon.alpha = 1;
        this.skill.timeout = this.skill.base_timeout;
    }

	this.counter.text = points + '/' +this.skill.level;
    this.skill.points = points;
    console.log(this.skill.points);
};

Buf_Firerate.prototype.remove = function()
{
    this.icon.visible = false;
    this.gameObject.ShipCtr.skills.firerate.reset();
    this.gameObject.removeScript(this);
};

Buf_Firerate.prototype.update = function()
{
    if (this.skill.points > 0)
    {
        this.skill.timeout -= this.game.time.deltaTime;
        //shake icon
        if (this.skill.timeout<0) this.advance(-1);
    }
};