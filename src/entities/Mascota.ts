import { Entity, Column, ObjectIdColumn } from "typeorm";

export interface IMascota {
  id: string;
  name: string;
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
  public age: number | undefined;
  @Column()
  public species!: string;
  @Column()
  public race: string | undefined;
  @Column()
  public photo: string | undefined;

  constructor (
    nameOrPet?: string | IMascota,
    age?: number,
    species?: string,
    race?: string,
    photo?: string,
  ) {
    if (typeof nameOrPet === "string" ||
      typeof nameOrPet === "undefined") {
      this.name = nameOrPet || '';
      this.age = age;
      this.species = species || '';
      this.race = race;
      this.photo = photo;
    } else {
      this.name = nameOrPet.name;
      this.age = nameOrPet.age;
      this.species = nameOrPet.species;
      this.race = nameOrPet.race;
      this.photo = nameOrPet.photo;
    }
  }

}

