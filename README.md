# 🚗 FuelPass Frontend

Frontend for **FuelPass — Smart Fuel Allocation & Digital Voucher System**.

This is a React-based web application that allows drivers, station staff, and admins to interact with the fuel allocation system through a clean and responsive UI.

---

## 🌐 Overview

FuelPass frontend provides three main portals:

- 🚗 **Driver Portal** – Register vehicle, view fuel vouchers, track status
- ⛽ **Station Portal** – Scan QR codes and verify fuel redemption
- 👑 **Admin Dashboard** – Manage vehicles, stations, cycles, and AI allocation

Built with modern tools for speed, scalability, and real-time updates.

---

## ⚙️ Tech Stack

- **React (Vite)**
- **React Router v6**
- **Axios**
- **Tailwind CSS**
- **Socket.io Client**
- **Recharts**
- **React QR Code**
- **html5-qrcode**

---

## 📁 Project Structure
```text
frontend/
├─ src/
│  ├─ api/           # Axios instances & API call modules
│  ├─ pages/         # Route pages
│  │  ├─ driver/     # Driver portal pages & subroutes
│  │  ├─ station/    # Station portal pages & QR verification flows
│  │  └─ admin/      # Admin dashboard pages & management UIs
│  ├─ components/    # Reusable UI components
│  │  ├─ common/     # Shared atoms & layout components
│  │  ├─ driver/     # Driver-specific components
│  │  ├─ station/    # Station-specific components
│  │  └─ admin/      # Admin-specific components
│  ├─ context/       # Auth, Socket and other providers
│  ├─ hooks/         # Custom React hooks
│  ├─ utils/         # Utilities & helpers
│  ├─ styles/        # Tailwind config and global styles (optional)
│  ├─ App.jsx        # Route definitions and app shell
│  └─ main.jsx       # React entry, providers and mount
└─ public/           # Static assets and favicon
```

Quick notes:
- Keep auth & socket providers in context/ so they wrap App routes.
- Lazy-load heavy pages from pages/ to improve initial load.
- Isolate API logic in api/ and expose small typed helpers.
- Put shared UI in components/common to maximize reuse.
- Add tests alongside modules (e.g., __tests__ or *.test.jsx) and small READMEs per major folder.


---
## 🚀 Getting Started

Minimal steps to run the frontend locally:

1. Install dependencies
    ```
    npm install
    ```
2. Create environment variables (see example below)
3. Start dev server
    ```
    npm run dev
    ```
4. Build for production
    ```
    npm run build
    ```
5. Preview production build
    ```
    npm run preview
    ```

## .env (example)
Create a `.env` or `.env.local` in the project root:
```
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
VITE_GOOGLE_MAPS_KEY=your_google_maps_key_here
# any other VITE_ prefixed vars used in the app
```

Note: Vite requires env variables to be prefixed with VITE_ to be exposed to the client.

## Common Scripts
(Verify actual scripts in package.json)
- npm run dev — Start Vite dev server
- npm run build — Create production build
- npm run preview — Preview the production build locally
- npm run lint — Lint code
- npm run format — Format code

## Development Tips
- Keep the backend running and ensure CORS and socket endpoints match VITE_API_URL / VITE_SOCKET_URL.
- For QR scanning (html5-qrcode) and camera access, prefer HTTPS or use localhost.
- Use React Router v6 routes defined in src/App.jsx; separate portals live under pages/driver, pages/station, pages/admin.
- Use context/ for auth & socket providers so they wrap App routes.

## Testing & CI
- Add unit and integration tests (Jest / React Testing Library) as needed.
- Configure a CI pipeline to run lint, tests, and build on pull requests.

## Troubleshooting
- Blank page / hydration error: check console for mismatched React versions or SSR artifacts.
- Socket connection fails: verify VITE_SOCKET_URL, CORS, and server socket namespace.
- QR scanner not working: ensure camera permissions and HTTPS (or localhost).

## Contributing
- Open issues for bugs or feature requests.
- Create pull requests against main with clear description and linked issue.
- Keep commits atomic and run linters/formatters before PR.

## License
 MIT