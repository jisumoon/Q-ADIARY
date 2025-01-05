import React, { useState } from "react";
import styled from "styled-components";

interface InputFieldProps {
  onSave: (newAnswerText: string) => void;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

const CharCounter = styled.div`
  position: absolute;
  bottom: 60px;
  right: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.text || "#333"};
  opacity: 0.7;
`;
const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.secondary};
  border-radius: 8px;
  resize: none;
  outline: none;
  font-family: "Ownglyph_ParkDaHyun";
`;

const SaveButton = styled.button`
  padding: 10px;
  font-size: 18px;
  background-color: ${({ theme }) => theme.secondary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Ownglyph_ParkDaHyun";

  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const InputField: React.FC<InputFieldProps> = ({ onSave }) => {
  const [text, setText] = useState("");

  const handleSave = () => {
    if (text.trim()) {
      // handleSave 호출 디버깅
      console.log("handleSave called with:", text);

      onSave(text); // 저장 로직 실행
      setText(""); // 입력 필드 초기화
    }
  };

  return (
    <InputContainer>
      <TextArea
        rows={4}
        value={text}
        maxLength={25}
        onChange={(e) => setText(e.target.value)}
        placeholder="입력해주세요"
      />
      <SaveButton onClick={handleSave}>저장</SaveButton>
      <CharCounter>{text.length}/25</CharCounter>
    </InputContainer>
  );
};

export default InputField;
