import { Rect, RectProps } from "@motion-canvas/2d";
import { colorSemiBlack, colorSemiSemiBlack, gapBig, lineWidthNormal, paddingBig, radiusNormal } from "../../theme/Theme";

export class MyRect extends Rect {
    public constructor(props: RectProps) {
        super({
            layout: true,
            direction: "column",
            gap: gapBig,
            stroke: colorSemiSemiBlack,
            lineWidth: lineWidthNormal,
            fill: colorSemiBlack,
            radius: radiusNormal,
            padding: paddingBig,
            ...props,
        });
    }
}
