export default function TierBadge({ points }: { points: number }) {
  let tier = 0;
  if (points >= 100) tier = 100;
  else if (points >= 70) tier = 70;
  else if (points >= 50) tier = 50;
  
  const tierColor = tier >= 100 ? "bg-green-500/20 text-green-400 border-green-500/30" :
                   tier >= 70 ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                   tier >= 50 ? "bg-gold-500/20 text-gold-400 border-gold-500/30" :
                   "bg-gray-500/20 text-gray-400 border-gray-500/30";
  
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${tierColor}`}>
      {tier ? `Tier ${tier}` : "Not Eligible"}
    </span>
  );
}