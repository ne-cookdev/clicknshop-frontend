import type { ShortCategory } from "../../categories/model/types";

export interface Product {
  id: number;
  category: ShortCategory;
  all_quantity: number;
  name: string;
  description: string;
  price: number;
  weight: number;
  width: number;
  height: number;
  length: number;
  image_ref?: string | null;
}
