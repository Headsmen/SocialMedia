import { TextInput, PasswordInput } from "@mantine/core";
import type { ReactNode } from "react";

export interface FormFieldConfig {
  label: string;
  placeholder: string;
  inputProps?: any;
}

export class FormFieldFactory {
  static createTextInput(config: FormFieldConfig): ReactNode {
    return (
      <TextInput
        label={config.label}
        placeholder={config.placeholder}
        {...config.inputProps}
      />
    );
  }

  static createPasswordInput(config: FormFieldConfig): ReactNode {
    return (
      <PasswordInput
        label={config.label}
        placeholder={config.placeholder}
        {...config.inputProps}
      />
    );
  }

  static createEmailInput(inputProps?: any): ReactNode {
    return this.createTextInput({
      label: "Email",
      placeholder: "your@email.com",
      inputProps,
    });
  }
}
