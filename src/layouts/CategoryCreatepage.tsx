import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetCategoriesQuery, useCreateCategoryMutation } from "../features/api/api";

import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import { Button } from "../components/Button/Button";

export const CategoryCreatepage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin" && role !== "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

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

  // запрос данных с бэка
  const { data: categories, isLoading: isGettingCourses, isSuccess: isSuccessCategories, isError: isErrorCategories, error, refetch } = useGetCategoriesQuery();

  /*const categories = [
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

  const [nameCategory, setNameCategory] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNameCategory(value);
    const categoryExists = categories?.some((category) => category.name.toLowerCase() === value.toLowerCase());
    if (categoryExists) {
      setMessage("Эта категория уже существует.");
    } else {
      setMessage("");
    }
  };

  const [createCategory, { isLoading, isError, isSuccess }] = useCreateCategoryMutation();
  const [isShowError, setIsShowError] = useState(false);

  const createCategoryHandler = async () => {
    if (message != "") {
      return;
    }
    if (nameCategory == "") {
      return;
    }

    try {
      const response = await createCategory({ name: nameCategory.charAt(0).toUpperCase() + nameCategory.slice(1).toLowerCase() }).unwrap();
      console.log(`create category "${nameCategory}" successfully:`, response);
      navigate("/categories");
    } catch (error) {
      console.error("Category wasn't create:", error);
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
              Добавление <span className="text-starkit-electric">категории</span>
            </h3>
            <div className={message != "" ? "mb-5" : "mb-10"}>
              <Label text="Название" />
              <div className="auth_div_for_input">
                <Input onChange={inputHandler} value={nameCategory} isError={message != ""} type="text" placeholder="Введите название категории..." />
                {message != "" && (
                  <div className="auth_div_svg">
                    <ErrorIcon className="auth_error_svg" />
                  </div>
                )}
                {message != "" && <p className="auth_error_text">{message}</p>}
              </div>
            </div>
            <Button onClick={createCategoryHandler} text="Готово" />
          </div>
        </div>
        {isShowError && (
          <div className="h-dvh fixed inset-0 bg-black/50 bg-none flex justify-center items-center z-[8]">
            <div className="w-[425px] px-6 pb-6 flex flex-col justify-center items-center bg-white rounded-[40px]">
              <img src="/images/robot_404.png" className="mt-[-128px] mb-8" />
              <h1 className="mb-4 text-center text-starkit-electric text-2xl font-bold">Извините</h1>
              <span className="mb-9 text-center text-black text-base font-medium">
                Категорию не получилось создать.<span className="text-starkit-electric"> Уже начали исправлять данную проблему.</span>
              </span>
              <a href="/categories" className="w-full">
                <Button onClick={() => setIsShowError(false)} text="Понятно" />
              </a>
            </div>
          </div>
        )}
      </main>
    </>
  );
};
