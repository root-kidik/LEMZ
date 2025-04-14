import { CODE, Line, makeScene2D } from "@motion-canvas/2d";
import { createFile } from "../../components/Utils";
import { all, beginSlide, createRef, createSignal, Direction, slideTransition, waitFor } from "@motion-canvas/core";
import { MyRect } from "../../components/My/MyRect";
import { Vscode } from "../../components/Vscode";
import { MyCode } from "../../components/My/MyCode";
import { animationTime, colorRed, radiusNormal } from "../../theme/Theme";
import { Console } from "../../components/Console";
import { Library } from "../../components/Library";

const cmakeConfigCode = CODE`\
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/bin)

`;

const mainCppCode = CODE`\
#include <print>

int sum(int,int);

int main()
{
    std::println("{}", sum(1, 2));
}`

const cmakeRootCode = CODE`\
cmake_minimum_required(VERSION 3.20)

project(Calculator)

add_subdirectory(libs/Math)

add_executable(\${PROJECT_NAME} Main.cpp)

target_link_libraries(\${PROJECT_NAME} PRIVATE Math)`;

const cmakeConfigureOutput = ["The C compiler identification is GNU 13.3.0",
    "The CXX compiler identification is GNU 13.3.0",
    "Detecting C compiler ABI info",
    "Detecting C compiler ABI info - done",
    "Check for working C compiler: /usr/bin/cc",
    "Detecting C compile features",
    "Detecting C compile features - done",
    "Detecting CXX compiler ABI info",
    "Detecting CXX compiler ABI info - done",
    "Check for working CXX compiler: /usr/bin/c++",
    "Detecting CXX compile features",
    "Detecting CXX compile features - done",
    "Configuring done (0.3s)",
    "Generating done (0.0s)",
    "Build written to: /home/user/math/build"];

const cmakeBuildOutput = 
    ["[ 25%] Building CXX object libs/Math/Math.cpp.o",
    "[ 50%] Linking CXX static library libMath.a",
    "[ 50%] Built target Math",
    "[ 75%] Building CXX object Main.cpp.o",
    "[100%] Linking CXX executable Calculator",
    "[100%] Built target Calculator",];
    

export default makeScene2D(function* (view) {
    const libs = createFile("libs");
    const math = createFile("Math");
    const cmake_math = createFile("CMakeLists.txt");
    const math_cpp = createFile("Math.cpp");

    libs().add(math());
    math().add(cmake_math());
    math().add(math_cpp());

    const main_cpp = createFile("Main.cpp");
    const cmake_root = createFile("CMakeLists.txt");

    const root = createFile("");

    root().add(libs());
    root().add(main_cpp());
    root().add(cmake_root());

    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    yield* slideTransition(Direction.Right);

    const filebar = createRef<MyRect>();
    yield* vscode().showFilebar(filebar, root);

    yield* beginSlide("Main.cpp");

    yield* all(
        root().highlight(main_cpp()),
        code().code(mainCppCode, animationTime)
    );

    yield* beginSlide("Главный CMake");

    yield* all(
        root().highlight(cmake_root()),
        code().code(cmakeRootCode, animationTime)
    );

    yield* beginSlide("Добавляем отображение библиотеки");

    const animation_layout = vscode().addAnimationLayout();

    const library = createSignal(<Library name={"Math"} /> as Library);
    const executable = createSignal(<Library stroke={colorRed} name={"Calculator"} /> as Library);
    const line = createRef<Line>();

    animation_layout().add(library());
    animation_layout().add(
        <Line 
            ref={line}
            points={[[0, 0],[0, 75]]}
            stroke={colorRed}
            radius={radiusNormal}
        />
    );
    animation_layout().add(executable());
    yield* all(
        animation_layout().appear(),
        library().appear(),
        executable().appear(),
        line().lineWidth(25, animationTime),
        line().startArrow(true, animationTime),
        executable().addLibrary("Math")
    );

    yield* beginSlide("Открываем консоль");

    const console = createRef<Console>();
    yield* vscode().showConsole(console);

    yield* console().terminal().prompt();

    yield* beginSlide("Вывод конфигурации CMake");

    yield* console().terminal().type("cmake -B build -S .");

    const build = createFile("build");
    const buildMakefile = createFile("Makefile");
    const buildLibs = createFile("libs");
    const buildLibsMath = createFile("Math");
    const buildLibsMathMakefile = createFile("Makefile");

    yield* all(
        console().terminal().output(cmakeConfigureOutput, "-- "),
        build().addFile(buildMakefile),
        root().addFile(build),
        build().addFile(buildLibs),
        buildLibs().addFile(buildLibsMath),
        buildLibsMath().addFile(buildLibsMathMakefile)
    );

    yield* console().terminal().type("cmake --build build --parallel $(nproc)");

    yield* all(
        console().terminal().output(cmakeBuildOutput, "-- "),
        build().addFile(createFile("Calculator")),
        buildLibsMath().addFile(createFile("libMath.a"))
    );

    yield* beginSlide("Настраиваем CMake");

    yield* all(
        root().highlight(cmake_root()),
        code().code.insert([2, 0], cmakeConfigCode, animationTime),
        animation_layout().disappear(),
    );

    yield* beginSlide("Удаляем build");

    const childrens = [...vscode().children()]; 
    childrens.pop();

    yield* console().terminal().type("rm -r build");
    yield* all(
        console().terminal().prompt(),
        vscode().children(childrens, animationTime)
    );
    yield* console().terminal().clear();
});