import { Patchnote } from "src/models/patchnote";

export const patchnote: Patchnote[] = [
    {
        version: "1.1.2",
        date: "30/04/2023 23h59",
        changes: [
            "Ajout de filtre par tag dans l'entrainement",
        ]
    },
    {
        version: "1.1.1",
        date: "30/04/2023 23h15",
        changes: [
            "Ajout de filtre par tag dans la liste de vocabulaire",
            "Quelques fixes liés aux tags",
        ]
    },
    {
        version: "1.1.0",
        date: "30/04/2023 20h30",
        changes: [
            "Possibilité d'ajouter des tags sur les mots de vocabulaire.",
            "A venir : Tri par tag dans les tableaux et entrainement et tableau de gestion des tag (edit et delete)",
        ]
    },
    {
        version: "1.0.4",
        date: "29/04/2023 22h20",
        changes: [
            "Change la case à coché par filtrer les mots par date pour un slider pour plus de précision (de 1 à 14 jours). Ne fonctionne pas pour les mots créés avant le 27/04 car ceux ci n'ont pas de date associé",
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
