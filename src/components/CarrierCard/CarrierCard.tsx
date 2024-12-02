import React from "react";

import { useDeleteCarrierMutation } from "../../features/api/carriersApi";

import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";

interface CarrierCardProps {
  id: number;
  name: string;
}

export const CarrierCard: React.FC<CarrierCardProps> = (props) => {
  // удаление доставщика
  const [deleteCarrier] = useDeleteCarrierMutation();

  // обработчик иконки удаления доставщика
  const deleteHandler = async () => {
    try {
      const response = await deleteCarrier({ id: props.id }).unwrap();
      console.log(`Доставщик с именем "${props.name}" успешно создан:`, response);
      window.location.reload();
    } catch (error) {
      console.error("Доставщика не получилось создать:", error);
    }
  };

  return (
    <div className="categorycard_background">
      <h1 className="categorycard_name">{props.name}</h1>
      <div className="categorycard_icons_div">
        <a href={`/carriers/edit/${props.id}`}>
          <EditIcon className="categorycard_editicon" />
        </a>
        <TrashIcon onClick={deleteHandler} className="categorycard_trashicon" />
      </div>
    </div>
  );
};
