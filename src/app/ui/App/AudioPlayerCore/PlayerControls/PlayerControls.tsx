import type { MouseEvent } from "react";
import { useDispatch } from "react-redux";
import s from "./PlayerControls.module.css";
import { toggleLoop, toggleShuffle } from "@/app/model/playerSlice.ts";
import {Icon, PlayerTimeline} from "@/common/components";


type PlayerControlsProps = {
    isPlaying: boolean;
    isLooping: boolean;
    isShuffled: boolean;
    currentTime: number;
    duration: number;
    onPlayPause: () => void;
    onProgressClick: (e: MouseEvent<HTMLDivElement>) => void;
    onNextTrack: () => void;
    onPrevTrack: () => void;
};

export const PlayerControls = ({
                                   isPlaying,
                                   isLooping,
                                   isShuffled,
                                   currentTime,
                                   duration,
                                   onPlayPause,
                                   onProgressClick,
                                   onNextTrack,
                                   onPrevTrack,
                               }: PlayerControlsProps) => {
    const dispatch = useDispatch();

    return (
        <div className={s.centerControlsBlock}>
            <div className={s.buttonsRow}>
                <button
                    className={`${s.controlBtn} ${isShuffled ? s.activeControl : ''}`}
                    onClick={() => dispatch(toggleShuffle())}
                    title="Shuffle"
                >
                    <Icon id={'icon-shuffle'} />
                </button>

                <button className={s.controlBtn} onClick={onPrevTrack} title="Back track">
                    <Icon id={'icon-back'} />
                </button>

                <button className={s.mainPlayBtn} onClick={onPlayPause} title={isPlaying ? "Stop" : "Play"}>
                    <div className={`${s.iconControl} ${isPlaying ? s.pause : s.play}`} />
                </button>

                <button className={s.controlBtn} onClick={onNextTrack} title="Следующий трек">
                    <Icon id={'icon-next'} />
                </button>

                <button
                    className={`${s.controlBtn} ${isLooping ? s.activeControl : ''}`}
                    onClick={() => dispatch(toggleLoop())}
                    title="Loop track"
                >
                    <Icon id={'icon-loop'} />
                </button>
            </div>

            <PlayerTimeline
                currentTime={currentTime}
                duration={duration}
                onProgressClick={onProgressClick}
            />
        </div>
    );
};
