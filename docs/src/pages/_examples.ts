const r = <T>(m: { default: T }) => m.default;

const js = async (ihtml: Promise<{ default: string }>, ijs: Promise<{ default: string }>) => {
	const html = r(await ihtml);
	const js = r(await ijs);

	return html + '\n\n<script>\n' + js.replace(/^/gm, '  ') + '\n</script>';
};

type Entry = {
	name: string;
	description: string;
	// this 'any' is required because astro doesn't have a Component type
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	comp: (...args: any) => any;
	code: [string, string, string, string];
};

export const examples: Entry[] = [
	{
		name: 'Basic',
		description: 'Basic styled svg knob',
		comp: r(await import('../examples/BasicKnob.astro')),
		code: [
			await js(import('../examples/BasicKnob.html?raw'), import('../examples/BasicKnob.ts?raw')),
			r(await import('../examples/BasicKnob.svelte?raw')),
			r(await import('../examples/BasicKnob.tsx?raw')),
			r(await import('../examples/BasicKnob.vue?raw'))
		]
	},
	{
		name: 'Image',
		description: 'You can use an image strip for a knob too.',
		comp: r(await import('../examples/ImageKnob.astro')),
		code: [
			await js(import('../examples/ImageKnob.html?raw'), import('../examples/ImageKnob.ts?raw')),
			r(await import('../examples/ImageKnob.svelte?raw')),
			r(await import('../examples/ImageKnob.tsx?raw')),
			r(await import('../examples/ImageKnob.vue?raw'))
		]
	},
	{
		name: 'Custom knob',
		description: `In reality, svgknob and image knob are both based from a <code>&lt;Draggable/&gt;</code> component, that you can use as well, creating your very own custom made knob.`,
		comp: r(await import('../examples/CustomKnob.astro')),
		code: [
			await js(import('../examples/CustomKnob.html?raw'), import('../examples/CustomKnob.ts?raw')),
			r(await import('../examples/CustomKnob.svelte?raw')),
			r(await import('../examples/CustomKnob.tsx?raw')),
			r(await import('../examples/CustomKnob.vue?raw'))
		]
	},
	{
		name: 'Param knobs',
		description: `Since all knobs operate on values between 0 and 1 any type of scaling is done outside of the scope of a knob with parameter objects.`,
		comp: r(await import('../examples/ParamKnob.astro')),
		code: [
			await js(import('../examples/ParamKnob.html?raw'), import('../examples/ParamKnob.ts?raw')),
			r(await import('../examples/ParamKnob.svelte?raw')),
			r(await import('../examples/ParamKnob.tsx?raw')),
			r(await import('../examples/ParamKnob.vue?raw'))
		]
	},
	{
		name: 'Snap points',
		description: `You can specify snap points and how strong the snapping is for your knob. The knob will automatically sort and insert 0 and 1 to your snap point list, so <code>[0.6,0.3]</code> will become <code>[0.0,0.3,0.6,1.0]</code>.
When snapPoints are specified, arrow keys on the keyboard will make the knob jump between them. Pressing alt key will disable the snapping.
This concept will be importand later in the next example.`,
		comp: r(await import('../examples/SnapPoints.astro')),
		code: [
			await js(import('../examples/SnapPoints.html?raw'), import('../examples/SnapPoints.ts?raw')),
			r(await import('../examples/SnapPoints.svelte?raw')),
			r(await import('../examples/SnapPoints.tsx?raw')),
			r(await import('../examples/SnapPoints.vue?raw'))
		]
	},
	{
		name: 'Enum-param knobs',
		description: `Enums, or in typescript realm <code>readonly string[]</code> parameter are a special type of parameter that don't denormalize into a number, instead into a string. <code>EnumParam</code> class comes with helpful properties for knob ui with already calcualted snap points and snap threshold to make value changes 'instant'.`,
		comp: r(await import('../examples/EnumParam.astro')),
		code: [
			await js(import('../examples/EnumParam.html?raw'), import('../examples/EnumParam.ts?raw')),
			r(await import('../examples/EnumParam.svelte?raw')),
			r(await import('../examples/EnumParam.tsx?raw')),
			r(await import('../examples/EnumParam.vue?raw'))
		]
	}
];
