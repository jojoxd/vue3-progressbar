import type {IProgressController} from "./IProgressController";
import {VueProgressBarOptions} from "../index";
import {Ref} from "vue-demi";

export interface IInternalProgressController extends IProgressController
{
    readonly options: VueProgressBarOptions;

    readonly running: Ref<boolean>;

    readonly failed: Ref<boolean>;

    readonly shown: Ref<boolean>;

    readonly paused: Ref<boolean>;
}