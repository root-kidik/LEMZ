import { Icon, Layout, Rect, RectProps, Txt } from "@motion-canvas/2d";
import { all } from "@motion-canvas/core";
import { paddingNormal } from "./Theme";

export class FilebarEntry {
    public name: string;
    public childrens?: FilebarEntry[];
}

export interface FilebarProps extends RectProps {
    entries: FilebarEntry[];
}

export class Filebar extends Rect {
    private readonly entries: FilebarEntry[]; 

    private entryToComponents: Map<FilebarEntry, [Txt, Icon]> = new Map();
    private childrenLayouts: Map<FilebarEntry, Layout> = new Map();

    private readonly iconSize = 24;
    private readonly entryTextSize = 14;

    private readonly colorMap: { [key: string]: string } = {
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

    private readonly iconMap: { [key: string]: string } = {
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

    private readonly specialFiles: { [key: string]: { icon: string; color: string } } = {
        'gitignore': { icon: 'mdi-git', color: this.colorMap.git },
        'clang-format': { icon: 'mdi-cog', color: this.colorMap.config },
        'clang-tidy': { icon: 'mdi-tune-variant', color: this.colorMap.config },
        'cmakelists.txt': { icon: 'mdi-cube', color: this.colorMap.cmake },
        'readme.md': { icon: 'mdi-markdown', color: this.colorMap.text },
    };

    public constructor(props?: FilebarProps) {
        super({
            direction: "column",
            layout: true,
            gap: 5,
            padding: paddingNormal,
            fill: "rgb(10, 10, 10)",
            ...props,
        });

        this.entries = props.entries;

        this.add(
            <>
                {props.entries.map(entry => this.renderEntry(entry))}
            </>
        );
    }

    private findEntryByPath(entries: FilebarEntry[], currentPath: string, targetPath: string): FilebarEntry | null {
        for (const entry of entries) {
            const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
            if (entryPath === targetPath) {
                return entry;
            }
            if (entry.childrens) {
                const found = this.findEntryByPath(entry.childrens, entryPath, targetPath);
                if (found) return found;
            }
        }
        return null;
    }

    public *highlightEntryByPath(path: string, duration: number = 0.5) {
        const entry = this.findEntryByPath(this.entries, '', path);
        if (entry) {
            const targetComponents = this.entryToComponents.get(entry);
            const allComponents = Array.from(this.entryToComponents.values());

            if (targetComponents) {
                yield* all(
                    ...allComponents.map(([txt, icon]) =>
                        all(txt.opacity(0.5, duration), icon.opacity(0.5, duration))
                    ),
                    ...[targetComponents].map(([txt, icon]) =>
                        all(txt.opacity(1, duration), icon.opacity(1, duration))
                    )
                );
            }
        }
    }

    public *resetHighlight(duration: number = 0.5) {
        const allComponents = Array.from(this.entryToComponents.values());
        yield* all(
            ...allComponents.map(([txt, icon]) =>
                all(txt.opacity(1, duration), icon.opacity(1, duration))
            )
        );
    }

    public *setFolderOpenByPath(path: string, open: boolean, duration: number = 0.5) {
        const entry = this.findEntryByPath(this.entries, '', path);
        if (entry && entry.childrens) {
            const layout = this.childrenLayouts.get(entry);
            if (layout) {
                if (open) {
                    if (layout.height() === 0) {
                        layout.height(null);
                        const targetHeight = layout.size().y;
                        layout.height(0);
                        yield* layout.height(targetHeight, duration);
                        layout.height(null);
                    }
                } else {
                    if (layout.height() !== 0) {
                        yield* layout.height(0, duration);
                    }
                }
            }
        }
    }

    private getFileIcon(entry: FilebarEntry) {
        if (entry.childrens?.length > 0) {
            const isGitFolder = entry.name === '.git';
            return (
                <Icon
                    icon={isGitFolder ? this.iconMap.git : this.iconMap.folder}
                    size={this.iconSize}
                    color={isGitFolder ? this.colorMap.git : this.colorMap.folder}
                />
            );
        }

        const fileName = entry.name.toLowerCase();
        const fileExt = fileName.split('.').pop() || '';

        if (fileName in this.specialFiles) {
            const { icon, color } = this.specialFiles[fileName];
            return <Icon icon={icon} size={this.iconSize} color={color} />;
        }

        if (fileName.startsWith('.')) {
            const cleanName = fileName.slice(1);
            if (cleanName in this.specialFiles) {
                const { icon, color } = this.specialFiles[cleanName];
                return <Icon icon={icon} size={this.iconSize} color={color} />;
            }
        }

        let color = this.colorMap.default;
        if (['cpp', 'h', 'hpp'].includes(fileExt)) {
            color = this.colorMap.cpp;
        } else if (['md', 'txt'].includes(fileExt)) {
            color = this.colorMap.text;
        } else if (['json', 'yml', 'yaml'].includes(fileExt)) {
            color = this.colorMap.code;
        }

        return (
            <Icon
                icon={this.iconMap[fileExt] || this.iconMap.default}
                size={this.iconSize}
                color={color}
            />
        );
    }

    private renderEntry(entry: FilebarEntry, depth: number = 0) {
        return (
            <Layout direction="column" marginLeft={depth * 10}>
                <Layout
                    direction="row"
                    alignItems="center"
                    gap={5}
                    ref={layout => {
                        if (layout) {
                            const txt = layout.children().find(c => c instanceof Txt) as Txt;
                            const icon = layout.children().find(c => c instanceof Icon) as Icon;
                            this.entryToComponents.set(entry, [txt, icon]);
                        }
                    }}
                >
                    {this.getFileIcon(entry)}
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        fontWeight={800}
                        fontSize={this.entryTextSize}
                        fill={"rgb(220, 220, 220)"}
                        opacity={1}
                        text={entry.name}
                    />
                </Layout>
                {entry.childrens && (
                    <Layout
                        ref={layout => this.childrenLayouts.set(entry, layout)}
                        direction="column"
                        clip
                    >
                        {entry.childrens.map(child => this.renderEntry(child, depth + 1))}
                    </Layout>
                )}
            </Layout>
        );
    }
}
