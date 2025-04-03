import { Layout, LayoutProps, makeScene2D, signal, Txt, TxtProps } from "@motion-canvas/2d";
import { createRef, createSignal, SignalValue, SimpleSignal, waitFor } from "@motion-canvas/core";

export interface MassiveItemProps extends TxtProps {
}

class MassiveItem extends Txt {
    constructor(props: MassiveItemProps) {
        super({
            layout: true,
            ...props,
        });
    }
}

export interface MassiveProps extends LayoutProps {
}

class Massive extends Layout {
    public constructor(props: MassiveProps) {
        super({
            layout: true,
            ...props,
        });
    }
}

export default makeScene2D(function* (view) {
    const items = createSignal([
        new MassiveItem({text: "1"}),
        new MassiveItem({text: "2"}),
        new MassiveItem({text: "3"}),
    ]);

    const mas = createRef<Massive>();

    view.add(
        <Massive ref={mas} children={items} />
    );

    yield* waitFor(1);
    
    items([...items(),
        new MassiveItem({text: "4"}),
        new MassiveItem({text: "5"}),
    ]);

    yield* waitFor(1);
});
