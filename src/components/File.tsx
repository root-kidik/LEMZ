import { Icon, Layout, LayoutProps, signal, Txt } from "@motion-canvas/2d";
import { DEFAULT, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { animationTime, colorWhite, entryTextSize, fileTypeMap, fontFamilyDefault, fontWeightBold, gapNormal, iconSize, marginLeft, specialFiles } from "../theme/Theme";

export interface FileProps extends LayoutProps {
    name: SignalValue<string>;
}

export class File extends Layout {
    @signal()
    public declare readonly name: SimpleSignal<string, this>;

    public constructor(props: FileProps) {
        super({
            direction: "column",
            layout: true,
            clip: true,
            marginLeft: () => this.getDepth() == 0 ? 0 : (this.getDepth() - 1) * marginLeft,
            ...props,
        });

        if (this.name().length <= 0) return;

        this.insert(
            <Layout layout gap={gapNormal} alignItems={"center"}>
                <Icon icon={() => this.getEntryIconAndColor().icon} size={iconSize} color={() => this.getEntryIconAndColor().color} />
                <Txt
                    fontFamily={fontFamilyDefault}
                    fontWeight={fontWeightBold}
                    fontSize={entryTextSize}
                    fill={colorWhite}
                    opacity={1}
                    text={this.name}
                />
            </Layout>
        );
    }

    public addFile(file: SimpleSignal<File>) {
        this.children([...this.children(), file()]);
    }

    public *openFolder(duration: number = animationTime) {
        yield* this.height(DEFAULT, duration);
    }

    public *closeFolder(duration: number = animationTime) {
        const layout = this.children()[0] as Layout;
        yield* this.height(layout.height(), duration);
    }

    private getEntryIconAndColor(): { icon: string, color: string } {
        if (this.isFolder()) {
            return this.name() === '.git'
                ? fileTypeMap['.git']
                : fileTypeMap['folder'];
        }
        const fileName = this.name().toLowerCase();
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

    private getDepth(): number {
        let depth = 0;
        let current = this.parent();
        while (current instanceof File) {
            depth++;
            current = current.parent();
        }
        return depth;
    }

    private isFolder(): boolean {
        return this.children().length > 1;
    }
}