DirectX is a propreitary graphics API developed by Microsoft, created out of a lack of a unified graphics API available on Windows. Over the years it's become an eligant API which microsoft maintains heavily.

DirectX 12 like Vulkan has offloaded a lot of driver managed structures to the developer, and shares a lot of the same data structures and abstractions, however it isn't as close to graphics hardware.

## Pipeline State Objects

### PSO Libraries

Similar to pipeline caches, PSO libraries are a collection of statically built pipeline state objects that you can include with your binary and load as needed.

## HLSL

High Level Shader Language is the most popular shader language today, in use in Unity, Unreal Engine 4, and many other traditional game engines.

### Shader Model 6

**Wave Level Operations** - Working with an array of SIMD.