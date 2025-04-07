import { CODE, makeScene2D } from '@motion-canvas/2d';
import { Vscode } from '../../components/Vscode';
import { all, createRef, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { MyCode } from '../../components/My/MyCode';
import { animationTime } from '../../theme/Theme';
import { MyRect } from '../../components/My/MyRect';

const cppCodeIf = CODE`\
int computeIf(const std::vector<int>& v)
{
    int sum = 0;

    for (auto i : v) 
        if (i % 2 == 0) 
            sum += i;

    return sum;
}
`;

const cppCodeNotIf = CODE`\
int computeNotIf(
    const std::vector<int>& v_odd, 
    const std::vector<int>& v_even)
{
    int sum = 0;
    
    for (auto i : v_odd) sum += i;
    for (auto i : v_even) sum += i;
    
    return sum;
}`;

export default makeScene2D(function* (view) {
    const cppCode = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={cppCode} disable_filebar={true} />
    );

    yield* slideTransition(Direction.Right);

    yield* waitFor(1);

    // голый цикл

    yield* cppCode().code(cppCodeIf, animationTime);

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
        asmCode().code(cppCodeNotIf, animationTime)
    );

    yield* waitFor(1);
});
