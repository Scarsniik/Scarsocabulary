import { Toast, ToastType } from "src/models/toast";
import { classNames } from "src/utils/classNames";

import { useContext, useEffect, useState } from "react";
import { ToastContext } from "src/contexts/ToastContext";
import "src/styles/utils/scrollTopButton.scss";

interface Props {
  toast: Toast;
}

export default function ToastElement(props: Props) {
  const {toast} = props;

  const toasts = useContext(ToastContext);

  const [ needDestruction, setNeedDestruction ] = useState<boolean>(false);

  useEffect(() => {
      setTimeout(() => {
        setNeedDestruction(true);
      }, 3000);
  }, []);

  function selfDestruct() {
    if (needDestruction) {
      toasts.delete(toast.key as string);
    }
  }

  return (
    <div
      key={toast.key}
      className={classNames(
        "toast",
        toast.type === ToastType.Success ? "success" : toast.type === ToastType.Error ? "error" : "neutral",
        needDestruction && "deleting",
      )}
      onAnimationEnd={selfDestruct}
    >
      <button onClick={() => setNeedDestruction(true)}>X</button>
      <h5 className="title">{toast.title}</h5>
      <p>{toast.body}</p>
    </div>
  );
}
