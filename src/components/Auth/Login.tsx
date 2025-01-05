import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  loginWithEmailAndPassword,
  resetPassword,
} from "../../utils/authUtils";
import Loading from "../../components/Loading/Loading";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text};
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  margin-bottom: 20px;
  font-size: 22px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const Label = styled.label<{ isFocused: boolean }>`
  position: absolute;
  top: ${({ isFocused }) => (isFocused ? "14px" : "50%")};
  left: 10px;
  transform: translateY(-50%);
  font-size: ${({ isFocused }) => (isFocused ? "14px" : "18px")};
  color: ${({ isFocused, theme }) =>
    isFocused ? theme.primary : theme.secondary};
  transition: all 0.3s ease;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  padding-top: 30px;
  border: 1px solid ${({ theme }) => theme.secondary};
  border-radius: 5px;
  outline: none;
  font-size: 1rem;
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 20px;
  font-family: "Ownglyph_ParkDaHyun";
  color: #fff;
  background-color: ${({ theme }) => theme.secondary};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
  }
`;

const Infotitle = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  cursor: pointer; /* 클릭 가능한 상태 표시 */
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorText = styled.p`
  width: 100%;
  margin-bottom: 10px;
  text-align: left;
  color: crimson;
  font-size: 16px;
  transition: all 1s;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isemailFocused, setIsemailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true); // 로딩 시작
    try {
      const user = await loginWithEmailAndPassword(email, password);
      if (user) {
        navigate("/");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  //비밀번호 재설정
  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage("비밀번호를 재설정하려면 이메일을 입력해주세요");
      return;
    }

    try {
      await resetPassword(email);
      alert("비밀번호 재설정 이메일이 발송되었습니다. 이메일을 확인해주세요.");
      setResetMode(false);
    } catch (error: any) {
      setErrorMessage(
        error.message || "비밀번호 재설정 중 오류가 발생했습니다"
      );
    }
  };

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <LoginBox>
          <Title>{resetMode ? "비밀번호 재설정" : "Login"}</Title>
          <Subtitle>
            {resetMode
              ? "비밀번호를 재설정할 이메일을 입력해주세요."
              : "지금, 당신의 이야기를 시작해 보세요."}
          </Subtitle>

          <InputWrapper>
            <Label isFocused={isemailFocused || email.length > 0}>이메일</Label>
            <Input
              type="text"
              onFocus={() => setIsemailFocused(true)}
              onBlur={() => setIsemailFocused(false)}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              onKeyDown={handleKeyDown}
            />
          </InputWrapper>

          {!resetMode && (
            <>
              <InputWrapper>
                <Label isFocused={isPasswordFocused || password.length > 0}>
                  비밀번호
                </Label>
                <Input
                  type="password"
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  onKeyDown={handleKeyDown}
                />
              </InputWrapper>
              {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
              <Button onClick={handleLogin}>Login</Button>
              <Infotitle onClick={handleSignup}>
                회원가입이 필요합니다. 지금, 당신의 특별한 여정을 함께 만들어
                보세요.
              </Infotitle>
            </>
          )}

          {resetMode && (
            <>
              <Button onClick={handleResetPassword}>
                재설정 이메일 보내기
              </Button>
              <Infotitle onClick={() => setResetMode(false)}>
                로그인 화면으로 돌아가기
              </Infotitle>
            </>
          )}

          {!resetMode && (
            <Infotitle onClick={() => setResetMode(true)}>
              비밀번호를 잊으셨나요? 여기를 클릭하면 비밀번호를 재설정할 수
              있습니다.
            </Infotitle>
          )}
        </LoginBox>
      )}
    </Container>
  );
};

export default Login;
