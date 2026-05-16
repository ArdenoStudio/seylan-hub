import Link from "next/link";

interface CTAPrimaryButtonProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CTAPrimaryButton({
  href = "/wallet",
  children,
  className = "",
  size = "lg",
}: CTAPrimaryButtonProps) {
  const sizeClasses = {
    sm: "px-5 py-2.5 text-sm gap-1.5",
    md: "px-6 py-3 text-sm gap-2",
    lg: "px-8 py-3.5 text-base gap-2.5",
  };

  return (
    <Link
      href={href}
      className={[
        "group inline-flex items-center justify-center font-medium rounded-lg",
        "bg-seylan-red text-white",
        "shadow-[0_2px_12px_rgba(227,24,33,0.25)]",
        "hover:-translate-y-0.5 hover:bg-seylan-red/90",
        "hover:shadow-[0_8px_28px_rgba(227,24,33,0.38)]",
        "active:translate-y-0 active:scale-[0.97]",
        "active:shadow-[0_1px_6px_rgba(227,24,33,0.18)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seylan-red focus-visible:ring-offset-2",
        "transition-all duration-150 ease-out",
        "select-none",
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      <span>{children ?? "Open SeylanHub"}</span>
      <span
        aria-hidden="true"
        className="transition-transform duration-150 ease-out group-hover:translate-x-1 group-active:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}
