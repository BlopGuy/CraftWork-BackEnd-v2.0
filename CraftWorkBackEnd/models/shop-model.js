const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
  shopname: {
    type: String,
    trim: true,
    required: [true, 'Shop name is required'],
    unique: true
  },
  productList: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;