const r = <T>(m: { default: T }) => m.default;

type Entry = {
	name: string;
	description: string;
	comp: (...args: any) => any;
	code: [string, string, string];
};

export const examples: Entry[] = [
	{
		name: 'Basic',
		description: 'Basic ah knob',
		comp: r(await import('../examples/Basic.astro')),
		code: [
			r(await import('../examples/Basic.svelte?raw')),
			r(await import('../examples/Basic.tsx?raw')),
			r(await import('../examples/Basic.svelte?raw'))
		]
	}
];
