import { IRequestUser } from "../types/user.type";
import { NextFunction, Response } from "express";

const checkUserRole = (roles: string[]) => {
  return (req: IRequestUser, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user && roles.includes(user.role)) {
      next();
    } else {
      return res.status(403).json({
        code: 403,
        message: "Vous n'êtes pas autorisé à accéder à cette ressource",
      });
    }
  }
}

export default checkUserRole;