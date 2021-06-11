import { Router } from "express";
import { adminMW, userMW } from "./middleware";
import authR from "./Auth";
import usrR from "./Users";
import mascR from "./Mascotas";
import { Repository } from "typeorm";
import { User } from "@entities/User";
import { Mascota } from "@entities/Mascota";
// { getAllUsers, addOneUser, updateOneUser, deleteOneUser }

export default (usrRep: Repository<User>, mscRep: Repository<Mascota>) => {
  const { getAllUsers, addOneUser, updateOneUser, deleteOneUser } =
    usrR(usrRep);
  const { getAllPets, getOnePet, addOnePet, updateOnePet, deleteOnePet } =
    mascR(mscRep);
  const { login, logout, signup } = authR(usrRep);

  // Auth router
  const authRouter = Router();
  authRouter.post("/login", login);
  authRouter.post("/signup", signup);
  authRouter.get("/logout", logout);

  // User-router
  const userRouter = Router();
  userRouter.get("/all", getAllUsers);
  userRouter.post("/add", addOneUser);
  userRouter.put("/update", updateOneUser);
  userRouter.delete("/delete/:id", deleteOneUser);

  // mascota-router
  const mascotaRouter = Router();
  mascotaRouter.get("/all", getAllPets);
  mascotaRouter.get("/:id", getOnePet);
  mascotaRouter.post("/add", addOnePet);
  mascotaRouter.put("/update", updateOnePet);
  mascotaRouter.delete("/delete/:id", deleteOnePet);

  // Export the base-router
  const baseRouter = Router();
  baseRouter.use("/auth", authRouter);
  baseRouter.use("/users", adminMW, userRouter);
  baseRouter.use("/pets", userMW, mascotaRouter);

  return baseRouter;
};
