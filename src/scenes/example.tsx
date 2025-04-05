import { Code, makeScene2D, Rect } from '@motion-canvas/2d';
import { File } from '../components/File';
import { Vscode } from '../components/Vscode';
import { createRef, createSignal, waitFor } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
    const math_cpp = createSignal(
        <File name={"Math.cpp"} /> as File
    );

    const src_cmake = createSignal(
        <File name={"CMakeLists.txt"} /> as File
    );

    const src = createSignal(
        <File name={"src"} /> as File
    );

    src().children([...src().children(), math_cpp(), src_cmake()]);

    const root = createSignal(
        <File name={""} /> as File
    );

    root().children([...root().children(), src()]);

    const filebar = createRef<Rect>();
    const code = createRef<Code>();

    view.add(
        <Vscode code_ref={code} filebar_ref={filebar} root={root} />
    );

    yield* waitFor(1);

    root().children([...root().children(), <File name={"include"} />]);

    yield* waitFor(1);

    yield* src().closeFolder();

    yield* waitFor(1);

    yield* src().openFolder();

    yield* waitFor(1);

});
