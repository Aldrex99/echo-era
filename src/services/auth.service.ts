import User from "../models/User.model";
import { IUserCreation } from "../types/user.type";
import { checkPassword, hashPassword } from "../utils/password.util";
import { personalUser } from "../utils/formatUser.util";
import { AppError } from "../utils/error.util";

export const emailExists = async (email: string) => {
  return User.find({email: email});
}

export const usernameExists = async (username: string) => {
  return User.find({username: username});
}

export const createUser = async (data: IUserCreation) => {
  const newUser = new User(data);

  newUser.save().then((user) => {
    return user;
  }).catch((error) => {
    throw error;
  });
}

export const verifyEmail = async (verificationCode: string) => {
  const user = await User.find({verificationCode: verificationCode})

  if (user) {
    await User.findOneAndUpdate({verificationCode: verificationCode}, {isVerified: true, verificationCode: null});
    return true;
  } else {
    return false;
  }
}

export const login = async (email: string, password: string) => {
  const user = await User.find({email: email});

  if (!user) {
    throw new AppError("L'email ou le mot de passe est incorrect", 401);
  }
  // Check password
  const isMatch = await checkPassword(password, user[0].password);
  if (!isMatch) {
    throw new AppError("L'email ou le mot de passe est incorrect", 401);
  }
  // Format user and return it
  return personalUser(user[0]);
}

export const logout = async (userId: string) => {
  const logoutUser = await User.findOneAndUpdate({_id: userId}, {lastLogout: new Date()});

  if (!logoutUser) {
    throw new AppError("Une erreur est survenue lors de la déconnexion", 500);
  }
}

export const forgotPassword = async (email: string, passwordResetCode: string) => {
  const user = await User.findOneAndUpdate({email: email}, {
    isPasswordReset: true,
    passwordResetCode: passwordResetCode,
    passwordResetCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  if (!user) {
    throw new AppError("Une erreur est survenue", 500);
  }
}

export const resetPassword = async (passwordResetCode: string, password: string) => {
  const user = await User.findOne({passwordResetCode: passwordResetCode});

  if (!user) {
    throw new AppError("Une erreur est survenue lors de la réinitialisation du mot de passe", 500);
  }

  const isMatch = await checkPassword(password, user.password);
  if (isMatch) {
    throw new AppError("Le nouveau mot de passe doit être différent de l'ancien", 401);
  }

  if (user.passwordResetCodeExpiresAt < new Date()) {
    throw new AppError("Le code de réinitialisation du mot de passe a expiré", 401);
  }

  await User.findOneAndUpdate({passwordResetCode: passwordResetCode}, {
    password: await hashPassword(password),
    isPasswordReset: false,
    passwordResetCode: null,
    passwordResetCodeExpiresAt: null,
  });
}

export const iatBeforeLastLogout = async (userId: string, iat: number) => {
  const user = await User.findOne({_id: userId});
  if (!user) {
    throw new AppError("Une erreur est survenue lors de la vérification de votre compte", 500);
  }

  const lastLogout = user.lastLogout;
  if (!lastLogout) {
    return true;
  }

  const lastLogoutTimestamp = lastLogout.getTime() / 1000;
  return lastLogoutTimestamp <= iat;
}