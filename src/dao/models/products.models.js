import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"


mongoose.pluralize(null);

const collection = 'products';

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  code: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: [String] },
  status: { type: Boolean, required: true }
})

schema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection, schema)

export default productModel;