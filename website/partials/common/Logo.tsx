export default function Logo() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Abstract geometric logo inspired by the screenshot */}
        <div className="grid grid-cols-2 gap-1 w-full h-full">
          <div className="bg-blue-600 rounded-lg rounded-br-none"></div>
          <div className="bg-cyan-400 rounded-lg rounded-bl-none"></div>
          <div className="bg-blue-400 rounded-lg rounded-tr-none"></div>
          <div className="bg-blue-700 rounded-lg rounded-tl-none"></div>
        </div>
      </div>
    </div>
  );
}
