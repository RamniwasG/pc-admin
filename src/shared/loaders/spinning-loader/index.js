export default function SpinningLoader() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
    </div>
  );
}