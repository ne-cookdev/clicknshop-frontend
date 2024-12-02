export interface OrdersforHistory {
  number: number;
  order_details: HistoryProduct[];
  user: number;
  order_date: string;
  status: number;
  address: string;
}

export interface HistoryProduct {
  product: ProductForCategory;
  image_ref?: string;
  price_at_order: number;
  quantity: number;
}

export interface CartProduct {
  id: number;
  name: string;
  image_ref?: string;
  price: number;
  quantity: number;
  count: number;
}

export interface Category {
  id: number;
  products: ProductForCategory[];
  name: string;
}

export interface ProductForCategory {
  id: number;
  name: string;
}

export interface CategoryForProduct {
  id: number;
  name: string;
}

export interface Order {
  number: number;
  order_details: ProductInOrder[];
  user: number;
  order_date: string;
  status: number;
  address: string;
}

export interface ProductInOrder {
  product: ProductForCategory;
  price_at_order: number;
  quantity: number;
}
