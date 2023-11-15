
import mongoose from 'mongoose';

const RepairSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Repair = mongoose.model('Repair', RepairSchema);

export default Repair;