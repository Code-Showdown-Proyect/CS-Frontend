export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>){
    return (
        <label
            className="block text-sm/6 font-medium text-gray-900"
            {...props}
        />
    );
}
