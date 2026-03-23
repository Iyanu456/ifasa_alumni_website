export default function FeedTab() {
  return (
    <div className="space-y-6">
      
      {/* Create Post */}
      <div className="bg-white p-4 rounded-2xl border">
        <input
          placeholder="Share something with the alumni..."
          className="w-full px-4 py-3 rounded-xl bg-gray-100 outline-none"
        />
      </div>

      {/* Sample Posts */}
      <div className="space-y-4">
        {[1, 2, 3].map((post) => (
          <div key={post} className="bg-white p-5 rounded-2xl border">
            <p className="font-medium">Alumni Update</p>
            <p className="text-sm text-gray-600 mt-2">
              This is where alumni posts, opportunities, and updates will appear.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}