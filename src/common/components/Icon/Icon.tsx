type IconProps ={
    id: string
    height?: number
    width?: number
    className?: string
    viewBox?: string
}

export const Icon = ({ id, height = 24, width = 24, className = '', viewBox="0 0 32 32" }: IconProps) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox={viewBox}
            aria-hidden="true"
            style={{ flexShrink: 0 }}
            className={className}
        >
            <use href={`#${id}`} />
        </svg>
    )
}
