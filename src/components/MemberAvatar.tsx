type MemberAvatarProps = {
  initials?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  title?: string;
};

const sizeClasses = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm",
};

export function MemberAvatar({
  initials,
  size = "md",
  className = "",
  onClick,
  title,
}: MemberAvatarProps) {
  const isEmpty = !initials;
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      title={title}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 border-black bg-black font-semibold text-white ${sizeClasses[size]} ${onClick ? "cursor-pointer transition-opacity hover:opacity-80" : ""} ${isEmpty ? "border-zinc-300 bg-white" : ""} ${className}`}
    >
      {!isEmpty && initials}
    </Component>
  );
}
