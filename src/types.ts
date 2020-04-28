export type OptionalPresetFields = {
    initSync: boolean;
    watch: boolean;
    include: string[];
    exclude: string[];
    globalGitignore: boolean;
    localGitignore: boolean;
    parseOutput: boolean;
    showRsyncCommand: boolean;
};

export type RequiredPresetFields = {
    src: string;
    dest: string;
};

export type Preset = {
    server?: string;
} & Partial<OptionalPresetFields> &
    RequiredPresetFields;

export type ValidatedPreset = RequiredPresetFields &
    OptionalPresetFields & {name: string};

export type SyndConfig = Record<string, Preset>;
