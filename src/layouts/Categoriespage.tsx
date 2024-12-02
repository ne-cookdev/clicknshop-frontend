import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetCategoriesQuery } from "../features/api/api";

import { CategoryCard } from "../components/CategoryCard/CategoryCard";
import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Button } from "../components/Button/Button";

import { Category } from "../entities/catalog/model/types";

export const Categoriespage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin" && role !== "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

  // запрос данных с бэка
  const { data, isLoading: isGettingCourses, isSuccess, isError, error, refetch } = useGetCategoriesQuery();

  /*const data = [
    {
      id: 1,
      name: "Спорт",
    },
    {
      id: 2,
      name: "Фрукты",
    },
    {
      id: 3,
      name: "Еда",
    },
    {
      id: 4,
      name: "Дом",
    },
    {
      id: 5,
      name: "Электроника",
    },
    {
      id: 6,
      name: "Ароматерапия",
    },
  ];*/

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

  if (isSuccess) {
    if (data.length == 0) {
      return (
        <main className="body_404">
          <LogoutHeader role={role ? role : "user"} onClickHandler={handleLogoutProcess} />
          <div className="py-32 flex items-center justify-center flex-col">
            <img src="/images/robot_404.png" className="mb-6" />
            <p className="text-black font-bold text-2xl text-center mb-5">Пока нет категорий</p>
          </div>
        </main>
      );
    } else {
      return (
        <>
          <main className="bg-starkit-magnolia">
            <LogoutHeader role={role ? role : "user"} onClickHandler={handleLogoutProcess} />
            <div className="grid auto-cols-auto gap-y-5 justify-center items-center">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-x-5">
                  <a href="/categories">
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-electric">Категории</h2>
                  </a>
                  <a href="/products">
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Товары</h2>
                  </a>
                  <a href="/orders">
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Заказы</h2>
                  </a>
                  <a href="/deliveries">
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Доставки</h2>
                  </a>
                  <a href="/warehouses">
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Склады</h2>
                  </a>
                </div>
                <div>
                  <a href="/category/create">
                    <Button text="Новая категория" className="px-14" />
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-y-[26px] gap-x-[26px]">
                {data.map((category: Category) => (
                  <CategoryCard key={category.id} id={category.id} name={category.name} />
                ))}
              </div>
            </div>
          </main>
        </>
      );
    }
  } else {
    return null;
  }
};
