// define a user behaviour
var Btn_OptionsClose = qc.defineBehaviour('qc.engine.Btn_OptionsClose', qc.Behaviour, function() {
}, {
    win: qc.Serializer.NODE,
    mutesound: qc.Serializer.NODE,
    disdrag: qc.Serializer.NODE,
    ctrl_grp: qc.Serializer.NODE
});


Btn_OptionsClose.prototype.onUp = function() {
    this.win.visible = false;

    var control_type = this.ctrl_grp.ToggleGroup.toggle.name == 'tgl_mouse' ? 'mouse' : 'wasd';

    this.game.storage.set('mutesound', this.mutesound.on);
    this.game.storage.set('disabledrag', this.disdrag.on);
    this.game.storage.set('control_type', control_type);
    this.game.storage.save();

};
