import Header from "src/components/layout/Header";
import { Popup } from "src/components/utils/Popup";
import "src/styles/layout.scss";
import { classNames } from "src/utils/classNames";

interface Props {
  children?: JSX.Element | string;
  center?: boolean;
  loading?: boolean;
  className?: string;
}

export default function Layout(props: Props) {
  const { children, center, loading, className } = props;
  return (
      <div id="layout">
        <Header />
        <div id="pageContent" className={classNames(center && "center", className) as string}>
          { !loading && children }
        </div>
        <Popup/>
      </div>
  );
}
