# ShopPractise

## Overview

ShopPractise is a project created to consolidate and enhance knowledge in Angular development. It serves as a practical exercise to apply and deepen understanding of Angular concepts.

## Features

- Built with **Angular v20**
- Backend powered by **Node.js** (Express) using JSON files for data storage
- Designed for learning and experimentation

## Live Demo

- You can see an example of the site here: [https://alekseynarizhniy.github.io/shop-practise/](https://alekseynarizhniy.github.io/shop-practise/)
- You can also use an alternative backend at: [https://shop-practise.onrender.com/](https://shop-practise.onrender.com/)

## Getting Started

### 1. Clone the repository

### 2. Install dependencies

#### Frontend (Angular)

```bash
npm install
```

#### Backend (Node.js)

```bash
cd backend
npm install
cd ..
```

### 3. Run the backend server

```bash
cd backend
npm start
# or
node app.js
```

The backend will run at [http://localhost:3000](http://localhost:3000).

### 4. Start the Angular frontend

```bash
npm start
# or
ng serve
```

The frontend will run at [http://localhost:4200](http://localhost:4200).

## Project Structure

shop-practise/
│
├── backend/ # Node.js Express backend
│ ├── app.js
│ ├── package.json
│ └── data/ # JSON files (users.json, smartphones.json, etc.)
│
├── src/ # Angular frontend source code
│ ├── app/
│ │ ├── components/
│ │ ├── services/
│ │ └── ...
│ └── ...
│
├── package.json # Angular project config
└── README.md

## Usage

- Open [http://localhost:4200](http://localhost:4200) in your browser.
- The app communicates with the backend at [http://localhost:3000](http://localhost:3000).
- Use the UI to browse, filter, and manage smartphones, register/login, and manage your basket.

## Notes

- This project is for educational purposes only. Do **not** use plain-text passwords or JSON files for real applications.
- If you encounter issues, check the browser console and backend terminal for errors.
- Make sure both frontend and backend servers are running.

## License

Use wherever you want
