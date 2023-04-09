import Header from "src/components/layout/Header";
import { Popup } from "src/components/utils/Popup";
import "src/styles/layout.scss";

interface Props {
  children?: JSX.Element | string;
  center?: boolean;
}

export default function Layout(props: Props) {
  const { children, center } = props;
  return (
      <div id="layout">
        <Header />
        <div id="pageContent" className={(center && "center") as string}>
          { children }
        </div>
        <Popup/>
      </div>
  );
}
