// define a user behaviour
var Btn_options = qc.defineBehaviour('qc.engine.Btn_options', qc.Behaviour, function() {
}, {
    win: qc.Serializer.NODE,
    mutesound: qc.Serializer.NODE,
    seamless: qc.Serializer.NODE,
    drag: qc.Serializer.NODE,
    ctrl_grp: qc.Serializer.NODE,
    ctrl_mouse:  qc.Serializer.NODE,
    ctrl_wasd:  qc.Serializer.NODE
});

Btn_options.prototype.onUp = function() {
    this.win.visible = true;

    this.mutesound.on = this.game.storage.get('mutesound') || false;
    this.seamless.on = this.game.storage.get('seamless') || false;
    this.drag.value = this.game.storage.get('drag') || 0;

    var control_type = this.game.storage.get('control_type') || 'mouse';
    var grp = this.ctrl_grp.ToggleGroup;
    if (control_type == 'mouse') grp.toggle = this.ctrl_mouse;
    else grp.toggle = this.ctrl_wasd;

};
