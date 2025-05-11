import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PhoneManager = ({
    value,
    onChange,
    country = "FR",
    ...props
  }) => {
    return (
      <PhoneInput
        international={false} // Format national
        countryCallingCodeEditable={false}
        defaultCountry={country}
        value={value}
        onChange={onChange}
        {...props}
      />
    );
  };
  
  export default PhoneManager;