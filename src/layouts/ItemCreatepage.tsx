import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useCreateItemMutation, useGetCategoriesQuery } from "../features/api/api";

import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import { Button } from "../components/Button/Button";

export const ItemCreatepage = () => {
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
  const getIdByName = (name: string) => {
    const category = categories?.find((category) => category.name === name);
    return category?.id;
  };

  const [nameCategory, setNameCategory] = useState<string>("");
  const [categoryMessage, setCategoryMessage] = useState<string>("");
  const inputCategoryHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNameCategory(value);
    const categoryExists = categories?.some((category) => category.name.toLowerCase() === value.toLowerCase());
    if (!categoryExists) {
      setCategoryMessage("Такой категории не существует.");
    } else {
      setCategoryMessage("");
    }
  };

  const [imageRef, setImageRef] = useState<string>("");
  const inputImageRefHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setImageRef(value);
  };

  const [name, setName] = useState<string>("");
  const inputNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);
  };

  const [description, setDescription] = useState("");
  const handleChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const [weight, setWeight] = useState<string>("");
  const inputWeightHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWeight(value);
  };

  const [price, setPrice] = useState<string>("");
  const inputPriceHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPrice(value);
  };

  const [length, setLength] = useState<string>("");
  const inputLengthHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLength(value);
  };

  const [width, setWidth] = useState<string>("");
  const inputWidthHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWidth(value);
  };

  const [height, setHeight] = useState<string>("");
  const inputHeightHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setHeight(value);
  };

  const [createItem, { isLoading, isError, isSuccess }] = useCreateItemMutation();
  const [isShowError, setIsShowError] = useState(false);

  const createItemHandler = async () => {
    if (categoryMessage != "") {
      return;
    }
    if (nameCategory == "" || imageRef == "" || name == "" || description == "" || weight == "" || price == "" || length == "" || width == "" || height == "") {
      return;
    }

    try {
      const response = await createItem({ category_id: getIdByName(nameCategory) || 1, image_ref: imageRef, name: name, description: description, weight: weight, price: price, length: length, width: width, height: height }).unwrap();
      console.log(`Create product "${name}" successfully:`, response);
      navigate("/catalog");
    } catch (error) {
      console.error("Product wasn't create:", error);
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
              Добавление <span className="text-starkit-electric">товара</span>
            </h3>
            <div className="mb-2">
              <Label text="Категория" />
              <div className="auth_div_for_input">
                <Input onChange={inputCategoryHandler} value={nameCategory} isError={categoryMessage != ""} type="text" placeholder="Введите название категории..." />
                {categoryMessage != "" && (
                  <div className="auth_div_svg">
                    <ErrorIcon className="auth_error_svg" />
                  </div>
                )}
                {categoryMessage != "" && <p className="auth_error_text">{categoryMessage}</p>}
              </div>
            </div>
            <div className="mb-2">
              <Label text="Картинка" />
              <div className="auth_div_for_input">
                <Input onChange={inputImageRefHandler} value={imageRef} isError={false} type="text" placeholder="Введите ссылку на картинку..." />
              </div>
            </div>
            <div className="mb-2">
              <Label text="Название" />
              <div className="auth_div_for_input">
                <Input onChange={inputNameHandler} value={name} isError={false} type="text" placeholder="Введите название товара..." />
              </div>
            </div>
            <div className="mb-2">
              <Label text="Описание" />
              <textarea onChange={handleChangeDescription} value={description} className="w-full h-[105px] p-3.5 border border-starkit-lavender focus:outline-starkit-indigo text-base rounded-[14px]" placeholder="Введите описание товара..." />
            </div>
            <div className="mb-2">
              <div className="grid grid-cols-2 gap-x-3.5">
                <div>
                  <Label text="Вес" />
                  <div className="auth_div_for_input">
                    <Input onChange={inputWeightHandler} value={weight} isError={false} type="text" placeholder="" />
                  </div>
                </div>
                <div>
                  <Label text="Цена" />
                  <div className="auth_div_for_input">
                    <Input onChange={inputPriceHandler} value={price} isError={false} type="text" placeholder="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-5">
              <div className="grid grid-cols-3 gap-x-2.5">
                <div>
                  <Label text="Длина" />
                  <div className="auth_div_for_input">
                    <Input onChange={inputLengthHandler} value={length} isError={false} type="text" placeholder="" />
                  </div>
                </div>
                <div>
                  <Label text="Ширина" />
                  <div className="auth_div_for_input">
                    <Input onChange={inputWidthHandler} value={width} isError={false} type="text" placeholder="" />
                  </div>
                </div>
                <div>
                  <Label text="Высота" />
                  <div className="auth_div_for_input">
                    <Input onChange={inputHeightHandler} value={height} isError={false} type="text" placeholder="" />
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={createItemHandler} text="Готово" />
          </div>
        </div>
        {isShowError && (
          <div className="h-dvh fixed inset-0 bg-black/50 bg-none flex justify-center items-center z-[8]">
            <div className="w-[425px] px-6 pb-6 flex flex-col justify-center items-center bg-white rounded-[40px]">
              <img src="/images/robot_404.png" className="mt-[-128px] mb-8" />
              <h1 className="mb-4 text-center text-starkit-electric text-2xl font-bold">Извините</h1>
              <span className="mb-9 text-center text-black text-base font-medium">
                Товар не получилось создать.<span className="text-starkit-electric"> Уже начали исправлять данную проблему.</span>
              </span>
              <a href="/catalog" className="w-full">
                <Button onClick={() => setIsShowError(false)} text="Понятно" />
              </a>
            </div>
          </div>
        )}
      </main>
    </>
  );
};
