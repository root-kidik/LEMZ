import { CODE, lines, makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, createRef, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { Vscode } from '../../../../components/Vscode';
import { MyCode } from '../../../../components/My/MyCode';
import { MyRect } from '../../../../components/My/MyRect';
import { animationTime, fontSizeSmall } from '../../../../theme/Theme';

const cppCodeOriginal = CODE`\
using namespace std::this_thread;
using namespace std::chrono_literals;

int sleepIf(int n)
{
    int sum = 0;
    for (int i = 0; i < n; i++)
        if (i % 2 == 0)
        {
            sum += 2;
            sleep_for(2ns);
        }
        else
        {
            sum += 4;
            sleep_for(4ns);
        }

    return sum;
}

int sleepNotIf(int n)
{
    int sum = 0;
    for (int i = 0; i < n; i++)
    {
        sum += 3;
        sleep_for(3ns);
    }

    return sum;
}`;

const bechmarkCodeCpp = CODE`\
using namespace std::chrono;

template <typename Func, typename Arg>
nanoseconds mt(Func func, Arg arg, int iterations)
{
    nanoseconds total{0};

    for (int i = 0; i < iterations; i++)
    {
        auto start = high_resolution_clock::now();

        int dummy = func(arg);
        asm volatile("" : "+r"(dummy) : : "memory");

        auto end = high_resolution_clock::now();

        total += end - start;
    }

    return nanoseconds{total.count() / iterations};
}

int main()
{
    const int iterations = 10;
    const int n = 10'000;

    std::println(mt(sleepIf, n, iterations));
    std::println(mt(sleepNotIf, n, iterations));
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
            <MyCode code={bechmarkCodeCpp} ref={bechmarkCode} />
        </MyRect>
    );

    yield* all(
        bechmarkCode().fontSize(fontSizeSmall, 0),
        cppCode().fontSize(fontSizeSmall, 0),
        cppCode().code(cppCodeOriginal, 0)
    );

    yield* slideTransition(Direction.Right);

    yield* beginSlide("compute Functions");

    yield* all(
        bechmarkCode().selection(lines(1), animationTime)
    );

    yield* beginSlide("Main");

    yield* all(
        cppCode().selection(lines(2), animationTime),
        bechmarkCode().selection(lines(22, 30), animationTime)
    );

    yield* beginSlide("mt");

    yield* all(
        bechmarkCode().selection(lines(2, 20), animationTime)
    );

    yield* beginSlide("Конец");
});
