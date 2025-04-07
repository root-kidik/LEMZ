import { Grid, GridProps } from "@motion-canvas/2d";
import { animationTime, colorGrey, lineWidthGrid, paddingBig } from "../../theme/Theme";
import { all } from "@motion-canvas/core";

export class MyGrid extends Grid {
    public constructor(props: GridProps) {
        super({
            width: "100%",
            height: "100%",
            stroke: colorGrey,
            start: 0,
            end: 0,
            justifyContent: "space-evenly",
            alignItems: "end",
            spacing: 100,
            lineWidth: lineWidthGrid,
            padding: 10,
            ...props,
        });
    }

    public *show(duration: number = animationTime) {
        yield* all(
            this.end(0.5, duration).to(1, duration),
            this.start(0.5, duration).to(0, duration),
        );
    }
}
