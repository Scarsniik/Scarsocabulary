import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "src/routes";

import "src/styles/app.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        { routes.map((value, index) => (
          <Route path={value.path} element={value.element} key={index}/>
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
