import { makeScene2D } from "@motion-canvas/2d";
import { beginSlide, createRef, Direction, slideTransition } from "@motion-canvas/core";
import { HistogramaLayout } from "../../components/Layouts/HistogramaLayout";
import { Histograma } from "../../components/Histograma";

export default makeScene2D(function* (view) {
    const histograma = createRef<Histograma>();

    view.add(<HistogramaLayout histograma={histograma} upperBoundValue={2000} />);

    yield* slideTransition(Direction.Right);

    yield* histograma().show();

    yield* histograma().showHistograms([
        { name: "stack", value: 1864 },
        { name: "FastPimpl", value: 1874 },
        { name: "Pimpl", value: 1893 },
        { name: "shared", value: 1904 },
    ]);

    yield* beginSlide("Конец");
});
