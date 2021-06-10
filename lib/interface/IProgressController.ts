import {Ref} from "vue-demi";

export interface IProgressController
{
    readonly percentage: Ref<number>;

    /**
     * Starts the progress bar
     */
    start(expectedTime?: number): void;

    /**
     * Pauses the progress bar
     */
    pause(): void;

    /**
     * Resumes a paused progress bar
     */
    resume(): void;

    /**
     * Finishes the progress bar
     */
    finish(fail?: boolean): Promise<void>;

    /**
     * Hide the progress bar
     */
    hide(): Promise<void>;
}