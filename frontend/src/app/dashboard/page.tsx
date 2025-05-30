export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your properties and tenant ratings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">My Listings</h2>
          </div>
          <div className="card-body">
            <p className="text-gray-600">Your property listings will appear here.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">My Tenant Ratings</h2>
          </div>
          <div className="card-body">
            <p className="text-gray-600">Your tenant ratings will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 