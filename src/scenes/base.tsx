import { CODE, Code, lines, makeScene2D, Rect, word } from '@motion-canvas/2d';
import { Vscode } from '../components/Vscode';
import { all, createRef, createSignal, DEFAULT, waitFor } from '@motion-canvas/core';
import { createFile } from '../components/Utils';
import { animationTime, opacitySemi, paddingBig } from '../theme/Theme';
import { Library } from '../components/Library';

const rootCmake = CODE`\
cmake_minimum_required(VERSION 3.25)

project(Math)

add_library(\${PROJECT_NAME} Math.cpp)`;

const mathCppCode = CODE`\
int sum(int a, int b)
{
    return a + b;
}`;

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

    yield* waitFor(1);

    yield* math_cpp().opacity(opacitySemi, animationTime);

    yield* all(
        code_layout_ref().padding(paddingBig, animationTime),
        code().code(rootCmake, animationTime)
    );

    yield* code().selection(lines(0), animationTime);
    yield* code().selection(lines(2), animationTime);
    yield* code().selection(lines(4), animationTime);

    code().save();
    yield* code().code.replace(word(4, 12, 15), "Math", animationTime);

    yield* waitFor(1);

    yield* code().restore(animationTime);

    yield* code().selection(DEFAULT, animationTime);

    yield* waitFor(1);

    const animation_layout = vscode().addAnimationLayout();

    const library = createSignal(<Library name={"Math"} /> as Library);
    yield* library().width(0, 0);

    animation_layout().add(library());
    yield* all(
        animation_layout().padding(paddingBig, animationTime),
        library().width(DEFAULT, animationTime)
    );

    yield* waitFor(1);

    yield* all(
        math_cpp().opacity(1, animationTime),
        root_cmake().opacity(opacitySemi, animationTime),
        code().code(mathCppCode, animationTime),
    );
});
