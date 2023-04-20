import Router from "src/components/Router";
import { AuthManager } from "src/components/auth/AuthManager";
import { PopupManager } from "src/components/utils/PopupManager";
import { ToastManager } from "src/components/utils/ToastManager";

import "src/styles/app.scss";

function App() {
  return (
    <AuthManager>
      <ToastManager>
        <PopupManager>
          <Router/>
        </PopupManager>
      </ToastManager>
    </AuthManager>
    
  );
}

export default App;
