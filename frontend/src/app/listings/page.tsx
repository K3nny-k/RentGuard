export default function ListingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Property Listings</h1>
        <p className="mt-2 text-gray-600">Browse available rental properties</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold">Sample Listing</h3>
            <p className="text-gray-600 mt-2">Property listings will appear here when the backend is connected.</p>
            <div className="mt-4">
              <span className="badge-info">RM 2,500/month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 