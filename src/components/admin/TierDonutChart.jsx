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

function normalizeTierStats(byTier) {
  if (Array.isArray(byTier)) {
    return byTier
      .map((t) => {
        const tier = Number(t._id ?? t.tier ?? t.tierLevel);
        return {
          tier,
          value: Number(t.count ?? t.total ?? t.value ?? 0),
          redeemed: Number(t.redeemed ?? 0),
        };
      })
      .filter((t) => t.tier >= 1 && t.tier <= 4 && t.value > 0);
  }

  if (byTier && typeof byTier === "object") {
    return Object.entries(byTier)
      .map(([key, value]) => {
        const tier = Number(String(key).replace(/\D/g, ""));
        const count =
          value && typeof value === "object"
            ? value.count ?? value.total ?? value.value
            : value;
        return {
          tier,
          value: Number(count ?? 0),
          redeemed: Number(value?.redeemed ?? 0),
        };
      })
      .filter((t) => t.tier >= 1 && t.tier <= 4 && t.value > 0);
  }

  return [];
}

export default function TierDonutChart({ byTier = [] }) {
  const data = normalizeTierStats(byTier).map((t) => ({
    name: TIER_NAMES[t.tier - 1] || `Tier ${t.tier}`,
    value: t.value,
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
