import { makeScene2D } from "@motion-canvas/2d";
import { beginSlide, createRef, Direction, slideTransition } from "@motion-canvas/core";
import { HistogramaLayout } from "../../../../components/Layouts/HistogramaLayout";
import { Histograma } from "../../../../components/Histograma";

export default makeScene2D(function* (view) {
    const histograma = createRef<Histograma>();

    view.add(<HistogramaLayout histograma={histograma} upperBoundValue={1000000000} />);

    yield* slideTransition(Direction.Right);

    yield* histograma().show();

    yield* histograma().showHistograms([
        { name: "if", value: 526673315 },
        { name: "not if", value: 526571583 },
    ]);

    yield* beginSlide("Конец");
});
