import { type LucideProps, type LucideIcon } from "lucide-react";
/**
 * A simple wrapper around lucide-react icons to standardize props based on our theme.
 */
export function Icon({
  component: Component,
  size = "1em",
  ...props
}: {
  component: LucideIcon;
} & LucideProps) {
  return <Component size={size} {...props} />;
}
