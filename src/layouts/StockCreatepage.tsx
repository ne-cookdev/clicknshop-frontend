import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useCreateStockMutation } from "../features/api/stocksApi";
import { useGetProductsQuery } from "../features/api/productsApi";
import { useGetWarehousesQuery } from "../features/api/warehousesApi";

import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";

export const StockCreatepage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role !== "admin" && role !== "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

  // получаем все товары
  const { data: products, refetch } = useGetProductsQuery();
  // получаем все склады
  const { data: warehouses } = useGetWarehousesQuery();

  // определяем id товара по названию
  const getIdByNameOfProduct = (name: string) => {
    const product = products?.find((product) => product.name === name);
    return product?.id;
  };
  // определяем id склада по названию
  const getIdByNameOfWarehouse = (name: string) => {
    const warehouse = warehouses?.find((warehouse) => warehouse.name === name);
    return warehouse?.id;
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
  const [productName, setProductName] = useState<string>("");
  const [warehouseName, setWarehouseName] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  // обработчик инпута названия товара
  const inputProductNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setProductName(value);
  };
  // обработчик инпута названия склада
  const inputWarehouseNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWarehouseName(value);
  };
  // обработчик инпута кол-ва товара на складе
  const inputQuantityHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuantity(value);
  };

  // запрос на создание кол-ва
  const [createStock] = useCreateStockMutation();

  // состояние банера "Не получилось создать"
  const [isShowError, setIsShowError] = useState(false);

  // обработчик кнопки "Готово"
  const createStockHandler = async () => {
    // проверяем, что все поля заполнены
    if (productName == "" || warehouseName == "" || quantity == "") {
      return;
    }
    // делаем запрос
    try {
      const response = await createStock({ quantity: parseInt(quantity, 10), product_id: getIdByNameOfProduct(productName), warehouse_id: getIdByNameOfWarehouse(warehouseName) }).unwrap();
      console.log(`Кол-во для товара "${productName}" успешно создано:`, response);
      navigate("/stocks");
    } catch (error) {
      console.error("Кол-во не получилось создать:", error);
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
              Добавление <span className="text-starkit-electric"> количества товара на складе</span>
            </h3>
            <div className="mb-5">
              <Label text="Название товара" />
              <div className="auth_div_for_input">
                <Input onChange={inputProductNameHandler} value={productName} isError={false} type="text" placeholder="Введите название товара..." />
              </div>
            </div>
            <div className="mb-5">
              <Label text="Название склада" />
              <div className="auth_div_for_input">
                <Input onChange={inputWarehouseNameHandler} value={warehouseName} isError={false} type="text" placeholder="Введите название склада..." />
              </div>
            </div>
            <div className="mb-5">
              <Label text="Количество товара" />
              <div className="auth_div_for_input">
                <Input onChange={inputQuantityHandler} value={quantity} isError={false} type="text" placeholder="Введите количество..." />
              </div>
            </div>
            <Button onClick={createStockHandler} text="Готово" />
          </div>
        </div>
        {isShowError && (
          <div className="h-dvh fixed inset-0 bg-black/50 bg-none flex justify-center items-center z-[8]">
            <div className="w-[425px] px-6 pb-6 flex flex-col justify-center items-center bg-white rounded-[40px]">
              <img src="/images/robot_404.png" className="mt-[-128px] mb-8" />
              <h1 className="mb-4 text-center text-starkit-electric text-2xl font-bold">Извините</h1>
              <span className="mb-9 text-center text-black text-base font-medium">
                Количество товара на складе не получилось создать.<span className="text-starkit-electric"> Уже начали исправлять данную проблему.</span>
              </span>
              <a href="/stocks" className="w-full">
                <Button onClick={() => setIsShowError(false)} text="Понятно" />
              </a>
            </div>
          </div>
        )}
      </main>
    </>
  );
};
