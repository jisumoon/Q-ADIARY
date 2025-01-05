declare module "solarlunar" {
  export function lunar2solar(
    lunarYear: number,
    lunarMonth: number,
    lunarDay: number,
    isLeapMonth: boolean
  ): {
    cYear: number;
    cMonth: number;
    cDay: number;
    solarYear?: number;
    solarMonth?: number;
    solarDay?: number;
    [key: string]: any;
  };

  export function solarToLunar(
    solarYear: number,
    solarMonth: number,
    solarDay: number
  ): {
    lunarYear: number;
    lunarMonth: number;
    lunarDay: number;
    isLeapMonth: boolean;
    [key: string]: any;
  };

  const solarlunar: {
    lunar2solar: typeof lunar2solar;
    solarToLunar: typeof solarToLunar;
  };

  export default solarlunar;
}
