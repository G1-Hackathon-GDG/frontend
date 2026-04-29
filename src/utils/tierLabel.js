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
