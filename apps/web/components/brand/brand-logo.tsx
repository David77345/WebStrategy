import Image from "next/image";

type BrandLogoProps = {
  variant?: "header" | "hero" | "footer";
};

/** Isotipo SVG oficial, sin redibujar ni alterar sus proporciones. */
export function BrandLogo({ variant = "header" }: BrandLogoProps) {
  return (
    <span className={`brand-logo brand-logo--${variant}`}>
      <Image
        className="brand-logo__symbol"
        src="/brand/day-strategy-symbol.svg"
        width={1254}
        height={1254}
        alt=""
        preload={variant === "hero"}
      />
      <span className="brand-logo__wordmark">
        DAY<span>STRATEGY</span>
      </span>
    </span>
  );
}
