# Название проекта

## О проекте

Написать описание проекта

## Установка и запуск

Чтобы запустить проект, выполните следующие шаги:

1. Перейдите в папку где будет храниться проект и клонируйте репозиторий:

```
вставить ссылку
```

2. Перейдите в папку проекта:

```
cd frontend
```

3. Установите Node.js и npm, если они еще не установлены. Вы можете скачать их с официального сайта: https://nodejs.org/

4.Установите зависимости:

```
npm install
```

5.Запустите проект в режиме разработки:

```
npm run dev
```

Если необходимо собрать проект:

```
npm run build
```

## Структура проекта

Проект использует архитектуру Feature-Sliced Design (FSD), которая разделяет код на следующие слои:

- Components — переисполтзуемые ui-компоненты, атомарные, несамостоятельные части верстки
- Widgets — переиспользуемые компоненты, содержащие бизнес-логику. Самостоятельные элементы интерфейса.
- Layouts — готовые страницы приложения, отображающиеся на урлах
- Entities — модели (типы) сущностей, используемых в логике взаимодействия с бэкэндом
- Features — внешний слой приложения, содержащий логику взаимодействия с апи
