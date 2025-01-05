import React from "react";
import styled from "styled-components";
import DiaryList from "../components/DiaryList";

const Container = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 20px;
  justify-content: center;
  height: calc(100vh - 100px);
`;

const Home: React.FC = () => {
  return (
    <Container>
      <DiaryList />
    </Container>
  );
};

export default Home;
