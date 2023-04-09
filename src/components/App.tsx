import Router from "src/components/Router";
import { PopupManager } from "src/components/utils/PopupManager";
import { ToastManager } from "src/components/utils/ToastManager";

import "src/styles/app.scss";

function App() {
  return (
    <ToastManager>
      <PopupManager>
        <Router/>
      </PopupManager>
    </ToastManager>
    
  );
}

export default App;
