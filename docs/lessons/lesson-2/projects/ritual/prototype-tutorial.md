# Figma Tutorial

## Figma account set up

Figma is a 2D design app that is popular for designing user interfaces, but is great for other creative work too. If you’ve used Adobe Illustrator before, you should feel right at home. Figma supports synchronous [multiplayer editing](https://www.figma.com/collaboration/), annotated comments, and other features to support online collaboration 

To get started, sign up for a [free Figma education](https://www.figma.com/education/) account using your school email. 

You can use Figma in your web browser or install a [dedicated desktop app](https://www.figma.com/downloads/). Both versions are the same, with the desktop app making it a bit easier to use local fonts installed on your computer. 

Once you’re logged in, note that you can create two types of files in Figma:

- Figma Design file: The fully featured design and prototyping tool we will use for this project.
- FigJam file: A simpler “whiteboard” app for brainstorming and notes.

## Choose your workflow

As described on the previous page, we’re going to use Figma to create an interactive prototype based on wireframe sketches. There are two ways to approach this, and either is valid:

1. Create paper wireframes, photograph them, and make them interactive in Figma. 
2. Create the entire thing in Figma, using digital text and shapes. (Some tips appear below.)

Because we are more concerned with designing an *experience* than a polished visual design, I’ll focus on the “paper wireframe” approach first as that requires less mastery of the software.

## Method 1: Paper Wireframes

See instructions on the previous page to prepare your wireframe images of each app “screen.”

### Getting started with Frames

Create a new “Design file” in Figma and select the **Frame tool** (`F`). In the right sidebar, labeled “Design”, you should see a list of preset Frame sizes; click one of the Phone sizes and you should see a white rectangle appear in the main canvas area. (If you used the paper template, choose iPhone 14.)

<VideoEmbed
  src="/assets/videos/1_add-frame.webm"
  type="local"
  caption="Adding a Frame"
  autoplay
  muted
  loop
  preload="none"
/>

[Frames](https://help.figma.com/hc/en-us/articles/360041539473-Frames-in-Figma) display their name in the Canvas area, as well as in the lefthand “Layers” sidebar. After placing a Frame, you’ll switch back to the default **Move tool** (`V`) that is accessible via the arrow icon in the toolbar. You can give the Frame a more descriptive name (e.g. “Welcome page”) by double-clicking its name in the main Canvas area or the lefthand “Layers” panel. 

<VideoEmbed
  src="/assets/videos/2_rename.webm"
  type="local"
  caption="Renaming a Frame in the Canvas and Layers panel."
  autoplay
  muted
  loop
  preload="none"
/>

### Adding scanned images

With your Frame selected, look in the righthand “Design” panel for the “Fill”, which, by default, is set to white. Click on the white square to the left of the text reading “FFFFFF” (that’s the color code for pure white) to reveal a color picker.

At the top of that panel, select the button for “Image” to upload one of your scanned images and apply it as a background-image to the Frame. 

<VideoEmbed
  src="/assets/videos/3_add-image.webm"
  type="local"
  caption="Adding an image as a fill"
  autoplay
  muted
  loop
  preload="none"
/>

Depending on the [aspect ratio](https://www.uxpin.com/studio/blog/aspect-ratio/) of your image, it may appear cropped in the Frame. With the Fill panel still open, select the dropdown menu that, by default, is set to “Fill.” These are options for how the background image is displayed:

- **Fill**: The image will fill the entire Frame, and crop it as needed.
- **Fit**: The entire image will be displayed, and you may see empty areas in the margins (like letterboxing in a movie).
- **Crop**: Manually crop and resize the image within the Frame.

<VideoEmbed
  src="/assets/videos/4_resize.webm"
  type="local"
  caption="Cropping images"
  autoplay
  muted
  loop
  preload="none"
/>

### Resizing Frames

You can resize a Frame by clicking-and-dragging a corner, or by typing exact pixel dimensions into the Design sidebar while the Frame is selected. 

If you hold `⌘` \(Mac\) or `CTRL` \(Windows\) and drag the corners of the Frame, it will resize the Frame independently of the background image and functionally crop the image or reveal sections that are currently cropped. 

To duplicate a Frame, hold `Alt` \(\Mac) or `Opt` \(Windows\), click on a Frame and *drag* a copy to a new location. \(You can do this with any element!\)

<VideoEmbed
  src="/assets/videos/5_dupe-frame.webm"
  type="local"
  caption="Duplicating a Frame."
  autoplay
  muted
  loop
  preload="none"
/>

### Help! My images aren’t the right aspect ratio.

The preset “Phone” sizes available within the Frame tool use a variety of aspect ratios, so you can try a few and see if one is close to your scanned images.

Alternatively, you can drag all your images into Figma at once, and then wrap them in Frames that match the image sizes.

<VideoEmbed
  src="/assets/videos/6_batch.webm"
  type="local"
  caption="Importing multiple images at once."
  autoplay
  muted
  loop
  preload="none"
/>

**Alternate batch import method:**

1. Select multiple images in your OS file browser. 
2. Drag them into the Figma canvas area. 
3. Right-click one image at a time and “Frame Selection” (Mac: ⌥⌘G  | Win: Alt+Ctrl+G)

Check the size of these Frames though — if your images are very large (e.g. 4000px tall) then the resulting Frames will also be very large, and could lead to some problems. If that’s the case, select all the Frames/images and use the **Scale Tool** (K) to drag-and-resize them to something closer to a the size of a mobile phone (check the preset Frames for reference). 

### Check the Presentation view

Before we start adding interactions, let’s check how our images look in the final Presentation view. 

Click the big ▶️ Play button in the upper-right corner to launch a new tab displaying your Frames in a slideshow-like presentation. By default, you should see your images within an illustrated phone. If you used one of the preset Frame sizes, the image should fit the device pretty well (though you may discover some content is obscured by the camera notch). 

<VideoEmbed
  src="/assets/videos/7_test.webm"
  type="local"
  caption="Testing out Presentation View."
  autoplay
  muted
  loop
  preload="none"
/>

If there’s a big gap, meaning your image’s aspect ratio doesn’t match the phone’s… Go back to the Design file and click the “Prototype” tab in the right sidebar. Here, you can change the device used to present the app. Scroll through the options to find “Custom Size (fit)” — this will remove the phone illustration and display your Frames as you’ve made them. 

### Adding click targets

You can make an app prototype in Powerpoint by simply displaying a sequence of screen images — but with Figma, we can create a nonlinear experience that lets users click on elements to navigate between screens as if using a real app. (As well as prototyping other interactions and animations.) 

If you’re working with scanned paper wireframes, you’ll need to add *additional* Frames *within* each screen to act as clickable targets. 

With the Frame tool (F) selected, click-and-drag over a button or UI element in one of your wireframe images. This will create a new Frame *inside* of the larger Frame; you should rename it to stay organized. 

<VideoEmbed
  src="/assets/videos/8_inner-frame.webm"
  type="local"
  caption='Creating an "inner Frame" to act as a clickable target.'
  autoplay
  muted
  loop
  preload="none"
/>

Like our larger Frames, this Frame can have a Fill color or Stroke (border). To more easily keep track of your Frames while you work, you can either:

- Set a transparent Fill color by lowering the opacity in the color picker. (A solid fill color would obscure your drawing.)
- Add a [Stroke](https://help.figma.com/hc/en-us/articles/360049283914-Apply-and-adjust-stroke-properties) (border) to your Frame.

Give this frame a descriptive name if you want (e.g. “button”).

### Adding interactions

In the right sidebar, switch from the “Design” tab to “Prototype.” 
If you hover your mouse over this edges of this new “overlay” Frame, you’ll see little circles appear. Click on one of those circles, and drag a line towards another Frame. 
<!-- -->
<VideoEmbed
  src="/assets/videos/9_noodle.webm"
  type="local"
  caption="Adding an interaction."
  autoplay
  muted
  loop
  preload="none"
/>

When you release the line, you’ll see an interaction panel appear showing that you’ve created a “Navigate to” interaction, along with the name of the destination Frame. (An image needs to be in a Frame for this to work.)

Now hit that Play button and view your app in the Presentation tab! Test your interaction by clicking the target and navigating to the second Frame. 


<VideoEmbed
  src="/assets/videos/10_present.webm"
  type="local"
  caption="Testing interactions in Presentation view."
  autoplay
  muted
  loop
  preload="none"
/>

Back in the design file, you can edit or delete an interaction by selecting the connection line, including options for transition speed and animation type.

Go forth and create more more Frames and connections! 

ℹ️ **TIP**: You can duplicate your “click target” Frames by holding Option/Alt and click-dragging on the Frame. But make sure you haven’t added an interaction to that Frame, otherwise you’ll duplicate that too!  

## Method 2: Make everything in Figma

You can follow the workflow above, but instead of scanned images, you’ll need to use some additional tools to create your wireframe screens:

- [Text tool](https://help.figma.com/hc/en-us/articles/360039956474-Create-and-edit-text)
- [Shape tools](https://help.figma.com/hc/en-us/articles/360040450133-Basic-shape-tools-in-Figma-design) (rectangles, ellipses, lines, etc.)

Remember this is a wireframe! — Not a fully designed interface. Do not spend excessive time choosing fonts, colors, or making illustrations. 

<VideoEmbed
  src="/assets/videos/11_digital-text.webm"
  type="local"
  caption="Adding digital text and interactions."
  autoplay
  muted
  loop
  preload="none"
/>

If you create digital text or shapes, you don’t need to create “overlay” Frames as described above. *Any element can become a clickable target for interactions*; not just Frames. 

If you want an example of building a simple layout in Figma, see this tutorial on [making a simple profile card](https://help.figma.com/hc/en-us/articles/13502530301207-Make-a-custom-profile-card).

The best way to create a typical “button” is by creating a Frame and placing text inside it; you can [round the corners](https://help.figma.com/hc/en-us/articles/360050986854-Adjust-corner-radius-and-smoothing) of a Frame to make a pill-shape or a circle. In the example below, [auto layout](https://help.figma.com/hc/en-us/articles/5731482952599-Add-auto-layout-to-a-design) is used to center the text within the Frame and control interior padding. 

<VideoEmbed
  src="/assets/videos/12_auto-layout.webm"
  type="local"
  caption="Creating a button with auto layout"
  autoplay
  muted
  loop
  preload="none"
/>


To add icons, follow the instructions above for adding images, or [use a plugin](https://help.figma.com/hc/en-us/articles/360042532714-Use-plugins-in-files) like [Feather Icons](https://www.figma.com/community/plugin/744047966581015514/feather-icons) to browse and add icons directly within Figma. 

## Advanced Interactions

### App-wide navigation menus

Does your app have a navigation menu, with the same buttons appearing on many screens? You *could* manually link every button to their respective pages, but there’s a more efficient way! The following video shows this in full, but the steps are:

1. Create a standalone Frame containing just the navigation menu.
2. Turn it into a [Component](https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma). 
3. Add prototype connections to desired pages. 
4. Place an instance of that Component into each app screen. 

### Overlay Menus

Another common interface element is an [overlay](https://bootcamp.uxdesign.cc/popups-dialogs-tooltips-and-popovers-ux-patterns-2-939da7a1ddcd), which could be a large popup window or a little dropdown menu. You can create these by simply including additional screens, which is totally fine for a low-fidelity wireframe.

But in some cases, you may wish to display content on top of the current screen without navigating to a new page.  This will also be shown in the video below, but the steps are:

1. Create a standalone Frame with your overlay content (including a ✖ close button).
2. Select the trigger element in your main screen.
3. Add interaction → On tap → Open overlay (and select your overlay Frame)
4. Repeat for close action.

<VideoEmbed 
  src="https://www.youtube.com/watch?v=gNECBQCxx0A" 
  type="youtube" 
  title="Figma Components and Overlays Tutorial"
/>

## A note on file management

Figma lets you organize files in the following hierarchy: [Teams](https://help.figma.com/hc/en-us/articles/360039484194-Create-and-explore-a-team) contain [Projects](https://help.figma.com/hc/en-us/articles/1500005554982-Guide-to-files-and-projects), which contain Files. 

Normal free accounts are limited to a single Team and 3 files (sad!) but with an Education account, you can create a [free Education Team](https://help.figma.com/hc/en-us/articles/360041061214-Verify-education-status) and gain unlimited files, as well as some other features.