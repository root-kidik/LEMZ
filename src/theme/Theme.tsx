export const colorBlack = "rgb(10, 10, 10)";
export const colorSemiBlack = "rgb(20, 20, 20)";
export const colorSemiSemiBlack = "rgb(30, 30, 30)";

export const colorWhite = "rgb(220, 220, 220)";
export const colorBlue = "rgb(0, 20, 200)";

export const paddingBig = 40;

export const gapNormal = 5;
export const gapMedium = 10;
export const gapBig = paddingBig;

export const radiusNormal = 20;

export const lineWidthNormal = 20;

export const marginLeft = 10;

export const fontWeightBold = 800;
export const fontSizeNormal = 28;

export const fontFamilyDefault = "Jetbrains Mono";

export const iconSize = 48;
export const entryTextSize = 24;

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

export const animationTime = 0.5;

export const opacitySemi = 0.5;