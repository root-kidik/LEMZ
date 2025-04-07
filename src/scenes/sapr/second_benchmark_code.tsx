import { CODE, lines, makeScene2D } from '@motion-canvas/2d';
import { Vscode } from '../../components/Vscode';
import { all, createRef, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { MyCode } from '../../components/My/MyCode';
import { animationTime, fontSizeSmall } from '../../theme/Theme';
import { MyRect } from '../../components/My/MyRect';

const cppCodeOriginal = CODE`\
#include <vector>

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
template <typename Func, typename... Args>
double measureTime(Func func, int iterations, Args&&... args)
{
    std::chrono::nanoseconds total{0};
    for (int i = 0; i < iterations; i++)
    {
        auto start = std::chrono::high_resolution_clock::now();
        int dummy = func(std::forward<Args>(args)...); 
        asm volatile("" : "+r"(dummy) : : "memory");
        auto end = std::chrono::high_resolution_clock::now();
        total += end - start;
    }
    return static_cast<double>(total.count()) / iterations;
}

int main()
{
    const int iterations = 1'000;
    const int n = 1'000'000;         

    auto vec = genVec(n);
    auto v_odd = genVec(n / 2);  
    auto v_even = genVec(n / 2); 

    std::println("if: {}", 
        measureTime(computeIf, iterations, vec)
    );
    std::println("notIf: {}", 
        measureTime(computeNotIf, iterations, v_odd, v_even)
    );
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
        cppCode().selection(lines(1), animationTime),
        bechmarkCode().selection(lines(15, 31), animationTime)
    );

    yield* waitFor(1);

    // int main()

    yield* all(
        bechmarkCode().selection(lines(0, 14), animationTime)
    );

    yield* waitFor(1);
});
