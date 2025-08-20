#  Airbnb API (Express + Prisma + PostgreSQL)

This is a REST API for an Airbnb-style platform built with **Node.js, Express, Prisma, and PostgreSQL**.
It supports user authentication, listings, and reservations.

---

##  Features

* User signup & login with JWT auth
* Create, update, and delete property listings
* Search & filter listings (by location, price, category, amenities, guests)
* Make and manage reservations
* Pagination & sorting support
* Auth checks for protected routes
* Logical validations like **date overlap checks** and **guest count limits**

---

##  Tech Stack

* **Node.js + Express** – API framework
* **Prisma ORM** – Database access
* **PostgreSQL** – Relational database
* **JWT** – Authentication
* **Docker** – Containerized deployment

---

##  Setup

### 1. Clone & install

```bash
git clone https://github.com/your-username/airbnb-api.git
cd airbnb-api
npm install
```

### 2. Environment variables

Create a `.env` file:

```env
JWT_SECRET="your-secret-key"
PORT=4000
# for local development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/airbnb"
# for docker-compose
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=airbnb


```

### 3. Run migrations

```bash
npx prisma migrate dev
```

### 4. Run locally (dev mode)

```bash
npm run dev
```

### 5. Build & run for production

```bash
npm run build
npm run start
```

### 6. Run with Docker

Build the image:

```bash
docker-compose build --no-cache
```

Run the container:

```bash
docker-compose up -d
```
Stop the container:

```bash
docker-compose stop
```

---

##  Authentication

All protected routes require a `Bearer <token>` in the `Authorization` header.
Obtain a token via **`/users/login`**.

---

##  API Endpoints

###  Users

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| POST   | `/users/signup` | Register new user |
| POST   | `/users/login`  | Login & get token |
| GET    | `/users/me`     | Get current user  |

###  Listings

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| POST   | `/listings/`       | Create listing (auth)  |
| GET    | `/listings/`       | Get all listings       |
| GET    | `/listings/filter` | Filter/search listings |
| GET    | `/listings/:id`    | Get listing by ID      |
| PUT    | `/listings/:id`    | Update listing (auth)  |
| DELETE | `/listings/:id`    | Delete listing (auth)  |

###  Reservations

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| POST   | `/reservations/`    | Create reservation (auth)  |
| GET    | `/reservations/me`  | Get my reservations (auth) |
| DELETE | `/reservations/:id` | Cancel reservation (auth)  |

---

##  Example Filter Usage

```
GET /listings/filter?location=New%20York&minPrice=100&maxPrice=300&guests=2&amenities=wifi,pool
```

