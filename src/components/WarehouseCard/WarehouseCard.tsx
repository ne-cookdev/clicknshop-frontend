import React from "react";

import { useDeleteWarehouseMutation } from "../../features/api/warehousesApi";

import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";

interface WarehouseCardProps {
  role: string;
  id: number;
  name: string;
  location: string;
}

export const WarehouseCard: React.FC<WarehouseCardProps> = (props) => {
  // запрос на удаление склада
  const [deleteWarehouse] = useDeleteWarehouseMutation();

  // обработчик иконки удаления склада
  const deleteHandler = async () => {
    try {
      const response = await deleteWarehouse({ id: props.id }).unwrap();
      console.log(`Склад с именем "${props.name}" упешно удален:`, response);
      window.location.reload();
    } catch (error) {
      console.error("Склад не получилось удалить:", error);
    }
  };

  return (
    <div className="warehousecard_background">
      <h1 className="warehousecard_name">{props.name}</h1>
      <p className="warehousecard_text">Адрес: {props.location}</p>
      {props.role == "superuser" && (
        <div className="warehousecard_icons_div">
          <a href={`/warehouses/edit/${props.id}`}>
            <EditIcon className="warehousecard_editicon" />
          </a>
          <TrashIcon onClick={deleteHandler} className="warehousecard_trashicon" />
        </div>
      )}
    </div>
  );
};
