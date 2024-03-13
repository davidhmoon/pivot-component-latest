import { Spinner } from 'flowbite-react';

export interface LoaderProps {
    title?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const Loader = ({ title = 'Loading' }: LoaderProps) => {
    return (
        <div className="flex w-full h-full items-center justify-center my-3">
            <Spinner aria-label="Spinner button example" />
            <span className="pl-3">{title}...</span>
        </div>
    );
};
