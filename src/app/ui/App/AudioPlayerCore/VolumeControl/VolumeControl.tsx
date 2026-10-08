import { useState } from "react";
import type { ChangeEvent } from "react";
import s from "./VolumeControl.module.css";
import { Icon } from "@/common/components";

type VolumeControlProps = {
    volume: number;
    // Функция onChange теперь должна принимать либо событие, либо напрямую числовое значение
    onChange: (value: number) => void;
};

export const VolumeControl = ({ volume, onChange }: VolumeControlProps) => {
    // Храним предыдущее значение громкости, чтобы восстановить его после включения звука
    const [prevVolume, setPrevVolume] = useState(0.5);

    // Обработчик ручного изменения ползунка громкости
    const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nextVolume = parseFloat(e.target.value);
        onChange(nextVolume);

        // Если пользователь вручную крутит ползунок и он больше 0, запоминаем это значение
        if (nextVolume > 0) {
            setPrevVolume(nextVolume);
        }
    };

    // Логика клика по иконке (Mute / Unmute)
    const handleToggleMute = () => {
        if (volume > 0) {
            // Запоминаем текущую громкость перед выключением и ставим 0
            setPrevVolume(volume);
            onChange(0);
        } else {
            // Восстанавливаем сохраненный уровень громкости
            onChange(prevVolume);
        }
    };

    return (
            <div className={s.volumeContainer}>
                <button
                    type="button"
                    className={s.iconButton}
                    onClick={handleToggleMute}
                    title={volume === 0 ? "Включить звук" : "Выключить звук"}
                >
                    {volume === 0 ? (
                        <Icon id={'icon-mute'} />
                    ) : (
                        <Icon id={'icon-volume'} />
                    )}
                </button>

                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleSliderChange}
                    className={s.volumeSlider}
                    style={{
                        background: `linear-gradient(to right, currentColor ${volume * 100}%, var(--color-gray-800) ${volume * 100}%)`
                    }}
                />
                <Icon id={'icon-expand'}/>
            </div>
    );
};
