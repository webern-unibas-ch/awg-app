import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

/**
 * The FullscreenToggleConfig interface.
 *
 * It defines the configuration for the fullscreen toggle button.
 */
export interface FullscreenToggleConfig {
    /**
     * The icon to be displayed on the fullscreen toggle button.
     */
    icon: IconDefinition;

    /**
     * The title to be displayed on the fullscreen toggle button.
     */
    title: string;

    /**
     * The custom CSS class to be applied to the fullscreen toggle button.
     */
    customClass: string;

    /**
     * The action to be performed when the fullscreen toggle button is clicked.
     */
    action: () => void;
}
