import {VueProgressBarOptions} from "./index";
import {nextTick, reactive, Ref, ref, watch} from "vue-demi";
import type {IProgressController} from "./interface/IProgressController";
import type {IInternalProgressController} from "./interface/IInternalProgressController";

export class ProgressController implements IProgressController, IInternalProgressController
{
    // <editor-fold name="Properties">
    protected _options: VueProgressBarOptions;

    protected _percentage: Ref<number> = ref(0);

    protected timer: number | null = null;

    protected _running: Ref<boolean> = ref(false);

    protected _interval: Ref<number> = ref(500);

    // protected _cut: Ref<number> = ref(0);

    protected _failed: Ref<boolean> = ref(false);

    protected _shown: Ref<boolean> = ref(false);

    protected _paused: Ref<boolean> = ref(false);

    protected _lastTick: Ref<number> = ref(0);

    protected _tickRate: Ref<number> = ref(50);
    // </editor-fold>

    public constructor(options: VueProgressBarOptions)
    {
        this._options = reactive(options);

        // Manage Interval / ticking Lifecycle
        watch(this._running, () => {
            if(this._running.value) {
                console.log('START RUNNING');
                this.timer = setInterval(() => this.tick(), this._interval.value);

                return;
            }

            console.log('STOP RUNNING');
            clearInterval(this.timer!);
            this.timer = null;
        });

        watch(this._paused, () => {
            this._running.value = !this._paused.value;
        });

        dev: watch(this._failed, (to, from) => {
            console.log(`fail state change from ${from} to ${to}`);
        });

        dev: watch(this._percentage, (to, from) => {
            console.log(`update: from ${from} to ${to}`);
        });

        dev: watch(this._shown, (to, from) => {
            console.log(`shown changed from ${from} to ${to}`);
        });
    }

    protected cleanup()
    {
        // cleanup
        this._failed.value = false;
        this._percentage.value = 0;
        this._paused.value = false;

        this._running.value = false;
    }

    public start(expectedTime: number = 1000): void
    {
        this.cleanup();

        this._running.value = true;
        this._shown.value = true;

        this._tickRate.value = Math.floor(expectedTime / 100);
        this._lastTick.value = Date.now();
    }

    protected tick()
    {
        if(this._percentage.value >= 100) {
            return;
        }

        let now = Date.now();
        if((now - this._lastTick.value) > this._tickRate.value) {
            let ticksSkipped = Math.floor((now - this._lastTick.value) / this._tickRate.value);

            this._lastTick.value = Date.now();
            this._percentage.value = Math.min(80, this._percentage.value + ticksSkipped);

            console.log(`tick (tickRate = ${this._tickRate.value}, progress = ${this._percentage.value}, ticksSkipped = ${ticksSkipped})`);
        }
    }

    // public async start(time: number = 1000): Promise<void>
    // {
    //     console.log('Start Called!');
    //
    //     // this._interval.value = time / 10;
    //     this._cut.value = 1000 / Math.floor(time);
    //
    //     this.cleanup();
    //
    //     // Start running
    //     this._running.value = true;
    //     this._shown.value = true;
    // }

    public async finish(fail: boolean = false): Promise<void>
    {
        return new Promise((resolve) => {
            this._failed.value = fail;
            this._percentage.value = 100;
            this._running.value = false;

            return nextTick(async () => {
                await this.hide();

                resolve();
            });
        });
    }

    public async hide(): Promise<void>
    {
        return new Promise((resolve) => {
            console.log('stop running');

            console.log('hide', this.options.transition.termination);
            setTimeout(() => {

                this._shown.value = false;
                console.log('hide');

                setTimeout(() => {
                    nextTick(() => {
                        this.cleanup();

                        resolve();
                    });
                }, 200);

            }, this._options.transition.termination);
        });
    }

    public pause()
    {
        console.log('pause');

        this._paused.value = true;
        this._running.value = false;
    }

    public resume()
    {
        console.log('resume');

        this._paused.value = false;
        this._running.value = true;
    }

    // <editor-fold name="getters">
    get percentage(): Ref<number>
    {
        return this._percentage;
    }

    get failed(): Ref<boolean>
    {
        return this._failed;
    }

    get options(): VueProgressBarOptions
    {
        return this._options;
    }

    get paused(): Ref<boolean>
    {
        return this._paused;
    }

    get running(): Ref<boolean>
    {
        return this._running;
    }

    get shown(): Ref<boolean>
    {
        return this._shown;
    }
    // </editor-fold>
}
