import type { Product } from "../../products/model/types";
import type { Warehouse } from "../../warehouses/model/types";

export interface Stock {
  id: number;
  warehouse: Warehouse;
  product: Product;
  quantity: number;
}

export interface StockProduct {
  product: Product;
  quantity: number;
}
