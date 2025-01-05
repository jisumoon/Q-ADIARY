import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

//애니메이션
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const backgroundAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  height: 100vh;
  background-size: 200% 200%;
  animation: ${backgroundAnimation} 6s infinite ease-in-out;
  color: #fff;
  text-align: center;
`;

const Tagline = styled.h2`
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 2.5s ease-in-out;
  font-family: "HakgyoansimNadeuriTTF-B", sans-serif;
`;

const Footer = styled.footer`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const Loading: React.FC = () => {
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  if (!show) return null;

  return (
    <LoadingScreen>
      <FontAwesomeIcon
        icon={faSpinner}
        spin
        style={{ fontSize: "20px", marginRight: "10px" }}
      />

      <Tagline>나의 지난 이야기가 펼쳐집니다.</Tagline>
      <Footer>
        &copy; 2025 Memory Lane. 당신의 소중한 순간들을 함께합니다.
      </Footer>
    </LoadingScreen>
  );
};

export default Loading;
