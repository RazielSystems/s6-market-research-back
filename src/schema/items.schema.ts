import paginate from 'mongoose-paginate-v2';
import mongooseService from '../services/mongoose.service';
import mongoose, { Schema } from 'mongoose';
import IItem from '../interfaces/item.interface';

let mongoo = mongooseService.getMongoose();

const ItemSchema: Schema<IItem> = new mongoo.Schema({
  id: String,
  ocid: String,
  s6_id: { type: String, ref: 'sistema6' }
});

ItemSchema.set('toJSON', {
  virtuals: true
});

export const ItemModel = mongoose.model<IItem>('data_items', ItemSchema);
