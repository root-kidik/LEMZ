import { Code, makeScene2D, Rect } from '@motion-canvas/2d';
import { Vscode } from '../components/Vscode';
import { createRef, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { createFile } from '../components/Utils';

export default makeScene2D(function* (view) {
    const math_cpp = createFile("Math.cpp");
    const root_cmake = createFile("CMakeLists.txt");

    const root = createFile("");

    root().add(math_cpp());
    root().add(root_cmake());

    const filebar = createRef<Rect>();
    const code_layout_ref = createRef<Rect>();
    const code = createRef<Code>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} filebar={filebar} root={root} code_layout={code_layout_ref} />
    );

    yield* slideTransition(Direction.Right);

    yield* waitFor(1);
});
