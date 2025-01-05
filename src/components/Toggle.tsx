import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

interface ToggleButtonProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ButtonWrapper = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 30px;
  border-radius: 15px;
  background: ${({ $isDarkMode }) => ($isDarkMode ? "#4C566A" : "#E5E9F0")};

  position: relative;
  cursor: pointer;
  transition: background 0.3s ease, border 0.3s ease;
`;

const ToggleCircle = styled.div<{ $isDarkMode: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ $isDarkMode }) => ($isDarkMode ? "#FDFD96" : "#81A1C1")};
  position: absolute;
  top: 2px;
  left: ${({ $isDarkMode }) => ($isDarkMode ? "30px" : "2px")};
  transition: left 0.3s ease, background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isDarkMode,
  onToggle,
}) => {
  return (
    <ButtonWrapper $isDarkMode={isDarkMode} onClick={onToggle}>
      <ToggleCircle $isDarkMode={isDarkMode}>
        <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} />
      </ToggleCircle>
    </ButtonWrapper>
  );
};

export default ToggleButton;
