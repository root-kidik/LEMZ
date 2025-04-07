import { Code, Rect, RectProps } from "@motion-canvas/2d";
import { colorBlack, fontFamilyDefault, fontSizeNormal, fontWeightBold } from "../theme/Theme";
import { File } from "./File";
import { createRef, Reference, SignalValue } from "@motion-canvas/core";
import { MyRect } from "./My/MyRect";
import { MyCode } from "./My/MyCode";

export interface VscodeProps extends RectProps {
    root?: SignalValue<File>;
    filebar?: Reference<Rect>;
    code_layout?: Reference<Rect>;
    code: Reference<Code>;
    disable_filebar?: boolean;
}

export class Vscode extends MyRect {
    public constructor(props?: VscodeProps) {
        super({
            layout: true,
            height: "100%",
            width: "100%",
            fill: colorBlack,
            lineWidth: 0,
            direction: "row",
            ...props,
        });

        if (!props.disable_filebar)
            props.disable_filebar = false;

        this.add(
            <>
                { !props.disable_filebar && <MyRect ref={props.filebar} children={props.root}/> }

                <MyRect ref={props.code_layout} width={"100%"} >
                    <MyCode ref={props.code} />
                </MyRect>
            </>
        );
    }

    public addAnimationLayout(): Reference<Rect> {
        const animation_layout = createRef<Rect>(); 
        
        this.add(<MyRect ref={animation_layout} />);

        return animation_layout;
    }
}
