const GenderPieChart = () => {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="text-lg font-semibold mb-2">Total Students by Gender</h3>
      <div className="text-3xl font-bold mb-1">2500</div>
      <p className="text-sm text-gray-600">Boys: 1500 | Girls: 1000</p>
      {/* Add real pie chart using chart lib if needed */}
    </div>
  );
};
export default GenderPieChart;
