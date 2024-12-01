import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useEditItemMutation, useGetCategoriesQuery, useGetItemsQuery } from "../features/api/api";

import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import { Button } from "../components/Button/Button";

type ItemParams = {
  itemId: string;
};

export const ItemEditpage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin" && role !== "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

  const { itemId } = useParams<ItemParams>(); // id товара (строка)
  const itemIdNumber = parseInt(itemId ?? "", 10); // id товара (число)

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

  // запрос всех категорий
  const { data: categories, isLoading: isGettingСategories, isSuccess: isSuccessCategories, isError: isErrorCategories, error: categoriesErr } = useGetCategoriesQuery();
  // получение имени категории по id
  const getNameOfCategoryById = (id: number) => {
    const category = categories?.find((category) => category.id === id);
    return category?.name;
  };
  const getIdByNameOfCategory = (name: string) => {
    const category = categories?.find((category) => category.name === name);
    return category?.id;
  };

  // запрос всех товаров
  const { data: items, isLoading: isGettingItems, isSuccess: isSuccessItems, isError: isErrorItems, error: itemsErr, refetch } = useGetItemsQuery();
  // получение товара по id
  const getItemById = (id: number) => {
    const item = items?.find((item) => item.id === id);
    return item;
  };
  console.log("item", getItemById(itemIdNumber));

  const [nameCategory, setNameCategory] = useState<string>(getNameOfCategoryById(getItemById(itemIdNumber)?.category?.id || 1) || "");
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

  const [imageRef, setImageRef] = useState<string>(getItemById(itemIdNumber)?.image_ref || "");
  const inputImageRefHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setImageRef(value);
  };

  const [name, setName] = useState<string>(getItemById(itemIdNumber)?.name || "");
  const inputNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);
  };

  const [description, setDescription] = useState(getItemById(itemIdNumber)?.description || "");
  const handleChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const [weight, setWeight] = useState<string>(getItemById(itemIdNumber)?.weight?.toString() || "");
  const inputWeightHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWeight(value);
  };

  const [price, setPrice] = useState<string>(getItemById(itemIdNumber)?.price?.toString() || "");
  const inputPriceHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPrice(value);
  };

  const [length, setLength] = useState<string>(getItemById(itemIdNumber)?.length?.toString() || "");
  const inputLengthHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLength(value);
  };

  const [width, setWidth] = useState<string>(getItemById(itemIdNumber)?.width?.toString() || "");
  const inputWidthHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWidth(value);
  };

  const [height, setHeight] = useState<string>(getItemById(itemIdNumber)?.height?.toString() || "");
  const inputHeightHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setHeight(value);
  };
  useEffect(() => {
    if (!isSuccessItems || !isSuccessCategories) {
      return;
    }
    setNameCategory(getNameOfCategoryById(getItemById(itemIdNumber)?.category?.id || 1) || "");
    setImageRef(getItemById(itemIdNumber)?.image_ref || "");
    setName(getItemById(itemIdNumber)?.name || "");
    setDescription(getItemById(itemIdNumber)?.description || "");
    setWeight(getItemById(itemIdNumber)?.weight?.toString() || "");
    setPrice(getItemById(itemIdNumber)?.price?.toString() || "");
    setLength(getItemById(itemIdNumber)?.length?.toString() || "");
    setWidth(getItemById(itemIdNumber)?.width?.toString() || "");
    setHeight(getItemById(itemIdNumber)?.height?.toString() || "");
  }, [isSuccessItems, isSuccessCategories]);

  const [editItem, { isLoading, isError, isSuccess }] = useEditItemMutation();
  const [isShowError, setIsShowError] = useState(false);

  const editItemHandler = async () => {
    if (categoryMessage != "") {
      return;
    }
    if (nameCategory == "" || name == "" || description == "" || weight == "" || price == "" || length == "" || width == "" || height == "") {
      return;
    }

    try {
      const response = await editItem({ id: itemIdNumber, category_id: getIdByNameOfCategory(nameCategory) || 1, image_ref: imageRef, name: name, description: description, weight: weight, price: price, length: length, width: width, height: height }).unwrap();
      console.log(`Edit product successfully:`, response);
      navigate("/catalog");
    } catch (error) {
      console.error("Product wasn't edit:", error);
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
              Редактирование <span className="text-starkit-electric">товара</span>
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
            <Button onClick={editItemHandler} text="Готово" />
          </div>
        </div>
        {isShowError && (
          <div className="h-dvh fixed inset-0 bg-black/50 bg-none flex justify-center items-center z-[8]">
            <div className="w-[425px] px-6 pb-6 flex flex-col justify-center items-center bg-white rounded-[40px]">
              <img src="/images/robot_404.png" className="mt-[-128px] mb-8" />
              <h1 className="mb-4 text-center text-starkit-electric text-2xl font-bold">Извините</h1>
              <span className="mb-9 text-center text-black text-base font-medium">
                Товар не получилось отредактировать.<span className="text-starkit-electric"> Уже начали исправлять данную проблему.</span>
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
