function DashboardStatCard({ title, value, icon: Icon }) {
  return (
    <div className="dashboard-stat-card">
      <div className="stat-card-info">
        <p className="stat-card-title">{title}</p>
        <h2 className="stat-card-value">{value}</h2>
      </div>

      <div className="stat-card-icon">
        {Icon && <Icon size={26} />}
      </div>
    </div>
  ) 
}

export default DashboardStatCard 