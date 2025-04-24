import { CODE, lines, makeScene2D, word } from "@motion-canvas/2d";
import { Vscode } from "../../components/Vscode";
import { all, AudioManager, beginSlide, createRef, DEFAULT, Direction, slideTransition } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { MyRect } from "../../components/My/MyRect";
import { Console } from "../../components/Console";
import { animationTime, colorBlue, colorRed, colorWhite } from "../../theme/Theme";

const undefinedCode = CODE`\
#include <iostream>

auto create_printer(const std::string& prefix)
{
    return [&prefix](const std::string& message){
        std::cout << prefix << " " << message << "\\n"; 
    };
}

int main()
{
    auto cool_printer = create_printer("cool");
    cool_printer("pen");
}`;

const errorOutput = [
"#0 0x76b89cc7f05e in fwrite ../../../../src/libsanitizer/sanitizer_common/..inc:1110",
"#1 0x76b89c956dc3 in std::basic_ostream<char, std::char_traits<char> >",
"#2 0x60a4627ea4d3 in operator() /home/user/test/Main.cpp:6",
"#3 0x60a4627ea6f8 in main /home/user/test/Main.cpp:13",
];

export default makeScene2D(function* (view) {
    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    yield* slideTransition(Direction.Right);
    
    yield* code().code(undefinedCode, animationTime);

    yield* beginSlide("Открываем консоль");

    const console = createRef<Console>();
    yield* vscode().showConsole(console);
    yield* console().terminal().prompt();

    yield* beginSlide("Смотрим вывод");

    yield* console().terminal().type("g++ Main.cpp");
    yield* console().terminal().prompt();
    yield* console().terminal().type("./a.out");
    yield* console().terminal().output(["pen pen"]);

    yield* beginSlide("Санитайзеры");

    yield* console().terminal().type("g++ Main.cpp -fsanitize=undefined -g -fno-omit-frame-pointer");

    yield* beginSlide("Запускаем");

    yield* console().terminal().prompt();
    yield* console().terminal().type("./a.out");
    yield* console().terminal().newline();
    yield* console().terminal().line("==282089==ERROR: AddressSanitizer: stack-use-after-scope", colorRed);
    yield* console().terminal().newline();
    yield* console().terminal().line("READ of size 4 at 0x76b89a500070 thread T0", colorBlue);
    yield* console().terminal().output(errorOutput);

    yield* code().selection(lines(5), animationTime);

    yield* beginSlide("А в чём проблема?");

    yield* code().selection(word(4, 12, 7), animationTime);

    yield* beginSlide("Конец");
});
