import { STAGE } from "../../env";

function withStage(value: string): string {
  return `${value}-${process.env[STAGE]}`;
}

function descStage(value: string): string {
  return `[${process.env[STAGE]?.toUpperCase()}] ${value}`;
}

function capitalize(value: string): string {
  const [head, ...rest] = value;
  return `${head.toUpperCase()}${rest.join("")}`;
}

export { capitalize, descStage, withStage };
