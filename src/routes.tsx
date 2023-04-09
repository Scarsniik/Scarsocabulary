import { PathRouteProps } from "react-router-dom";
import Home from "src/components/Home";
import VocabularyList from "src/components/vocabulary/VocabularyList";

export const routes: PathRouteProps [] = [
    {
        path: "/Vocabulary",
        element: <VocabularyList />,
    },
    {
        path: "/*",
        element: <Home />,
    }
];
