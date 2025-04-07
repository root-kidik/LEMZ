import { Grid, Layout, makeScene2D } from "@motion-canvas/2d";
import { all, createRef, Direction, slideTransition, waitFor } from "@motion-canvas/core";
import { Vscode } from "../../components/Vscode";
import { MyRect } from "../../components/My/MyRect";
import { animationTime, colorRed, paddingBig } from "../../theme/Theme";
import { MyTxt } from "../../components/My/MyTxt";

export default  makeScene2D(function* (view) {
    const back = createRef<Vscode>();

    view.add(
        <Layout padding={paddingBig} height={"100%"} width={"100%"} layout>
            <MyRect direction={"row"} alignItems={"center"} justifyContent={"center"} width={"100%"} ref={back} />
        </Layout>
    );

    yield* slideTransition(Direction.Right);

    const grid = createRef<Grid>();
    const ns = createRef<MyTxt>();
    const ns0 = createRef<MyTxt>();
    const ns500 = createRef<MyTxt>();
    const ns1000 = createRef<MyTxt>();

    back().add(
        <>
            <MyTxt ref={ns} rotation={-90} />

            <Layout direction={"column"} justifyContent={"space-between"} height={"100%"} paddingTop={paddingBig} paddingBottom={paddingBig} layout>
                <MyTxt ref={ns1000} rotation={-90} />
                <MyTxt ref={ns500} rotation={-90} />
                <MyTxt ref={ns0} rotation={-90} />
            </Layout>

            <Grid
                ref={grid}
                width={"100%"}
                height={'100%'}
                stroke={'#666'}
                start={0}
                end={0}
                justifyContent={"space-evenly"}
                alignItems={"end"}
            />
        </>
    );

    yield* all(
        grid().end(0.5, animationTime / 2).to(1, animationTime / 2),
        grid().start(0.5, animationTime / 2).to(0, animationTime / 2),
        ns().text("ns", animationTime),
        ns1000().text("4*10^6", animationTime),
        ns500().text("2*10^6", animationTime),
        ns0().text("0", animationTime),
    );

    const loopBar = createRef<MyRect>();
    const formulaBar = createRef<MyRect>();

    grid().add([
        <MyRect ref={loopBar} width={200} padding={0} height={0} stroke={colorRed} alignItems={"center"} justifyContent={"center"}>
            <MyTxt text={"if"} />
        </MyRect>,
        <MyRect ref={formulaBar} width={200} padding={0} height={0} stroke={colorRed} alignItems={"center"} justifyContent={"center"}>
            <MyTxt text={"not if"} />
        </MyRect>
    ]);

    yield* all(
        loopBar().height(grid().height() / 2, animationTime),
        loopBar().padding(paddingBig, animationTime),
        formulaBar().height(grid().height() / 3.5, animationTime),
        formulaBar().padding(paddingBig, animationTime),
    );

    yield* waitFor(1);
});