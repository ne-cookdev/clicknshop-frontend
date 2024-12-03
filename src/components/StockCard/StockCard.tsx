import React from "react";

import { useDeleteStockMutation } from "../../features/api/stocksApi";

import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";

import type { Product } from "../../entities/products/model/types";
import type { Warehouse } from "../../entities/warehouses/model/types";

interface StockCardProps {
  id: number;
  warehouse: Warehouse;
  product: Product;
  quantity: number;
}

export const StockCard: React.FC<StockCardProps> = (props) => {
  // запрос на удаление кол-ва
  const [deleteStock] = useDeleteStockMutation();

  // обработчик иконки удаления кол-ва
  const deleteHandler = async () => {
    try {
      const response = await deleteStock({ id: props.id }).unwrap();
      console.log(`Кол-во с id "${props.id}" упешно удален:`, response);
      window.location.reload();
    } catch (error) {
      console.error("Кол-во не получилось удалить:", error);
    }
  };

  return (
    <div className="stockcard_background">
      <h1 className="stockcard_name">Товар: {props.product.name}</h1>
      <p className="stockcard_text">Склад: {props.warehouse.name}</p>
      <p className="stockcard_text">Кол-во товара на складе: {props.quantity}</p>
      <p className="stockcard_text">Всего товара: {props.product.all_quantity}</p>
      <div className="stockcard__icons_div">
        <a href={`/stocks/edit/${props.id}`}>
          <EditIcon className="stockcard_editicon" />
        </a>
        <TrashIcon onClick={deleteHandler} className="stockcard_trashicon" />
      </div>
    </div>
  );
};
