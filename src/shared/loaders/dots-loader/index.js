export default function DotsLoader() {
  return (
    <div class="flex space-x-2">
      <div class="h-3 w-3 animate-bounce rounded-full bg-gray-600"></div>
      <div class="h-3 w-3 animate-bounce rounded-full bg-gray-600 [animation-delay:-0.2s]"></div>
      <div class="h-3 w-3 animate-bounce rounded-full bg-gray-600 [animation-delay:-0.4s]"></div>
    </div>
  );
}