import StatusCodes from "http-status-codes";
import { Request, Response } from "express";

import UserDao from "@daos/User/UserDao.mock";
import { paramMissingError } from "@shared/constants";
import { Repository } from "typeorm";
import { User } from "@entities/User";

const { BAD_REQUEST, CREATED, OK } = StatusCodes;

export default (usrRep: Repository<User>) => {
  const userDao = new UserDao(usrRep);

  return {
    /**
     * Get all users.
     *
     * @param req
     * @param res
     * @returns
     */
    getAllUsers: async function (req: Request, res: Response) {
      const users = await userDao.getAll();
      return res.status(OK).json({ users });
    },

    /**
     * Add one user.
     *
     * @param req
     * @param res
     * @returns
     */
    addOneUser: async function (req: Request, res: Response) {
      const { user } = req.body;
      if (!user) {
        return res.status(BAD_REQUEST).json({
          error: paramMissingError,
        });
      }
      await userDao.add(user);
      return res.status(CREATED).end();
    },

    /**
     * Update one user.
     *
     * @param req
     * @param res
     * @returns
     */
    updateOneUser: async function (req: Request, res: Response) {
      const { user } = req.body;
      if (!user) {
        return res.status(BAD_REQUEST).json({
          error: paramMissingError,
        });
      }
      user.id = Number(user.id);
      await userDao.update(user);
      return res.status(OK).end();
    },

    /**
     * Delete one user.
     *
     * @param req
     * @param res
     * @returns
     */
    deleteOneUser: async function (req: Request, res: Response) {
      const { id } = req.params;
      await userDao.delete(Number(id));
      return res.status(OK).end();
    },
  };
};
