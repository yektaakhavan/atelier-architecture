export const navItems = [
  { key: "projects", href: "/projects" },
  { key: "services", href: "/services" },
  { key: "about", href: "/about" },
  { key: "journal", href: "/journal" },
  { key: "contact", href: "/contact" },
] as const;

export type NavKey = (typeof navItems)[number]["key"];

// Reserved example domain / fictional phone range: nothing here belongs to a real business.
export const contactInfo = {
  email: "hello@atelier.example",
  phone: "+1 555 010 0142",
} as const;
