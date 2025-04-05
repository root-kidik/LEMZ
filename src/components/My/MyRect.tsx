import { Rect, RectProps } from "@motion-canvas/2d";
import { colorSemiBlack, gapBig, paddingBig, radiusNormal } from "../../theme/Theme";

export class MyRect extends Rect {
    public constructor(props: RectProps) {
        super({
            layout: true,
            direction: "column",
            gap: gapBig,
            fill: colorSemiBlack,
            radius: radiusNormal,
            padding: paddingBig,
            ...props,
        });
    }
}
