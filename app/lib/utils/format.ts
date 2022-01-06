function capitalize(value: string): string {
  const [head, ...rest] = value;
  return `${head.toUpperCase()}${rest.join("")}`;
}

export { capitalize };
