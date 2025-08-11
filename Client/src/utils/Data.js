import {
  FaTicketAlt,
  FaBullhorn,
  FaComments,
  FaCalendarAlt,
  FaMobileAlt,
  FaShieldAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export const FeaturesData = [
  {
    icon: FaTicketAlt,
    size: 20,
    title: "Smart Ticketing",
    text: "Set prices, promo codes, limits and issue e-tickets instantly.",
  },
  {
    icon: FaBullhorn,
    size: 20,
    title: "Promote & Announce",
    text: "Built-in event pages and shareable links to promote your screening.",
  },
  {
    icon: FaComments,
    size: 20,
    title: "Live Chat",
    text: "Real-time audience chat and moderation tools.",
  },
  {
    icon: FaCalendarAlt,
    size: 20,
    title: "Flexible Scheduling",
    text: "Schedule one-off or recurring screenings with timezone support.",
  },
  {
    icon: FaMobileAlt,
    size: 20,
    title: "Multi-device",
    text: "Optimized viewing on desktop, tablet, and mobile devices.",
  },
  {
    icon: FaShieldAlt,
    size: 20,
    title: "Secure Payments",
    text: "Stripe / Razorpay integration and secure payouts for organizers.",
  },
];

export const FaqsData = [
  {
    q: "How do I host an event?",
    a: "Create an organizer account, choose or upload your movie, schedule a screening, set ticketing, and go live at the scheduled time.",
  },
  {
    q: "How do viewers join?",
    a: "Viewers buy a ticket, receive an e-ticket, and click the 'Join' link on the scheduled date/time to access the screen.",
  },
  {
    q: "Which payment methods are supported?",
    a: "We support major payment gateways (Stripe, Razorpay). Support for more gateways can be added per region.",
  },
];

export const AboutSectionData = [
  "Easy event creation",
  "Instant e-tickets",
  "Role-based organizer tools",
  "Built-in analytics",
];

export const SocialIcons = [
  { icon: FaFacebookF, link: "https://umardraz1115.github.io/Not-Found-Page/" },
  { icon: FaTwitter, link: "https://umardraz1115.github.io/Not-Found-Page/" },
  { icon: FaInstagram, link: "https://umardraz1115.github.io/Not-Found-Page/" },
  { icon: FaYoutube, link: "https://umardraz1115.github.io/Not-Found-Page/" },
];

export const QuickLinks = [
  { label: "Home", to: "/" },
  { label: "Contact Us", to: "/contact" },
  { label: "Login", to: "/login" },
  { label: "Signup", to: "/signup" },
];

export const HelpLinks = [
  { label: "FAQ", to: "/error" },
  { label: "Support", to: "/error" },
  { label: "Terms", to: "/error" },
  { label: "Privacy", to: "/error" },
];
