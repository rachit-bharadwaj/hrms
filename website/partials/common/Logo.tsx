export default function Logo({ size = 10 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`relative w-${size} h-${size} flex items-center justify-center`}
      >
        {/* Abstract geometric logo inspired by the screenshot */}
        <div className="grid grid-cols-2 gap-1 w-full h-full">
          <div className="bg-blue-600 rounded-lg rounded-br-none" />
          <div className="bg-cyan-400 rounded-lg rounded-bl-none" />
          <div className="bg-blue-400 rounded-lg rounded-tr-none" />
          <div className="bg-blue-700 rounded-lg rounded-tl-none" />
        </div>
      </div>
    </div>
  );
}
