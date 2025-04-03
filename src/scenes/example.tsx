import { Code, makeScene2D, Rect } from '@motion-canvas/2d';
import { FilebarEntry } from '../components/FilebarEntry';
import { Vscode } from '../components/Vscode';
import { createRef, createSignal, waitFor } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
    const entries = createSignal([
        new FilebarEntry(
            {
                name: "src",
                childrens: [
                    new FilebarEntry(
                        {
                            name: "math",
                            childrens: [
                                new FilebarEntry(
                                    {
                                        name: "Math.hpp"
                                    }
                                )
                            ]
                        }
                    )
                ]
            }
        )
    ])

    const filebar = createRef<Rect>();
    const code = createRef<Code>();

    view.add(
        <Vscode code_ref={code} filebar_ref={filebar} entries={entries} />
    );

    yield* waitFor(1);

    entries([...entries(), new FilebarEntry({name: "include"})]);

    yield* waitFor(1);
});
