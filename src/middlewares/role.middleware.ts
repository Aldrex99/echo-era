import { IRequestUser } from "../types/user.type";
import { Response, NextFunction } from "express";

const checkUserRole = (roles: string[]) => {
  return (req: IRequestUser, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user && roles.includes(user.role)) {
      next();
    } else {
      console.log()
      res.status(401).json({message: 'Unauthorized'});
    }
  }
}

export default checkUserRole;