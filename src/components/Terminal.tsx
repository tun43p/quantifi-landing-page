import React, { useEffect, useRef } from "react";
import Config from "@config";

interface Props {
  lines: ITerminalLine[];
  symbol: string;
}

const Terminal: React.FC<Props> = (props: Props): JSX.Element => {
  const terminalRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const parsedLines = props.lines.map((line) => ({
      ...line,
      content: `${props.symbol} ${line.content}`,
    }));

    parsedLines.forEach((line, index) => {
      const ref = terminalRefs.current[index];
      if (!ref) return;

      let i = 0;

      let seed = Config.seed;
      let speed = Config.speed;

      const type = () => {
        if (i < line.content.length) {
          ref.textContent += line.content.charAt(i);
          i++;

          seed = Math.floor(Math.random() * Config.seed);
          speed = Math.floor(Math.random() * Config.seed * seed) + Config.speed;

          if (seed === Config.seed / 2) speed = Config.delay;

          setTimeout(type, speed);
        }
      };

      if (index === 0) {
        type();
        return;
      }

      const i1 = setInterval(() => {
        const previousText = terminalRefs.current[index - 1];
        const previousValue = parsedLines[index - 1]?.content;

        if (previousText?.textContent?.length === previousValue?.length) {
          clearInterval(i1);
          type();
          return;
        }
      }, speed);

      if (line.symbol) {
        const span = document.createElement("span");
        ref.parentElement?.appendChild(span);

        const i2 = setInterval(() => {
          if (ref.textContent?.length === line.content.length) {
            setInterval(() => {
              if (line.symbol === ".") {
                if (span.textContent === "...") {
                  span.textContent = ".";
                } else {
                  span.textContent += ".";
                }
              } else if (line.symbol === "/") {
                span.style.marginLeft = "0.5rem";

                if (span.textContent === "/") {
                  span.textContent = "|";
                } else if (span.textContent === "|") {
                  span.textContent = "\\";
                } else {
                  span.textContent = "/";
                }
              }
            }, Config.delay * 2);

            clearInterval(i2);
          }
        });
      }
    });
  }, [Config, terminalRefs]);

  return (
    <section className="terminal">
      {props.lines.map((_, index) => (
        <div
          className="terminal-line"
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            textShadow: "0 0 60px orange, 0 0 60px orange",
          }}
        >
          <p
            className="terminal-line-text"
            ref={(ref) => (terminalRefs.current[index] = ref)}
          />
        </div>
      ))}
    </section>
  );
};

export default Terminal;
