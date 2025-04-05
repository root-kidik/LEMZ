import { Code, Rect, RectProps } from "@motion-canvas/2d";
import { colorBlack, colorSemiBlack, fontFamilyDefault, fontWeightBold, gapNormal, paddingNormal } from "../theme/Theme";
import { File } from "./File";
import { Reference, SignalValue } from "@motion-canvas/core";

export interface VscodeProps extends RectProps {
    root: SignalValue<File>;
    filebar_ref: Reference<Rect>;
    code_ref: Reference<Code>;
}

export class Vscode extends Rect {
    public constructor(props?: VscodeProps) {
        super({
            layout: true,
            padding: paddingNormal,
            height: "100%",
            width: "100%",
            fill: colorBlack,
            ...props,
        });

        this.add(
            <>
                <Rect
                    layout
                    direction={"column"}
                    gap={gapNormal}
                    padding={paddingNormal}
                    fill={colorBlack}
                    ref={props.filebar_ref}
                    children={props.root}
                />

                <Rect
                    layout
                    width={"100%"}
                    height={"100%"}
                    fill={colorSemiBlack}
                    padding={paddingNormal}
                >
                    <Code
                        ref={props.code_ref}
                        fontFamily={fontFamilyDefault}
                        fontWeight={fontWeightBold}
                        fontSize={28}
                    />
                </Rect>
            </>
        );
    }
}
