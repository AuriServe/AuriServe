# AuriServe

[![release](https://github.com/AuriServe/AuriServe/workflows/release/badge.svg?branch=master)](https://github.com/AuriServe/AuriServe/releases)
[![codacy rating](https://img.shields.io/codacy/grade/79324be8f5a249808d36979b94428fd4.svg?logo=codacy&labelColor=2A3037)](https://app.codacy.com/gh/AuriServe/AuriServe)
[![discord](https://img.shields.io/discord/416379773976051712.svg?color=7289DA&label=discord&logo=discord&logoColor=white&labelColor=2A3037)](https://aurail.us/discord)
[![commit activity](https://img.shields.io/github/commit-activity/m/auriserve/auriserve.svg?logo=github&labelColor=2A3037&label=commit%20activity)](https://github.com/AuriServe/AuriServe/commits/master)

Finally, an Open-Source, Modern, Node based CMS.

## About

More information will come once the structure of this project is more finalized. For more information and to follow development, join Auri's Den on Discord by using the badge above.

### [Download the Latest Artifact](https://nightly.link/AuriServe/AuriServe/workflows/release/master/AuriServe.zip)

## Note for 64-bit Systems

AuriServe is built as a 32-bit executable for maximum compatibility. This shouldn't be a problem for most devices, which run a variety of 64 and 32-bit applications, but some focused machines such as servers may have never had the required 32 bit linker installed. If, when running AuriServe on a 64-bit machine, you get no output and the program terminates, try installing the following and running the program again.
      
    sudo dpkg --add-architecture i386
    sudo apt-get update
    sudo apt-get install libc6:i386
    sudo apt-get install lib32stdc++6
