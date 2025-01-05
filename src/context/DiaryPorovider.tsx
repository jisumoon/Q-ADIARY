import React, { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { createPost, updatePost, deletePost } from "../utils/postUtils";

interface Answer {
  postId: string;
  title: string;
  date: string;
  answer: string;
  content?: string;
}

interface DiaryContextProps {
  currentUserId: string | null;
  selectedDate: string;
  answers: { [key: string]: Answer[] };
  setSelectedDate: (date: string) => void;
  handleSaveAnswer: (newAnswer: Answer) => Promise<void>;
  handleDeleteAnswer: (postId: string) => Promise<void>;
  handleEditAnswer: (postId: string, updatedAnswer: string) => Promise<boolean>;
}

const DiaryContext = createContext<DiaryContextProps | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const getToday = () => {
    const today = new Date();
    return today
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, "-")
      .replace(/\./g, "");
  };

  const [selectedDate, setSelectedDate] = useState<string>(getToday());
  const [answers, setAnswers] = useState<{ [key: string]: Answer[] }>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 사용자 인증 및 데이터 구독
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);

        const userPostsRef = collection(db, `users/${user.uid}/posts`);
        const unsubscribeSnapshot = onSnapshot(userPostsRef, (snapshot) => {
          const loadedAnswers: { [key: string]: Answer[] } = {};

          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const dateKey = data.title || data.date;
            loadedAnswers[dateKey] = loadedAnswers[dateKey] || [];
            loadedAnswers[dateKey].push({
              postId: doc.id,
              date: data.date || dateKey,
              title: data.title,
              answer: data.answer || "",
              content: data.content || "",
            });
          });

          setAnswers(loadedAnswers);
        });

        return () => unsubscribeSnapshot();
      } else {
        setCurrentUserId(null);
        setAnswers({});
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 답변 저장
  const handleSaveAnswer = async (newAnswer: Answer) => {
    setAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[selectedDate] || [];

      // 중복 검사
      const isDuplicate = currentAnswers.some(
        (answer) => answer.content === newAnswer.content
      );

      if (isDuplicate) {
        console.warn("Duplicate answer detected, skipping save.");
        return prevAnswers;
      }

      // 새로운 상태 업데이트
      return {
        ...prevAnswers,
        [selectedDate]: [...currentAnswers, newAnswer],
      };
    });

    // Firestore에 저장
    if (currentUserId) {
      const result = await createPost(
        currentUserId,
        newAnswer.title,
        newAnswer.content || newAnswer.answer || ""
      );

      if (!result) {
        console.error("Failed to create post in Firestore.");
      }
    }
  };

  // 답변 삭제
  const handleDeleteAnswer = async (postId: string) => {
    if (!currentUserId) return;

    const success = await deletePost(currentUserId, postId);
    if (success) {
      setAnswers((prev) => {
        const currentAnswers = prev[selectedDate] || [];
        return {
          ...prev,
          [selectedDate]: currentAnswers.filter(
            (item) => item.postId !== postId
          ),
        };
      });
    }
  };

  // 답변 수정
  const handleEditAnswer = async (postId: string, updatedAnswer: string) => {
    if (!currentUserId) return false;

    try {
      await updatePost(currentUserId, postId, updatedAnswer);
      setAnswers((prev) => {
        const currentAnswers = prev[selectedDate] || [];
        const updatedText = currentAnswers.map((item) =>
          item.postId === postId ? { ...item, answer: updatedAnswer } : item
        );

        return { ...prev, [selectedDate]: updatedText };
      });

      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <DiaryContext.Provider
      value={{
        currentUserId,
        selectedDate,
        answers,
        setSelectedDate,
        handleSaveAnswer,
        handleDeleteAnswer,
        handleEditAnswer,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error("useDiary must be used within a DiaryProvider");
  }
  return context;
};
