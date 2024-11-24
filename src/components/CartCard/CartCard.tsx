import React, { useState } from "react";

import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { TrashIcon } from "../Icons/TrashIcon";

interface CartCardProps {
  id: number;
  image?: string;
  name: string;
  price: number;
  quantity: number;
  count: number;
  onUpdateCount: (id: number, count: number) => void;
  onDeleteItem: (id: number) => void;
}

// Проверяем, что URL не пустой и соответствует формату изображения
function isValidImageUrl(url: string | undefined): boolean {
  return !!url && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
}

export const CartCard: React.FC<CartCardProps> = (props) => {
  // ссылка на картинку
  const [imgSrc, setImgSrc] = useState<string>(isValidImageUrl(props.image) ? props.image! : "/images/item_stub.png");
  // Если изображение не загрузилось, подставляем заглушку
  const handleError = () => {
    setImgSrc("/images/item_stub.png");
  };

  // выбранное кол-во товара (в инпуте)
  const [count, setCount] = useState<number>(props.count);

  // обработчик кнопки "+"
  const minusHandler = () => {
    setCount((prevCount) => {
      const newCount = Math.max(prevCount - 1, 1);
      props.onUpdateCount(props.id, newCount);
      return newCount;
    });
  };

  // обработчик кнопки "-"
  const plusHandler = () => {
    setCount((prevCount) => {
      const newCount = Math.min(prevCount + 1, props.quantity);
      props.onUpdateCount(props.id, newCount);
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

  // обработчиr иконки удаления товара
  const deleteHandler = () => {
    props.onDeleteItem(props.id);
  };

  return (
    <div className="cartcard_background">
      <div className="cartcard_imgtext_div">
        <img className="cartcard_img" src={imgSrc} alt="Item" onError={handleError} />

        <div className="cartcard_text_div">
          <h1 className="cartcard_name">{props.name}</h1>
          <p className="cartcard_quantity">Осталось: {props.quantity} шт.</p>
        </div>
      </div>

      <div className="cartcard_buttons_div">
        <Button onClick={minusHandler} text="-" />
        <Input onChange={inputHandler} value={count.toString()} type="text" />
        <Button onClick={plusHandler} text="+" />
      </div>

      <p className="cartcard_price">{props.price * count} ₽</p>

      <TrashIcon onClick={deleteHandler} className="card_trashicon" />
    </div>
  );
};
