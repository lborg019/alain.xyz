Unity is the most popular game engine in the world, used by large companies like Nintendo, Square Enix as well as many independent developers to quickly build cross platform games.

## Editor Design

![Unity Editor](assets/editor.png)

Each window is given it's own window and rendering context, similar to Unreal Engine, and are simply positioned atop one another by the main window's positioning system.

Updates to the window depend on user interactions (Reactive model), otherwise it simply doesn't refresh rendering.

## File Hierarchy

Meta
Hashmap
Tree

## C# Runtime

### C# Code Style

- **NameSpaces/Classes/Enums/Structs/Functions** - CamelCase with the first character Capitalized.

- **Variables** - camelCase with first character lower cased.

- **Private** - camelCase with the first character as an underscore, the second lower cased, default behavior.

- **Comments** - C# Lets you write XML for your docs.

- **Modules/Namespaces** - By default every class/enum you include in your project is available in the entire C# runtime, so it's your responsibility to alias modules through namespaces instead of `import` statements like JavaScript or Python.

## File Hierarchy

Most projects in Unity organizes files by *Type*.

```bash
├─ Assets/
│   ├─ Scenes
│   ├─ Materials
│   ├─ Models
│   ├─ Prefabs
│   ├─ Scripts
│   └─ ...
├─ ProjectSettings/
│   └─ ...
└─ readme.md
```

With groups of Materials, Models, and Scripts often organized themselves loosely into Components.

```bash
├─ Assets/
│   ├─ DialogueSystem
│   ├─ ProceduralTrees
│   └─ ...
├─ ProjectSettings/
│   └─ ...
└─ readme.md
```


## Data Model

Unity stores data as serialized files

Meta information links files in a hash data structure

State is stored as prefabs/Scenes

Classes that inherit from `MonoBehavior` handle controller logic

## Renderer

![Material, Mesh, Renderer Coupling](assets/material-mesh-renderer.png)

- **Material** - An interface between a shader and other parts of the engine. You can set uniforms, use as a reference for postprocessing systems, etc.

- **Mesh** - A pointer to a set of primitives, which multiple materials can be assigned to.

- **Renderer** - A component that handles the rendering of a mesh with a given material.

\[ N_{Material} \rightarrow 1_{Shader} \]

Shaders written as a single HLSL file that handles all the steps of the Graphics Pipeline. Unity lets you include shader libraries with the extension `.cginc`. 

For cross platform support, your HLSL code is compiled to GLSL by [HLSL2GLSL](https://github.com/aras-p/hlsl2glslfork).

## Resources

### People

- [Keijiro Takahashi](https://github.com/keijiro) - Unity Japan, is constantly working on interesting bite sized projects.
- [Seiya Ishibashi](https://github.com/i-saint) - Unity Japan, working on integrations with various APIs and systems like Pixar.

### Discussion

- [r/unity3d](https://reddit.com/r/unity3d)
