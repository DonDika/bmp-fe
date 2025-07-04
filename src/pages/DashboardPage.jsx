import DashboardTemplate from "../components/templates/DashboardTemplate";

const DashboardPage = () => {
  return (
    <DashboardTemplate>
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome to your dashboard!</p>
    </DashboardTemplate>
  );
};

export default DashboardPage;
