export default function TierBadge({ points }: { points: number }) {
  let tier = 0;
  if (points >= 100) tier = 100;
  else if (points >= 70) tier = 70;
  else if (points >= 50) tier = 50;
  return (
    <span className="badge badge-tier">{tier ? `Tier ${tier}` : "Not Eligible"}</span>
  );
}
