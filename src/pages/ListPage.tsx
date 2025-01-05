import PostList from "../components/PostList";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 20px;
  justify-content: center;
  height: calc(100vh - 100px);
`;

const ListPage = () => {
  return (
    <Container>
      <PostList />
    </Container>
  );
};

export default ListPage;
