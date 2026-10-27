export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Discover Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="bg-gray-200 h-40 rounded mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900">Event {i}</h3>
              <p className="text-gray-600 text-sm">Coming soon...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
