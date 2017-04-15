var Bonus = qc.defineBehaviour('qc.engine.Bonus', qc.Behaviour, function() {
    this._timeout_max = 25000;
    this._timeout = 0;
    this._blink_speed = 0;
    this._blink_speed_step = (1/this._timeout_max)*8;
    this._ang = 0;
}, {
});

Bonus.prototype.init = function()
{
    var self = this;
    self.gameObject.visible = true;
    self._timeout = self.game.time.now + self._timeout_max;
    self._ang = Math.random() * 360;
};

Bonus.prototype.update = function()
{
    var self = this,
        go = self.gameObject,
        now = self.game.time.now;


    if (now < self._timeout)
    {
        if (self._timeout - now < 5000)
        {
            var new_speed = Math.abs(self._blink_speed) + self._blink_speed_step;
            self._blink_speed = self._blink_speed < 0 ? -new_speed : new_speed;

            go.alpha += self._blink_speed;

            if (go.alpha < 0) {
                go.alpha = 0;
                self._blink_speed = -self._blink_speed;
            }
            else if (go.alpha > 1) {
                go.alpha = 1;
                self._blink_speed = -self._blink_speed;
            }
        }

    }
    else
    {
        go.visible = false;
    }

    var deltaMs = self.game.time.deltaTime / 1000;
    self._ang += deltaMs;
    go.Asteroid._dir.x = Math.cos(self._ang);
    go.Asteroid._dir.y = Math.sin(self._ang);

};
