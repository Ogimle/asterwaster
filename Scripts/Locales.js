var Locales = qc.defineBehaviour('qc.engine.Locales', qc.Behaviour, function() {
}, {
    data: qc.Serializer.EXCELASSET
});

Locales.prototype.awake = function() {
    var self = this;

    qc.lang = this.game.storage.get('lang') || 'en';
    qc.locales.en = {};
    qc.locales.ru = {};

    var lcs = self.data.findSheet('locales');
    lcs.rows.forEach(function(row) {
        qc.locales.en[row.key] = row.en;
        qc.locales.ru[row.key] = row.ru;
    });
    
};
