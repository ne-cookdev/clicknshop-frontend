import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetCategoriesQuery, useEditCategoryMutation } from "../features/api/api";

import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import { Button } from "../components/Button/Button";

type CategoryParams = {
  categoryId: string;
};

export const CategoryEditpage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin" && role !== "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

  // id категории (строка)
  const { categoryId } = useParams<CategoryParams>();

  // id категории (число)
  const categoryIdNumber = parseInt(categoryId ?? "", 10);

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

  // запрос данных с бэка
  //const { categories, isLoading: isGettingCourses, isSuccess, isError, error, refetch } = useGetCategoriesQuery();

  const categories = [
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
  ];

  const getNameById = (id: number) => {
    const category = categories.find((category) => category.id === id);
    return category ? category.name : "";
  };

  const [nameCategory, setNameCategory] = useState<string>(getNameById(categoryIdNumber));
  const [message, setMessage] = useState<string>("");

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNameCategory(value);
    const categoryExists = categories.some((category) => category.name.toLowerCase() === value.toLowerCase());
    if (categoryExists) {
      setMessage("Эта категория уже существует.");
    } else {
      setMessage("");
    }
  };

  const [editCategory, { isLoading, isError, isSuccess }] = useEditCategoryMutation();
  const [isShowError, setIsShowError] = useState(false);

  const editCategoryHandler = async () => {
    if (message != "") {
      return;
    }
    if (nameCategory == "") {
      return;
    }
    if (nameCategory == getNameById(categoryIdNumber)) {
      return;
    }

    try {
      const response = await editCategory({ id: categoryIdNumber, name: nameCategory.charAt(0).toUpperCase() + nameCategory.slice(1).toLowerCase() }).unwrap();
      console.log(`edit category successfully:`, response);
      navigate("/categories");
    } catch (error) {
      console.error("Category wasn't edit:", error);
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
              Редактирование <span className="text-starkit-electric">категории</span>
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
            <Button onClick={editCategoryHandler} text="Готово" />
          </div>
        </div>
        {isShowError && (
          <div className="h-dvh fixed inset-0 bg-black/50 bg-none flex justify-center items-center z-[8]">
            <div className="w-[425px] px-6 pb-6 flex flex-col justify-center items-center bg-white rounded-[40px]">
              <img src="/images/robot_404.png" className="mt-[-128px] mb-8" />
              <h1 className="mb-4 text-center text-starkit-electric text-2xl font-bold">Извините</h1>
              <span className="mb-9 text-center text-black text-base font-medium">
                Категорию не получилось отредактировать.<span className="text-starkit-electric"> Уже начали исправлять данную проблему.</span>
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
