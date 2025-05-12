import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import flags from 'react-phone-number-input/flags';

const PhoneManager = ({
    value,
    onChange,
    country = "FR",
    ...props
  }) => {
    return (
      <PhoneInput
      international={false}
      countryCallingCodeEditable={false}
      defaultCountry={country}
      value={value}
      onChange={onChange}
      limitMaxLength={true}
      inputProps={{ maxLength: 11 }}
      {...props}
      flags={flags} 
      addInternationalOption={false}
/>

    );
  };
  
  export default PhoneManager;