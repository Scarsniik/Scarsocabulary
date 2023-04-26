import { PathRouteProps } from "react-router-dom";
import Home from "src/components/Home";
import Login from "src/components/auth/Login";
import KanjiList from "src/components/kanji/KanjiList";
import VocabularyList from "src/components/vocabulary/VocabularyList";

export const routes: ({needLogin?: boolean, name?: string} & PathRouteProps)[] = [
    {
        name: "login",
        path: "/login",
        element: <Login />,
    },
    {
        name: "vocabulary",
        path: "/vocabulary",
        element: <VocabularyList />,
        needLogin: true,
    },
    {
        name: "kanji",
        path: "/kanji",
        element: <KanjiList />,
        needLogin: true,
    },
    {
        name: "home",
        path: "/*",
        element: <Home />,
    }
];
