We have primitive functions that can handle enqueuing tasks to the graphics card. Such a layer could be abstracted further by building wrappers (like say, [SDL](http://wiki.libsdl.org/FrontPage) or [gfx](http://gfx-rs.github.io/)), or could be more tightly coupled by forcing other APIs to follow the Vulkan spec (similar to what [MoltenVK](https://moltengl.com/moltenvk/) did for Metal, but applied to say, DirectX or Playstation's API.

Whether you choose to build above Vulkan or below, or a mix of both, our code needs to become simpler somehow, so lets build a rendering library.

Our goal is to build a well crafted library similar to [Cinder](https://libcinder.org/) or [Three](https://threejs.org/), with these features:

- Can take a scene and render onto a `vk::surface`.

- Algorithms for Vertex Buffers for planes, uv-spheres, etc.

- Materials with physically based rendering available by default.

- Components that we can easily build procedural geometry off of.

- Loading objects or scenes designed in [Blender](https://www.blender.org/) in the `.gltf` format.

## Obsidian - The Modern C++ Vulkan Renderer

```bash

```

## Optimizations

We should avoid wasting cycles whenever the cost of avoiding them is lower than the overhead of checking them.

This is a whole research topic that entire companies like [Umbra 3D](http://umbra3d.com/) have been working on, so this will serve as an overview of what goes into it.

### Static Analysis

### Culling

**Potentially Visible Sets** - A set that can be built by statically analysing a scene with rays and removing invisible regions.
**Portals** - Cull based on critical points like doors and windows, hallways etc. Halo, Dark Souls, Skyrim's Dungeons all use portals.
**Voxel

## Questions

1. Should we follow the [Observer Pattern](https://sourcemaking.com/design_patterns/observer) for referencing the update loop? (Unreal Engine does this with a flag on each actor in the scene, but treats render updating differently.)

```cpp
class MyActor : BaseActor
{
  MyActor() : BaseActor()
  {
    bCanUpdate = true;

    // ...
  }
}
```

I'm leaning towards **no** for the render loop, simply due to the need to constantly refresh being so crucial to the application. 

2. Should there be a virtual scene graph similar to React's virtual dom?

