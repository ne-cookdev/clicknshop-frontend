import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetShipmentsQuery } from "../features/api/shipmentsApi";

import { ShipmentCard } from "../components/ShipmentCard/ShipmentCard";
import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Button } from "../components/Button/Button";

import type { Shipment } from "../entities/shipments/model/types";

export const Shipmentspage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role !== "admin" && role !== "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

  // получаем все доставки
  const { data: shipments, isSuccess: isSuccessShipments, refetch } = useGetShipmentsQuery();

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

  if (isSuccessShipments) {
    if (shipments.length == 0) {
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
                <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Доставщики</h2>
              </a>
              <a href="/shipments">
                <h2 className="cursor-pointer text-xl font-medium text-starkit-electric">Доставки</h2>
              </a>
              <a href="/warehouses">
                <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Склады</h2>
              </a>
              <a href="/stocks">
                <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Количество товаров</h2>
              </a>
            </div>
          </div>
          <div className="py-32 flex items-center justify-center flex-col">
            <img src="/images/robot_404.png" className="mb-6" />
            <p className="text-black font-bold text-2xl text-center mb-5">Пока нет доставок</p>
            <a href="/shipments/create">
              <Button text="Новая доставка" className="px-14" />
            </a>
          </div>
        </main>
      );
    } else {
      return (
        <>
          <main className="bg-starkit-magnolia">
            <LogoutHeader role={role ? role : "user"} onClickHandler={handleLogoutProcess} />
            <div className="grid auto-rows-auto gap-y-5 justify-center items-center">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-x-5 items-center">
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
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Доставщики</h2>
                  </a>
                  <a href="/shipments">
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-electric">Доставки</h2>
                  </a>
                  <a href="/warehouses">
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Склады</h2>
                  </a>
                  <a href="/stocks">
                    <h2 className="cursor-pointer text-xl font-medium text-starkit-lavender">Количество товаров</h2>
                  </a>
                </div>
                <div>
                  <a href="/shipments/create">
                    <Button text="Новая доставка" className="px-14" />
                  </a>
                </div>
              </div>

              <div className="mb-12 grid grid-cols-4 gap-y-12 gap-x-16">
                {shipments.map((shipment: Shipment) => (
                  <ShipmentCard key={shipment.tracking_number} orderNum={shipment.order.number} status={shipment.status} trackNum={shipment.tracking_number} carrier={shipment.carrier.name} />
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
