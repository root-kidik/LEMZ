import { Icon, Layout, Rect, RectProps, signal } from "@motion-canvas/2d";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";
import { colorSemiSemiBlack, colorWhite, lineWidthNormal, paddingBig, radiusNormal } from "../theme/Theme";
import { MyTxt } from "./My/MyTxt";

export interface FileProps extends RectProps {
    name: SignalValue<string>;
}

export class Library extends Rect {
    @signal()
    public declare readonly name: SimpleSignal<string, this>;

    public constructor(props: FileProps) {
        super({
            direction: "column",
            layout: true,
            stroke: colorSemiSemiBlack,
            lineWidth: lineWidthNormal,
            padding: paddingBig,
            radius: radiusNormal,
            ...props,
        });

        this.add(
            <>
                <Layout>
                    <MyTxt text={this.name} />
                </Layout>

                <Layout direction={"column"}>
                    <MyTxt text={"include: []"} />
                    <MyTxt text={"library: []"} />
                </Layout>
            </>
        );
    }
}