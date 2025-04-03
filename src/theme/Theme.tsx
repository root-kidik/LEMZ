export const colorBlack = "rgb(10, 10, 10)";
export const colorSemiBlack = "rgb(20, 20, 20)";

export const colorWhite = "rgb(220, 220, 220)";

export const paddingNormal = 20;

export const gapNormal = 5;

export const marginLeft = 10;

export const fontWeightBold = 800;

export const fontFamilyDefault = "Jetbrains Mono";

export const iconSize = 24;
export const entryTextSize = 14;

export const fileTypeMap: { [key: string]: { icon: string; color: string } } = {
    '.git': { icon: 'mdi-git', color: '#F06292' },
    'folder': { icon: 'mdi-folder', color: '#98BC34' },
    'default': { icon: 'mdi-file-outline', color: '#B0BEC5' },
    'cpp': { icon: 'mdi-language-cpp', color: '#4FC3F7' },
    'hpp': { icon: 'mdi-language-cpp', color: '#4FC3F7' },
    'md': { icon: 'mdi-markdown', color: '#E0E0E0' },
    'json': { icon: 'mdi-code-json', color: '#FFB74D' },
};

export const specialFiles: { [key: string]: { icon: string; color: string } } = {
    'gitignore': { icon: 'mdi-git', color: '#F06292' },
    'clang-format': { icon: 'mdi-cog', color: '#26A69A' },
    'clang-tidy': { icon: 'mdi-tune-variant', color: '#26A69A' },
    'cmakelists.txt': { icon: 'mdi-cube', color: '#64B5F6' },
};
