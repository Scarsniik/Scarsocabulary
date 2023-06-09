import { PathRouteProps } from "react-router-dom";
import Home from "src/components/Home";
import Login from "src/components/auth/Login";
import Signup from "src/components/auth/Signup";
import KanjiDetails from "src/components/kanji/KanjiDetails";
import KanjiList from "src/components/kanji/KanjiList";
import TagsList from "src/components/tags/TagsList";
import TrainingHome from "src/components/training/TrainingHome";
import VocabularyList from "src/components/vocabulary/VocabularyList";
import WordDetails from "src/components/vocabulary/WordDetails";

export const routes: ({needLogin?: boolean, name?: string} & PathRouteProps)[] = [
    {
        name: "login",
        path: "/login",
        element: <Login />,
    },
    {
        name: "login",
        path: "/signup",
        element: <Signup />,
    },
    {
        name: "vocabulary",
        path: "/vocabulary",
        element: <VocabularyList />,
        needLogin: true,
    },
    {
        name: "tags",
        path: "/tags",
        element: <TagsList />,
        needLogin: true,
    },
    {
        name: "training",
        path: "/training",
        element: <TrainingHome />,
        needLogin: true,
    },
    {
        name: "wordDetails",
        path: "/vocabulary/:id",
        element: <WordDetails />,
        needLogin: true,
    },
    {
        name: "kanjiDetails",
        path: "/kanjis/:id",
        element: <KanjiDetails />,
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
