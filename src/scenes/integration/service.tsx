import { CODE, Knot, Layout, lines, makeScene2D, Spline, word } from "@motion-canvas/2d";
import { Vscode } from "../../components/Vscode";
import { all, AudioManager, beginSlide, createRef, createSignal, DEFAULT } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { MyRect } from "../../components/My/MyRect";
import { Console } from "../../components/Console";
import { animationTime, colorBlue, colorGreen, colorRed, colorSemiSemiBlack, colorWhiteBlue, gapBig, lineWidthBorderGrid, lineWidthGrid, lineWidthNormal, radiusNormal } from "../../theme/Theme";
import { MyTxt } from "../../components/My/MyTxt";

export default makeScene2D(function* (view) {

    const layoutServices = createRef<Layout>();

    view.add(
        <Layout ref={layoutServices} layout alignItems={"center"} justifyContent={"space-around"} width={"100%"} height={"100%"} />
    );

    yield* beginSlide("Interrogator");

    const interrogatorRect = createRef<MyRect>();
    const interrogatorTxt = createRef<MyTxt>();

    layoutServices().add(
        <MyRect is_hidden alignItems={"center"} ref={interrogatorRect}>
            <MyTxt ref={interrogatorTxt} />
        </MyRect>
    );

    yield* all(
        interrogatorRect().appear(),
        interrogatorTxt().text("Interrogator", animationTime),
    );

    yield* beginSlide("Xlnx");

    const xlnxRect = createRef<MyRect>();
    const xlnxTxt = createRef<MyTxt>();

    layoutServices().add(
        <MyRect ref={xlnxRect} alignItems={"center"} is_hidden>
            <MyTxt ref={xlnxTxt} />
        </MyRect>
    );

    yield* all(
        xlnxRect().appear(),
        xlnxTxt().text("Xlnx Pci Gateway", animationTime),
    );

    yield* beginSlide("Connect");

    const interrogator = createRef<MyRect>();
    const interrogatorFpgaDriver = createRef<MyTxt>();

    const xlnx = createRef<MyRect>();
    const xlnxPort = createRef<MyTxt>();

    interrogatorRect().add(
        <MyRect is_hidden ref={interrogator} stroke={colorBlue}>
            <MyTxt ref={interrogatorFpgaDriver} />
        </MyRect>
    );

    xlnxRect().add(
        <MyRect is_hidden ref={xlnx} stroke={colorBlue}>
            <MyTxt ref={xlnxPort} />
        </MyRect>
    );

    yield* all(
        interrogator().appear(),
        interrogatorFpgaDriver().text("FpgaSsrAppDriver", animationTime),
        xlnx().appear(),
        xlnxPort().text("49007", animationTime)
    );

    yield* beginSlide("RliStream");

    const spline = createRef<Spline>();
    const rliStreamTxt = createRef<MyTxt>();

    const knot1 = createRef<Knot>();
    const knot2 = createRef<Knot>();

    view.add(
        <>
            <Spline
                ref={spline}
                lineWidth={lineWidthBorderGrid}
                stroke={'lightgray'}
                end={0}
                start={0}
            >
                <Knot ref={knot1} position={() => [((xlnx().absolutePosition().x - view.absolutePosition().x) / 2) - (xlnx().width() / 2) - (xlnx().lineWidth() / 2), xlnx().position().y]} />
                <Knot ref={knot2} position={() => [(-(view.absolutePosition().x - interrogator().absolutePosition().x) / 2) + (interrogator().width() / 2) + (interrogator().lineWidth() / 2), interrogator().position().y]} />
            </Spline>

            <MyTxt ref={rliStreamTxt} position={[50,0]} />
        </>
    );

    yield* all(
        spline().start(0, animationTime).to(1, animationTime),
        rliStreamTxt().text("RliStream", animationTime * 4)
    );

    yield* beginSlide("Сообщения по RliStream");

    const messageRli = createRef<MyRect>();

    const progress = createSignal(0);

    view.add(
        <MyRect
            ref={messageRli}
            stroke={colorGreen}
            is_hidden
            position={() => spline().getPointAtPercentage(progress()).position}
        />
    );

    for (let i = 0; i < 5; i++) {
        yield* all(
            progress(1, animationTime * 1.5),
            messageRli().appear()
        );
        yield* all(
            progress(0, 0),
            messageRli().disappear(0)
        );
    }

    yield* beginSlide("Proxy");

    const proxyRect = createRef<MyRect>();
    const proxyTxt = createRef<MyTxt>();

    const proxy = createRef<MyRect>();
    const proxyPort = createRef<MyTxt>();
    const proxyDriverRect = createRef<MyRect>();
    const proxyDriver = createRef<MyTxt>();

    layoutServices().insert(
        <MyRect ref={proxyRect} alignItems={"center"} is_hidden>
            <MyTxt ref={proxyTxt} />
            <Layout layout gap={gapBig}>
                <MyRect is_hidden ref={proxy} stroke={colorBlue}>
                    <MyTxt ref={proxyPort} />
                </MyRect>
                <MyRect is_hidden ref={proxyDriverRect} stroke={colorBlue}>
                    <MyTxt ref={proxyDriver} />
                </MyRect>
            </Layout>
        </MyRect>, 1
    );

    const knot3 = createRef<Knot>();
    const knot4 = createRef<Knot>();

    const splineNew = createRef<Spline>();
    const rliStreamTxtNew = createRef<MyTxt>();

    view.add(
        <>
            <Spline
                ref={splineNew}
                lineWidth={lineWidthBorderGrid}
                stroke={'lightgray'}
                end={0}
                start={0}
            >
                <Knot ref={knot3} position={() => [((proxy().absolutePosition().x - view.absolutePosition().x) / 2) - (proxy().width() / 2) - (proxy().lineWidth() / 2), interrogator().position().y]} />
                <Knot ref={knot4} position={() => [(-(view.absolutePosition().x - interrogator().absolutePosition().x) / 2) + (interrogator().width() / 2) + (interrogator().lineWidth() / 2), interrogator().position().y]} />
            </Spline>

            <MyTxt ref={rliStreamTxtNew} position={[-300, 0]} />
        </>
    );

    const messageRliNew = createRef<MyRect>();

    view.add(
        <MyRect
            ref={messageRliNew}
            stroke={colorGreen}
            is_hidden
            position={() => splineNew().getPointAtPercentage(progress()).position}
        />
    );

    yield* all(
        proxyRect().appear(),
        proxyTxt().text("Fpga Router", animationTime),
        proxy().appear(),
        proxyPort().text("50007", animationTime),
        proxyDriverRect().appear(),
        proxyDriver().text("49007", animationTime),
        knot2().position(() => [(-(view.absolutePosition().x - proxyDriverRect().absolutePosition().x) / 2) + (proxyDriverRect().width() / 2) + (proxyDriverRect().lineWidth() / 2), xlnx().position().y], animationTime),
        rliStreamTxt().position([380,0], animationTime),
        splineNew().start(0, animationTime).to(1, animationTime),
        rliStreamTxtNew().text("RliStream", animationTime * 4)
    );

    for (let i = 0; i < 5; i++) {
        yield* all(
            progress(1, animationTime * 1.5),
            messageRli().appear(),
            messageRliNew().appear()
        );
        yield* all(
            progress(0, 0),
            messageRli().disappear(0),
            messageRliNew().disappear(0)
        );
    }

    yield* beginSlide("Конец");
});