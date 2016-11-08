#define VULKAN_HPP_TYPESAFE_CONVERSION

#define __INT32_TYPE__

#include "stdio.h"
#include "vulkan/vulkan.hpp"
#include "glm/vec3.hpp"
#include "glm/mat4x4.hpp"

int main() {

#pragma region StartInstance

	std::vector<const char*> extensions = {
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

#pragma region VirtualDevice
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
			0,
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

#pragma region FrameBuffers
	std::vector<vk::ImageView> frameBufferAttachment = {};
	auto framebuffer = device.createFramebuffer(
		vk::FramebufferCreateInfo(
			vk::FramebufferCreateFlags(),
			renderpass,
			frameBufferAttachment.size(),
			frameBufferAttachment.data(),
			512U,
			512U,
			1U
		));
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

	auto pvi = vk::PipelineVertexInputStateCreateInfo();
	auto pia = vk::PipelineInputAssemblyStateCreateInfo();
	auto pt = vk::PipelineTessellationStateCreateInfo();
	auto pv = vk::PipelineViewportStateCreateInfo();
	auto pr = vk::PipelineRasterizationStateCreateInfo();
	auto pm = vk::PipelineMultisampleStateCreateInfo();
	auto pds = vk::PipelineDepthStencilStateCreateInfo();
	auto pbs = vk::PipelineColorBlendStateCreateInfo();
	auto pdy = vk::PipelineDynamicStateCreateInfo();

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

	graphicsQueue.submit(kernels, NULL);
	graphicsQueue.presentKHR(vk::PresentInfoKHR());
#pragma endregion


	return 0;
}