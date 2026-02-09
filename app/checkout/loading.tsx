export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto border-4 border-[#FF6900] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    </div>
  );
}
