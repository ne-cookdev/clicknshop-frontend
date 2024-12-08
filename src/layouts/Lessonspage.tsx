import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLogoutUserMutation, useUpdateAccessTokenMutation } from "../features/api/accountsApi";
import { useGetLessonsInfoQuery } from "../features/api/lessonsApi";
import { useNavigate } from "react-router-dom";
import { CardTheme } from "../components/CardTheme/CardTheme";
import { Button } from "../components/Button/Button";
import { LogoutHeader } from "../components/LogoutHeader/LogoutHeader";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

type LessonsParams = {
  courseId: string;
};

export const Lessonspage = () => {
  // Хук для получения переведенных текстов
  const { t } = useTranslation();

  const location = useLocation();
  const showBanner = location.state?.showBanner;

  useEffect(() => {
    if (showBanner) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [showBanner]);

  // номер курса (строка)
  const { courseId } = useParams<LessonsParams>();

  // номер курса (число)
  const courseIdNumber = parseInt(courseId ?? "", 10);

  // запрос данных с бэка
  const { data, isLoading: isGettingLessons, isSuccess, isError, error, refetch } = useGetLessonsInfoQuery({ course: courseIdNumber });

  // нужно для редиректа
  const navigate = useNavigate();

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

  // обновления access токена при ошибке "не авторизован"
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
          const val = await updateAccessToken({
            refresh: refreshToken,
          }).unwrap();
          await refetch();
        } catch (tokenError) {
          navigate("/auth/login");
        } finally {
          setIsTokenRefreshing(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchLessons();
  }, []);

  if (isGettingLessons) {
    return (
      <>
        <main className="h-dvh bg-starkit-magnolia">
          <LogoutHeader isBack={true} onClickHandler={handleLogoutProcess} />
          <div className="flex justify-center flex-col items-center">
            <div className="w-full px-32 grid grid-cols-1 mb-12 gap-y-7">{/*<SkeletonCardTheme />*/}</div>
            <div className="w-full flex items-center justify-center mt-10">
              <span className="text-base text-starkit-purple font-medium text-center">©STARKIT 2024</span>
            </div>
          </div>
        </main>
      </>
    );
  } else if (isSuccess) {
    if (data.length === 0) {
      return (
        <main className="body_404">
          <div className="h-dvh flex items-center justify-center flex-col">
            <img src="/images/robot_404.png" className="mb-6" />
            <p className="text-starkit-electric font-bold text-7xl text-center">404</p>
            <p className="text-black font-bold text-2xl text-center mb-5">{t("courseNotExist")}</p>
            <a href={"/courses"}>
              <Button text={t("courses")} className="text-xl w-[300px]" />
            </a>
            <div className="fixed bottom-5">
              <span className="text-base text-starkit-purple font-medium text-center">©STARKIT 2024</span>
            </div>
          </div>
        </main>
      );
    } else {
      return (
        <>
          <main className="bg-starkit-magnolia">
            <LogoutHeader isBack={true} onClickHandler={handleLogoutProcess} />
            <div className="flex justify-center flex-col items-center">
              <div className="w-full max-[495px]:px-5 max-[950px]:px-12 px-32 flex flex-col gap-y-7">
                {/*{data
                  .slice()
                  .sort((a: Theme, b: Theme) => a.number - b.number)
                  .map((theme: Theme) => {
                    return <CardTheme key={`/course/${courseIdNumber}/theme/${theme.number}`} courseNum={courseIdNumber} themeNum={theme.number} countLessons={theme.lessons.length} tagList={theme.tags} name={theme.name} description={theme.description} lessons={theme.lessons} />;
                  })}*/}
              </div>
              <div className="w-full flex items-center justify-center mt-10">
                <span className="text-base text-starkit-purple font-medium text-center">©STARKIT 2024</span>
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
