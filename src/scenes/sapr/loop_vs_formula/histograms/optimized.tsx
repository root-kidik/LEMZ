import { makeScene2D } from "@motion-canvas/2d";
import { createRef, Direction, slideTransition, waitFor } from "@motion-canvas/core";
import { HistogramaLayout } from "../../../../components/Layouts/HistogramaLayout";
import { Histograma } from "../../../../components/Histograma";

export default makeScene2D(function* (view) {
    const histograma = createRef<Histograma>();

    view.add(<HistogramaLayout histograma={histograma} upperBoundValue={40} />);

    yield* slideTransition(Direction.Right);

    yield* histograma().show();

    yield* waitFor(1);

    yield* histograma().showHistograms([
        { name: "loop", value: 20 },
        { name: "formula", value: 20 },
    ]);

    yield* waitFor(1);
});
