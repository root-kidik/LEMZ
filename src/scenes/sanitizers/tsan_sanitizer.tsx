import { CODE, lines, makeScene2D, word } from "@motion-canvas/2d";
import { Vscode } from "../../components/Vscode";
import { all, AudioManager, beginSlide, createRef, DEFAULT, Direction, slideTransition } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { MyRect } from "../../components/My/MyRect";
import { Console } from "../../components/Console";
import { animationTime, colorBlue, colorRed, colorWhite } from "../../theme/Theme";

const cppCode = CODE`\
std::vector<std::string> logs;
std::atomic<bool> is_running = true;
std::mutex mutex;

std::thread logs_scraper{[&is_running, &logs, &mutex](){ 
    while (is_running) {
        std::this_thread::sleep_for(std::chrono::seconds{1});
        if (logs.empty()) continue;
        { std::lock_guard lock{mutex}; logs.clear(); }
    }}};

std::thread logs_producer{[&is_running, &logs, &mutex](){ 
    while (is_running) {
        std::this_thread::sleep_for(std::chrono::seconds{1});
        { std::lock_guard lock{mutex}; logs.emplace_back("Log"); }
    }}};

std::this_thread::sleep_for(std::chrono::seconds{5});
is_running = false; logs_scraper.join(); logs_producer.join();`;

const errorMapping = ["FATAL: ThreadSanitizer: unexpected memory mapping 0x62dd0990d000-0x62dd0990f000"];

const output = [
"  Write of size 8 at 0x7ffd767a63b8 by thread T2 (mutexes: write M0):",
"    #0 void std::vector<...>::_M_realloc_insert<...> >",
"    #2 operator() /home/user/test/Main.cpp:31",
"  Previous read of size 8 at 0x7ffd767a63b8 by thread T1:",
"    #1 std::vector<...>::end() const ...",
"    #2 std::vector<...>::empty() const ...",
"    #3 operator() /home/user/test/Main.cpp:19",
];

export default makeScene2D(function* (view) {
    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    code().fontSize(24);

    yield* slideTransition(Direction.Right);
    
    yield* code().code(cppCode, animationTime);

    yield* beginSlide("Открываем консоль");

    const console = createRef<Console>();
    yield* vscode().showConsole(console);
    yield* console().terminal().prompt();

    yield* beginSlide("Смотрим вывод");

    yield* console().terminal().type("g++ Main.cpp -fsanitize=thread -g -fno-omit-frame-pointer");
    yield* console().terminal().prompt();
    yield* console().terminal().type("./a.out");
    yield* console().terminal().output(errorMapping);

    yield* beginSlide("Выставляем флаг rnd_bits");

    yield* console().terminal().type("sudo sysctl vm.mmap_rnd_bits=28");
    yield* console().terminal().prompt();

    yield* beginSlide("Дубль 2");

    yield* console().terminal().type("./a.out");
    yield* console().terminal().newline();
    yield* console().terminal().line("WARNING: ThreadSanitizer: data race (pid=330588)", colorRed);
    yield* console().terminal().output(output);

    yield* beginSlide("Первое место баги");

    yield* code().selection(lines(14), animationTime);

    yield* beginSlide("Второе место баги");

    yield* code().selection(lines(7), animationTime);

    yield* beginSlide("Конец");
});
