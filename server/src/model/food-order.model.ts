import { Schema, model } from 'mongoose';

const FoodOrderItem = new Schema({
  food: {
    type: Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const FoodSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  foodOrderItem: {
    type: [FoodOrderItem],
    required: true,
  },
  address:String,
  totalPrice: {
    type: Number,
    required: true,
    },
    status: {
    type: String,
    enum: ['pending', 'delivered', 'cancelled'],
    default: 'pending',
    },

}, 
{ 
    timestamps: true 
}
);

export const FoodOrderModel = model('FoodOrder', FoodSchema);