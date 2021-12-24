type ButtonProps = {
    title: string,
    onClick: (e: React.MouseEvent) => void,
    className?: string
}

const Button: React.FC<ButtonProps> = ({
    title = '',
    className = '',
    onClick = () => undefined
}) => {
    return (
        <button className={`shadow-md bg-blue-500 text-white rounded-lg p-2 text-sm hover:shadow-sm hover:bg-blue-600 transition-all ${className}`} onClick={onClick}>{title}</button>
    )
}

export default Button;