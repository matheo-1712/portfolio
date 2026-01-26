export interface LanguageStyle {
    bg: string;
    text: string;
    border: string;
}

export const languageColors: Record<string, LanguageStyle> = {
    "TypeScript": {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-800"
    },
    "JavaScript": {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-300",
        border: "border-yellow-200 dark:border-yellow-800"
    },
    "Python": {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        border: "border-green-200 dark:border-green-800"
    },
    "Java": {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-300",
        border: "border-orange-200 dark:border-orange-800"
    },
    "C#": {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-200 dark:border-purple-800"
    },
    "PHP": {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
        border: "border-red-200 dark:border-red-800"
    },
    "C++": {
        bg: "bg-cyan-100 dark:bg-cyan-900/30",
        text: "text-cyan-700 dark:text-cyan-300",
        border: "border-cyan-200 dark:border-cyan-800"
    },
    "Kotlin": {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-200 dark:border-purple-800"
    },
    "default": {
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
        text: "text-indigo-700 dark:text-indigo-300",
        border: "border-indigo-200 dark:border-indigo-800"
    }
};
