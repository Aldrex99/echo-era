import { body } from 'express-validator';

const passwordValidator =
  body('password')
  .isString()
  .withMessage('Le mot de passe doit être une chaîne de caractères.')
  .isLength({min: 8})
  .withMessage('Le mot de passe doit contenir au moins 8 caractères.')
  .matches(/\d/)
  .withMessage('Le mot de passe doit contenir au moins 1 chiffre.')
  .matches(/[a-z]/)
  .withMessage('Le mot de passe doit contenir au moins 1 lettre minuscule.')
  .matches(/[A-Z]/)
  .withMessage('Le mot de passe doit contenir au moins 1 lettre majuscule.')
  .matches(/[!@#$%^&*\-\+]/)
  .withMessage('Le mot de passe doit contenir au moins 1 caractère spécial.')
  .not()
  .matches(/^$|\s/)
  .withMessage('Le mot de passe ne doit pas contenir d\'espace.');


export const register = [
  body('email')
  .isEmail()
  .normalizeEmail({
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
    outlookdotcom_remove_subaddress: false,
    yahoo_remove_subaddress: false,
    icloud_remove_subaddress: false,
  })
  .withMessage('Adresse email invalide.'),
  passwordValidator,
  body('confirmPassword')
  .custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Les deux mots de passe ne correspondent pas.');
    }
    return true;
  }),
  body('username')
  .isString()
  .withMessage('Le nom doit être une chaîne de caractères.')
  .isLength({min: 3})
  .withMessage('Le nom doit contenir au moins 3 caractères.')
  .isLength({max: 20})
  .withMessage('Le nom doit contenir au maximum 20 caractères.')
  .not()
  .matches(/^$|\s/)
  .withMessage('Le nom ne doit pas contenir d\'espace.')
];

export const verifyEmail = [
  body('verificationCode')
  .isString()
  .isUUID(4)
  .withMessage('Le code de vérification doit être une chaîne de caractères.')
  .not()
  .matches(/^$|\s/)
  .withMessage('Le code de vérification ne doit pas contenir d\'espace.')
];

export const login = [
  body('email')
  .isEmail()
  .normalizeEmail({
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
    outlookdotcom_remove_subaddress: false,
    yahoo_remove_subaddress: false,
    icloud_remove_subaddress: false,
  })
  .withMessage('Adresse email invalide.'),
  passwordValidator,
];

export const forgotPassword = [
  body('email')
  .isEmail()
  .normalizeEmail({
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
    outlookdotcom_remove_subaddress: false,
    yahoo_remove_subaddress: false,
    icloud_remove_subaddress: false,
  })
  .withMessage('Adresse email invalide.'),
];

export const resetPassword = [
  body('passwordResetCode')
  .isString()
  .isUUID(4)
  .withMessage('Le token doit être une chaîne de caractères.'),
  passwordValidator,
  body('confirmPassword')
  .custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Les deux mots de passe ne correspondent pas.');
    }
    return true;
  }),
];