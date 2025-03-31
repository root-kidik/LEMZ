import { Icon, Layout, Rect, RectProps, Txt } from "@motion-canvas/2d";
import { all } from "@motion-canvas/core";
import { colorBlack, colorMap, colorWhite, entryTextSize, fontFamilyDefault, fontWeightBold, gapNormal, iconMap, iconSize, marginLeft, paddingNormal, specialFiles } from "../theme/Theme";

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

    public constructor(props?: FilebarProps) {
        super({
            direction: "column",
            layout: true,
            gap: gapNormal,
            padding: paddingNormal,
            fill: colorBlack,
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
                    icon={isGitFolder ? iconMap.git : iconMap.folder}
                    size={iconSize}
                    color={isGitFolder ? colorMap.git : colorMap.folder}
                />
            );
        }

        const fileName = entry.name.toLowerCase();
        const fileExt = fileName.split('.').pop() || '';

        if (fileName in specialFiles) {
            const { icon, color } = specialFiles[fileName];
            return <Icon icon={icon} size={iconSize} color={color} />;
        }

        if (fileName.startsWith('.')) {
            const cleanName = fileName.slice(1);
            if (cleanName in specialFiles) {
                const { icon, color } = specialFiles[cleanName];
                return <Icon icon={icon} size={iconSize} color={color} />;
            }
        }

        let color = colorMap.default;
        if (['cpp', 'h', 'hpp'].includes(fileExt)) {
            color = colorMap.cpp;
        } else if (['md', 'txt'].includes(fileExt)) {
            color = colorMap.text;
        } else if (['json', 'yml', 'yaml'].includes(fileExt)) {
            color = colorMap.code;
        }

        return (
            <Icon
                icon={iconMap[fileExt] || iconMap.default}
                size={iconSize}
                color={color}
            />
        );
    }

    private renderEntry(entry: FilebarEntry, depth: number = 0) {
        return (
            <Layout direction="column" marginLeft={depth * marginLeft}>
                <Layout
                    direction="row"
                    alignItems="center"
                    gap={gapNormal}
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
                        fontFamily={fontFamilyDefault}
                        fontWeight={fontWeightBold}
                        fontSize={entryTextSize}
                        fill={colorWhite}
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
