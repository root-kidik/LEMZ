import { CODE, lines, makeScene2D, word } from '@motion-canvas/2d';
import { Vscode } from '../../../../components/Vscode';
import { all, beginSlide, createRef, DEFAULT, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { MyCode } from '../../../../components/My/MyCode';
import { animationTime } from '../../../../theme/Theme';
import { MyRect } from '../../../../components/My/MyRect';

const cppCodeOriginal = CODE`\
int compute(int n)
{
    int sum = 0;
    for (int i = 0; i < n; i++)
        sum += i * 1 + 2 * 3 + n - 4 * 10;
    return sum;
}`;

const cppCodeNotOriginal = CODE`\
int compute(int n) 
{
    if (n <= 0) return 0;
    return (n * (n - 1)) / 2 + n * n - 34 * n;
}`;

const cppCodeOriginalIntN = CODE`\
int compute()
{
    int n = /* edi */;
    int sum = 0;
    for (int i = 0; i < n; i++)
        sum += i * 1 + 2 * 3 + n - 4 * 10;
    return sum;
}`;

const cppCodeOriginalIntI = CODE`\
int compute(int n)
{
    int sum = 0;
    int i = 0;
    for (; i < n; i++)
        sum += i * 1 + 2 * 3 + n - 4 * 10;
    return sum;
}`;

const asmCodeNotOptimized = CODE`\
compute(int):
        push    rbp
        mov     rbp, rsp
        mov     dword ptr [rbp - 4], edi
        mov     dword ptr [rbp - 8], 0
        mov     dword ptr [rbp - 12], 0
.LBB0_1:
        mov     eax, dword ptr [rbp - 12]
        cmp     eax, dword ptr [rbp - 4]
        jge     .LBB0_4
        mov     eax, dword ptr [rbp - 12]
        shl     eax, 0
        add     eax, 6
        add     eax, dword ptr [rbp - 4]
        sub     eax, 40
        add     eax, dword ptr [rbp - 8]
        mov     dword ptr [rbp - 8], eax
        mov     eax, dword ptr [rbp - 12]
        add     eax, 1
        mov     dword ptr [rbp - 12], eax
        jmp     .LBB0_1
.LBB0_4:
        mov     eax, dword ptr [rbp - 8]
        pop     rbp
        ret`;

const asmCodeOptimized = CODE`\
compute(int):
        test    edi, edi
        jle     .LBB0_1
        lea     eax, [rdi - 1]
        lea     ecx, [rdi - 33]
        imul    ecx, eax
        add     ecx, edi
        add     edi, -2
        imul    rdi, rax
        shr     rdi
        lea     eax, [rdi + rcx]
        add     eax, -34
        ret
.LBB0_1:
        xor     eax, eax
        ret`;

export default makeScene2D(function* (view) {
    const cppCode = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={cppCode} disable_filebar={true} />
    );

    yield* cppCode().code(cppCodeOriginal, 0);

    const asmLayout = createRef<MyRect>();
    const asmCode = createRef<MyCode>();

    yield* vscode().add(
        <MyRect ref={asmLayout} width={"100%"} >
            <MyCode code={asmCodeNotOptimized} ref={asmCode} />
        </MyRect>
    );

    yield* slideTransition(Direction.Right);

    yield* beginSlide("Пролог функции");

    yield* all(
        cppCode().selection(lines(1), animationTime),
        asmCode().selection(lines(1, 2), animationTime)
    );

    yield* beginSlide("Аргументы функции");

    yield* all(
        cppCode().selection(word(0, 12, 5), animationTime),
        asmCode().selection(lines(3), animationTime)
    );

    yield* beginSlide("Аргументы функции развернуто");

    cppCode().save();
    yield* all(
        cppCode().code(cppCodeOriginalIntN, animationTime),
        cppCode().selection(lines(2), animationTime)
    );

    yield* beginSlide("Аккумулятор Sum");

    yield* cppCode().restore(animationTime);

    yield* all(
        cppCode().selection(lines(2), animationTime),
        asmCode().selection(lines(4), animationTime)
    );

    yield* beginSlide("Аккумулятор цикла");

    yield* all(
        cppCode().selection(word(3, 9, 9), animationTime),
        asmCode().selection(lines(5), animationTime)
    );


    yield* beginSlide("Аккумулятор цикла развернуто");

    cppCode().save();
    yield* all(
        cppCode().code(cppCodeOriginalIntI, animationTime),
        cppCode().selection(lines(3), animationTime)
    );

    yield* beginSlide("Метка циклв");

    yield* cppCode().restore(animationTime);

    yield* all(
        cppCode().selection(lines(3, 4), animationTime),
        asmCode().selection(lines(6), animationTime)
    );

    yield* beginSlide("Загрузка счётчика");

    yield* all(
        cppCode().selection(word(3, 13, 5), animationTime),
        asmCode().selection(lines(7), animationTime)
    );

    yield* beginSlide("Сравнение счётчика с n");

    yield* all(
        cppCode().selection(word(3, 20, 5), animationTime),
        asmCode().selection(lines(8), animationTime)
    );

    yield* beginSlide("Прыжок в return");

    yield* all(
        cppCode().selection(word(3, 20, 5), animationTime),
        asmCode().selection(lines(9), animationTime)
    );

    yield* beginSlide("Повторная загрузка счётчика");

    yield* all(
        cppCode().selection(word(3, 13, 5), animationTime),
        asmCode().selection(lines(10), animationTime)
    );

    yield* beginSlide("Побитовый сдвиг на 0 бит");

    yield* all(
        asmCode().selection(lines(11), animationTime)
    );

    yield* beginSlide("Прибавление 6");

    yield* all(
        cppCode().selection(word(4, 23, 5), animationTime),
        asmCode().selection(lines(12), animationTime)
    );

    yield* beginSlide("Прибавление n");

    yield* all(
        cppCode().selection(word(4, 29, 3), animationTime),
        asmCode().selection(lines(13), animationTime)
    );

    yield* beginSlide("Вычитаем 40");

    yield* all(
        cppCode().selection(word(4, 33, 8), animationTime),
        asmCode().selection(lines(14), animationTime)
    );

    yield* beginSlide("Прибавляем sum");

    yield* all(
        cppCode().selection(word(4, 12, 2), animationTime),
        asmCode().selection(lines(15), animationTime)
    );

    yield* beginSlide("Записываем в sum");

    yield* all(
        cppCode().selection(word(4, 12, 2), animationTime),
        asmCode().selection(lines(16), animationTime)
    );

    yield* waitFor(1);

    yield* beginSlide("Загружаем в eax - i и прибавляем + 1");

    yield* all(
        cppCode().selection(word(3, 27, 3), animationTime),
        asmCode().selection(lines(17, 18), animationTime)
    );

    yield* beginSlide("Загружаем в eax - в i, и прыжок на начало цикла");

    yield* all(
        asmCode().selection(lines(19, 20), animationTime)
    );

    yield* beginSlide("Загружаем sum в eax и return");

    yield* all(
        asmCode().selection(lines(22, 24), animationTime)
    );

    yield* beginSlide("Сбрасываем подсветку");

    yield* all(
        cppCode().selection(DEFAULT, animationTime),
        asmCode().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("Оптимизированный asm код");

    yield* all(
        asmCode().code(asmCodeOptimized, animationTime)
    );

    yield* beginSlide("Проверка на ноль");

    yield* all(
        cppCode().selection(word(3, 20, 5), animationTime),
        asmCode().selection(lines(1, 2), animationTime)
    );

    yield* beginSlide("Всё остальное");

    yield* all(
        cppCode().selection(lines(4), animationTime),
        asmCode().selection(lines(3, 12), animationTime)
    );

    yield* beginSlide("Сбрасываем подсветку");

    yield* all(
        cppCode().selection(DEFAULT, animationTime),
        asmCode().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("Сравнение двух asm");

    yield* all(
        cppCode().code(asmCodeOptimized, animationTime)
    );

    yield* beginSlide("Конец");
});
