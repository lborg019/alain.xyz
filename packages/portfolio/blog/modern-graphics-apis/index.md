Low level Graphics APIs such as **Vulkan**, **Metal**, and **DirectX**, are converging to a model similar to the way GPUs are currently designed. Fundamentally, GPUs are asynchronous compute units that can handle large quantities of data, such as complex mesh geometry, image textures, output frame buffers, transformation matrices, or anything you want computed.

GPUs weren't always this way, originally they were a set of hardware based functions with very little programmability, but this changed as applications pushed the limits of what these non-programmable systems could do.

---

Let's look at what some of the similarities and differences between graphics APIs are. 

## Entry Point

| API | Structure |
|-----|-----------|
| Vulkan | `VkInstance` |
| DirectX | `IDXGIFactory` |
| Metal | `MTKView` |
| OpenGL | Context (varies by platform) |

The entry point to a graphics API generally allows you to access the API's inner classes.

## Physical Device

| API | Structure |
|-----|-----------|
| Vulkan | `VkPhysicalDevice` |
| DirectX | `IDXGIAdapter` |
| Metal | - |
| OpenGL | - |

Physical Devices allow you to query for important device specific details such as memory size and feature support. 

## Device

| API | Structure |
|-----|-----------|
| Vulkan | `VkPhysicalDevice` |
| DirectX | `ID3D11Device` & `ID3D11DeviceContext` |
| Metal | - |
| OpenGL | - |

A device gives you access to the inner functions of the API, such as creating graphics data structures.

## Queue

| API | Structure |
|-----|-----------|
| Vulkan | `VkQueue` |
| DirectX | - |
| Metal | - |
| OpenGL | - |

A queue allows you to enqueue tasks for the GPU to execute. A GPU is an asynchronous compute device, so the idea here is to always keep it busy while having control over when items are added to the queue. 

## Command Buffer

| API | Structure |
|-----|-----------|
| Vulkan | `Command Buffer` |
| DirectX | - |
| Metal | - |
| OpenGL | - |