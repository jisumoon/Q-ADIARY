import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

// Post 생성
export const createPost = async (
  userId: string,
  title: string,
  content: string
): Promise<string | null> => {
  try {
    const postsCollectionRef = collection(db, `users/${userId}/posts`);

    // Firestore 문서 생성
    const docRef = await addDoc(postsCollectionRef, {
      title,
      content,
      createdAt: new Date(),
    });

    return docRef.id; // Firestore에서 생성한 문서 ID 반환
  } catch (error) {
    return null;
  }
};

// Post 수정
export const updatePost = async (
  userId: string,
  postId: string,
  updatedContent: string
): Promise<boolean> => {
  try {
    const postDocRef = doc(db, `users/${userId}/posts/${postId}`);
    await updateDoc(postDocRef, {
      content: updatedContent,
      updatedAt: new Date(),
    });

    console.log("Firestore Update Successful:", updatedContent);
    return true;
  } catch (error) {
    console.error("Error Updating Firestore:", error);
    return false;
  }
};

// Post 삭제
export const deletePost = async (
  userId: string,
  postId: string // Firestore 문서 ID
): Promise<boolean> => {
  try {
    const postDocRef = doc(db, `users/${userId}/posts/${postId}`); // Firestore 경로에 접근
    await deleteDoc(postDocRef); // 문서 삭제

    return true;
  } catch (error) {
    return false;
  }
};

// 글 작성한 날짜 가져오기기
export const subscribeToEntriesByMonth = (
  userId: string,
  year: number,
  month: number,
  callback: (entries: { id: string; date: string }[]) => void
) => {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-31`;

  const postsRef = collection(db, `users/${userId}/posts`);
  const q = query(
    postsRef,
    where("title", ">=", startDate),
    where("title", "<=", endDate)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const entries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      date: doc.data().title,
    }));
    callback(entries);
  });

  return unsubscribe; // 구독 해제 함수 반환
};
