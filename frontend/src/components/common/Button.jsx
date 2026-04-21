export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium bg-black text-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60';

  const variantClasses = {
    primary: '',
    secondary: '',
    ghost: '',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant] ?? variantClasses.primary} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
