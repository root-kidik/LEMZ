import { Code, Rect, RectProps } from "@motion-canvas/2d";
import { colorBlack, colorSemiBlack, fontFamilyDefault, fontSizeNormal, fontWeightBold, gapBig, gapNormal, paddingBig, radiusNormal } from "../theme/Theme";
import { File } from "./File";
import { createRef, Reference, SignalValue } from "@motion-canvas/core";

export interface VscodeProps extends RectProps {
    root: SignalValue<File>;
    filebar: Reference<Rect>;
    code_layout: Reference<Rect>;
    code: Reference<Code>;
}

export class Vscode extends Rect {
    public constructor(props?: VscodeProps) {
        super({
            layout: true,
            padding: paddingBig,
            gap: gapBig,
            height: "100%",
            width: "100%",
            fill: colorBlack,
            ...props,
        });

        this.add(
            <>
                <Rect
                    layout
                    padding={paddingBig}
                    direction={"column"}
                    gap={gapNormal}
                    fill={colorSemiBlack}
                    radius={radiusNormal}
                    ref={props.filebar}
                    children={props.root}
                />

                <Rect
                    layout
                    ref={props.code_layout}
                    fill={colorSemiBlack}
                    radius={radiusNormal}
                    width={"100%"}
                >
                    <Code
                        ref={props.code}
                        fontFamily={fontFamilyDefault}
                        fontWeight={fontWeightBold}
                        fontSize={fontSizeNormal}
                    />
                </Rect>
            </>
        );
    }

    public addAnimationLayout(): Reference<Rect> {
        const animation_layout = createRef<Rect>(); 
        
        this.add(
            <Rect
                layout
                ref={animation_layout}
                direction={"column"}
                gap={gapNormal}
                fill={colorSemiBlack}
                radius={radiusNormal}
            />
        );

        return animation_layout;
    }
}
