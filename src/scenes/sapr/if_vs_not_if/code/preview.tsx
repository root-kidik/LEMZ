import { CODE, makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, createRef, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { MyCode } from '../../../../components/My/MyCode';
import { Vscode } from '../../../../components/Vscode';
import { animationTime } from '../../../../theme/Theme';
import { MyRect } from '../../../../components/My/MyRect';

const cppCodeIf = CODE`\
int computeIf(const std::vector<int>& v)
{
    int sum = 0;

    for (auto i : v) 
        if (i % 2 == 0) 
            sum += i;

    return sum;
}`;

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

    yield* cppCode().code(cppCodeIf, 0);

    const asmLayout = createRef<MyRect>();
    const asmCode = createRef<MyCode>();

    yield* vscode().add(
        <MyRect ref={asmLayout} width={"100%"} >
            <MyCode code={cppCodeNotIf} ref={asmCode} />
        </MyRect>
    );

    yield* slideTransition(Direction.Right);

    yield* beginSlide("Конец");
});
