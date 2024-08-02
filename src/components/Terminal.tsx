import React, { useEffect, useRef } from "react";
import Config from "@config";

interface Props {
  lines: ITerminalLine[];
  symbol: string;
}

const Terminal: React.FC<Props> = (props: Props): JSX.Element => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const lines = props.lines.map((line) => ({
      ...line,
      content: line.image ? line.content : `${props.symbol} ${line.content}`,
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

      if (index === 0) {
        type();
        return;
      }

      if (line.image) {
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const image = new Image();

        image.src = line.content;

        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;

          let row = 0;

          const revealImage = () => {
            const interval = setInterval(() => {
              if (!lines[index - 1]?.finished) return;

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

                requestAnimationFrame(revealImage);
              } else {
                line.finished = true;

                return;
              }
            }, speed);
          };

          requestAnimationFrame(revealImage);
        };
      }

      const i1 = setInterval(() => {
        if (!line.image && lines[index - 1]?.finished) {
          clearInterval(i1);
          type();

          return;
        }
      }, speed);

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
    <section className="terminal">
      {props.lines.map((line, index) =>
        line.image ? (
          <canvas
            key={index}
            ref={(ref) => (canvasRefs.current[index] = ref)}
            style={{ width: "200px" }}
          ></canvas>
        ) : (
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
              ref={(ref) => (paragraphRefs.current[index] = ref)}
            />
          </div>
        )
      )}
    </section>
  );
};

export default Terminal;
