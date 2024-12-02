export interface Order {
  number: number;
  order_details: OrderDetail[];
  user: User;
  order_date: string;
  status: number;
  address: string;
}

export interface OrderDetail {
  product: ProductForOrderDetail;
  price_at_order: number;
  quantity: number;
}

export interface ProductForOrderDetail {
  id: number;
  name: string;
  description: string;
  image_ref?: string | null;
  all_quantity: number;
}

export interface User {
  id: number;
  email: string;
}
