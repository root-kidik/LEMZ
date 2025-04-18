import { CODE, lines, makeScene2D } from '@motion-canvas/2d';
import { Vscode } from '../../../../components/Vscode';
import { all, beginSlide, createRef, Direction, slideTransition } from '@motion-canvas/core';
import { MyCode } from '../../../../components/My/MyCode';
import { animationTime, fontSizeSmall } from '../../../../theme/Theme';
import { MyRect } from '../../../../components/My/MyRect';

const cppCodeOriginal = CODE`\
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
using namespace std::chrono;

template <typename Func, typename Arg>
nanoseconds mt(
    Func func, Arg arg, int iterations)
{
    nanoseconds total{0};

    for (int i = 0; i < iterations; i++)
    {
        auto start = high_resolution_clock::now();
        
        auto dummy += func(arg);
        asm volatile(" " : "+r"(dummy) : : "memory");

        auto end = high_resolution_clock::now();
        total += end - start;
    }

    return nanoseconds{total.count() / iterations};
}

int main()
{
    const int iterations = 1'000;
    const int n = 1'000'000;

    std::println(mt(computeLoop, n, iterations));

    std::println(mt(computeFormula, n, iterations));
}`;

export default makeScene2D(function* (view) {
    const cppCode = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={cppCode} disable_filebar={true} />
    );

    const bechmarkCodeLayout = createRef<MyRect>();
    const bechmarkCode = createRef<MyCode>();

    yield* vscode().add(
        <MyRect ref={bechmarkCodeLayout} width={"100%"} >
            <MyCode ref={bechmarkCode} />
        </MyRect>
    );

    yield* slideTransition(Direction.Right);

    yield* all(
        cppCode().fontSize(fontSizeSmall, 0),
        bechmarkCode().fontSize(fontSizeSmall, 0),
        bechmarkCode().code(bechmarkCodeCpp, animationTime),
        cppCode().code(cppCodeOriginal, animationTime)
    );

    yield* beginSlide("compute Functions");

    yield* all(
        bechmarkCode().selection(lines(1), animationTime)
    );

    yield* beginSlide("Main");

    yield* all(
        cppCode().selection(lines(15), animationTime),
        bechmarkCode().selection(lines(22, 30), animationTime)
    );

    yield* beginSlide("MeasureTime");

    yield* all(
        bechmarkCode().selection(lines(2, 20), animationTime)
    );

    yield* beginSlide("Конец");
});
