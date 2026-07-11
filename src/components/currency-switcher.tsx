import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/context/currency";

/** Compact currency selector — lets visitors override the auto-detected currency. */
export function CurrencySwitcher({ className }: { className?: string }) {
  const { displayCode, setDisplay, options, ready } = useCurrency();
  if (!ready) return null;

  return (
    <Select value={displayCode} onValueChange={setDisplay}>
      <SelectTrigger
        aria-label="Change currency"
        className={
          "h-9 w-[5.2rem] border-border/70 bg-transparent px-3 text-xs font-medium " +
          (className ?? "")
        }
      >
        <SelectValue>{displayCode}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.code} value={o.code} className="text-sm">
            {o.code} — {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
