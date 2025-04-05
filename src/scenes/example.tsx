import { Code, makeScene2D, Rect } from '@motion-canvas/2d';
import { Vscode } from '../components/Vscode';
import { createRef, waitFor } from '@motion-canvas/core';
import { createFile } from '../components/Utils';
import { animationTime } from '../theme/Theme';

export default makeScene2D(function* (view) {
    const math_cpp = createFile("Math.cpp");
    const root_cmake = createFile("CMakeLists.txt");

    const root = createFile("");

    root().addFile(math_cpp);
    root().addFile(root_cmake);

    const filebar = createRef<Rect>();
    const code = createRef<Code>();

    view.add(
        <Vscode code_ref={code} filebar_ref={filebar} root={root} />
    );

    yield* waitFor(1);

    yield* root_cmake().opacity(0.5, animationTime);

    yield* waitFor(1);
});
