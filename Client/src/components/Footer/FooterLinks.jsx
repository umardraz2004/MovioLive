import { Link } from "react-router-dom";

const FooterLinks = ({ text, data, type }) => {
  return (
    <div>
      <h5 className="font-semibold mb-4 text-red-600">{text}</h5>

      {type === "text" && (
        <ul className="space-y-2 text-sm">
          {data.map((link, idx) => (
            <li key={idx} className="group flex items-center w-fit">
              {/* Left line */}
              <span className="w-0 h-[1px] dark:bg-white bg-gray-900 transition-all duration-300 group-hover:w-2"></span>

              {/* Link text */}
              <Link
                to={link.to}
                className="ml-0 group-hover:ml-2 transition-all duration-300 text-gray-900 font-semibold dark:text-gray-300 group-hover:text-red-600"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {type === "social" && (
        <div className="flex gap-4 text-xl">
          {data.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:scale-110 dark:text-white"
            >
              <item.icon />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default FooterLinks;
