import User from "../models/User.model";

export const getAllUsers = async () => {
  return User.find();
}