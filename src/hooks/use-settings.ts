import { useAsync } from "./use-async";
import { fetchSettings, DEFAULT_SETTINGS, type StoreSettings } from "@/lib/api";

/** Store settings with safe defaults while loading / if the table is absent. */
export function useStoreSettings(): StoreSettings {
  const { data } = useAsync(fetchSettings, []);
  return data ?? DEFAULT_SETTINGS;
}
