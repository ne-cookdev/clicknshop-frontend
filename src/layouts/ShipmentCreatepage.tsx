import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetOrdersQuery } from "../features/api/ordersApi";
import { useGetCarriersQuery } from "../features/api/carriersApi";
import { useCreateShipmentMutation } from "../features/api/shipmentsApi";

import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";

export const ShipmentCreatepage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role !== "admin" && role !== "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

  // получаем все заказы
  const { data: orders, error, refetch } = useGetOrdersQuery();
  // получаем всех доставщиков
  const { data: carriers } = useGetCarriersQuery();

  // получение id доставщика по имени
  const getIdByCarrierName = (name: string) => {
    const carrier = carriers?.find((carrier) => carrier.name === name);
    return carrier ? carrier.id : 1;
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
  const [updateAccessToken] = useUpdateAccessTokenMutation();
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
  }, []);

  // значения инпутов
  const [orderNum, setOrderNum] = useState<string>("");
  const [carrier, setCarrier] = useState<string>("");
  const [status, setStatus] = useState<string>("В пути");

  // значения ошибок для инпута
  const [orderNumMessage, setOrderNumMessage] = useState<string>("");
  const [carrierMessage, setCarrierMessage] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");

  // обработчик инпута номера заказа
  const inputOrderNumHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setOrderNum(value);
    const orderExists = orders?.some((order) => order.number.toString() === value);
    if (!orderExists) {
      setOrderNumMessage("Такого заказа не существует.");
    } else {
      setOrderNumMessage("");
    }
  };
  // обработчик инпута доставщика
  const inputСarrierHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCarrier(value);
    const carrierExists = carriers?.some((carrier) => carrier.name.toLowerCase() == value.toLowerCase());
    if (!carrierExists) {
      setCarrierMessage("Такого доставщика не существует");
    } else {
      setCarrierMessage("");
    }
  };
  // обработчик инпута статус
  const inputStatusHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setStatus(value);
    if (value != "В пути" && value != "Доставлен") {
      setStatusMessage(`Статус может быть "В пути" или "Доставлен"`);
    } else {
      setStatusMessage("");
    }
  };

  // запрос на создание заказа
  const [createShipment] = useCreateShipmentMutation();

  // состояние банера "Не получилось создать"
  const [isShowError, setIsShowError] = useState(false);

  // обработчик кнопки "Готово"
  const createShipmentHandler = async () => {
    // проверяем, что нет ошибок
    if (orderNumMessage != "") {
      return;
    }
    if (carrierMessage != "") {
      return;
    }
    if (statusMessage != "") {
      return;
    }
    // проверяем, что все поля заполнены
    if (orderNum == "" || carrier == "" || status == "") {
      return;
    }
    // делаем запрос
    try {
      let statusNum = 0;
      if (status == "В пути") {
        statusNum = 1;
      } else {
        statusNum = 2;
      }
      const response = await createShipment({ order_id: parseInt(orderNum, 10), carrier_id: getIdByCarrierName(carrier), status: statusNum }).unwrap();
      console.log(`Доставка для заказа "${orderNum}" успешно создана:`, response);
      navigate("/shipments");
    } catch (error) {
      console.error("Доставку не получилось создать:", error);
      setIsShowError(true);
    }
  };

  return (
    <>
      <main className="bg-starkit-magnolia">
        <LogoutHeader role={role ? role : "user"} onClickHandler={handleLogoutProcess} />
        <div className="mt-[-35px] flex justify-center items-center">
          <div className="w-[500px] px-6 py-7 pb-7 bg-white rounded-[40px]">
            <h3 className="w-full mb-5 text-3xl text-center font-bold">
              Добавление <span className="text-starkit-electric">доставки</span>
            </h3>
            <div className={orderNumMessage != "" ? "" : "mb-5"}>
              <Label text="Номер заказа" />
              <div className="auth_div_for_input">
                <Input onChange={inputOrderNumHandler} value={orderNum} isError={orderNumMessage != ""} type="text" placeholder="Введите номер заказа..." />
              </div>
              {orderNumMessage != "" && <p className="auth_error_text">{orderNumMessage}</p>}
            </div>
            <div className={carrierMessage != "" ? "" : "mb-5"}>
              <Label text="Доставщик" />
              <div className="auth_div_for_input">
                <Input onChange={inputСarrierHandler} value={carrier} isError={carrierMessage != ""} type="text" placeholder="Введите доставщика..." />
              </div>
              {carrierMessage != "" && <p className="auth_error_text">{carrierMessage}</p>}
            </div>
            <div className={statusMessage != "" ? "" : "mb-5"}>
              <Label text="Статус" />
              <div className="auth_div_for_input">
                <Input onChange={inputStatusHandler} value={status} isError={statusMessage != ""} type="text" placeholder="Введите статус доставки..." />
              </div>
              {statusMessage != "" && <p className="auth_error_text">{statusMessage}</p>}
            </div>
            <Button onClick={createShipmentHandler} text="Готово" />
          </div>
        </div>
        {isShowError && (
          <div className="h-dvh fixed inset-0 bg-black/50 bg-none flex justify-center items-center z-[8]">
            <div className="w-[425px] px-6 pb-6 flex flex-col justify-center items-center bg-white rounded-[40px]">
              <img src="/images/robot_404.png" className="mt-[-128px] mb-8" />
              <h1 className="mb-4 text-center text-starkit-electric text-2xl font-bold">Извините</h1>
              <span className="mb-9 text-center text-black text-base font-medium">
                Доставку не получилось создать.<span className="text-starkit-electric"> Уже начали исправлять данную проблему.</span>
              </span>
              <a href="/shipments" className="w-full">
                <Button onClick={() => setIsShowError(false)} text="Понятно" />
              </a>
            </div>
          </div>
        )}
      </main>
    </>
  );
};
