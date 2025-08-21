import { FiCheck, FiZap, FiClock } from "react-icons/fi";

// Icon mapping
const iconMap = {
  FiZap: FiZap,
  FiClock: FiClock,
};

const SpecialOfferCard = ({ plan }) => {
  // Get the icon component based on iconName
  const IconComponent = iconMap[plan.iconName];

  return (
    <div
      className={`relative bg-gradient-to-br ${plan.gradient} rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:15px_15px]"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center mb-6">
          {IconComponent && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mr-4 border border-white/30">
              <IconComponent className="w-6 h-6" />
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <span className="text-white/80 text-sm bg-white/20 px-3 py-1 rounded-full">
              {plan.duration} access
            </span>
          </div>
        </div>
        
        <p className="text-white/90 mb-8 text-lg leading-relaxed">
          {plan.description}
        </p>
        
        {/* Pricing */}
        <div className="mb-8">
          <div className="flex items-baseline mb-2">
            <span className="text-4xl font-bold">
              {plan.price === 0 ? 'FREE' : `$${plan.price}`}
            </span>
            <span className="text-white/80 ml-3 text-lg">{plan.period}</span>
          </div>
          {plan.price === 0 && (
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                🎉 No credit card required
              </span>
            </div>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-3 mt-0.5 border border-white/30">
                <FiCheck className="w-4 h-4" />
              </div>
              <span className="text-white/90">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button className="w-full py-4 px-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-bold text-lg transition-all duration-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50">
          {plan.buttonText}
        </button>
      </div>
    </div>
  );
};

export default SpecialOfferCard;
