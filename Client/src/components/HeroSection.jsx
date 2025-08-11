import { Link } from "react-router-dom";
const HeroSection = () => {
  return (
    <header className="hero-root">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="py-28 md:py-36 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            <span className="block text-white">Stream. Host. Connect.</span>
            <span className="block text-red-600">
              Movies — Live & Interactive
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-200/90 max-w-3xl mx-auto">
            MovioLive gives you the tools to host cinematic live events, sell
            tickets, and build engaged audiences — all in one platform.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md shadow-xl transition transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
            <Link
              to="/error"
              className="inline-flex items-center gap-3 border border-white/20 text-white px-5 py-3 rounded-md hover:bg-white/10 transition"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-8 text-sm text-gray-300">
            <div className="text-center">
              <div className="text-xl font-semibold">HD</div>
              <div className="text-xs">Streaming</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">Secure</div>
              <div className="text-xs">Payments</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">Global</div>
              <div className="text-xs">Audience</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
