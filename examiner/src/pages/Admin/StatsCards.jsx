import { Users, User, DollarSign } from 'lucide-react';

const StatsCards = () => {
  const stats = [
    { label: 'Total Students', value: 2500, icon: <Users /> },
    { label: 'Total Teachers', value: 150, icon: <User /> },
    // { label: 'Total Employees', value: 600, icon: <User /> },
    // { label: 'Total Earnings', value: '$10,000', icon: <DollarSign /> },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map(({ label, value, icon }, i) => (
        <div key={i} className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>{label}<br /><strong>{value}</strong></div>
          {icon}
        </div>
      ))}
    </div>
  );
};
export default StatsCards;
