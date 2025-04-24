import { CODE, lines, makeScene2D, word } from "@motion-canvas/2d";
import { Vscode } from "../../components/Vscode";
import { all, AudioManager, beginSlide, createRef, DEFAULT, Direction, slideTransition } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { MyRect } from "../../components/My/MyRect";
import { Console } from "../../components/Console";
import { animationTime, colorBlue, colorRed, colorWhite } from "../../theme/Theme";

const uninitCode = CODE`\
enum class LogLevel
{
    Debug,
    Warn,
    Error
};

class Logger
{
public:
    void SetLogLevel(LogLevel level = LogLevel::Warn) { m_level = level; }

    void Debug(std::string_view message) { if (m_level >= LogLevel::Debug) std::cout << "Debug: " << message << '\\n'; }
    void Warn(std::string_view message) { if (m_level >= LogLevel::Warn) std::cout << "Warn: " << message << '\\n'; }
    void Error(std::string_view message) { if (m_level >= LogLevel::Error) std::cout << "Error: " << message << '\\n'; }
private:
    LogLevel m_level;
};

int main() { Logger logger; logger.Error("Something Went Wrong!"); }`;

const msanO = [
"    #0 0x56b713b1d4a2 in Logger::Error(std::string_view) /home/user/test/Main.cpp:32:13",
"    #1 0x56b713b1d33a in main /home/rtkid/Documents/test/Main.cpp:43:12",
"    #2 0x77514302a1c9 in __libc_start_call_main csu/../sysdeps/nptl/libc_start_call_main.h:58:16",
"    #3 0x77514302a28a in __libc_start_main csu/../csu/libc-start.c:360:3",
"    #4 0x56b713a83344 in _start (/home/rtkid/Documents/test/a.out+0x32344)",
];

export default makeScene2D(function* (view) {
    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    code().fontSize(22);

    yield* slideTransition(Direction.Right);
    
    yield* code().code(uninitCode, animationTime);

    yield* beginSlide("Открываем консоль");

    const console = createRef<Console>();
    yield* vscode().showConsole(console);
    yield* console().terminal().prompt();

    yield* beginSlide("Смотрим вывод");

    yield* console().terminal().type("g++ Main.cpp");
    yield* console().terminal().prompt();
    yield* console().terminal().type("./a.out");
    yield* console().terminal().output([""]);

    yield* beginSlide("Санитайзеры");

    yield* console().terminal().type("clang++ Main.cpp -fsanitize=memory -g -fno-omit-frame-pointer");
    
    yield* beginSlide("Запускаем Санитайзеры");
    
    yield* console().terminal().prompt();
    yield* console().terminal().type("./a.out");
    yield* console().terminal().newline();
    yield* console().terminal().line("    ==304226==WARNING: MemorySanitizer: use-of-uninitialized-value", colorRed);
    yield* console().terminal().output(msanO);

    yield* beginSlide("Запускаем");

    yield* beginSlide("Конец");
});
