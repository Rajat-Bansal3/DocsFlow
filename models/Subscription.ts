import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User model
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true }, // Link to Plan model
  startDate: { type: Date, default: Date.now }, // Subscription start date
  endDate: { type: Date }, // Subscription end date, null if active
  status: {
    type: String,
    enum: ["active", "cancelled", "expired"],
    default: "active",
  },
});

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
