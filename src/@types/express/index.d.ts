import { IMascota } from "@entities/Mascota";
import { IUser } from "@entities/User";
import { IClientData } from "@shared/JwtService";

declare module "express" {
  export interface Request {
    body: {
      user: IUser;
      pet: IMascota;
      email: string;
      password: string;
    };
  }
}

declare global {
  namespace Express {
    export interface Response {
      sessionUser: IClientData;
    }
  }
}
