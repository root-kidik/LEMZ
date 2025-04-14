import { CODE, lines, makeScene2D } from "@motion-canvas/2d";
import { createFile } from "../../components/Utils";
import { all, beginSlide, createRef, DEFAULT } from "@motion-canvas/core";
import { MyRect } from "../../components/My/MyRect";
import { MyCode } from "../../components/My/MyCode";
import { Vscode } from "../../components/Vscode";
import { Console } from "../../components/Console";
import { animationTime } from "../../theme/Theme";

const cmakeMathCode = CODE`\
cmake_minimum_required(VERSION 3.20)

project(Math)

add_library(\${PROJECT_NAME} Math.cpp)`;

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

const cmakePresetsMinimumRequiredCode = CODE`\
{
    "version": 2,
    "cmakeMinimumRequired": {
        "major": 3,
        "minor": 20,
        "patch": 0
    },

}`;

const cmakePresetsConfigureCode = CODE`\
{
    ..."cmakeMinimumRequired",
    "configurePresets": [
        {
            "name": "debug",
            "inherits": [
                "common-flags"
            ],
            "binaryDir": "\${sourceDir}/build-\${presetName}",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Debug"
            }
        },
        {
            "name": "release",
            "inherits": [
                "common-flags"
            ],
            "binaryDir": "\${sourceDir}/build-\${presetName}",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Release"
            }
        },
    ]
}`;

const cmakePresetsConfigureCommonCode = CODE`\
{
    ..."cmakeMinimumRequired",
    "configurePresets": [
        ..."debug",
        ..."release",
        {
            "name": "common-flags",
            "hidden": true,
            "generator": "Ninja",
            "cacheVariables": {
                "CMAKE_EXPORT_COMPILE_COMMANDS": "ON",
                "CMAKE_CXX_STANDARD": "20",
                "CMAKE_CXX_STANDARD_REQUIRED": "ON",
                "CMAKE_CXX_EXTENSIONS": "OFF",
                "CMAKE_POSITION_INDEPENDENT_CODE": "ON",
                "CMAKE_ARCHIVE_OUTPUT_DIRECTORY": "\${sourceDir}/\${...}/lib",
                "CMAKE_LIBRARY_OUTPUT_DIRECTORY": "\${sourceDir}/\${...}/lib",
                "CMAKE_RUNTIME_OUTPUT_DIRECTORY": "\${sourceDir}/\${...}/bin"
            }
        }
    ]
}`;

const cmakePresetsBuildCode = CODE`\
{
    ..."cmakeMinimumRequired",
    ..."configurePresets",
    "buildPresets": [
        {
            "name": "debug",
            "configurePreset": "debug"
        },
        {
            "name": "release",
            "configurePreset": "release"
        }
    ],
}`;

const cmakePresetsTestCode = CODE`\
{
    ..."cmakeMinimumRequired",
    ..."configurePresets",
    ..."buildPresets",
    "testPresets": [
        {
            "name": "debug",
            "configurePreset": "debug"
        },
        {
            "name": "release",
            "configurePreset": "release"
        }
    ]
}`;

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
        code().code.insert([7, 0], CODE`set(CMAKE_CXX_STANDARD 20)
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

    yield* beginSlide("Проблема с флагом стандарта");

    yield* all(
        code().selection(lines(6), animationTime)
    );

    yield* beginSlide("Показываем CMakePresets.json");

    yield* all(
        code().selection(DEFAULT, animationTime)
    );

    const cmakePresets = createFile("CMakePresets.json");

    yield* all(
        math().addFile(cmakePresets),
        code().code(cmakePresetsMinimumRequiredCode, animationTime)
    );

    yield* beginSlide("CMakePresets version");

    yield* code().selection(lines(1), animationTime);

    yield* beginSlide("CMakePresetsMinimumRequired");

    yield* code().selection(lines(2,6), animationTime);

    yield* beginSlide("CMakePresets добавляем Configure часть");

    yield* all(
        code().code(cmakePresetsConfigureCode, animationTime),
        code().selection(lines(2, 23), animationTime)
    );

    yield* beginSlide("CMakePresets debug configure");

    yield* all(
        code().selection(lines(3, 12), animationTime)
    );

    yield* beginSlide("CMakePresets release configure");

    yield* all(
        code().selection(lines(13, 22), animationTime)
    );

    yield* beginSlide("CMakePresets common flags");

    yield* all(
        code().code(cmakePresetsConfigureCommonCode, animationTime),
        code().selection(lines(5, 19), animationTime)
    );

    yield* beginSlide("build presets");

    yield* all(
        code().code(cmakePresetsBuildCode, animationTime),
        code().selection(lines(3, 12), animationTime)
    );

    yield* beginSlide("test presets");

    yield* all(
        code().code(cmakePresetsTestCode, animationTime),
        code().selection(lines(4, 13), animationTime)
    );

    yield* beginSlide("Возвращаемся к CMakeLists");

    yield* all(
        code().code(cmakeMathCodeUpdate, animationTime),
        code().selection(DEFAULT, animationTime),
        root().highlight(cmake_math())
    );

    yield* beginSlide("Конец");
});