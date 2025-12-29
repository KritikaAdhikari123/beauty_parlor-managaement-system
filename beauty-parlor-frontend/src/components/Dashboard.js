import React from "react";

const Dashboard = () => {
  const user = localStorage.getItem("token");
  return (
    <div className="container">
      <h2>Dashboard</h2>
      {user ? <p>Welcome back! You can manage your appointments here.</p> : <p>Please login first.</p>}
    </div>
  );
};

export default Dashboard;
