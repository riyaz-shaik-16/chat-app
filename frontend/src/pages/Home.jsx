import { LeftSideBar, ChatContainer } from "../components";

const Home = () => {
  return (
    <div className="flex h-screen">
      <LeftSideBar />
      <ChatContainer className={`flex-1`} />
    </div>
  );
};

export default Home;
