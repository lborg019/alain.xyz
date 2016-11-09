#define VULKAN_HPP_TYPESAFE_CONVERSION
#define USE_SWAPCHAIN_EXTENSIONS
#define VK_USE_PLATFORM_WIN32_KHR
#define __INT32_TYPE__

#include "windows.h"
#include "stdio.h"
#include "vulkan/vulkan.hpp"
#include "glm/vec3.hpp"
#include "glm/mat4x4.hpp"

LRESULT CALLBACK WndProc(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	return 0;
}

int APIENTRY WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR pCmdLine, int nCmdShow)
{

#pragma region StartInstance

	std::vector<const char*> extensions = 
	{
		VK_KHR_SURFACE_EXTENSION_NAME,
		VK_KHR_WIN32_SURFACE_EXTENSION_NAME,
		VK_EXT_DEBUG_REPORT_EXTENSION_NAME
	};

	std::vector<const char*> layers =
	{
		"VK_LAYER_LUNARG_standard_validation",
		"VK_LAYER_RENDERDOC_Capture"
	};

	auto appInfo = vk::ApplicationInfo(
		"MyApp",
		VK_MAKE_VERSION(1, 0, 0),
		"MyAppEngine",
		VK_MAKE_VERSION(1, 0, 0),
		VK_MAKE_VERSION(1, 0, 0)
	);

	auto instanceInfo = vk::InstanceCreateInfo();

	instanceInfo.setPApplicationInfo(&appInfo);
	instanceInfo.enabledExtensionCount = extensions.size();
	instanceInfo.ppEnabledExtensionNames = extensions.data();
	instanceInfo.enabledLayerCount = layers.size();
	instanceInfo.ppEnabledLayerNames = layers.data();

	auto instance = vk::createInstance(instanceInfo);

#pragma endregion

#pragma region PhysicalDevices

	// Initialize Devices
	auto physicalDevices = instance.enumeratePhysicalDevices();
	auto gpu = physicalDevices[0];
	auto gpuProps = gpu.getProperties();

#pragma endregion

#pragma region LogicalDevice
	// Init Device Extension/Validation layers
	std::vector<const char*> deviceExtensions =
	{
		VK_KHR_SWAPCHAIN_EXTENSION_NAME,
		VK_EXT_DEBUG_MARKER_EXTENSION_NAME
	};

	std::vector<const char*> deviceValidationLayers =
	{
		"VK_LAYER_LUNARG_standard_validation",
		"VK_LAYER_RENDERDOC_Capture"
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
#pragma endregion

#pragma region Queue
	auto graphicsQueue = device.getQueue(graphicsFamilyIndex, 0);
#pragma endregion

#pragma region CommandPool
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
#pragma endregion

#pragma region RenderPass
	std::vector<vk::AttachmentDescription> attachments =
	{
		vk::AttachmentDescription(
			vk::AttachmentDescriptionFlags(),
			vk::Format::eB8G8R8A8Unorm,
			vk::SampleCountFlagBits::e1,
			vk::AttachmentLoadOp::eClear,
			vk::AttachmentStoreOp::eStore,
			vk::AttachmentLoadOp::eClear,
			vk::AttachmentStoreOp::eStore,
			vk::ImageLayout::eUndefined,
			vk::ImageLayout::ePresentSrcKHR
		)
	};

	std::vector<vk::AttachmentReference> colorReferences =
	{
		vk::AttachmentReference(0, vk::ImageLayout::eColorAttachmentOptimal)
	};

	std::vector<vk::SubpassDescription> subpasses =
	{
		vk::SubpassDescription(
			vk::SubpassDescriptionFlags(),
			vk::PipelineBindPoint::eGraphics,
			0,
			nullptr,
			colorReferences.size(),
			colorReferences.data(),
			nullptr,
			nullptr,
			0,
			nullptr
		)
	};

	std::vector<vk::SubpassDependency> dependencies =
	{
		vk::SubpassDependency(
			~0U,
			0,
			vk::PipelineStageFlags(vk::PipelineStageFlagBits::eAllGraphics),
			vk::PipelineStageFlags(vk::PipelineStageFlagBits::eAllGraphics),
			vk::AccessFlags(vk::AccessFlagBits::eMemoryRead),
			vk::AccessFlags(vk::AccessFlagBits::eColorAttachmentRead | vk::AccessFlagBits::eColorAttachmentWrite)
		)
	};

	auto renderpass = device.createRenderPass(
		vk::RenderPassCreateInfo(
			vk::RenderPassCreateFlags(),
			attachments.size(),
			attachments.data(),
			subpasses.size(),
			subpasses.data(),
			dependencies.size(),
			dependencies.data()
		)
	);

#pragma endregion

#pragma region Window
	std::string title = "MyVulkanApp";
	std::string name = "MyVulkanApp";
	uint32_t width = 1280;
	uint32_t height = 720;

	// Attach Console

	AllocConsole();
	AttachConsole(GetCurrentProcessId());

	FILE* stream;
	freopen_s(&stream, "CONOUT$", "w+", stdout);
	SetConsoleTitle(TEXT(title.c_str()));

	WNDCLASSEX wndClass;

	wndClass.cbSize = sizeof(WNDCLASSEX);
	wndClass.style = CS_HREDRAW | CS_VREDRAW;
	wndClass.lpfnWndProc = WndProc;
	wndClass.cbClsExtra = 0;
	wndClass.cbWndExtra = 0;
	wndClass.hInstance = hInstance;
	wndClass.hIcon = LoadIcon(NULL, IDI_APPLICATION);
	wndClass.hCursor = LoadCursor(NULL, IDC_ARROW);
	wndClass.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
	wndClass.lpszMenuName = NULL;
	wndClass.lpszClassName = name.c_str();
	wndClass.hIconSm = LoadIcon(NULL, IDI_WINLOGO);

	if (!RegisterClassEx(&wndClass)) {
		fflush(stdout);
		exit(1);
	}

	int screenWidth = GetSystemMetrics(SM_CXSCREEN);
	int screenHeight = GetSystemMetrics(SM_CYSCREEN);

	DWORD dwExStyle;
	DWORD dwStyle;

	dwExStyle = WS_EX_APPWINDOW | WS_EX_WINDOWEDGE;
	dwStyle = WS_OVERLAPPEDWINDOW | WS_CLIPSIBLINGS | WS_CLIPCHILDREN;

	RECT windowRect;
	windowRect.left = 0L;
	windowRect.top = 0L;
	windowRect.right = (long)width;
	windowRect.bottom = (long)height;

	AdjustWindowRectEx(&windowRect, dwStyle, FALSE, dwExStyle);

	std::string windowTitle = "WindowTItle";
	auto window = CreateWindowEx(0,
		name.c_str(),
		windowTitle.c_str(),
		dwStyle | WS_CLIPSIBLINGS | WS_CLIPCHILDREN,
		0,
		0,
		windowRect.right - windowRect.left,
		windowRect.bottom - windowRect.top,
		NULL,
		NULL,
		hInstance,
		NULL);

	// Center on screen
	uint32_t x = (GetSystemMetrics(SM_CXSCREEN) - windowRect.right) / 2;
	uint32_t y = (GetSystemMetrics(SM_CYSCREEN) - windowRect.bottom) / 2;
	SetWindowPos(window, 0, x, y, 0, 0, SWP_NOZORDER | SWP_NOSIZE);

	if (!window) {
		printf("Could not create window!\n");
		fflush(stdout);
		exit(1);
	}

	ShowWindow(window, SW_SHOW);
	SetForegroundWindow(window);
	SetFocus(window);
#pragma endregion

#pragma region Surface
	auto surfaceSize = vk::Extent2D(width, height);
	auto surfaceInfo = vk::Win32SurfaceCreateInfoKHR(vk::Win32SurfaceCreateFlagsKHR(), hInstance, window);
	auto vkSurfaceInfo = surfaceInfo.operator const VkWin32SurfaceCreateInfoKHR&();

	auto surface = vk::SurfaceKHR();
	auto createwin32surface = vkCreateWin32SurfaceKHR(instance, &vkSurfaceInfo, NULL, &surface.operator VkSurfaceKHR);
	assert(createwin32surface == VK_SUCCESS);

	// Get surface information

	auto surfaceCapabilities = gpu.getSurfaceCapabilitiesKHR(surface);
	auto surfaceFormats = gpu.getSurfaceFormatsKHR(surface);
	auto surfacePresentModes = gpu.getSurfacePresentModesKHR(surface);


	// Check to see if we can display rgb colors.
	vk::Format colorFormat;
	vk::ColorSpaceKHR colorSpace;

	if (surfaceFormats.size() == 1 && surfaceFormats[0].format == vk::Format::eUndefined)
		colorFormat = vk::Format::eB8G8R8A8Unorm;
	else
		colorFormat = surfaceFormats[0].format;

	colorSpace = surfaceFormats[0].colorSpace;
#pragma endregion

#pragma region Swapchain

	auto surfaceCapabilities = gpu.getSurfaceCapabilitiesKHR(surface);
	auto surfacePresentModes = gpu.getSurfacePresentModesKHR(surface);

	// check the surface width/height.
	if (!(surfaceCapabilities.currentExtent.width == -1 || surfaceCapabilities.currentExtent.height == -1)) {
		surfaceSize = surfaceCapabilities.currentExtent;
	}

	auto presentMode = vk::PresentModeKHR::eImmediate;

	// Check present modes @TODO load from config.json this info.
	for (auto& pm : surfacePresentModes) {
		if (pm == vk::PresentModeKHR::eMailbox) {
			presentMode = vk::PresentModeKHR::eMailbox;
			break;
		}
	}

	assert(surfaceCapabilities.maxImageCount >= 3);
	auto swapchainCreateInfo = vk::SwapchainCreateInfoKHR();
	swapchainCreateInfo.surface = surface;
	swapchainCreateInfo.minImageCount = 3;
	swapchainCreateInfo.imageFormat = colorFormat;
	swapchainCreateInfo.imageColorSpace = colorSpace;
	swapchainCreateInfo.imageExtent = surfaceSize;
	swapchainCreateInfo.imageArrayLayers = 1;
	swapchainCreateInfo.imageUsage = vk::ImageUsageFlagBits::eColorAttachment;
	swapchainCreateInfo.imageSharingMode = vk::SharingMode::eExclusive;

	std::vector<uint32_t> queueFamilyIdices;
	queueFamilyIdices.push_back(graphicsFamilyIndex);

	swapchainCreateInfo.queueFamilyIndexCount = queueFamilyIdices.size();
	swapchainCreateInfo.pQueueFamilyIndices = queueFamilyIdices.data();
	swapchainCreateInfo.preTransform = vk::SurfaceTransformFlagBitsKHR::eIdentity;
	swapchainCreateInfo.compositeAlpha = vk::CompositeAlphaFlagBitsKHR::eOpaque;
	swapchainCreateInfo.presentMode = presentMode;

	auto swapchain = device.createSwapchainKHR(swapchainCreateInfo);
	auto swapchainImages = device.getSwapchainImagesKHR(swapchain);
	auto swapchainImageCount = swapchainImages.size();

	struct SwapChainBuffer {
		vk::Image image;
		vk::ImageView view;
		vk::Framebuffer frameBuffer;
	};

	std::vector<SwapChainBuffer> swapchainBuffers;
	swapchainBuffers.resize(swapchainImageCount);

	for (int i = 0; i < swapchainImageCount; i++)
	{
		swapchainBuffers[i].image = swapchainImages[i];

		swapchainBuffers[i].view = device.createImageView(
			vk::ImageViewCreateInfo(
				vk::ImageViewCreateFlags(),
				swapchainImages[i],
				vk::ImageViewType::e1D,
				colorFormat,
				vk::ComponentMapping(),
				vk::ImageSubresourceRange()
			)
		);

		swapchainBuffers[i].frameBuffer = device.createFramebuffer(
			vk::FramebufferCreateInfo(
				vk::FramebufferCreateFlags(),
				renderpass,
				1,
				&swapchainBuffers[i].view,
				surfaceSize.width,
				surfaceSize.height,
				1
			)
		);
	}
#pragma endregion

#pragma region DescriptorPool
	auto descriptorPool = device.createDescriptorPool(
		vk::DescriptorPoolCreateInfo(
			vk::DescriptorPoolCreateFlags(),
			0,
			0,
			nullptr
		)
	);

	std::vector<vk::DescriptorSetLayoutBinding> descriptorSetLayoutBindings = 
	{
		vk::DescriptorSetLayoutBinding(
			0,
			vk::DescriptorType::eUniformBuffer
		)
	}

	std::vector<vk::DescriptorSetLayout> descriptorSetLayouts = {
		device.createDescriptorSetLayout(
			vk::DescriptorSetLayoutCreateInfo(
				vk::DescriptorSetLayoutCreateFlags(),
				descriptorSetLayoutBindings.size(),
				descriptorSetLayoutBindings.data()
		)
		)
	};

	auto descriptorSets = device.allocateDescriptorSets(
		vk::DescriptorSetAllocateInfo(
			descriptorPool,
			descriptorSetLayouts.size(),
			descriptorSetLayouts.data()
		)
	);


#pragma endregion

#pragma region Pipeline

	std::vector<vk::DescriptorSetLayout> layouts = {

	};

	std::vector<vk::PushConstantRange> pushConstants = {

	};

	auto pipelineLayout = device.createPipelineLayout(
		vk::PipelineLayoutCreateInfo(
			vk::PipelineLayoutCreateFlags(),
			layouts.size(),
			layouts.data(),
			pushConstants.size(),
			pushConstants.data()
		)
	);

	auto vertModule = device.createShaderModule(
		vk::ShaderModuleCreateInfo(
			vk::ShaderModuleCreateFlags(),
			0,
			nullptr
		)
	);

	auto fragModule = device.createShaderModule(
		vk::ShaderModuleCreateInfo(
			vk::ShaderModuleCreateFlags(),
			0,
			nullptr)
	);

	auto pipelineCache = device.createPipelineCache(vk::PipelineCacheCreateInfo());

	std::vector<vk::PipelineShaderStageCreateInfo> pipelineShaderStages = {
		vk::PipelineShaderStageCreateInfo(
			vk::PipelineShaderStageCreateFlags(),
			vk::ShaderStageFlagBits::eVertex,
			vertModule,
			"main",
			nullptr
		),
		vk::PipelineShaderStageCreateInfo(
			vk::PipelineShaderStageCreateFlags(),
			vk::ShaderStageFlagBits::eFragment,
			fragModule,
			"main",
			nullptr
		)
	};

	auto pvi = vk::PipelineVertexInputStateCreateInfo(
		vk::PipelineVertexInputStateCreateFlags(),
		0
	);

	auto pia = vk::PipelineInputAssemblyStateCreateInfo(
	);

	auto pt = vk::PipelineTessellationStateCreateInfo(
	);

	auto pv = vk::PipelineViewportStateCreateInfo(
		vk::PipelineViewportStateCreateFlagBits(),
		1,
		&viewport,
		1,
		&scissor
	);

	auto pr = vk::PipelineRasterizationStateCreateInfo(
	);

	auto pm = vk::PipelineMultisampleStateCreateInfo(
		vk::PipelineMultisampleStateCreateFlags(),
		vk::SampleCountFlagBits::e1
	);

	// Dept and Stencil state for primative compare/test operations

	auto pds = vk::PipelineDepthStencilStateCreateInfo(
		vk::PipelineDepthStencilStateCreateFlags(),
		VK_FALSE,
		VK_FALSE,
		vk::CompareOp::eLess,
		VK_FALSE,
		VK_FALSE,
		vk::StencilOpState(),
		vk::StencilOpState(),
		0,
		0
	);

	// Blend State - How two primatives should draw on top of each other.
	std::vector<vk::PipelineColorBlendAttachmentState> colorBlendAttachments =
	{
		vk::PipelineColorBlendAttachmentState(
			VK_FALSE,
			vk::BlendFactor::eOne,
			vk::BlendFactor::eOne,
			vk::BlendOp::eAdd,
			vk::BlendFactor::eOne,
			vk::BlendFactor::eOne,
			vk::BlendOp::eAdd,
			vk::ColorComponentFlags(vk::ColorComponentFlagBits::eR | vk::ColorComponentFlagBits::eG | vk::ColorComponentFlagBits::eB | vk::ColorComponentFlagBits::eA)
		)
	};

	auto pbs = vk::PipelineColorBlendStateCreateInfo(
		vk::PipelineColorBlendStateCreateFlags(),
		0,
		vk::LogicOp::eClear,
		colorBlendAttachments.size(),
		colorBlendAttachments.data()
	);

	auto pdy = vk::PipelineDynamicStateCreateInfo(
	);

	auto graphicsPipeline = device.createGraphicsPipeline(pipelineCache,
		vk::GraphicsPipelineCreateInfo(
			vk::PipelineCreateFlags(vk::PipelineCreateFlagBits::eDerivative),
			pipelineShaderStages.size(),
			pipelineShaderStages.data(),
			&pvi,
			&pia,
			&pt,
			&pv,
			&pr,
			&pm,
			&pds,
			&pbs,
			&pdy,
			pipelineLayout,
			renderpass
		)
	);

#pragma endregion

#pragma region VertexBuffer

	struct Vertex
	{
		float position[3];
		float color[3];
	};

	// Index buffer
	struct
	{
		VkDeviceMemory memory;
		VkBuffer buffer;
		uint32_t count;
	} indices;

	// Setup vertices
	std::vector<Vertex> vertexBuffer =
	{
		{ { 1.0f,  1.0f, 0.0f },{ 1.0f, 0.0f, 0.0f } },
		{ { -1.0f,  1.0f, 0.0f },{ 0.0f, 1.0f, 0.0f } },
		{ { 0.0f, -1.0f, 0.0f },{ 0.0f, 0.0f, 1.0f } }
	};
	uint32_t vertexBufferSize = static_cast<uint32_t>(vertexBuffer.size()) * sizeof(Vertex);

	// Setup indices
	std::vector<uint32_t> indexBuffer = { 0, 1, 2 };
	indices.count = static_cast<uint32_t>(indexBuffer.size());
	uint32_t indexBufferSize = indices.count * sizeof(uint32_t);

	device.createBuffer(
		vk::BufferCreateInfo()
	)
#pragma endregion

#pragma region Commands

	// From here we can do common GL commands
	commandBuffers[0].begin(vk::CommandBufferBeginInfo());
	commandBuffers[0].beginRenderPass(
		vk::RenderPassBeginInfo(
			renderpass
		),
		vk::SubpassContents::eInline
	);

	// Bind Descriptor Sets, these are attribute/uniform "descriptions"
	commandBuffers[0].bindPipeline(vk::PipelineBindPoint::eGraphics, graphicsPipeline);
	commandBuffers[0].bindDescriptorSets(vk::PipelineBindPoint::eGraphics, pipelineLayout);
	commandBuffers[0].setViewport();
	commandBuffers[0].setScissor();
	commandBuffers[0].draw(1, 1, 1, 1);
	commandBuffers[0].blitImage();
	commandBuffers[0].endRenderPass();
	commandBuffers[0].end();

#pragma endregion

#pragma region SubmitCommandBuffers
	// Create kernels to submit to the queue on a given render pass.
	auto kernelPipelineStageFlags = vk::PipelineStageFlags::Flags(vk::PipelineStageFlagBits::eAllCommands);
	auto kernel = vk::SubmitInfo(
		0U,
		nullptr,
		&kernelPipelineStageFlags,
		commandBuffers.size(),
		commandBuffers.data(),
		0U,
		nullptr
	);
	std::vector<vk::SubmitInfo> kernels = {
		kernel
	};

	uint32_t imageIndex = 0;

	graphicsQueue.submit(kernels, NULL);
	graphicsQueue.presentKHR(
		vk::PresentInfoKHR(
			0,
			nullptr,
			1,
			&swapchain,
			&imageIndex,
			nullptr
		)
	);

	device.acquireNextImageKHR(swapchain, UINT64_MAX, nullptr, nullptr);
#pragma endregion

	// Keep the window open displaying what was rendered.
	while (true);

	return 0;
}