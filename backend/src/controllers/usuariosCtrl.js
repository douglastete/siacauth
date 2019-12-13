const userModel = require('../models/usuarios');

class UsuarioController {
  async store(req, res) {
    try {
      const user = new userModel(req.tokenData);
      const userCreated = await user.save();
      return res.status(201).json({ success: true, data: userCreated });
    } catch (error) {
      return res.status(401).json({ success: false, errorCode: error.code, message: error.message });
    }
  }

  async getAll(req, res) {
    const { page = 1, limit = 5, email } = req.query;

    const response = email ? await userModel.find({ email }) : await userModel.paginate({}, { page, limit });
    return res.status(200).json({ response });
  }

  async getById(req, res) {
    const response = await userModel.findById(req.params.id);
    return res.status(200).json({ success: true, data: response });
  }

  async getByEmail(email) {
    return await userModel.findOne({ email }).exec();
  }

  async update(req, res) {
    const id = req.params.id;
    let user = new userModel(req.body);
    user = user.toObject();

    delete user._id;

    try {
      const response = await userModel.findByIdAndUpdate(id, user, { new: true });

      return res.status(201).json({ success: true, data: response });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateEmail(req, res) {
    console.log(req.body);
    let user = new userModel(req.body);
    user = user.toObject();

    const userBD = await userModel.findOne({ email: user.email }).exec();

    if (!userBD) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado!' });
    }

    delete user._id;

    try {
      const response = await userModel.findByIdAndUpdate(userBD._id, user, { new: true, useFindAndModify: true });

      return res.status(201).json({ success: true, data: response });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    const response = await userModel.findByIdAndDelete(id);

    return res.status(204).json({ success: true });
  }
}

module.exports = new UsuarioController();
