// src/pages/Teacher/MyStudents.jsx
const MyStudents = () => {
  const students = [
    { id: 1, name: 'Ankit Sharma', email: 'ankit@example.com', status: 'Active' },
    { id: 2, name: 'Priya Mehta', email: 'priya@example.com', status: 'Inactive' },
    { id: 3, name: 'Ravi Kumar', email: 'ravi@example.com', status: 'Active' },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4">My Students</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{s.name}</td>
              <td>{s.email}</td>
              <td>
                <span className={`text-sm px-2 py-1 rounded-full ${s.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyStudents;
