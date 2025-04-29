import { CODE, lines, makeScene2D, word } from "@motion-canvas/2d";
import { Vscode } from "../../components/Vscode";
import { all, AudioManager, beginSlide, createRef, DEFAULT, Direction, slideTransition, waitFor } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { MyRect } from "../../components/My/MyRect";
import { Console } from "../../components/Console";
import { animationTime, colorBlue, colorGreen, colorRed } from "../../theme/Theme";
import { createFile } from "../../components/Utils";

const mainCppCode4 = CODE`\
// #include ...

int main()
{
    // SIGINT BLOCK
    // PRODUCER SOCKET 50007

    std::atomic<bool> is_running{true};

    std::thread consumer{[&is_running, &producer_socket](){
            auto consumer_socket = nn_socket(AF_SP, NN_SUB);
            nn_connect(consumer_socket, "tcp://127.0.0.1:49007");
            nn_setsockopt(consumer_socket, NN_SUB, NN_SUB_SUBSCRIBE, "", 0);
            while (is_running) {
                void* buffer = nullptr;
                auto  len    = nn_recv(consumer_socket, &buffer, NN_MSG, 0);
                if (len < 0) continue;
                nn_send(producer_socket, buffer, len, 0);
                nn_freemsg(buffer);
            }
            nn_close(consumer_socket);
    }};

    // SIGINT WAIT
    is_running = false;
    consumer.join();
    nn_close(producer_socket);
}`;

const cmakeRoot = CODE`\
cmake_minimum_required(VERSION 3.20)

project(fpga-router)

add_executable(\${PROJECT_NAME} Main.cpp)

find_package(PkgConfig REQUIRED)
pkg_check_modules(PC_NANOMSQ REQUIRED nanomsg)

find_package(Threads REQUIRED)

target_include_directories(\${PROJECT_NAME} PRIVATE 
                           \${PC_NANOMSQ_INCLUDE_DIRS})
target_link_libraries(\${PROJECT_NAME} PRIVATE 
                      \${PC_NANOMSQ_LIBRARIES} 
                      \${CMAKE_THREAD_LIBS_INIT})`;

const cmakePresetsCode = CODE`\
{
    "version": 2,
    "cmakeMinimumRequired": {
        "major": 3,
        "minor": 22,
        "patch": 6
    },
    "configurePresets": [
        { "name": "debug" ... },
        { "name": "release" ... },
        { "name": "debug-asan-ubsan" ... },
        { "name": "release-asan-ubsan" ... },
        { "name": "debug-tsan" ... },
        { "name": "release-tsan" ... },
        { "name": "common-flags" ... },
        { "name": "asan-ubsan-flags" ... },
        { "name": "tsan-flags" ... },
    ],
    "buildPresets": [...],
    "testPresets": [...]
}`;

const makefileCode = CODE`\
PRESETS ?= debug release debug-asan-ubsan \\
           release-asan-ubsan debug-tsan release-tsan
.PHONY: $(addprefix cmake-, $(PRESETS))
$(addprefix cmake-, $(PRESETS)): cmake-%:
	cmake --preset $*

.PHONY: $(addprefix build-, $(PRESETS))
$(addprefix build-, $(PRESETS)): build-%: cmake-%
	cmake --build --preset $*

.PHONY: $(addprefix integration-test-, $(PRESETS))
$(addprefix integration-test-, $(PRESETS)): integration-test-%: build-%
	TESTSUITE_ALLOW_ROOT=ON BUILD_TYPE=$* python3 -m pytest -vs test

.PHONY: integration-test-all
integration-test-all: $(addprefix integration-test-, $(PRESETS))`;

const pythonCode1 = CODE`\
import pathlib
import sys
import os
import signal
import fcntl
import yaml
import time

import nanomsg as nn

import pytest

pytest_plugins = ['testsuite.pytest_plugin']`;

const pythonCode2 = CODE`\
import ...

@pytest.fixture(scope='session')
def source_directory_path():
    return pathlib.Path(__file__).parent.parent`;

const pythonCode3 = CODE`\
import ...

@pytest.fixture(scope='session')
def source_directory_path():
    return pathlib.Path(__file__).parent.parent

@pytest.fixture(scope='session')
def build_directory_path(source_directory_path):
    return source_directory_path.joinpath('build-' + os.environ['BUILD_TYPE'])`;

const pythonCode4 = CODE`\
import ...

@pytest.fixture(scope='session')
def source_directory_path():
    return pathlib.Path(__file__).parent.parent

@pytest.fixture(scope='session')
def build_directory_path(source_directory_path):
    return source_directory_path.joinpath('build-' + os.environ['BUILD_TYPE'])

@pytest.fixture(scope='session')
def bin_directory_path(build_directory_path):
    return build_directory_path.joinpath('bin')

@pytest.fixture(scope='session')
def executable_path(bin_directory_path):
    return bin_directory_path.joinpath('fpga-router')`;

const pythonCode5 = CODE`\
import ...

def source_directory_path(): ...
def build_directory_path(source_directory_path): ...
def bin_directory_path(build_directory_path): ...
def executable_path(bin_directory_path): ...

async def health_check(session, process):
    time.sleep(1) # Wait until service full started
    return process.poll() is None`;

const pythonCode6 = CODE`\
import ...

def source_directory_path(): ...
def build_directory_path(source_directory_path): ...
def bin_directory_path(build_directory_path): ...
def executable_path(bin_directory_path): ...

async def health_check(session, process): ...

@pytest.fixture(scope='session')
async def service_scope(
    create_daemon_scope,
    executable_path
):
    async with create_daemon_scope(
        args=[str(executable_path)],
        health_check=health_check
    ) as scope:
        yield scope

@pytest.fixture
async def fpga_router(
    ensure_daemon_started,
    service_scope
):
    await ensure_daemon_started(service_scope)`;


const pythonCode7 = CODE`\
import ...

def source_directory_path(): ...
def build_directory_path(source_directory_path): ...
def bin_directory_path(build_directory_path): ...
def executable_path(bin_directory_path): ...

async def health_check(session, process): ...

async def service_scope(create_daemon_scope, executable_path): ...
async def fpga_router(ensure_daemon_started, service_scope): ...

@pytest.fixture(scope='session')
def mocks():
    TIMEOUT_MS = 1000

    xlnx_socket = nn.Socket(nn.PUB)
    xlnx_socket.set_int_option(nn.SOL_SOCKET, nn.SNDTIMEO, TIMEOUT_MS)
    xlnx_socket.bind("tcp://127.0.0.1:49007")

    interrogator_socket = nn.Socket(nn.SUB)
    interrogator_socket.set_int_option(nn.SOL_SOCKET, nn.RCVTIMEO, TIMEOUT_MS)
    interrogator_socket.set_string_option(nn.SUB, nn.SUB_SUBSCRIBE, "")
    interrogator_socket.connect("tcp://127.0.0.1:50007")

    return (xlnx_socket, interrogator_socket)`;

const testRli = CODE`\
async def test_send_receive(fpga_router, mocks):
    xlnx_socket, interrogator_socket = mocks

    msg = b"Hello, Integration Tests!"

    xlnx_socket.send(msg)
    assert interrogator_socket.recv() == msg`;

const output = [
"cmake --preset debug",
"Preset CMake variables:",
"",
"  CMAKE_ARCHIVE_OUTPUT_DIRECTORY=\"/workspaces/integration/build-debug/lib\"",
"  CMAKE_BUILD_TYPE=\"Debug\"",
"  CMAKE_CXX_EXTENSIONS=\"OFF\"",
"  CMAKE_CXX_STANDARD=\"17\"",
"  CMAKE_CXX_STANDARD_REQUIRED=\"ON\"",
"  CMAKE_EXE_LINKER_FLAGS=\"-static-libgcc -static-libstdc++\"",
"  CMAKE_EXPORT_COMPILE_COMMANDS=\"ON\"",
"  CMAKE_LIBRARY_OUTPUT_DIRECTORY=\"/workspaces/integration/build-debug/lib\"",
"  CMAKE_POSITION_INDEPENDENT_CODE=\"ON\"",
"  CMAKE_RUNTIME_OUTPUT_DIRECTORY=\"/workspaces/integration/build-debug/bin\"",
"",
"-- The C compiler identification is GNU 8.3.0",
"-- The CXX compiler identification is GNU 8.3.0",
"-- Detecting C compiler ABI info",
"-- Detecting C compiler ABI info - done",
"-- Check for working C compiler: /usr/bin/cc - skipped",
"-- Detecting C compile features",
"-- Detecting C compile features - done",
"-- Detecting CXX compiler ABI info",
"-- Detecting CXX compiler ABI info - done",
"-- Check for working CXX compiler: /usr/bin/c++ - skipped",
"-- Detecting CXX compile features",
"-- Detecting CXX compile features - done",
"-- Found PkgConfig: /usr/bin/pkg-config (found version \"0.29\") ",
"-- Checking for module 'nanomsg'",
"--   Found nanomsg, version 1.1.5",
"-- Performing Test CMAKE_HAVE_LIBC_PTHREAD",
"-- Performing Test CMAKE_HAVE_LIBC_PTHREAD - Failed",
"-- Looking for pthread_create in pthreads",
"-- Looking for pthread_create in pthreads - not found",
"-- Looking for pthread_create in pthread",
"-- Looking for pthread_create in pthread - found",
"-- Found Threads: TRUE  ",
"-- Configuring done",
"-- Generating done",
"-- Build files have been written to: /workspaces/integration/build-debug",
"cmake --build --preset debug",
"[1/2] Building CXX object CMakeFiles/fpga-router.dir/Main.cpp.o",
"[2/2] Linking CXX executable bin/fpga-router",
"TESTSUITE_ALLOW_ROOT=ON BUILD_TYPE=debug python3 -m pytest -vs test",
"============================= test session starts ==============================",
"platform linux -- Python 3.7.3, pytest-7.4.4, pluggy-1.2.0 -- /usr/bin/python3",
"cachedir: .pytest_cache",
"yandex-taxi-testsuite: version 0.2.22",
"testsuite env: new, dir: /tmp/.yasuite-root",
"rootdir: /workspaces/integration/test",
"configfile: pytest.ini",
"plugins: asyncio-0.21.2, aiohttp-1.0.5",
"asyncio: mode=auto",
"collecting ... collected 1 item",
""];

const pytestIni = CODE`\
[pytest]
asyncio_mode = auto
log_level = debug
mockserver-tracing-enabled = true`;

export default makeScene2D(function* (view) {
    const root = createFile("");

    const main_cpp = createFile("Main.cpp");

    root().add(main_cpp());

    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    const filebar = createRef<MyRect>();

    yield* all(
        vscode().showFilebar(filebar, root, 0),
        code().code(mainCppCode4, 0),
        root().highlight(main_cpp(), 0),
    );

    yield* beginSlide("CMake");

    const cmake_lists = createFile("CMakeLists.txt");

    yield* all(
        root().addFile(cmake_lists),
        code().code(cmakeRoot, animationTime)
    );

    yield* beginSlide("PkgConfig");

    yield* code().selection(lines(6), animationTime);
    yield* waitFor(1);
    yield* code().selection(lines(7), animationTime);

    yield* beginSlide("Threads");

    yield* code().selection(lines(9), animationTime);

    yield* beginSlide("inc dirs");

    yield* code().selection(lines(11, 12), animationTime);

    yield* beginSlide("link libs");

    yield* code().selection(lines(13, 15), animationTime);

    yield* beginSlide("Добавляем остальные файлы");

    const cmake_presets = createFile("CMakePresets.json");

    yield* all(
        root().addFile(cmake_presets),
        code().code(cmakePresetsCode, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("Пресеты");

    yield* code().selection(lines(8, 16), animationTime);

    yield* beginSlide("Conftest");

    const test = createFile("test");
    yield* root().addFile(test);

    const conftest = createFile("conftest.py");
    yield* all(
        test().addFile(conftest),
        code().code(pythonCode1, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("Pytohn2");

    yield* code().code(pythonCode2, animationTime);

    yield* beginSlide("Scope");

    yield* code().selection(lines(2), animationTime);
    
    yield* beginSlide("Name");

    yield* code().selection(lines(3), animationTime);

    yield* beginSlide("Repo dir");
    
    yield* code().selection(lines(4), animationTime);

    yield* beginSlide("Pytohn3");

    yield* all(
        code().code(pythonCode3, animationTime),
        code().selection(lines(6, 8), animationTime)
    );

    yield* beginSlide("Scope Again");

    yield* code().selection(lines(6), animationTime);

    yield* beginSlide("name");

    yield* code().selection(word(7, 4, 20), animationTime);

    yield* beginSlide("sour dir fixture");

    yield* code().selection(word(7, 25, 21), animationTime);

    yield* beginSlide("build dir");

    yield* code().selection(lines(8), animationTime);

    yield* beginSlide("Pytohn4");

    yield* all(
        code().code(pythonCode4, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("Pytohn5");

    yield* all(
        code().code(pythonCode5, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("Pytohn6");

    yield* all(
        code().code(pythonCode6, animationTime),
        code().selection(lines(10), animationTime)
    );

    yield* beginSlide("crds");
    yield* code().selection(lines(11), animationTime);

    yield* beginSlide("exe");
    yield* code().selection(lines(12), animationTime);

    yield* beginSlide("scope");
    yield* code().selection(lines(14, 18), animationTime);

    yield* beginSlide("fpga_router");
    yield* code().selection(lines(19, 25), animationTime);

    yield* beginSlide("Pytohn7");

    yield* all(
        code().code(pythonCode7, animationTime),
        code().selection(lines(12, 25), animationTime)
    );

    yield* beginSlide("name mocks");
    yield* code().selection(lines(13), animationTime);

    yield* beginSlide("timeout ms");
    yield* code().selection(lines(14), animationTime);

    yield* beginSlide("xlnx socket");
    yield* code().selection(lines(16, 18), animationTime);

    yield* beginSlide("interrogator socket");
    yield* code().selection(lines(19, 23), animationTime);

    yield* beginSlide("return");
    yield* code().selection(lines(25), animationTime);

    yield* beginSlide("init_py");

    const init_py = createFile("__init__.py");

    yield* all(
        test().addFile(init_py),
        code().code("", animationTime)
    );

    yield* beginSlide("pytest init");

    const pytest_init = createFile("pytest.ini");

    yield* all(
        test().addFile(pytest_init),
        code().code(pytestIni, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("test_rli_stream.py");

    const test_rli_stream_py = createFile("test_rli_stream.py");

    yield* all(
        test().addFile(test_rli_stream_py),
        code().code(testRli, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("fn_name");
    yield* code().selection(lines(0), animationTime);

    yield* beginSlide("xlnx interrogator");
    yield* code().selection(lines(1), animationTime);

    yield* beginSlide("msg");
    yield* code().selection(lines(3), animationTime);

    yield* beginSlide("xlnxnx");
    yield* code().selection(lines(5), animationTime);

    yield* beginSlide("inter");
    yield* code().selection(lines(6), animationTime);

    yield* beginSlide("Makefile");

    const makefile = createFile("Makefile");

    yield* all(
        root().addFile(makefile),
        code().code(makefileCode, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("naekqweqwe");
    yield* code().selection(lines(10, 12), animationTime);

    yield* beginSlide("itall");
    yield* code().selection(lines(12), animationTime);

    yield* beginSlide("Открываем консоль");

    const console = createRef<Console>();
    yield* vscode().showConsole(console);
    yield* console().terminal().prompt();
    yield* console().terminal().type("make integration-test-debug");

    yield* all(
        root().highlight(test_rli_stream_py()),
        code().code(testRli, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("Запускаем интеграционный тест");

    const build_debug_ = createFile("build-debug");
    yield* root().addFile(build_debug_);
    
    const bin = createFile("bin");
    yield* build_debug_().addFile(bin);

    const fpga_router = createFile("fpga-router");
    yield* bin().addFile(fpga_router);

    yield* console().terminal().output(output, "", animationTime, false);
    yield* console().terminal().newline();
    console().terminal().fixSize();
    yield* console().terminal().line("test/test_rli_stream.py::test_send_receive PASSED", colorGreen);
    console().terminal().fixSize();
    yield* console().terminal().newline();
    console().terminal().fixSize();
    yield* console().terminal().line("", colorGreen);
    console().terminal().fixSize();
    yield* console().terminal().newline();
    console().terminal().fixSize();
    yield* console().terminal().line("======================== 1 passed in 1.11s ========================", colorGreen);
    console().terminal().fixSize();

    yield* beginSlide("Конец");
});
