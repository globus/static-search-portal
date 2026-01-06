import React, { ComponentProps } from "react";
/**
 * Import an icon type from `lucide-react` to use for props.
 */
import { type Star } from "lucide-react";
/**
 * A simple wrapper around lucide-react icons to standardize props based on our theme.
 */
export function Icon({
  component: Component,
  size = 18,
  ...props
}: {
  component: typeof Star;
  size?: number;
} & ComponentProps<typeof Star>) {
  return <Component size={size} {...props} />;
}
