<div align="center">

# 📦 Product Inventory

**Система управления товарами, организациями и персоналом**

[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/) [![Spring](https://img.shields.io/badge/Spring-6.1-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/) [![Hibernate](https://img.shields.io/badge/Hibernate-6.4-59666C?style=for-the-badge&logo=hibernate&logoColor=white)](https://hibernate.org/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/) [![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

<br/>

*Бизнес-ориентированная платформа для ведения каталога продукции,*  
*хранения данных о поставщиках и массового импорта товаров*

<br/>

[Возможности](#-возможности) •
[Скриншоты](#-скриншоты) •
[Запуск](#-быстрый-старт) •
[API](#-api)

</div>

---

## 🌟 Возможности

<table>
<tr>
<td width="50%">

### 📦 Управление продуктами
- Полный CRUD с валидацией
- Связи: Продукт → Производитель → Владелец  
- Уникальность по артикулу + производителю
- Нормализация данных при сохранении

</td>
<td width="50%">

### 📥 Массовый импорт
- Загрузка из JSON файлов
- Атомарные транзакции (всё или ничего)
- Автосоздание связанных сущностей
- История операций с статусами

</td>
</tr>
<tr>
<td width="50%">

### 🔍 Фильтрация и сортировка
- Поиск по любому полю
- Сортировка кликом по заголовку
- Гибкая пагинация
- Сохранение настроек

</td>
<td width="50%">

### 🔔 Real-time обновления
- WebSocket уведомления
- Автообновление при изменениях
- Синхронизация между вкладками
- Мгновенная обратная связь

</td>
</tr>
</table>

---

## 📸 Скриншоты

<div align="center">

### Каталог продуктов

![Каталог продуктов](screenshots/productPage.png)

<br/>

### Создание продукта

![Создание продукта](screenshots/product-create.png)

<br/>

### Валидация данных

<table>
<tr>
<td width="50%" align="center">

![Валидация формы](screenshots/validation-form.png)

**Валидация на клиенте**

</td>
<td width="50%" align="center">

![Бизнес-валидация](screenshots/validation-business.png)

**Бизнес-правила сервера**

</td>
</tr>
</table>

<br/>

### Организации и персонал

<table>
<tr>
<td width="50%" align="center">

![Организации](screenshots/organizationPage.png)

**Управление организациями**

</td>
<td width="50%" align="center">

![Персонал](screenshots/personPage.png)

**Управление персоналом**

</td>
</tr>
</table>

<br/>

### Импорт данных

<table>
<tr>
<td width="50%" align="center">

![Импорт](screenshots/importProducts.png)

**Результат импорта**

</td>
<td width="50%" align="center">

![История](screenshots/importProductsHistory.png)

**История операций**

</td>
</tr>
</table>

<br/>

### Фильтрация и сортировка

<table>
<tr>
<td width="50%" align="center">

![Фильтрация](screenshots/filters.png)

**Фильтрация по полям**

</td>
<td width="50%" align="center">

![Сортировка](screenshots/filters-sorted.png)

**Сортировка по артикулу**

</td>
</tr>
</table>

</div>

---

## 🚀 Быстрый старт

### Требования

![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=flat-square&logo=openjdk&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat-square&logo=postgresql&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)

### Backend

```bash
cd backend
mvn clean package
```

> ⚙️ Настройте JNDI DataSource `java:/ProductInventoryDS` в сервере приложений

### Frontend

```bash
cd frontend
npm install
npm run dev       # → http://localhost:5173
npm run build     # Production сборка
```

---

## 📡 API

<details>
<summary><b>Products</b> — управление товарами</summary>

| Метод | Endpoint | Описание |
|:-----:|----------|----------|
| `GET` | `/product` | Список с фильтрацией |
| `GET` | `/product/{id}` | Получить по ID |
| `POST` | `/product` | Создать |
| `PUT` | `/product/{id}` | Обновить |
| `DELETE` | `/product/{id}` | Удалить |

</details>

<details>
<summary><b>Organizations</b> — управление организациями</summary>

| Метод | Endpoint | Описание |
|:-----:|----------|----------|
| `GET` | `/organization` | Список |
| `GET` | `/organization/{id}` | Получить по ID |
| `POST` | `/organization` | Создать |
| `PUT` | `/organization/{id}` | Обновить |
| `DELETE` | `/organization/{id}` | Удалить |

</details>

<details>
<summary><b>Persons</b> — управление персоналом</summary>

| Метод | Endpoint | Описание |
|:-----:|----------|----------|
| `GET` | `/person` | Список |
| `GET` | `/person/{id}` | Получить по ID |
| `POST` | `/person` | Создать |
| `PUT` | `/person/{id}` | Обновить |
| `DELETE` | `/person/{id}` | Удалить |

</details>

<details>
<summary><b>Import</b> — массовый импорт</summary>

| Метод | Endpoint | Описание |
|:-----:|----------|----------|
| `POST` | `/import/products` | Загрузить файл |
| `GET` | `/import-history` | История операций |

</details>

<details>
<summary><b>WebSocket</b> — real-time уведомления</summary>

| Endpoint | Описание |
|----------|----------|
| `/ws` | STOMP WebSocket |
| `/topic/changes` | Подписка на изменения |

</details>

---

## 📂 Структура проекта

```
ProductInventory/
│
├── 📁 backend/
│   ├── pom.xml
│   └── src/main/java/ru/productinventory/
│       ├── config/        # Spring, Hibernate, WebSocket
│       ├── controller/    # REST API
│       ├── service/       # Бизнес-логика
│       ├── repository/    # Доступ к данным
│       ├── model/         # Сущности
│       ├── dto/           # Transfer Objects
│       ├── mapper/        # DTO ↔ Entity
│       └── ws/            # WebSocket
│
└── 📁 frontend/
    ├── package.json
    └── src/
        ├── api/           # HTTP/WS клиенты
        ├── components/    # UI-компоненты
        └── pages/         # Страницы
```

---

<div align="center">

## 🛠 Технологии

![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat-square&logo=openjdk&logoColor=white) ![Spring MVC](https://img.shields.io/badge/Spring_MVC-6DB33F?style=flat-square&logo=spring&logoColor=white) ![Hibernate](https://img.shields.io/badge/Hibernate_ORM-59666C?style=flat-square&logo=hibernate&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) ![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=flat-square&logo=socketdotio&logoColor=white) ![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>
