Low level Graphics APIs such as **Vulkan**, **Metal**, and **DirectX**, are converging to a model similar to the way GPUs are currently designed. Fundamentally, GPUs are asynchronous compute units that can handle large quantities of data, such as complex mesh geometry, image textures, output frame buffers, transformation matrices, or anything you want computed.

GPUs weren't always this way, originally they were a set of hardware based functions with very little programmability, but this changed as applications pushed the limits of what these non-programmable systems could do.

---

Let's look at what some of the similarities and differences between graphics APIs are. We'll be covering the C++ APIs for:

1. Vulkan
2. DirectX 12
3. Metal (Objective C++)

You could then go on to build a cross platform rendering API such as the one I've developed [Mag](https://github.com/alaingalvan/mag), a cross platform API for Vulkan, DirectX, and Metal.

## Entry Point

| API | Structure |
|-----|-----------|
| Vulkan | `vk::Instance` |
| DirectX | `IDXGIFactory` |
| Metal | - |

The entry point to a graphics API generally allows you to access the API's inner classes.

```cpp
// 🌋 Vulkan
#include <vulkan.hpp>

std::vector<const char*> extensions =
{
  VK_EXT_DEBUG_REPORT_EXTENSION_NAME,
  VK_KHR_SURFACE_EXTENSION_NAME,
  VK_KHR_WIN32_SURFACE_EXTENSION_NAME
};

std::vector<const char*> layers =
{
  "VK_LAYER_LUNARG_standard_validation"
};

auto appInfo = vk::ApplicationInfo(
  "MyApp",
  VK_MAKE_VERSION(1, 0, 0),
  "MyAppEngine",
  VK_MAKE_VERSION(1, 0, 0),
  VK_API_VERSION_1_0
);

vk::Instance instance = vk::createInstance(
  vk::InstanceCreateInfo(
    vk::InstanceCreateFlags(),
    &appInfo,
    layers.size(),
    layers.data(),
    extensions.size(),
    extensions.data()
  )
);
```

```cpp
// ❎ DirectX
#include <d3d112.h>

IDXGIFactory* factory;
HRESULT hr = CreateDXGIFactory(__uuidof(IDXGIFactory), (void**)(&factory) );
```

```mm
// 🤖 Metal
#import <Cocoa/Cocoa.h>
#import <Metal/Metal.h>

// No need to initialize API
```

## Window Surface

| API | Structure |
|-----|-----------|
| Vulkan | `vk::Surface` |
| DirectX | - |
| Metal | `CAMetalLayer` |

A window **Surface** allows you to bind all draw calls to an OS specific window.

## Physical Device

| API | Structure |
|-----|-----------|
| Vulkan | `vk::PhysicalDevice` |
| DirectX | `IDXGIAdapter` |
| Metal | `MTLDevice` |

**Physical Devices** allow you to query for important device specific details such as memory size and feature support. 

## Device

| API | Structure |
|-----|-----------|
| Vulkan | `vk::PhysicalDevice` |
| DirectX | `ID3D12Device` |
| Metal | `MTLDevice` |

A **Device** gives you access to the inner functions of the API, such as creating graphics data structures.

```cpp
// ❎ DirectX
D3D12CreateDevice(pAdapter, D3D_FEATURE_LEVEL_11_0, _uuidof(ID3D12Device), nullptr);
```

```mm
// 🤖 Metal
id<MTLDevice> device = MTLCreateSystemDefaultDevice();
```

## Queue

| API | Structure |
|-----|-----------|
| Vulkan | `vk::Queue` |
| DirectX |`ID3D12CommandQueue` |
| Metal | `MTLCommandQueue` |

A **Queue** allows you to enqueue tasks for the GPU to execute. A GPU is an asynchronous compute device, so the idea here is to always keep it busy while having control over when items are added to the queue. 

## Swapchain

| API | Structure |
|-----|-----------|
| Vulkan | `vk::Swapchain` |
| DirectX | `IDXGISwapChain` |
| Metal | `NSViewController` |

```cpp
// ❎ DirectX
IDXGISwapChain* swapchain = nullptr;
HRESULT res = CreateSwapChainForHwnd(device, hwnd, desc, fullscreenDesc, outputRestriction, swapchain);
);
```

## Command Buffer

| API | Structure |
|-----|-----------|
| Vulkan | `vk::CommandBuffer` |
| DirectX | `ID3D12GraphicsCommandList` |
| Metal | `MTLRenderCommandEncoder` |

A **Command Buffer** is an asynchronous computing unit, where you describe procedures for the GPU to execute in order.

## Command List

| API | Structure |
|-----|-----------|
| Vulkan | `vk::SubmitInfo` |
| DirectX | `ID3D12CommandList[]` |
| Metal | `MTLCommandBuffer` |

Commands are pushed in batches to the GPU in grouping structures called **Command Lists**.

## Frame Buffer

| API | Structure |
|-----|-----------|
| Vulkan | `vk::Framebuffer` |
| DirectX | `ID3D12Resource` |
| Metal | `MTLResource` |


## Render Pass

| API | Structure |
|-----|-----------|
| Vulkan | `vk::RenderPass` |
| DirectX | - |
| Metal | `MTLRenderPassDescriptor` |


## Attachments

## Shaders

| API | Structure |
|-----|-----------|
| Vulkan | `vk::Shader` |
| DirectX | `ID3DBlob` |
| Metal | - |


## Buffer

| API | Structure |
|-----|-----------|
| Vulkan | `vk::Buffer` |
| DirectX | `ID3D12Resource` |
| Metal | ` MTLBuffer` |


A **Buffer** generally contains data, such as vertex points, vertex colors, triangle indices, etc.

```cpp
// 🌋 Vulkan
vk::Buffer buffer = device.createBuffer(
		vk::BufferCreateInfo(
			vk::BufferCreateFlags(),
			bufferSize,
			bufferUsageFlags,
			sharingMode,
			queueFamilyIndices.size(),
			queueFamilyIndices.data()
		)
	);
```

## Textures

| API | Structure |
|-----|-----------|
| Vulkan | `vk::Texture` |
| DirectX | `ID3D12Resource` |
| Metal | `MTLTexture` |

A **Texture** is a buffer of data that is stored in texture memory on the GPU. 

## Samplers

| API | Structure |
|-----|-----------|
| Vulkan | `vk::Sampler` |
| DirectX | `D3D12_STATIC_SAMPLER_DESC` |
| Metal | `MTLSamplerState` |

A **Sampler** is a set of parameters for querying (sampling) a texture.

## Pipeline State Objects

| API | Structure |
|-----|-----------|
| Vulkan | `vk::GraphicsPipeline` |
| DirectX | `D3D12PipelineState` |
| Metal | `MTLRenderPipelineState` |

A **Pipline State Object (PSO)** is the state of the graphics pipeline on a given draw call. 