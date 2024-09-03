import PropTypes from "prop-types";
import React from "react";
import { Form, Input, Label } from "semantic-ui-react";

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
      error={!!(touched && error)}
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
