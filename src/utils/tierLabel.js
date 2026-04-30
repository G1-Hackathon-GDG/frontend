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

export default getTierLabel;
