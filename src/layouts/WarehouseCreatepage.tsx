import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetWarehousesQuery, useCreateWarehouseMutation } from "../features/api/warehousesApi";

import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";

export const WarehouseCreatepage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role !== "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

  // получаем всех доставщиков
  const { data: warehouses, error, refetch } = useGetWarehousesQuery();

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
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  // значения ошибок для инпута
  const [nameMessage, setMameMessage] = useState<string>("");

  // обработчик инпута названия склада
  const inputNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);
    const warehouseExists = warehouses?.some((warehouse) => warehouse.name.toLowerCase() === value.toLowerCase());
    if (warehouseExists) {
      setMameMessage("Такой склад уже существует.");
    } else {
      setMameMessage("");
    }
  };
  // обработчик инпута адреса склада
  const inputLocationHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocation(value);
  };

  // запрос на создание склада
  const [createWarehouse] = useCreateWarehouseMutation();

  // состояние банера "Не получилось создать"
  const [isShowError, setIsShowError] = useState(false);

  // обработчик кнопки "Готово"
  const createWarehouseHandler = async () => {
    // проверяем, что нет ошибок
    if (nameMessage != "") {
      return;
    }
    // проверяем, что все поля заполнены
    if (name == "" || location == "") {
      return;
    }
    // делаем запрос
    try {
      const response = await createWarehouse({ name: name, location: location }).unwrap();
      console.log(`Склад с именем "${name}" успешно создан:`, response);
      navigate("/warehouses");
    } catch (error) {
      console.error("Склад не получилось создать:", error);
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
              Добавление <span className="text-starkit-electric"> склада</span>
            </h3>
            <div className={nameMessage != "" ? "" : "mb-5"}>
              <Label text="Название" />
              <div className="auth_div_for_input">
                <Input onChange={inputNameHandler} value={name} isError={nameMessage != ""} type="text" placeholder="Введите название склада..." />
              </div>
              {nameMessage != "" && <p className="auth_error_text">{nameMessage}</p>}
            </div>
            <div className="mb-5">
              <Label text="Адрес" />
              <div className="auth_div_for_input">
                <Input onChange={inputLocationHandler} value={location} isError={false} type="text" placeholder="Введите адрес склада..." />
              </div>
            </div>
            <Button onClick={createWarehouseHandler} text="Готово" />
          </div>
        </div>
        {isShowError && (
          <div className="h-dvh fixed inset-0 bg-black/50 bg-none flex justify-center items-center z-[8]">
            <div className="w-[425px] px-6 pb-6 flex flex-col justify-center items-center bg-white rounded-[40px]">
              <img src="/images/robot_404.png" className="mt-[-128px] mb-8" />
              <h1 className="mb-4 text-center text-starkit-electric text-2xl font-bold">Извините</h1>
              <span className="mb-9 text-center text-black text-base font-medium">
                Склад не получилось создать.<span className="text-starkit-electric"> Уже начали исправлять данную проблему.</span>
              </span>
              <a href="/warehouses" className="w-full">
                <Button onClick={() => setIsShowError(false)} text="Понятно" />
              </a>
            </div>
          </div>
        )}
      </main>
    </>
  );
};
