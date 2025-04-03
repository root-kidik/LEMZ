import { Icon, initial, Layout, LayoutProps, signal, Txt } from "@motion-canvas/2d";
import { colorWhite, entryTextSize, fileTypeMap, fontFamilyDefault, fontWeightBold, gapNormal, iconSize, marginLeft, specialFiles } from "../theme/Theme";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";

export interface FileProps extends LayoutProps {
    name: SignalValue<string>;
    depth?: number;
}

export class File extends Layout {
    @signal()
    public declare readonly name: SimpleSignal<string, this>;

    public constructor(props: FileProps) {
        if (!props.depth) {
            props.depth = 0;
        }

        super({
            direction: "column",
            layout: true,
            marginLeft: props.depth * marginLeft,
            ...props,
        });

        if (this.name().length <= 0) return;

        this.insert(
            <Layout layout gap={gapNormal} alignItems={"center"}>
                {this.getFileIcon()}

                <Txt
                    fontFamily={fontFamilyDefault}
                    fontWeight={fontWeightBold}
                    fontSize={entryTextSize}
                    fill={colorWhite}
                    opacity={1}
                    text={this.name()}
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

    private getFileIcon() {
        const { icon, color } = this.getEntryIconAndColor();
        return <Icon icon={icon} size={iconSize} color={color} />;
    }
}
