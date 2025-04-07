import { CODE, lines, makeScene2D } from '@motion-canvas/2d';
import { Vscode } from '../../../../components/Vscode';
import { all, createRef, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { MyCode } from '../../../../components/My/MyCode';
import { animationTime, fontSizeSmall } from '../../../../theme/Theme';
import { MyRect } from '../../../../components/My/MyRect';

const cppCodeOriginal = CODE`\
#include <chrono>
#include <functional>
#include <print>

int computeLoop(int n)
{
    int sum = 0;
    for (int i = 0; i < n; i++)
        sum += i * 1 + 2 * 3 + n - 4 * 10;
    return sum;
}

int computeFormula(int n)
{
    if (n <= 0) return 0;
    return (n * (n - 1)) / 2 + n * n - 34 * n;
}`;

const bechmarkCodeCpp = CODE`\
template <typename Func, typename Arg>
double measureTime(Func func, Arg arg, int iterations)
{
    std::chrono::nanoseconds total{0};

    for (int i = 0; i < iterations; i++)
    {
        auto start = std::chrono::high_resolution_clock::now();
        
        int dummy += func(arg);
        asm volatile("" : "+r"(dummy) : : "memory");

        auto end = std::chrono::high_resolution_clock::now();
        total += end - start;
    }

    return total.count() / iterations;
}

int main()
{
    const int iterations = 1'000;
    const int n = 1'000'000;

    std::println("loop: {}", 
        measureTime(computeLoop, n, iterations
    ));

    std::println("formula: {}", 
        measureTime(computeFormula, n, iterations
    ));
}`;

export default makeScene2D(function* (view) {
    const cppCode = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={cppCode} disable_filebar={true} />
    );

    yield* slideTransition(Direction.Right);

    yield* waitFor(1);

    const bechmarkCodeLayout = createRef<MyRect>();
    const bechmarkCode = createRef<MyCode>();

    yield* vscode().add(
        <MyRect ref={bechmarkCodeLayout} width={0} >
            <MyCode ref={bechmarkCode} />
        </MyRect>
    );

    yield* cppCode().fontSize(fontSizeSmall, 0);
    yield* bechmarkCode().fontSize(fontSizeSmall, 0);

    yield* all(
        bechmarkCodeLayout().width("100%", animationTime),
        bechmarkCode().code(bechmarkCodeCpp, animationTime),
        cppCode().code(cppCodeOriginal, animationTime)
    );

    yield* waitFor(1);

    // int main()

    yield* all(
        cppCode().selection(lines(3), animationTime),
        bechmarkCode().selection(lines(18, 31), animationTime)
    );

    yield* waitFor(1);

    // int main()

    yield* all(
        bechmarkCode().selection(lines(3, 16), animationTime)
    );

    yield* waitFor(1);
});
