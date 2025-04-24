import { CODE, lines, makeScene2D, word } from "@motion-canvas/2d";
import { Vscode } from "../../components/Vscode";
import { all, AudioManager, beginSlide, createRef, DEFAULT, Direction, slideTransition } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { MyRect } from "../../components/My/MyRect";
import { Console } from "../../components/Console";
import { animationTime, colorBlue, colorRed } from "../../theme/Theme";

const memoryLeak =CODE`\
m_thread = std::thread{[this, url = std::move(url)]() 
{
    m_is_running = true;

    auto socket = nn_socket(AF_SP, NN_SUB); 
    assert(socket >= 0 && "socket creation failed");

    auto connect_result = nn_connect(socket, url.c_str());
    assert(connect_result >= 0 && "socket connecting failed");

    auto setsockopt_subscribe_result = nn_setsockopt(socket, NN_SUB, NN_SUB_SUBSCRIBE, "", 0);
    assert(setsockopt_subscribe_result >= 0 && "socket setting option subscribing failed");

    int  timeout           = 100;
    auto setsockopt_result = nn_setsockopt(socket, NN_SOL_SOCKET, 
        NN_RCVTIMEO, &timeout, sizeof(timeout));
    assert(setsockopt_result >= 0 && "socket setting option failed");

    while (m_is_running)
    {
        void* data = nullptr;
        auto  len  = nn_recv(socket, &data, NN_MSG, 0);
    
        {
            std::lock_guard lock{m_mutex};
            for (auto& consumer : m_consumers)
                consumer.get().OnData(data, len);
        }
    }

    auto close_result = nn_close(socket);
    assert(close_result >= 0 && "socket closing failed");
};`;

const memoryLeakSmall = CODE`\
m_thread = std::thread{[this, url = std::move(url)]() 
{
    // ...

    while (m_is_running)
    {
        void* data = nullptr;
        auto  len  = nn_recv(socket, &data, NN_MSG, 0);
    
        {
            std::lock_guard lock{m_mutex};
            for (auto& consumer : m_consumers)
                consumer.get().OnData(data, len);
        }
    }

    auto close_result = nn_close(socket);
    assert(close_result >= 0 && "socket closing failed");
};`;

const memoryLeakOutput = [
"",
"Direct leak of 369 byte(s) in 9 object(s) allocated from:",
"    #0 0x74785a144be8 in __interceptor_malloc (/lib/x86_64-linux-gnu/liblsan.so.0+0xebe8)",
"    #1 0x74785a0e7d5c in nn_chunk_alloc (/lib/x86_64-linux-gnu/libnanomsg.so.5+0x16d5c)",
"",
"SUMMARY: LeakSanitizer: 369 byte(s) leaked in 9 allocation(s)."
];

const memoryLeakOutputWithRealWithDebug = [
"",
"Direct leak of 369 byte(s) in 9 object(s) allocated from:",
"    #0 0x765a47ed4be8 in __interceptor_malloc (/lib/x86_64-linux-gnu/liblsan.so.0+0xebe8)",
"    #1 0x765a47e7980c in nn_chunk_alloc /workspaces/fpga-router/nanomsg/src/utils/chunk.c:75",
"",
"SUMMARY: LeakSanitizer: 369 byte(s) leaked in 9 allocation(s)."
];

const memoryLeakOutputDebug = [
"",
"Direct leak of 369 byte(s) in 9 object(s) allocated from:",
"    #0 0x72da38cd7be8 in __interceptor_malloc (/lib/x86_64-linux-gnu/liblsan.so.0+0xebe8)",
"    // ...",
"    #5 0x72da38c63786 in nn_recv /workspaces/fpga-router/nanomsg/src/core/global.c:711",
"    #6 0x47b9d3 in operator() /workspaces/fpga-router/src/infrastructure/client/NanomsgConsumerClient.cpp:35",
"    #7 0x47bf3e in __invoke_impl /usr/include/c++/8/bits/invoke.h:60",
"    #8 0x47bcd1 in __invoke<NanomsgConsumerClient(std::__cxx11::string)::<lambda()> > /.../invoke.h:95",
"    #9 0x47c16f in _M_invoke<0> /usr/include/c++/8/thread:244",
"",
"SUMMARY: LeakSanitizer: 369 byte(s) leaked in 9 allocation(s)."
];

const nnCfgO = [
"The C compiler identification is GNU 8.3.0",
"Detecting C compiler ABI info",
"Detecting C compiler ABI info - done",
"Check for working C compiler: /usr/bin/cc - skipped",
"Detecting C compile features",
"Detecting C compile features - done",
"Detected nanomsg ABI v5 (v5.1.0)",
"Looking for pthread.h",
"Looking for pthread.h - found",
"Performing Test CMAKE_HAVE_LIBC_PTHREAD",
"Performing Test CMAKE_HAVE_LIBC_PTHREAD - Failed",
"Looking for pthread_create in pthreads",
"Looking for pthread_create in pthreads - not found",
"Looking for pthread_create in pthread",
"Looking for pthread_create in pthread - found",
"Found Threads: TRUE  ",
"OS System is Linux",
"OS Version is 6.11.0-21-generic",
"Looking for gethrtime",
"Looking for gethrtime - not found",
"Looking for socketpair",
"Looking for socketpair - found",
"Looking for eventfd",
"Looking for eventfd - found",
"Looking for pipe",
"Looking for pipe - found",
"Looking for pipe2",
"Looking for pipe2 - found",
"Looking for accept4",
"Looking for accept4 - found",
"Looking for epoll_create",
"Looking for epoll_create - found",
"Looking for kqueue",
"Looking for kqueue - not found",
"Looking for poll",
"Looking for poll - found",
"Looking for getaddrinfo_a in anl",
"Looking for getaddrinfo_a in anl - found",
"Looking for clock_gettime in rt",
"Looking for clock_gettime in rt - found",
"Looking for sem_wait in rt",
"Looking for sem_wait in rt - not found",
"Looking for sem_wait in pthread",
"Looking for sem_wait in pthread - found",
"Looking for gethostbyname in nsl",
"Looking for gethostbyname in nsl - found",
"Looking for socket in socket",
"Looking for socket in socket - not found",
"Looking for CLOCK_MONOTONIC",
"Looking for CLOCK_MONOTONIC - found",
"Looking for atomic_cas_32",
"Looking for atomic_cas_32 - not found",
"Looking for AF_UNIX",
"Looking for AF_UNIX - found",
"Looking for backtrace_symbols_fd",
"Looking for backtrace_symbols_fd - found",
"Performing Test NN_HAVE_MSG_CONTROL",
"Performing Test NN_HAVE_MSG_CONTROL - Success",
"Performing Test NN_HAVE_GCC_ATOMIC_BUILTINS",
"Configuring done",
"Generating done",
"Build files have been written to: /workspaces/fpga-router/nanomsg/build",
];

const nnInstallO = [
"Install configuration: \"RelWithDebInfo\"",
"Up-to-date: /usr/include/nanomsg/nn.h",
"Up-to-date: /usr/include/nanomsg/inproc.h",
"Up-to-date: /usr/include/nanomsg/ipc.h",
"Up-to-date: /usr/include/nanomsg/tcp.h",
"Up-to-date: /usr/include/nanomsg/ws.h",
"Up-to-date: /usr/include/nanomsg/pair.h",
"Up-to-date: /usr/include/nanomsg/pubsub.h",
"Up-to-date: /usr/include/nanomsg/reqrep.h",
"Up-to-date: /usr/include/nanomsg/pipeline.h",
"Up-to-date: /usr/include/nanomsg/survey.h",
"Up-to-date: /usr/include/nanomsg/bus.h",
"Installing: /usr/bin/nanocat",
"Set runtime path of \"/usr/bin/nanocat\" to \"/usr/lib/x86_64-linux-gnu\"",
"Installing: /usr/lib/x86_64-linux-gnu/pkgconfig/nanomsg.pc",
"Installing: /usr/lib/x86_64-linux-gnu/libnanomsg.so.5.1.0",
"Up-to-date: /usr/lib/x86_64-linux-gnu/libnanomsg.so.5",
"Set runtime path of \"/usr/lib/x86_64-linux-gnu/libnanomsg.so.5.1.0\" to \"/usr/lib/x86_64-linux-gnu\"",
"Up-to-date: /usr/lib/x86_64-linux-gnu/libnanomsg.so",
"Installing: /usr/lib/x86_64-linux-gnu/cmake/nanomsg-1.1.5/nanomsg-target.cmake",
"Installing: /usr/lib/x86_64-linux-gnu/cmake/nanomsg-1.1.5/nanomsg-target-relwithdebinfo.cmake",
"Installing: /usr/lib/x86_64-linux-gnu/cmake/nanomsg-1.1.5/nanomsg-config.cmake",
"Installing: /usr/lib/x86_64-linux-gnu/cmake/nanomsg-1.1.5/nanomsg-config-version.cmake",
]

export default makeScene2D(function* (view) {
    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    code().fontSize(24);

    yield* slideTransition(Direction.Right);

    yield* code().code(memoryLeak, animationTime);

    yield* beginSlide("Уменьшаем код");

    yield* code().code(memoryLeakSmall, animationTime);

    yield* beginSlide("Открываем консоль");

    const console = createRef<Console>();
    yield* vscode().showConsole(console);
    yield* console().terminal().prompt();
    yield* console().terminal().type("g++ Main.cpp -fsanitize=leak -g -fno-omit-frame-pointer");

    yield* beginSlide("Запускаем");

    yield* console().terminal().prompt();
    yield* console().terminal().type("./a.out");
    yield* console().terminal().newline();
    yield* console().terminal().line("=================================================================", colorRed);
    yield* console().terminal().newline();
    yield* console().terminal().line("==5542==ERROR: LeakSanitizer: detected memory leaks", colorRed);
    yield* console().terminal().output(memoryLeakOutput);

    yield* beginSlide("Пересобираем nanomsg с RelWithDebInfo");

    yield* console().terminal().type("git clone https://github.com/nanomsg/nanomsg.git --branch 1.1.5");
    yield* console().terminal().prompt();
    yield* console().terminal().type("cd nanomsg");
    yield* console().terminal().prompt();

    yield* console().terminal().type("cmake -B build -G Ninja -S . -DCMAKE_BUILD_TYPE=RelWithDebInfo -DCMAKE_INSTALL_PREFIX=/usr");

    yield* beginSlide("NN build RelWiDebInfo");

    yield* console().terminal().output(nnCfgO, "-- ");
    yield* console().terminal().type("cmake --build build");

    yield* beginSlide("NN build output RelWiDebInfo");

    yield* console().terminal().output(["[199/199] Linking C executable local_thr"]);

    yield* console().terminal().type("cmake --install build");

    yield* beginSlide("NN install RelWiDebInfo");

    yield* console().terminal().output(nnInstallO, "-- ");

    yield* beginSlide("Запускаем Дубль 2");

    yield* console().terminal().type("cd ..");
    yield*  console().terminal().prompt();
    yield* console().terminal().type("g++ Main.cpp -fsanitize=leak -g -fno-omit-frame-pointer");
    yield*  console().terminal().prompt();
    yield* console().terminal().type("./a.out");
    yield* console().terminal().newline();
    yield* console().terminal().line("=================================================================", colorRed);
    yield* console().terminal().newline();
    yield* console().terminal().line("==5542==ERROR: LeakSanitizer: detected memory leaks", colorRed);
    yield* console().terminal().output(memoryLeakOutputWithRealWithDebug);

    yield* beginSlide("Пересобираем nanomsg в Debug");

    yield* console().terminal().type("cd ../nanomsg");
    yield* console().terminal().prompt();

    yield* console().terminal().type("rm -r build");
    yield* console().terminal().prompt();

    yield* console().terminal().type("cmake -B build -G Ninja -S . -DCMAKE_BUILD_TYPE=Debug -DCMAKE_INSTALL_PREFIX=/usr");

    yield* beginSlide("NN build Debug");

    yield* console().terminal().output(nnCfgO, "-- ");
    yield* console().terminal().type("cmake --build build");

    yield* beginSlide("NN build output Debug");

    yield* console().terminal().output(["[199/199] Linking C executable local_thr"]);

    yield* console().terminal().type("cmake --install build");

    yield* beginSlide("NN install Debug");

    yield* console().terminal().output(nnInstallO, "-- ");

    yield* beginSlide("Запускаем Дубль 3");

    yield* console().terminal().type("cd ..");
    yield*  console().terminal().prompt();
    yield* console().terminal().type("g++ Main.cpp -fsanitize=leak -g -fno-omit-frame-pointer");
    yield*  console().terminal().prompt();
    yield* console().terminal().type("./a.out");
    yield* console().terminal().newline();
    yield* console().terminal().line("=================================================================", colorRed);
    yield* console().terminal().newline();
    yield* console().terminal().line("==5542==ERROR: LeakSanitizer: detected memory leaks", colorRed);
    yield* console().terminal().output(memoryLeakOutputDebug);
    yield* code().selection(lines(7), animationTime);

    yield* beginSlide("Конец");
});