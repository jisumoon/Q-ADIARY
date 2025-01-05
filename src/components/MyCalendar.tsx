import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import "../styles/CustomCalendar.css";
import solarlunar from "solarlunar";
import { subscribeToEntriesByMonth } from "../utils/postUtils";

interface Holiday {
  date: string;
  name: string;
}

interface LunarHoliday {
  lunarMonth: number;
  lunarDay: number;
  name: string;
  isLeapMonth?: boolean;
}

interface CalendarProps {
  onDateClick: (date: Date) => void;
  userId: string | null;
}

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 양력 공휴일
const fixedHolidays: Holiday[] = [
  { date: "01-01", name: "신정" },
  { date: "03-01", name: "삼일절" },
  { date: "05-05", name: "어린이날" },
  { date: "06-06", name: "현충일" },
  { date: "08-15", name: "광복절" },
  { date: "10-03", name: "개천절" },
  { date: "10-09", name: "한글날" },
  { date: "12-25", name: "크리스마스" },
];

//음력 공휴일
const lunarHolidays: LunarHoliday[] = [
  { lunarMonth: 1, lunarDay: 1, name: "설날" },
  { lunarMonth: 1, lunarDay: 2, name: "설날" },
  { lunarMonth: 1, lunarDay: 3, name: "설날" },
  { lunarMonth: 8, lunarDay: 15, name: "추석", isLeapMonth: false },
  { lunarMonth: 8, lunarDay: 16, name: "추석", isLeapMonth: false },
  { lunarMonth: 8, lunarDay: 17, name: "추석", isLeapMonth: false },
];

//날짜 우리 나라에 맞추어서
const formatDate = (date: Date): string => {
  const formatted = date
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, "-")
    .replace(/\.$/, "");

  return formatted;
};

//음력 날짜 -> 양력 날짜 변환
const getKoreanHolidays = (year: number): Holiday[] => {
  const holidays = fixedHolidays.map((holiday) => ({
    date: `${year}-${holiday.date}`,
    name: holiday.name,
  }));

  lunarHolidays.forEach((lunarHoliday) => {
    const isLeapMonth = lunarHoliday.isLeapMonth || false;

    const solarDate = solarlunar.lunar2solar(
      year,
      lunarHoliday.lunarMonth,
      lunarHoliday.lunarDay,
      isLeapMonth
    );

    if (solarDate && solarDate.cYear && solarDate.cMonth && solarDate.cDay) {
      const formattedDate = `${solarDate.cYear}-${String(
        solarDate.cMonth
      ).padStart(2, "0")}-${String(solarDate.cDay).padStart(2, "0")}`;

      holidays.push({
        date: formattedDate,
        name: lunarHoliday.name,
      });
    }
  });

  return holidays;
};

const MyCalendar: React.FC<CalendarProps> = ({ onDateClick, userId }) => {
  const [activeYear, setActiveYear] = useState<number>(
    new Date().getFullYear()
  );
  const [activeMonth] = useState<number>(new Date().getMonth());
  const [activeStartDate, setActiveStartDate] = useState<Date | null>(null);
  const [entries, setEntries] = useState<string[]>([]);
  const koreanHolidays = getKoreanHolidays(activeYear);

  const findHoliday = (formattedDate: string): Holiday | undefined =>
    koreanHolidays.find((holiday) => holiday.date === formattedDate);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToEntriesByMonth(
      userId,
      activeYear,
      activeMonth,
      (fetchedEntries) => {
        const formattedDates = fetchedEntries.map((entry) => entry.date);
        setEntries(formattedDates);
      }
    );

    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, [userId, activeYear, activeMonth]);

  return (
    <Container>
      <Calendar
        locale="ko-KR"
        onClickDay={onDateClick}
        onActiveStartDateChange={({ activeStartDate: startDate }) => {
          if (startDate) {
            setActiveStartDate(startDate);
            const newYear = startDate.getFullYear();
            if (newYear !== activeYear) {
              setActiveYear(newYear);
            }
          }
        }}
        tileClassName={({ date, view }: { date: Date; view: string }) => {
          if (view === "month") {
            const activeMonth = activeStartDate
              ? activeStartDate.getMonth()
              : new Date().getMonth();
            const tileMonth = date.getMonth();

            if (tileMonth !== activeMonth) {
              return "react-calendar__tile--disabled"; // 다른 달은 스타일 제거
            }

            const formattedDate = formatDate(date);
            if (findHoliday(formattedDate)) {
              return "react-calendar__tile--holiday";
            }

            const day = date.getDay();
            if (day === 0) return "react-calendar__tile--sunday";
            if (day === 6) return "react-calendar__tile--saturday";
          }
          return "";
        }}
        tileContent={({ date, view }: { date: Date; view: string }) => {
          if (view === "month") {
            const activeMonth = activeStartDate
              ? activeStartDate.getMonth()
              : new Date().getMonth();
            const tileMonth = date.getMonth();

            if (tileMonth !== activeMonth) {
              return null;
            }

            const formattedDate = formatDate(date);
            const holiday = findHoliday(formattedDate);

            // 공휴일 & 하트 표시
            if (holiday) {
              if (entries.includes(formattedDate)) {
                return <div>❤️</div>;
              }

              return (
                <div style={{ color: "crimson", fontSize: "10px" }}>
                  {holiday.name}
                </div>
              );
            }

            if (entries.includes(formattedDate)) {
              return <div>❤️</div>;
            }
          }

          return null;
        }}
        className="react-calendar"
      />
    </Container>
  );
};

export default MyCalendar;
