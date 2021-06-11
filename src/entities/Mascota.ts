import { Entity, Column, ObjectIdColumn } from "typeorm";

export interface IMascota {
  id: string;
  name: string;
  description: string;
  phone: number;
  age: number | undefined;
  species: string;
  race: string | undefined;
  photo: string | undefined;
}

@Entity()
export class Mascota implements IMascota {
  @ObjectIdColumn()
  public id!: string;
  @Column()
  public name!: string;
  @Column()
  public description!: string;
  @Column()
  public phone!: number;
  @Column()
  public age: number | undefined;
  @Column()
  public species!: string;
  @Column()
  public race: string | undefined;
  @Column()
  public photo: string | undefined;

  constructor (
    nameOrPet?: string | IMascota,
    description?: string,
    phone?: number,
    age?: number,
    species?: string,
    race?: string,
    photo?: string,
  ) {
    if (typeof nameOrPet === "string" ||
      typeof nameOrPet === "undefined") {
      this.name = nameOrPet || '';
      this.description = description || "";
      this.phone = phone || 0;
      this.age = age;
      this.species = species || '';
      this.race = race;
      this.photo = photo;
    } else {
      this.name = nameOrPet.name;
      this.description = nameOrPet.description;
      this.phone = nameOrPet.phone;
      this.age = nameOrPet.age;
      this.species = nameOrPet.species;
      this.race = nameOrPet.race;
      this.photo = nameOrPet.photo;
    }
  }

}

