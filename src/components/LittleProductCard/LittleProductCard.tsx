import React from "react";

interface LittleProductCardProps {
  id: number;
  name: string;
  price: number;
  count: number;
}

export const LittleProductCard: React.FC<LittleProductCardProps> = (props) => {
  return (
    <div className="littleproductcard_background">
      <h1 className="littleproductcard_name">{props.name}</h1>
      <p className="littleproductcard_text">Товары: {props.count}</p>
      <p className="littleproductcard_price">{props.count * props.price} ₽</p>
    </div>
  );
};
