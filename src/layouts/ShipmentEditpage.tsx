import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useEditShipmentMutation, useGetShipmentsQuery } from "../features/api/shipmentsApi";
import { useGetCarriersQuery } from "../features/api/carriersApi";

import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";

type ShipmentParams = {
  shipmentId: string;
};

export const ShipmentEditpage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role !== "admin" && role !== "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

  // id доставки
  const { shipmentId } = useParams<ShipmentParams>();
  const shipmentIdNumber = parseInt(shipmentId ?? "", 10);

  // получаем все доставки
  const { data: shipments, isSuccess: isSuccessShipments, error, refetch } = useGetShipmentsQuery();
  // получаем всех доставщиков
  const { data: carriers, isSuccess: isSuccessCarriers } = useGetCarriersQuery();

  // получение доставки по tracking_number
  const getShipmentByTrackingNumber = (tracking_number: number) => {
    const shipment = shipments?.find((shipment) => shipment.tracking_number === tracking_number);
    return shipment;
  };

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
  const [carrier, setCarrier] = useState<string>(getShipmentByTrackingNumber(shipmentIdNumber)?.carrier.name || "");
  let statusValue = "";
  if (getShipmentByTrackingNumber(shipmentIdNumber)?.status == 1) {
    statusValue = "В пути";
  } else {
    statusValue = "Доставлен";
  }
  const [status, setStatus] = useState<string>(statusValue);

  // значения ошибок для инпута
  const [carrierMessage, setCarrierMessage] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");

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

  // обновляем значения инпутов после запросов
  useEffect(() => {
    if (!isSuccessShipments || !isSuccessCarriers) {
      return;
    }
    setCarrier(getShipmentByTrackingNumber(shipmentIdNumber)?.carrier.name || "");
    let statusValue = "";
    if (getShipmentByTrackingNumber(shipmentIdNumber)?.status == 1) {
      statusValue = "В пути";
    } else {
      statusValue = "Доставлен";
    }
    setStatus(statusValue);
  }, [isSuccessShipments, isSuccessCarriers]);

  // запрос на редактирование доставки
  const [editShipment] = useEditShipmentMutation();

  // состояние банера "Не получилось отредактировать"
  const [isShowError, setIsShowError] = useState(false);

  // обработчик кнопки "Готово"
  const editShipmentHandler = async () => {
    // проверяем, что нет ошибок
    if (statusMessage != "") {
      return;
    }
    // проверяем, что все поля заполнены
    if (carrier == "" || status == "") {
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
      const response = await editShipment({ tracking_number: shipmentIdNumber, carrier_id: getIdByCarrierName(carrier), status: statusNum }).unwrap();
      console.log(`Доставка с трек-номером ${shipmentIdNumber} успешно отредактирована:`, response);
      navigate("/shipments");
    } catch (error) {
      console.error("Доставку не получилось отредактировать:", error);
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
              Редактирование <span className="text-starkit-electric">доставки</span>
            </h3>
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
            <Button onClick={editShipmentHandler} text="Готово" />
          </div>
        </div>
        {isShowError && (
          <div className="h-dvh fixed inset-0 bg-black/50 bg-none flex justify-center items-center z-[8]">
            <div className="w-[425px] px-6 pb-6 flex flex-col justify-center items-center bg-white rounded-[40px]">
              <img src="/images/robot_404.png" className="mt-[-128px] mb-8" />
              <h1 className="mb-4 text-center text-starkit-electric text-2xl font-bold">Извините</h1>
              <span className="mb-9 text-center text-black text-base font-medium">
                Доставку не получилось отредактировать.<span className="text-starkit-electric"> Уже начали исправлять данную проблему.</span>
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
