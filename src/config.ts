export default class Config {
  static get title(): string {
    return "QuantiFi";
  }

  // static get lines(): TerminalLine[] {
  //   return [
  //     {
  //       content: "Project.start('QuantiFi');",
  //     },
  //     {
  //       content: "Dev status: In progress",
  //       symbol: ".",
  //     },
  //     {
  //       content: "Launch date: TBA",
  //       symbol: "/",
  //     },
  //   ];
  // }

  static get symbol(): string {
    return ">>";
  }

  static get seed(): number {
    return 10;
  }

  static get speed(): number {
    return 50;
  }

  static get delay(): number {
    return 250;
  }

  static get twitter(): string {
    return "https://x.com/quantifi_xyz";
  }
}
