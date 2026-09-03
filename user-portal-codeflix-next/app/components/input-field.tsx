

type InputFieldProps = {
  id: string;
  type: string;
  name: string;
  autoComplete: string;
  placeholder: string;
  label: string;
  required?: boolean;
};

export default function  InputField({
  id,
  type,
  name,
  autoComplete,
  placeholder,
  label,
  required,
}: InputFieldProps) {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id} className='font-bold text-gray-400'>
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className={`credentialInput rounded-lg border border-[#5858587a] bg-[#1d1d1dcb] p-3 text-lg font-extrabold text-white outline-none placeholder:text-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-600/30`}
      />
    </div>
  );
}
