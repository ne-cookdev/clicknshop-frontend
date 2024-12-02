import React from "react";

import { useDeleteCategoryMutation } from "../../features/api/categoriesApi";

import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";

interface CategoryCardProps {
  id: number;
  name: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = (props) => {
  // удаление категории
  const [deleteCategory] = useDeleteCategoryMutation();

  // обработчик иконки удаления категории
  const deleteHandler = async () => {
    try {
      const response = await deleteCategory({ id: props.id }).unwrap();
      console.log(`Категория с именем "${props.name}" успешно создана:`, response);
      window.location.reload();
    } catch (error) {
      console.error("Категорию не получилось создать:", error);
    }
  };

  return (
    <div className="categorycard_background">
      <h1 className="categorycard_name">{props.name}</h1>
      <div className="categorycard_icons_div">
        <a href={`/categories/edit/${props.id}`}>
          <EditIcon className="categorycard_editicon" />
        </a>
        <TrashIcon onClick={deleteHandler} className="categorycard_trashicon" />
      </div>
    </div>
  );
};
