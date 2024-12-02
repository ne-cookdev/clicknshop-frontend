import type { ShortProduct } from "../../products/model/types";

export interface Category {
  id: number;
  products: ShortProduct[];
  name: string;
}

export interface ShortCategory {
  id: number;
  name: string;
}
