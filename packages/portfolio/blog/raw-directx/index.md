DirectX is a proprietary graphics API developed by Microsoft, created out of a lack of a unified graphics API available on Windows. Over the years it's become an elegant API which microsoft maintains heavily. Its API interface is like Vulkan without complex features like descriptor sets or caching. 

DirectX is supported on:

- **Windows**
- **Xbox One**
- **Xbox 360**

DirectX 12 like Vulkan has made the developer responsible for what was originally the done by the driver, and shares a lot of the same data structures and abstractions. Data Structures such as **Swapchains**, **Pipeline State Objects**, **Render Passes**, and **Shader Modules** behave the same.

Here we'll get started building a DirectX renderer and review some of the similarities and differences between DirectX and other APIs like OpenGL, Vulkan, and Metal.

## Pipeline State Objects

### PSO Libraries

Similar to pipeline caches, PSO libraries are a collection of statically built pipeline state objects that you can include with your binary and load as needed.

## HLSL

High Level Shader Language is the most popular shader language today, in use in Unity, Unreal Engine 4, and many other traditional game engines.

### Shader Model 6

**Wave Level Operations** - Working with an array of SIMD.