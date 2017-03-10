// define a user behaviour
var Btn_ShopClose = qc.defineBehaviour('qc.engine.Btn_ShopClose', qc.Behaviour, function() {
}, {
    observer: qc.Serializer.NODE,
    shop: qc.Serializer.NODE
});

Btn_ShopClose.prototype.onUp = function() {
    this.shop.visible = false;
    this.observer.HUD.isPause = false;
};

