const notEmpty = <T,>(value: T): value is NonNullable<typeof value> => !!value;

export function useList<T>(list: (T | null | undefined)[] | null | undefined) {
  if (!list) return [];

  const newList = list.filter((item) => notEmpty(item));
  return newList as T[];
}
