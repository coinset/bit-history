export function upperCase<T extends string>(value: T): string {
  return value.toUpperCase().replace("_", "");
}

export function isUpper(value: string): boolean {
  return /^[A-Z\d]+$/.test(value);
}
