import { Patchnote } from "src/models/patchnote";

export const patchnote: Patchnote[] = [
    {
        version: "1.0.4",
        date: "29/04/2023 22h20",
        changes: [
            "Change la case à coché par filtrer les mots par date pour un slider pour plus de précision (de 1 à 14 jours)",
            "Réduction de la taille du drop down menu des filtres dans les listes",
        ]
    },
    {
        version: "1.0.3",
        date: "29/04/2023 19h00",
        changes: [
            "Ajout du choix de type d'aléatoire entre completement aléatoire et l'aléatoire sans remise.",
        ]
    },
    {
        version: "1.0.2",
        date: "29/04/2023 3h00",
        changes: [
            "Ajout d'un filtre pour n'afficher que les mots ajoutés dans la journée sur la liste de vocabulaire",
            "Ajout des patch notes",
        ]
    },
]
