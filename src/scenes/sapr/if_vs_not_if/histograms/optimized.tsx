import { makeScene2D } from "@motion-canvas/2d";
import { beginSlide, createRef, Direction, slideTransition } from "@motion-canvas/core";
import { HistogramaLayout } from "../../../../components/Layouts/HistogramaLayout";
import { Histograma } from "../../../../components/Histograma";

export default makeScene2D(function* (view) {
    const histograma = createRef<Histograma>();

    view.add(<HistogramaLayout histograma={histograma} upperBoundValue={100000} />);

    yield* slideTransition(Direction.Right);

    yield* histograma().show();

    yield* histograma().showHistograms([
        { name: "if", value: 94518 },
        { name: "not if", value: 50652 },
    ]);

    yield* beginSlide("Конец");
});
