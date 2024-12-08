import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { useLoginUserMutation } from "../features/api/accountsApi";

import { Title } from "../components/Title/Title";
import { Label } from "../components/Label/Label";
import { Input } from "../components/Input/Input";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import { CloseEyeIcon } from "../components/Icons/CloseEyeIcon";
import { OpenEyeIcon } from "../components/Icons/OpenEyeIcon";
import { Button } from "../components/Button/Button";

import { LoginData, AuthErrorResponse } from "../entities/account/model/types";

export const Loginpage = () => {
  /* скрыть/показать пароль */
  const [passInputType, setPassInputType] = useState("password");
  const togglePassInput = () => {
    if (passInputType === "password") {
      setPassInputType("text");
    } else {
      setPassInputType("password");
    }
  };

  /* запрос на логин + ошибки с бэка */
  const navigate = useNavigate();
  const handleSubmitProcess = async (data: LoginData) => {
    try {
      const email = data.emailValue;
      const password = data.passwordValue;
      const activation = data.activationValue;
      const returned = await loginUser({ email, password }).unwrap();
      const refreshtoken = returned?.refresh ?? null;
      localStorage.setItem("refresh", refreshtoken);
      const accesstoken = returned?.access ?? null;
      localStorage.setItem("access", accesstoken);
      const role = returned?.role ?? null;
      localStorage.setItem("role", role);
      if (role == "admin" || role == "staff") {
        navigate("/orders");
      } else {
        navigate("/catalog");
      }
    } catch (error) {
      const errorResponse = error as AuthErrorResponse;
      if (errorResponse.data?.email) {
        setError("emailValue", { type: "custom", message: errorResponse.data?.email });
      }
      if (errorResponse.data?.password) {
        setError("passwordValue", { type: "custom", message: errorResponse.data?.password });
      }
      if (errorResponse.data?.activation) {
        setError("activationValue", { type: "custom", message: errorResponse.data?.activation });
      }
    }
  };
  const [loginUser, { isLoading: isCreating }] = useLoginUserMutation();

  /* валидация формы */
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  return (
    <>
      <main className="auth_main">
        <div className="auth_form_background">
          <form
            onSubmit={handleSubmit((data) => {
              handleSubmitProcess(data);
            })}
          >
            <Title blacktext="Войди в свой аккаунт" className="auth_title" />
            <div className={errors.emailValue || errors.activationValue ? "mb-3" : "mb-8"}>
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
                  render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} type="text" id="emailValue" name="emailValue" isError={!!errors.emailValue || !!errors.activationValue} placeholder="user_name@mail.com" />}
                  name="emailValue"
                />
                {(errors.emailValue || errors.activationValue) && (
                  <div className="auth_div_svg">
                    <ErrorIcon className="auth_error_svg" />
                  </div>
                )}
                {errors.emailValue && <p className="auth_error_text">{errors.emailValue.message}</p>}
                {errors.activationValue && <p className="auth_error_text">{errors.activationValue.message}</p>}
              </div>
            </div>
            <div className={errors.passwordValue ? "mb-5" : "mb-10"}>
              <Label text="Пароль" />
              <div className="auth_div_for_input">
                <Controller
                  control={control}
                  rules={{
                    required: "Обязательное поле",
                  }}
                  render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} type={passInputType} id="passwordValue" name="passwordValue" isError={!!errors.passwordValue} placeholder="*****************" />}
                  name="passwordValue"
                />
                <div className="auth_div_svg">
                  {passInputType === "text" && <OpenEyeIcon onClick={togglePassInput} className="auth_eye_svg" />}
                  {passInputType === "password" && <CloseEyeIcon onClick={togglePassInput} className="auth_eye_svg" />}
                  {errors.passwordValue && <ErrorIcon className="auth_error_svg" />}
                </div>
                {errors.passwordValue && <p className="auth_error_text">{errors.passwordValue.message}</p>}
              </div>
            </div>
            <div className="mb-10">
              <Button type="submit" text="Войти" />
            </div>
            <div className="login_div_register">
              <span className="login_span_register">
                Ещё не с нами?{" "}
                <a href="/auth/register" className="login_a_register">
                  Зарегистрируйся
                </a>
              </span>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};
