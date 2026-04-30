export const getTierLabel = (vehicleType) => {
  const tiers = {
    'AMBULANCE': { label: 'Ambulance / Emergency', tier: 'Tier 1' },
    'PUBLIC_BUS': { label: 'Public Transport Bus', tier: 'Tier 1' },
    'FUEL_TANKER': { label: 'Fuel Tanker', tier: 'Tier 1' },
    'FREIGHT': { label: 'Freight Transport', tier: 'Tier 2' },
    'TAXI': { label: 'Commercial Taxi', tier: 'Tier 2' },
    'AGRICULTURAL': { label: 'Agricultural Vehicle', tier: 'Tier 3' },
    'PRIVATE': { label: 'Private Car', tier: 'Tier 4' },
    'MOTORCYCLE': { label: 'Motorcycle', tier: 'Tier 4' },
  };

  return tiers[vehicleType] || { label: vehicleType, tier: 'Unknown' };
};

export const getTierBadgeStyle = tier => {
  switch (tier) {
    case "Tier 1":
      return "bg-red-100 text-red-800 border-red-200";
    case "Tier 2":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Tier 3":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Tier 4":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default getTierLabel;
