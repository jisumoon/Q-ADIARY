import React, { useState } from "react";
import styled from "styled-components";
import AnswerList from "./Answer/AnswerList";
import InputField from "../components/Input/InputField";
import { useDiary } from "../context/DiaryPorovider";

interface DiaryFormProps {
  question: string;
  answers: {
    postId: string;
    title: string;
    answer: string;
    content?: string;
  }[];
  selectedDate: string;
  onSave: (newAnswer: {
    postId: string;
    title: string;
    answer: string;
  }) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
  onEdit: (postId: string, updatedAnswer: string) => Promise<boolean>;
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 800px;
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
`;

const Question = styled.h2`
  font-size: 20px;
  text-align: center;
  letter-spacing: 1.5px;
  font-family: "HakgyoansimNadeuriTTF-B", sans-serif;
`;

const DiaryForm: React.FC<DiaryFormProps> = ({ question }) => {
  const {
    selectedDate,
    answers,
    handleSaveAnswer,
    handleDeleteAnswer,
    handleEditAnswer,
  } = useDiary();
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const handleSave = (newAnswerText: string) => {
    const newAnswer = {
      postId: `${Date.now()}`,
      date: selectedDate,
      answer: newAnswerText,
      title: selectedDate,
    };
    handleSaveAnswer(newAnswer);
  };

  const handleEditSave = async (updatedText: string) => {
    if (editingDate) {
      const success = await handleEditAnswer(editingDate, updatedText);
      if (success) {
        setEditingDate(null);
        setEditingText("");
      }
    }
  };

  return (
    <Card>
      <Question>Q {question}</Question>
      {answers[selectedDate]?.length > 0 ? (
        <AnswerList
          answers={answers[selectedDate]}
          onEdit={(postId, updatedText) => {
            setEditingDate(postId);
            setEditingText(updatedText);
          }}
          onDelete={handleDeleteAnswer}
          editingDate={editingDate}
          editingText={editingText}
          onEditSave={handleEditSave}
          onCancelEdit={() => setEditingDate(null)}
        />
      ) : (
        <InputField onSave={handleSave} />
      )}
    </Card>
  );
};

export default DiaryForm;
