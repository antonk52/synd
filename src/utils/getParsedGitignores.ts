import fs from 'fs';
import os from 'os';
import path from 'path';

function parseGitignore(filepath: string): string[] {
    if (!fs.existsSync(filepath)) return [];
    return fs
        .readFileSync(filepath)
        .toString()
        .trim()
        .split(/\r?\n/)
        .filter(x => !x.startsWith('#'))
        .map(x => x.trim());
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
