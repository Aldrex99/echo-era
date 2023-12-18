import { NextFunction, Request, Response } from 'express'
import { validationResult } from "express-validator";
import * as authService from "../services/auth.service";
import { hashPassword } from "../utils/password.util";
import { IRequestUser, IUserCreation } from "../types/user.type";
import * as mail from "../utils/mailer.util";
import * as token from "../utils/tokens.util";
import uuidGenerate from "../utils/uuid.util";
import { validationErrorsUtil } from "../utils/validationErrors.util";
import { classicFailOrErrorResponse } from "../utils/error.util";

// Register a new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  const {username, email, password} = req.body;

  try {
    // Check if email exists
    const emailExists = await authService.emailExists(email);
    if (emailExists.length > 0) {
      classicFailOrErrorResponse("L'email est déjà utilisé", 400, res);
    }

    // Check if username exists
    const usernameExists = await authService.usernameExists(username);
    if (usernameExists.length > 0) {
      classicFailOrErrorResponse("Le nom d'utilisateur est déjà utilisé", 400, res);
    }

    const data: IUserCreation = {
      username: username,
      email: email,
      password: await hashPassword(password),
      verificationCode: uuidGenerate(),
    };

    // Create user
    const user = await authService.createUser(data);

    // Send email verification
    await mail.sendMails(email, "Vérification d'email", `<p>Veuillez cliquer sur le lien suivant pour vérifier votre email : <a href="${process.env.CLIENT_URL}/verify-email/${data.verificationCode}" target="_blank">Lien</a></p>`);

    return res.status(201).json({
      message: "Utilisateur créé",
      user: user,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Verify user email
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const {verificationCode} = req.body;

  try {
    // Verify user
    const userVerify = await authService.verifyEmail(verificationCode);

    if (!userVerify) {
      classicFailOrErrorResponse("Code de vérification invalide", 400, res);
    }

    return res.status(200).json({
      message: "Utilisateur vérifié",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Login a user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    // Get email and password
    const {email, password} = req.body;

    // Login user
    const user = await authService.login(email, password);

    const accessToken = token.generateAccessToken(user.id, user.role);
    const refreshToken = token.generateRefreshToken(user.id);

    return res.status(200).json({
      message: "Utilisateur connecté",
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Logout a user
export const logout = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    // Logout user
    await authService.logout(req.user.id);

    return res.status(200).json({
      message: "Utilisateur déconnecté",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Forgot password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  const {email} = req.body;

  try {
    // Check if email exists
    const user = await authService.emailExists(email);
    if (!user) {
      classicFailOrErrorResponse("L'email n'existe pas", 400, res);
    }

    // Generate passwordResetCode
    const passwordResetCode = uuidGenerate();

    // Update user with passwordResetCode and expiration date of 10 minutes
    await authService.forgotPassword(email, passwordResetCode);

    // Send email reset password
    await mail.sendMails(email, "Réinitialisation de mot de passe", `<p>Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : <a href="${process.env.CLIENT_URL}/reset-password/${passwordResetCode}" target="_blank">Lien</a></p>`);

    return res.status(200).json({
      message: "Email de réinitialisation de mot de passe envoyé",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  const {passwordResetCode, password} = req.body;

  try {
    // Check if reset token is valid
    await authService.resetPassword(passwordResetCode, password);

    return res.status(200).json({
      message: "Mot de passe réinitialisé",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}