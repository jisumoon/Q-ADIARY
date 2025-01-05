import React from "react";
import styled from "styled-components";
import AnswerItem from "./AnswerItem";

interface AnswerListProps {
  answers: {
    postId: string;
    title: string;
    answer: string;
    content?: string;
  }[];
  onEdit: (postId: string, updatedAnswer: string) => void;
  onDelete: (postId: string) => void;
  editingDate: string | null;
  editingText: string;
  onEditSave: (updatedText: string) => void;
  onCancelEdit: () => void;
}

const AnswerListContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AnswerList: React.FC<AnswerListProps> = ({
  answers,
  onEdit,
  onDelete,
  editingDate,
  editingText,
  onEditSave,
  onCancelEdit,
}) => {
  return (
    <AnswerListContainer>
      {answers.map((item) => (
        <AnswerItem
          key={item.postId}
          answer={{
            postId: item.postId,
            date: item.title,
            content: item.content || item.answer || "", // 기본값 설정
            answer: item.answer,
          }}
          isEditing={editingDate === item.postId}
          editingText={editingText}
          onEdit={(postId, updatedContent) => {
            onEdit(postId, updatedContent);
          }}
          onDelete={() => onDelete(item.postId)}
          onEditSave={(updatedText) => {
            onEditSave(updatedText);
          }}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </AnswerListContainer>
  );
};

export default AnswerList;
