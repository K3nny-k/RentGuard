export default function TenantsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tenant Database</h1>
        <p className="mt-2 text-gray-600">Search and view tenant ratings</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tenants by name or ID..."
          className="input-field max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold">Sample Tenant</h3>
            <p className="text-gray-600 mt-2">Tenant profiles will appear here when the backend is connected.</p>
            <div className="mt-4">
              <span className="badge-success">5.0 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 