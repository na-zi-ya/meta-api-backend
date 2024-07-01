import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    facebookId: String,
    name: String,
    photo: String,
    accessToken: String
  });

  const User = mongoose.model('User', UserSchema);

export default User;