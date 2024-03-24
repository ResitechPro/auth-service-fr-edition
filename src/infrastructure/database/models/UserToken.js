import { Schema, model } from "mongoose";

const userTokenSchema = new Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userTokenSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

userTokenSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 2592000 });

const UserToken = model("UserToken", userTokenSchema);

export default UserToken;
