import { CODE, Knot, Layout, lines, makeScene2D, Spline, word } from "@motion-canvas/2d";
import { Vscode } from "../../components/Vscode";
import { all, AudioManager, beginSlide, createRef, createSignal, DEFAULT } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { MyRect } from "../../components/My/MyRect";
import { Console } from "../../components/Console";
import { animationTime, colorBlue, colorGreen, colorRed, colorSemiSemiBlack, colorWhiteBlue, gapBig, lineWidthBorderGrid, lineWidthGrid, lineWidthNormal, paddingBig, radiusNormal } from "../../theme/Theme";
import { MyTxt } from "../../components/My/MyTxt";

const os_release = [
    'PRETTY_NAME="Ubuntu 24.04.2 LTS"',
    'NAME="Ubuntu"',
    'VERSION_ID="24.04"',
    'VERSION="24.04.2 LTS (Noble Numbat)"',
    'VERSION_CODENAME=noble',
    'ID=ubuntu',
    'ID_LIKE=debian',
    'HOME_URL="https://www.ubuntu.com/"',
    'SUPPORT_URL="https://help.ubuntu.com/"',
    'BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"',
    'PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"',
    'UBUNTU_CODENAME=noble',
    'LOGO=ubuntu-logo',
]

const cmake_debug_1 = [
'cmake --preset debug',
'Preset CMake variables:',
'',
'  CMAKE_ARCHIVE_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_BUILD_TYPE="Debug"',
'  CMAKE_CXX_EXTENSIONS="OFF"',
'  CMAKE_CXX_STANDARD="17"',
'  CMAKE_CXX_STANDARD_REQUIRED="ON"',
'  CMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++"',
'  CMAKE_EXPORT_COMPILE_COMMANDS="ON"',
'  CMAKE_LIBRARY_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_POSITION_INDEPENDENT_CODE="ON"',
'  CMAKE_RUNTIME_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/bin"',
'',
'-- The C compiler identification is GNU 13.3.0',
'-- The CXX compiler identification is GNU 13.3.0',
'-- Detecting C compiler ABI info',
'-- Detecting C compiler ABI info - done',
'-- Check for working C compiler: /usr/bin/cc - skipped',
'-- Detecting C compile features',
'-- Detecting C compile features - done',
'-- Detecting CXX compiler ABI info',
'-- Detecting CXX compiler ABI info - done',
'-- Check for working CXX compiler: /usr/bin/c++ - skipped',
'-- Detecting CXX compile features',
'-- Detecting CXX compile features - done',
'CMAKE_INSTALL_LIBDIR=lib',
'CMAKE_CXX_VISIBILITY_PRESET=',
'CMAKE_CXX_VISIBILITY_PRESET=hidden',
'-- Performing Test COMPILER_HAS_HIDDEN_VISIBILITY',
'-- Performing Test COMPILER_HAS_HIDDEN_VISIBILITY - Success',
'-- Performing Test COMPILER_HAS_HIDDEN_INLINE_VISIBILITY',
'-- Performing Test COMPILER_HAS_HIDDEN_INLINE_VISIBILITY - Success',
'-- Performing Test COMPILER_HAS_DEPRECATED_ATTR',
'-- Performing Test COMPILER_HAS_DEPRECATED_ATTR - Success',
'-- Performing Test CMAKE_HAVE_LIBC_PTHREAD',
'-- Performing Test CMAKE_HAVE_LIBC_PTHREAD - Success',
'-- Found Threads: TRUE  ',
]

const cmake_debug_1_error = [
'CMake Error at src/domain/CMakeLists.txt:23 (find_package):',
'  By not providing "Findfmt.cmake" in CMAKE_MODULE_PATH this project has',
'  asked CMake to find a package configuration file provided by "fmt", but',
'  CMake did not find one.',
'',
'  Could not find a package configuration file provided by "fmt" with any of',
'  the following names:',
'',
'    fmtConfig.cmake',
'    fmt-config.cmake',
'',
'  Add the installation prefix of "fmt" to CMAKE_PREFIX_PATH or set "fmt_DIR"',
'  to a directory containing one of the above files.  If "fmt" provides a',
'  separate development package or SDK, be sure it has been installed.',
]

const fmt_installed = [
'    Reading package lists... Done',
'Building dependency tree... Done',
'Reading state information... Done',
'The following additional packages will be installed:',
'  libfmt9',
'Suggested packages:',
'  libfmt-doc',
'The following NEW packages will be installed:',
'  libfmt-dev libfmt9',
'0 upgraded, 2 newly installed, 0 to remove and 1 not upgraded.',
'Need to get 185 kB of archives.',
'After this operation, 759 kB of additional disk space will be used.',
'Get:1 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 libfmt9 amd64 9.1.0+ds1-2 [63.0 kB]',
'Get:2 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 libfmt-dev amd64 9.1.0+ds1-2 [122 kB]',
'Fetched 185 kB in 1s (293 kB/s)     ',
'Selecting previously unselected package libfmt9:amd64.',
'(Reading database ... 245120 files and directories currently installed.)',
'Preparing to unpack .../libfmt9_9.1.0+ds1-2_amd64.deb ...',
'Unpacking libfmt9:amd64 (9.1.0+ds1-2) ...',
'Selecting previously unselected package libfmt-dev:amd64.',
'Preparing to unpack .../libfmt-dev_9.1.0+ds1-2_amd64.deb ...',
'Unpacking libfmt-dev:amd64 (9.1.0+ds1-2) ...',
'Setting up libfmt9:amd64 (9.1.0+ds1-2) ...',
'Setting up libfmt-dev:amd64 (9.1.0+ds1-2) ...',
'Processing triggers for libc-bin (2.39-0ubuntu8.4) ...',
]

const cmake_debug_2 = [
'cmake --preset debug',
'Preset CMake variables:',
'',
'  CMAKE_ARCHIVE_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_BUILD_TYPE="Debug"',
'  CMAKE_CXX_EXTENSIONS="OFF"',
'  CMAKE_CXX_STANDARD="17"',
'  CMAKE_CXX_STANDARD_REQUIRED="ON"',
'  CMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++"',
'  CMAKE_EXPORT_COMPILE_COMMANDS="ON"',
'  CMAKE_LIBRARY_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_POSITION_INDEPENDENT_CODE="ON"',
'  CMAKE_RUNTIME_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/bin"',
'',
'CMAKE_INSTALL_LIBDIR=lib',
'CMAKE_CXX_VISIBILITY_PRESET=',
'CMAKE_CXX_VISIBILITY_PRESET=hidden',
]

const cmake_debug_2_error = [
'CMake Error at /usr/share/cmake-3.28/Modules/FindPackageHandleStandardArgs.cmake:230 (message):',
'  Could NOT find PkgConfig (missing: PKG_CONFIG_EXECUTABLE)',
'Call Stack (most recent call first):',
'  /usr/share/cmake-3.28/Modules/FindPackageHandleStandardArgs.cmake:600 (_FPHSA_FAILURE_MESSAGE)',
'  /usr/share/cmake-3.28/Modules/FindPkgConfig.cmake:99 (find_package_handle_standard_args)',
'  src/infrastructure/CMakeLists.txt:28 (find_package)',
]

const pkg_config_installed = [
'Reading package lists... Done',
'Building dependency tree... Done',
'Reading state information... Done',
'The following additional packages will be installed:',
'  libpkgconf3 pkgconf pkgconf-bin',
'The following NEW packages will be installed:',
'  libpkgconf3 pkg-config pkgconf pkgconf-bin',
'0 upgraded, 4 newly installed, 0 to remove and 1 not upgraded.',
'Need to get 75.4 kB of archives.',
'After this operation, 283 kB of additional disk space will be used.',
'Get:1 http://ru.archive.ubuntu.com/ubuntu noble/main amd64 libpkgconf3 amd64 1.8.1-2build1 [30.7 kB]',
'Get:2 http://ru.archive.ubuntu.com/ubuntu noble/main amd64 pkgconf-bin amd64 1.8.1-2build1 [20.7 kB]',
'Get:3 http://ru.archive.ubuntu.com/ubuntu noble/main amd64 pkgconf amd64 1.8.1-2build1 [16.8 kB]',
'Get:4 http://ru.archive.ubuntu.com/ubuntu noble/main amd64 pkg-config amd64 1.8.1-2build1 [7,264 B]',
'Fetched 75.4 kB in 0s (205 kB/s)      ',
'Selecting previously unselected package libpkgconf3:amd64.',
'(Reading database ... 245150 files and directories currently installed.)',
'Preparing to unpack .../libpkgconf3_1.8.1-2build1_amd64.deb ...',
'Unpacking libpkgconf3:amd64 (1.8.1-2build1) ...',
'Selecting previously unselected package pkgconf-bin.',
'Preparing to unpack .../pkgconf-bin_1.8.1-2build1_amd64.deb ...',
'Unpacking pkgconf-bin (1.8.1-2build1) ...',
'Selecting previously unselected package pkgconf:amd64.',
'Preparing to unpack .../pkgconf_1.8.1-2build1_amd64.deb ...',
'Unpacking pkgconf:amd64 (1.8.1-2build1) ...',
'Selecting previously unselected package pkg-config:amd64.',
'Preparing to unpack .../pkg-config_1.8.1-2build1_amd64.deb ...',
'Unpacking pkg-config:amd64 (1.8.1-2build1) ...',
'Setting up libpkgconf3:amd64 (1.8.1-2build1) ...',
'Setting up pkgconf-bin (1.8.1-2build1) ...',
'Setting up pkgconf:amd64 (1.8.1-2build1) ...',
'Setting up pkg-config:amd64 (1.8.1-2build1) ...',
'Processing triggers for man-db (2.12.0-4build2) ...',
'Processing triggers for libc-bin (2.39-0ubuntu8.4) ...',
]

const cmake_debug_3 = [
'cmake --preset debug',
'Preset CMake variables:',
'',
'  CMAKE_ARCHIVE_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_BUILD_TYPE="Debug"',
'  CMAKE_CXX_EXTENSIONS="OFF"',
'  CMAKE_CXX_STANDARD="17"',
'  CMAKE_CXX_STANDARD_REQUIRED="ON"',
'  CMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++"',
'  CMAKE_EXPORT_COMPILE_COMMANDS="ON"',
'  CMAKE_LIBRARY_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_POSITION_INDEPENDENT_CODE="ON"',
'  CMAKE_RUNTIME_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/bin"',
'',
'CMAKE_INSTALL_LIBDIR=lib',
'CMAKE_CXX_VISIBILITY_PRESET=',
'CMAKE_CXX_VISIBILITY_PRESET=hidden',
'-- Found PkgConfig: /usr/bin/pkg-config (found version "1.8.1") ',
'-- Checking for module \'nanomsg\'',
'--   Package \'nanomsg\', required by \'virtual:world\', not found',
]

const cmake_debug_3_error = [
'CMake Error at /usr/share/cmake-3.28/Modules/FindPkgConfig.cmake:619 (message):',
'  The following required packages were not found:',
'',
'   - nanomsg',
'',
'Call Stack (most recent call first):',
'  /usr/share/cmake-3.28/Modules/FindPkgConfig.cmake:841 (_pkg_check_modules_internal)',
'  src/infrastructure/CMakeLists.txt:29 (pkg_check_modules)',
]

const libnanomsg_dev = [
'Reading package lists... Done',
'Building dependency tree... Done',
'Reading state information... Done',
'The following additional packages will be installed:',
'  libnanomsg5',
'The following NEW packages will be installed:',
'  libnanomsg-dev libnanomsg5',
'0 upgraded, 2 newly installed, 0 to remove and 1 not upgraded.',
'Need to get 143 kB of archives.',
'After this operation, 1,590 kB of additional disk space will be used.',
'Get:1 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 libnanomsg5 amd64 1.1.5+dfsg-1.1 [102 kB]',
'Get:2 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 libnanomsg-dev amd64 1.1.5+dfsg-1.1 [41.1 kB]',
'Fetched 143 kB in 0s (310 kB/s)          ',
'Selecting previously unselected package libnanomsg5.',
'(Reading database ... 245182 files and directories currently installed.)',
'Preparing to unpack .../libnanomsg5_1.1.5+dfsg-1.1_amd64.deb ...',
'Unpacking libnanomsg5 (1.1.5+dfsg-1.1) ...',
'Selecting previously unselected package libnanomsg-dev.',
'Preparing to unpack .../libnanomsg-dev_1.1.5+dfsg-1.1_amd64.deb ...',
'Unpacking libnanomsg-dev (1.1.5+dfsg-1.1) ...',
'Setting up libnanomsg5 (1.1.5+dfsg-1.1) ...',
'Setting up libnanomsg-dev (1.1.5+dfsg-1.1) ...',
'Processing triggers for libc-bin (2.39-0ubuntu8.4) ...',
]

const dockerAstra = [
'FROM dockerhub.lemz.t/library/astralinux:se1.7',
'',
'RUN rm /etc/apt/preferences.d/smolensk                                                    && \\',
'    echo "deb http://repo.lemz.t/debs/ports/astra/smolensk1.7 smolensk main" >> /etc/.../ && \\',
'    echo "deb http://repo.lemz.t/debs/ports/any/stable stable main" >> /etc/apt/...       && \\',
'    apt-get -y update                                                                     && \\',
'    apt-get -y upgrade                                                                    && \\',
'    apt-get -y install                                                                       \\',
'    libgtest-dev                                                                             \\',
'    libgmock-dev                                                                             \\',
'    libyaml-cpp-dev                                                                          \\',
'    pkg-config                                                                               \\',
'    ninja-build                                                                              \\',
'    libnanomsg-dev                                                                           \\',
'    libfmt-dev=6.1.2+ds-2                                                                    \\',
'    g++                                                                                      \\',
'    zlib1g-dev                                                                               \\',
'    libcurl4-openssl-dev                                                                     \\',
'    cmake                                                                                    \\',
'    git                                                                                      \\',
'    prometheus-cpp-dev                                                                       \\',
'    python3                                                                                  \\',
'    clangd                                                                                   \\',
'    gdb                                                                                      \\',
'    python3-pip                                                                           && \\',
'    python3 -m pip install yandex-taxi-testsuite nanomsg                                  && \\',
'    apt-get -y autoremove                                                                 && \\',
'    apt-get -y autoclean                                                                  && \\',
'    rm -rf /var/lib/apt/lists/*'
]

const cmake_debug_4 = [
'cmake --preset debug',
'Preset CMake variables:',
'',
'  CMAKE_ARCHIVE_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_BUILD_TYPE="Debug"',
'  CMAKE_CXX_EXTENSIONS="OFF"',
'  CMAKE_CXX_STANDARD="17"',
'  CMAKE_CXX_STANDARD_REQUIRED="ON"',
'  CMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++"',
'  CMAKE_EXPORT_COMPILE_COMMANDS="ON"',
'  CMAKE_LIBRARY_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_POSITION_INDEPENDENT_CODE="ON"',
'  CMAKE_RUNTIME_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/bin"',
'',
'CMAKE_INSTALL_LIBDIR=lib',
'CMAKE_CXX_VISIBILITY_PRESET=',
'CMAKE_CXX_VISIBILITY_PRESET=hidden',
]

const cmake_debug_4_error = [
'CMake Error at src/infrastructure/CMakeLists.txt:31 (find_package):',
'  By not providing "Findyaml-cpp.cmake" in CMAKE_MODULE_PATH this project has',
'  asked CMake to find a package configuration file provided by "yaml-cpp",',
'  but CMake did not find one.',
'',
'  Could not find a package configuration file provided by "yaml-cpp" with any',
'  of the following names:',
'',
'    yaml-cppConfig.cmake',
'    yaml-cpp-config.cmake',
'',
'  Add the installation prefix of "yaml-cpp" to CMAKE_PREFIX_PATH or set',
'  "yaml-cpp_DIR" to a directory containing one of the above files.  If',
'  "yaml-cpp" provides a separate development package or SDK, be sure it has',
'  been installed.',
]

const apt_install = [
'libgtest-dev         \\',
'libgmock-dev         \\',
'libyaml-cpp-dev      \\',
'pkg-config           \\',
'ninja-build          \\',
'libnanomsg-dev       \\',
'libfmt-dev=6.1.2+ds-2\\',
'g++                  \\',
'zlib1g-dev           \\',
'libcurl4-openssl-dev \\',
'cmake                \\',
'git                  \\',
'prometheus-cpp-dev   \\',
'python3              \\',
'clangd               \\',
'gdb                  \\',
'python3-pip',
];

const apt_install_good = [
'libgtest-dev         \\',
'libgmock-dev         \\',
'libyaml-cpp-dev      \\',
'pkg-config           \\',
'ninja-build          \\',
'libnanomsg-dev       \\',
'libfmt-dev           \\',
'g++                  \\',
'zlib1g-dev           \\',
'libcurl4-openssl-dev \\',
'cmake                \\',
'git                  \\',
'prometheus-cpp-dev   \\',
'python3              \\',
'clangd               \\',
'gdb                  \\',
'python3-pip',
];

const apt_install_error = [
'Reading package lists... Done',
'Building dependency tree... Done',
'Reading state information... Done',
'Package libfmt-dev is not available, but is referred to by another package.',
'This may mean that the package is missing, has been obsoleted, or',
'is only available from another source',
'',
"E: Version '6.1.2+ds-2' for 'libfmt-dev' was not found",
]

const apt_install_compelete = [
'Reading package lists... Done',
'Building dependency tree... Done',
'Reading state information... Done',
'pkg-config is already the newest version (1.8.1-2build1).',
'ninja-build is already the newest version (1.11.1-2).',
'libnanomsg-dev is already the newest version (1.1.5+dfsg-1.1).',
'libfmt-dev is already the newest version (9.1.0+ds1-2).',
'g++ is already the newest version (4:13.2.0-7ubuntu1).',
'g++ set to manually installed.',
'zlib1g-dev is already the newest version (1:1.3.dfsg-3.1ubuntu2.1).',
'zlib1g-dev set to manually installed.',
'cmake is already the newest version (3.28.3-1build7).',
'git is already the newest version (1:2.43.0-1ubuntu7.2).',
'python3 is already the newest version (3.12.3-0ubuntu2).',
'python3 set to manually installed.',
'gdb is already the newest version (15.0.50.20240403-0ubuntu1).',
'gdb set to manually installed.',
'python3-pip is already the newest version (24.0+dfsg-1ubuntu1.1).',
'The following additional packages will be installed:',
'  civetweb clangd-18 googletest libcivetweb-dev libcivetweb1 libgrpc++1.51t64',
'  libgrpc29t64 libprometheus-cpp-core1.0 libprometheus-cpp-pull1.0',
'  libprometheus-cpp-push1.0 libprotoc32t64 libyaml-cpp0.8',
'Suggested packages:',
'  libcurl4-doc libidn-dev libkrb5-dev libldap2-dev librtmp-dev libssh2-1-dev',
'The following NEW packages will be installed:',
'  civetweb clangd clangd-18 googletest libcivetweb-dev libcivetweb1',
'  libcurl4-openssl-dev libgmock-dev libgrpc++1.51t64 libgrpc29t64 libgtest-dev',
'  libprometheus-cpp-core1.0 libprometheus-cpp-pull1.0',
'  libprometheus-cpp-push1.0 libprotoc32t64 libyaml-cpp-dev libyaml-cpp0.8',
'  prometheus-cpp-dev',
'0 upgraded, 18 newly installed, 0 to remove and 1 not upgraded.',
'Need to get 11.6 MB of archives.',
'After this operation, 51.6 MB of additional disk space will be used.',
'Get:1 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 libcivetweb1 amd64 1.16+dfsg-1build1 [97.7 kB]',
'Get:2 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 civetweb amd64 1.16+dfsg-1build1 [12.1 kB]',
'Get:3 http://ru.archive.ubuntu.com/ubuntu noble-updates/main amd64 libprotoc32t64 amd64 3.21.12-8.2ubuntu0.1 [683 kB]',
'Get:4 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 libgrpc29t64 amd64 1.51.1-4.1build5 [2,768 kB]',
'Get:5 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 libgrpc++1.51t64 amd64 1.51.1-4.1build5 [481 kB]',
'Get:6 http://ru.archive.ubuntu.com/ubuntu noble-updates/universe amd64 clangd-18 amd64 1:18.1.3-1ubuntu1 [5,540 kB]',
'Get:7 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 clangd amd64 1:18.0-59~exp2 [5,522 B]',
'Get:8 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 googletest all 1.14.0-1 [521 kB]',
'Get:9 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 libcivetweb-dev amd64 1.16+dfsg-1build1 [25.6 kB]',
'Get:10 http://ru.archive.ubuntu.com/ubuntu noble-updates/main amd64 libcurl4-openssl-dev amd64 8.5.0-2ubuntu10.6 [446 kB]',
'Get:11 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 libgtest-dev amd64 1.14.0-1 [268 kB]',
'Get:12 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 libgmock-dev amd64 1.14.0-1 [135 kB]',
'Get:13 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 libprometheus-cpp-core1.0 amd64 1.0.2-2build2 [43.3 kB]',
'Get:14 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 libprometheus-cpp-pull1.0 amd64 1.0.2-2build2 [21.4 kB]',
'Get:15 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 libprometheus-cpp-push1.0 amd64 1.0.2-2build2 [28.8 kB]',
'Get:16 http://ru.archive.ubuntu.com/ubuntu noble/main amd64 libyaml-cpp0.8 amd64 0.8.0+dfsg-6build1 [115 kB]',
'Get:17 http://ru.archive.ubuntu.com/ubuntu noble/main amd64 libyaml-cpp-dev amd64 0.8.0+dfsg-6build1 [188 kB]',
'Get:18 http://ru.archive.ubuntu.com/ubuntu noble/universe amd64 prometheus-cpp-dev amd64 1.0.2-2build2 [213 kB]',
'Fetched 11.6 MB in 2s (5,886 kB/s)           ',
'Selecting previously unselected package libcivetweb1:amd64.',
'(Reading database ... 245243 files and directories currently installed.)',
'Preparing to unpack .../00-libcivetweb1_1.16+dfsg-1build1_amd64.deb ...',
'Unpacking libcivetweb1:amd64 (1.16+dfsg-1build1) ...',
'Selecting previously unselected package civetweb.',
'Preparing to unpack .../01-civetweb_1.16+dfsg-1build1_amd64.deb ...',
'Unpacking civetweb (1.16+dfsg-1build1) ...',
'Selecting previously unselected package libprotoc32t64:amd64.',
'Preparing to unpack .../02-libprotoc32t64_3.21.12-8.2ubuntu0.1_amd64.deb ...',
'Unpacking libprotoc32t64:amd64 (3.21.12-8.2ubuntu0.1) ...',
'Selecting previously unselected package libgrpc29t64:amd64.',
'Preparing to unpack .../03-libgrpc29t64_1.51.1-4.1build5_amd64.deb ...',
'Unpacking libgrpc29t64:amd64 (1.51.1-4.1build5) ...',
'Selecting previously unselected package libgrpc++1.51t64:amd64.',
'Preparing to unpack .../04-libgrpc++1.51t64_1.51.1-4.1build5_amd64.deb ...',
'Unpacking libgrpc++1.51t64:amd64 (1.51.1-4.1build5) ...',
'Selecting previously unselected package clangd-18.',
'Preparing to unpack .../05-clangd-18_1%3a18.1.3-1ubuntu1_amd64.deb ...',
'Unpacking clangd-18 (1:18.1.3-1ubuntu1) ...',
'Selecting previously unselected package clangd:amd64.',
'Preparing to unpack .../06-clangd_1%3a18.0-59~exp2_amd64.deb ...',
'Unpacking clangd:amd64 (1:18.0-59~exp2) ...',
'Selecting previously unselected package googletest.',
'Preparing to unpack .../07-googletest_1.14.0-1_all.deb ...',
'Unpacking googletest (1.14.0-1) ...',
'Selecting previously unselected package libcivetweb-dev:amd64.',
'Preparing to unpack .../08-libcivetweb-dev_1.16+dfsg-1build1_amd64.deb ...',
'Unpacking libcivetweb-dev:amd64 (1.16+dfsg-1build1) ...',
'Selecting previously unselected package libcurl4-openssl-dev:amd64.',
'Preparing to unpack .../09-libcurl4-openssl-dev_8.5.0-2ubuntu10.6_amd64.deb ...',
'Unpacking libcurl4-openssl-dev:amd64 (8.5.0-2ubuntu10.6) ...',
'Selecting previously unselected package libgtest-dev:amd64.',
'Preparing to unpack .../10-libgtest-dev_1.14.0-1_amd64.deb ...',
'Unpacking libgtest-dev:amd64 (1.14.0-1) ...',
'Selecting previously unselected package libgmock-dev:amd64.',
'Preparing to unpack .../11-libgmock-dev_1.14.0-1_amd64.deb ...',
'Unpacking libgmock-dev:amd64 (1.14.0-1) ...',
'Selecting previously unselected package libprometheus-cpp-core1.0:amd64.',
'Preparing to unpack .../12-libprometheus-cpp-core1.0_1.0.2-2build2_amd64.deb ...',
'Unpacking libprometheus-cpp-core1.0:amd64 (1.0.2-2build2) ...',
'Selecting previously unselected package libprometheus-cpp-pull1.0:amd64.',
'Preparing to unpack .../13-libprometheus-cpp-pull1.0_1.0.2-2build2_amd64.deb ...',
'Unpacking libprometheus-cpp-pull1.0:amd64 (1.0.2-2build2) ...',
'Selecting previously unselected package libprometheus-cpp-push1.0:amd64.',
'Preparing to unpack .../14-libprometheus-cpp-push1.0_1.0.2-2build2_amd64.deb ...',
'Unpacking libprometheus-cpp-push1.0:amd64 (1.0.2-2build2) ...',
'Selecting previously unselected package libyaml-cpp0.8:amd64.',
'Preparing to unpack .../15-libyaml-cpp0.8_0.8.0+dfsg-6build1_amd64.deb ...',
'Unpacking libyaml-cpp0.8:amd64 (0.8.0+dfsg-6build1) ...',
'Selecting previously unselected package libyaml-cpp-dev:amd64.',
'Preparing to unpack .../16-libyaml-cpp-dev_0.8.0+dfsg-6build1_amd64.deb ...',
'Unpacking libyaml-cpp-dev:amd64 (0.8.0+dfsg-6build1) ...',
'Selecting previously unselected package prometheus-cpp-dev:amd64.',
'Preparing to unpack .../17-prometheus-cpp-dev_1.0.2-2build2_amd64.deb ...',
'Unpacking prometheus-cpp-dev:amd64 (1.0.2-2build2) ...',
'Setting up libprometheus-cpp-core1.0:amd64 (1.0.2-2build2) ...',
'Setting up libcivetweb1:amd64 (1.16+dfsg-1build1) ...',
'Setting up libprometheus-cpp-push1.0:amd64 (1.0.2-2build2) ...',
'Setting up libyaml-cpp0.8:amd64 (0.8.0+dfsg-6build1) ...',
'Setting up libyaml-cpp-dev:amd64 (0.8.0+dfsg-6build1) ...',
'Setting up libcivetweb-dev:amd64 (1.16+dfsg-1build1) ...',
'Setting up googletest (1.14.0-1) ...',
'Setting up libcurl4-openssl-dev:amd64 (8.5.0-2ubuntu10.6) ...',
'Setting up libprometheus-cpp-pull1.0:amd64 (1.0.2-2build2) ...',
'Setting up libprotoc32t64:amd64 (3.21.12-8.2ubuntu0.1) ...',
'Setting up civetweb (1.16+dfsg-1build1) ...',
'Setting up libgtest-dev:amd64 (1.14.0-1) ...',
'Setting up prometheus-cpp-dev:amd64 (1.0.2-2build2) ...',
'Setting up libgrpc29t64:amd64 (1.51.1-4.1build5) ...',
'Setting up libgmock-dev:amd64 (1.14.0-1) ...',
'Setting up libgrpc++1.51t64:amd64 (1.51.1-4.1build5) ...',
'Setting up clangd-18 (1:18.1.3-1ubuntu1) ...',
'Setting up clangd:amd64 (1:18.0-59~exp2) ...',
'Processing triggers for man-db (2.12.0-4build2) ...',
'Processing triggers for libc-bin (2.39-0ubuntu8.4) ...',
]

const cmake_debug_5 = [
'cmake --preset debug',
'Preset CMake variables:',
'',
'  CMAKE_ARCHIVE_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_BUILD_TYPE="Debug"',
'  CMAKE_CXX_EXTENSIONS="OFF"',
'  CMAKE_CXX_STANDARD="17"',
'  CMAKE_CXX_STANDARD_REQUIRED="ON"',
'  CMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++"',
'  CMAKE_EXPORT_COMPILE_COMMANDS="ON"',
'  CMAKE_LIBRARY_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_POSITION_INDEPENDENT_CODE="ON"',
'  CMAKE_RUNTIME_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/bin"',
'',
'CMAKE_INSTALL_LIBDIR=lib',
'CMAKE_CXX_VISIBILITY_PRESET=',
'CMAKE_CXX_VISIBILITY_PRESET=hidden',
'-- Found GTest: /usr/lib/x86_64-linux-gnu/cmake/GTest/GTestConfig.cmake (found version "1.14.0")  ',
'-- Configuring done (0.1s)',
'-- Generating done (0.0s)',
'-- Build files have been written to: /home/rtkid/Documents/fpga-router/build-debug',
]

const cmake_build = [
'cmake --preset debug',
'Preset CMake variables:',
'',
'  CMAKE_ARCHIVE_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_BUILD_TYPE="Debug"',
'  CMAKE_CXX_EXTENSIONS="OFF"',
'  CMAKE_CXX_STANDARD="17"',
'  CMAKE_CXX_STANDARD_REQUIRED="ON"',
'  CMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++"',
'  CMAKE_EXPORT_COMPILE_COMMANDS="ON"',
'  CMAKE_LIBRARY_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_POSITION_INDEPENDENT_CODE="ON"',
'  CMAKE_RUNTIME_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/bin"',
'',
'CMAKE_INSTALL_LIBDIR=lib',
'CMAKE_CXX_VISIBILITY_PRESET=',
'CMAKE_CXX_VISIBILITY_PRESET=hidden',
'-- Configuring done (0.1s)',
'-- Generating done (0.0s)',
'-- Build files have been written to: /home/rtkid/Documents/fpga-router/build-debug',
'cmake --build --preset debug',
'[11/26] Building CXX object libs/RliStreamProtocol/CMakeFiles/RliStreamProtocol.dir/src/private/FpgaBlocksStatistics.cpp.o',
'/home/rtkid/Documents/fpga-router/libs/RliStreamProtocol/src/private/FpgaBlocksStatistics.cpp: In member function ‘void rli_stream::FpgaBlocksStatistics::parse(const std::vector<unsigned char>&)’:',
'/home/rtkid/Documents/fpga-router/libs/RliStreamProtocol/src/private/FpgaBlocksStatistics.cpp:106:31: warning: narrowing conversion of ‘(unsigned int)header.rli_stream::Header::proto’ from ‘unsigned int’ to ‘uint8_t’ {aka ‘unsigned char’} [-Wnarrowing]',
'  106 |     MsgType cnt_key = {header.proto, header.type};',
'      |                        ~~~~~~~^~~~~',
'[26/26] Linking CXX executable bin/fpga-router-unittest',
]

const unit_test_debug = [
'cmake --preset debug',
'Preset CMake variables:',
'',
'  CMAKE_ARCHIVE_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_BUILD_TYPE="Debug"',
'  CMAKE_CXX_EXTENSIONS="OFF"',
'  CMAKE_CXX_STANDARD="17"',
'  CMAKE_CXX_STANDARD_REQUIRED="ON"',
'  CMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++"',
'  CMAKE_EXPORT_COMPILE_COMMANDS="ON"',
'  CMAKE_LIBRARY_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_POSITION_INDEPENDENT_CODE="ON"',
'  CMAKE_RUNTIME_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/bin"',
'',
'CMAKE_INSTALL_LIBDIR=lib',
'CMAKE_CXX_VISIBILITY_PRESET=',
'CMAKE_CXX_VISIBILITY_PRESET=hidden',
'-- Configuring done (0.1s)',
'-- Generating done (0.0s)',
'-- Build files have been written to: /home/rtkid/Documents/fpga-router/build-debug',
'cmake --build --preset debug',
'ninja: no work to do.',
'ctest --preset debug --output-junit junit.xml -T test --test-dir build-debug',
'Internal ctest changing into directory: /home/rtkid/Documents/fpga-router/build-debug',
'Cannot find file: /home/rtkid/Documents/fpga-router/build-debug/DartConfiguration.tcl',
'   Site: ',
'   Build name: (empty)',
'Create new tag: 20250505-1515 - Experimental',
'Cannot find file: /home/rtkid/Documents/fpga-router/build-debug/DartConfiguration.tcl',
'Test project /home/rtkid/Documents/fpga-router/build-debug',
'    Start 1: SingleProducerProxy.TestSend',
'1/8 Test #1: SingleProducerProxy.TestSend .....................................   Passed    0.00 sec',
'    Start 2: RliStreamRouter.TestEmptyMessageTypeSet',
'2/8 Test #2: RliStreamRouter.TestEmptyMessageTypeSet ..........................   Passed    0.00 sec',
'    Start 3: RliStreamRouter.TestOnData',
'3/8 Test #3: RliStreamRouter.TestOnData .......................................   Passed    0.00 sec',
'    Start 4: StringUtil.GetPortFromUrlTcp',
'4/8 Test #4: StringUtil.GetPortFromUrlTcp .....................................   Passed    0.00 sec',
'    Start 5: StringUtil.GetPortFromUrlIpc',
'5/8 Test #5: StringUtil.GetPortFromUrlIpc .....................................   Passed    0.00 sec',
'    Start 6: StringUtil.GetPortFromUrlLocalhost',
'6/8 Test #6: StringUtil.GetPortFromUrlLocalhost ...............................   Passed    0.00 sec',
'    Start 7: ThreadUtil.SetCurrentThreadName_GetCurrentThreadName',
'7/8 Test #7: ThreadUtil.SetCurrentThreadName_GetCurrentThreadName .............   Passed    0.00 sec',
'    Start 8: ThreadUtil.SetCurrentThreadName_GetCurrentThreadName_15symbols',
'8/8 Test #8: ThreadUtil.SetCurrentThreadName_GetCurrentThreadName_15symbols ...   Passed    0.00 sec',
'',
'100% tests passed, 0 tests failed out of 8',
'',
'Total Test time (real) =   0.02 sec',
]

const integration_test_debug = [
'cmake --preset debug',
'Preset CMake variables:',
'',
'  CMAKE_ARCHIVE_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_BUILD_TYPE="Debug"',
'  CMAKE_CXX_EXTENSIONS="OFF"',
'  CMAKE_CXX_STANDARD="17"',
'  CMAKE_CXX_STANDARD_REQUIRED="ON"',
'  CMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++"',
'  CMAKE_EXPORT_COMPILE_COMMANDS="ON"',
'  CMAKE_LIBRARY_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_POSITION_INDEPENDENT_CODE="ON"',
'  CMAKE_RUNTIME_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/bin"',
'',
'CMAKE_INSTALL_LIBDIR=lib',
'CMAKE_CXX_VISIBILITY_PRESET=',
'CMAKE_CXX_VISIBILITY_PRESET=hidden',
'-- Configuring done (0.1s)',
'-- Generating done (0.0s)',
'-- Build files have been written to: /home/rtkid/Documents/fpga-router/build-debug',
'cmake --build --preset debug',
'ninja: no work to do.',
'TESTSUITE_ALLOW_ROOT=ON BUILD_TYPE=debug python3 -m pytest -vs test/integration',
'/usr/bin/python3: No module named pytest',
'make: *** [Makefile:17: integration-test-debug] Error 1',
]

const pip_install_error = [
'error: externally-managed-environment',
'',
'× This environment is externally managed',
'╰─> To install Python packages system-wide, try apt install',
'    python3-xyz, where xyz is the package you are trying to',
'    install.',
'    ',
'    If you wish to install a non-Debian-packaged Python package,',
'    create a virtual environment using python3 -m venv path/to/venv.',
'    Then use path/to/venv/bin/python and path/to/venv/bin/pip. Make',
'    sure you have python3-full installed.',
'    ',
'    If you wish to install a non-Debian packaged Python application,',
'    it may be easiest to use pipx install xyz, which will manage a',
'    virtual environment for you. Make sure you have pipx installed.',
'    ',
'    See /usr/share/doc/python3.12/README.venv for more information.',
'',
'note: You can breaking your Python installation or OS, by passing --break-system-packages.',
'hint: See PEP 668 for the detailed specification.',
]

const pip_install_good = [
'Defaulting to user installation because normal site-packages is not writeable',
'Collecting yandex-taxi-testsuite',
'  Downloading yandex_taxi_testsuite-0.3.3-py3-none-any.whl.metadata (6.7 kB)',
'Collecting nanomsg',
'  Downloading nanomsg-1.0.tar.gz (10 kB)',
'  Preparing metadata (setup.py) ... done',
'Requirement already satisfied: packaging in /usr/lib/python3/-testsuite) (24.0)',
'Requirement already satisfied: PyYAML>=3.13 in /usr/lib/-taxi-testsuite) (6.0.1)',
'Collecting aiohttp>=3.5.4 (from yandex-taxi-testsuite)',
'  Downloading aiohttp-3.11.18-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (7.7 kB)',
'Collecting yarl!=1.6,>=1.4.2 (from yandex-taxi-testsuite)',
'  Downloading yarl-1.20.0-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (72 kB)',
'     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 72.4/72.4 kB 571.1 kB/s eta 0:00:00',
'Collecting py>=1.10 (from yandex-taxi-testsuite)',
'  Downloading py-1.11.0-py2.py3-none-any.whl.metadata (2.8 kB)',
'Collecting pytest-aiohttp>=0.3.0 (from yandex-taxi-testsuite)',
'  Downloading pytest_aiohttp-1.1.0-py3-none-any.whl.metadata (2.7 kB)',
'Collecting pytest-asyncio!=0.22.*,!=0.23.*,!=0.24.* (from yandex-taxi-testsuite)',
'  Downloading pytest_asyncio-0.26.0-py3-none-any.whl.metadata (4.0 kB)',
'Collecting pytest>=4.5.0 (from yandex-taxi-testsuite)',
'  Downloading pytest-8.3.5-py3-none-any.whl.metadata (7.6 kB)',
'Requirement already satisfied: python-dateutil>=2.7.3 in /usr/lib/taxi-testsuite) (2.8.2)',
'Collecting cached-property>=1.5.1 (from yandex-taxi-testsuite)',
'  Downloading cached_property-2.0.1-py3-none-any.whl.metadata (10 kB)',
'Collecting aiohappyeyeballs>=2.3.0 (from aiohttp>=3.5.4->yandex-taxi-testsuite)',
'  Downloading aiohappyeyeballs-2.6.1-py3-none-any.whl.metadata (5.9 kB)',
'Collecting aiosignal>=1.1.2 (from aiohttp>=3.5.4->yandex-taxi-testsuite)',
'  Downloading aiosignal-1.3.2-py2.py3-none-any.whl.metadata (3.8 kB)',
'Requirement already satisfied: attrs>=17.3.0 in /usr/lib/python3-testsuite) (23.2.0)',
'Collecting frozenlist>=1.1.1 (from aiohttp>=3.5.4->yandex-taxi-testsuite)',
'  Downloading frozenlist-1.6.0-cp312-cp312-manylinux_2_5_x86_64. (16 kB)',
'Collecting multidict<7.0,>=4.5 (from aiohttp>=3.5.4->yandex-taxi-testsuite)',
'  Downloading multidict-6.4.3-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (5.3 kB)',
'Collecting propcache>=0.2.0 (from aiohttp>=3.5.4->yandex-taxi-testsuite)',
'  Downloading propcache-0.3.1-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (10 kB)',
'Collecting iniconfig (from pytest>=4.5.0->yandex-taxi-testsuite)',
'  Downloading iniconfig-2.1.0-py3-none-any.whl.metadata (2.7 kB)',
'Collecting pluggy<2,>=1.5 (from pytest>=4.5.0->yandex-taxi-testsuite)',
'  Downloading pluggy-1.5.0-py3-none-any.whl.metadata (4.8 kB)',
'Requirement already satisfied: idna>=2.0 in /usr/lib/python3/dist-packages (from yarl!=1.6',
'Downloading yandex_taxi_testsuite-0.3.3-py3-none-any.whl (147 kB)',
'   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 147.3/147.3 kB 1.3 MB/s eta 0:00:00',
'Downloading aiohttp-3.11.18-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (1.7 MB)',
'   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 1.7/1.7 MB 7.2 MB/s eta 0:00:00',
'Downloading cached_property-2.0.1-py3-none-any.whl (7.4 kB)',
'Downloading py-1.11.0-py2.py3-none-any.whl (98 kB)',
'   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 98.7/98.7 kB 8.2 MB/s eta 0:00:00',
'Downloading pytest-8.3.5-py3-none-any.whl (343 kB)',
'   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 343.6/343.6 kB 21.3 MB/s eta 0:00:00',
'Downloading pytest_aiohttp-1.1.0-py3-none-any.whl (8.9 kB)',
'Downloading pytest_asyncio-0.26.0-py3-none-any.whl (19 kB)',
'Downloading yarl-1.20.0-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (349 kB)',
'   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 349.2/349.2 kB 20.3 MB/s eta 0:00:00',
'Downloading aiohappyeyeballs-2.6.1-py3-none-any.whl (15 kB)',
'Downloading aiosignal-1.3.2-py2.py3-none-any.whl (7.6 kB)',
'Downloading frozenlist-1.6.0-cp312-cp312-manylinux_2_5_x86_64.....whl (316 kB)',
'   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 316.2/316.2 kB 19.0 MB/s eta 0:00:00',
'Downloading multidict-6.4.3-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (223 kB)',
'   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 223.5/223.5 kB 15.8 MB/s eta 0:00:00',
'Downloading pluggy-1.5.0-py3-none-any.whl (20 kB)',
'Downloading propcache-0.3.1-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (245 kB)',
'   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 245.0/245.0 kB 16.5 MB/s eta 0:00:00',
'Downloading iniconfig-2.1.0-py3-none-any.whl (6.0 kB)',
'Building wheels for collected packages: nanomsg',
'  Building wheel for nanomsg (setup.py) ... done',
'  Created wheel for nanomsg: filename=nanomsg-1.0-cp312-cp312-linux_x86_64.whl size=25537 ',
'  Stored in directory: /home/rtkid/.cache/pip/wheels/81/e9/2d/7e...',
'Successfully built nanomsg',
'Installing collected packages: nanomsg, py, propcache, ..., yandex-taxi-testsuite',
'  WARNING: The scripts py.test and pytest are installed in "/home/rtkid/.local/bin" which is not on PATH.',
'  Consider adding this directory to PATH or, .....',
'Successfully installed ... nanomsg-1.0 ... yandex-taxi-testsuite-0.3.3',

]

const integration_test_debug_good = [
'cmake --preset debug',
'Preset CMake variables:',
'',
'  CMAKE_ARCHIVE_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_BUILD_TYPE="Debug"',
'  CMAKE_CXX_EXTENSIONS="OFF"',
'  CMAKE_CXX_STANDARD="17"',
'  CMAKE_CXX_STANDARD_REQUIRED="ON"',
'  CMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++"',
'  CMAKE_EXPORT_COMPILE_COMMANDS="ON"',
'  CMAKE_LIBRARY_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/lib"',
'  CMAKE_POSITION_INDEPENDENT_CODE="ON"',
'  CMAKE_RUNTIME_OUTPUT_DIRECTORY="/home/rtkid/Documents/fpga-router/build-debug/bin"',
'',
'CMAKE_INSTALL_LIBDIR=lib',
'CMAKE_CXX_VISIBILITY_PRESET=',
'CMAKE_CXX_VISIBILITY_PRESET=hidden',
'-- Configuring done (0.1s)',
'-- Generating done (0.0s)',
'-- Build files have been written to: /home/rtkid/Documents/fpga-router/build-debug',
'cmake --build --preset debug',
'ninja: no work to do.',
'TESTSUITE_ALLOW_ROOT=ON BUILD_TYPE=debug python3 -m pytest -vs test/integration',
'============================= test session starts =============================',
'platform linux -- Python 3.12.3, pytest-8.3.5, pluggy-1.5.0 -- /usr/bin/python3',
'cachedir: .pytest_cache',
'yandex-taxi-testsuite: version 0.3.3',
'testsuite env: new, dir: /tmp/.yasuite-rtkid',
'rootdir: /home/rtkid/Documents/fpga-router/test/integration',
'configfile: pytest.ini',
'plugins: aiohttp-1.1.0, asyncio-0.26.0',
'asyncio: mode=Mode.AUTO, asyncio_default_fixture_loop_scope=session',
'collected 5 items',
'',
'test/integration/src/test_regs_ddr_read_response_socket.py::test_send_response PASSED',
'test/integration/src/test_regs_ddr_read_write_request_socket.py::test_send_read_request PASSED',
'test/integration/src/test_regs_ddr_read_write_request_socket.py::test_send_write_request PASSED',
'test/integration/src/test_rli_stream_socket.py::test_rli_stream_socket PASSED',
'test/integration/src/test_rli_stream_socket.py::test_many_data PASSED',
'',
]

export default makeScene2D(function* (view) {
    const console = createRef<Console>();

    view.add(
        <Layout layout padding={paddingBig} width={"100%"} height={"100%"} >
            <Console is_hidden ref={console} />
        </Layout>
    );

    console().terminal().width("0%");
    console().terminal().height("0%");

    yield* beginSlide("Начало");
    
    yield* all(
        console().appear(),
        console().width("100%", animationTime),
        console().height("100%", animationTime),
        console().terminal().width("100%", animationTime),
        console().terminal().height("100%", animationTime),
    );

    yield* console().terminal().prompt();

    yield* beginSlide("OS");

    yield* console().terminal().type("cat /etc/os-release");

    yield* beginSlide("output");

    yield* console().terminal().output(os_release);

    yield* beginSlide("clone fpga_router");

    yield* console().terminal().type("git clone --recurse-submodules -j16 https://gitlab.lemz.t/ssr/services/fpga-router");
    yield* console().terminal().prompt();

    yield* beginSlide("cd fpga_router");

    yield* console().terminal().type("cd fpga-router");
    yield* console().terminal().prompt();

    yield* beginSlide("cmake");

    yield* console().terminal().type("make cmake-debug");

    yield* beginSlide("cmake run");

    yield* console().terminal().output(cmake_debug_1, "", animationTime, false);
    yield* console().terminal().output(cmake_debug_1_error, "", animationTime, true, colorRed);

    yield* beginSlide("install fmt");

    yield* console().terminal().type("sudo apt install -y libfmt-dev");

    yield* beginSlide("fmt installed");

    yield* console().terminal().output(fmt_installed);

    yield* beginSlide("cmake 2");

    yield* console().terminal().type("make cmake-debug");

    yield* beginSlide("cmake 2 run");

    yield* console().terminal().output(cmake_debug_2, "", animationTime, false);
    yield* console().terminal().output(cmake_debug_2_error, "", animationTime, true, colorRed);

    yield* beginSlide("install pkg-config");

    yield* console().terminal().type("sudo apt install -y pkg-config");

    yield* beginSlide("pkg-config installed");

    yield* console().terminal().output(pkg_config_installed);

    yield* beginSlide("cmake 3");

    yield* console().terminal().type("make cmake-debug");

    yield* beginSlide("cmake 3 run");

    yield* console().terminal().output(cmake_debug_3, "", animationTime, false);
    yield* console().terminal().output(cmake_debug_3_error, "", animationTime, true, colorRed);

    yield* beginSlide("install libnanomsg-dev");

    yield* console().terminal().type("sudo apt install -y libnanomsg-dev");

    yield* beginSlide("libnanomsg-dev installed");

    yield* console().terminal().output(libnanomsg_dev);

    yield* beginSlide("cmake 4");

    yield* console().terminal().type("make cmake-debug");

    yield* beginSlide("cmake 4 run");

    yield* console().terminal().output(cmake_debug_4, "", animationTime, false);
    yield* console().terminal().output(cmake_debug_4_error, "", animationTime, true, colorRed);

    yield* beginSlide("cat docker");

    yield* console().terminal().type("cat docker/astra-se1.7.Dockerfile");

    yield* beginSlide("cat docker run");

    yield* console().terminal().output(dockerAstra);

    yield* beginSlide("install from docker");

    yield* console().terminal().type("sudo apt-get -y install");
    yield* console().terminal().output(apt_install, "  ", animationTime, false);

    yield* beginSlide("install from docker run");

    yield* console().terminal().output(apt_install_error);

    yield* beginSlide("install from docker 2");

    yield* console().terminal().type("sudo apt-get -y install");
    yield* console().terminal().output(apt_install_good, "  ", animationTime, false);

    yield* beginSlide("install from docker run 2");

    yield* console().terminal().output(apt_install_compelete);

    yield* beginSlide("cmake 5");

    yield* console().terminal().type("make cmake-debug");

    yield* beginSlide("cmake 5 run");

    yield* console().terminal().output(cmake_debug_5);

    yield* beginSlide("cmake build");

    yield* console().terminal().type("make build-debug");

    yield* beginSlide("cmake build run");

    yield* console().terminal().output(cmake_build);

    yield* beginSlide("unit test");

    yield* console().terminal().type("make unit-test-debug");

    yield* beginSlide("unit test run");

    yield* console().terminal().output(unit_test_debug);

    yield* beginSlide("integration test");

    yield* console().terminal().type("make integration-test-debug");

    yield* beginSlide("integration run");

    yield* console().terminal().output(integration_test_debug);

    yield* beginSlide("cat docker run 2");

    yield* console().terminal().output(dockerAstra);

    yield* beginSlide("install from docker 2");

    yield* console().terminal().type("python3 -m pip install yandex-taxi-testsuite nanomsg");

    yield* beginSlide("install from docker run 2");

    yield* console().terminal().output(pip_install_error);

    yield* beginSlide("install from docker 3");

    yield* console().terminal().type("python3 -m pip install yandex-taxi-testsuite nanomsg --break-system-packages");

    yield* beginSlide("install from docker run 3");

    yield* console().terminal().output(pip_install_good);

    yield* beginSlide("integration test 2");

    yield* console().terminal().type("make integration-test-debug");

    yield* console().terminal().output(integration_test_debug_good, "", animationTime, false);
    yield* console().terminal().output(["======================================== 5 passed in 4.96s ========================================"], "", animationTime, true, colorGreen);

    yield* beginSlide("code");

    yield* console().terminal().type("code .");

    yield* beginSlide("code run");

    yield* console().terminal().prompt();
});
