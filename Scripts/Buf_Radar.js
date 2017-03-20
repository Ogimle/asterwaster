// define a user behaviour
var Buf_Radar = qc.defineBehaviour('qc.engine.Buf_Radar', qc.Behaviour, function() {
    this.skill = this.gameObject.ShipCtr.skills.radar;

    this.ufos = this.game.world._findByName('root')._findByName('ufoRoot');
    this.ship = this.game.world._findByName('root')._findByName('ship');

    this.icon = this.game.world._findByName('root')._findByName('radar');
    this.scan = this.icon._findByName('scan');
    this.r_ship = this.icon._findByName('ship');
    this.r_ufos = [
        this.icon._findByName('ufo1'),
        this.icon._findByName('ufo2'),
        this.icon._findByName('ufo3')
    ];
}, {

});

Buf_Radar.prototype.awake = function() {
    this.icon.visible = true;
    this.icon.alpha = 0;
    this.scan.Animator.play();
    this.icon.TweenAlpha.play();

    this.snd = this.game.add.sound();
    this.snd.destroyWhenStop = false;
    this.snd.audio = this.ship.ShipCtr.sounds[4];
    this.snd.loop = false;
    this.snd.volume = 0.6;

    for (var u_idx=0, umax=this.r_ufos.length; u_idx<umax; ++u_idx) this.r_ufos[u_idx].visible = false;
};

Buf_Radar.prototype.remove = function()
{
    this.icon.visible = false;
    for (var u_idx=0, umax=this.r_ufos.length; u_idx<umax; ++u_idx) this.r_ufos[u_idx].visible = false;
    this.skill.reset();
    this.game.world.removeChild(this.snd);
    this.gameObject.removeScript(this);
};

Buf_Radar.prototype.update = function()
{
    var go, r_go, cnt;

    this.r_ship.x = this.ship.x/8.9;
    this.r_ship.y = this.ship.y/13.5;

    cnt = 0;
    for (var u_idx=0, umax=this.ufos.children.length; u_idx<umax; ++u_idx)
    {
        go = this.ufos.children[u_idx];
        if (go.visible) cnt++;
        r_go = this.r_ufos[u_idx];
        r_go.visible = go.visible;
        r_go.x = go.x/8.9;
        r_go.y = go.y/13.5;
    }

    if ( cnt>0 && !this.snd.isPlaying ) this.snd.play();

};
