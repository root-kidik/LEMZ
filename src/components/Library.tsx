import { Layout, RectProps, signal } from "@motion-canvas/2d";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";
import { colorSemiSemiBlack, gapNormal, lineWidthNormal } from "../theme/Theme";
import { MyTxt } from "./My/MyTxt";
import { MyRect } from "./My/MyRect";

export interface LibraryProps extends RectProps {
    name: SignalValue<string>;
}

export class Library extends MyRect {
    @signal()
    public declare readonly name: SimpleSignal<string, this>;

    public constructor(props: LibraryProps) {
        super({
            direction: "column",
            stroke: colorSemiSemiBlack,
            lineWidth: lineWidthNormal,
            gap: gapNormal,
            ...props,
        });

        this.add(
            <>
                <Layout layout>
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