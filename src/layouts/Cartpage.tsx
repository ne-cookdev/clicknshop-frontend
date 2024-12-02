import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLogoutUserMutation } from "../features/api/accountsApi";
import { usePlaceOrderMutation } from "../features/api/userApi";

import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { CartCard } from "../components/CartCard/CartCard";
import { Label } from "../components/Label/Label";
import { Button } from "../components/Button/Button";

import { CartProduct } from "../entities/products/model/types";

interface OrderProduct {
  product_id: number;
  quantity: number;
}

export const Cartpage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role === "admin" || role === "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

  const [data, setData] = useState<CartProduct[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Функция для загрузки данных из localStorage
  const loadData = () => {
    const orderData = JSON.parse(localStorage.getItem("order") ?? "{}");
    const productsArray = Object.keys(orderData).map((key) => ({
      id: key,
      ...orderData[key],
    }));
    setData(productsArray);
  };

  // Функция для пересчета итоговой стоимости
  const calculateTotalPrice = () => {
    const total = data.reduce((sum, product) => sum + product.price * product.count, 0);
    setTotalPrice(total);
  };

  // Функция для пересчета итоговой стоимости
  const calculateTotalCount = () => {
    const total = data.reduce((sum, product) => sum + product.count, 0);
    setTotalCount(total);
  };

  // Используйте useEffect для загрузки данных и пересчета общей стоимости
  useEffect(() => {
    loadData();
    console.log(data);
  }, []);

  useEffect(() => {
    calculateTotalPrice();
    calculateTotalCount();
  }, [data]);

  // Функция для обновления localStorage и перезагрузки данных
  const updateLocalStorage = (id: number, newCount: number) => {
    // Обновляем данные в localStorage
    const orderData = JSON.parse(localStorage.getItem("order") ?? "{}");
    orderData[id].count = newCount;
    localStorage.setItem("order", JSON.stringify(orderData));

    // Перезагружаем данные из localStorage
    loadData();
  };

  // Функция для удаления товара из localStorage
  const deleteProduct = (id: number) => {
    // Обновляем данные в localStorage
    const orderData = JSON.parse(localStorage.getItem("order") ?? "{}");

    // Удаляем товар с id из orderData
    if (orderData[id]) {
      delete orderData[id]; // Удаляем элемент с указанным id
    }

    localStorage.setItem("order", JSON.stringify(orderData));

    // Перезагружаем данные из localStorage
    loadData();
  };

  // Получаем хук для мутации
  const [placeOrder] = usePlaceOrderMutation();

  const [isShowError, setIsShowError] = useState(false);

  const handleOrderSubmit = async () => {
    const orderData = JSON.parse(localStorage.getItem("order") ?? "{}");
    const productsArray = Object.keys(orderData).map((key) => ({
      id: key,
      ...orderData[key],
    }));

    let order_details: OrderProduct[] = [];
    console.log(productsArray);

    productsArray.forEach((i: CartProduct) => {
      const product = {
        product_id: i.id,
        quantity: i.count,
      };
      order_details.push(product);
    });

    try {
      const response = await placeOrder({ order_details: order_details, address: address }).unwrap();
      console.log("Order submitted successfully:", response);
      localStorage.setItem("order", "{}");
      loadData();
    } catch (error) {
      console.error("Error submitting order:", error);
      setIsShowError(true);
    }
  };

  // запрос на выход
  const [logoutUser] = useLogoutUserMutation();
  const handleLogoutProcess = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      const returned = await logoutUser({ refresh_token: refreshToken }).unwrap();
      localStorage.clear();
      navigate("/auth/login");
    } catch (error) {
      console.error(error);
    }
  };

  //  обновления access токена при ошибке "не авторизован"
  /*const [updateAccessToken] = useUpdateAccessTokenMutation();
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);
  const fetchLessons = async () => {
    try {
      const valrefetch = await refetch();
      // @ts-ignore
      if (valrefetch.error?.status === 401 && !isTokenRefreshing) {
        try {
          setIsTokenRefreshing(true);
          const refreshToken = localStorage.getItem("refresh");
          const val = await updateAccessToken({ refresh: refreshToken }).unwrap();
          await refetch();
        } catch (tokenError) {
          navigate("/auth/login");
        } finally {
          setIsTokenRefreshing(false);
        }
      } else if (valrefetch.error) {
        navigate("/auth/login");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchLessons();
  }, []);*/

  const [address, setAddress] = useState("");

  const handleChangeAddress = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(event.target.value);
  };

  if (data.length == 0) {
    return (
      <main className="body_404">
        <LogoutHeader role={role ? role : "user"} onClickHandler={handleLogoutProcess} />
        <div className="py-24 flex items-center justify-center flex-col">
          <img src="/images/robot_404.png" className="mb-6" />
          <p className="text-black font-bold text-2xl text-center mb-5">Вы пока ничего не выбрали</p>
          <a className="w-full flex justify-center" href="/products">
            <Button text="Каталог" className="w-[250px]" />
          </a>
        </div>
      </main>
    );
  } else {
    return (
      <>
        <main className="bg-starkit-magnolia">
          <LogoutHeader role={role ? role : "user"} onClickHandler={handleLogoutProcess} />
          <div className="grid grid-cols-[3fr_1fr] px-32 justify-center items-start gap-x-6">
            <div className="w-full flex flex-col gap-y-7">
              {data.map((product: CartProduct) => (
                <CartCard onDeleteProduct={deleteProduct} onUpdateCount={updateLocalStorage} key={product.id} id={product.id} name={product.name} image={product.image_ref} price={product.price} quantity={product.quantity} count={product.count} />
              ))}
            </div>
            <div className="w-full py-[30px] px-[20px] flex flex-col bg-white rounded-[40px]">
              <h1 className="w-full text-center text-[28px] font-bold text-starkit-electric">Заказ</h1>
              <Label text="Адрес" />
              <textarea value={address} onChange={handleChangeAddress} className="w-full h-[105px] p-3.5 mb-6 border border-starkit-lavender focus:outline-starkit-indigo text-base rounded-[14px]" placeholder="Введите адрес..." />
              <p className="text-sm font-normal text-black mb-2.5">Товары: {totalCount} шт.</p>
              <div className="flex flex-row mb-6 justify-between items-center">
                <p className="text-[28px] font-bold text-starkit-electric">Итого:</p>
                <p className="text-[28px] font-bold text-starkit-electric">{totalPrice} ₽</p>
              </div>
              <Button onClick={handleOrderSubmit} text="Оформить заказ" />
            </div>
          </div>
          {isShowError && (
            <div className="h-dvh fixed inset-0 bg-black/50 bg-none flex justify-center items-center z-[8]">
              <div className="w-[425px] px-6 pb-6 flex flex-col justify-center items-center bg-white rounded-[40px]">
                <img src="/images/robot_404.png" className="mt-[-128px] mb-8" />
                <h1 className="mb-4 text-center text-starkit-electric text-2xl font-bold">Извините</h1>
                <span className="mb-9 text-center text-black text-base font-medium">
                  Заказ не получилось оформить. Уже начали исправлять данную проблему.<span className="text-starkit-electric"> Свяжемся с вами в ближайшее время.</span>
                </span>
                <Button onClick={() => setIsShowError(false)} text="Понятно" className="mb-5" />
              </div>
            </div>
          )}
        </main>
      </>
    );
  }
};
