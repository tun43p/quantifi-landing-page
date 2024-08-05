/// <reference types="astro/client" />

interface ITerminalLine {
  content: string;
  type: "image" | "link" | "text" = "text";
  symbol?: string;
  href?: string;
  command?: boolean;
  finished?: boolean;
  center?: boolean;
  color?: {
    [key: string]: string[] | undefined;
  };
}
