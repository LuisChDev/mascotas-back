import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { Repository } from "typeorm";

import MascotaDao from "@daos/Mascota/MascotaDao";
import { Mascota } from "@entities/Mascota";
import { paramMissingError } from "@shared/constants";

const { INTERNAL_SERVER_ERROR, BAD_REQUEST, OK, CREATED } = StatusCodes;

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
      let { pet } = req.body;

      if (!pet) {
        return res.status(BAD_REQUEST).json({
          error: paramMissingError,
        });
      }

      // saves the image locally and stores the URL in the database
      const photo = req.files?.petPic;
      if (!photo) {
        return res.status(BAD_REQUEST).json({
          error: "No se subió foto. intente de nuevo",
        });
      } else if (photo && photo instanceof Array) {
        return res.status(BAD_REQUEST).json({
          error: "De algún modo se subieron múltiples fotos de perfil. intente de nuevo"
        });
      } else if (photo) {
        try {
          console.log(photo);
          await photo.mv(`${__dirname}/../public/${photo.name}`);
          const newpet = {
            ...JSON.parse(pet as unknown as string),
            // typescript lo coge como objeto pero es una cadena (ノಠ益ಠ)ノ彡┻━┻
            photo: `/${photo.name}`,
          };
          console.log(newpet);
          await mascDao.add(newpet);
          return res.status(CREATED).end();
        } catch (error) {
          console.log("hubo un error al guardar el archivo: ", error);
          return res.status(INTERNAL_SERVER_ERROR).json({
            error: "hubo un error al guardar la foto. Intente de nuevo"
          });
        }
      }
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
