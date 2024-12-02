import React, { useState } from "react";

import { useDeleteProductMutation } from "../../features/api/productsApi";

import { Tag } from "../Tag/Tag";
import { EditIcon } from "../Icons/EditIcon";
import { TrashIcon } from "../Icons/TrashIcon";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";

interface ProductCardProps {
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

export const ProductCard: React.FC<ProductCardProps> = (props) => {
  // ссылка на картинку
  const [imgSrc, setImgSrc] = useState<string>(isValidImageUrl(props.image) ? props.image! : "/images/product_stub.png");

  // Если изображение не загрузилось, подставляем заглушку
  const handleError = () => {
    setImgSrc("/images/product_stub.png");
  };

  // проверка валидности категории
  const isValidСategory = props.category && /^[\w\sа-яА-ЯёЁ]+$/.test(props.category);

  // обновляем число товаров в заказе
  const updateLocalStorage = (updatedCount: number) => {
    const currentOrder = JSON.parse(localStorage.getItem("order") ?? "{}");
    if (currentOrder[props.id]) {
      currentOrder[props.id].count = updatedCount;
      localStorage.setItem("order", JSON.stringify(currentOrder));
    }
  };

  // добавлен ли товар в корзину
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // обработчик добавления товара в корзину
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

  // значение инпута для кол-ва товара
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

  // обработчик инпута для кол-ва товара
  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= 1 && value <= props.quantity) {
      setCount(value);
    }
  };

  // запрос на удаление товара
  const [deleteProduct] = useDeleteProductMutation();

  // обработчик иконки удаления товара
  const deleteHandler = async () => {
    try {
      const response = await deleteProduct({ id: props.id }).unwrap();
      console.log(`Delete product "${props.name}" successfully:`, response);
      window.location.reload();
    } catch (error) {
      console.error("Product wasn't delete:", error);
    }
  };

  return (
    <div className="card_background">
      <div className="card_img_div">
        <img className="card_img" src={imgSrc} alt="Product" onError={handleError} />
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
            <a href={`/products/edit/${props.id}`}>
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
