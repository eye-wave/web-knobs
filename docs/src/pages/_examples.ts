export type Language = 'javascript' | 'svelte' | 'react' | 'vue';

export type Example = {
	lang: Language;
	code: () => Promise<{ default: string }>;
	component: () => Promise<{ default: unknown }>;
};

export type ExampleEntry = {
	name: string;
	description: string;
	items: Example[];
};

export default [
	{
		name: 'Basic',
		description: 'Basic knob component',
		items: [
			{
				lang: 'javascript',
				code: () => import('../examples/Basic.svelte?raw'),
				component: () => import('../examples/Basic.svelte')
			}
		]
	}
] satisfies ExampleEntry[];
