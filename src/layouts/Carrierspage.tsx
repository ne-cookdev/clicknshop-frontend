import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetCarriersQuery } from "../features/api/carriersApi";

import { CarrierCard } from "../components/CarrierCard/CarrierCard";
import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Button } from "../components/Button/Button";

import { Carrier } from "../entities/carriers/model/types";

export const Carrierspage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role !== "admin" && role !== "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

  // получаем все категории
  const { data: carriers, isSuccess: isSuccessCarriers, error, refetch } = useGetCarriersQuery();

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

  if (isSuccessCarriers) {
    if (carriers.length == 0) {
      return (
        <main className="body_404">
          <LogoutHeader role={role ? role : "user"} onClickHandler={handleLogoutProcess} />
          <div className=" w-full px-80 flex flex-row justify-between items-center">
            <div className="flex flex-row gap-x-5">
              <a href="/categories">
                <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Категории</h2>
              </a>
              <a href="/products">
                <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Товары</h2>
              </a>
              <a href="/orders">
                <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Заказы</h2>
              </a>
              <a href="/carriers">
                <h2 className="cursor-pointer text-xl font-medium text-starkit-electric">Доставщики</h2>
              </a>
              <a href="/shipments">
                <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Доставки</h2>
              </a>
              <a href="/warehouses">
                <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Склады</h2>
              </a>
            </div>
          </div>
          <div className="py-32 flex items-center justify-center flex-col">
            <img src="/images/robot_404.png" className="mb-6" />
            <p className="text-black font-bold text-2xl text-center mb-5">Пока нет доставщиков</p>
            <a href="/carriers/create">
              <Button text="Новый доставщик" className="px-14" />
            </a>
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
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Категории</h2>
                  </a>
                  <a href="/products">
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Товары</h2>
                  </a>
                  <a href="/orders">
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Заказы</h2>
                  </a>
                  <a href="/carriers">
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-electric">Доставщики</h2>
                  </a>
                  <a href="/shipments">
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Доставки</h2>
                  </a>
                  <a href="/warehouses">
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Склады</h2>
                  </a>
                </div>
                <div>
                  <a href="/carriers/create">
                    <Button text="Новый доставщик" className="px-14" />
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-y-[26px] gap-x-[26px]">
                {carriers.map((carrier: Carrier) => (
                  <CarrierCard key={carrier.id} id={carrier.id} name={carrier.name} />
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
