import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";

// import UserDao from "@daos/User/UserDao.mock";
import UserDao from "@daos/User/UserDao";
import { JwtService } from "@shared/JwtService";
import {
  paramMissingError,
  loginFailedErr,
  cookieProps,
} from "@shared/constants";
import { Repository } from "typeorm";
import { User } from "@entities/User";

const jwtService = new JwtService();
const { BAD_REQUEST, OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = StatusCodes;

export default (usrRep: Repository<User>) => {
  const userDao = new UserDao(usrRep);

  return {
    /**
     * Login in a user.
     *
     * @param req
     * @param res
     * @returns
     */
    login: async function (req: Request, res: Response) {
      // Check email and password present
      const { email, password } = req.body;
      console.log("email: ", email, ", pwd: ", password);
      if (!(email && password)) {
        return res.status(BAD_REQUEST).json({
          error: paramMissingError,
        });
      }
      // Fetch user
      const user = await userDao.getOne(email);
      if (!user) {
        return res.status(UNAUTHORIZED).json({
          error: loginFailedErr,
        });
      }
      // Check password
      const pwdPassed = await bcrypt.compare(password, user.pwdHash);
      if (!pwdPassed) {
        return res.status(UNAUTHORIZED).json({
          error: loginFailedErr,
        });
      }
      // Setup Admin Cookie
      const jwt = await jwtService.getJwt({
        id: user.id,
        role: user.role,
      });
      const { key, options } = cookieProps;
      res.cookie(key, jwt, options);
      // Return
      return res.status(OK).end();
    },

    /**
     * Logout the user.
     *
     * @param req
     * @param res
     * @returns
     */
    logout: async function (req: Request, res: Response) {
      const { key, options } = cookieProps;
      res.clearCookie(key, options);
      return res.status(OK).end();
    },

    /**
     * Registers the user.
     *
     * It is expected that "pwdHash" contains the actual password
     * for this request.
     */
    signup: async function (req: Request, res: Response) {
      try {
        const { user } = req.body;
        const usr = await userDao.getOne(user.email);

        if (usr) {
          return res.status(BAD_REQUEST).json({
            error: "Usuario con este correo ya existe"
          })
        }

        const salt = await bcrypt.genSalt(10);
        user.pwdHash = await bcrypt.hash(user.pwdHash, salt);

        // error
        await userDao.add(user);

        res.status(OK).end();
      } catch (e) {
        res.status(INTERNAL_SERVER_ERROR).json({ e });
      }
    }
  };
};
