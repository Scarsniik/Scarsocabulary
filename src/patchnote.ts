import { Patchnote } from "src/models/patchnote";

export const patchnote: Patchnote[] = [
    {
        version: "1.1.9",
        date: "16/10/2023 21h20",
        changes: [
            "Entrainement : Possibilité de choisir une limite de mot tirés et de les répéter un nombre de fois donné avant que l'entrainement se termine",
        ]
    },
    {
        version: "1.1.8",
        date: "09/05/2023 1h30",
        changes: [
            "Ajout d'un page pour les détails d'un kanji encore bien vide mais si j'ai la foi je mettrais d'autres trucs",
        ]
    },
    {
        version: "1.1.7",
        date: "05/05/2023 20h17",
        changes: [
            "Fixe de l'affichage mobile. Normalement tout devrait s'afficher. C'est pas forcement beau mais ça fonctionne",
        ]
    },
    {
        version: "1.1.6",
        date: "05/05/2023 18h30",
        changes: [
            "Ajout d'un input pour regler la force du tirage aléatoire pondéré",
        ]
    },
    {
        version: "1.1.5",
        date: "04/05/2023 17h30",
        changes: [
            "Ajout du tirage pondéré pour l'entrainement. Dans ce mode, le tirage aléatoire se fait selon le score que vous avez pour chaque mot.",
        ]
    },
    {
        version: "1.1.4",
        date: "02/05/2023 2h05",
        changes: [
            "Ajout de la page de gestion des tags",
        ]
    },
    {
        version: "1.1.3",
        date: "01/05/2023 17h40",
        changes: [
            "Ajout de filtre par date de création dans la liste de kanji",
        ]
    },
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
