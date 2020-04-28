import {getParsedGitignores} from './getParsedGitignores';

const startsWithBang = (str: string): boolean => str.startsWith('!');
const removeStartBang = (str: string): string => str.replace(/^!/, '');

type IncludeExclude = {
    include: string[];
    exclude: string[];
};

type Params = {
    src: string;
    include: string[];
    exclude: string[];
    localGitignore: boolean;
    globalGitignore: boolean;
};
export const getPaths = (params: Params): IncludeExclude => {
    const parsedPaths = getParsedGitignores(params);
    const incExc = parsedPaths.reduce(
        (acc: IncludeExclude, line: string) => {
            if (startsWithBang(line)) {
                acc.include.push(removeStartBang(line));
            } else {
                acc.exclude.push(line);
            }
            return acc;
        },
        {
            include: [...params.include],
            exclude: [...params.exclude],
        },
    );

    return incExc;
};
