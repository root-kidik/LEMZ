import { CODE, Layout, lines, makeScene2D, word } from "@motion-canvas/2d";
import { all, beginSlide, createRef, DEFAULT, Direction, slideTransition } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { animationTime, colorRed, paddingBig } from "../../theme/Theme";
import { MyRect } from "../../components/My/MyRect";
import { Vscode } from "../../components/Vscode";
import { Console } from "../../components/Console";

const cd = CODE`\
NanomsgProducerClient::NanomsgProducerClient(std::string url)
{
    m_socket = nn_socket(AF_SP, NN_PUSH);
    assert(m_socket >= 0 && "socket creation failed");

    auto connect_result = nn_connect(m_socket, url.c_str());
    assert(connect_result >= 0 && "socket connection failed");

    int  timeout           = 100;
    auto setsockopt_result = nn_setsockopt(m_socket, NN_SOL_SOCKET, NN_SNDTIMEO, 
                                           &timeout, sizeof(timeout));
    assert(setsockopt_result >= 0 && "socket setting option failed");
}`;

const cd_error = [
'cmake --preset debug',
'CMAKE_INSTALL_LIBDIR=libPreset CMake variables:',
'',
'  CMAKE_ARCHIVE_OUTPUT_DIRECTORY="/workspaces/fpga-router/build-debug/lib"',
'  CMAKE_BUILD_TYPE="Debug"',
'  CMAKE_CXX_CLANG_TIDY="clang-tidy-19"',
'  CMAKE_CXX_EXTENSIONS="OFF"',
'  CMAKE_CXX_STANDARD="17"',
'  CMAKE_CXX_STANDARD_REQUIRED="ON"',
'  CMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++"',
'  CMAKE_EXPORT_COMPILE_COMMANDS="ON"',
'  CMAKE_LIBRARY_OUTPUT_DIRECTORY="/workspaces/fpga-router/build-debug/lib"',
'  CMAKE_POSITION_INDEPENDENT_CODE="ON"',
'  CMAKE_RUNTIME_OUTPUT_DIRECTORY="/workspaces/fpga-router/build-debug/bin"',
'',
'',
'CMAKE_CXX_VISIBILITY_PRESET=',
'CMAKE_CXX_VISIBILITY_PRESET=hidden',
'-- Configuring done',
'-- Generating done',
'-- Build files have been written to: /workspaces/fpga-router/build-debug',
'cmake --build --preset debug',
'[1/26] Building CXX object src/domain/CMakeFiles/fpga-router-domain.dir/util/StringUtil.cpp.o',
'[2/26] Building CXX object src/infrastructure/CMakeFiles/fpga-router-infrastructure.dir/client/NanomsgProducerClient.cpp.o',
'FAILED: src/infrastructure/CMakeFiles/fpga-router-infrastructure.dir/client/NanomsgProducerClient.cpp.o ',
];

const cd_fixed = CODE`\
NanomsgProducerClient::NanomsgProducerClient(const std::string& url)
{
    m_socket = nn_socket(AF_SP, NN_PUSH);
    assert(m_socket >= 0 && "socket creation failed");

    auto connect_result = nn_connect(m_socket, url.c_str());
    assert(connect_result >= 0 && "socket connection failed");

    int  timeout           = 100;
    auto setsockopt_result = nn_setsockopt(m_socket, NN_SOL_SOCKET, NN_SNDTIMEO, 
                                           &timeout, sizeof(timeout));
    assert(setsockopt_result >= 0 && "socket setting option failed");
}`;

export default makeScene2D(function* (view) {
    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    yield* slideTransition(Direction.Right);

    yield* beginSlide("Begin");

    yield* code().code(cd, animationTime);

    yield* beginSlide("Deadcode Show");

    yield* code().selection(word(0, 45, 15), animationTime);

    yield* beginSlide("Console");

    const console = createRef<Console>();
    yield* vscode().showConsole(console);
    yield* console().terminal().prompt();
    yield* console().terminal().type("make build-debug");

    yield* beginSlide("Error output");

    yield* console().terminal().output(cd_error, "", animationTime, false);
    yield* console().terminal().line("/workspaces/fpga-router/src/infrastructure/client/NanomsgProducerClient.cpp:11:58:", colorRed);
    yield* console().terminal().line("error: the parameter 'url' is copied for each invocation but only used as a const reference;", colorRed);
    yield* console().terminal().line("consider making it a const reference [performance-unnecessary-value-param,-warnings-as-errors]", colorRed);
    yield* console().terminal().line("NanomsgProducerClient::NanomsgProducerClient(std::string url)", colorRed);
    yield* console().terminal().prompt();

    yield* beginSlide("FIX");

    yield* all(
        code().selection(word(0, 45, 22), animationTime),
        code().code(cd_fixed, animationTime)
    );

    yield* beginSlide("End");
})
