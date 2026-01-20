
import fs from 'fs';
import path from 'path';
import https from 'https';

const CONTENT_DIR = path.join(process.cwd(), 'src/app/(pages)/projet/content');

interface ReleaseInfo {
    version: string;
    date: string;
    isPrerelease: boolean;
}

// Function to fetch latest release from GitHub
async function getLatestRelease(repoUrl: string): Promise<ReleaseInfo | null> {
    try {
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return null;

        const owner = match[1];
        const repo = match[2].replace(".git", "");

        const headers: any = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "Build-Script"
        };

        if (process.env.GITHUB_TOKEN) {
            headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=1`, { headers });

        if (!response.ok) {
            console.warn(`[GetLatestRelease] Failed to fetch releases for ${repoUrl}: ${response.status} ${response.statusText}`);
            if (response.status === 403) {
                console.warn("Rate limit likely exceeded or token invalid.");
            }
            return null;
        }

        const data: any = await response.json();

        if (!Array.isArray(data) || data.length === 0) return null;

        const latestRelease = data[0];

        return {
            version: latestRelease.tag_name,
            date: latestRelease.published_at,
            isPrerelease: latestRelease.prerelease
        };
    } catch (error) {
        console.error(`Error processing ${repoUrl}:`, error);
        return null;
    }
}

// Function to fetch latest commit from GitHub
async function getLatestCommit(repoUrl: string): Promise<{ date: string } | null> {
    try {
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return null;

        const owner = match[1];
        const repo = match[2].replace(".git", "");

        const headers: any = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "Build-Script"
        };

        if (process.env.GITHUB_TOKEN) {
            headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers });

        if (!response.ok) {
            return null;
        }

        const data: any = await response.json();

        if (!Array.isArray(data) || data.length === 0) return null;

        const latestCommit = data[0];

        return {
            date: latestCommit.commit.committer.date
        };
    } catch (error) {
        console.error(`Error processing commits for ${repoUrl}:`, error);
        return null;
    }
}

async function updateMdxFiles() {
    if (!fs.existsSync(CONTENT_DIR)) {
        console.error(`Content directory not found: ${CONTENT_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.mdx'));

    console.log(`Found ${files.length} MDX files to check...`);

    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;

        // 1. Normalize Dates globally in the file content (DD-MM-YYYY -> DD/MM/YYYY)
        // Match dates like 10-09-2025 and replace with 10/09/2025
        newContent = newContent.replace(/(\d{2})-(\d{2})-(\d{4})/g, '$1/$2/$3');

        // Check for non_maintenu flag
        const flagsMatch = newContent.match(/^flags:\s*\[(.*?)\]/m);
        const isNonMaintained = flagsMatch && (flagsMatch[1].includes('"non_maintenu"') || flagsMatch[1].includes("'non_maintenu'"));

        // Extract repository URL
        const repoMatch = newContent.match(/^repository:\s*["']([^"']+)["']/m);

        if (!repoMatch) continue;
        const repoUrl = repoMatch[1];

        if (isNonMaintained) {
            console.log(`Checking latest commit for ${file} (non_maintenu)...`);
            const commitInfo = await getLatestCommit(repoUrl);

            if (commitInfo) {
                const commitDate = new Date(commitInfo.date);
                const day = String(commitDate.getDate()).padStart(2, '0');
                const month = String(commitDate.getMonth() + 1).padStart(2, '0');
                const year = commitDate.getFullYear();
                const formattedDate = `${day}/${month}/${year}`;

                if (newContent.match(/^date_fin:/m)) {
                    newContent = newContent.replace(/^date_fin:.*$/m, `date_fin: "${formattedDate}"`);
                } else {
                    newContent = newContent.replace(/(^date_debut:.*$)/m, `$1\ndate_fin: "${formattedDate}"`);
                }
                console.log(`Updated ${file} date_fin to ${formattedDate} (from commit)`);
            }
        } else {
            console.log(`Checking updates for ${file} (${repoUrl})...`);
            const releaseInfo = await getLatestRelease(repoUrl);

            if (releaseInfo) {
                // Update date_fin
                const releaseDate = new Date(releaseInfo.date);
                const day = String(releaseDate.getDate()).padStart(2, '0');
                const month = String(releaseDate.getMonth() + 1).padStart(2, '0');
                const year = releaseDate.getFullYear();
                const formattedDate = `${day}/${month}/${year}`;

                // Replace or add date_fin
                if (newContent.match(/^date_fin:/m)) {
                    newContent = newContent.replace(/^date_fin:.*$/m, `date_fin: "${formattedDate}"`);
                } else {
                    // Insert after date_debut
                    newContent = newContent.replace(/(^date_debut:.*$)/m, `$1\ndate_fin: "${formattedDate}"`);
                }

                // Replace or add version
                if (newContent.match(/^version:/m)) {
                    newContent = newContent.replace(/^version:.*$/m, `version: "${releaseInfo.version}"`);
                } else {
                    // Insert after repository
                    newContent = newContent.replace(/(^repository:.*$)/m, `$1\nversion: "${releaseInfo.version}"`);
                }

                // Replace or add isPrerelease
                if (newContent.match(/^isPrerelease:/m)) {
                    newContent = newContent.replace(/^isPrerelease:.*$/m, `isPrerelease: ${releaseInfo.isPrerelease}`);
                } else {
                    // Insert after version
                    newContent = newContent.replace(/(^version:.*$)/m, `$1\nisPrerelease: ${releaseInfo.isPrerelease}`);
                }

                console.log(`Updated ${file} with version ${releaseInfo.version}`);
            } else {
                // FALLBACK: No release found, check latest commit
                console.log(`No release found for ${file}, checking latest commit...`);
                const commitInfo = await getLatestCommit(repoUrl);

                if (commitInfo) {
                    const commitDate = new Date(commitInfo.date);
                    const day = String(commitDate.getDate()).padStart(2, '0');
                    const month = String(commitDate.getMonth() + 1).padStart(2, '0');
                    const year = commitDate.getFullYear();
                    const formattedDate = `${day}/${month}/${year}`;

                    if (newContent.match(/^date_fin:/m)) {
                        newContent = newContent.replace(/^date_fin:.*$/m, `date_fin: "${formattedDate}"`);
                    } else {
                        newContent = newContent.replace(/(^date_debut:.*$)/m, `$1\ndate_fin: "${formattedDate}"`);
                    }
                    console.log(`Updated ${file} date_fin to ${formattedDate} (from commit fallback)`);
                }
            }
        }



        // Write back if content changed
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Saved changes to ${file}`);
        }
    }

    // GENERATE public/projets.json
    console.log("Generating public/projets.json from MDX files...");
    const projects = [];
    let idCounter = 1;

    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const slug = file.replace('.mdx', '');

        // Helper to extract field
        const extract = (key: string) => {
            const regex = new RegExp(`^${key}:\\s*(?:"([^"]*)"|([^\\n\\r]*))`, 'm');
            const match = content.match(regex);
            return match ? (match[1] || match[2] || "").trim() : "";
        };

        const extractArray = (key: string) => {
            const regex = new RegExp(`^${key}:\\s*\\[(.*?)\\]`, 'm');
            const match = content.match(regex);
            if (!match) return [];
            return match[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        };

        const extractBoolean = (key: string) => {
            const val = extract(key);
            return val === 'true';
        }

        // Parse fields
        const nom = extract("nom");
        const type = extract("type");
        const logo = extract("logo");
        const description = extract("description");
        let date_debut = extract("date_debut");
        let date_fin = extract("date_fin");
        const statut = extract("statut");
        const repository = extract("repository");
        const framework = extract("framework");
        const module = extract("module");
        const language_prog = extract("language_prog");
        const version = extract("version");
        const isPrerelease = extractBoolean("isPrerelease");
        const pinned = extractBoolean("pinned");

        const tags = extractArray("tags");
        const flags = extractArray("flags");

        // Ensure dates in JSON are also normalized (though file update should have handled it)
        if (date_debut) date_debut = date_debut.replace(/-/g, '/');
        if (date_fin) date_fin = date_fin.replace(/-/g, '/');

        if (nom) {
            projects.push({
                id: idCounter++,
                nom,
                type,
                logo,
                description,
                language_prog,
                statut,
                repository,
                framework,
                module,
                url: `/projet/${slug}`,
                date_debut,
                date_fin,
                pinned,
                tags,
                version: version || null,
                isPrerelease,
                flags
            });
        }
    }

    const outputPath = path.join(process.cwd(), 'public', 'projets.json');
    fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2), 'utf8');
    console.log(`Generated projects.json with ${projects.length} projects.`);
}

updateMdxFiles().catch(err => {
    console.error("Script failed:", err);
    process.exit(1);
});
