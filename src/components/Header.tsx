import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faList, faCalendar } from "@fortawesome/free-solid-svg-icons";
import ToggleButton from "./Toggle";
import { useTheme } from "../context/ThemePorvider";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 15px 25px;
  background: ${({ theme }) => theme.background};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin: 10px 20px;
  position: sticky;
  top: 10px;
  z-index: 100;
  transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const UserWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .username {
    font-size: 18px;

    color: ${({ theme }) => theme.text};
    transition: color 0.3s ease-in-out;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.primary};
    }
  }

  .icon {
    background-color: ${({ theme }) => theme.primary};
    color: #fff;
    border-radius: 50%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const DiaryLink = styled.button`
  font-size: 18px;
  transition: color 0.3s;
  font-weight: bold;
  border: none;
  background: none;
  font-family: "HakgyoansimNadeuriTTF-B";
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.secondary};
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContext); // 현재 로그인 사용자 정보
  const [username, setUsername] = useState<string>("로그인/회원가입");
  const isLoggedIn = Boolean(authContext?.currentUser);

  const isDiaryList = location.pathname === "/list";

  useEffect(() => {
    const fetchUsername = async () => {
      if (authContext?.currentUser) {
        // 로그인한 사용자가 있는 경우
        const userRef = doc(db, "users", authContext.currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.name || "사용자");
        }
      } else {
        // 로그아웃 상태
        setUsername("로그인/회원가입");
      }
    };

    fetchUsername();
  }, [authContext?.currentUser]);

  const handleUserClick = async () => {
    if (authContext?.currentUser) {
      try {
        await signOut(auth);
        alert("로그아웃되었습니다.");
        setUsername("로그인/회원가입");
        navigate("/login");
      } catch (error) {}
    } else {
      navigate("/login");
    }
  };

  const handleDiaryLinkClick = () => {
    if (isLoggedIn) {
      navigate(isDiaryList ? "/" : "/list");
    }
  };

  return (
    <HeaderWrapper>
      <UserWrapper onClick={handleUserClick}>
        <FontAwesomeIcon icon={faUser} size="sm" color="#007bff" />
        <span className="username">{username}</span>
      </UserWrapper>
      <DiaryLink onClick={handleDiaryLinkClick} disabled={!isLoggedIn}>
        <FontAwesomeIcon
          icon={isDiaryList ? faCalendar : faList}
          style={{ marginRight: "8px" }}
        />
        {isDiaryList ? "캘린더 보기" : "리스트 보기"}
      </DiaryLink>
      <ToggleWrapper>
        <ToggleButton isDarkMode={isDarkMode} onToggle={toggleTheme} />
      </ToggleWrapper>
    </HeaderWrapper>
  );
};

export default Header;
