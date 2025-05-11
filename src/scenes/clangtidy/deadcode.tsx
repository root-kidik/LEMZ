import { CODE, Layout, lines, makeScene2D } from "@motion-canvas/2d";
import { beginSlide, createRef } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { animationTime, colorRed, paddingBig } from "../../theme/Theme";
import { MyRect } from "../../components/My/MyRect";
import { Vscode } from "../../components/Vscode";
import { Console } from "../../components/Console";

const deadcode = CODE`\
ParseResult parse(std::vector<uint8_t>&& data, bool ignore_crc, ssr::IMessageNotifier & callback)
{
    auto header = parseHeader(std::move(data));

    if (header.value().type == static_cast<uint8_t>(rli_stream::ssr::BlockDataType::AzimuhTimeOnAzimuth))
    {
        AzimuthTime azTime;
        auto result = convertToMessage(std::move(data), AzimuthTimeDataSize, azTime);
        callback.updateAzimuth(azTime);
        return ParseResult::Success;
    }

    return ParseResult::UnknowMessageType;
}`;

const fixed_code = CODE`\
ParseResult parse(std::vector<uint8_t>&& data, bool ignore_crc, ssr::IMessageNotifier & callback)
{
    auto header = parseHeader(std::move(data));

    if (header.value().type == static_cast<uint8_t>(rli_stream::ssr::BlockDataType::AzimuhTimeOnAzimuth))
    {
        AzimuthTime azTime;
        convertToMessage(std::move(data), AzimuthTimeDataSize, azTime);
        callback.updateAzimuth(azTime);
        return ParseResult::Success;
    }

    return ParseResult::UnknowMessageType;
}`;

const deadcode_error = [
'root@rtkid-B550M-K:/workspaces/fpga-router# make build-debug',
'cmake --preset debug',
'Preset CMake variables:',
'',
'  CMAKE_ARCHIVE_OUTPUT_DIRECTORY="/workspaces/fpga-router/build-debug/lib"',
'  CMAKE_BUILD_TYPE="Debug"',
'  CMAKE_CXX_CLANG_TIDY="clang-tidy"',
'  CMAKE_CXX_EXTENSIONS="OFF"',
'  CMAKE_CXX_STANDARD="17"',
'  CMAKE_CXX_STANDARD_REQUIRED="ON"',
'  CMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++"',
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
'-- Checking for module \'nanomsg\'',
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
'Error while processing /workspaces/fpga-router/libs/RliStreamProtocol/src/private/FpgaBlocksStatistics.cpp.',
'Found compiler error(s).',
'[6/33] Building CXX object src/private/RliStreamProtocol_v2.cpp.o'];

export default makeScene2D(function* (view) {
    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    yield* beginSlide("Begin");

    yield* code().code(deadcode, animationTime);

    yield* beginSlide("Deadcode Show");

    yield* code().selection(lines(7), animationTime);

    yield* beginSlide("Console");

    const console = createRef<Console>();
    yield* vscode().showConsole(console);
    yield* console().terminal().prompt();
    yield* console().terminal().type("make build-debug");

    yield* beginSlide("Error output");

    yield* console().terminal().output(deadcode_error, "", animationTime, false);
    yield* console().terminal().line("RliStreamProtocol/src/private/RliStreamProtocol_v2.cpp:158:14:", colorRed);
    yield* console().terminal().line("error: Value stored to 'result' is never read [clang-analyzer-deadcode.DeadStores,-warnings-as-errors]", colorRed);
    yield* console().terminal().line("auto result = convertToMessage(std::move(data), AzimuthTimeDataSize, azTime);", colorRed);
    yield* console().terminal().prompt();

    yield* beginSlide("FIX");

    yield* code().code(fixed_code, animationTime);

    yield* beginSlide("End");
})
