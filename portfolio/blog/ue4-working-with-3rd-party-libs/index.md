[Eric Neibler](http://ericniebler.com/) on [Cppcast](http://cppcast.com/2015/12/eric-niebler/) described the current state of programming in C++ as being "stuck in the 60s", this system bound by concatenation of text. C++ [Modules](http://kennykerr.ca/2015/12/03/getting-started-with-modules-in-c/) are coming to the standard make that less of a pain, but that's still not available yet.

The alternative of course is using your favorite IDE's compiler options and get lost inside the options, mess up somewhere and scratch your head and wonder why. Then there's tools like CMake which try their best to abstract things, but the fact is, [C++ build systems suck](https://www.youtube.com/watch?v=KPi0AuVpxLI).

Unreal decided to opt for an approach similar to [GulpJS](http://gulpjs.com/), where they have build scripts written in `C#` that set up their projects and compose their modules together.

## Unreal Build Tool

[UnrealBuildTool](https://docs.unrealengine.com/latest/INT/Programming/UnrealBuildSystem/index.html) generates makefiles, manages dependencies, preprocesses files for UE4 metadata and compiles the code. Every portion of Unreal Engine 4 is a module, even their core:

```bash
├─ UnrealEngine/Engine/Source/Runtime/Core/
│   ├─ Private/
│   │   ├─ Windows/         # Windows cpp files.
│   │   ├─ iOS/             # iOS cpp files.
│   │   └─ CorePrivatePCH.h # Precompiled header
│   └─ Public/
│      └─ Core.h            # Shared Precompiled header
└─ Core.Build.cs            # Manages per system includes, dll loading, macros
```

So `Core.Build.cs` holds everything related to the building of the core module of Unreal, and there's `*.Build.cs` files for every other module (HTML5, JSON, Matinee, you name it).

### Your Game

Any Game you make in Unreal is also a module that simply builds off these core modules and plugins you make.

```c++
//YourGame.h
#include "Engine.h"
//and #include anything else.

//YourGame.cpp
IMPLEMENT_PRIMARY_GAME_MODULE( FDefaultGameModuleImpl, NameOfModule, "Name of Module" );

```

```c#
//YourGame.Build.cs
using UnrealBuildTool;

public class NameOfModule : ModuleRules
{
    public NameOfModule(TargetInfo Target)
    {
        PublicDependencyModuleNames.AddRange(
        new string[] {
            "Core",
            "CoreUObject",
            "Engine",
            "InputCore"
        });
        //And Any other Plugins

        PrivateDependencyModuleNames.AddRange(
        new string[] {
            "Slate",
            "SlateCore"
        });
    }
}
//YourGame.Target.cs (Is it a Game or in Editor mode?)
using UnrealBuildTool;
using System.Collections.Generic;

public class NameOfModuleTarget : TargetRules
{
    public NameOfModuleTarget(TargetInfo Target)
    {
        Type = TargetType.Game;
    }

    public override void SetupBinaries(
    TargetInfo Target,
    ref List<UEBuildBinaryConfiguration> OutBuildBinaryConfigurations,
    ref List<string> OutExtraModuleNames
    )
    {
        OutExtraModuleNames.AddRange( new string[] { "Name of Module" } );
    }
}
```

So you have 2 options, either modifying a plugin's build file, or your project's.

## Modifying your Build File

We were using portions of the Intel Realsense SDK for a project, so to use it with Unreal we did the following:

```c#
using System;
using System.IO;
using UnrealBuildTool;
public class AeonSystem: ModuleRules {
    public AeonSystem(TargetInfo Target) {
        PublicDependencyModuleNames.AddRange(new string[] {
            "Core",
            "CoreUObject",
            "Engine",
            "InputCore",
            "RHI",
            "SkyboxShader",
            "ShaderCopyHelper"
        });
        PrivateDependencyModuleNames.AddRange(new string[] {
            "Slate",
            "SlateCore"
        });

        // Load IntelRealsense SDK Directly
        string RealSenseDirectory = Environment.GetEnvironmentVariable("RSSDK_DIR");
        string Platform = (Target.Platform == UnrealTargetPlatform.Win64) ? "x64" : "Win32";
        // Here's the key:
        PublicIncludePaths.AddRange(new string[] {
            RealSenseDirectory + "include", RealSenseDirectory + "sample\\common\\include"
        });
        PublicAdditionalLibraries.Add(RealSenseDirectory + "lib\\" + Platform + "\\libpxc.lib");
    }
}
```

So simply adding `PublicAdditionalLibraries` to your build class to link your lib files, and `PublicIncludeFiles` for your headers is enough.