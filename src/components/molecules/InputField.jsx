import Label from "../atoms/Label";
import Input from "../atoms/Input";

const InputField = ({ label, id, type, placeholder, error, ...props }) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type={type} placeholder={placeholder} {...props} />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default InputField;
