import { CODE, Code, makeScene2D, Rect } from '@motion-canvas/2d';
import { Vscode } from '../components/Vscode';
import { all, createRef, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { createFile } from '../components/Utils';
import { animationTime } from '../theme/Theme';

const rootCmakeCode = CODE`\
cmake_minimum_required(VERSION 3.20)

project(Summator)

add_subdirectory(libs/Math)

add_executable(\${PROJECT_NAME} Main.cpp)
target_link_libraries(\${PROJECT_NAME} Math)`;

const rootMainCppCode = CODE`\
#include <print>

int sum(int, int);

int main() 
{
    std::println(sum(1, 3)); 
}`;

export default makeScene2D(function* (view) {
    const root = createFile("");

    const math_cpp = createFile("Math.cpp");
    const math_cmake = createFile("CMakeLists.txt");
    const math = createFile("Math");
    const libs = createFile("libs");
    const root_cmake = createFile("CMakeLists.txt");
    const root_main = createFile("Main.cpp");

    libs().add(math());
    math().add([math_cmake(), math_cpp()]);

    root().add([libs(), root_cmake(), root_main()]);

    const filebar = createRef<Rect>();
    const code_layout_ref = createRef<Rect>();
    const code = createRef<Code>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} filebar={filebar} root={root} code_layout={code_layout_ref} />
    );

    yield* slideTransition(Direction.Right);

    yield* waitFor(1);

    yield* all(
        root().highlight(root_cmake()),
        code().code(rootCmakeCode, animationTime)
    );

    yield* waitFor(1);

    yield* all(
        root().highlight(root_main()),
        code().code(rootMainCppCode, animationTime)
    );

    yield* waitFor(1);
});
