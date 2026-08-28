import * as React from "react";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef(({ className, children, ...props }, ref) => {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        if (child.type === AvatarImage && hasError) return null;
        if (child.type === AvatarFallback && !hasError) {
          // If there is an AvatarImage sibling, fallback will be shown when error occurs
          return child;
        }
        if (child.type === AvatarImage) {
          return React.cloneElement(child, {
            onError: () => setHasError(true),
          });
        }
        return child;
      })}
    </div>
  );
});
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(({ className, src, alt, ...props }, ref) => {
  if (!src) return null;
  return (
    <img
      ref={ref}
      src={src}
      alt={alt || "Avatar"}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted font-bold text-xs text-muted-foreground",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
