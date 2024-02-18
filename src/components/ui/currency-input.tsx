import * as React from "react";

import CurrencyInputField, {
  CurrencyInputProps,
} from "react-currency-input-field";
import { cn } from "@/lib/utils";

type CurrencyInputFieldProps = Omit<CurrencyInputProps, "onValueChange"> & {
  onChange: (value: string | undefined) => void;
};

const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputFieldProps
>(({ className, onChange, ...props }, ref) => {
  return (
    <CurrencyInputField
      prefix="₽"
      //   intlConfig={{ locale: "ru-RU", currency: "RUB" }}
      decimalScale={2}
      decimalsLimit={2}
      decimalSeparator="."
      onValueChange={(value) => onChange(value)}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
