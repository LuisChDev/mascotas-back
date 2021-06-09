import { IUser, User } from "@entities/User";
import { Repository } from "typeorm";

export interface IUserDao {
  getOne: (email: string) => Promise<IUser | null>;
  getAll: () => Promise<IUser[]>;
  add: (user: IUser) => Promise<void>;
  update: (user: IUser) => Promise<void>;
  delete: (id: number) => Promise<void>;
}

class UserDao implements IUserDao {
  repo: Repository<User>;

  constructor(usrRep: Repository<User>) {
    this.repo = usrRep;
  }

  /**
   * @param email
   */
  public async getOne(email: string): Promise<IUser | null> {
    const result = await this.repo.findOne({ email: email });
    if (result) {
      return result;
    } else {
      return null;
    }
  }

  /**
   *
   */
  public async getAll(): Promise<IUser[]> {
    const result = await this.repo.find();
    return result;
  }

  /**
   *
   * @param user
   */
  public async add(user: IUser): Promise<void> {
    this.repo.insert(user);
    // return Promise.resolve(undefined);
  }

  /**
   *
   * @param user
   */
  public async update(user: IUser): Promise<void> {
    // TODO
    this.repo.save(user);
    // return Promise.resolve(undefined);
  }

  /**
   *
   * @param id
   */
  public async delete(id: number): Promise<void> {
    // TODO
    this.repo.delete(id);
    // return Promise.resolve(undefined);
  }
}

export default UserDao;
