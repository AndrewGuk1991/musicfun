import React from 'react';
import type { MouseEvent } from 'react';
import {Icon} from "@/common/components";

import s from './TrackEllipsisButton.module.css';

type TrackEllipsisButtonProps = {
    trackId?: string;
    handleTrack: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const TrackEllipsisButton = React.memo(({handleTrack }: TrackEllipsisButtonProps) => {

    return (
        <button
            className={s.ellipsis}
            type="button"
            onClick={handleTrack}
            title="Open track options"
        >
            <Icon id={'icon-ellipsis'} />
        </button>
    );
});
