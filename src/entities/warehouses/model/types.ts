import type { StockProduct } from "../../stocks/model/types";

export interface Warehouse {
  id: number;
  name: string;
  stocks: StockProduct[];
  location: string;
}
