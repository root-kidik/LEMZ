import { CODE, lines, makeScene2D, word } from "@motion-canvas/2d";
import { Vscode } from "../../components/Vscode";
import { all, AudioManager, beginSlide, createRef, DEFAULT, Direction, slideTransition, waitFor } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { MyRect } from "../../components/My/MyRect";
import { Console } from "../../components/Console";
import { animationTime, colorBlue, colorGreen, colorRed, colorWhiteBlue } from "../../theme/Theme";
import { createFile } from "../../components/Utils";

const devcontainer_code = CODE`\
{
    "name": "Lemz",
    "build": {
        "dockerfile": "../docker/astra-se1.7.Dockerfile",
        "options": [
            "--network=host"
        ]
    },
    "runArgs": [
        "--privileged",
        "--network=host",
        "--env=DISPLAY=\${localEnv:DISPLAY}",
        "--volume=/tmp/.X11-unix:/tmp/.X11-unix",
        "--volume=/dev:/dev"
    ]
}`;

const devcontainer_code_vscode = CODE`\
{
    "name": "Lemz",
    "build": {...},
    "runArgs": [...],
    "customizations": {
        "vscode": {
            "extensions": [
                "llvm-vs-code-extensions.vscode-clangd",
                "ms-vscode.cmake-tools",
                "ms-vscode.cpptools",
                "twxs.cmake"
            ],
            "settings": {
                "cmake.copyCmpCommands": ".vscode/compile_commands.json",
                "clangd.path": "/usr/bin/clangd",
                "clangd.arguments": [
                    "--background-index",
                    "--compile-commands-dir=.vscode",
                    "--clang-tidy",
                    "--completion-style=detailed",
                    "--header-insertion=never"
                ]
            }
        }
    }
}`;

const devcontainer_code_vscode_min = CODE`\
{
    "name": "Lemz",
    "build": {...},
    "runArgs": [...],
    "customizations": {"vscode": ...}
}`;


const clang_tidy = CODE`\
Checks: >
  -*,
  bugprone-*,
  clang-analyzer-*,
  cppcoreguidelines-*,
  misc-*,
  modernize-*,
  performance-*,
  portability-*,
  readability-*,
  concurrency-*,
  -bugprone-easily-swappable-parameters,
  -misc-include-cleaner,
  -modernize-use-trailing-return-type,
  -readability-identifier-length,
HeaderFilterRegex: '.*'
WarningsAsErrors: '*'
SystemHeaders: false
UseColor: true`;

const clang_tidy2 = CODE`\
CheckOptions:
   - key: readability-identifier-naming.NamespaceCase
     value: lower_case
   - key: readability-identifier-naming.ClassCase
     value: CamelCase
   - key: readability-identifier-naming.ParameterCase
     value: lower_case
   - key: readability-identifier-naming.VariableCase
     value: lower_case
   - key: readability-identifier-naming.MemberCase
     value: lower_case
   - key: readability-identifier-naming.ClassMemberCase
     value: lower_case
   - key: readability-identifier-naming.PrivateMemberCase
     value: lower_case
   - key: readability-identifier-naming.PrivateMemberPrefix
     value: m_
   - key: readability-identifier-naming.ConstexprVariableCase
     value: CamelCase
   - key: readability-identifier-naming.ConstexprVariablePrefix
     value: k
   - key: readability-identifier-naming.EnumCase
     value: CamelCase
   - key: readability-identifier-naming.EnumConstantCase
     value: CamelCase`;

const clang_tidy3 = CODE`\
   - key: readability-identifier-naming.FunctionCase
     value: CamelCase
   - key: readability-identifier-naming.GlobalConstantCase
     value: CamelCase
   - key: readability-identifier-naming.GlobalConstantPrefix
     value: k
   - key: readability-identifier-naming.StaticConstantCase
     value: CamelCase
   - key: readability-identifier-naming.StaticConstantPrefix
     value: k
   - key: readability-identifier-naming.StaticVariableCase
     value: lower_case
   - key: readability-identifier-naming.MacroDefinitionCase
     value: UPPER_CASE
   - key: readability-identifier-naming.MacroDefinitionIgnoredRegexp
     value: '^[A-Z]+(_[A-Z]+)*_$'
   - key: readability-identifier-naming.TypeAliasCase
     value: CamelCase
   - key: readability-identifier-naming.TypedefCase
     value: CamelCase`;

const cmake_presets_cd = CODE`\
{
    "version": 6,
    "cmakeMinimumRequired": {
        "major": 3,
        "minor": 25,
        "patch": 1
    },
    "configurePresets": [
        {
            "name": "debug",
            "displayName": "Debug",
            "inherits": ["base"],
            "binaryDir": "\${sourceDir}/build-\${presetName}",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Debug",
                "CMAKE_CXX_CLANG_TIDY": "clang-tidy-19"
            }
        },
    ]
}
`;

export default makeScene2D(function* (view) {
    const root = createFile("");

    const cmakelists = createFile("CMakeLists.txt");
    const cmake_presets = createFile("CMakePresets.json");
    const makefile = createFile("Makefile");
    const clang_tidy_src = createFile(".clang-tidy");

    root().add(cmakelists());
    root().add(cmake_presets());
    root().add(makefile());
    root().add(clang_tidy_src());

    const src = createFile("src");
    const main_cpp = createFile("Main.cpp");
    const cmake_lists_src = createFile("CMakeLists.txt");
    src().add(cmake_lists_src());
    src().add(main_cpp());
    root().add(src());

    const pipeline = createFile("pipeline");
    const jenkinsfile = createFile("Jenkinsfile");
    pipeline().add(jenkinsfile());
    root().add(pipeline());

    const test = createFile("test");
    root().add(test());

    const integration = createFile("integration");
    const init_py = createFile("__init__.py");
    const test_rli = createFile("test_rli_stream.py");
    const pytest_ini = createFile("pytest.ini");
    const conftest = createFile("conftest.py");
    integration().add(conftest());
    integration().add(pytest_ini());
    integration().add(test_rli());
    integration().add(init_py());
    test().add(integration());

    const unit = createFile("unit");
    const test_rli_unit = createFile("test_rli_stream.cpp");
    const cmake_lists_unit = createFile("CMakeLists.txt");
    unit().add(cmake_lists_unit());
    unit().add(test_rli_unit());
    test().add(unit());

    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    yield* slideTransition(Direction.Right);

    yield* beginSlide("Начало");

    const filebar = createRef<MyRect>();

    yield* all(
        vscode().showFilebar(filebar, root, animationTime),
        code().code(clang_tidy, animationTime),
        root().highlight(clang_tidy_src(), animationTime),
    );

    yield* beginSlide("Конфиг");

    yield* code().selection(lines(0, 14), animationTime);

    yield* beginSlide("All turnoff");

    yield* code().selection(lines(1), animationTime);

    yield* beginSlide("turn on");

    yield* code().selection(lines(2, 10), animationTime);

    yield* beginSlide("disable some");

    yield* code().selection(lines(11, 14), animationTime);

    yield* beginSlide("options");

    yield* code().selection(lines(15, 18), animationTime);

    yield* beginSlide("cmake presets");

    yield* all(
        root().highlight(cmake_presets(), animationTime),
        code().code(cmake_presets_cd, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("clang-tidy");

    yield* code().selection(lines(15), animationTime);

    yield* beginSlide("style naming");

    yield* all(
        root().highlight(clang_tidy_src()),
        code().code(clang_tidy, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("style naming 2");

    yield* code().code(clang_tidy2, animationTime);

    yield* beginSlide("style naming 3");

    yield* code().code(clang_tidy3, animationTime);

    yield* beginSlide("Конец");
});
