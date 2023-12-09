import { Result, ValidationError } from "express-validator";
import { Response } from "express";

export const validationErrorsUtil = async (errors: Result<ValidationError>, res: Response) => {
  if (!errors.isEmpty()) {
    return res.status(422).json({
      code: 422,
      message: "Les données envoyées sont incorrectes",
      errors: errors.array(),
    });
  }
}