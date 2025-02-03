import { Sidebar } from "./components/Sidebar/Sidebar";
import { MainContent } from "./components/MainContent/MainContent";

const App = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="ml-64" style={{ width: "calc(100vw - 18rem)" }}>
        <MainContent />
      </div>
    </div>
  );
};

export default App;
