import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function parseGitignore(filepath: string): string[] {
    if (!fs.existsSync(filepath)) return [];
    return fs
        .readFileSync(filepath)
        .toString()
        .trim()
        .split(/\r?\n/)
        .filter(x => !x.startsWith('#'))
        .map(x => x.trim())
        .filter(Boolean);
}

type Params = {
    src: string;
    localGitignore: boolean;
    globalGitignore: boolean;
};

export function getParsedGitignores({
    src,
    localGitignore,
    globalGitignore,
}: Params): string[] {
    const localGitignoreContent: string[] = localGitignore
        ? parseGitignore(path.join(src, '.gitignore'))
        : [];

    const globalGitignoreContent: string[] = globalGitignore
        ? parseGitignore(path.join(os.homedir(), '.gitignore'))
        : [];

    return [...localGitignoreContent, ...globalGitignoreContent];
}
