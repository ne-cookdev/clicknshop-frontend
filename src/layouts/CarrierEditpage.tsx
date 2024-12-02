import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetCarriersQuery, useEditCarrierMutation } from "../features/api/carriersApi";

import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";

type CarrierParams = {
  carrierId: string;
};

export const CarrierEditpage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role !== "admin" && role !== "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

  // id доставщика
  const { carrierId } = useParams<CarrierParams>();
  const сarrierIdNumber = parseInt(carrierId ?? "", 10);

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

  // получаем всех доставщиков
  const { data: carriers, isSuccess: isSuccessCarriers, error, refetch } = useGetCarriersQuery();
  // определяем название доставщика по id
  const getNameOfCarrierById = (id: number) => {
    const carrier = carriers?.find((carrier) => carrier.id === id);
    return carrier?.name;
  };

  // значение инпута
  const [nameCarrier, setNameCarrier] = useState<string>(getNameOfCarrierById(сarrierIdNumber) || "");

  // значение ошибки для инпута
  const [message, setMessage] = useState<string>("");

  // обработчик инпута названия
  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNameCarrier(value);
    const carrierExists = carriers?.some((carrier) => carrier.name.toLowerCase() === value.toLowerCase());
    if (carrierExists) {
      setMessage("Этот доставщик уже существует.");
    } else {
      setMessage("");
    }
  };

  // обновляем значение инпута после запросов
  useEffect(() => {
    if (!isSuccessCarriers) {
      return;
    }
    setNameCarrier(getNameOfCarrierById(сarrierIdNumber) || "");
  }, [isSuccessCarriers]);

  // запрос на редактирование доставщика
  const [editCarrier] = useEditCarrierMutation();

  // состояние банера "Не получилось отредактировать"
  const [isShowError, setIsShowError] = useState(false);

  // обработчик кнопки "Готово"
  const editCarrierHandler = async () => {
    // проверяем, что нет ошибок
    if (message != "") {
      return;
    }
    // проверяем, что поле заполнены
    if (nameCarrier == "") {
      return;
    }
    // проверяем, что значения изменились
    if (nameCarrier == getNameOfCarrierById(сarrierIdNumber)) {
      return;
    }
    // делаем запрос
    try {
      const response = await editCarrier({ id: сarrierIdNumber, name: nameCarrier }).unwrap();
      console.log(`Доставщик с id ${сarrierIdNumber} успешно отредактирован:`, response);
      navigate("/carriers");
    } catch (error) {
      console.error("Доставщика не получилось отредактировать:", error);
      setIsShowError(true);
    }
  };

  return (
    <>
      <main className="bg-starkit-magnolia">
        <LogoutHeader role={role ? role : "user"} onClickHandler={handleLogoutProcess} />
        <div className="mt-32 flex justify-center items-center">
          <div className="auth_form_background">
            <h3 className="w-full mb-10 text-3xl text-center font-bold">
              Редактирование <span className="text-starkit-electric">доставщика</span>
            </h3>
            <div className={message != "" ? "mb-5" : "mb-10"}>
              <Label text="Название" />
              <div className="auth_div_for_input">
                <Input onChange={inputHandler} value={nameCarrier} isError={message != ""} type="text" placeholder="Введите название доставщика..." />
                {message != "" && <p className="auth_error_text">{message}</p>}
              </div>
            </div>
            <Button onClick={editCarrierHandler} text="Готово" />
          </div>
        </div>
        {isShowError && (
          <div className="h-dvh fixed inset-0 bg-black/50 bg-none flex justify-center items-center z-[8]">
            <div className="w-[425px] px-6 pb-6 flex flex-col justify-center items-center bg-white rounded-[40px]">
              <img src="/images/robot_404.png" className="mt-[-128px] mb-8" />
              <h1 className="mb-4 text-center text-starkit-electric text-2xl font-bold">Извините</h1>
              <span className="mb-9 text-center text-black text-base font-medium">
                Доставщика не получилось отредактировать.<span className="text-starkit-electric"> Уже начали исправлять данную проблему.</span>
              </span>
              <a href="/carriers" className="w-full">
                <Button onClick={() => setIsShowError(false)} text="Понятно" />
              </a>
            </div>
          </div>
        )}
      </main>
    </>
  );
};
