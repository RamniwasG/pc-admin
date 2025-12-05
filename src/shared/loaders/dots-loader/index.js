export default function DotsLoader() {
  return (
    <div className="flex space-x-2">
      <div className="h-3 w-3 animate-bounce rounded-full bg-gray-600"></div>
      <div className="h-3 w-3 animate-bounce rounded-full bg-gray-600 [animation-delay:-0.2s]"></div>
      <div className="h-3 w-3 animate-bounce rounded-full bg-gray-600 [animation-delay:-0.4s]"></div>
    </div>
  );
}