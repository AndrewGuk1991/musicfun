
import { Icon } from "@/common/components";
import s from './MediaPlayButton.module.css';

type MediaPlayButtonProps = {
    isPlaying: boolean;
    onToggle: () => void;
    size?: number;
    isDisabled?: boolean;
};

export const MediaPlayButton = ({
                                    isPlaying,
                                    onToggle,
                                    size = 60,
                                    isDisabled = false
                                }: MediaPlayButtonProps) => {

    if (isDisabled) return null;

    return (
        <button className={s.playPauseBtn} onClick={onToggle}>
            <Icon
                id={isPlaying ? 'icon-btn-pause' : 'icon-btn-play'}
                height={size}
                width={size}
                viewBox="0 0 60 60"
            />
        </button>
    );
};
