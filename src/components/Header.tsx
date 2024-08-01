import { useEffect, useState, useMemo } from "react";

export default function Header(): JSX.Element {
  const [dateTime, setDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const updateDateTime = () => {
      setDateTime(new Date());
    };

    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const date = useMemo(
    () =>
      dateTime.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [dateTime]
  );

  const time = useMemo(
    () =>
      dateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }) + " UTC",
    [dateTime]
  );

  const textStyle = { fontSize: "0.75rem" };

  return (
    <header style={{ height: "2rem", display: "grid", alignItems: "center" }}>
      <p style={textStyle}>{date}</p>
      <p style={textStyle}>{time}</p>
    </header>
  );
}
