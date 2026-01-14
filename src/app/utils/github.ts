export interface ReleaseInfo {
    version: string;
    date: string; // ISO string
}

export async function getLatestRelease(repoUrl: string): Promise<ReleaseInfo | null> {
    try {
        // Extract owner and repo from URL
        // format: https://github.com/owner/repo
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return null;

        const owner = match[1];
        const repo = match[2];

        // Ensure we don't have .git at the end
        const cleanRepo = repo.replace(".git", "");

        const headers: HeadersInit = {
            "Accept": "application/vnd.github+json"
        };

        if (process.env.GITHUB_TOKEN) {
            headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

        // Fetch /releases/latest to get only the latest stable release
        // Defaults to 'force-cache' in Next.js App Router for fetch(), which means it's cached indefinitely (until rebuild or revalidate)
        // This satisfies "uniquement lors du build de l'appli" if there is no revalidate time.
        const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/releases/latest`, {
            headers,
            // cache: 'force-cache' is default in Next.js for fetch
        });

        if (!response.ok) {
            // Not found or rate limited
            return null;
        }

        const data = await response.json();

        return {
            version: data.tag_name,
            date: data.published_at // "2024-01-14T..."
        };

    } catch (error) {
        console.error("Error fetching GitHub release:", error);
        return null;
    }
}
