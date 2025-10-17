import mongoose, { Schema, Document  } from 'mongoose';
import { TrackingStatus } from '../../domain/entities/Tracking';

const AutoIncrement = require('mongoose-sequence')(mongoose);

export interface ITrackingMongo extends Document {
  trackingNumber: string;
  orderNumber: string;
  userId: string;
  userEmail?: string;
  currentStatus: TrackingStatus;
  statusHistory: Array<{ status: TrackingStatus; timestamp: Date }>;
  notifications: Array<{ type: string; message: string; timestamp: Date; sent: boolean; retries: number }>;
  trackingSeq: number;
  trackingDate: string;
}

const TrackingSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  trackingNumber: { type: String, required: false, unique: true },
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userEmail: { type: String, required: false },
  currentStatus: { type: String, enum: Object.values(TrackingStatus), required: true },
  statusHistory: [
    {
      status: { type: String, enum: Object.values(TrackingStatus), required: true },
      timestamp: { type: Date, required: true },
      changedBy: { type: String, required: false }
    }
  ],
  notifications: [
    {
      type: { type: String },
      message: { type: String },
      timestamp: { type: Date },
      sent: { type: Boolean },
      retries: { type: Number }
    }
  ],
  trackingSeq: { type: Number },
  trackingDate: { type: String, required: true }
});

TrackingSchema.plugin(AutoIncrement, {
  inc_field: 'trackingSeq',
  reference_fields: ['trackingDate'],
  id: '_id'
});

export default mongoose.model<ITrackingMongo>('Tracking', TrackingSchema);
