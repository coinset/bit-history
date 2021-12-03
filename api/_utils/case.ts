function upperCase<T extends string>(value: T): string {
  return value.toUpperCase().replace("_", "");
}

export { upperCase };
