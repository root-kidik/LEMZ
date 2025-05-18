import { Layout, makeScene2D } from "@motion-canvas/2d";
import { all, beginSlide, createRef, makeRef, Random, range, useRandom } from "@motion-canvas/core";
import { MyRect } from "../../components/My/MyRect";
import { MyTxt } from "../../components/My/MyTxt";
import { animationTime, colorBlack, colorBlue, colorGrey, colorRed, colorSemiBlack, colorSemiGrey, colorSemiSemiBlack, fontSizeBig, fontSizeNormal, fontSizeSmall, gapBig, gapNormal, paddingBig } from "../../theme/Theme";

export default makeScene2D(function* (view) {
    const t0 = createRef<MyRect>();
    const t1 = createRef<MyRect>();
    const t2 = createRef<MyRect>();
    const t3 = createRef<MyRect>();
    const t4 = createRef<MyRect>();
    const t5 = createRef<MyRect>();

    const bY = -415;

    const cpu_layout = createRef<MyRect>();

    view.add(
        <>
            <Layout layout direction={"column"} gap={gapBig} padding={paddingBig} width={"100%"} height={"100%"}>
                <MyRect height={200} layout direction={"column"} width={"100%"} padding={paddingBig} gap={gapNormal} justifyContent={"center"} alignItems={"center"}>
                    <MyTxt text={"OS Scheduler"} fontSize={72} />
                </MyRect>


                <MyRect ref={cpu_layout} layout direction={"column"} width={"100%"} height={"100%"} padding={paddingBig} gap={gapNormal} justifyContent={"center"} alignItems={"center"}>

                    <Layout layout width={"100%"} padding={paddingBig} justifyContent={"center"} alignItems={"center"} gap={gapBig}>
                        <MyTxt text={"CPU"} fontSize={72} />
                    </Layout>

                    <Layout layout width={"100%"} height={"100%"} padding={paddingBig} justifyContent={"center"} alignItems={"center"} gap={gapBig}>
                        {() => range(8).map((i) =>
                            <MyRect stroke={colorBlue} width={"100%"} height={"85%"} alignContent={"center"} justifyContent={"center"}>
                                <MyTxt alignSelf={"center"} text={(i).toString()} fontSize={48} />
                            </MyRect>
                        )}
                    </Layout>

                    <Layout layout width={"100%"} height={"100%"} padding={paddingBig} justifyContent={"center"} alignItems={"center"} gap={gapBig}>
                        {() => range(8).map((i) =>
                            <MyRect stroke={colorBlue} width={"100%"} height={"85%"} alignContent={"center"} justifyContent={"center"}>
                                <MyTxt alignSelf={"center"} text={(i + 8).toString()} fontSize={48} />
                            </MyRect>
                        )}
                    </Layout>

                </MyRect>
            </Layout>

            <MyRect ref={t0} position={[-800, bY]} stroke={colorRed} layout justifyContent={"center"}>
                <MyTxt alignSelf={"center"} alignContent={"center"} text={"T0"} fontSize={fontSizeBig} />
            </MyRect>

            <MyRect ref={t1} position={[-600, bY]} stroke={colorRed} layout justifyContent={"center"}>
                <MyTxt alignSelf={"center"} alignContent={"center"} text={"T1"} fontSize={fontSizeBig} />
            </MyRect>

            <MyRect ref={t2} position={[-400, bY]} stroke={colorRed} layout justifyContent={"center"}>
                <MyTxt alignSelf={"center"} alignContent={"center"} text={"T2"} fontSize={fontSizeBig} />
            </MyRect>

            <MyRect ref={t3} position={[400, bY]} stroke={colorRed} layout justifyContent={"center"}>
                <MyTxt alignSelf={"center"} alignContent={"center"} text={"T3"} fontSize={fontSizeBig} />
            </MyRect>

            <MyRect ref={t4} position={[600, bY]} stroke={colorRed} layout justifyContent={"center"}>
                <MyTxt alignSelf={"center"} alignContent={"center"} text={"T4"} fontSize={fontSizeBig} />
            </MyRect>

            <MyRect ref={t5} position={[800, bY]} stroke={colorRed} layout justifyContent={"center"}>
                <MyTxt alignSelf={"center"} alignContent={"center"} text={"T5"} fontSize={fontSizeBig} />
            </MyRect>
        </>
    );

    yield* beginSlide("Begin");

    const uY = 150;
    const lY = 425;

    const posX = [-750, -535, -325, -105, 115, 325, 750, 540];

    const random = useRandom();

    t0().save();
    t1().save();
    t2().save();
    t3().save();
    t4().save();
    t5().save();

    for (let index = 0; index < 20; index++) {
        yield* all(
            cpu_layout().stroke(colorBlue, animationTime),
            t0().position([posX[random.nextInt(0, 8)], random.nextInt(0, 2) ? uY : lY], animationTime),
            t1().position([posX[random.nextInt(0, 8)], random.nextInt(0, 2) ? uY : lY], animationTime),
            t2().position([posX[random.nextInt(0, 8)], random.nextInt(0, 2) ? uY : lY], animationTime),
            t3().position([posX[random.nextInt(0, 8)], random.nextInt(0, 2) ? uY : lY], animationTime),
            t4().position([posX[random.nextInt(0, 8)], random.nextInt(0, 2) ? uY : lY], animationTime),
            t5().position([posX[random.nextInt(0, 8)], random.nextInt(0, 2) ? uY : lY], animationTime),
        );

        yield* cpu_layout().stroke(colorSemiSemiBlack, animationTime); 
    }

    yield* all(
        cpu_layout().stroke(colorSemiSemiBlack, animationTime),
        t0().restore(animationTime),
        t1().restore(animationTime),
        t2().restore(animationTime),
        t3().restore(animationTime),
        t4().restore(animationTime),
        t5().restore(animationTime),
    );

    yield* beginSlide("Ideal");

    t0().save();
    t1().save();
    t2().save();
    t3().save();
    t4().save();
    t5().save();

    for (let index = 0; index < 20; index++) {
        yield* all(
            cpu_layout().stroke(colorBlue, animationTime),
            t0().position([posX[0], uY], animationTime),
            t1().position([posX[1], uY], animationTime),
            t2().position([posX[2], uY], animationTime),
            t3().position([posX[3], uY], animationTime),
            t4().position([posX[4], uY], animationTime),
            t5().position([posX[5], uY], animationTime),
        );

        yield* cpu_layout().stroke(colorSemiSemiBlack, animationTime); 
    }

    yield* all(
        cpu_layout().stroke(colorSemiSemiBlack, animationTime),
        t0().restore(animationTime),
        t1().restore(animationTime),
        t2().restore(animationTime),
        t3().restore(animationTime),
        t4().restore(animationTime),
        t5().restore(animationTime),
    );

    yield* beginSlide("End");
});
