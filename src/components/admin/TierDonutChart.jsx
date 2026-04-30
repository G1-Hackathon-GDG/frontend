import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#dc2626", "#ea580c", "#ca8a04", "#16a34a"];
const TIER_NAMES = [
  "Tier 1 — Priority",
  "Tier 2 — Essential",
  "Tier 3 — Transport",
  "Tier 4 — Private",
];

export default function TierDonutChart({ byTier = [] }) {
  const data = byTier.map((t) => ({
    name: TIER_NAMES[t._id - 1] || `Tier ${t._id}`,
    value: t.count,
    redeemed: t.redeemed,
  }));

  if (data.length === 0)
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No voucher data yet
      </div>
    );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          dataKey="value"
          paddingAngle={3}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v, n) => [`${v} vouchers`, n]} />
        <Legend iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}
