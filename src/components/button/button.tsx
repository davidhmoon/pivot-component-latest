export interface ButtonProps {
    className?: string;
    children?: Element | string | any;
    styleProp?: string;
    click?: () => void;
    disabled?: boolean;
    pressed_status?: string | null;
    pressed_country?: string | null;
    style?: any;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const Button = ({
    children = 'Button',
    styleProp = 'border-indigo-600 bg-indigo-600 text-white hover:bg-transparent hover:text-indigo-600',
    click,
    disabled = false,
    pressed_status,
    pressed_country,
    style = {},
}: ButtonProps) => {
    const isPressed = pressed_status !== null || pressed_country !== null;

    return (
        <button onClick={click} className={styleProp} disabled={disabled} style={style}>
            {children}
        </button>
    );
};
