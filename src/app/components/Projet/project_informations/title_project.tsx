interface TitleProjectProps {
    title: string;
}

export default function Title_Project({ title }: TitleProjectProps) {
    return (
        <div className="flex flex-col items-center mb-6">
            <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">{title}</h1>
            <span className="border-b-4 border-blue-600 w-32 mt-2"></span>
        </div>
    );
}
