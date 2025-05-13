import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import flags from 'react-phone-number-input/flags';
import fr from 'react-phone-number-input/locale/fr';

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
      labels={fr} // Utilisation des libellés en français
      flags={flags}
      addInternationalOption={false}
      smartCaret={true}
      autoFormat={true}
      limitMaxLength={true}
      {...props}
    />
  );
};

export default PhoneManager;