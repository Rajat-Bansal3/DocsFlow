import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true, unique: true }, // Link to Clerk's user management
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" }, // Link to Subscription model
  createdDocuments: { type: Number, default: 0 }, // Number of documents user has created
  downloadedDocuments: { type: Number, default: 0 }, // Number of documents user has downloaded
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
