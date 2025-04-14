import { CODE, lines, makeScene2D } from "@motion-canvas/2d";
import { createFile } from "../../components/Utils";
import { all, beginSlide, createRef, DEFAULT } from "@motion-canvas/core";
import { MyRect } from "../../components/My/MyRect";
import { MyCode } from "../../components/My/MyCode";
import { Vscode } from "../../components/Vscode";
import { Console } from "../../components/Console";
import { animationTime } from "../../theme/Theme";

const rootCmakeCode = CODE`\
cmake_minimum_required(VERSION 3.20)

set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/bin)

set(BUILD_SHARED_LIBS ON)

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

    const console = createRef<Console>();
    const filebar = createRef<MyRect>();

    yield* all(
        vscode().showFilebar(filebar, root, 0),
        root().highlight(cmake_root(), 0),
        vscode().showConsole(console, 0),
        code().code(rootCmakeCode, 0),
    );

    yield* code().selection(lines(6), 0);

    yield* console().terminal().prompt();

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
        buildLibsMath().addFile(buildLibsMathMakefile),
    );

    yield* console().terminal().type("cmake --build build --parallel $(nproc)");

    const bin = createFile("bin");
    const lib = createFile("lib");

    yield* all(
        console().terminal().output(cmakeBuildOutput, "-- "),
        bin().addFile(createFile("Calculator")),
        lib().addFile(createFile("libMath.so")),
        build().addFile(bin),
        build().addFile(lib),
    );


    yield* beginSlide("Конец");

    const childrens = [...root().children()];
    childrens.pop();

    yield* console().terminal().type("rm -r build");
    yield* all(
        console().terminal().prompt(),
        root().children(childrens, animationTime)
    );
    yield* console().terminal().clear();
    yield* console().terminal().children([], 0);
    yield* console().terminal().prompt();
    yield* console().terminal().type("exit");
    yield* root().highlight(cmake_root());
});