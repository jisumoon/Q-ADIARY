import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { signupWithEmailAndPassword } from "../../utils/authUtils";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const SignupBox = styled.div`
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
  margin-bottom: 10px;
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
  margin-top: 20px;
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

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  //유효성 검사
  const validateInputs = () => {
    const newErrors: typeof errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!name.trim()) newErrors.name = "이름을 입력해주세요.";
    if (!email.includes("@"))
      newErrors.email = "유효한 이메일 주소를 입력해주세요.";
    if (password.length < 6)
      newErrors.password = "비밀번호는 6자리 이상이어야 합니다.";
    else if (
      !/[a-zA-Z]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    )
      newErrors.password = "비밀번호에는 영어, 특수문자가 포함되어야 합니다.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    try {
      await signupWithEmailAndPassword(email, password, name);
      alert("회원가입이 완료되었습니다");
      navigate("/login");
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, email: err.message }));
    }
  };

  return (
    <Container>
      <SignupBox>
        <Title>Signup</Title>
        <Subtitle>회원가입을 통해 당신의 이야기를 시작해 보세요.</Subtitle>
        <InputWrapper>
          <Label isFocused={isNameFocused || name.length > 0}>이름</Label>
          <Input
            type="text"
            onFocus={() => {
              setIsNameFocused(true);
              setErrors((prev) => ({ ...prev, name: "" })); // 에러 초기화
            }}
            onBlur={() => setIsNameFocused(false)}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </InputWrapper>
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
        <InputWrapper>
          <Label isFocused={isEmailFocused || email.length > 0}>이메일</Label>
          <Input
            type="email"
            onFocus={() => {
              setIsEmailFocused(true);
              setErrors((prev) => ({ ...prev, email: "" })); // 에러 초기화
            }}
            onBlur={() => setIsEmailFocused(false)}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </InputWrapper>
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
        <InputWrapper>
          <Label isFocused={isPasswordFocused || password.length > 0}>
            비밀번호
          </Label>
          <Input
            type="password"
            onFocus={() => {
              setIsPasswordFocused(true);
              setErrors((prev) => ({ ...prev, password: "" })); // 에러 초기화
            }}
            onBlur={() => setIsPasswordFocused(false)}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </InputWrapper>
        {errors.password && <ErrorText>{errors.password}</ErrorText>}
        <InputWrapper>
          <Label
            isFocused={isConfirmPasswordFocused || confirmPassword.length > 0}
          >
            비밀번호 확인
          </Label>
          <Input
            type="password"
            onFocus={() => {
              setIsConfirmPasswordFocused(true);
              setErrors((prev) => ({ ...prev, confirmPassword: "" })); // 에러 초기화
            }}
            onBlur={() => setIsConfirmPasswordFocused(false)}
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
        </InputWrapper>
        {errors.confirmPassword && (
          <ErrorText>{errors.confirmPassword}</ErrorText>
        )}
        <Button onClick={handleSignup}>회원가입</Button>
        <Infotitle onClick={handleLogin}>
          이미 계정이 있으신가요? 로그인 페이지로 이동하세요.
        </Infotitle>
      </SignupBox>
    </Container>
  );
};

export default Signup;
