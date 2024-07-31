import React from "react";
import { Form, Label, Input } from "semantic-ui-react";
import PropTypes from "prop-types";

const GeneralInput = ({
  input,
  label,
  meta: { error, touched },
  readOnly,
  placeholder,
  style,
  dnsType,
}) => {
  const isNsField = dnsType === "NS";
  return (
    <Form.Field
      error={touched && error ? true : false}
      disabled={readOnly}
      // style={{ marginTop: 20, opacity: 1 }}
    >
      <label style={isNsField ? { opacity: 1 } : {}}>{label}</label>
      <Input
        disabled={readOnly}
        {...input}
        placeholder={placeholder}
        value={isNsField ? "ns.dns" : input.value}
        style={style}
      />
      {touched && error && (
        <div>
          <Label pointing color="red" prompt>
            {error}
          </Label>
        </div>
      )}
    </Form.Field>
  );
};

GeneralInput.propTypes = {
  input: PropTypes.any,
  label: PropTypes.any,
  meta: PropTypes.any,
  readOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  fieldValue: PropTypes.string,
  style: PropTypes.any,
  dnsType: PropTypes.string,
};

export default GeneralInput;
