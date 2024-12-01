import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDeleteCategoryMutation } from "../../features/api/api";

import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";

interface CategoryCardProps {
  id: number;
  name: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = (props) => {
  // нужно для редиректа
  const navigate = useNavigate();

  // Получаем хук для мутации
  const [deleteCategory, { isLoading, isError, isSuccess }] = useDeleteCategoryMutation();

  // обработчик иконки удаления категории
  const deleteHandler = async () => {
    try {
      const response = await deleteCategory({ id: props.id }).unwrap();
      console.log(`delete category "${props.name}" successfully:`, response);
      navigate("/categories");
    } catch (error) {
      console.error("Category wasn't delete:", error);
    }
  };

  return (
    <div className="categorycard_background">
      <h1 className="categorycard_name">{props.name}</h1>
      <div className="categorycard_icons_div">
        <a href={`/category/edit/${props.id}`}>
          <EditIcon className="categorycard_editicon" />
        </a>
        <TrashIcon onClick={deleteHandler} className="categorycard_trashicon" />
      </div>
    </div>
  );
};
