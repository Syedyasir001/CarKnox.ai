export default function Footer() {
  return (
    <footer className="bg-[#0a0f1e] border-t border-[#131d35] py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <div className="font-bebas text-2xl tracking-wide">
            <span className="text-white">Car</span>
            <span className="text-white">Knox</span>
          </div>
          <p className="text-slate-600 text-sm mt-1">Know Before You Buy.</p>
        </div>
        
        <div className="text-slate-600 text-sm">
          Built for the Indian used car market
        </div>
        
        <div className="text-slate-600 text-sm">
          © 2025 CarKnox
        </div>
      </div>
    </footer>
  );
}
