import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetStocksQuery, useEditStockMutation } from "../features/api/stocksApi";
import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";

type StockParams = {
  stockId: string;
};

export const StockEditpage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role !== "admin" && role !== "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

  // id кол-ва
  const { stockId } = useParams<StockParams>();
  const stockIdNumber = parseInt(stockId ?? "", 10);

  // получаем все кол-ва
  const { data: stocks, isSuccess: isSuccessStocks, error, refetch } = useGetStocksQuery();

  // получение кол-ва по id
  const getStockById = (id: number) => {
    const stock = stocks?.find((stock) => stock.id === id);
    return stock;
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
  const [quantity, setQuantity] = useState<string>(getStockById(stockIdNumber)?.quantity.toString() || "");

  // обработчик инпута кол-ва
  const inputQuantityHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuantity(value);
  };

  // обновляем значения инпутов после запросов
  useEffect(() => {
    if (!isSuccessStocks) {
      return;
    }
    setQuantity(getStockById(stockIdNumber)?.quantity.toString() || "");
  }, [isSuccessStocks]);

  // запрос на редактирование кол-ва
  const [editStock] = useEditStockMutation();

  // состояние банера "Не получилось отредактировать"
  const [isShowError, setIsShowError] = useState(false);

  // обработчик кнопки "Готово"
  const editStockHandler = async () => {
    // проверяем, что все поля заполнены
    if (quantity == "") {
      return;
    }
    // делаем запрос
    try {
      const response = await editStock({ id: stockIdNumber, quantity: parseInt(quantity, 10) }).unwrap();
      console.log(`Кол-во с id ${stockIdNumber} успешно отредактировано:`, response);
      navigate("/stocks");
    } catch (error) {
      console.error("Кол-во не получилось отредактировать:", error);
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
              Редактирование <span className="text-starkit-electric">количества товара на складе</span>
            </h3>
            <div className="mb-5">
              <Label text="Количество товара" />
              <div className="auth_div_for_input">
                <Input onChange={inputQuantityHandler} value={quantity} isError={false} type="text" placeholder="Введите количество..." />
              </div>
            </div>
            <Button onClick={editStockHandler} text="Готово" />
          </div>
        </div>
        {isShowError && (
          <div className="h-dvh fixed inset-0 bg-black/50 bg-none flex justify-center items-center z-[8]">
            <div className="w-[425px] px-6 pb-6 flex flex-col justify-center items-center bg-white rounded-[40px]">
              <img src="/images/robot_404.png" className="mt-[-128px] mb-8" />
              <h1 className="mb-4 text-center text-starkit-electric text-2xl font-bold">Извините</h1>
              <span className="mb-9 text-center text-black text-base font-medium">
                Количество товара на складе не получилось отредактировать.<span className="text-starkit-electric"> Уже начали исправлять данную проблему.</span>
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
