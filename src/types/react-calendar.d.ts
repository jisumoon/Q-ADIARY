declare module "react-calendar" {
  interface CalendarProps {
    locale?: string;
    onClickDay?: (date: Date) => void;
    onActiveStartDateChange?: (props: { activeStartDate?: Date }) => void;
    tileClassName?: (props: { date: Date; view: string }) => string;
    tileContent?: (props: { date: Date; view: string }) => React.ReactNode;
    className?: string; // className 추가
  }

  const Calendar: React.FC<CalendarProps>;
  export default Calendar;
}
