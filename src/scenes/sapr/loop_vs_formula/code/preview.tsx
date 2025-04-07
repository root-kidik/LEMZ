import { CODE, makeScene2D } from '@motion-canvas/2d';
import { Vscode } from '../../../../components/Vscode';
import { all, createRef, waitFor } from '@motion-canvas/core';
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

    yield* waitFor(1);

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
        asmCode().code(cppCodeNotOriginal, animationTime)
    );

    yield* waitFor(1);

    // сравнение дву asm

    cppCode().save();
    asmCode().save();
    yield* all(
        cppCode().code(asmCodeNotOptimized, animationTime),
        asmCode().code(asmCodeOptimized, animationTime)
    );

    yield* waitFor(1);
});
