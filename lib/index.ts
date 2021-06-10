import { App, Plugin } from 'vue-demi';
import ProgressBarView from "./VueProgressBar.vue";
import {ProgressController} from "./ProgressController";
import type {IProgressController} from "./interface/IProgressController";

function assign<T extends V, V>(target: T, ...sources: Array<Partial<T>>) {
    for(const source of sources) {
        for(const key in source) {
            if(Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key]!;
            }
        }
    }

    return target;
}

export interface VueProgressBarOptions
{

    canSuccess: boolean;

    show: boolean;

    color: string;

    position: string;

    failedColor: string;

    thickness: string;

    transition: {
        speed: string;

        opacity: string;

        termination: number;
    };

    floating: boolean;

    autoRevert: boolean;

    location: string;

    inverse: boolean;

    autoFinish: boolean;
}

const defaultOptions: VueProgressBarOptions = {

    canSuccess: true,

    show: false,

    color: '#73ccec',

    position: 'fixed',

    failedColor: '#ff0000',

    thickness: '2px',

    transition: {
        speed: '0.2s',

        opacity: '0.6s',

        termination: 300
    },

    floating: false,

    autoRevert: true,

    location: 'top',

    inverse: false,

    autoFinish: true
};

export const injectKey = Symbol('VueProgressBar');

const VueProgressBarPlugin: Plugin & { install: Plugin['install'] } = {
    install(app: App, setOptions: Partial<VueProgressBarOptions>): IProgressController
    {
        const options = assign(defaultOptions, setOptions);

        const progressController = new ProgressController(options);
        app.provide<IProgressController>(injectKey, progressController);

        app.component('VueProgressBar', ProgressBarView);

        return progressController;
    },
};

export { IProgressController };

export default VueProgressBarPlugin;
