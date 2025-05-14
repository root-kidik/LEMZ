import { Layout, makeScene2D } from "@motion-canvas/2d";
import { all, beginSlide, createRef } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { animationTime, colorBlue, colorGreen, colorRed, colorWhite, fontSizeBig, fontSizeNormal, gapBig, paddingBig } from "../../theme/Theme";
import { MyRect } from "../../components/My/MyRect";
import { MyTxt } from "../../components/My/MyTxt";


export default makeScene2D(function* (view) {
    const cppl = createRef<MyCode>();
    const cppr = createRef<MyCode>();
    const ct = createRef<MyCode>();
    const txt = createRef<MyTxt>();
    const n = createRef<MyRect>();

    view.add(
        <>
            <Layout width={"100%"} height={"100%"} layout padding={paddingBig} gap={gapBig} direction={"column"}>
                <Layout layout width={"100%"} height={"100%"} gap={gapBig}>
                    <MyRect clip stroke={colorRed} width={"49%"} >
                        <MyCode ref={cppl} />
                    </MyRect>
                    <MyRect clip stroke={colorGreen} width={"49%"}>
                        <MyCode ref={cppr} />
                    </MyRect>
                </Layout>
                <MyRect stroke={colorBlue} width={"100%"} height={"50%"}>
                    <MyCode ref={ct} />
                </MyRect>
            </Layout>
            <MyRect ref={n} stroke={colorWhite} position={[0, 150]}>
                <MyTxt ref={txt} text={"0"} fontSize={fontSizeBig} />
            </MyRect>
        </>
    );

    yield* beginSlide("Begin");
    yield* beginSlide("1");

    yield* all(
        txt().text("1", 0),
        cppl().code(`\
bool IsValidMessage(const std::vector<char>& data)
{
    return rli_stream::calcParitet(data);
}            `, animationTime),
        cppr().code(`\
bool IsValidMessage(const std::vector<char>& data)
{
    return rli_stream::calcParitet(
        temp, 
        len + kParitySize
    );
}
            `, animationTime),
        ct().code(`\
Standard: c++20
ColumnLimit: 120
`, animationTime)
    );

    yield* beginSlide("2");
    yield* all(
        txt().text("2", 0),
        cppl().code(`\
class Calculator
{
    public:
    int Sum();
}            `, animationTime),
        cppr().code(`\
class Calculator
{
public:
    int Sum();
}
            `, animationTime),
        ct().code(`\
AccessModifierOffset: -4
`, animationTime)
    );

    yield* beginSlide("3");
    yield* all(
        txt().text("3", 0),
        cppl().code(`\
struct X
{
unsigned bf:2;
};            `, animationTime),
        cppr().code(`\
struct X
{
unsigned bf : 2;
}; 
            `, animationTime),
        ct().code(`\
BitFieldColonSpacing: Both
`, animationTime)
    );

    yield* beginSlide("4");
    yield* all(
        txt().text("4", 0),
        cppl().code(`\
int i =         //  VeryVeryVeryVeryLongComment
  longFunction( // Again a long comment
    arg);
`, animationTime),
        cppr().code(`\
int i =         //  VeryVeryVeryVeryLongComment
    longFunction( // Again a long comment
      arg);
`, animationTime),
        ct().code(`\
ContinuationIndentWidth: 4
`, animationTime)
    );

    yield* beginSlide("5");
    yield* all(
        txt().text("5", 0),
        cppl().code(`\
switch (fool) 
{
case 1:
    {
        bar();
        break;
    }
default:
    {
      plop();
    }
}`, animationTime),
        cppr().code(`\
switch (fool)
{
    case 1:
    {
        bar();
        break;
    }
    default:
    {
        plop();
    }
}
`, animationTime),
        ct().code(`\
IndentCaseLabels: true
IndentCaseBlocks: false
`, animationTime)
    );

    yield* beginSlide("6");
    yield* all(
        txt().text("6", 0),
        cppl().code(`\
extern "C" {
    void foo();
}
`, animationTime),
        cppr().code(`\
extern "C"
{
    void foo();
}
`, animationTime),
        ct().code(`\
IndentExternBlock: Indent
`, animationTime)
    );

    yield* beginSlide("7");
    yield* all(
        txt().text("7", 0),
        cppl().code(`\
#if FOO
  #if BAR
    #include <foo>
  #endif
#endif
`, animationTime),
        cppr().code(`\
#if FOO
#if BAR
#include <foo>
#endif
#endif
`, animationTime),
        ct().code(`\
IndentPPDirectives: None
`, animationTime)
    );


    yield* beginSlide("8");
    yield* all(
        txt().text("8", 0),
        cppl().code(`\
template <typename It>
requires Iterator<It>
void sort(It begin, It end) {
  //....
}
`, animationTime),
        cppr().code(`\
template <typename It>
  requires Iterator<It>
void sort(It begin, It end) {
  //....
}
`, animationTime),
        ct().code(`\
IndentRequires: true
`, animationTime)
    );

    yield* beginSlide("9");
    yield* all(
        txt().text("9", 0),
        cppl().code(`\
void f() 
{
  someFunction();
  if (true, false) 
  {
    f();
  }
}
`, animationTime),
        cppr().code(`\
void f() 
{
    someFunction();
    if (true, false) 
    {
        f();
    }
}`, animationTime),
        ct().code(`\
IndentWidth: 4
`, animationTime)
    );

    yield* beginSlide("10");
    yield* all(
        txt().text("10", 0),
        cppl().code(`\
LoongReturnType
LoongFunctionDeclaration();
`, animationTime),
        cppr().code(`\
LoongReturnType
    LoongFunctionDeclaration();
`, animationTime),
        ct().code(`\
IndentWrappedFunctionNames: true
`, animationTime)
    );

    yield* beginSlide("11");
    yield* all(
        txt().text("11", 0),
        cppl().code(`\
int main()
{
  int q = 0;
}
`, animationTime),
        cppr().code(`\
int main()
{
    int q = 0;
}
`, animationTime),
        ct().code(`\
TabWidth: 4
UseTab: Never
`, animationTime)
    );

    yield* beginSlide("12");
    yield* all(
        txt().text("12", 0),
        cppl().code(`\
someLongFunction(argument1,
    argument2);
`, animationTime),
        cppr().code(`\
someLongFunction(argument1,
                 argument2);
`, animationTime),
        ct().code(`\
AlignAfterOpenBracket: Align
`, animationTime)
    );

    yield* beginSlide("13");
    yield* all(
        txt().text("13", 0),
        cppl().code(`\
double abcd = 3;

int g       = 4;

int d    = 3;
/* A comment. */
double e = 4;

unsigned i;
int      (*f)();

a   &= 2;
bbb  = 2; 

a >>= 2;
bbb = 2; \
`, animationTime),
        cppr().code(`\
double abcd = 3;

int g = 4;

int d = 3;
/* A comment. */
double e = 4;

unsigned i;
int (*f)();

a &= 2;
bbb = 2;

a   >>= 2;
bbb   = 2;\
`, animationTime),
        ct().code(`\
AlignConsecutiveAssignments:
  Enabled: true
  AcrossEmptyLines: false
  AcrossComments: false
  AlignCompound: false
  AlignFunctionPointers: false
  PadOperators: true
`, animationTime)
    );

    yield* beginSlide("14");
    yield* all(
        txt().text("14", 0),
        cppl().code(`\
struct X
{
    int aaaa : 1;
    int b : 12;
    int ccc : 8;
};
`, animationTime),
        cppr().code(`\
struct X
{
    int aaaa : 1;
    int b    : 12;
    int ccc  : 8;
};

`, animationTime),
        ct().code(`\
AlignConsecutiveBitFields:
  Enabled: true
  AcrossEmptyLines: false
  AcrossComments: false
  AlignCompound: false
  AlignFunctionPointers: false
  PadOperators: true
`, animationTime)
    );

    yield* beginSlide("15");
    yield* all(
        txt().text("15", 0),
        cppl().code(`\
int aaaaa = 12;
float begg = 23;
double gggg = 0.0;
`, animationTime),
        cppr().code(`\
int    aaaaa = 12;
float  begg  = 23;
double gggg  = 0.0;
`, animationTime),
        ct().code(`\
AlignConsecutiveDeclarations:
  Enabled: true
  AcrossEmptyLines: false
  AcrossComments: false
  AlignCompound: false
  AlignFunctionPointers: false
  PadOperators: true
`, animationTime)
    );

    yield* beginSlide("16");
    yield* all(
        txt().text("16", 0),
        cppl().code(`\
#define SHORT_NAME 42
#define LONGER_NAME 0x007f
#define EVEN_LONGER_NAME (2)
#define foo(x) (x * x)
#define bar(y, z) (y + z)
`, animationTime),
        cppr().code(`\
#define SHORT_NAME       42
#define LONGER_NAME      0x007f
#define EVEN_LONGER_NAME (2)
#define foo(x)           (x * x)
#define bar(y, z)        (y + z)
`, animationTime),
        ct().code(`\
AlignConsecutiveMacros:
  Enabled: true
  AcrossEmptyLines: false
  AcrossComments: false
  AlignCompound: false
  AlignFunctionPointers: false
  PadOperators: true
`, animationTime)
    );

    yield* beginSlide("17");
    yield* all(
        txt().text("17", 0),
        cppl().code(`\
#define A \\
  int aaaa; \\
  int b; \\
  int dddddddddd;
`, animationTime),
        cppr().code(`\
#define A   \\
  int aaaa; \\
  int b;    \\
  int dddddddddd;
`, animationTime),
        ct().code(`\
AlignEscapedNewlines: Left
`, animationTime)
    );

    yield* beginSlide("18");
    yield* all(
        txt().text("18", 0),
        cppl().code(`\
int aaa = gggggggggg +
          bbbbbbbbbbbbbbb +
          ccccccccccccccc;
`, animationTime),
        cppr().code(`\
int aaa = gggggggggg      +
          bbbbbbbbbbbbbbb +
          ccccccccccccccc;
`, animationTime),
        ct().code(`\
AlignOperands: Left
`, animationTime)
    );

    yield* beginSlide("19");
    yield* all(
        txt().text("19", 0),
        cppl().code(`\
int a;    // comment
int ab;       // comment

int abc;  // comment
int abcd;     // comment
`, animationTime),
        cppr().code(`\
int a;  // comment
int ab; // comment

int abc;  // comment
int abcd; // comment
`, animationTime),
        ct().code(`\
AlignTrailingComments: true
`, animationTime)
    );

    yield* beginSlide("20");
    yield* all(
        txt().text("20", 0),
        cppl().code(`\
callFunction(
    a, b, c, d);
`, animationTime),
        cppr().code(`\
callFunction(a,
             b,
             c,
             d);
`, animationTime),
        ct().code(`\
AllowAllArgumentsOnNextLine: false
`, animationTime)
    );

    yield* beginSlide("21");
    yield* all(
        txt().text("21", 0),
        cppl().code(`\
void myFunction(
    int a, int b, int c, int d, int e);
`, animationTime),
        cppr().code(`\
void myFunction(int a,
                int b,
                int c,
                int d,
                int e);
`, animationTime),
        ct().code(`\
AllowAllParametersOfDeclarationOnNextLine: false
`, animationTime)
    );

    yield* beginSlide("22");
    yield* all(
        txt().text("22", 0),
        cppl().code(`\
while (true) {}

while (true) { continue; }
`, animationTime),
        cppr().code(`\
while (true) 
{
}

while (true) 
{
    continue;
}
`, animationTime),
        ct().code(`\
AllowShortBlocksOnASingleLine: Never
`, animationTime)
    );

    yield* beginSlide("23");
    yield* all(
        txt().text("23", 0),
        cppl().code(`\
switch (a) 
{
    case 1: x = 1; break;
    case 2: return;
}
`, animationTime),
        cppr().code(`\
switch (a) 
{
    case 1: 
        x = 1; break;
    case 2: 
        return;
}
`, animationTime),
        ct().code(`\
AllowShortCaseLabelsOnASingleLine: Never
`, animationTime)
    );

    yield* beginSlide("24");
    yield* all(
        txt().text("24", 0),
        cppl().code(`\
enum X { A, B };
`, animationTime),
        cppr().code(`\
enum X 
{
    A,
    B
};
`, animationTime),
        ct().code(`\
AllowShortEnumsOnASingleLine: false
`, animationTime)
    );

    yield* beginSlide("25");
    yield* all(
        txt().text("25", 0),
        cppl().code(`\
int f() { return 0; }
`, animationTime),
        cppr().code(`\
int f() 
{ 
    return 0; 
}
`, animationTime),
        ct().code(`\
AllowShortFunctionsOnASingleLine: None
`, animationTime)
    );


    yield* beginSlide("26");
    yield* all(
        txt().text("26", 0),
        cppl().code(`\
if (a) { return; }
`, animationTime),
        cppr().code(`\
if (a) 
{
    return;
}
`, animationTime),
        ct().code(`\
AllowShortIfStatementsOnASingleLine: Never
`, animationTime)
    );


    yield* beginSlide("27");
    yield* all(
        txt().text("27", 0),
        cppl().code(`\
while (true) { continue; }
`, animationTime),
        cppr().code(`\
while (true) 
{
    continue;
}
`, animationTime),
        ct().code(`\
AllowShortLoopsOnASingleLine: false
`, animationTime)
    );


    yield* beginSlide("28");
    yield* all(
        txt().text("28", 0),
        cppl().code(`\
auto lambda = [](int a) 
{
};
`, animationTime),
        cppr().code(`\
auto lambda = [](int a) {};
`, animationTime),
        ct().code(`\
AllowShortLambdasOnASingleLine: All
`, animationTime)
    );


    yield* beginSlide("29");
    yield* all(
        txt().text("29", 0),
        cppl().code(`\
int 
f();
`, animationTime),
        cppr().code(`\
int f();
`, animationTime),
        ct().code(`\
BreakAfterReturnType: Automatic
`, animationTime)
    );


    yield* beginSlide("30");
    yield* all(
        txt().text("30", 0),
        cppl().code(`\
std::string aaaa = "bbbb"
                   "cccc";
`, animationTime),
        cppr().code(`\
std::string aaaa = 
                "bbbb"
                "cccc";
`, animationTime),
        ct().code(`\
AlwaysBreakBeforeMultilineStrings: true
`, animationTime)
    );

    yield* beginSlide("31");
    yield* all(
        txt().text("31", 0),
        cppl().code(`\
template <typename T> T foo() 
{
}
`, animationTime),
        cppr().code(`\
template <typename T> 
T foo() 
{
}
`, animationTime),
        ct().code(`\
AlwaysBreakTemplateDeclarations: Yes
`, animationTime)
    );

    yield* beginSlide("32");
    yield* all(
        txt().text("32", 0),
        cppl().code(`\
template <typename T> concept C = ...;
`, animationTime),
        cppr().code(`\
template <typename T> 
concept C = ...;
`, animationTime),
        ct().code(`\
BreakBeforeConceptDeclarations: true
`, animationTime)
    );


    yield* beginSlide("33");
    yield* all(
        txt().text("33", 0),
        cppl().code(`\
VeryVeryLongDescription ?
    firstValue :
    SecondValueVeryVeryVeryVeryLong;
`, animationTime),
        cppr().code(`\
VeryVeryLongDescription
    ? firstValue
    : SecondValueVeryVeryVeryVeryLong;
`, animationTime),
        ct().code(`\
BreakBeforeTernaryOperators: true
`, animationTime)
    );

    yield* beginSlide("34");
    yield* all(
        txt().text("34", 0),
        cppl().code(`\
Constructor()
    : initializer1{}
    , initializer2{}
`, animationTime),
        cppr().code(`\
Constructor() :
    initializer1{},
    initializer2{}
`, animationTime),
        ct().code(`\
BreakConstructorInitializers: AfterColon
`, animationTime)
    );

    yield* beginSlide("35");
    yield* all(
        txt().text("35", 0),
        cppl().code(`\
bool value = + aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                     == aaaaaaaaaaaaaaaaaaaaaaa
                 && aaaaaaaaaaaaaaaaaaaaaaaaaaa
             > aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                 cccccccccccccccccccccccccccccc;
`, animationTime),
        cppr().code(`\
bool value = aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa +
                     aaaaaaaaaaaaaaaaaaaaaaaaaa ==
                 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa &&
             aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa >
                 cccccccccccccccccccccccccccccc;
`, animationTime),
        ct().code(`\
BreakBeforeBinaryOperators: None
`, animationTime)
    );

    yield* beginSlide("36");
    yield* all(
        txt().text("36", 0),
        cppl().code(`\
class Foo
    : Base1
    , Base2
{};
`, animationTime),
        cppr().code(`\
class Foo :
    Base1,
    Base2
{};
`, animationTime),
        ct().code(`\
BreakInheritanceList: AfterColon
`, animationTime)
    );

    yield* beginSlide("37");
    yield* all(
        txt().text("37", 0),
        cppl().code(`\
const char* x =
    "veryVeryVery"
    "VeryVeryVery"
    "VeryLongString";
`, animationTime),
        cppr().code(`\
const char* x =
    "veryVeryVeryVeryVeryVeryVeryLongString";
`, animationTime),
        ct().code(`\
BreakStringLiterals: false
`, animationTime)
    );

    yield* beginSlide("38");
    yield* all(
        txt().text("38", 0),
        cppl().code(`\
f(aaaaaaaaaaaaaaaaaaaa, aaaaaaaaaaaaaaaaaaaa,
  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
`, animationTime),
        cppr().code(`\
f(aaaaaaaaaaaaaaaaaaaa, 
  aaaaaaaaaaaaaaaaaaaa,
  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa);
`, animationTime),
        ct().code(`\
BinPackArguments: false
`, animationTime)
    );


    yield* beginSlide("39");
    yield* all(
        txt().text("39", 0),
        cppl().code(`\
void f(int a, int bbbbbbbbbbbbbbbbbbb,
       int cccccccccccccccccccccccccc);
`, animationTime),
        cppr().code(`\
void f(int a, int b, int c);

void f(int a,
       int bbbbbbbbbbbbbbbbbbb,
       int ccccccccccccccccccccccccccccccccccccc);
`, animationTime),
        ct().code(`\
BinPackParameters: false
`, animationTime)
    );

    yield* beginSlide("40");
    yield* all(
        txt().text("40", 0),
        cppl().code(`\
X::X() 
    : m_value{}
{
    
}
`, animationTime),
        cppr().code(`\
X::X() 
: m_value{}
{

}
`, animationTime),
        ct().code(`\
ConstructorInitializerIndentWidth: 0
`, animationTime)
    );

    yield* beginSlide("41");
    yield* all(
        txt().text("41", 0),
        cppl().code(`\
vector<int> x{ 1, 2, 3, 4 };
vector<T> x{ {}, {}, {}, {} };
f(MyMap[{ composite, key }]);
new int[3]{ 1, 2, 3 };
`, animationTime),
        cppr().code(`\
vector<int> x{1, 2, 3, 4};
vector<T> x{{}, {}, {}, {}};
f(MyMap[{composite, key}]);
new int[3]{1, 2, 3};
`, animationTime),
        ct().code(`\
Cpp11BracedListStyle: true
`, animationTime)
    );

    yield* beginSlide("42");
    yield* all(
        txt().text("42", 0),
        cppl().code(`\
class X {
};

void fff() {
}

while (true) {
}

if (true) {
}
`, animationTime),
        cppr().code(`\
class X 
{
};

void fff() 
{
}

while (true) 
{
}

if (true) 
{
}\
`, animationTime),
        ct().code(`\
BreakBeforeBraces: Custom
BraceWrapping:
  AfterCaseLabel: true
  AfterClass: true
  AfterControlStatement: Always
  AfterEnum: true
  AfterFunction: true \
`, animationTime)
    );


    yield* beginSlide("43");
    yield* all(
        txt().text("43", 0),
        cppl().code(`\
namespace Foo { namespace Bar {
    // ...
}}

namespace Foo 
{
    namespace Bar
    {
        // ...
    }
}
`, animationTime),
        cppr().code(`\
namespace Foo
{
namespace Bar
{
    // ...
} // namespace Bar
} // namespace Foo
`, animationTime),
        ct().code(`\
CompactNamespaces: false
FixNamespaceComments: true
NamespaceIndentation: None
`, animationTime)
    );


    yield* beginSlide("44");
    yield* all(
        txt().text("44", 0),
        cppl().code(`\
`, animationTime),
        cppr().code(`\
`, animationTime),
        ct().code(`\
DeriveLineEnding: false
DerivePointerAlignment: false
`, animationTime)
    );

    yield* beginSlide("45");
    yield* all(
        txt().text("45", 0),
        cppl().code(`\
int x;





int j;

class X
{
public:
    X();
private:
    int value;
}; \
`, animationTime),
        cppr().code(`\
int x;


int y;

class X
{
public:
    X();

private:
    int value;
};
`, animationTime),
        ct().code(`\
EmptyLineBeforeAccessModifier: Always
KeepEmptyLines:
  AtEndOfFile: true
  AtStartOfBlock: false
  AtStartOfFile: false
MaxEmptyLinesToKeep: 2
`, animationTime)
    );

    yield* beginSlide("46");

    yield* all(
        txt().text("46", 0),
        cppl().code(`\
#include <iostream>
#include "Foo.h"
#include <cstring>
#include <Bar.hpp>`, animationTime),
        cppr().code(`\
#include <iostream>
#include <cstring>

#include <Bar.hpp>

#include "Foo.hpp"`, animationTime),
        ct().code(`\
IncludeBlocks: Regroup
IncludeCategories:
  - Priority: 101
    Regex: ^<(.+hpp)>$
  - Priority: 100
    Regex: ^<(.+)>$
  - Priority: 200
    Regex: ^\"(.+)\"$
SortIncludes: true
SortUsingDeclarations: true
`, animationTime),
            n().position([0, 0], animationTime)
    );


    yield* beginSlide("47");
    yield* all(
        txt().text("47", 0),
        cppl().code(`\
const char* x = "qqq" "www";
int x;
x = 1 = 2 = 3 = 4 = 5;
`, animationTime),
        cppr().code(`\
const char* x = "qqqwww";
int x;
x = 5;
`, animationTime),
        ct().code(`\
PenaltyBreakAssignment: 1000
PenaltyBreakBeforeFirstCallParameter: 1000
PenaltyBreakComment: 200
PenaltyBreakFirstLessLess: 100
PenaltyBreakString: 1
PenaltyBreakTemplateDeclaration: 0
PenaltyExcessCharacter: 5
PenaltyIndentedWhitespace: 1
PenaltyReturnTypeOnItsOwnLine: 500


`, animationTime),
            n().position([0, 0], animationTime)
    );

    yield* beginSlide("48");
    yield* all(
        txt().text("48", 0),
        cppl().code(`\
char * p = nullptr;

char *p = nullptr;
`, animationTime),
        cppr().code(`\
char* p = nullptr;
`, animationTime),
        ct().code(`\
PointerAlignment: Left
`, animationTime),
            n().position([0, 150], animationTime)
    );

    yield* beginSlide("49");
    yield* all(
        txt().text("49", 0),
        cppl().code(`\
// VeryVeryVery
// VeryVeryVery
// VeryVeryVeryLongComment
`, animationTime),
        cppr().code(`\
// VeryVeryVeryVeryVeryVeryVeryVeryVeryLongComment
`, animationTime),
        ct().code(`\
ReflowComments: false
`, animationTime),
            n().position([0, 150], animationTime)
    );

    yield* beginSlide("50");
    yield* all(
        txt().text("50", 0),
        cppl().code(`\
if ( true )
{
}

while ( true )
{
}

template<typename T>
struct X;
`, animationTime),
        cppr().code(`\
if (true)
{
}

while (true)
{
}

template <typename T>
struct X;
`, animationTime),
        ct().code(`\
SpaceAfterCStyleCast: false
SpaceAfterLogicalNot: false
SpaceAfterTemplateKeyword: true
SpaceAroundPointerQualifiers: Default
SpaceBeforeAssignmentOperators: true
SpaceBeforeCaseColon: false
SpaceBeforeCpp11BracedList: false
SpaceBeforeCtorInitializerColon: true
SpaceBeforeInheritanceColon: true
SpaceBeforeParens: ControlStatements
SpaceBeforeRangeBasedForLoopColon: true
SpaceBeforeSquareBrackets: false
SpaceInEmptyBlock: false \
`, animationTime),
            n().position([0, 0], animationTime),
    );

    yield* beginSlide("51");
    yield* all(
        txt().text("51", 0),
        cppl().code(`\
`, animationTime),
        cppr().code(`\
`, animationTime),
        ct().code(`\
UseCRLF: false
`, animationTime),
            n().position([0, 150], animationTime),
    );

    yield* beginSlide("52");
    yield* all(
        txt().text("52", 0),
        cppl().code(`\
int a = 16382;

int b = 0b101001010100;

int c = 0xFXABCFDH;
`, animationTime),
        cppr().code(`\
int a = 16'382;

int b = 0b1010'0101'0100;

int c = 0xFX'AB'CF'DH;
`, animationTime),
        ct().code(`\
IntegerLiteralSeparator:
  Binary: 4
  Decimal: 3
  Hex: 2
`, animationTime),
            n().position([0, 150], animationTime),
    );

    yield* beginSlide("53");
    yield* all(
        txt().text("53", 0),
        cppl().code(`\
volatile constexpr static inline const int = 1;
`, animationTime),
        cppr().code(`\
static inline constexpr const volatile int = 1;
`, animationTime),
        ct().code(`\
QualifierAlignment: Custom
QualifierOrder:
  - static
  - inline
  - constexpr
  - const
  - volatile
  - type`, animationTime),
            n().position([0, 150], animationTime),
    );

    yield* beginSlide("End");
})





