import type { ItemFormValues } from '~/validations/item';

/**
 * Global state to pass Aimo-parsed data across pages.
 * When Aimo parses text from any page, it stores the result here.
 * The items page watches this state and opens the create form automatically.
 */
export const useAimoState = () =>
  useState<Partial<ItemFormValues> | null>('aimo-parsed-data', () => null);
