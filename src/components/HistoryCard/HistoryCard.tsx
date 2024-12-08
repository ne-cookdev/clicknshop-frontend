import React from "react";
import { useState } from "react";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";

interface HistoryCardProps {
  name: string;
  image?: string;
  price: number;
  quantity: number;
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

  // добавлен ли товар в корзину
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const addToCartHandler = () => {
    setIsAdded(true);
  };

  // выбранное кол-во товара (в инпуте)
  const [count, setCount] = useState<number>(1);

  // обработчик кнопки "+"
  const minusHandler = () => {
    setCount((prevCount) => Math.max(prevCount - 1, 1));
  };

  // обработчик кнопки "-"
  const plusHandler = () => {
    setCount((prevCount) => Math.min(prevCount + 1, props.quantity));
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
      </div>
    </div>
  );
};
