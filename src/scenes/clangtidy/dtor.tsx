import { CODE, Layout, lines, makeScene2D, word } from "@motion-canvas/2d";
import { all, beginSlide, createRef, Direction, slideTransition } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { animationTime, colorRed, paddingBig } from "../../theme/Theme";
import { MyRect } from "../../components/My/MyRect";
import { Vscode } from "../../components/Vscode";
import { Console } from "../../components/Console";

const cd = CODE`\
class NanomsgProducerClient final : public domain::interface::Producer
{
public:
    NanomsgProducerClient(const std::string& url);
    ~NanomsgProducerClient();

    void Send(void* data, int len) override;

private:
    int m_socket;
};`;

const cd_magic = CODE`\
class NanomsgProducerClient final : public domain::interface::Producer
{
public:
    NanomsgProducerClient(const std::string& url);
    ~NanomsgProducerClient();

    NanomsgProducerClient(const NanomsgProducerClient&)            = default;
    NanomsgProducerClient(NanomsgProducerClient&&)                 = default;
    NanomsgProducerClient& operator=(const NanomsgProducerClient&) = default;
    NanomsgProducerClient& operator=(NanomsgProducerClient&&)      = default;

    void Send(void* data, int len) override;

private:
    int m_socket;
};`;

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
class NanomsgProducerClient final : public domain::interface::Producer
{
public:
    NanomsgProducerClient(const std::string& url);
    ~NanomsgProducerClient();

    NanomsgProducerClient(const NanomsgProducerClient&)            = delete;
    NanomsgProducerClient& operator=(const NanomsgProducerClient&) = delete;

    void Send(void* data, int len) override;

private:
    int m_socket;
};`;

const cd_fixed_2 = CODE`\
class NanomsgProducerClient final : public domain::interface::Producer, private boost::noncopyable
{
public:
    NanomsgProducerClient(const std::string& url);
    ~NanomsgProducerClient();

    void Send(void* data, int len) override;

private:
    int m_socket;
};`;

const cd_fixed_3 = CODE`\
class NanomsgProducerClient final : public domain::interface::Producer, boost::noncopyable
{
public:
    NanomsgProducerClient(const std::string& url);
    ~NanomsgProducerClient();

    void Send(void* data, int len) override;

private:
    int m_socket;
};`;

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

    yield* all(
        code().code(cd_magic, animationTime),
        code().selection(lines(5, 10), animationTime)
    );

    yield* beginSlide("Console");

    const console = createRef<Console>();
    yield* vscode().showConsole(console);
    yield* console().terminal().prompt();
    yield* console().terminal().type("make build-debug");

    yield* beginSlide("Error output");

    yield* console().terminal().output(cd_error, "", animationTime, false);
    yield* console().terminal().line("/workspaces/fpga-router/src/infrastructure/client/NanomsgProducerClient.hpp:14:5:", colorRed);
    yield* console().terminal().line("error: class 'NanomsgProducerClient',", colorRed);
    yield* console().terminal().line("defines a non-default destructor but does not define a copy constructor", colorRed);
    yield* console().terminal().line("a copy assignment operator, a move constructor or a move assignment operator", colorRed);
    yield* console().terminal().line("[cppcoreguidelines-special-member-functions,-warnings-as-errors]", colorRed);
    yield* console().terminal().line("class NanomsgProducerClient final : public domain::interface::Producer", colorRed);
    yield* console().terminal().prompt();

    yield* beginSlide("FIX");

    yield* all(
        code().selection(lines(5, 7), animationTime),
        code().code(cd_fixed, animationTime)
    );

    yield* beginSlide("FIX 2");

    yield* all(
        code().selection(word(0, 70, 28), animationTime),
        code().code(cd_fixed_2, animationTime)
    );


    yield* beginSlide("FIX 3");

    yield* all(
        code().selection(word(0, 70, 20), animationTime),
        code().code(cd_fixed_3, animationTime)
    );

    yield* beginSlide("End");
})
