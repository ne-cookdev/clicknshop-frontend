import React, { useState } from "react";

import { Button } from "../Button/Button";
import { Input } from "../Input/Input";

interface HistoryCardProps {
  id: number;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  order: any;
}

// Проверяем, что URL не пустой и соответствует формату изображения
function isValidImageUrl(url: string | undefined): boolean {
  return !!url && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
}

export const HistoryCard: React.FC<HistoryCardProps> = (props) => {
  // ссылка на картинку
  const [imgSrc, setImgSrc] = useState<string>(isValidImageUrl(props.image) ? props.image! : "/images/item_stub.png");
  // Если изображение не загрузилось, подставляем заглушку
  const handleError = () => {
    setImgSrc("/images/item_stub.png");
  };

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

  return (
    <div className="card_background">
      <div className="card_img_div">
        <img className="card_img" src={imgSrc} alt="Item" onError={handleError} />
      </div>

      <div className="card_info_part">
        <h1 className="card_name">{props.name}</h1>

        <div className="card_quantity_price_div">
          <p className="card_quantity">Осталось: {props.quantity} шт.</p>
          <p className="card_price">{props.price} ₽</p>
        </div>

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
      </div>
    </div>
  );
};
