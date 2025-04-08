import { CODE, makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, createRef, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { MyCode } from '../../../../components/My/MyCode';
import { Vscode } from '../../../../components/Vscode';
import { animationTime } from '../../../../theme/Theme';
import { MyRect } from '../../../../components/My/MyRect';

const cppCodeIf = CODE`\
using namespace std::this_thread;
using namespace std::chrono_literals;

int sleepIf(int n)
{
    int sum = 0;

    for (int i = 0; i < n; i++)
    {
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
    }

    return sum;
}`;

const cppCodeNotIf = CODE`\
using namespace std::this_thread;
using namespace std::chrono_literals;

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
