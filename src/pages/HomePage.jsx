import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1542367592-8849eb950fd8?auto=format&fit=crop&w=1800&q=85";

const roleLinks = [
  {
    title: "Driver Portal",
    body: "Register a vehicle, receive a QR voucher, and track fuel status in real time.",
    primary: "Driver Login",
    primaryTo: "/login",
    secondary: "Register Vehicle",
    secondaryTo: "/register",
    accent: "border-blue-500",
  },
  {
    title: "Station Staff",
    body: "Scan QR vouchers, verify vehicle details, redeem fuel, and monitor daily logs.",
    primary: "Station Login",
    primaryTo: "/station/login",
    secondary: "Open Scanner",
    secondaryTo: "/station/scanner",
    accent: "border-green-500",
  },
  {
    title: "Admin Control",
    body: "Verify vehicles, manage stations, run AI allocation, and simulate shortages.",
    primary: "Admin Login",
    primaryTo: "/admin/login",
    secondary: "Dashboard",
    secondaryTo: "/admin/dashboard",
    accent: "border-red-500",
  },
];

const flow = [
  "Vehicle registration",
  "Admin verification",
  "AI allocation",
  "QR voucher issued",
  "Station redemption",
];

const tiers = [
  ["Tier 1", "Fuel tankers, manufacturing, government projects", "bg-red-600"],
  ["Tier 2", "Essential goods and agricultural tractors", "bg-orange-500"],
  ["Tier 3", "Urban and diesel public transport", "bg-yellow-500"],
  ["Tier 4", "Private vehicles when surplus remains", "bg-green-600"],
];

function dashboardPathFor(role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "staff") return "/station/scanner";
  if (role === "driver") return "/driver/dashboard";
  return "/login";
}

export default function HomePage() {
  const { user } = useAuth();
  const dashboardPath = dashboardPathFor(user?.role);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section
        className="relative min-h-[92vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-gray-950/80" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-black">
                FP
              </span>
              <div>
                <p className="text-lg font-black leading-tight">FuelPass</p>
                <p className="text-xs uppercase tracking-widest text-blue-200">
                  Smart Fuel Allocation
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-200 hover:bg-white/10"
              >
                Driver
              </Link>
              <Link
                to="/station/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-200 hover:bg-white/10"
              >
                Station
              </Link>
              <Link
                to="/admin/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-200 hover:bg-white/10"
              >
                Admin
              </Link>
            </nav>
          </header>

          <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-blue-300/40 bg-blue-950/50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-100">
                Ethiopia fuel rationing, digitized
              </p>
              <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
                Fair fuel access with AI allocation and QR vouchers.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-200">
                FuelPass turns shortage policy into a working MERN platform:
                drivers get scheduled vouchers, stations redeem them securely,
                and admins control allocation with live intelligence.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={user ? dashboardPath : "/register"}
                  className="rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
                >
                  {user ? "Continue to Dashboard" : "Register Driver"}
                </Link>
                <Link
                  to="/admin/login"
                  className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-center text-sm font-bold text-white backdrop-blur hover:bg-white/20"
                >
                  Launch Admin Demo
                </Link>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                <div>
                  <p className="text-3xl font-black text-white">4</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Priority tiers
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white">3</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    User portals
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white">Live</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Socket updates
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/15 bg-gray-950/70 p-4 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-200">
                    Demo Control Room
                  </p>
                  <p className="text-lg font-black">Allocation Snapshot</p>
                </div>
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-200">
                  Live
                </span>
              </div>

              <div className="space-y-3">
                {tiers.map(([tier, label, color], index) => (
                  <div
                    key={tier}
                    className="rounded-lg border border-white/10 bg-white/[0.06] p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold">{tier}</span>
                      <span className="text-xs text-gray-300">
                        {index === 0
                          ? "60%"
                          : index === 1
                            ? "25%"
                            : index === 2
                              ? "12%"
                              : "3%"}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className={`h-2 rounded-full ${color}`}
                        style={{
                          width:
                            index === 0
                              ? "92%"
                              : index === 1
                                ? "66%"
                                : index === 2
                                  ? "46%"
                                  : "25%",
                        }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-300">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 px-4 py-14 text-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                Choose your portal
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-normal">
                One platform, three live workflows.
              </h2>
            </div>
            <p className="max-w-2xl text-gray-600">
              Built for a complete demo loop: registration, verification, AI
              allocation, QR redemption, shortage alerts, and audit logs.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {roleLinks.map((role) => (
              <div
                key={role.title}
                className={`rounded-lg border-t-4 ${role.accent} border-x border-b border-gray-200 bg-white p-5 shadow-sm`}
              >
                <h3 className="text-xl font-black">{role.title}</h3>
                <p className="mt-3 min-h-20 text-sm leading-6 text-gray-600">
                  {role.body}
                </p>
                <div className="mt-5 flex gap-2">
                  <Link
                    to={role.primaryTo}
                    className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-center text-sm font-bold text-white hover:bg-gray-800"
                  >
                    {role.primary}
                  </Link>
                  <Link
                    to={role.secondaryTo}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-bold text-gray-700 hover:bg-gray-50"
                  >
                    {role.secondary}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 text-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Demo flow
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-normal">
              From registration to redeemed fuel.
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {flow.map((step, index) => (
              <div
                key={step}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <p className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900 text-sm font-black text-white">
                  {index + 1}
                </p>
                <p className="font-bold text-gray-900">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 px-4 py-8 text-gray-300 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="font-black text-white">FuelPass</p>
            <p className="text-sm">Smart Fuel Allocation & Digital Voucher System</p>
          </div>
          <div className="flex gap-3">
            <Link to="/register" className="text-sm font-semibold hover:text-white">
              Register
            </Link>
            <Link to="/login" className="text-sm font-semibold hover:text-white">
              Login
            </Link>
            <Link
              to="/admin/login"
              className="text-sm font-semibold hover:text-white"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
