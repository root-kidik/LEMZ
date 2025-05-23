import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SimpleSignal, createSignal } from '@motion-canvas/core/lib/signals';
import { cancel, ThreadGenerator } from '@motion-canvas/core/lib/threading';
import { createRef } from '@motion-canvas/core/lib/utils';
import { loop, waitFor } from '@motion-canvas/core/lib/flow';
import {
    InterpolationFunction,
    TimingFunction,
} from '@motion-canvas/core/lib/tweening';
import { Txt, Rect, RectProps } from '@motion-canvas/2d/lib/components';
import { PossibleCanvasStyle } from '@motion-canvas/2d/lib/partials';
import { animationTime, colorWhite, fontFamilyDefault, fontSizeNormal, fontWeightBold } from '../theme/Theme';

export interface TerminalProps extends RectProps {
    cursorType?: 'none' | 'line' | 'block';
    blinkSpeed?: number;
    maxChilds: number;
}

export interface TerminalTextProps {
    fill?: SimpleSignal<PossibleCanvasStyle>;
    fontFamily?: SimpleSignal<string, this>;
    fontSize?: SimpleSignal<number, this>;
    fontWeight?: SimpleSignal<number, this>;
    height?: SimpleSignal<number, this>;
}

export class Terminal extends Rect {
    private maxChilds: number;

    public textStyle: TerminalTextProps = {
        fill: createSignal(colorWhite),
        fontFamily: createSignal(fontFamilyDefault),
        fontSize: createSignal(fontSizeNormal),
        fontWeight: createSignal(fontWeightBold),
        height: createSignal(fontSizeNormal + 3),
    };

    @initial('none')
    @signal()
    public declare readonly cursorType: SimpleSignal<
        'none' | 'line' | 'block',
        this
    >;
    @initial(0.8)
    @signal()
    public declare readonly blinkSpeed: SimpleSignal<number, this>;

    public cursor = new Rect({
        height: this.textStyle.height(),
        width: this.textStyle.height() * (8 / 13),
        fill: 'white',
    });
    protected cursorBlinkTask: ThreadGenerator = null;

    public constructor(props: TerminalProps) {
        super({
            layout: true,
            direction: 'column',
            size: ["100%", 250],
            textWrap: 'pre',
            ...props,
        });

        this.maxChilds = props.maxChilds;
    }

    /**
     * Returns a string with the correct amount of spaces to fill the max string width.
     * @param {string[]} textList - A list of strings to be formatted.
     * @param {number} maxLineLength - The max length of the line.
     * @returns {string} A string with the correct amount of spaces to fill the max string width.
     */
    public formatTextList(textList: string[], maxLineLength: number): string {
        let totalTextLength = 0;
        for (const text of textList) {
            totalTextLength += text.length;
        }
        if (totalTextLength + textList.length - 1 > maxLineLength) {
            throw new Error(
                'The total length of the text is greater than the maximum line length',
            );
        }

        const spaceCount =
            Math.max(0, maxLineLength - totalTextLength) / (textList.length + 1);
        const spaces = ' '.repeat(Math.floor(spaceCount));

        let returnString = '';
        for (const text of textList) {
            returnString += spaces + text;
        }

        const remainingSpaces = ' '.repeat(
            Math.ceil(
                maxLineLength - (textList.length * spaces.length + totalTextLength),
            ),
        );
        return returnString + remainingSpaces;
    }

    protected getConstantCharacterWidth(font: string, fontSize: number): number {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = `${fontSize}px ${font}`;
        return ctx.measureText('i').width - 1;
    }

    /**
     * Returns the max characters of a line in the terminal.
     * @returns {number} The max characters of a line in the terminal.
     */
    public getMaxChars(): number {
        return Math.floor(
            (this.size().width - this.padding().x * 2) /
            this.getConstantCharacterWidth(
                this.textStyle.fontFamily(),
                this.textStyle.fontSize(),
            ),
        );
    }

    /**
     * Returns the max lines that can be displayed in the terminal.
     * @returns {number} The max lines that can be displayed in the terminal.
     */
    public getMaxLines(): number {
        return Math.floor(
            (this.size().height - this.padding().y * 2) / this.textStyle.height(),
        );
    }

    public getLast() {
        if (this.children()[this.children().length - 1] === undefined) {
            this.add(
                <Rect layout>
                    <Txt text={''} {...this.textStyle} />
                    {this.cursor}
                </Rect>,
            );
        }
        return this.children()[this.children().length - 1];
    }

    /**
     * Enables or disables the blinking animation of the terminal's cursor.
     *
     *  @param enable - When set to `true`, the terminal's cursor will blink,
     *  if set to `false`, it will not blink and stay visible.
     *
     */
    public *blink(enable = true): ThreadGenerator {
        if (enable && this.cursorBlinkTask === null) {
            this.cursorBlinkTask = yield loop(
                Infinity,
                function* (this: Terminal) {
                    this.cursor.opacity(0);
                    yield* waitFor(this.blinkSpeed() / 2);
                    this.cursor.opacity(100);
                    yield* waitFor(this.blinkSpeed() / 2);
                }.bind(this),
            );
        } else {
            if (this.cursorBlinkTask !== null) {
                cancel(this.cursorBlinkTask);
                this.cursor.opacity(100);
                this.cursorBlinkTask = null;
            }
        }
    }

    /**
     * Makes the terminal prompt
     *
     *  @example const term = createRef<Terminal>();
     * yield* term().prompt(); // default prompt
     * yield* term().prompt("PS > ", "white");
     *
     *  @param {string=} promptText - The prompt of the terminal
     *  @param {PossibleColor=} color - The prompt color
     */
    public *prompt(promptText = '$ ', color: PossibleCanvasStyle = '#4d3') {
        if (this.children().length == this.maxChilds)
            this.children().shift();

        yield* this.blink();
        this.add(
            <Rect  layout>
                <Txt 
                    text={promptText}
                    {...this.textStyle}
                    fill={color}
                    fontWeight={800}
                />
                {this.cursor}
            </Rect>,
        );
    }

    /**
     * Clears the terminal.
     *
     *  @example const term = createRef<Terminal>();
     * yield* term().clear(); // default clear
     * yield* term().clear(true, true, 'cls', 0.2); // change clear command to cls
     * yield* term().clear(false, false); // instant clear
     *
     *  @param {boolean=} fakeClear - When set to `true`, clear will be typed in the
     *                     terminal before clearing it. Setting it to
     *                     `false` instantly clears the terminal.
     *  @param {string=} clearCommand - The command to type before clearing the terminal
     *  @param {number=} time - The time after clear is typed to clean the terminal
     */
    public *clear(
        prompt = true,
        fakeClear = true,
        clearCommand = 'clear',
        time = 0.1,
    ) {
        if (fakeClear) {
            yield* this.type(clearCommand, animationTime);
            yield* this.blink();
            yield* waitFor(time);
        }
        for (const item of this.children()) {
            item.remove();
        }
        if (prompt) {
            yield* this.prompt();
        }
    }

    /**
     * Writes text in the terminal with a typing animation.
     *  @example const term = createRef<Terminal>();
     * yield* term().type("mkdir new-folder", 3); // types mkdir new-folder in 3 seconds in the terminal
     *
     *  @param {string} content - The text to type in the terminal
     *  @param {number} time - The time to type the text
     *  @param {TimingFunction=} timingFunction - The timing function to use when typing the text
     *  @param {InterpolationFunction=} interpolationFunction - The interpolation function to use when typing the text
     */
    public *type(
        content: string,
        time: number = animationTime,
        color: PossibleCanvasStyle = this.textStyle.fill(),
        timingFunction?: TimingFunction,
        interpolationFunction?: InterpolationFunction<string>,
    ) {
        yield* this.blink(false);
        if (this.children()[this.children().length - 1] === undefined) {
            yield* this.prompt('');
        }

        if (this.children().length > this.maxChilds)
            this.children().shift();
        
        const last = this.getLast();
        const text = createRef<Txt>();
        last.add(<Txt ref={text} {...this.textStyle} fill={color} />);
        last.add(this.cursor);
        yield* text().text(content, time, timingFunction, interpolationFunction);
        yield* this.blink();
    }

    /**
     * Creates a new line in the terminal and stops the blinking animation of the cursor.
     *  @example const term = createRef<Terminal>();
     * yield* term().newline();
     * //Useful for command outputs on multiple lines
     */
    public *newline() {
        yield* this.blink(false);
        this.cursor.opacity(0);
        this.add(
            <Rect layout>
                <Txt {...this.textStyle} />
                {this.cursor}
            </Rect>,
        );
    }

    /**
     * Pastes text in the terminal instantly at the end of the current line.
     *  @example const term = createRef<Terminal>();
     * yield* term().line("Hello World!");
     * yield* term().newline();
     * yield* term().line("Hello in blue!", "blue");
     *
     *  @param {string} content - The text to paste in the terminal
     *  @param {PossibleColor=} color - The color of the text
     */
    public *line(
        content: string,
        color: PossibleCanvasStyle = this.textStyle.fill(),
        highlightColor: PossibleCanvasStyle = null,
    ) {
        yield* this.blink(false);
        yield* this.newline();

        this.cursor.opacity(0);
        const [first, ...lines] = content.split('\n');
        const last = this.getLast();
        const text = createRef<Txt>();
        const highlight = createRef<Rect>();
        last.add(
            <Rect ref={highlight} fill={highlightColor}>
                <Txt ref={text} {...this.textStyle} text={first} fill={color} />
            </Rect>,
        );
        last.add(this.cursor);
        lines.map(l => {
            this.add(
                <Rect layout>
                    <Rect ref={highlight} fill={highlightColor}>
                        <Txt ref={text} text={l} {...this.textStyle} fill={color} />
                    </Rect>
                    {this.cursor}
                </Rect>,
            );
        });

        this.fixSize();

        return { text, highlight };
    }

    public fixSize() {
        while (this.children().length > this.maxChilds)
            this.children().shift();
    }

    public *output(output: string[], prompt: string = "", duration: number = animationTime, isNeedNewLine: Boolean = true, color: PossibleCanvasStyle = this.textStyle.fill(),) {
        const durationPerString = duration / output.length;

        for (let i = 0; i < output.length; i++) {
            yield* this.prompt(prompt, "white");
            yield* this.type(output[i], durationPerString, color);
            if (this.children().length > this.maxChilds)
                this.children().shift();
        }
        if (isNeedNewLine)
            yield* this.prompt();
    }
}