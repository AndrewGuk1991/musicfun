
import s from "./AudioPlayerCore.module.css";
import {useAudioPlayer} from "@/common/hooks";
import {TrackInfo} from "@/app/ui/App/AudioPlayerCore";
import {PlayerControls} from "@/app/ui/App/AudioPlayerCore";
import {VolumeControl} from "@/app/ui/App/AudioPlayerCore";

export const AudioPlayerCore = () => {
    const {
        trackData,
        trackUrl,
        isPlaying,
        isLooping,
        isShuffled,
        currentTime,
        duration,
        volume,
        handlePlayPauseToggle,
        handleProgressClick,
        handleVolumeChange,
        handleNextTrack,
        handlePrevTrack,
    } = useAudioPlayer();

    // Если нет активного трека для воспроизведения — ничего не рендерим
    if (!trackUrl || !trackData) return null;

    return (
        <div className={s.playerWrapper}>
            {/* ЛЕВАЯ ЧАСТЬ: Информация о треке */}
            <TrackInfo
                coverUrl={trackData.coverUrl}
                title={trackData.title}
                artistName={trackData.artistName}
            />

            {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ: Блок управления и прогресс */}
            <PlayerControls
                isPlaying={isPlaying}
                isLooping={isLooping}
                isShuffled={isShuffled}
                currentTime={currentTime}
                duration={duration}
                onPlayPause={handlePlayPauseToggle}
                onProgressClick={handleProgressClick}
                onNextTrack={handleNextTrack}
                onPrevTrack={handlePrevTrack}
            />

            {/* ПРАВАЯ ЧАСТЬ: Ползунок громкости */}
            <VolumeControl
                volume={volume}
                onChange={(value) => {
                    handleVolumeChange({ target: { value: value.toString() } } as any);
                }}
            />
        </div>
    );
};
