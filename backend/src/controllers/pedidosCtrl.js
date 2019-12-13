const orderModel = require('../models/pedidos');

class PedidoController {
  async store(req, res) {
    try {
      const order = new orderModel(req.body);
      const orderCreated = await order.save();
      return res.status(201).json({ success: true, data: orderCreated });
    } catch (error) {
      return res.status(401).json({ success: false, errorCode: error.code, message: error.message });
    }
  }

  async getAll(req, res) {
    const { page = 1, limit = 5, empresaid, liberado, cancelado } = req.query;

    let query = {};
    if (empresaid) {
      query.empresaid = empresaid;
    }

    if (liberado) {
      query.liberado = liberado;
    }

    if (cancelado) {
      query.cancelado = cancelado;
    }

    const response = query ? await orderModel.find(query) : await orderModel.paginate({}, { page, limit });
    return res.status(200).json({ response });
  }

  async getById(req, res) {
    const response = await orderModel.findById(req.params.id);
    return res.status(200).json({ success: true, data: response });
  }

  async update(req, res) {
    const id = req.params.id;
    let order = new orderModel(req.body);
    order = order.toObject();

    delete order._id;

    try {
      const response = await orderModel.findByIdAndUpdate(id, order, { new: true });

      return res.status(201).json({ success: true, data: response });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    const response = await orderModel.findByIdAndDelete(id);

    return res.status(204).json({ success: true });
  }
}

module.exports = new PedidoController();
