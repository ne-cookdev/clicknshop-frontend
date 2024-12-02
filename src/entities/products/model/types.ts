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

export interface CartProduct {
  id: number;
  name: string;
  image_ref?: string;
  price: number;
  quantity: number;
  count: number;
}

export interface ShortProduct {
  id: number;
  name: string;
}
