import { Order } from "../../orders/model/types";
import { Carrier } from "../../carriers/model/types";

export interface Shipment {
  tracking_number: number;
  order: Order;
  carrier: Carrier;
  status: number;
}
