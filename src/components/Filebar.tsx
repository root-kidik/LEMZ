import { Icon, Layout, Rect, RectProps, Txt } from "@motion-canvas/2d";
import { all } from "@motion-canvas/core";
import { colorBlack, colorWhite, entryTextSize, fileTypeMap, fontFamilyDefault, fontWeightBold, gapNormal, iconSize, marginLeft, paddingNormal, specialFiles } from "../theme/Theme";

export class FilebarEntry {
    public name: string;
    public childrens?: FilebarEntry[];
}

export interface FilebarProps extends RectProps {
    entries: FilebarEntry[];
}

export class Filebar extends Rect {
    private readonly entries: FilebarEntry[];
    private entryToComponents: Map<string, [Txt, Icon]> = new Map();
    private childrenLayouts: Map<string, Layout> = new Map();

    public constructor(props: FilebarProps) {
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
                {this.renderEntries(this.entries, 0, '')}
            </>
        );
    }

    private renderEntries(entries: FilebarEntry[], depth: number, currentPath: string) {
        return entries.map(entry => this.renderEntry(entry, depth, currentPath));
    }

    private renderEntry(entry: FilebarEntry, depth: number, currentPath: string) {
        const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

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
                            this.entryToComponents.set(entryPath, [txt, icon]);
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
                        ref={layout => this.childrenLayouts.set(entryPath, layout)}
                        direction="column"
                        clip
                    >
                        {this.renderEntries(entry.childrens, depth + 1, entryPath)}
                    </Layout>
                )}
            </Layout>
        );
    }

    private getEntryIconAndColor(entry: FilebarEntry): { icon: string, color: string } {
        if (entry.childrens) {
            return entry.name === '.git'
                ? fileTypeMap['.git']
                : fileTypeMap['folder'];
        }

        const fileName = entry.name.toLowerCase();
        if (fileName in specialFiles) {
            return specialFiles[fileName];
        }

        if (fileName.startsWith('.')) {
            const cleanName = fileName.slice(1);
            if (cleanName in specialFiles) {
                return specialFiles[cleanName];
            }
        }

        const fileExt = fileName.split('.').pop() || '';
        return fileTypeMap[fileExt] || fileTypeMap['default'];
    }

    private getFileIcon(entry: FilebarEntry) {
        const { icon, color } = this.getEntryIconAndColor(entry);
        return <Icon icon={icon} size={iconSize} color={color} />;
    }

    public *highlightEntry(path: string, duration: number = 0.5) {
        const targetComponents = this.entryToComponents.get(path);
        const allComponents = Array.from(this.entryToComponents.values());
        yield* all(
            ...allComponents.map(([txt, icon]) =>
                all(txt.opacity(0.5, duration), icon.opacity(0.5, duration))
            ),
            ...[targetComponents].map(([txt, icon]) =>
                all(txt.opacity(1, duration), icon.opacity(1, duration))
            )
        );
    }

    public *resetHighlight(duration: number = 0.5) {
        const allComponents = Array.from(this.entryToComponents.values());
        yield* all(
            ...allComponents.map(([txt, icon]) =>
                all(txt.opacity(1, duration), icon.opacity(1, duration))
            )
        );
    }

    public *openFolder(path: string, duration: number = 0.5) {
        const layout = this.childrenLayouts.get(path);

        layout.height(null);
        const targetHeight = layout.size().y;
        layout.height(0);

        yield* layout.height(targetHeight, duration);
        layout.height(null);
    }

    public *closeFolder(path: string, duration: number = 0.5) {
        const layout = this.childrenLayouts.get(path);

        yield* layout.height(0, duration);
    }
}
