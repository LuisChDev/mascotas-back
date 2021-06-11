import { ObjectId } from "mongodb";
import { Entity, Column, ObjectIdColumn } from "typeorm";

export enum UserRoles {
  Standard,
  Admin,
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  pwdHash: string;
  role: UserRoles;
}

@Entity()
export class User implements IUser {
  @ObjectIdColumn()
  public id!: string;
  @Column()
  public name: string;
  @Column()
  public email: string;
  @Column()
  public role: UserRoles;
  @Column()
  public pwdHash: string;

  constructor(
    nameOrUser?: string | IUser,
    email?: string,
    role?: UserRoles,
    pwdHash?: string,
  ) {
    if (typeof nameOrUser === "string" || typeof nameOrUser === "undefined") {
      this.name = nameOrUser || "";
      this.email = email || "";
      this.role = role || UserRoles.Standard;
      this.pwdHash = pwdHash || "";
    } else {
      this.name = nameOrUser.name;
      this.email = nameOrUser.email;
      this.role = nameOrUser.role;
      this.pwdHash = nameOrUser.pwdHash;
    }
  }
}
