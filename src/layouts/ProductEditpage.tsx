import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetCategoriesQuery } from "../features/api/categoriesApi";
import { useEditProductMutation, useGetProductsQuery } from "../features/api/productsApi";

import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";

type ProductParams = {
  productId: string;
};

export const ProductEditpage = () => {
  // нужно для редиректа
  const navigate = useNavigate();

  // определяем роль пользователя
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role !== "admin" && role !== "superuser") {
      navigate("/");
    }
  }, [role, navigate]);

  // id товара
  const { productId } = useParams<ProductParams>();
  const productIdNumber = parseInt(productId ?? "", 10);

  // получаем все категории
  const { data: categories, isSuccess: isSuccessCategories } = useGetCategoriesQuery();

  // определяем название категории по id
  const getNameOfCategoryById = (id: number) => {
    const category = categories?.find((category) => category.id === id);
    return category?.name;
  };

  // определяем id категории по названию
  const getIdByNameOfCategory = (name: string) => {
    const category = categories?.find((category) => category.name === name);
    return category?.id;
  };

  // получаем все товары
  const { data: products, isSuccess: isSuccessProducts, error, refetch } = useGetProductsQuery();

  // получение товара по id
  const getProductById = (id: number) => {
    const product = products?.find((product) => product.id === id);
    return product;
  };

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

  // значения инпутов
  const [nameCategory, setNameCategory] = useState<string>(getNameOfCategoryById(getProductById(productIdNumber)?.category?.id || 1) || "");
  const [imageRef, setImageRef] = useState<string>(getProductById(productIdNumber)?.image_ref || "");
  const [name, setName] = useState<string>(getProductById(productIdNumber)?.name || "");
  const [description, setDescription] = useState(getProductById(productIdNumber)?.description || "");
  const [weight, setWeight] = useState<string>(getProductById(productIdNumber)?.weight?.toString() || "");
  const [price, setPrice] = useState<string>(getProductById(productIdNumber)?.price?.toString() || "");
  const [length, setLength] = useState<string>(getProductById(productIdNumber)?.length?.toString() || "");
  const [width, setWidth] = useState<string>(getProductById(productIdNumber)?.width?.toString() || "");
  const [height, setHeight] = useState<string>(getProductById(productIdNumber)?.height?.toString() || "");

  // значение ошибки для инпута
  const [categoryMessage, setCategoryMessage] = useState<string>("");

  // обработчик инпута категории
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
  // обработчик инпута картинки
  const inputImageRefHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setImageRef(value);
  };
  // обработчик инпута названия
  const inputNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);
  };
  // обработчик инпута описания
  const handleChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  // обработчик инпута веса
  const inputWeightHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWeight(value);
  };
  // обработчик инпута цены
  const inputPriceHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPrice(value);
  };
  // обработчик инпута длины
  const inputLengthHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLength(value);
  };
  // обработчик инпута ширины
  const inputWidthHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWidth(value);
  };
  // обработчик инпута высоты
  const inputHeightHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setHeight(value);
  };

  // обновляем значения инпутов после запросов
  useEffect(() => {
    if (!isSuccessProducts || !isSuccessCategories) {
      return;
    }
    setNameCategory(getNameOfCategoryById(getProductById(productIdNumber)?.category?.id || 1) || "");
    setImageRef(getProductById(productIdNumber)?.image_ref || "");
    setName(getProductById(productIdNumber)?.name || "");
    setDescription(getProductById(productIdNumber)?.description || "");
    setWeight(getProductById(productIdNumber)?.weight?.toString() || "");
    setPrice(getProductById(productIdNumber)?.price?.toString() || "");
    setLength(getProductById(productIdNumber)?.length?.toString() || "");
    setWidth(getProductById(productIdNumber)?.width?.toString() || "");
    setHeight(getProductById(productIdNumber)?.height?.toString() || "");
  }, [isSuccessProducts, isSuccessCategories]);

  // запрос на редактирование товара
  const [editProduct] = useEditProductMutation();

  // состояние банера "Не получилось отредактировать"
  const [isShowError, setIsShowError] = useState(false);

  // обработчик кнопки "Готово"
  const editProductHandler = async () => {
    // проверяем, что нет ошибок
    if (categoryMessage != "") {
      return;
    }
    // проверяем, что все поля (кроме картинки) заполнены
    if (nameCategory == "" || name == "" || description == "" || weight == "" || price == "" || length == "" || width == "" || height == "") {
      return;
    }
    // делаем запрос
    try {
      const response = await editProduct({ id: productIdNumber, category_id: getIdByNameOfCategory(nameCategory) || 1, image_ref: imageRef, name: name, description: description, weight: weight, price: price, length: length, width: width, height: height }).unwrap();
      console.log(`Продукт с id ${productIdNumber} успешно отредактирована:`, response);
      navigate("/products");
    } catch (error) {
      console.error("Продукт не получилось отредактировать:", error);
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
            <Button onClick={editProductHandler} text="Готово" />
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
              <a href="/products" className="w-full">
                <Button onClick={() => setIsShowError(false)} text="Понятно" />
              </a>
            </div>
          </div>
        )}
      </main>
    </>
  );
};
