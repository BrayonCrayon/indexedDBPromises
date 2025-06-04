import type {Item} from "@/Types/Item.ts";
import {randAnimal, randNumber} from "@ngneat/falso";


const itemFactory = (overrides: Partial<Item> = {}): Item => {
  return {
    id: randNumber({min: 1000, max: 9000}),
    value: randAnimal(),
    ...overrides,
  }
}

export default itemFactory;
