export default function RingLoader() {
  return (
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>
  );
}