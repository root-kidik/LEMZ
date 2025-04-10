import { Layout, RectProps, signal } from "@motion-canvas/2d";
import { all, createRef, Reference, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { MyTxt } from "./My/MyTxt";
import { MyRect } from "./My/MyRect";
import { animationTime, colorWhiteBlue, fontSizeNormal } from "../theme/Theme";

export interface LibraryProps extends RectProps {
    name: SignalValue<string>;
}

export class Library extends MyRect {
    @signal()
    public declare readonly name: SimpleSignal<string, this>;

    private lib_name: Reference<MyTxt>;
    private includes: Reference<MyTxt>;
    private libraries: Reference<MyTxt>;

    public constructor(props: LibraryProps) {
        super({
            is_hidden: true,
            stroke: colorWhiteBlue,
            ...props,
        });

        this.lib_name = createRef<MyTxt>();
        this.includes = createRef<MyTxt>();
        this.libraries = createRef<MyTxt>();

        this.add(
            <>
                <Layout alignItems={"center"} justifyContent={"center"} layout>
                    <MyTxt fontSize={fontSizeNormal + 4} ref={this.lib_name} />
                </Layout>

                <Layout direction={"column"}>
                    <MyTxt ref={this.includes} />
                    <MyTxt ref={this.libraries} />
                </Layout>
            </>
        );
    }

    public *appear(duration: number = animationTime) {
        yield* all(
            super.appear(duration),
            this.lib_name().text(this.name, duration),
            this.includes().text("includes:   []", duration),
            this.libraries().text("libraries: []", duration),
        );
    }
}