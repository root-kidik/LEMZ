import { CODE, lines, makeScene2D, word } from "@motion-canvas/2d";
import { Vscode } from "../../components/Vscode";
import { all, AudioManager, beginSlide, createRef, DEFAULT, Direction, slideTransition } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { MyRect } from "../../components/My/MyRect";
import { Console } from "../../components/Console";
import { animationTime, colorBlue, colorRed, colorWhite } from "../../theme/Theme";

const undefinedCode = CODE`\
#include <iostream>

int main()
{
    int a = 1'000'000'000, b = 2'000'000'000;
    
    int sum = a + b;
    std::cout << sum << '\\n';

    int x = 0;
    
    std::cout << sum / x << '\\n';
}`;

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
    yield* console().terminal().type("g++ Main.cpp -fsanitize=undefined -g -fno-omit-frame-pointer");

    yield* beginSlide("Запускаем");

    yield* console().terminal().prompt();
    yield* console().terminal().type("./a.out");
    yield* console().terminal().newline();
    yield* console().terminal().line("Main.cpp:7:9: runtime error: signed integer overflow: 1..0 + 2..0 cannot be represented in type 'int'", colorRed);
    yield* console().terminal().newline();
    yield* console().terminal().line("-1294967296", colorWhite);
    yield* console().terminal().newline();
    yield* console().terminal().line("Main.cpp:13:22: runtime error: division by zero", colorRed);
    yield* console().terminal().output(["[1]    266782 floating point exception (core dumped)  ./a.out"]);

    yield* code().selection(lines(6), animationTime);

    yield* beginSlide("Второе место ошибки");

    yield* code().selection(lines(11), animationTime);

    yield* beginSlide("Конец");
});
