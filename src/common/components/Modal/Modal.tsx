import { useEffect, type ReactNode } from 'react';
import s from './Modal.module.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: Props) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={s.overlay} onClick={onClose}>
            <div className={s.content} onClick={(e) => e.stopPropagation()}>
                <button className={s.closeButton} onClick={onClose} type="button" aria-label="Close modal">
                </button>
                {children}
            </div>
        </div>
    );
};

// --- Подкомпоненты (Compound Components) ---

type SubComponentProps = {
    children: ReactNode;
    className?: string;
};

Modal.Header = ({ children, className = '' }: SubComponentProps) => {
    return <div className={`${s.header} ${className}`}>{children}</div>;
};

Modal.Body = ({ children, className = '' }: SubComponentProps) => {
    return <div className={`${s.body} ${className}`}>{children}</div>;
};

Modal.Footer = ({ children, className = '' }: SubComponentProps) => {
    return <div className={`${s.footer} ${className}`}>{children}</div>;
};
