import React, { forwardRef } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function InputController(props, ref) {
  const {
    name = "",
    control = {},
    defaultValue = "",
    rules = {},
    errors = {},
    label = "",
    ...rest
  } = props || {};

  const errorMessage = errors[name]?.message;

  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            ref={ref}
            id={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            aria-invalid={!!errorMessage}
            {...rest}
          />
        )}
      />
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}

export default forwardRef(InputController);
