// Maps vehicleType string → tier number (matches backend TIER_MAP)
const VEHICLE_TIER_MAP = {
  fuel_tanker: 1,
  manufacturing: 1,
  government_project: 1,
  essential_goods: 2,
  agricultural_tractor: 2,
  urban_public_transport: 3,
  diesel_public_transport: 3,
  private: 4,
};

// Returns Tailwind classes for tier badge
export const getTierBadgeStyle = (tier) => {
  // Accept numeric tier OR "Tier X" string OR vehicleType string
  let t = typeof tier === "number" ? tier : null;
  if (!t && typeof tier === "string") {
    if (tier.startsWith("Tier ")) t = Number(tier.replace("Tier ", ""));
    else t = VEHICLE_TIER_MAP[tier] || 4;
  }
  switch (t) {
    case 1:
      return "bg-red-100 text-red-800 border-red-200";
    case 2:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case 3:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case 4:
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const getTierLabel = (tier) => {
  let t = typeof tier === "number" ? tier : VEHICLE_TIER_MAP[tier] || 4;
  const labels = {
    1: "Priority 1",
    2: "Priority 2",
    3: "Priority 3",
    4: "Standard",
  };
  return labels[t] ? `Tier ${t} — ${labels[t]}` : `Tier ${t}`;
};

export const getVehicleTypeLabel = (vehicleType) => {
  const labels = {
    fuel_tanker: "Fuel Tanker",
    manufacturing: "Manufacturing",
    government_project: "Government Project",
    essential_goods: "Essential Goods",
    agricultural_tractor: "Agricultural Tractor",
    urban_public_transport: "Public Transport",
    diesel_public_transport: "Diesel Transport",
    private: "Private Vehicle",
  };
  return labels[vehicleType] || vehicleType;
};
