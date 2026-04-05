const registerControls = [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "John Doe",
    rules: { required: "Name is required" },
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "you@example.com",
    rules: {
      required: "Email is required",
    },
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "At least 6 characters",
    rules: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    },
  },
];

export default registerControls;
