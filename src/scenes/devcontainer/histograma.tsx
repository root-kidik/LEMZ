import { makeScene2D } from "@motion-canvas/2d";
import { beginSlide, createRef, Direction, slideTransition } from "@motion-canvas/core";
import { HistogramaLayout } from "../../components/Layouts/HistogramaLayout";
import { Histograma } from "../../components/Histograma";

export default makeScene2D(function* (view) {
    const histograma = createRef<Histograma>();

    view.add(<HistogramaLayout histograma={histograma} upperBoundValue={10} />);

    yield* slideTransition(Direction.Right);

    yield* histograma().show();

    yield* histograma().showHistograms([
        { name: "no ide", value: 3.4 },
        { name: "vscode", value: 4.1 },
        { name: "devcontainer", value: 4.4 },
    ]);

    yield* beginSlide("Конец");
});
