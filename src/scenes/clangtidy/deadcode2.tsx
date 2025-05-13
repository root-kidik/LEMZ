import { CODE, Layout, lines, makeScene2D, word } from "@motion-canvas/2d";
import { all, beginSlide, createRef, DEFAULT, Direction, slideTransition } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { animationTime, colorRed, paddingBig } from "../../theme/Theme";
import { MyRect } from "../../components/My/MyRect";
import { Vscode } from "../../components/Vscode";
import { Console } from "../../components/Console";

const cd = CODE`\
namespace
{
constexpr int kTimeoutMs{100};
}

NanomsgProducerClient::NanomsgProducerClient(const std::string& url) : m_socket{nn_socket(AF_SP, NN_PUSH)}
{
    assert(m_socket >= 0 && "socket creation failed");

    auto connect_result = nn_connect(m_socket, url.c_str());
    assert(connect_result >= 0 && "socket connection failed");

    auto setsockopt_result = nn_setsockopt(m_socket, NN_SOL_SOCKET, NN_SNDTIMEO, 
                                           &kTimeoutMs, sizeof(kTimeoutMs));
    assert(setsockopt_result >= 0 && "socket setting option failed");
}`;

const cd_release = CODE`\
namespace
{
constexpr int kTimeoutMs{100};
}

NanomsgProducerClient::NanomsgProducerClient(const std::string& url) : m_socket{nn_socket(AF_SP, NN_PUSH)}
{
    auto connect_result = nn_connect(m_socket, url.c_str());

    auto setsockopt_result = nn_setsockopt(m_socket, NN_SOL_SOCKET, NN_SNDTIMEO, 
                                           &kTimeoutMs, sizeof(kTimeoutMs));
}`;

const cd_not_error = [
'cmake --preset debug',
'Preset CMake variables:',
'',
'  CMAKE_ARCHIVE_OUTPUT_DIRECTORY="/workspaces/fpga-router/build-debug/lib"',
'  CMAKE_BUILD_TYPE="Debug"',
'  CMAKE_CXX_CLANG_TIDY="clang-tidy"',
'  CMAKE_CXX_EXTENSIONS="OFF"',
'  CMAKE_CXX_STANDARD="17"',
'  CMAKE_CXX_STANDARD_REQUIRED="ON"',
'  CMAKE_EXPORT_COMPILE_COMMANDS="ON"',
'  CMAKE_LIBRARY_OUTPUT_DIRECTORY="/workspaces/fpga-router/build-debug/lib"',
'  CMAKE_POSITION_INDEPENDENT_CODE="ON"',
'  CMAKE_RUNTIME_OUTPUT_DIRECTORY="/workspaces/fpga-router/build-debug/bin"',
'',
'-- The C compiler identification is GNU 8.3.0',
'-- The CXX compiler identification is GNU 8.3.0',
'-- Detecting C compiler ABI info',
'-- Detecting C compiler ABI info - done',
'-- Check for working C compiler: /usr/bin/cc - skipped',
'-- Detecting C compile features',
'-- Detecting C compile features - done',
'-- Detecting CXX compiler ABI info',
'-- Detecting CXX compiler ABI info - done',
'-- Check for working CXX compiler: /usr/bin/c++ - skipped',
'-- Detecting CXX compile features',
'-- Detecting CXX compile features - done',
'CMAKE_INSTALL_LIBDIR=lib',
'CMAKE_CXX_VISIBILITY_PRESET=',
'CMAKE_CXX_VISIBILITY_PRESET=hidden',
'-- Performing Test COMPILER_HAS_HIDDEN_VISIBILITY',
'-- Performing Test COMPILER_HAS_HIDDEN_VISIBILITY - Success',
'-- Performing Test COMPILER_HAS_HIDDEN_INLINE_VISIBILITY',
'-- Performing Test COMPILER_HAS_HIDDEN_INLINE_VISIBILITY - Success',
'-- Performing Test COMPILER_HAS_DEPRECATED_ATTR',
'-- Performing Test COMPILER_HAS_DEPRECATED_ATTR - Success',
'-- Performing Test CMAKE_HAVE_LIBC_PTHREAD',
'-- Performing Test CMAKE_HAVE_LIBC_PTHREAD - Failed',
'-- Looking for pthread_create in pthreads',
'-- Looking for pthread_create in pthreads - not found',
'-- Looking for pthread_create in pthread',
'-- Looking for pthread_create in pthread - found',
'-- Found Threads: TRUE  ',
'-- Found PkgConfig: /usr/bin/pkg-config (found version "0.29") ',
'--   Found nanomsg, version 1.1.5',
'-- Found LibDl: /usr/lib/x86_64-linux-gnu/libdl.so  ',
'-- Found LibRt: /usr/lib/x86_64-linux-gnu/librt.so  ',
'-- Found ZLIB: /usr/lib/x86_64-linux-gnu/libz.so (found version "1.2.11") ',
'-- Found CURL: /usr/lib/x86_64-linux-gnu/libcurl.so (found version "7.74.0")  ',
'-- Found GTest: /usr/lib/x86_64-linux-gnu/cmake/GTest/GTestConfig.cmake (found version "1.12.1")  ',
'-- Configuring done',
'-- Generating done',
'-- Build files have been written to: /workspaces/fpga-router/build-debug',
'cmake --build --preset debug',
'[33/33] Linking CXX executable bin/fpga-router-unittest'
]

const cd_error = [
'cmake --preset debug',
'CMAKE_INSTALL_LIBDIR=libPreset CMake variables:',
'',
'  CMAKE_ARCHIVE_OUTPUT_DIRECTORY="/workspaces/fpga-router/build-release/lib"',
'  CMAKE_BUILD_TYPE="Release"',
'  CMAKE_CXX_CLANG_TIDY="clang-tidy-19"',
'  CMAKE_CXX_EXTENSIONS="OFF"',
'  CMAKE_CXX_STANDARD="17"',
'  CMAKE_CXX_STANDARD_REQUIRED="ON"',
'  CMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++"',
'  CMAKE_EXPORT_COMPILE_COMMANDS="ON"',
'  CMAKE_LIBRARY_OUTPUT_DIRECTORY="/workspaces/fpga-router/build-release/lib"',
'  CMAKE_POSITION_INDEPENDENT_CODE="ON"',
'  CMAKE_RUNTIME_OUTPUT_DIRECTORY="/workspaces/fpga-router/build-release/bin"',
'',
'',
'CMAKE_CXX_VISIBILITY_PRESET=',
'CMAKE_CXX_VISIBILITY_PRESET=hidden',
'-- Configuring done',
'-- Generating done',
'-- Build files have been written to: /workspaces/fpga-router/build-release',
'cmake --build --preset release',
'[5/33] Building CXX object src/infrastructure/CMakeFiles/fpga-router-infrastructure.dir/client/NanomsgProducerClient.cpp.o',
'FAILED: src/infrastructure/CMakeFiles/fpga-router-infrastructure.dir/client/NanomsgProducerClient.cpp.o ',
];

const cd_fixed = CODE`\
namespace
{
constexpr int kTimeoutMs{100};
}

NanomsgProducerClient::NanomsgProducerClient(const std::string& url) : m_socket{nn_socket(AF_SP, NN_PUSH)}
{
    if (m_socket < 0) throw std::runtime_error("socket creation failed");

    if (nn_connect(m_socket, url.c_str()) < 0) throw std::runtime_error("socket connection failed");

    if (nn_setsockopt(m_socket, NN_SOL_SOCKET, NN_SNDTIMEO, 
                                &util::kSendRecvTimeoutMs, sizeof(util::kSendRecvTimeoutMs)) < 0)
        throw std::runtime_error("socket setting option failed");
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

    yield* beginSlide("Console");

    const console = createRef<Console>();
    yield* vscode().showConsole(console);
    yield* console().terminal().prompt();
    yield* console().terminal().type("make build-debug");

    yield* beginSlide("Success output");

    yield* console().terminal().output(cd_not_error);

    yield* beginSlide("Build Release");

    yield* console().terminal().type("make build-release");

    yield* beginSlide("Build Release CODE");

    yield* code().code(cd_release, animationTime);

    yield* beginSlide("Deadcode Show");

    yield* code().selection(lines(7, 10), animationTime);

    yield* beginSlide("Deadcode Show 2");

    yield* all(
        code().code(cd, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("Error output");

    yield* console().terminal().output(cd_error, "", animationTime, false);
    yield* console().terminal().line("/workspaces/fpga-router/src/infrastructure/client/NanomsgProducerClient.cpp:24:10", colorRed);
    yield* console().terminal().line("error: Value stored to 'connect_result' during its initialization is never read", colorRed);
    yield* console().terminal().line("[clang-analyzer-deadcode.DeadStores,-warnings-as-errors]", colorRed);
    yield* console().terminal().line("auto connect_result = nn_connect(m_socket, url.c_str());", colorRed);
    yield* console().terminal().prompt();

    yield* beginSlide("FIX");

    yield* code().code(cd_fixed, animationTime);

    yield* beginSlide("End");
})
