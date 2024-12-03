import React from "react";

import { useDeleteShipmentMutation } from "../../features/api/shipmentsApi";

import { Tag } from "../Tag/Tag";
import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";

interface ShipmentCardProps {
  orderNum: number;
  status: number;
  trackNum: number;
  carrier: string;
}

export const ShipmentCard: React.FC<ShipmentCardProps> = (props) => {
  // запрос на удаление доставки
  const [deleteShipment] = useDeleteShipmentMutation();

  // обработчик иконки удаления доставки
  const deleteHandler = async () => {
    try {
      const response = await deleteShipment({ id: props.trackNum }).unwrap();
      console.log(`Доставка с трек-номером "${props.trackNum}" успешно удалена:`, response);
      window.location.reload();
    } catch (error) {
      console.error("Доставку не получилось удалить:", error);
    }
  };

  return (
    <div className="shipmentcard_background">
      <h1 className="shipmentcard_name">Заказ №{props.orderNum}</h1>
      <div className="shipmentcard_tag_div">{props.status == 1 ? <Tag text="В пути" classNamediv="shipmentcard_yellow_tag_div" classNamespan="shipmentcard_yellow_tag_span" /> : <Tag text="Доставлен" classNamediv="shipmentcard_green_tag_div" classNamespan="shipmentcard_green_tag_span" />}</div>
      <p className="shipmentcard_text">Трек-номер: {props.trackNum}</p>
      <p className="shipmentcard_text">Доставщик: {props.carrier}</p>
      <div className="shipmentcard_icons_div">
        <a href={`/shipments/edit/${props.trackNum}`}>
          <EditIcon className="shipmentcard_editicon" />
        </a>
        <TrashIcon onClick={deleteHandler} className="shipmentcard_trashicon" />
      </div>
    </div>
  );
};
