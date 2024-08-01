/// <reference types="astro/client" />

type TerminalContent = {
  text: string;
  symbol?: string;
};

type TerminalLine = {
  content: string;
  colorize?: string;
  symbol?: string;
};
