import { CODE, lines, makeScene2D } from "@motion-canvas/2d";
import { createFile } from "../../components/Utils";
import { all, beginSlide, createRef, waitFor } from "@motion-canvas/core";
import { MyRect } from "../../components/My/MyRect";
import { Vscode } from "../../components/Vscode";
import { MyCode } from "../../components/My/MyCode";
import { animationTime } from "../../theme/Theme";
import { Console } from "../../components/Console";

const cmakeMathCodeUpdate = CODE`\
cmake_minimum_required(VERSION 3.20)

set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/bin)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

project(Math)

add_library(\${PROJECT_NAME} Math.cpp)`;

const cmakeMathCodeSimplified = CODE`\
cmake_minimum_required(VERSION 3.20)

project(Math)

add_library(\${PROJECT_NAME} Math.cpp)`;

const rootCmakeCode = CODE`\
cmake_minimum_required(VERSION 3.20)

set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/bin)

set(BUILD_SHARED_LIBS ON)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

project(Calculator)

add_subdirectory(libs/Math)

add_executable(\${PROJECT_NAME} Main.cpp)

target_link_libraries(\${PROJECT_NAME} PRIVATE Math)`;

const rootCmakeCodeSimple = CODE`\
cmake_minimum_required(VERSION 3.20)

project(Calculator)

add_subdirectory(libs/Math)

add_executable(\${PROJECT_NAME} Main.cpp)

target_link_libraries(\${PROJECT_NAME} PRIVATE Math)`;

const cmakeConfigureOutput = [
    "Preset CMake variables:",
    "",
    "  CMAKE_ARCHIVE_OUTPUT_DIRECTORY=\"/home/user/build-debug/lib\"",
    "  CMAKE_BUILD_TYPE=\"Debug\"",
    "  CMAKE_CXX_EXTENSIONS=\"OFF\"",
    "  CMAKE_CXX_STANDARD=\"20\"",
    "  CMAKE_CXX_STANDARD_REQUIRED=\"ON\"",
    "  CMAKE_EXPORT_COMPILE_COMMANDS=\"ON\"",
    "  CMAKE_LIBRARY_OUTPUT_DIRECTORY=\"/home/user/build-debug/lib\"",
    "  CMAKE_POSITION_INDEPENDENT_CODE=\"ON\"",
    "  CMAKE_RUNTIME_OUTPUT_DIRECTORY=\"/home/user/build-debug/bin\"",
    "",
    "The C compiler identification is GNU 13.3.0",
    "The CXX compiler identification is GNU 13.3.0",
    "Detecting C compiler ABI info",
    "Detecting C compiler ABI info - done",
    "Check for working C compiler: /usr/bin/cc - skipped",
    "Detecting C compile features",
    "Detecting C compile features - done",
    "Detecting CXX compiler ABI info",
    "Detecting CXX compiler ABI info - done",
    "Check for working CXX compiler: /usr/bin/c++ - skipped",
    "Detecting CXX compile features",
    "Detecting CXX compile features - done",
    "Configuring done (0.3s)",
    "Generating done (0.0s)",
    "Build files have been written to: /home/user/build-debug"];

const cmakeBuildOutput = [
    "[4/4] Linking CXX executable bin/Calculator"
];

export default makeScene2D(function* (view) {
    const libs = createFile("libs");
    const math = createFile("Math");
    const cmake_math = createFile("CMakeLists.txt");
    const math_cpp = createFile("Math.cpp");
    const math_cmake_presets = createFile("CMakePresets.json");

    libs().add(math());
    math().add(cmake_math());
    math().add(math_cpp());
    math().add(math_cmake_presets());

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

    const filebar = createRef<MyRect>();

    yield* all(
        vscode().showFilebar(filebar, root, 0),
        code().code(cmakeMathCodeUpdate, 0),
        root().highlight(cmake_math(), 0),
    );

    yield* all(
        code().code(cmakeMathCodeSimplified, animationTime)
    );

    yield* beginSlide("В калькуляторе добавляем cmakePresets");

    const root_cmake_presets = createFile("CMakePresets.json");

    yield* all(
        root().addFile(root_cmake_presets),
    );

    yield* all(
        root().highlight(cmake_root()),
        code().code(rootCmakeCode, animationTime)
    );

    yield* waitFor(1);

    yield* all(
        code().code(rootCmakeCodeSimple, animationTime)
    )

    yield* beginSlide("Открываем консоль");

    const console = createRef<Console>();

    yield* vscode().showConsole(console);

    yield* console().terminal().prompt();

    yield* console().terminal().type("cmake --preset debug");

    yield* beginSlide("Запускаем конфигурацию");

    const build = createFile("build-debug");
    const buildMakefile = createFile("build.ninja");
    const buildLibs = createFile("libs");
    const buildLibsMath = createFile("Math");
    const buildLibsMathMakefile = createFile("build.ninja");

    yield* all(
        console().terminal().output(cmakeConfigureOutput, "-- "),
        build().addFile(buildMakefile),
        root().addFile(build),
        build().addFile(buildLibs),
        buildLibs().addFile(buildLibsMath),
        buildLibsMath().addFile(buildLibsMathMakefile),
        root().unhighlight()
    );

    yield* beginSlide("Консоль сборка");

    yield* console().terminal().type("cmake --build --preset debug");

    yield* beginSlide("Запускаем сборку");

    const bin = createFile("bin");
    const lib = createFile("lib");

    yield* all(
        console().terminal().output(cmakeBuildOutput, ""),
        bin().addFile(createFile("Calculator")),
        lib().addFile(createFile("libMath.so")),
        build().addFile(bin),
        build().addFile(lib),
        root().unhighlight()
    );

    yield* beginSlide("Конец");
});