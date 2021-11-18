import { STAGE } from "../../env";

function withStage(value: string): string {
  return `${value}-${process.env[STAGE]}`;
}

function descStage(value: string): string {
  return `[${process.env[STAGE]?.toUpperCase()}] ${value}`;
}

export { descStage, withStage };
