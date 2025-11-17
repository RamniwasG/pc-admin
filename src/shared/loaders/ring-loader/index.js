export default function RingLoader() {
  return (
    <div class="relative h-10 w-10">
      <div class="absolute inset-0 rounded-full border-4 border-gray-300"></div>
      <div class="absolute inset-0 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>
  );
}