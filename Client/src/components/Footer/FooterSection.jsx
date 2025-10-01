import { HelpLinks, QuickLinks, SocialIcons } from "../../utils/Data";
import FooterLinks from "./FooterLinks";
import NavLogo from "../../assets/images/NavLogo.png"

const FooterSection = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-[#050505] dark:to-[#0b0b0b] text-gray-300 relative overflow-hidden">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 w-full h-[5px] bg-[linear-gradient(to_right,_#3b82f6,_#a855f7,_#ef4444,_#3b82f6)] animate-gradient-move"></div>

      <div className="container mx-auto px-6 lg:px-12 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo Section */}
        <div>
          <div className="inline-flex items-center gap-2">
            <img src={NavLogo} alt="nav logo" className="w-12" />
            <div>
              <div className="font-bold text-red-600 text-lg">MovioLive</div>
              <div className="text-sm dark:text-white text-gray-900 font-semibold">
                Live cinema experiences, simplified.
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <FooterLinks text="Quick Links" data={QuickLinks} type="text" />

        {/* Help Links */}
        <FooterLinks text="Help" data={HelpLinks} type="text" />

        {/* Social Links */}
        <FooterLinks text="Follow" data={SocialIcons} type="social" />
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-900 dark:text-white">
        © {new Date().getFullYear()} MovioLive. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterSection;
