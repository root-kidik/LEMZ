import { CODE, lines, makeScene2D } from "@motion-canvas/2d";
import { createFile } from "../../components/Utils";
import { all, beginSlide, createRef, DEFAULT } from "@motion-canvas/core";
import { MyRect } from "../../components/My/MyRect";
import { MyCode } from "../../components/My/MyCode";
import { Vscode } from "../../components/Vscode";
import { Console } from "../../components/Console";
import { animationTime } from "../../theme/Theme";

const cmakeMathCode = CODE`\
cmake_minimum_required(VERSION 3.25)

project(Math)

add_library(\${PROJECT_NAME} Math.cpp)`;

const cmakeMathCodeUpdate = CODE`\
cmake_minimum_required(VERSION 3.25)

set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/bin)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

project(Math)

add_library(\${PROJECT_NAME} Math.cpp)`;


const rootCmakeCode = CODE`\
cmake_minimum_required(VERSION 3.25)

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

    const filebar = createRef<MyRect>();

    yield* all(
        vscode().showFilebar(filebar, root, 0),
        code().code(rootCmakeCode, 0),
    );

    yield* all(
     code().selection(lines(6), 0),
     root().highlight(cmake_root(), 0),
    );

    yield* all(
        code().code.insert([7, 0], CODE`set(CMAKE_CXX_STANDARD 17)
`, animationTime),
        code().selection(lines(7), animationTime)
    );

    yield* beginSlide("Экспортируем комманды компиляции")

    yield* all(
        code().code.insert([8, 0], CODE`set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
`, animationTime),
        code().selection(lines(8), animationTime)
    );

    yield* beginSlide("Требуем обязательно поддержку стандарта")

    yield* all(
        code().code.insert([9, 0], CODE`set(CMAKE_CXX_STANDARD_REQUIRED ON)
`, animationTime),
        code().selection(lines(9), animationTime)
    );

    yield* beginSlide("Выключаем все кастомные расширения")

    yield* all(
        code().code.insert([10, 0], CODE`set(CMAKE_CXX_EXTENSIONS OFF)
`, animationTime),
        code().selection(lines(10), animationTime)
    );

    yield* beginSlide("В библиотеки математики")

    yield* all(
        root().highlight(cmake_math()),
        code().code(cmakeMathCode, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("Добавляем тоже самое")

    yield* all(
        code().code(cmakeMathCodeUpdate, animationTime),
        code().selection(lines(2, 9), animationTime)
    );


    yield* beginSlide("Конец");
});