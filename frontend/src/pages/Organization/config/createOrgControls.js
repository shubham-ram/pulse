const createOrgControls = [
  {
    name: "orgName",
    type: "text",
    label: "Name",
    placeholder: "My Organization",
    rules: { required: "Organization name is required" },
  },
  {
    name: "orgDescription",
    type: "text",
    label: "Description",
    placeholder: "What does your team do?",
  },
];

export default createOrgControls;
