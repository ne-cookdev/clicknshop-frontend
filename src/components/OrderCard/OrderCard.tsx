import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDeleteOrderMutation } from "../../features/api/ordersApi";

import { Tag } from "../Tag/Tag";
import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";
import { LittleProductCard } from "../LittleProductCard/LittleProductCard";

import type { OrderDetail } from "../../entities/orders/model/types";

interface OrderCardProps {
  number: number;
  products: OrderDetail[];
  user: string;
  date: string;
  status: number;
  address: string;
}

export const OrderCard: React.FC<OrderCardProps> = (props) => {
  // нужно для редиректа
  const navigate = useNavigate();

  // Получаем хук для мутации
  const [deleteOrder, { isLoading, isError, isSuccess }] = useDeleteOrderMutation();

  // обработчик иконки удаления заказа
  const deleteHandler = async () => {
    try {
      const response = await deleteOrder({ number: props.number }).unwrap();
      console.log(`Delete order "${props.number}" successfully:`, response);
      window.location.reload();
    } catch (error) {
      console.error("Order wasn't delete:", error);
    }
  };

  const [totalPrice, setTotalPrice] = useState(0);
  // Функция для пересчета итоговой стоимости
  const calculateTotalPrice = () => {
    let total = 0;
    props.products.map((product: OrderDetail) => (total += product.price_at_order * product.quantity));
    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [props.products]);

  return (
    <div className="ordercard_background">
      <div className="ordercard_info">
        <h1 className="ordercard_number">Заказ №{props.number}</h1>
        <div className="ordercard_tag_div">{props.status == 1 ? <Tag text="Создан" /> : props.status == 2 ? <Tag text="В пути" classNamediv="ordercard_yellow_tag_div" classNamespan="ordercard_yellow_tag_span" /> : <Tag text="Доставлен" classNamediv="ordercard_green_tag_div" classNamespan="ordercard_green_tag_span" />}</div>

        <p className="ordercard_text">Дата: {props.date.slice(8, 10) + "." + props.date.slice(5, 7) + "." + props.date.slice(0, 4)}</p>
        <p className="ordercard_text">Заказчик: {props.user}</p>
        <p className="ordercard_text">Адрес: {props.address}</p>
        <div className="ordercard_icons_price">
          <div className="ordercard_icons">
            <a href={`/orders/edit/${props.number}`}>
              <EditIcon className="ordercard_editicon" />
            </a>
            <TrashIcon onClick={deleteHandler} className="ordercard_trashicon" />
          </div>
          <p className="ordercard_price">{totalPrice} ₽</p>
        </div>
      </div>

      <div className="ordercard_products">
        {props.products.map((product: OrderDetail) => (
          <LittleProductCard key={product.product.id} id={product.product.id} name={product.product.name} price={product.price_at_order} count={product.quantity} />
        ))}
      </div>
    </div>
  );
};
