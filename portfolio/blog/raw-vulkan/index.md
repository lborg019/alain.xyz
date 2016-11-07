Vulkan is a new low level API released febuary 2016 by the Khronos Group that maps directly to the design of modern GPUs. OpenGL was designed in 1992 when GPUs were far more simple, but since then they have become programmable computational units of their own with a focus on thoroughput over latency.

We're going to walk through writing the simplest vulkan app possible, a program that creates an image, processes it with a shader, and saves it on the disk.

## Instances

![Instance Diagram](assets/extensions-layers.svg)

Similar to the OpenGL context, a vulkan application begins when you create an instance. This instance must be loaded with some information about the program such as its name, engine, and minimum vulkan version, as well any extensions and layers you want to load.

**Extension** - Anything that adds extra functionality to Vulkan, such as support for Win32 windows, or enabling drawing onto a target.

**Layer** - Middleware between existing vulkan functionality, such as checking for errors. Layers can range from runtime debugging checks to hooks to GPU debugging software like [RenderDoc](https://github.com/baldurk/renderdoc) to even hooks to the Steam renderer so your game can behave better when you `Ctrl + Shift` to switch to the Steam overlay.

```cpp
// Setup Default Extensions/Layers
// You should query for extensions first and build this list from your queries.
// The following should work on Windows systems.

std::vector<const char*> extensions = {
  VK_KHR_SURFACE_EXTENSION_NAME,
  VK_KHR_WIN32_SURFACE_EXTENSION_NAME,
  VK_EXT_DEBUG_REPORT_EXTENSION_NAME
};

std::vector<const char*> layers =
{
  "VK_LAYER_LUNARG_standard_validation",
  "VK_LAYER_RENDERDOC_Capture",
  "VK_LAYER_VALVE_steam_overlay"
};

auto appInfo = vk::ApplicationInfo(
  "MyApp",
  VK_MAKE_VERSION(0, 1, 0),
  "MyAppEngine",
  VK_MAKE_VERSION(0, 1, 0),
  VK_MAKE_VERSION(1, 0, 30)
  );

auto instanceInfo = vk::InstanceCreateInfo();

instanceInfo.setPApplicationInfo(&appInfo);
instanceInfo.enabledExtensionCount = extensions.size();
instanceInfo.ppEnabledExtensionNames = extensions.data();
instanceInfo.enabledLayerCount = layers.size();
instanceInfo.ppEnabledLayerNames = layers.data();

auto instance = vk::createInstance(instanceInfo);
```

## Physical Devices

![Instance Diagram](assets/hardware.svg)

In vulkan, you have access to all enumerable devices that support it, and can query for information like their name, the number of heaps they support, their manufacturer, etc.

```cpp
// Initialize Devices
auto physicalDevices = instance.enumeratePhysicalDevices();
auto gpu = physicalDevices[0];
```

> **Note** - Mulit-GPU processing isn't supported yet on Vulkan (unless 1.1.x is already out when you read this) so this would be useful for choosing the fastest device to use.

## Virtual Devices

You can then create a virtual device from a physical device handle. A virtual device can be loaded with its own extensions/layers, can be set to work with graphics, gpgpu computations, or handle sparce memory or memory transfers.

A virtual device is your interface to the GPU, and allows you to allocate data and queue up tasks.

```cpp
// Init Device Extension/Validation layers
std::vector<const char*> deviceExtensions =
{
  VK_EXT_DEBUG_MARKER_EXTENSION_NAME
};

std::vector<const char*> deviceValidationLayers =
{
  "VK_LAYER_LUNARG_standard_validation"
};

auto formatProperties = gpu.getFormatProperties(vk::Format::eR8G8B8A8Unorm);
auto gpuFeatures = gpu.getFeatures();
auto gpuQueueProps = gpu.getQueueFamilyProperties();

auto queueCreateInfos = std::vector<vk::DeviceQueueCreateInfo>();

float priority = 0.0;
uint32_t graphicsFamilyIndex = 0;

for (auto& queuefamily : gpuQueueProps)
{
  if (queuefamily.queueFlags & vk::QueueFlagBits::eGraphics) {
    // Create a single graphics queue.
    queueCreateInfos.push_back(
      vk::DeviceQueueCreateInfo(
        vk::DeviceQueueCreateFlags(),
        graphicsFamilyIndex, 1,
        &priority
      )
    );
    break;
  }

  graphicsFamilyIndex++;

}

auto deviceInfo = vk::DeviceCreateInfo();
deviceInfo.enabledExtensionCount = deviceExtensions.size();
deviceInfo.ppEnabledExtensionNames = deviceExtensions.data();
deviceInfo.enabledLayerCount = deviceValidationLayers.size();
deviceInfo.ppEnabledLayerNames = deviceValidationLayers.data();
deviceInfo.pEnabledFeatures = &gpuFeatures;
deviceInfo.queueCreateInfoCount = queueCreateInfos.size();
deviceInfo.pQueueCreateInfos = queueCreateInfos.data();

auto device = gpu.createDevice(deviceInfo);
```

## Queue

Once you have a virtual device, you can access the queues you requested when you created it:

```cpp
// We only allocated one queue earlier,
//so there's only one available on index 0.
auto graphicsQueue = device.getQueue(graphicsFamilyIndex, 0);
```

## Command Pool

A command pool is a thread specific means of allocating command buffers. Any number of command buffers can be made from command pools, with you as the developer responsible for managing when and how they're created and what is loaded in each.

```cpp
auto commandPoolInfo = vk::CommandPoolCreateInfo(
  vk::CommandPoolCreateFlags(vk::CommandPoolCreateFlagBits::eResetCommandBuffer),
  graphicsFamilyIndex
);
auto commandPool = device.createCommandPool(commandPoolInfo);

auto commandBuffers = device.allocateCommandBuffers(
  vk::CommandBufferAllocateInfo(
    commandPool,
    vk::CommandBufferLevel::ePrimary,
    1U
  )
);
```

## Command Buffer

A container of GPU commands, this is where you would see commands similar to OpenGL's state commands:

- setViewport
- setSissor
- blitImage

A common pattern for building a command buffer is:

1. Start Render Pass
2. Bind Resources
  i. Descriptor Sets
  ii. Vertex and Index Buffers
  iii. Pilepline State
3. Modify Dynamic State
4. Draw
5. Repeat 2 Through 4 as Needed
6. End Render Pass

Different command buffer pools allow muti cpu command buffer recording, thus you could allocate a thread for each core on the CPU, and split rendering tasks across each core. This could be used to distribute rendering individual objects, differed rendering passes, physics calculations with compute buffers, etc.

## Pipeline Cache

Todo.

## Pipeline Layouts

Todo.

## Pipeline State Objects

As much as GPUs are now programmable, they still have some static state that you as a developer need to manage when performing draw calls. These include:

### Graphics Pipeline

- **Color Blending** - The function that controls how two objects draw on top of each other.

- **Depth Stencil** - A extra piece of information that describes depth information.

- **Vertex Input** - The actual vertex data you'll be using in your shader.

- **Shaders** - What shaders will be loaded in.

And many more. These can even be cached! These particular draw calls are grouped such that in older graphics APIs, they would trigger shader recompilation.

## Dynamic State Objects

Any fast changes of state will happen in the dynamic state objects.

## Descriptor Sets

Descriptors are how you bind your pipelines, uniforms to your pipeline state objects.

## Shaders

Shaders must be passed to Vulkan as SPIR-V binary, so any compiler that can make SPIR-V is allowed. 

## Render Pass

For defered rendering solutions, Vulkan makes render passes first class.

## Compute

Shares resources with 3D.

## Program Execution

A Vulkan program executes as follows:

1. **Load the Library** - Your application loads the Vulkan library provided by your graphics card driver. This can be handled by the *Vulkan SDK's Loading Layer*, or by using system specific calls like Win32's `LoadLibrary("C:/Windows/SysWOW64/vulkan-1-1-0-30-0.dll")`.

2. **Get the Library Functions** - Reference a `vulkan.h` file, which is a part of the SDK, or you can generate  from their [API documentation repo](https://github.com/KhronosGroup/Vulkan-Docs)).

1. **Create your Vulkan App** - with `vkInstance instance;` [RAII](https://en.wikipedia.org/wiki/Resource_Acquisition_Is_Initialization) comes into play here.

2. **Query for Devices** - you can send request to check what devices are on this computer with `vkPhysicalDevices`. Then you can allocate data structures and tasks independently. Since you have semephoric support of the app, concurrent rendering is possible!

3. **Initialize Device Queue** - Create a `vkDevice`, specify it's features with `vkPhysicalDeviceFeatures`, and create `vkQueue`(s) to handle requests. (Just like OpenCL).

4. **Create a Window Surface** - `vkSurfaceKHR` (like a canvas in WebGL), and a swap chain `vkSwapChainKHR` (Basically frames to be rendered for double/tripple buffering.)

5. **Set up your Render Passes** with `vkFrameBuffer`.

6. **Create a pipeline** with `vkPipeline`. SPecify the current shader with `vkShaderModule` objects. This is perfect for deffered rendering techniques.

7. **Send draw operations** to the `vkQueue` in groups called `vkCommandBuffer`(s). Each Queue is allocated from a `vkCommandPool`

8. **Manage the changing of frames** via `vkAcuqireNextImageKHR`, execute the command buffers you're rendering with `vkQueueSubmit`, and display the image with `vkQueuePresentKHR`.

## Frame Vulkan calls

There can be a lot that goes into rendering a single frame, the following is from Vulkan's Cube example:

```bash
|- Debug Frame
  |- Frame Start
  |- Color Pass 1 (1 Targets)
      |- 7) vkCmdPipelineBarrier
      |- 8) vkCmdBeginRenderPass
      |- 9) vkCmdBindPipeline
      |- 10) vkCmdBindDescriptorSet
      |- 11) vkCmdSetViewport
      |- 12) vkCmdSetScissor
      |- 13) vkCmdDraw(36, 1)
      |- 14) vkCmdEndRenderPass(C = Store, D=Do not Care)
      |- 17) vkQueueSubmit(1)[0] vkBeginCommandBuffer(ID 172)
      |- 18) vkQueuePresentKHR()
```
