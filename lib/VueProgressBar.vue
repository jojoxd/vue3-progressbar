<template>
  <div :style="style" :class="classes"></div>
</template>

<script lang="ts">
  import {defineComponent, inject, computed, InjectionKey} from 'vue-demi';
  import {injectKey} from "./index";
  import type {IInternalProgressController} from "./interface/IInternalProgressController";

  export default defineComponent({
    name: 'VueProgressBar',

    setup()
    {
      const progress: IInternalProgressController = inject(injectKey as InjectionKey<IInternalProgressController>)!;

      const classes = computed(() => {
        const classes = [];

        classes.push({ failed: progress.failed.value });

        return classes;
      })

      const style = computed(() => {
        const style: any = {};
        style['z-index'] = 999_999;

        // style['background-color'] = progress.failed.value ? progress.options.failedColor : progress.options.color;
        style['opacity'] = progress.shown.value ? 1 : 0;
        style['position'] = progress.options.position;

        if(['top', 'bottom'].includes(progress.options.location)) {
          style[progress.options.location] = '0px';

          style[progress.options.inverse ? 'right' : 'left'] = '0px';

          style['width'] = `${Math.round(progress.percentage.value)}%`;
          style['height'] = progress.options.thickness;

          style['transition'] = (progress.shown.value ? `width ${progress.options.transition.speed} ease-in-out, ` : '') + `opacity ${progress.options.transition.opacity} ease-in-out`;

          if(progress.options.floating) {
            style[`margin-${progress.options.location === 'top' ? 'bottom' : 'top'}`] = `-${progress.options.thickness}`;
          }
        } else if(['left', 'right'].includes(progress.options.location)) {
          style[progress.options.location] = '0px';

          style[progress.options.inverse ? 'top' : 'bottom'] = '0px';

          style['width'] = progress.options.thickness;
          style['height'] = `${Math.round(progress.percentage.value)}%`;

          style['transition'] = (progress.shown.value ? `height ${progress.options.transition.speed} ease-in-out, ` : '') + `opacity ${progress.options.transition.opacity} ease-in-out`;

          if(progress.options.floating) {
            style[`margin-${progress.options.location === 'left' ? 'right' : 'left'}`] = `-${progress.options.thickness}`;
          }
        }

        return style;
      });

      return {
        classes,
        style,
      };
    }
  });
</script>