import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { useRegisterUserMutation } from "../features/api/accountsApi";

import { Title } from "../components/Title/Title";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import { CloseEyeIcon } from "../components/Icons/CloseEyeIcon";
import { OpenEyeIcon } from "../components/Icons/OpenEyeIcon";
import { Button } from "../components/Button/Button";

import { RegisterData, AuthErrorResponse } from "../entities/account/model/types";

export const Registerpage = () => {
  /* скрыть/показать пароль */
  const [passInputType, setPassInputType] = useState("password");
  const [pass2InputType, setPass2InputType] = useState("password");
  const togglePassInput = () => {
    if (passInputType === "password") {
      setPassInputType("text");
    } else {
      setPassInputType("password");
    }
  };
  const togglePass2Input = () => {
    if (pass2InputType === "password") {
      setPass2InputType("text");
    } else {
      setPass2InputType("password");
    }
  };

  /* запрос + ошибки с бэка */
  const navigate = useNavigate();
  const handleSubmitProcess = async (data: RegisterData) => {
    try {
      const email = data.emailValue;
      const password = data.passwordValue;
      const returned = await registerUser({ email, password }).unwrap();
      const refreshtoken = returned?.refresh ?? null;
      localStorage.setItem("refresh", refreshtoken);
      const accesstoken = returned?.access ?? null;
      localStorage.setItem("access", accesstoken);
      const role = returned?.role ?? null;
      localStorage.setItem("role", role);
      navigate("/auth/login");
    } catch (error) {
      const errorResponse = error as AuthErrorResponse;
      if (errorResponse.data?.email) {
        setError("emailValue", { type: "custom", message: errorResponse.data?.email });
      }
      if (errorResponse.data?.password) {
        setError("passwordValue", { type: "custom", message: errorResponse.data?.password });
      }
    }
  };
  const [registerUser, { isLoading: isCreating }] = useRegisterUserMutation();

  /* валидация формы */
  const {
    control,
    setError,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>();

  const passwordValue = watch("passwordValue", ""); // для сравнения пароля и подтверждения пароля

  return (
    <>
      <main className="auth_main">
        <div className="auth_form_background">
          <form
            onSubmit={handleSubmit((data) => {
              handleSubmitProcess(data);
            })}
          >
            <Title blacktext="Приветствуем тебя на" className="auth_title" />
            <div className={errors.emailValue ? "mb-3" : "mb-8"}>
              <Label text="Почта" />
              <div className="auth_div_for_input">
                <Controller
                  control={control}
                  rules={{
                    required: "Обязательное поле",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Некорректный формат почты",
                    },
                  }}
                  render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} type="text" id="emailValue" name="emailValue" isError={!!errors.emailValue} placeholder="user_name@mail.com" />}
                  name="emailValue"
                />
                {errors.emailValue && (
                  <div className="auth_div_svg">
                    <ErrorIcon className="auth_error_svg" />
                  </div>
                )}
                {errors.emailValue && <p className="auth_error_text">{errors.emailValue.message}</p>}
              </div>
            </div>

            <div className={errors.passwordValue ? "mb-5" : "mb-10"}>
              <Label text="Пароль" />
              <div className="auth_div_for_input">
                <Controller
                  control={control}
                  rules={{
                    required: "Обязательное поле",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{6,}$/,
                      message: "Пароль должен быть не менее 6 символов, содержать латинские заглавные буквы, строчные буквы и цифры",
                    },
                    maxLength: {
                      value: 128,
                      message: "Пароль должен быть не более 128 символов, содержать латинские заглавные буквы, строчные буквы и цифры",
                    },
                  }}
                  render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} type={passInputType} id="passwordValue" name="passwordValue" isError={!!errors.passwordValue} placeholder="*****************" />}
                  name="passwordValue"
                />
                <div className="auth_div_svg">
                  {passInputType == "text" && <OpenEyeIcon onClick={togglePassInput} className="auth_eye_svg" />}
                  {passInputType == "password" && <CloseEyeIcon onClick={togglePassInput} className="auth_eye_svg" />}
                  {errors.passwordValue && <ErrorIcon className="auth_error_svg" />}
                </div>
                {errors.passwordValue && <p className="auth_error_text">{errors.passwordValue.message}</p>}
              </div>
            </div>

            <div className={errors.passwordValue2 ? "mb-5" : "mb-10"}>
              <Label text="Подтверждение пароля" />
              <div className="auth_div_for_input">
                <Controller
                  control={control}
                  rules={{
                    required: "Обязательное поле",
                    validate: (value) => value === passwordValue || "Подтверждение пароля не совпадает",
                  }}
                  render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} type={pass2InputType} id="passwordValue2" name="passwordValue2" isError={!!errors.passwordValue2} placeholder="*****************" />}
                  name="passwordValue2"
                />
                <div className="auth_div_svg">
                  {pass2InputType == "text" && <OpenEyeIcon onClick={togglePass2Input} className="auth_eye_svg" />}
                  {pass2InputType == "password" && <CloseEyeIcon onClick={togglePass2Input} className="auth_eye_svg" />}
                  {errors.passwordValue2 && <ErrorIcon className="auth_error_svg" />}
                </div>
                {errors.passwordValue2 && <p className="auth_error_text">{errors.passwordValue2.message}</p>}
              </div>
            </div>
            <div className="mb-10">
              <Button type="submit" text="Зарегистрироваться" />
            </div>

            <div className="register_div_login">
              <span className="register_span_login">
                Есть аккаунт?{" "}
                <a href="/auth/login" className="register_a_login">
                  Войти
                </a>
              </span>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};
