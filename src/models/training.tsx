export enum TrainingSubject {
    Vocabulary = "vocabulary",
    Kanji = "kanji",
}

export enum TrainingType {
    Cards = "cards",
}

export enum TrainingLanguage {
    FromFrench = "fromFrench",
    FromKana = "fromKana",
    FromKanji = "fromKanji",
}

export enum TrainingFilters {
    Favorites = "favorites",
}

export enum TrainingRandomType {
    Full = "full",
    NoDouble = "noDouble",
    Weighted = "weighted",
}

type ValidKey = keyof typeof TrainingSubject | keyof typeof TrainingType | keyof typeof TrainingLanguage | keyof typeof TrainingFilters;

export type TrainingSettingsData = {
    randomType: TrainingRandomType;
    createdSince: number;
    tags: string[];
    useScore: boolean;
} & {
    [K in ValidKey as `${(typeof TrainingSubject & typeof TrainingType & typeof TrainingLanguage & typeof TrainingFilters)[K]}`]: boolean;
};
