import React, { useEffect, useRef } from "react";
import Config from "@config";

import "@styles/terminal.css";

interface Props {
  lines: ITerminalLine[];
  symbol: string;
}

const Terminal: React.FC<Props> = (props: Props): JSX.Element => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  // TODO: Find another name
  const paragraphRefs = useRef<
    (HTMLParagraphElement | HTMLAnchorElement | null)[]
  >([]);

  useEffect(() => {
    const lines = props.lines.map((line) => ({
      ...line,
      content:
        line.type === "image"
          ? line.content
          : `${props.symbol} ${line.content}`,
    }));

    lines.forEach((line, index) => {
      const canvas = canvasRefs.current[index];
      const paragraph = paragraphRefs.current[index];

      let i = 0;

      let seed = Config.seed;
      let speed = Config.speed;

      const type = () => {
        if (!paragraph) return;

        if (i < line.content.length) {
          paragraph.textContent += line.content.charAt(i);
          i++;

          seed = Math.floor(Math.random() * Config.seed);
          speed = Math.floor(Math.random() * Config.seed * seed) + Config.speed;

          if (seed === Config.seed / 2) speed = Config.delay;

          setTimeout(type, speed);
        } else {
          line.finished = true;
        }
      };

      if (line.type === "image") {
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const image = new Image();

        image.src = line.content;

        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;

          let row = 0;

          const reveal = () => {
            const interval = setInterval(() => {
              if (index != 0 && !lines[index - 1]?.finished) return;

              clearInterval(interval);

              if (row < image.height) {
                context.drawImage(
                  image,
                  0,
                  row,
                  image.width,
                  speed,
                  0,
                  row,
                  image.width,
                  speed
                );

                row += speed;

                requestAnimationFrame(reveal);
              } else {
                line.finished = true;

                return;
              }
            }, speed);
          };

          requestAnimationFrame(reveal);
        };
      } else {
        const i1 = setInterval(() => {
          if (index == 0 || lines[index - 1]?.finished) {
            clearInterval(i1);
            type();
          }
        }, speed);
      }

      if (line.symbol) {
        if (!paragraph) return;

        const span = document.createElement("span");
        paragraph.parentElement?.appendChild(span);

        const i2 = setInterval(() => {
          if (line.finished) {
            clearInterval(i2);

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
          }
        });
      }
    });
  }, [Config, canvasRefs, paragraphRefs, props]);

  return (
    <section>
      {props.lines.map((line, index) =>
        line.type === "image" ? (
          <canvas
            key={index}
            ref={(ref) => (canvasRefs.current[index] = ref)}
          ></canvas>
        ) : (
          <div key={index}>
            {line.type === "link" ? (
              <a
                ref={(ref) => (paragraphRefs.current[index] = ref)}
                href={line.href}
                target="_blank"
              />
            ) : (
              <p ref={(ref) => (paragraphRefs.current[index] = ref)} />
            )}
          </div>
        )
      )}
    </section>
  );
};

export default Terminal;
