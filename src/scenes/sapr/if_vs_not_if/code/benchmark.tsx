import { CODE, lines, makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, createRef, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { Vscode } from '../../../../components/Vscode';
import { MyCode } from '../../../../components/My/MyCode';
import { MyRect } from '../../../../components/My/MyRect';
import { animationTime, fontSizeSmall } from '../../../../theme/Theme';

const cppCodeOriginal = CODE`\
int computeIf(const std::vector<int>& v)
{
    int sum = 0;
    for (auto i : v) 
        if (i % 2 == 0) 
            sum += i;
    return sum;
}

int computeNotIf(
    const std::vector<int>& v_odd, 
    const std::vector<int>& v_even)
{
    int sum = 0;
    for (auto i : v_odd) sum += i;
    for (auto i : v_even) sum += i;
    return sum;
}`;

const bechmarkCodeCpp = CODE`\
using namespace std::chrono;

template <typename Func, typename... Args>
nanoseconds mt(Func func, int iterations, Args&&... args)
{
    nanoseconds total{0};
    for (int i = 0; i < iterations; i++)
    {
        auto start = high_resolution_clock::now();
        auto dummy = func(std::forward<Args>(args)...); 
        asm volatile(" " : "+r"(dummy) : : "memory");
        auto end = high_resolution_clock::now();
        total += end - start;
    }
    return nanoseconds{
        static_cast<double>(total.count()) / iterations
    };
}

int main()
{
    const int iterations = 1'000;
    const int n = 1'000'000;         

    auto vec = genVec(n);
    auto v_odd = genVec(n / 2);  
    auto v_even = genVec(n / 2); 

    std::println(mt(computeIf, iterations, vec));
    std::println(mt(computeNotIf, iterations, v_odd, v_even));
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
        cppCode().selection(lines(8), animationTime),
        bechmarkCode().selection(lines(19, 30), animationTime)
    );

    yield* beginSlide("mt");

    yield* all(
        bechmarkCode().selection(lines(2, 17), animationTime)
    );

    yield* beginSlide("Конец");
});
