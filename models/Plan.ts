import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // Price in INR
  documentLimit: { type: Number, required: true }, // Maximum number of documents user can create
  downloadLimit: { type: Number, required: true }, // Maximum number of documents user can download
  features: [{ type: String }], // Array of features for this plan
  billingCycle: {
    type: String,
    enum: ["monthly", "yearly"],
    default: "monthly",
  },
});

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
