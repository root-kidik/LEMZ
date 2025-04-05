import { Icon, Layout, LayoutProps, signal, Txt } from "@motion-canvas/2d";
import { colorWhite, entryTextSize, fileTypeMap, fontFamilyDefault, fontWeightBold, gapNormal, iconSize, marginLeft, specialFiles } from "../theme/Theme";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";

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
            marginLeft: () => this.getDepth() == 0 ? 0 : (this.getDepth() - 1) * marginLeft,
            ...props,
        });

        if (this.name().length <= 0) return;

        const {icon, color} = this.getEntryIconAndColor();

        this.insert(
            <Layout layout gap={gapNormal} alignItems={"center"}>
                <Icon icon={icon} size={iconSize} color={color} />

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

    private getEntryIconAndColor(): { icon: string, color: string } {
        if (this.children().length > 0) {
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
}
