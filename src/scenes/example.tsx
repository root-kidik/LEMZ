import { Code, makeScene2D, Rect } from '@motion-canvas/2d';
import { File } from '../components/File';
import { Vscode } from '../components/Vscode';
import { createRef, createSignal, SimpleSignal, waitFor } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
    const root_name = createSignal("");
    const src_name = createSignal("src");
    const math_name = createSignal("Math.hpp");

    const root = createSignal(
        <File name={root_name}>
            <File name={src_name}>
                <File name={math_name} depth={1} />
            </File>
        </File> as File
    );

    const filebar = createRef<Rect>();
    const code = createRef<Code>();

    view.add(
        <Vscode code_ref={code} filebar_ref={filebar} root={root} />
    );

    yield* waitFor(1);

    root().children([...root().children(), <File name={"include"} />]);

    yield* waitFor(1);
});
