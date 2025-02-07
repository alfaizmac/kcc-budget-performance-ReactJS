import "./App.css";
import Dashboard from "./Components/Dashboard";
import SideMenu from "./Components/SideMenu";

function App() {
  return (
    <div className="App">
      <div className="main-container">
        <SideMenu />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
