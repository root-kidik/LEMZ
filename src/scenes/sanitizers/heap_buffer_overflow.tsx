import { CODE, lines, makeScene2D, word } from "@motion-canvas/2d";
import { Vscode } from "../../components/Vscode";
import { all, AudioManager, beginSlide, createRef, DEFAULT } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { MyRect } from "../../components/My/MyRect";
import { Console } from "../../components/Console";
import { animationTime, colorBlue, colorRed } from "../../theme/Theme";

const asanHeapBufferOverflow = CODE`\
#include <vector>
#include <iostream>

int main()
{
    std::vector<int> nums{1, 2, 3};

    int sum = 0; 
    for (int i = 0; i <= nums.size(); i++)
        sum += nums[i];

    std::cout << sum << '\\n';
}`;

const asanHeapBufferOverflowOutput = [
"    #0 0x5745f2f8d637 in main /home/user/Main.cpp:10",
"    #1 0x72b1e682a1c9 in __libc_start_call_main",
"    #2 0x72b1e682a28a in __libc_start_main_impl",
"    #3 0x5745f2f8d324 in _start (/home/user/a.out+0x2324)"];

const glibcxxDebugOutput = [
"    std::debug::vector<_Tp, _Allocator>::reference std::debug::vector<_Tp, ",
"    _Allocator>::operator[](size_type) [with _Tp = int; _Allocator = ",
"Error: attempt to subscript container with out-of-bounds index 3, but ",
"container only holds 3 elements.",
"[1]    17034 IOT instruction (core dumped)  ./a.out",
];

export default makeScene2D(function* (view) {
    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    yield* beginSlide("Asan Heap Buffer Overflow");

    yield* code().code(asanHeapBufferOverflow, animationTime);

    yield* beginSlide("Открываем консоль");

    const console = createRef<Console>();
    yield* vscode().showConsole(console);
    yield* console().terminal().prompt();

    yield* console().terminal().type("g++ Main.cpp");
    yield* console().terminal().prompt();
    yield* console().terminal().type("./a.out");
    yield* console().terminal().output(["6"]);

    yield* beginSlide("Ещё разок");

    yield* console().terminal().type("./a.out");
    yield* console().terminal().output(["[1]    161418 segmentation fault (core dumped)  ./a.out"]);

    yield* beginSlide("Подсвечиваем багулю");

    yield* code().selection(word(8, 21, 4), animationTime);

    yield* beginSlide("Собираем с asan");

    yield* code().selection(DEFAULT, animationTime);
    yield* console().terminal().clear();
    yield* console().terminal().type("g++ Main.cpp -fsanitize=address -g -fno-omit-frame-pointer");

    yield* beginSlide("Запуск с asan");

    yield* console().terminal().prompt();
    yield* console().terminal().type("./a.out");
    yield* console().terminal().newline();
    yield* console().terminal().line("==169969==ERROR: AddressSanitizer: heap-buffer-overflow", colorRed);
    yield* console().terminal().newline();
    yield* console().terminal().line("READ of size 4 at 0x50200000001c thread T0", colorBlue);
    yield* console().terminal().output(asanHeapBufferOverflowOutput);
    yield* code().selection(lines(9), animationTime);

    yield* beginSlide("Cборка с -D_GLIBCXX_ASSERTIONS");
    yield* console().terminal().clear();
    yield* console().terminal().type("g++ Main.cpp -D_GLIBCXX_ASSERTIONS");

    yield* beginSlide("Запуск с -D_GLIBCXX_ASSERTIONS");
    yield* console().terminal().prompt();
    yield* console().terminal().type("./a.out");
    yield* console().terminal().output(["std::vector<_Tp, _Alloc>::reference std::vector<_Tp, _Alloc>::operator[]", "Assertion '__n < this->size()' failed.", "[1]    15358 IOT instruction (core dumped)  ./a.out"]);

    yield* beginSlide("Cборка с -D_GLIBCXX_DEBUG");
    yield* console().terminal().clear();
    yield* console().terminal().type("g++ Main.cpp -D_GLIBCXX_DEBUG");

    yield* beginSlide("Запуск с -D_GLIBCXX_DEBUG");
    yield* console().terminal().prompt();
    yield* console().terminal().type("./a.out");
    yield* console().terminal().output(glibcxxDebugOutput);

    yield* beginSlide("Конец");
});
