const { Schema, model } = require('mongoose');
const mongoose_paginate = require('mongoose-paginate-v2');

const orderModel = new Schema(
  {
    empresaid: { type: String, required: true },
    pedidoid: { type: String, required: true },
    tipomovimento: { type: String, required: true },
    funcionarioid: { type: String, required: true },
    razaosocial: { type: String, required: true },
    dtemissao: { type: String, required: true },
    vlrtotal: { type: String, required: true },
    liberado: { type: Boolean, required: true, default: false },
    emailliberacao: { type: String, required: false },
    dtliberacao: { type: Date, required: false },
    cancelado: { type: Boolean, required: true, default: false },
    emailcancelamento: { type: String, required: false },
    dtcancelamento: { type: Date, required: false },
    motivos: [{ motivo: { type: String, required: true }, nivel: { type: String, required: true } }]
  },
  {
    timestamps: true
  }
);

orderModel.plugin(mongoose_paginate);

module.exports = model('order', orderModel);
