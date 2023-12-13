import User from "../models/User.model";
import { AppError } from "../utils/error.util";

export const getAllUsers = async () => {
  return User.find();
}

export const getUserById = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  return user;
}