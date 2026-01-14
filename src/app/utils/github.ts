export interface ReleaseInfo {
    version: string;
    date: string; // ISO string
    isPrerelease: boolean;
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

        // Fetch /releases?per_page=1 to get the very latest release including pre-releases
        const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/releases?per_page=1`, {
            headers,
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            // Not found or rate limited
            return null;
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            return null;
        }

        const latestRelease = data[0];

        return {
            version: latestRelease.tag_name,
            date: latestRelease.published_at,
            isPrerelease: latestRelease.prerelease
        };

    } catch (error) {
        console.error("Error fetching GitHub release:", error);
        return null;
    }
}
