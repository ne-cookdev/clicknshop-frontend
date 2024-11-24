import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetHistoryQuery } from "../features/api/api";

import { HistoryCard } from "../components/HistoryCard/HistoryCard";
import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Button } from "../components/Button/Button";

import { HistoryItem } from "../entities/catalog/model/types";

export const Historypage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "admin" || role === "staff") {
      navigate("/");
    }
  }, [role, navigate]);

  // запрос данных с бэка
  //const { data, isLoading: isGettingCourses, isSuccess, isError, error, refetch } = useGetHistoryQuery();

  // Извлекаем данные из localStorage
  const orderData = JSON.parse(localStorage.getItem("order") ?? "{}");

  const data = [
    {
      id: 4,
      name: "Бананы",
      image_ref: "https://storage.yandexcloud.net/platform-test-s3/lesson1_preview.png",
      price: 1,
      quantity: 5,
    },
    {
      id: 5,
      name: "Бананы",
      image_ref: "https://storage.yandexcloud.net/platform-test-s3/lesson1_preview.png",
      price: 1,
      quantity: 5,
    },
    {
      id: 6,
      name: "Бананы",
      image_ref: "https://storage.yandexcloud.net/platform-test-s3/lesson1_preview.png",
      price: 1,
      quantity: 5,
    },
  ];

  // запрос на выход
  const [logoutUser, { isLoading: isLogoutLoading }] = useLogoutUserMutation();
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
  }, []);

  if (isSuccess) {*/
  if (data.length == 0) {
    return (
      <main className="body_404">
        <LogoutHeader role={role ? role : "user"} onClickHandler={handleLogoutProcess} />
        <div className="py-24 flex items-center justify-center flex-col">
          <img src="/images/robot_404.png" className="mb-6" />
          <p className="text-black font-bold text-2xl text-center mb-5">Вы пока ничего не заказали</p>
          <a className="w-full flex justify-center" href="/catalog">
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
          <div className="flex justify-center flex-col items-center">
            <div>поиск</div>
            <div className="grid grid-cols-4 gap-y-12 gap-x-16">
              {data.map((item: HistoryItem) => (
                <HistoryCard order={orderData} key={item.id} id={item.id} name={item.name} image={item.image_ref} price={item.price} quantity={item.quantity} />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }
  /*} else {
    return null;
  }*/
};
