// Theme 타입 정의
export interface Theme {
  background: string;
  text: string;
  primary: string;
  secondary: string;
}

// 주간 테마
export const lightTheme: Theme = {
  background: "linear-gradient(120deg, #e0c3fc, #8ec5fc)",
  text: "#2C3E50",
  primary: "#8ec5fc",
  secondary: "#e0c3fc",
};

// 야간 테마
export const darkTheme: Theme = {
  background: "linear-gradient(120deg, #2C3E50, #34495E)",
  text: "#ECF0F1",
  primary: "#3498DB",
  secondary: "#95A5A6",
};
