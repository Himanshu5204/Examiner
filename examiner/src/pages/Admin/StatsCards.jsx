import { useEffect, useState } from "react";

const StatsCards = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/counts/")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  const totalStudents = stats.totalMale + stats.totalFemale;

  return (
    <div className="grid grid-cols-2 gap-6">

      <div className="bg-white shadow rounded-xl p-6 text-center">
        <h2 className="text-lg font-semibold">Total Teachers</h2>
        <p className="text-2xl mt-2">{stats.teacherCounts}</p>
      </div>

      <div className="bg-white shadow rounded-xl p-6 text-center">
        <h2 className="text-lg font-semibold">Total Students</h2>
        <p className="text-2xl mt-2">{totalStudents}</p>

        <p className="text-xl mt-2 text-grey-600">Male: {stats.totalMale} | Female: {stats.totalFemale}</p>
      </div>

    </div>
  );
};

export default StatsCards;