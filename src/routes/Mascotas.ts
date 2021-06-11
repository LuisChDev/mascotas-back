import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { Repository } from "typeorm";

import MascotaDao from "@daos/Mascota/MascotaDao";
import { Mascota } from "@entities/Mascota";
import { paramMissingError } from "@shared/constants";

const { BAD_REQUEST, OK, CREATED } = StatusCodes;

export default (mscRep: Repository<Mascota>) => {
  const mascDao = new MascotaDao(mscRep);

  return {
    getAllPets: async function (req: Request, res: Response) {
      const pets = await mascDao.getAll();
      return res.status(OK).json({ pets });
    },

    getOnePet: async function (req: Request, res: Response) {
      const { id } = req.params;
      const pet = await mascDao.getOne(id);
      if (!pet) {
        return res.status(BAD_REQUEST).json({ error: "id not found" });
      } else {
        return res.status(OK).json({pet});
      }
    },

    addOnePet: async function (req: Request, res: Response) {
      const { pet } = req.body;

      if (!pet) {
        return res.status(BAD_REQUEST).json({
          error: paramMissingError,
        });
      }

      await mascDao.add(pet);
      return res.status(CREATED).end();
    },

    updateOnePet: async function (req: Request, res: Response) {
      const { pet } = req.body;

      if (!pet) {
        return res.status(BAD_REQUEST).json({
          error: paramMissingError,
        });
      }

      pet.id = pet.id;
      await mascDao.update(pet);
      return res.status(OK).end();
    },

    deleteOnePet: async function (req: Request, res: Response) {
      const { id } = req.params;
      await mascDao.delete(id);
      return res.status(OK).end();
    },
  };
};
