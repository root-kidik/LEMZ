import { CODE, lines, makeScene2D, word } from '@motion-canvas/2d';
import { Vscode } from '../../components/Vscode';
import { all, createRef, DEFAULT, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { MyCode } from '../../components/My/MyCode';
import { animationTime } from '../../theme/Theme';
import { MyRect } from '../../components/My/MyRect';

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

    yield* slideTransition(Direction.Right);

    // голый цикл

    yield* cppCode().code(cppCodeOriginal, animationTime);

    yield* waitFor(1);

    const asmLayout = createRef<MyRect>();
    const asmCode = createRef<MyCode>();

    yield* vscode().add(
        <MyRect ref={asmLayout} width={0} >
            <MyCode ref={asmCode} />
        </MyRect>
    );

    // простая функция

    yield* all(
        asmLayout().width("100%", animationTime),
        asmCode().code(asmCodeNotOptimized, animationTime)
    );

    yield* waitFor(1);

    yield* all(
        cppCode().selection(lines(1), animationTime),
        asmCode().selection(lines(1, 2), animationTime)
    );

    yield* waitFor(1);

    yield* all(
        cppCode().selection(word(0, 12, 5), animationTime),
        asmCode().selection(lines(3), animationTime)
    );

    yield* waitFor(1);

    cppCode().save();
    yield* all(
        cppCode().code(cppCodeOriginalIntN, animationTime),
        cppCode().selection(lines(2), animationTime)
    );
    yield* waitFor(1);

    yield* cppCode().restore(animationTime);

    yield* waitFor(1);

    yield* all(
        cppCode().selection(lines(2), animationTime),
        asmCode().selection(lines(4), animationTime)
    );

    yield* waitFor(1);

    yield* all(
        cppCode().selection(word(3, 9, 9), animationTime),
        asmCode().selection(lines(5), animationTime)
    );

    yield* waitFor(1);

    // int i = 0;

    cppCode().save();
    yield* all(
        cppCode().code(cppCodeOriginalIntI, animationTime),
        cppCode().selection(lines(3), animationTime)
    );
    yield* waitFor(1);

    yield* cppCode().restore(animationTime);

    yield* waitFor(1);

    // начинаем цикл

    yield* all(
        cppCode().selection(lines(3, 4), animationTime),
        asmCode().selection(lines(6), animationTime)
    );

    yield* waitFor(1);

    // загрузка счётчика

    yield* all(
        cppCode().selection(word(3, 13, 5), animationTime),
        asmCode().selection(lines(7), animationTime)
    );

    yield* waitFor(1);

    // сравнение счётчика с n

    yield* all(
        cppCode().selection(word(3, 20, 5), animationTime),
        asmCode().selection(lines(8), animationTime)
    );

    yield* waitFor(1);

    // прыжок в return

    yield* all(
        cppCode().selection(word(3, 20, 5), animationTime),
        asmCode().selection(lines(9), animationTime)
    );

    yield* waitFor(1);

    // загрузка счётчика 2

    yield* all(
        cppCode().selection(word(3, 13, 5), animationTime),
        asmCode().selection(lines(10), animationTime)
    );

    yield* waitFor(1);

    // сдвиг на 0

    yield* all(
        asmCode().selection(lines(11), animationTime)
    );

    yield* waitFor(1);

    // добавляем 6

    yield* all(
        cppCode().selection(word(4, 23, 5), animationTime),
        asmCode().selection(lines(12), animationTime)
    );

    yield* waitFor(1);

    // добавляем n

    yield* all(
        cppCode().selection(word(4, 29, 3), animationTime),
        asmCode().selection(lines(13), animationTime)
    );

    yield* waitFor(1);

    // вычитаем 40

    yield* all(
        cppCode().selection(word(4, 35, 6), animationTime),
        asmCode().selection(lines(14), animationTime)
    );

    yield* waitFor(1);

    // прибавляем в sum

    yield* all(
        cppCode().selection(word(4, 12, 2), animationTime),
        asmCode().selection(lines(15), animationTime)
    );

    yield* waitFor(1);

    // записываем в sum

    yield* all(
        cppCode().selection(word(4, 12, 2), animationTime),
        asmCode().selection(lines(16), animationTime)
    );

    yield* waitFor(1);

    // загружаем в eax - i и прибавляем + 1

    yield* all(
        cppCode().selection(word(3, 27, 3), animationTime),
        asmCode().selection(lines(17, 18), animationTime)
    );

    yield* waitFor(1);

    // загружаем в eax - в i, и прыжок на начало цикла

    yield* all(
        asmCode().selection(lines(19, 20), animationTime)
    );

    yield* waitFor(1);

    // загружаем sum в eax и return

    yield* all(
        asmCode().selection(lines(22, 24), animationTime)
    );

    yield* waitFor(1);

    // сбрасываем подсветку

    yield* all(
        cppCode().selection(DEFAULT, animationTime),
        asmCode().selection(DEFAULT, animationTime)
    );

    yield* waitFor(1);

    // оптимизированный asm код

    yield* all(
        asmCode().code(asmCodeOptimized, animationTime)
    );

    yield* waitFor(1);

    // проверка на ноль

    yield* all(
        cppCode().selection(word(3, 20, 5), animationTime),
        asmCode().selection(lines(1, 2), animationTime)
    );

    yield* waitFor(1);

    // всё остальное

    yield* all(
        cppCode().selection(lines(4), animationTime),
        asmCode().selection(lines(3, 12), animationTime)
    );

    yield* waitFor(1);

    // сбрасываем подсветку

    yield* all(
        cppCode().selection(DEFAULT, animationTime),
        asmCode().selection(DEFAULT, animationTime)
    );

    yield* waitFor(1);

    // показываю оба asm

    yield* all(
        cppCode().code(asmCodeOptimized, animationTime)
    );

    yield* waitFor(1);
});
