import { Code, Layout, Rect, RectProps } from "@motion-canvas/2d";
import { paddingNormal } from "../theme/Theme";
import { FilebarProps, Filebar } from "./Filebar";
import { Reference } from "@motion-canvas/core";
import { MyCode } from "./MyCode";

export interface VscodeProps extends RectProps {
    filebar_props: FilebarProps;
    filebar_ref: Reference<Filebar>;

    code_ref: Reference<MyCode>;
}

export class Vscode extends Rect {
    public constructor(props?: VscodeProps) {
        super({
            layout: true,
            padding: paddingNormal,
            height: "100%",
            width: "100%",
            fill: "rgb(10, 10, 10)",
            ...props,
        });

        this.add(
            <>
                <Filebar ref={props.filebar_ref} entries={props.filebar_props.entries} />

                <Rect layout width={"100%"} height={"100%"} fill={"rgb(20, 20, 20)"} padding={paddingNormal}>
                    <Code ref={props.code_ref} fontFamily={"Jetbrains Mono"} fontWeight={800} fontSize={28} />
                </Rect>
            </>
        );
    }
}
