import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDeleteItemMutation } from "../../features/api/api";

import { Tag } from "../Tag/Tag";
import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";

interface CardProps {
  role: string;
  id: number;
  category: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  quantity: number;
  order: any;
}

// Проверяем, что URL не пустой и соответствует формату изображения
function isValidImageUrl(url: string | undefined): boolean {
  return !!url && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
}

export const Card: React.FC<CardProps> = (props) => {
  // ссылка на картинку
  const [imgSrc, setImgSrc] = useState<string>(isValidImageUrl(props.image) ? props.image! : "/images/item_stub.png");
  // Если изображение не загрузилось, подставляем заглушку
  const handleError = () => {
    setImgSrc("/images/item_stub.png");
  };

  // проверка валидности категории
  const isValidСategory = props.category && /^[\w\sа-яА-ЯёЁ]+$/.test(props.category);

  const updateLocalStorage = (updatedCount: number) => {
    const currentOrder = JSON.parse(localStorage.getItem("order") ?? "{}");
    if (currentOrder[props.id]) {
      currentOrder[props.id].count = updatedCount;
      localStorage.setItem("order", JSON.stringify(currentOrder));
    }
  };

  // добавлен ли товар в корзину
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const addToCartHandler = () => {
    setIsAdded(true);
    const currentOrder = JSON.parse(localStorage.getItem("order") ?? "{}");
    if (currentOrder[props.id]) {
      currentOrder[props.id].count += count;
    } else {
      currentOrder[props.id] = {
        id: props.id,
        name: props.name,
        image_ref: props.image || null,
        price: props.price,
        quantity: props.quantity,
        count: count,
      };
    }
    localStorage.setItem("order", JSON.stringify(currentOrder));
  };

  // выбранное кол-во товара (в инпуте)
  let startValue;
  if (props.order[props.id]) {
    startValue = props.order[props.id].count;
  } else {
    startValue = 1;
  }
  const [count, setCount] = useState<number>(startValue);

  // обработчик кнопки "+"
  const minusHandler = () => {
    setCount((prevCount) => {
      const newCount = Math.max(prevCount - 1, 1);
      updateLocalStorage(newCount); // Обновляем localStorage
      return newCount;
    });
  };

  // обработчик кнопки "-"
  const plusHandler = () => {
    setCount((prevCount) => {
      const newCount = Math.min(prevCount + 1, props.quantity);
      updateLocalStorage(newCount); // Обновляем localStorage
      return newCount;
    });
  };

  // обработчик инпута с кол-вом товара
  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= 1 && value <= props.quantity) {
      setCount(value);
    }
  };

  // нужно для редиректа
  const navigate = useNavigate();

  // Получаем хук для мутации
  const [deleteItem, { isLoading, isError, isSuccess }] = useDeleteItemMutation();

  // обработчик иконки удаления категории
  const deleteHandler = async () => {
    try {
      const response = await deleteItem({ id: props.id }).unwrap();
      console.log(`Delete item "${props.name}" successfully:`, response);
      navigate("/catalog");
    } catch (error) {
      console.error("Item wasn't delete:", error);
    }
  };

  return (
    <div className="card_background">
      <div className="card_img_div">
        <img className="card_img" src={imgSrc} alt="Item" onError={handleError} />
      </div>

      <div className="card_info_part">
        {isValidСategory && (
          <div className="card_tags_div">
            <Tag text={props.category} />
          </div>
        )}

        <h1 className="card_name">{props.name}</h1>

        <p className="card_description">{props.description}</p>

        <div className="card_quantity_price_div">
          <p className="card_quantity">Осталось: {props.quantity} шт.</p>
          <p className="card_price">{props.price} ₽</p>
        </div>

        {props.role == "admin" || props.role == "superuser" ? (
          <div className="card_icons_div">
            <a href={`/item/edit/${props.id}`}>
              <EditIcon className="card_editicon" />
            </a>
            <TrashIcon onClick={deleteHandler} className="card_trashicon" />
          </div>
        ) : (
          <>
            {!props.order[props.id] ? (
              <>
                {!isAdded ? (
                  <>
                    {/* сначала это */}
                    <Button onClick={addToCartHandler} text="Добавить в корзину" />
                  </>
                ) : (
                  <>
                    {/* потом это */}
                    <div className="card_buttons_div">
                      <Button onClick={minusHandler} text="-" />
                      <Input onChange={inputHandler} value={count.toString()} type="text" />
                      <Button onClick={plusHandler} text="+" />
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="card_buttons_div">
                  <Button onClick={minusHandler} text="-" />
                  <Input onChange={inputHandler} value={count.toString()} type="text" />
                  <Button onClick={plusHandler} text="+" />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
