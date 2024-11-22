import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetItemsQuery } from "../features/api/lessonsApi";

import { Card } from "../components/Card/Card";
import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";

import { Item } from "../entities/catalog/model/types";

export const Catalogpage = () => {
  // запрос данных с бэка
  //const { data, isLoading: isGettingCourses, isSuccess, isError, error, refetch } = useGetItemsQuery();

  // определяем роль пользователя
  const role = localStorage.getItem("role");

  const data = [
    {
      category: "Спорт",
      name: "Футбольный мяч",
      description: "Профессиональный матчевый футбольный мяч Лига чемпионов – официальный 5 размер и вес UEFA : длина окружности 68,6 см вес 450 г. Подходит для соревнований профессионалов и любительских тренировок.",
      image_ref: "https://storage.yandexcloud.net/platform-test-s3/lesson1_preview.png",
      price: 1237,
      quantity: 5,
    },
    {
      category: "Спорт",
      name: "Футбольный мяч",
      description: "Профессиональный матчевый футбольный мяч Лига чемпионов – официальный 5 размер и вес UEFA : длина окружности 68,6 см вес 450 г. Подходит для соревнований профессионалов и любительских тренировок.",
      image_ref: "https://storage.yandexcloud.net/platform-test-s3/lesson1_preview.png",
      price: 1237,
      quantity: 5,
    },
    {
      category: "Спорт",
      name: "Футбольный мяч",
      description: "Профессиональный матчевый футбольный мяч Лига чемпионов – официальный 5 размер и вес UEFA : длина окружности 68,6 см вес 450 г. Подходит для соревнований профессионалов и любительских тренировок.",
      image_ref: "https://storage.yandexcloud.net/platform-test-s3/lesson1_preview.png",
      price: 1237,
      quantity: 5,
    },
  ];

  // нужно для редиректа
  const navigate = useNavigate();

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
  }, []);*/

  /*if (isSuccess) {*/
  if (data.length === 0) {
    return (
      <main className="body_404">
        <div className="h-dvh flex items-center justify-center flex-col">
          <img src="/images/robot_404.png" className="mb-6" />
          <p className="text-starkit-electric font-bold text-7xl text-center">404</p>
          <p className="text-black font-bold text-2xl text-center mb-5">Пока нет доступных товаров</p>
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
              {data.map((item: Item) => (
                <Card key={item.id} role={role ? role : "user"} category={item.category} name={item.name} description={item.description} image={item.image_ref} price={item.price} quantity={item.quantity} />
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
