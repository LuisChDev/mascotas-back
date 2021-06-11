import { IMascota, Mascota } from "@entities/Mascota";
import { Repository } from "typeorm";

export interface IMascotaDao {
  getOne: (id: string) => Promise<IMascota | null>;
  getAll: () => Promise<IMascota[]>;
  add: (masc: IMascota) => Promise<void>;
  update: (masc: IMascota) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export default class MascotaDao implements IMascotaDao {
  repo: Repository<Mascota>;

  constructor(mscRep: Repository<Mascota>) {
    this.repo = mscRep;
  }

  async getOne(id: string): Promise<IMascota | null> {
    const result = await this.repo.findOne(id);
    if (result) {
      return result;
    } else {
      return null;
    }
  }

  async getAll(): Promise<IMascota[]> {
    const result = await this.repo.find();
    return result;
  }

  async add(masc: IMascota): Promise<void> {
    await this.repo.insert(masc);
  }

  async update(masc: IMascota): Promise<void> {
    await this.repo.update(masc.id, masc);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
    // return Promise.resolve(undefined);
  }
}
