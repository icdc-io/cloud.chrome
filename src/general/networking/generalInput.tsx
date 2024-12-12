import React from "react";
import { Form, Input, type InputProps, Label } from "semantic-ui-react";

interface GeneralInputType extends InputProps {
  placeholder: string;
  style: {
    [key: string]: string;
  };
  dnsType: string;
  label: string;
  input: {
    [key: string]: string;
  };
}

const GeneralInput = ({
  input,
  label,
  meta: { error, touched },
  readOnly,
  placeholder,
  style,
  dnsType,
}: GeneralInputType) => {
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

export default GeneralInput;
