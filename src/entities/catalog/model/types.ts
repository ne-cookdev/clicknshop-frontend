export interface Item {
  id: number;
  category: string;
  name: string;
  description: string;
  image_ref?: string;
  price: number;
  quantity: number;
}

export interface HistoryItem {
  id: number;
  name: string;
  image_ref?: string;
  price: number;
  quantity: number;
}
