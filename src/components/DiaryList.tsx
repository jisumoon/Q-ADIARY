import React from "react";
import MyCalendar from "./MyCalendar";
import DiaryForm from "./DiaryForm";
import { useDiary } from "../context/DiaryPorovider";
import questions from "../data/questions.json";
import styled from "styled-components";

interface Question {
  month: number;
  day: number;
  question: string;
}

const LoginAlert = styled.p`
  text-align: center;
  font-size: 20px;
`;

const DiaryList: React.FC = () => {
  const {
    currentUserId,
    selectedDate,
    setSelectedDate,
    answers,
    handleSaveAnswer,
    handleDeleteAnswer,
    handleEditAnswer,
  } = useDiary();

  const handleDateClick = (date: Date) => {
    const formattedDate = date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, "-")
      .replace(/\./g, "");
    setSelectedDate(formattedDate);
  };

  const getMonthDay = (date: string | null) => {
    if (!date) return null;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return null;
    return {
      month: parsedDate.getMonth() + 1,
      day: parsedDate.getDate(),
    };
  };

  const selectedMonthDay = getMonthDay(selectedDate);

  // 선택된 날짜에 맞는 질문 찾기
  const selectedQuestion =
    selectedMonthDay &&
    questions.find(
      (q: Question) =>
        Number(q.month) === selectedMonthDay.month &&
        Number(q.day) === selectedMonthDay.day
    );

  return (
    <div>
      <MyCalendar onDateClick={handleDateClick} userId={currentUserId} />
      {currentUserId ? (
        <DiaryForm
          question={selectedQuestion?.question || "질문이 없습니다."}
          answers={answers[selectedDate] || []} // 이 부분 확인
          selectedDate={selectedDate}
          onSave={(newAnswer) =>
            handleSaveAnswer({
              ...newAnswer,
              date: selectedDate,
            })
          }
          onDelete={handleDeleteAnswer}
          onEdit={handleEditAnswer}
        />
      ) : (
        <LoginAlert>로그인이 필요합니다. 로그인 후 이용해주세요.</LoginAlert>
      )}
    </div>
  );
};

export default DiaryList;
