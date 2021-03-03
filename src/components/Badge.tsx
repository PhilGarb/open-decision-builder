import React from "react";
import clsx from "clsx";
import { pluck } from "@utils/index";
import { badgeColors } from "@internalTypes/types";

export type BadgeColors = keyof typeof badgeColors;

type Badge = { color: BadgeColors };

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement> & Badge> = ({
  children,
  className = "",
  color,
  ...props
}) => {
  return (
    <span
      className={clsx(
        className,
        "px-3 rounded-md font-semibold text-sm",
        pluck([color], badgeColors)
      )}
      {...props}
    >
      {children}
    </span>
  );
};
