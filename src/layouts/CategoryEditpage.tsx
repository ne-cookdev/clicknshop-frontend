import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetCategoriesQuery, useEditCategoryMutation } from "../features/api/categoriesApi";

import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
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

  // id категории
  const { categoryId } = useParams<CategoryParams>();
  const categoryIdNumber = parseInt(categoryId ?? "", 10);

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

  // получаем все категории
  const { data: categories, isSuccess: isSuccessCategories, error, refetch } = useGetCategoriesQuery();

  // определяем название категории по id
  const getNameOfCategoryById = (id: number) => {
    const category = categories?.find((category) => category.id === id);
    return category?.name;
  };

  // значение инпута
  const [nameCategory, setNameCategory] = useState<string>(getNameOfCategoryById(categoryIdNumber) || "");

  // значение ошибки для инпута
  const [message, setMessage] = useState<string>("");

  // обработчик инпута названия
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

  // обновляем значение инпута после запросов
  useEffect(() => {
    if (!isSuccessCategories) {
      return;
    }
    setNameCategory(getNameOfCategoryById(categoryIdNumber) || "");
  }, [isSuccessCategories]);

  // запрос на редактирование категории
  const [editCategory] = useEditCategoryMutation();

  // состояние банера "Не получилось отредактировать"
  const [isShowError, setIsShowError] = useState(false);

  // обработчик кнопки "Готово"
  const editCategoryHandler = async () => {
    // проверяем, что нет ошибок
    if (message != "") {
      return;
    }
    // проверяем, что поле заполнены
    if (nameCategory == "") {
      return;
    }
    // проверяем, что знаечния изменились
    if (nameCategory == getNameOfCategoryById(categoryIdNumber)) {
      return;
    }
    // делаем запрос
    try {
      const response = await editCategory({ id: categoryIdNumber, name: nameCategory.charAt(0).toUpperCase() + nameCategory.slice(1).toLowerCase() }).unwrap();
      console.log(`Категория с id ${categoryIdNumber} успешно отредактирована:`, response);
      navigate("/categories");
    } catch (error) {
      console.error("Категорию не получилось отредактировать:", error);
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
