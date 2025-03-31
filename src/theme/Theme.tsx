export const colorBlack = "rgb(10, 10, 10)";
export const colorWhite = "rgb(220, 220, 220)";

export const paddingNormal = 20;

export const gapNormal = 5;

export const marginLeft = 10;

export const fontWeightBold = 800;

export const fontFamilyDefault = "Jetbrains Mono";

export const iconSize = 24;
export const entryTextSize = 14;

export const colorMap: { [key: string]: string } = {
    folder: '#98BC34',
    default: '#B0BEC5',
    git: '#F06292',
    cpp: '#4FC3F7',
    hpp: '#4FC3F7',
    cmake: '#64B5F6',
    config: '#26A69A',
    text: '#E0E0E0',
    code: '#FFB74D',
};

export const iconMap: { [key: string]: string } = {
    folder: 'mdi-folder',
    default: 'mdi-file-outline',
    ts: 'mdi-language-typescript',
    js: 'mdi-nodejs',
    json: 'mdi-code-json',
    md: 'mdi-markdown',
    cpp: 'mdi-language-cpp',
    hpp: 'mdi-language-cpp',
    cmake: 'mdi-cube',
    git: 'mdi-git',
};

export const specialFiles: { [key: string]: { icon: string; color: string } } = {
    'gitignore': { icon: 'mdi-git', color: colorMap.git },
    'clang-format': { icon: 'mdi-cog', color: colorMap.config },
    'clang-tidy': { icon: 'mdi-tune-variant', color: colorMap.config },
    'cmakelists.txt': { icon: 'mdi-cube', color: colorMap.cmake },
    'readme.md': { icon: 'mdi-markdown', color: colorMap.text },
};
