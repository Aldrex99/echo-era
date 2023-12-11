import { NextFunction, Response } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../utils/tokens.util";
import { IRequestUser } from "../types/user.type";
import { iatBeforeLastLogout } from "../services/auth.service";

export const checkAccessToken = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const rawAccessToken = req.headers["authorization"];
  if (!rawAccessToken) {
    return res.status(401).json({
      code: 401,
      message: "Vous n'êtes pas autorisé à accéder à cette ressource",
    });
  }
  const accessToken = rawAccessToken.split(" ")[1];

  try {
    const rawUser = await verifyAccessToken(accessToken);

    if (typeof rawUser === "string") {
      return res.status(403).json({
        code: 403,
        message: "Votre token n'est pas valide",
      });
    }

    const iatBeforeLogout = await iatBeforeLastLogout(rawUser.userId, rawUser.iat);

    if (!iatBeforeLogout) {
      return res.status(403).json({
        code: 403,
        message: "Votre token n'est pas valide",
      });
    }

    req.user = {
      id: rawUser.userId,
      role: rawUser.userRole,
      iat: rawUser.iat,
      exp: rawUser.exp,
    };

    next();
  } catch (err) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({
          code: 432,
          message: "accessToken expiré",
        });
      }

      return res.status(403).json({
        code: 403,
        message: "Votre token n'est pas valide",
      });
    }
  }
}

export const checkRefreshToken = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const rawRefreshToken = req.headers["authorization"];
  if (!rawRefreshToken) {
    return res.status(401).json({
      code: 401,
      message: "Vous n'êtes pas autorisé à accéder à cette ressource",
    });
  }
  const refreshToken = rawRefreshToken.split(" ")[1];

  try {
    const rawUser = await verifyRefreshToken(refreshToken);

    if (typeof rawUser === "string") {
      return res.status(403).json({
        code: 403,
        message: "Votre token n'est pas valide",
      });
    }

    req.user = {
      id: rawUser.userId,
      role: rawUser.userRole,
      iat: rawUser.iat,
      exp: rawUser.exp,
    };

    next();
  } catch (err) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({
          code: 432,
          message: "refreshToken expiré",
        });
      }

      return res.status(403).json({
        code: 403,
        message: "Votre token n'est pas valide",
      });
    }
  }
}