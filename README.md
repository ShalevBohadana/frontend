
# 🧑‍💻 Shalev Bohadana – Frontend Portfolio Template

This is a customizable portfolio template built with modern web technologies, including **React.js**, **Tailwind CSS**, **Three.js**, and **Framer Motion**. Originally created for personal use, it's now open-sourced to assist others in crafting their own portfolios.

## 🚀 Live Demo

Experience the live version here: [Live Demo](#)

## 🛠️ Built With

- **React.js**
- **Tailwind CSS**
- **Three.js**
- **Framer Motion**

## 📦 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **pnpm**

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/ShalevBohadana/frontend.git
cd frontend
```

2. **Install dependencies:**

Using npm:

```bash
npm install
```

Or using pnpm:

```bash
pnpm install
```

3. **Start the development server:**

Using npm:

```bash
npm run dev
```

Or using pnpm:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## ⚙️ Deployment

### Docker

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

### Jenkins

Configure your Jenkins pipeline to automate builds and deployments.

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
├── .dockerignore
├── .gitignore
├── Dockerfile
├── Jenkinsfile
├── package.json
├── tailwind.config.cjs
└── vite.config.js
```

## 🧪 Testing

Currently, there are no automated tests configured. Contributions for adding testing frameworks like Jest or React Testing Library are welcome.

## 🤝 Contributing

Contributions are welcome via forks and pull requests.

## 📄 License

MIT License.
