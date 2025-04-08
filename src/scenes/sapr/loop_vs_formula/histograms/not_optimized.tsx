import { makeScene2D } from "@motion-canvas/2d";
import { beginSlide, createRef, Direction, slideTransition } from "@motion-canvas/core";
import { HistogramaLayout } from "../../../../components/Layouts/HistogramaLayout";
import { Histograma } from "../../../../components/Histograma";

export default makeScene2D(function* (view) {
    const histograma = createRef<Histograma>();

    view.add(<HistogramaLayout histograma={histograma} upperBoundValue={4000000} />);

    yield* slideTransition(Direction.Right);

    yield* histograma().show();

    yield* histograma().showHistograms([
        { name: "loop", value: 2129348 },
        { name: "formula", value: 20 },
    ]);

    yield* beginSlide("Конец");
});
