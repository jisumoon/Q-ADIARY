import React, { useState } from "react";
import styled from "styled-components";
import { useDiary } from "../context/DiaryPorovider";
import AnswerList from "../components/Answer/AnswerList";
import questions from "../data/questions.json";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Title = styled.h2`
  margin: 10px 0;
`;

const FilterSelect = styled.select`
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  gap: 10px;
`;

const SortButton = styled.button<{ isActive: boolean }>`
  font-family: "HakgyoansimNadeuriTTF-B";
  font-size: 16px;
  padding: 8px 16px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &::before {
    content: ${({ isActive }) => (isActive ? "'•'" : "''")};
    font-size: 18px;
    margin-right: 4px;
  }
`;

const LoadMoreButton = styled.button`
  margin-top: 16px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const NoDataMessage = styled.p`
  margin-top: 20px;
  font-size: 20px;
  color: gray;
`;

const PostList: React.FC = () => {
  const { answers, handleDeleteAnswer, handleEditAnswer } = useDiary();

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const todaysQuestion =
    questions.find((q) => q.month === currentMonth && q.day === currentDay)
      ?.question || ""; // 기본값은 빈 문자열

  const [filterQuestion, setFilterQuestion] = useState<string>(todaysQuestion);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest"); // 정렬 상태
  const [visibleCount, setVisibleCount] = useState<number>(5); // 초기 표시 개수

  // 필터링된 답변 리스트
  const filteredAnswers = Object.values(answers)
    .flat()
    .filter((answer) => {
      if (!filterQuestion) return true; // 모든 질문 보기
      return questions.some((q) => {
        const questionMatches = q.question === filterQuestion;
        const titleMatches = answer.title.includes(
          `${q.month.toString().padStart(2, "0")}-${q.day
            .toString()
            .padStart(2, "0")}`
        );
        return questionMatches && titleMatches;
      });
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

  // 현재 표시할 리스트 (5개씩 제한)
  const visibleAnswers = filteredAnswers.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5); // 5개씩 더보기
  };

  const handleEdit = (postId: string, updatedAnswer: string) => {
    handleEditAnswer(postId, updatedAnswer);
  };

  const handleDelete = (postId: string) => {
    handleDeleteAnswer(postId);
  };

  const handleEditSave = async (updatedText: string) => {
    const postId = filteredAnswers.find(
      (item) => item.answer === updatedText
    )?.postId;

    if (postId) await handleEditAnswer(postId, updatedText);
  };

  const handleCancelEdit = () => {
    console.log("Editing canceled");
  };

  return (
    <Container>
      <Title>리스트 보기</Title>

      {/* 질문 필터 */}
      <FilterSelect
        value={filterQuestion}
        onChange={(e) => setFilterQuestion(e.target.value)}
      >
        <option value="">모든 질문</option>
        {questions.map((q) => (
          <option key={`${q.month}-${q.day}`} value={q.question}>
            {q.question}
          </option>
        ))}
      </FilterSelect>

      {/* 정렬 버튼 */}
      <ButtonGroup>
        <SortButton
          onClick={() => setSortOrder("newest")}
          isActive={sortOrder === "newest"}
        >
          최신순
        </SortButton>
        <SortButton
          onClick={() => setSortOrder("oldest")}
          isActive={sortOrder === "oldest"}
        >
          과거순
        </SortButton>
      </ButtonGroup>

      {/* 데이터 표시 */}
      {visibleAnswers.length > 0 ? (
        <>
          <AnswerList
            answers={visibleAnswers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            editingDate={null}
            editingText=""
            onEditSave={handleEditSave}
            onCancelEdit={handleCancelEdit}
          />
          {visibleCount < filteredAnswers.length && (
            <LoadMoreButton onClick={handleLoadMore}>더보기</LoadMoreButton>
          )}
        </>
      ) : (
        <NoDataMessage>🥹작성하신 글이 없습니다.</NoDataMessage>
      )}
    </Container>
  );
};

export default PostList;
