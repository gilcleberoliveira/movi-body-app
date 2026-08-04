export type LinkItem = {
  label: string;
  href: string;
  featured?: boolean;
};

// Fill in the real URLs when ready — these two placeholders back the
// links.movibody.com page.
export const LINK_ITEMS: LinkItem[] = [
  { label: "Watch New Identity", href: "https://newidentity.movibody.com", featured: true },
  { label: "Subscribe to Our Substack for Just $2", href: "#" },
];
