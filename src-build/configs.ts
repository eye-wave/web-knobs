import type { WrapperConfig } from './model';

const draggableConfig: WrapperConfig = {
	componentName: 'Draggable',
	importGroups: [
		{
			from: '../core/draggable',
			imports: [
				'createDraggable',
				'DEFAULT_KNOB_SNAP_THRESHOLD',
				'DEFAULT_KNOB_STEP',
				'DEFAULT_KNOB_VALUE',
				'DEFAULT_KNOB_WEIGHT',
				'type DraggableApi',
				'type DraggableOptions',
				'type DraggableReactive'
			]
		}
	],
	factoryFn: 'createDraggable',
	apiType: 'DraggableApi',
	optionsType: 'DraggableOptions',
	propGroups: [
		[
			{
				kind: 'default',
				name: 'value',
				type: 'number',
				value: 'DEFAULT_KNOB_VALUE',
				bindable: true
			},
			{
				kind: 'default',
				name: 'disabled',
				type: 'boolean',
				value: 'false',
				alias: 'isDisabled'
			},
			{
				kind: 'default',
				name: 'defaultValue',
				type: 'number',
				value: 'DEFAULT_KNOB_VALUE'
			},
			{ kind: 'default', name: 'invertWheel', type: 'boolean', value: 'false' },
			{
				kind: 'default',
				name: 'step',
				type: 'number',
				value: 'DEFAULT_KNOB_STEP'
			},
			{ kind: 'default', name: 'snapPoints', type: 'number[]', value: '[]' },
			{
				kind: 'default',
				name: 'snapThreshold',
				type: 'number',
				value: 'DEFAULT_KNOB_SNAP_THRESHOLD'
			},
			{
				kind: 'default',
				name: 'weight',
				type: 'number',
				value: 'DEFAULT_KNOB_WEIGHT'
			}
		]
	],
	hostElement: 'div',
	hasSlot: true
};

const svgKnobConfig: WrapperConfig = {
	componentName: 'SvgKnob',
	importGroups: [
		{
			from: '../core/components/svg-knob',
			imports: [
				'createSvgKnob',
				'DEFAULT_ARC_RADIUS',
				'DEFAULT_BG_COLOR',
				'DEFAULT_CIRCLE_RADIUS',
				'DEFAULT_DISABLED_COLOR',
				'DEFAULT_MAX_ANGLE',
				'DEFAULT_MIN_ANGLE',
				'DEFAULT_POINTER_LENGTH',
				'DEFAULT_SIZE',
				'DEFAULT_SNAP_POINT_LENGTH',
				'type SvgKnobApi',
				'type SvgKnobOptions',
				'type SvgKnobReactive'
			]
		},
		{
			from: '../core/draggable',
			imports: [
				'DEFAULT_KNOB_SNAP_THRESHOLD',
				'DEFAULT_KNOB_STEP',
				'DEFAULT_KNOB_VALUE',
				'DEFAULT_KNOB_WEIGHT',
				'type DraggableReactive'
			]
		}
	],
	factoryFn: 'createSvgKnob',
	apiType: 'SvgKnobApi',
	optionsType: 'SvgKnobOptions',
	propGroups: [
		[
			{
				kind: 'default',
				name: 'value',
				type: 'number',
				value: 'DEFAULT_KNOB_VALUE',
				bindable: true
			},
			{
				kind: 'default',

				name: 'disabled',
				type: 'boolean',
				value: 'false',
				alias: 'isDisabled'
			},
			{
				kind: 'default',

				name: 'defaultValue',
				type: 'number',
				value: 'DEFAULT_KNOB_VALUE'
			},
			{ kind: 'default', name: 'invertWheel', type: 'boolean', value: 'false' },
			{
				kind: 'default',

				name: 'step',
				type: 'number',
				value: 'DEFAULT_KNOB_STEP'
			},
			{ kind: 'default', name: 'snapPoints', type: 'number[]', value: '[]' },
			{
				kind: 'default',
				name: 'snapThreshold',
				type: 'number',

				value: 'DEFAULT_KNOB_SNAP_THRESHOLD'
			},
			{
				kind: 'default',

				name: 'weight',
				type: 'number',
				value: 'DEFAULT_KNOB_WEIGHT'
			}
		],
		[
			{
				kind: 'default',
				name: 'arcRadius',
				type: 'number',
				value: 'DEFAULT_ARC_RADIUS'
			},
			{
				kind: 'default',
				name: 'bgColor',
				type: 'string',
				value: 'DEFAULT_BG_COLOR'
			},
			{
				kind: 'default',
				name: 'circleRadius',
				type: 'number',
				value: 'DEFAULT_CIRCLE_RADIUS'
			},
			{
				kind: 'default',
				name: 'disabledColor',
				type: 'string',
				value: 'DEFAULT_DISABLED_COLOR'
			},
			{
				kind: 'default',
				name: 'maxAngle',
				type: 'number',
				value: 'DEFAULT_MAX_ANGLE'
			},
			{
				kind: 'default',
				name: 'minAngle',
				type: 'number',
				value: 'DEFAULT_MIN_ANGLE'
			},
			{
				kind: 'default',
				name: 'pointerLength',
				type: 'number',
				value: 'DEFAULT_POINTER_LENGTH'
			},
			{ kind: 'default', name: 'size', type: 'number', value: 'DEFAULT_SIZE' },
			{
				kind: 'default',
				name: 'snapPointLength',
				type: 'number',
				value: 'DEFAULT_SNAP_POINT_LENGTH'
			}
		]
	],
	hostElement: 'div',
	hasSlot: false
};

const imageKnobConfig: WrapperConfig = {
	componentName: 'ImageKnob',
	importGroups: [
		{
			from: '../core/components/image-knob',
			imports: ['createImageKnob', 'type ImageKnobApi']
		},
		{
			from: '../core/draggable',
			imports: [
				'DEFAULT_KNOB_SNAP_THRESHOLD',
				'DEFAULT_KNOB_STEP',
				'DEFAULT_KNOB_VALUE',
				'DEFAULT_KNOB_WEIGHT',
				'type DraggableReactive'
			]
		}
	],
	factoryFn: 'createImageKnob',
	apiType: 'SvgKnobApi',
	optionsType: 'SvgKnobOptions',
	propGroups: [
		[
			{
				kind: 'default',
				name: 'value',
				type: 'number',
				value: 'DEFAULT_KNOB_VALUE',
				bindable: true
			},
			{
				kind: 'default',
				name: 'disabled',
				type: 'boolean',
				value: 'false',
				alias: 'isDisabled'
			},
			{
				kind: 'default',
				name: 'defaultValue',
				type: 'number',
				value: 'DEFAULT_KNOB_VALUE'
			},
			{ kind: 'default', name: 'invertWheel', type: 'boolean', value: 'false' },
			{
				kind: 'default',
				name: 'step',
				type: 'number',
				value: 'DEFAULT_KNOB_STEP'
			},
			{ kind: 'default', name: 'snapPoints', type: 'number[]', value: '[]' },
			{
				kind: 'default',
				name: 'snapThreshold',
				type: 'number',
				value: 'DEFAULT_KNOB_SNAP_THRESHOLD'
			},
			{
				kind: 'default',
				name: 'weight',
				type: 'number',
				value: 'DEFAULT_KNOB_WEIGHT'
			}
		],
		[
			{ kind: 'required', name: 'src', type: 'number' },
			{
				kind: 'default',
				name: 'numberOfFrames',
				type: 'string',
				value: 'null'
			},
			{ kind: 'required', name: 'width', type: 'number' },
			{ kind: 'required', name: 'height', type: 'string' }
		]
	],
	hostElement: 'div',
	hasSlot: false
};

export default [draggableConfig, svgKnobConfig, imageKnobConfig];
