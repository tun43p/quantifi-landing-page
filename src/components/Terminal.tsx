import React, { useEffect, useRef, useState } from "react";
import Config from "@config";
import "@styles/terminal.css";

interface Props {
  lines: ITerminalLine[];
  symbol: string;
}

const Terminal: React.FC<Props> = (props: Props): JSX.Element => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const paragraphRefs = useRef<
    (HTMLParagraphElement | HTMLAnchorElement | null)[]
  >([]);

  const [renderedContent, setRenderedContent] = useState<string[]>(
    Array(props.lines.length).fill("")
  );

  const wrapLettersWithSpan = (
    content: string,
    colors: { [key: string]: string[] | undefined }
  ) => {
    let parsedContent = content;

    Object.entries(colors).forEach(([color, words]) => {
      words?.forEach((word) => {
        const regex = new RegExp(`(${word})`, "g");
        parsedContent = parsedContent.replace(regex, (match) => {
          return match
            .split("")
            .map((char) => `<span class="${color}">${char}</span>`)
            .join("");
        });
      });
    });

    return parsedContent;
  };

  useEffect(() => {
    const lines = props.lines.map((line, index) => ({
      ...line,
      content:
        index === 0 || line.type === "image" || line.center
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
        if (i < line.content.length) {
          const currentContent = line.content.slice(0, i + 1);
          const parsedContent = wrapLettersWithSpan(
            currentContent,
            line.color || {}
          );
          setRenderedContent((prevContent) => {
            const newContent = [...prevContent];
            newContent[index] = parsedContent;
            return newContent;
          });

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
          <div key={index} className={line.center ? "center" : ""}>
            {line.type === "link" ? (
              <a
                ref={(ref) => (paragraphRefs.current[index] = ref)}
                href={line.href}
                target="_blank"
                dangerouslySetInnerHTML={{
                  __html: renderedContent[index] || "",
                }}
              />
            ) : (
              <p
                ref={(ref) => (paragraphRefs.current[index] = ref)}
                dangerouslySetInnerHTML={{
                  __html: renderedContent[index] || "",
                }}
              />
            )}
          </div>
        )
      )}
    </section>
  );
};

export default Terminal;
